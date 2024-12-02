import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import assetAPI from 'src/apis/asset.api'
import Button from 'src/components/Button'
import { AppContext } from 'src/Context/app.context'
import { Asset } from 'src/types/asset.type'
import { Zone } from 'src/types/zone.type'
import Popover from 'src/components/Popover'

interface dataAsset {
  assetId: string
  nameAsset?: string
  dateAndTime?: string
  status?: string
  locationPosition?: string
  resolvedOn?: string
  resolvedBy?: string
}

const dataAsset: dataAsset[] = [
  {
    assetId: 'A001',
    nameAsset: 'Asset1',
    dateAndTime: '2024-08-01 14:30',
    status: 'Resolved',
    locationPosition: 'Warehouse 3',
    resolvedOn: '2024-08-01 15:00',
    resolvedBy: 'Đặng Nguyễn'
  },
  {
    assetId: 'A002',
    nameAsset: 'Asset1',
    dateAndTime: '2024-08-01 14:30',
    status: 'Resolved',
    locationPosition: 'Warehouse 3',
    resolvedOn: '2024-08-01 15:00',
    resolvedBy: 'Đặng Nguyễn'
  }
]
var dataAssets: Asset[] = []
export default function CardTableManageAssets() {
  let color = 'light'

  const {
    setIsShowModalAsset,
    setCurrentAssetPick,
    currentAssetPick,
    isShowModalAsset,
    setActionAsset,
    currentAssetMonitor,
    setCurrentAssetMonitor
  } = useContext(AppContext)

  const { data: responseDataAssets } = useQuery({
    queryKey: ['get-assets'],
    queryFn: () => assetAPI.getAllAsset()
  })

  if (responseDataAssets?.data.data) {
    if (responseDataAssets.data.data.length > 0) {
      dataAssets = responseDataAssets.data.data
    }
  }

  const handleDelete = (asset: Asset) => {
    setCurrentAssetPick(asset)
    setActionAsset('DELETE')
  }

  const handleEdit = (asset: Asset) => {
    setCurrentAssetPick(asset)
    setActionAsset('EDIT')
    setIsShowModalAsset(true)
  }

  const handleClickAddAsset = () => {
    setCurrentAssetPick(null)
    setActionAsset('ADD')
    setIsShowModalAsset(true)
  }

  const handleShowAdvance = (asset: Asset) => {
    setCurrentAssetPick(asset)
    // setActionAsset('ADVANCE')
  }
  const navigate = useNavigate()
  const handleClickAsset = (asset: Asset) => {
    setCurrentAssetMonitor(asset)
    navigate(`/admin/object_tracking`)
  }

  return (
    <div>
      <div
        className={
          'relative flex w-full min-w-0 flex-col break-words rounded ' +
          (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white')
        }
      >
        <div className='mb-0 rounded-t border-0 px-4 py-5'>
          <div className='flex flex-wrap items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-black'>Manage Assets</h2>
            </div>
            <Button
              className='font-font-medium bg-xanh rounded px-4 py-2 uppercase text-white hover:shadow'
              isLoading={false}
              disabled={false}
              onClick={handleClickAddAsset}
            >
              Insert Asset
            </Button>
          </div>
        </div>
        <div className='block h-[65vh] w-full overflow-x-auto'>
          <table className='w-full border-collapse items-center bg-transparent'>
            <thead className='shadowTop sticky top-0'>
              <tr>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  <input
                    id='link-checkbox'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
                  ></input>
                </th>

                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Name Asset
                </th>

                {/* <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Status
                </th> */}

                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Trackers
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Zones
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Destination
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Expired Arrival Date
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Image
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='pt-2'>
              {dataAssets &&
                dataAssets.length > 0 &&
                dataAssets.map((asset) => {
                  var totalzoneOfTracker: Zone[] = []

                  asset.trackers.forEach((a) => {
                    totalzoneOfTracker = [...totalzoneOfTracker, ...a.zones]
                  })

                  totalzoneOfTracker = totalzoneOfTracker.filter(
                    (item, index, self) => index === self.findIndex((t) => t.zoneId === item.zoneId)
                  )

                  return (
                    <tr className=' border border-b text-center hover:bg-gray-100' key={asset.assetId}>
                      <th className='flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs'>
                        <input
                          id={'id-' + asset.assetId}
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
                        ></input>
                      </th>
                      <td className='max-w-[600px] cursor-pointer border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        {asset.nameAsset || ''}
                      </td>

                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        <div className='flex items-center'>{asset.trackers.length || ''}</div>
                      </td>
                      <td className='inline-flex whitespace-nowrap rounded-full border-l-0 border-r-0 border-t-0 bg-opacity-10 p-4 px-3 px-6 py-1 align-middle text-xs font-medium'>
                        <div
                          className={classNames('flex items-center rounded-full px-3 py-2 font-bold', {
                            // 'bg-success text-success' : asset.nameAsset === 'Motion Detected',
                            'bg-red-100 text-red-600':
                              asset.nameAsset == 'Restricted Zone' || asset.status == 'Unresolved',
                            'bg-lime-100 text-lime-600': asset.status == 'Resolved'
                          })}
                        >
                          {totalzoneOfTracker.length || '0'}
                        </div>
                      </td>
                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        <div className='flex items-center'>{asset.destination || 'Unknown'}</div>
                      </td>
                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        <div className='flex items-center'>{asset.expiredArrivalDate || 'Unknown'}</div>
                      </td>
                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        <div className='flex items-center text-blue-600'>
                          Show Images ({asset.images.length || '0'})
                        </div>
                        {/* <div className='h-12 w-full overflow-hidden'>
                        <figure className=''>
                          <img
                            className='h-auto max-w-full rounded-lg'
                            src={asset.images[0]}
                            alt='image description'
                          ></img>
                          <figcaption className='mt-2 text-center text-sm text-gray-500 dark:text-gray-400'>
                            Image caption
                          </figcaption>
                        </figure>
                      </div> */}
                      </td>

                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        <Popover
                          offsetInput={4}
                          renderPopover={
                            <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                              <button
                                onClick={() => handleClickAsset(asset)}
                                className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'
                              >
                                History
                              </button>
                              <button className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'>
                                Edit
                              </button>
                              <button className='block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500'>
                                Delete
                              </button>
                            </div>
                          }
                        >
                          <Button className=' rounded px-2 py-1 text-blue-500 hover:bg-blue-200'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1.5}
                              stroke='currentColor'
                              className='size-6 h-6 w-6'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z'
                              />
                            </svg>
                          </Button>
                        </Popover>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
        <div className='flex justify-end p-5'>{/* <Pagination count={10} color='primary' /> */}</div>
      </div>
    </div>
  )
}
