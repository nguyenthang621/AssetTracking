import CardStats from 'src/components/Cards/CardStats'
import { useContext } from 'react'
import { AppContext } from 'src/Context/app.context'
import { path } from 'src/constants/paths'
import classNames from 'classnames'
interface Props {
  currentPath: string
}

export default function HeaderStats({ currentPath }: Props) {
  const handleShowCardStat = (currentPath: string) => {
    if (currentPath.indexOf(path.controls) !== -1) return true
    return false
  }

  const { fps, pump } = useContext(AppContext)
  let statePump = pump === '1'
  return (
    <>
      {/* Header */}
      <div
        className={classNames('relative z-0 bg-gray-100 pb-12 pt-12 md:pt-12', {
          hidden: !handleShowCardStat(currentPath)
        })}
      >
        <div className='mx-auto w-full px-4 '>
          <div>
            {/* Card stats */}
            {handleShowCardStat(currentPath) && (
              <div className='flex flex-wrap'>
                <div className='w-full px-4 lg:w-6/12 xl:w-1/5'>
                  <CardStats
                    statSubtitle='Total follower'
                    // statTitle={fps.toString()}
                    statTitle={'987'}
                    statPercent='3.48'
                    statPercentColor='text-emerald-500'
                    statDescription='Total number of trackers'
                    statIcon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='h-5 w-5'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z'
                        />
                      </svg>
                    }
                    statIconColor='bg-lightBlue-500'
                  />
                </div>
                <div className='w-full px-4 lg:w-6/12 xl:w-1/5'>
                  <CardStats
                    statSubtitle='In transit'
                    statTitle='17'
                    statPercent='12'
                    statPercentColor='text-emerald-500'
                    statDescription='On the way to pick up point'
                    statIcon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-5 w-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'
                        />
                      </svg>
                    }
                    statIconColor='bg-red-500'
                  />
                </div>
                <div className='w-full px-4 lg:w-6/12 xl:w-1/5'>
                  <CardStats
                    statSubtitle='At destination'
                    statTitle='870'
                    statPercent='3.48'
                    statPercentColor='text-red-500'
                    statDescription='Arrived at the appointed place'
                    statIcon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-5 w-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z'
                        />
                      </svg>
                    }
                    statIconColor='bg-orange-500'
                  />
                </div>
                <div className='w-full px-4 lg:w-6/12 xl:w-1/5'>
                  <CardStats
                    statSubtitle='Average Dwell Time'
                    statTitle={statePump ? '7' : '3'}
                    statPercent='1.10'
                    statPercentColor='text-orange-500'
                    statDescription='Average time at a location (days)'
                    statIcon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-5 w-5'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z'
                        />
                      </svg>
                    }
                    statIconColor='bg-pink-500'
                  />
                </div>
                <div className='w-full px-4 lg:w-6/12 xl:w-1/5'>
                  <CardStats
                    statSubtitle='Average Turn Time'
                    statTitle={statePump ? '24' : '12'}
                    statPercent='1.10'
                    statPercentColor='text-orange-500'
                    statDescription='Average a shipping cycle (days)'
                    statIcon={
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-5 w-5'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                      </svg>
                    }
                    statIconColor='bg-pink-500'
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
