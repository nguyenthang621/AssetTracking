import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import trackerAPI from 'src/apis/tracker.api'
import Button from 'src/components/Button'
import { AppContext } from 'src/Context/app.context'
import { Tracker } from 'src/types/tracker.type'

interface dataTracker {
  trackerId: string
  nameTracker?: string
  dateAndTime?: string
  status?: string
  locationPosition?: string
  resolvedOn?: string
  resolvedBy?: string
}

const dataTracker: dataTracker[] = [
  {
    trackerId: 'A001',
    nameTracker: 'Tracker1',
    dateAndTime: '2024-08-01 14:30',
    status: 'Resolved',
    locationPosition: 'Warehouse 3',
    resolvedOn: '2024-08-01 15:00',
    resolvedBy: 'Đặng Nguyễn'
  },
  {
    trackerId: 'A002',
    nameTracker: 'Tracker1',
    dateAndTime: '2024-08-01 14:30',
    status: 'Resolved',
    locationPosition: 'Warehouse 3',
    resolvedOn: '2024-08-01 15:00',
    resolvedBy: 'Đặng Nguyễn'
  }
]
var dataTrackers: Tracker[] = []
export default function CardTableManageTracker() {
  let color = 'light'

  const {
    setIsShowModalTracker,
    setCurrentTrackerPick,
    currentTrackerPick,
    isShowModalTracker,
    setActionTracker,
    currentTrackerMonitor,
    setCurrentTrackerMonitor
  } = useContext(AppContext)

  const { data: responseDataTrackers } = useQuery({
    queryKey: ['get-trackers'],
    queryFn: () => trackerAPI.getAllTracker()
  })

  if (responseDataTrackers?.data.data) {
    if (responseDataTrackers.data.data.length > 0) {
      dataTrackers = responseDataTrackers.data.data
    }
  }

  const handleClickAddTracker = () => {
    setCurrentTrackerPick(null)
    setActionTracker('ADD')
    setIsShowModalTracker(true)
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
              <h2 className='text-xl font-semibold text-black'>Manage Tracker</h2>
            </div>
            <Button
              className='font-font-medium bg-xanh rounded px-4 py-2 uppercase text-white hover:shadow'
              isLoading={false}
              disabled={false}
              onClick={handleClickAddTracker}
            >
              Insert Tracker
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
                  TrackerID
                </th>

                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Name Tracker
                </th>

                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Status
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Type
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
                  DataSet
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
              {dataTrackers &&
                dataTrackers.length > 0 &&
                dataTrackers.map((tracker) => {
                  let percent = Math.floor(Math.random() * 80) + 10
                  return (
                    <tr
                      className='justify-center border border-b text-center hover:bg-gray-100'
                      key={tracker.trackerId}
                      // onClick={() => handleClickTracker(tracker)}
                    >
                      <th className='flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs'>
                        <input
                          id={'id-' + tracker.trackerId}
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
                        ></input>
                      </th>
                      <td className='max-w-[600px] cursor-pointer border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        {tracker.trackerId || ''}
                      </td>
                      <td className='bg-success text-success inline-flex whitespace-nowrap rounded-full border-l-0 border-r-0 border-t-0 bg-opacity-10 p-4 px-3 px-6 py-1 align-middle text-sm text-xs font-medium'>
                        <div
                          className={classNames('flex h-full items-center rounded-full px-3 py-2 font-bold', {
                            // 'bg-success text-success' : tracker.nameTracker === 'Motion Detected',
                            'bg-red-100 text-red-600':
                              tracker.nameTracker == 'Restricted Zone' || tracker.nameTracker == 'Power Failure',
                            'bg-amber-100 text-amber-600': tracker.nameTracker == 'Motion Detected'
                          })}
                        >
                          {tracker.nameTracker || ''}
                        </div>
                      </td>
                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 align-middle text-xs'>
                        {/* <div className='flex items-center'>{tracker.status || ''}</div> */}
                        <div className='flex items-center'>
                          <div className='w-full'>
                            <div className='w-48'>
                              <div className='relative my-1 flex w-1/2 rounded border-2 border-gray-400 shadow'>
                                <div className='absolute z-10 ml-24 mt-2 flex h-6 rounded-r border-r-8 border-gray-400'></div>
                                <div
                                  className='m-1 flex cursor-default items-center justify-center bg-yellow-400 py-4 text-center text-xs font-bold leading-none text-white'
                                  style={{ width: percent + '%' }}
                                >
                                  <div className='absolute left-0 mx-8 text-gray-700'>{percent}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=''>
                            <div className='text-yellow-400'>45C</div>
                            <svg
                              fill='#fde047'
                              height='24px'
                              width='24px'
                              version='1.1'
                              id='Layer_1'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 471.1 471.1'
                            >
                              <g transform='translate(0 -540.36)'>
                                <g>
                                  <g>
                                    <polygon points='235.825,1011.46 235.825,1011.46 235.825,1011.46 			' />
                                    <path
                                      d='M295.725,846.16v-249.8c0-30.9-26.8-56-59.9-56c-33.6,0-60.9,25.1-60.9,56v249.8c-14.9,11.2-25.9,26-32.1,43
          c-6.9,19.1-7,39.2-0.3,58.3c6.3,18.7,18.5,34.7,35.5,46.3c16.9,11.6,36.9,17.7,57.8,17.7c42.3,0,80.7-26.3,93.3-64.2
          C341.225,910.16,327.825,870.26,295.725,846.16z M310.325,941.16c-9.9,29.7-40.5,50.4-74.4,50.4c-33.9,0-64.5-20.7-74.4-50.4
          c-0.1-0.1-0.1-0.1-0.1-0.2c-10.6-29.9,1.1-62.5,29.1-81.2c2.7-1.8,4.4-5,4.4-8.3v-255c0-19.9,18.4-36,40.9-36v0
          c21.6,0,39.9,16.5,40.1,36.1v255c0,3.3,1.6,6.4,4.4,8.3C308.025,878.46,320.125,911.16,310.325,941.16z'
                                    />
                                    <path
                                      d='M245.525,874.36v-277.1c0-5.5-4.5-10-10-10s-10,4.5-10,10v277.1c-21.4,4.6-37.5,23.7-37.5,46.4
          c0,26.2,21.3,47.5,47.5,47.5s47.5-21.3,47.5-47.5C283.025,898.06,266.925,878.96,245.525,874.36z M235.525,948.26
          c-15.2,0-27.5-12.3-27.5-27.5s12.3-27.5,27.5-27.5s27.5,12.3,27.5,27.5S250.725,948.26,235.525,948.26z'
                                    />
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        <div className='flex items-center'>{tracker.type || ''}</div>
                      </td>
                      <td className='inline-flex whitespace-nowrap rounded-full border-l-0 border-r-0 border-t-0 bg-opacity-10 p-4 px-3 px-6 py-1 align-middle text-xs font-medium'>
                        <div
                          className={classNames('flex items-center rounded-full px-3 py-2 font-bold', {
                            // 'bg-success text-success' : tracker.nameTracker === 'Motion Detected',
                            'bg-red-100 text-red-600':
                              tracker.nameTracker == 'Restricted Zone' || tracker.status == 'Unresolved',
                            'bg-lime-100 text-lime-600': tracker.status == 'Resolved'
                          })}
                        >
                          {tracker.zones.length || '0'}
                        </div>
                      </td>

                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        <div className='flex items-center text-blue-500'>{tracker.dataset || '0 file uploaded'}</div>
                      </td>
                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        <div className='flex items-center'>{tracker.dataset || ''}</div>
                      </td>

                      {/* <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        <Button className='bg-xanh rounded px-2 py-1 text-white'>{tracker.locationPosition || ''}</Button>
                      </td> */}
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
