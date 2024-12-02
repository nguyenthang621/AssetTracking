import classNames from 'classnames'
import { Asset } from 'src/types/asset.type'

interface dataAsset {
  assetId: string
  alertType?: string
  dateAndTime?: string
  status?: string
  locationPosition?: string
  resolvedOn?: string
  resolvedBy?: string
}

const dataAsset: dataAsset[] = [
  {
    assetId: 'A001',
    alertType: 'Restricted Zone',
    dateAndTime: '2024-08-01 14:30',
    status: 'Resolved',
    locationPosition: 'Warehouse 3',
    resolvedOn: '2024-08-01 15:00',
    resolvedBy: 'Đặng Nguyễn'
  }
]

interface Props {
  currentAssetMonitor: Asset | null
}

export default function CardCurrentAsset({ currentAssetMonitor }: Props) {
  let color = 'light'
  console.log('currentAssetMonitor:  ', currentAssetMonitor)

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
              <h2 className='text-xl font-semibold text-black'>
                {currentAssetMonitor?.nameAsset ? currentAssetMonitor?.nameAsset : 'Undetermined'}
              </h2>
            </div>
          </div>
        </div>
        <div className='block w-full overflow-x-auto'>
          <div className=''>
            <div className='flex w-full items-center justify-between p-4'>
              <p className='text-sm text-gray-500'>Location</p>
              <h2 className='text-sm font-bold text-gray-800'>
                {currentAssetMonitor?.location ? currentAssetMonitor?.location : 'Undetermined'}
              </h2>
            </div>
            <div className='flex w-full items-center justify-between p-4'>
              <p className='text-sm text-gray-500'>Destination</p>
              <h2 className='text-sm font-bold text-gray-800'>
                {currentAssetMonitor?.description ? currentAssetMonitor?.description : 'Undetermined'}
              </h2>
            </div>
            <div className='flex w-full items-center justify-between p-4'>
              <p className='text-sm text-gray-500'>Expired Arrival Date</p>
              <h2 className='text-sm font-bold text-gray-800'>
                {currentAssetMonitor?.expiredArrivalDate ? currentAssetMonitor?.expiredArrivalDate : 'Undetermined'}
              </h2>
            </div>
            <div className='flex w-full items-center justify-between p-4'>
              <p className='text-sm text-gray-500'>Asset status</p>
              <h2 className='text-sm font-bold text-gray-800'>
                {'In Transit'}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
