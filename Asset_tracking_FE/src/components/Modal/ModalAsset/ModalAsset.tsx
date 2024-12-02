import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ImageListType } from 'react-images-uploading'
import { toast } from 'react-toastify'
import { AppContext } from 'src/Context/app.context'
import assetAPI from 'src/apis/asset.api'
import trackerAPI from 'src/apis/tracker.api'
import zoneAPI from 'src/apis/zone.api'
import Button from 'src/components/Button'
import { CardUploadImages } from 'src/components/Cards/CardUploadImages/CardUploadImages'
import Input from 'src/components/Input'
import InputDropdown, { OptionType } from 'src/components/InputDropDown/InputDropDown'
import { storage } from 'src/firebase/configFirebase'
import { Asset, formDataAsset } from 'src/types/asset.type'
import { Tracker } from 'src/types/tracker.type'
import { Zone } from 'src/types/zone.type'
import { schemaAsset } from 'src/utils/rules'
import * as yup from 'yup'

type formData = yup.InferType<typeof schemaAsset>

var trackers: Tracker[] = []
var zones: Zone[] = []

function ModalAsset() {
  const queryClient = useQueryClient()
  // const [name, setZoneList] = useState<OptionType[] | []>([])
  const [zoneList, setZoneList] = useState<OptionType[] | []>([])
  const [trackerList, setTrackerList] = useState<OptionType[] | []>([])

  const [zoneSelected, setZoneSelected] = useState<OptionType[] | []>([])
  const [trackerSelected, setTrackerSelected] = useState<OptionType[] | []>([])
  const [actionAsset, setActionAsset] = useState<'EDIT' | 'CREATE'>('CREATE')

  const [images, setImages] = React.useState<ImageListType>([])
  const [uploading, setUploading] = React.useState(false)
  const [valueDate, setValueDate] = useState<string | null>(null)
  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    // data for submit
    setImages(imageList)
  }

  var { data: responseDataZones } = useQuery({
    queryKey: ['get-zone'],
    queryFn: () => zoneAPI.getAllZone()
  })
  var { data: responseDataTracker } = useQuery({
    queryKey: ['get-Assets'],
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
    if (responseDataTracker?.data.data) {
      if (responseDataTracker.data.data.length > 0) {
        trackers = responseDataTracker.data.data
        setTrackerList(
          trackers.map((tracker) => {
            return { value: tracker.trackerId, label: tracker.nameTracker }
          })
        )
      }
    }
  }, [responseDataZones, responseDataTracker])

  const { isShowModalAsset, setIsShowModalAsset, currentAssetPick } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(schemaAsset)
  })

  const insertAssetMutation = useMutation({
    mutationFn: (body: formDataAsset) => assetAPI.insertAsset(body)
  })
  const editAssetMutation = useMutation({
    mutationFn: (body: formDataAsset) => assetAPI.editAsset(body)
  })

  const onSubmit = handleSubmit(async (body) => {
    insertAssetMutation.isLoading = true
    let images = await handleUploadAll()
    let bodyAseet: formDataAsset = {
      nameAsset: body.nameAsset,
      description: body.description,
      destination: body.destination,
      expiredArrivalDate: valueDate,
      location: [],
      images: images,
      resolvedOn: 0,
      resolvedBy: '',
      locationPosition: '',
      status: 'ACTIVE',
      zones:
        zoneSelected.length > 0
          ? zoneSelected.map((zone) => {
              return { zoneId: zone.value }
            })
          : [],
      trackers:
        trackerSelected.length > 0
          ? trackerSelected.map((tracker) => {
              return { trackerId: tracker.value }
            })
          : []
    }
    console.log('bodyAseet: ', bodyAseet)

    // body.user_id = profile.id as string
    if (actionAsset === 'CREATE') {
      insertAssetMutation.mutate(bodyAseet as formDataAsset, {
        onSuccess(data) {
          toast.info('Create new asset done')
          queryClient.invalidateQueries(['get-assets'])
          setZoneSelected([])
          setTrackerSelected([])
          setImages([])
          console.log('data success: ', data)
          reset()
          setIsShowModalAsset(false)
          setActionAsset('CREATE')
        },
        onError(error) {
          console.log('error: ', error)
        }
      })
    }
    // } else if (actionAsset === 'EDIT') {
    //   body.asset_id = currentAssetPick?.id
    //   editAssetMutation.mutate(body as formDataAsset, {
    //     onSuccess(data) {
    //       toast.info(data.data.data.message)
    //       reset()
    //       setIsShowModalAsset(false)
    //       setActionAsset(null)
    //     },
    //     onError(error) {
    //       if (isEntityError<ErrorResponseApi>(error)) {
    //         const errorForm = error.response?.data
    //         if (errorForm && errorForm.form) {
    //           let form = errorForm.form
    //           setError(form as any, {
    //             message: errorForm.message.split('&')[1],
    //             type: 'Server'
    //           })
    //         }
    //       }
    //     }
    //   })
    // }
  })

  useEffect(() => {
    // if (currentAssetPick && actionAsset === 'EDIT') {
    //   setValue('ip_address', currentAssetPick.ip_address as string)
    //   setValue('name', currentAssetPick.name as string)
    //   setValue('location', currentAssetPick.location as string)
    // }
  }, [currentAssetPick])

  const handleCloseModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsShowModalAsset(false)
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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueDate(e.target.value)
  }

  return (
    <div
      className={classNames(
        'absolute bottom-0 left-0 right-0 top-0 z-50 h-[100vh] w-full overflow-y-auto overflow-x-hidden bg-gray-800/50 p-4 md:inset-0',
        {
          hidden: !isShowModalAsset
        }
      )}
    >
      <div className='max-w-2xln absolute left-1/2 top-1/2 max-h-full -translate-x-1/2 -translate-y-1/2 transform'>
        {/* <modal content /> */}
        <div className='relative rounded-lg bg-white shadow dark:bg-gray-700 '>
          {/* <TableDropdown /> */}
          <div className='flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>New Asset</h3>
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
              <div className='mb-6 w-full px-3 md:mb-0 md:w-full'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-city'
                >
                  Name Asset (*)
                </label>
                <Input
                  name='nameAsset'
                  placeholder='Container z1000'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  // errorMessage={errors.ip_address?.message}
                ></Input>
              </div>

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
              </div>
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
              <div className='mb-6 mt-4 w-full px-3 md:mb-0 md:w-1/2'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-city'
                >
                  Destination
                </label>
                <Input
                  name='destination'
                  placeholder='CT4, Vimeco, Trung Hoa, Cau Giay, HN'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  // errorMessage={errors.name?.message}
                ></Input>
              </div>
              <div className='mb-6 mt-4 w-full px-3 md:mb-0 md:w-1/2'>
                <label
                  className='mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700'
                  htmlFor='grid-city'
                >
                  Expired Arrival Date
                </label>
                {/* <Input
                  name='expiredArrivalDate'
                  placeholder='c'
                  classNameNew='block w-full appearance-none rounded border border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none'
                  register={register}
                  type='text'
                  // errorMessage={errors.name?.message}
                ></Input> */}

                <div className='relative max-w-sm'>
                  <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2'>
                    <svg
                      className='h-4 w-4 text-gray-500 dark:text-gray-400'
                      aria-hidden='true'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z' />
                    </svg>
                  </div>
                  <input
                    type='date'
                    // value={valueDate}
                    onChange={handleTimeChange}
                    className='block w-full rounded border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 '
                    placeholder='Select date'
                  ></input>
                </div>
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
                isLoading={insertAssetMutation.isLoading}
                disabled={insertAssetMutation.isLoading}
                // onClick={handleInstertAsset}
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

export default ModalAsset
