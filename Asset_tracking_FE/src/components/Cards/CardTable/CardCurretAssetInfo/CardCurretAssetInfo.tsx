import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import coordinatesAPI from 'src/apis/coordinates.api'
import zoneAPI from 'src/apis/zone.api'
import { Asset } from 'src/types/asset.type'
import { HistoryTrackerElement } from 'src/types/coordinates.type'
import { Zone } from 'src/types/zone.type'
import { convertNameZone, timeDifferenceToDate, timestampToDate } from 'src/utils/utils'

interface LocationHistory {
  Location: string
  Zone?: string
  Entered: string
  Exit?: string
  DwellTime?: string
}

const locationHistory: LocationHistory[] = [
  {
    Location: 'Warehouse 3',
    Zone: 'Loading Dock',
    Entered: '2024-08-28T08:30:00Z',
    Exit: '2024-08-28T08:45:00Z',
    DwellTime: '15 minutes'
  },
  {
    Location: 'Main Entrance',
    Entered: '2024-08-28T09:00:00Z',
    Exit: '2024-08-28T09:05:00Z',
    DwellTime: '5 minutes'
  },
  {
    Location: 'Server Room',
    Entered: '2024-08-28T10:00:00Z'
  },
  {
    Location: 'Production Floor',
    Zone: 'Assembly Line 2',
    Entered: '2024-08-28T11:15:00Z',
    Exit: '2024-08-28T11:45:00Z',
    DwellTime: '30 minutes'
  },
  {
    Location: 'Parking Lot',
    Entered: '2024-08-28T12:00:00Z',
    Exit: '2024-08-28T12:10:00Z',
    DwellTime: '10 minutes'
  }
]

interface Props {
  currentAssetMonitor: Asset | null
}
var historyTrackerElement: HistoryTrackerElement[] = []
var zones: Zone[] = []

export default function CardCurretAssetInfo({ currentAssetMonitor }: Props) {
  let color = 'light'

  if (currentAssetMonitor && currentAssetMonitor?.trackers) {
    if (currentAssetMonitor?.trackers.length > 0) {
      const curentTracker = currentAssetMonitor.trackers[0].trackerId
      console.log('curentTracker::: ', curentTracker)
      if (curentTracker) {
        const { data: responseDataLocationHistory } = useQuery({
          queryKey: ['get-location-history'],
          queryFn: () => coordinatesAPI.getLocationHistoryByTrackerId(curentTracker)
        })
        if (responseDataLocationHistory?.data.data) {
          if (Object.entries(responseDataLocationHistory.data.data).length > 0) {
            historyTrackerElement = responseDataLocationHistory.data.data
            console.log('historyTrackerElement : ', Object.entries(historyTrackerElement))
          }
        }

        var { data: responseDataZone, refetch } = useQuery({
          queryKey: ['get-zones'],
          queryFn: () => zoneAPI.getAllZone()
        })
        if (responseDataZone?.data.data) {
          if (responseDataZone.data.data.length > 0) {
            zones = responseDataZone.data.data
          }
        }
      }
    }
  } else {
    return
  }

  return (
    <div>
      <div
        className={
          'relative flex  w-full min-w-0 flex-col break-words rounded bg-white ' +
          (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white')
        }
      >
        <div className='mb-0 rounded-t border-0 px-4 py-5'>
          <div className='flex flex-wrap items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-black'>Location History</h2>
            </div>
          </div>
        </div>
        <div className='block max-h-[40vh] w-full overflow-x-auto'>
          <table className='w-full border-collapse items-center bg-transparent'>
            <thead className='shadowTop sticky top-0'>
              <tr>
                <th
                  className={
                    'max-w-[300px] whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Location
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Zone
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Entered
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Exit
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Dwell Time
                </th>
              </tr>
            </thead>
            <tbody className='overflow-scroll py-2'>
              {Object.entries(historyTrackerElement) &&
                Object.entries(historyTrackerElement).length > 0 &&
                Object.entries(historyTrackerElement).map((history: any) => {
                  const zoneenterded: Zone[] = convertNameZone(history[1][0].zoneEntered, zones)
                  return (
                    <tr className='border border-b hover:bg-gray-100' key={history[0]}>
                      <td className='max-w-[120px] cursor-pointer border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                        {history[1][0].location || 'In Transit'}
                      </td>

                      <td className='  whitespace-nowrap  border-l-0 border-r-0 border-t-0   align-middle text-xs'>
                        {zoneenterded.map((zone, index) => (
                          <div
                            key={index}
                            className={classNames(
                              'flex items-center justify-center truncate break-words' // Loại bỏ lớp màu sắc động
                            )}
                            style={{ color: zone.fillColor }} // Áp dụng màu sắc động qua thuộc tính style
                          >
                            <span>{zone.nameZone}</span>
                          </div>
                        ))}
                      </td>

                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs '>
                        <div className='flex  items-center truncate break-words'>
                          {timestampToDate(history[1][0].createAt) || ''}
                        </div>
                      </td>
                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs '>
                        <div className='flex  items-center truncate break-words'>
                          {timestampToDate(history[1][1].createAt) || ''}
                        </div>
                      </td>

                      <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs '>
                        <div className='flex  items-center truncate break-words'>
                          {timeDifferenceToDate(history[1][1].createAt, history[1][0].createAt) + 's' || ''}
                        </div>
                      </td>
                      {/* <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs '>
                      <Button className='bg-xanh rounded px-2 py-1 text-white'>{asset.locationPosition || ''}</Button>
                    </td> */}
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
        {/* <div className='flex justify-end p-5'><Pagination count={10} color='primary' /></div> */}
      </div>
    </div>
  )
}
