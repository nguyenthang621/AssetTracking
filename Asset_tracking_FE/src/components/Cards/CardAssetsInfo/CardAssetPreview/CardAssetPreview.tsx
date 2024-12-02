import classNames from 'classnames'
import Draggable from 'react-draggable'
import { Asset } from 'src/types/asset.type'

interface Props {
  currentAssetMonitor: Asset | null
}
export default function CardAssetPreview({ currentAssetMonitor }: Props) {
  let color = 'light'

  return (
    <Draggable handle='.handle' bounds='parent' defaultPosition={{ x: 100, y: 100 }}>
      {/* <Draggable handle='.handle' bounds='parent' defaultPosition={{ x: window.innerWidth - 600, y: 100 }}> */}
      <div className='absolute mx-auto mt-11 hidden w-80 transform overflow-hidden rounded-lg border-[1px] bg-white shadow-lg hover:scale-105 hover:shadow-lg dark:bg-slate-800'>
        <div className='handle w-full bg-white'>
          <div className='flex items-center justify-start px-4 py-2'>
            <div className='mr-2 rounded-full bg-lightBlue-200 p-1'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6 h-5 w-5 text-lightBlue-600'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9'
                />
              </svg>
            </div>
            <h2 className='font-bold'>
              {currentAssetMonitor?.assetId ? currentAssetMonitor?.assetId : 'Undetermined'}
            </h2>
          </div>
          <div className='flex items-center justify-between bg-[#F1ECEC] px-4 py-1'>
            <span className='text-gray-500'>Asset Name</span>
            <span className='font-bold'>
              {currentAssetMonitor?.nameAsset ? currentAssetMonitor?.nameAsset : 'Undetermined'}
            </span>
          </div>
        </div>
        <img
          className='h-48 w-full object-cover object-center'
          src={currentAssetMonitor?.images[0] ? currentAssetMonitor?.images[0] : 'Undetermined'}
          alt='Product Image'
        />
        <div className='flex items-center justify-between bg-[#F1ECEC] px-4 py-1'>
          <span className='text-gray-500'>Zone</span>
          <span className='font-bold'>Zone13</span>
        </div>
        <div className='flex items-center justify-between bg-white px-4 py-1'>
          <span className='text-gray-500'>Location</span>
          <span className='font-bold'>
            {currentAssetMonitor?.location ? currentAssetMonitor?.location : 'Undetermined'}
          </span>
        </div>
        <div className='px-4 py-1'>
          <p className='mb-2 text-base text-lightBlue-500'>Detail</p>
        </div>
      </div>
    </Draggable>
  )
}
