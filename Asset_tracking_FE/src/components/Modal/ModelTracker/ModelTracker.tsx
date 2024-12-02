import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageListType } from 'react-images-uploading'
import { toast } from 'react-toastify'
import { AppContext } from 'src/Context/app.context'
import trackerAPI from 'src/apis/tracker.api'
import zoneAPI from 'src/apis/zone.api'
import Button from 'src/components/Button'
import { CardUploadImages } from 'src/components/Cards/CardUploadImages/CardUploadImages'
import Input from 'src/components/Input'
import InputDropdown, { OptionType } from 'src/components/InputDropDown/InputDropDown'
import { storage } from 'src/firebase/configFirebase'
import { Asset } from 'src/types/asset.type'
import { Tracker, formDataTracker } from 'src/types/tracker.type'
import { Zone } from 'src/types/zone.type'
import { schemaTracker } from 'src/utils/rules'
import * as yup from 'yup'

type formData = yup.InferType<typeof schemaTracker>

// var trackers: Asset[] = []
var zones: Zone[] = []

function ModalTracker() {
  // const [name, setZoneList] = useState<OptionType[] | []>([])
  const [zoneList, setZoneList] = useState<OptionType[] | []>([])
  const [trackerList, setTrackerList] = useState<OptionType[] | []>([])

  const [zoneSelected, setZoneSelected] = useState<OptionType[] | []>([])
  const [trackerSelected, setTrackerSelected] = useState<OptionType[] | []>([])
  const [actionTracker, setActionTracker] = useState<'EDIT' | 'CREATE'>('CREATE')

  const [images, setImages] = React.useState<ImageListType>([])
  const [uploading, setUploading] = React.useState(false)

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    // data for submit
    setImages(imageList)
  }

  var { data: responseDataZones } = useQuery({
    queryKey: ['get-zone'],
    queryFn: () => zoneAPI.getAllZone()
  })
  var { data: responseDataTracker } = useQuery({
    queryKey: ['get-Trackers'],
    queryFn: () => trackerAPI.getAllTracker()
  })

  useEffect(() => {
    if (responseDataZones?.data.data) {
      if (responseDataZones.data.data.length > 0) {
        zones = responseDataZones.data.data
        setZoneList(
          zones.map((zone) => {
            return { value: zone.zoneId, label: zone.nameZone }
          })
        )
      }
    }
    // if (responseDataTracker?.data.data) {
    //   if (responseDataTracker.data.data.length > 0) {
    //     trackers = responseDataTracker.data.data
    //     setTrackerList(
    //       trackers.map((tracker) => {
    //         return { value: tracker.trackerId, label: tracker.nameTracker }
    //       })
    //     )
    //   }
    // }
  }, [responseDataZones, responseDataTracker])

  const { isShowModalTracker, setIsShowModalTracker, currentTrackerPick } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(schemaTracker)
  })

  const insertTrackerMutation = useMutation({
    mutationFn: (body: formDataTracker) => trackerAPI.insertTracker(body)
  })
  const editTrackerMutation = useMutation({
    mutationFn: (body: formDataTracker) => trackerAPI.editTracker(body)
  })

  const queryClient = useQueryClient()

  const onSubmit = handleSubmit(async (body) => {
    insertTrackerMutation.isLoading = true
    // let images = await handleUploadAll()
    let bodyAseet: formDataTracker = {
      trackerId: body.trackerId,
      nameTracker: body.nameTracker,
      description: body.description,
      type: body.type,
      dataset: body.dataset,
      status: 'ACTIVE',
      zones:
        zoneSelected.length > 0
          ? zoneSelected.map((zone) => {
              return { zoneId: zone.value }
            })
          : [],
      assets: []
      // trackerSelected.length > 0
      //   ? trackerSelected.map((tracker) => {
      //       return { assetId: tracker.value }
      //     })
      //   : []
    }
    console.log('bodyAseet: ', bodyAseet)

    // body.user_id = profile.id as string
    if (actionTracker === 'CREATE') {
      insertTrackerMutation.mutate(bodyAseet as formDataTracker, {
        onSuccess(data) {
          toast.info('Create new tracker done')
          queryClient.invalidateQueries(['get-trackers'])
          setZoneSelected([])
          setTrackerSelected([])
          setImages([])
          console.log('data success: ', data)
          reset()
          setIsShowModalTracker(false)
          setActionTracker('CREATE')
        },
        onError(error) {
          console.log('error: ', error)
        }
      })
    }
  })

  useEffect(() => {}, [currentTrackerPick])

  const handleCloseModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsShowModalTracker(false)
    reset()
  }

  const uploadImageToFirebase = async (file: File) => {
    setUploading(true)
    const storageRef = ref(storage, `images/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress (optional)
        },
        (error) => {
          setUploading(false)
          reject(error)
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          setUploading(false)
          resolve(downloadURL)
        }
      )
    })
  }

  const handleUploadAll = async () => {
    const uploadPromises = images.map(async (image) => await uploadImageToFirebase(image.file as File))

    try {
      const urls = await Promise.all(uploadPromises)
      console.log('Uploaded URLs:', urls)
      if (urls.length > 0) {
        return urls
      }
      return []
    } catch (error) {
      console.error('Error uploading images:', error)
      return []
    }
  }

  return (
    <div
      className={classNames(
        'absolute bottom-0 left-0 right-0 top-0 z-50 h-[100vh] w-full overflow-y-auto overflow-x-hidden bg-gray-800/50 p-4 md:inset-0',
        {
          hidden: !isShowModalTracker
        }
      )}
    >
      <div className='max-w-2xln absolute left-1/2 top-1/2 max-h-full -translate-x-1/2 -translate-y-1/2 transform'>
        {/* <modal content /> */}
        <div className='relative rounded-lg bg-white shadow dark:bg-gray-700 '>
          {/* <TableDropdown /> */}
          <div className='flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>New Tracker</h3>
            <button
              type='button'
              className='ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white'
              data-modal-hide='defaultModal'
              onClick={handleCloseModal}
            >
              <svg
                aria-hidden='true'
                className='h-5 w-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                ></path>
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          {/* modal body> */}
          <form onSubmit={onSubmit}>
            <div className='-mx-3 flex flex-wrap p-6'>
              <div className='mb-6 w-full px-3 md:mb-0 md:w-1/2'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-city'
                >
                  TrackerID (*)
                </label>
                <Input
                  name='trackerId'
                  placeholder='T001'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  // errorMessage={errors.ip_address?.message}
                ></Input>
              </div>
              <div className='mb-6 w-full px-3 md:mb-0 md:w-1/2'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-city'
                >
                  Name Tracker (*)
                </label>
                <Input
                  name='nameTracker'
                  placeholder='Tracker01'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  // errorMessage={errors.ip_address?.message}
                ></Input>
              </div>
              <div className='mb-6 w-full px-3 md:mb-0 md:w-1/2'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-city'
                >
                  Type
                </label>
                <Input
                  name='type'
                  placeholder='GPS'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  // errorMessage={errors.ip_address?.message}
                ></Input>
              </div>
              {/* 
              <div className='mb-6 w-full px-3 md:mb-0 md:w-1/2'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-zip'
                >
                  Trackers
                </label>

                <InputDropdown
                  setSelect={setTrackerSelected}
                  options={trackerList}
                  // checkDisable={(nameAccount && nameAccount?.length > 0) ?? false}
                  currenValue={trackerSelected}
                  isMulti={true}
                />
              </div> */}
              <div className='mb-6 w-full px-3 md:mb-0 md:w-1/2'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-zip'
                >
                  Zones
                </label>
                <InputDropdown
                  setSelect={setZoneSelected}
                  options={zoneList}
                  // checkDisable={(nameAccount && nameAccount?.length > 0) ?? false}
                  currenValue={zoneSelected}
                  isMulti={true}
                />
              </div>
              <div className='mb-6 mt-4 w-full px-3 md:mb-0 md:w-full'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-city'
                >
                  Description
                </label>
                <Input
                  name='name'
                  placeholder='Include...'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  // errorMessage={errors.name?.message}
                ></Input>
              </div>

              <div className=' w-full px-4'>
                <CardUploadImages
                  handleUploadAll={handleUploadAll}
                  images={images}
                  onChange={onChange}
                  uploading={uploading}
                />
              </div>
            </div>
            {/* modal footer*/}
            <div className='flex items-center justify-end space-x-2 rounded-b border-t border-gray-200 p-6 dark:border-gray-600'>
              <Button
                isLoading={insertTrackerMutation.isLoading}
                disabled={insertTrackerMutation.isLoading}
                // onClick={handleInstertTracker}
                className='rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                Save
              </Button>
              <Button
                className='rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600'
                onClick={(e) => handleCloseModal(e)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ModalTracker
