import { useContext } from 'react'
import CardAssetPreview from 'src/components/Cards/CardAssetsInfo/CardAssetPreview'
import CardCurrentAsset from 'src/components/Cards/CardAssetsInfo/CardCurrentAsset'
import CardHeaderDashboard from 'src/components/Cards/CardHeaderDashboard'
import CardLocation2 from 'src/components/Cards/CardLocation/CardLocation2'
import CardCurretAssetInfo from 'src/components/Cards/CardTable/CardCurretAssetInfo'
import { AppContext } from 'src/Context/app.context'

function Tracker() {
  const { socket, currentAssetMonitor } = useContext(AppContext)

  return (
    <div className='relative flex flex-wrap'>
      <div className='flex w-full border-b-2 border-gray-300 bg-white p-4'>
        <div className='block text-sm'>
          <span className='inline items-center justify-center rounded bg-lightBlue-200 px-2 py-1 font-bold text-lightBlue-600'>
            Overview
          </span>
          <span className='ml-4 inline items-center justify-center rounded p-2  px-2 py-1 text-gray-400'>Tracker</span>
        </div>
      </div>
      <CardHeaderDashboard />{' '}
      <div className='mt-8 flex h-[70vh] w-full flex-wrap overflow-hidden rounded'>
        <div className='w-full rounded xl:w-6/12'>
          <div className='w-full rounded pl-4 pr-1 shadow'>
            {<CardCurrentAsset currentAssetMonitor={currentAssetMonitor} />}
          </div>
          <div className='mt-2  w-full rounded pl-4  pr-1 shadow'>
            {<CardCurretAssetInfo currentAssetMonitor={currentAssetMonitor} />}
          </div>
        </div>
        <div className='w-full rounded shadow xl:w-6/12'>
          <div className='w-full rounded pl-1 pr-4'>
            {socket && <CardLocation2 socket={socket} currentAssetMonitor={currentAssetMonitor} />}
          </div>
        </div>
      </div>
      <CardAssetPreview currentAssetMonitor={currentAssetMonitor} />
    </div>
  )
}

export default Tracker
