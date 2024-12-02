import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { path } from 'src/constants/paths'
import { AppContext } from 'src/Context/app.context'

const CardHeaderDashboard: React.FC = () => {
  const { currentAssetMonitor } = useContext(AppContext)
  const [nameAsset, setNameAsset] = useState<String | null>(null)
  useEffect(() => {
    if (currentAssetMonitor?.nameAsset) {
      setNameAsset(currentAssetMonitor?.nameAsset)
    }
  }, [currentAssetMonitor])
  console.log('currentAssetMonitor: ', currentAssetMonitor)
  return (
    <div className='flex w-full items-center justify-between border-b-2 border-gray-300 bg-white p-6'>
      <div className='flex w-1/6 items-center justify-between'>
        <div className='flex items-center justify-center'>
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
          <h2 className='font-bold'>{nameAsset}</h2>
        </div>
        <div className='flex '>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2.5'
            stroke='currentColor'
            className='size-6 mr-4 h-5 w-5 font-bold'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244'
            />
          </svg>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2.5'
            stroke='currentColor'
            className='size-6 h-5 w-5 font-bold'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z'
            />
          </svg>
        </div>
      </div>

      <button className='relative inline-flex items-center justify-center rounded border-2 border-gray-300 bg-gray-100 px-4 py-2 text-gray-800 hover:bg-gray-400'>
        <span>Overview</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={2.5}
          stroke='currentColor'
          className='size-6 ml-2 h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
        </svg>
        <div
          id='dropdown'
          className='absolute top-10 z-10 divide-y divide-gray-100 rounded-lg border-2 border-gray-100 bg-white  shadow dark:bg-gray-700'
        >
          <ul className='text-sm text-gray-700 dark:text-gray-200' aria-labelledby='dropdownDefaultButton'>
            <Link to={path.manage_assets}>
              <span className='block px-8 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                Manager
              </span>
            </Link>
            <Link to={path.controls}>
              <span className='block px-8 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                Overviews
              </span>
            </Link>
          </ul>
        </div>
      </button>
    </div>
  )
}

export default CardHeaderDashboard
