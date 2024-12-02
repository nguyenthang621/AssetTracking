import ChartBars from 'src/components/Cards/CardCharts/ChartBars/ChartBasrs'
import ChartBarsAverage from 'src/components/Cards/CardCharts/ChartBarsAverage/ChartBarsAverage'
import CardTableAssets from 'src/components/Cards/CardTable/CardTableAssets/CardTableAssets'

function Dashboard() {
  return (
    <div className='flex flex-wrap'>
      <div className='w-full rounded px-4 xl:w-6/12 '>{<ChartBars />}</div>
      <div className='w-full rounded px-4 xl:w-6/12'>{<ChartBarsAverage />}</div>
      <div className='w-full rounded px-4 pt-4'>{<CardTableAssets />}</div>
    </div>
  )
}

export default Dashboard
