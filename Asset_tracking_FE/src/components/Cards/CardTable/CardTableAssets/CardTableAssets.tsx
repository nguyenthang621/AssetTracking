import classNames from 'classnames'
import Button from 'src/components/Button'

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
  },
  {
    assetId: 'A002',
    alertType: 'Motion Detected',
    dateAndTime: '2024-08-02 10:45',
    status: 'Unresolved',
    locationPosition: 'Warehouse 1',
    resolvedOn: '',
    resolvedBy: ''
  },
  {
    assetId: 'A003',
    alertType: '',
    dateAndTime: '2024-08-03 09:15',
    status: 'Resolved',
    locationPosition: 'Main Entrance',
    resolvedOn: '2024-08-03 10:00',
    resolvedBy: 'Đình Trung'
  },
  {
    assetId: 'A004',
    alertType: 'Power Failure',
    dateAndTime: '2024-08-04 16:00',
    status: 'Unresolved',
    locationPosition: 'Server Room',
    resolvedOn: '',
    resolvedBy: ''
  },
  {
    assetId: 'A005',
    alertType: 'Restricted Zone',
    dateAndTime: '2024-08-05 11:30',
    status: 'Resolved',
    locationPosition: 'Production Floor',
    resolvedOn: '2024-08-05 12:00',
    resolvedBy: 'Khánh Văn'
  }
]

export default function CardTableAssets() {
  let color = 'light'

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
              <h2 className='text-xl font-semibold text-black'>Location performance</h2>
            </div>
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
                    'max-w-[300px] whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Asset ID
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Alert Type
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Date And Time
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
                  Resolved On
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Resolved By
                </th>
                <th
                  className={
                    'whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase ' +
                    (color === 'light'
                      ? 'border-blueGray-100 bg-blueGray-50 text-blueGray-500'
                      : 'border-lightBlue-700 bg-lightBlue-800 text-lightBlue-300')
                  }
                >
                  Location Position
                </th>
              </tr>
            </thead>
            <tbody className='pt-2'>
              {dataAsset &&
                dataAsset.length > 0 &&
                dataAsset.map((asset) => (
                  <tr className='border border-b hover:bg-gray-100' key={asset.assetId}>
                    <th className='flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs'>
                      <input
                        id={'id-' + asset.assetId}
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500'
                      ></input>
                    </th>
                    <td className='max-w-[600px] cursor-pointer border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      {asset.assetId || ''}
                    </td>
                    <td className='bg-success text-success inline-flex whitespace-nowrap rounded-full border-l-0 border-r-0 border-t-0 bg-opacity-10 p-4 px-3 px-6 py-1 align-middle text-sm text-xs font-medium'>
                      <div
                        className={classNames('flex items-center rounded-full px-3 py-2 font-bold', {
                          // 'bg-success text-success' : asset.alertType === 'Motion Detected',
                          'bg-red-100 text-red-600':
                            asset.alertType == 'Restricted Zone' || asset.alertType == 'Power Failure',
                          'bg-amber-100 text-amber-600': asset.alertType == 'Motion Detected'
                        })}
                      >
                        {asset.alertType || ''}
                      </div>
                    </td>
                    <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      <div className='flex items-center'>{asset.dateAndTime || ''}</div>
                    </td>
                    <td className='inline-flex whitespace-nowrap rounded-full border-l-0 border-r-0 border-t-0 bg-opacity-10 p-4 px-3 px-6 py-1 align-middle text-sm text-xs font-medium'>
                      <div
                        className={classNames('flex items-center rounded-full px-3 py-2 font-bold', {
                          // 'bg-success text-success' : asset.alertType === 'Motion Detected',
                          'bg-red-100 text-red-600':
                            asset.alertType == 'Restricted Zone' || asset.status == 'Unresolved',
                          'bg-lime-100 text-lime-600': asset.status == 'Resolved'
                        })}
                      >
                        {asset.status || ''}
                      </div>
                    </td>
                    <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      <div className='flex items-center'>{asset.resolvedOn || ''}</div>
                    </td>
                    <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      <div className='flex items-center'>{asset.resolvedBy || ''}</div>
                    </td>

                    <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      <div className='flex items-center'>{asset.locationPosition || ''}</div>
                    </td>
                    {/* <td className='whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs'>
                      <Button className='bg-xanh rounded px-2 py-1 text-white'>{asset.locationPosition || ''}</Button>
                    </td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='flex justify-end p-5'>{/* <Pagination count={10} color='primary' /> */}</div>
      </div>
    </div>
  )
}
