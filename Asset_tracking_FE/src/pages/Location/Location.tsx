import { useContext } from 'react'
import { AppContext } from 'src/Context/app.context'
import CardZone from 'src/components/Cards/CardZone/CardZone'

function Location() {
  const { socket } = useContext(AppContext)

  return (
    <div className='flex flex-wrap'>
      {' '}
      <div className='mb-12 w-full xl:mb-0'>{socket && <CardZone socket={socket} />}</div>
    </div>
  )
}

export default Location
