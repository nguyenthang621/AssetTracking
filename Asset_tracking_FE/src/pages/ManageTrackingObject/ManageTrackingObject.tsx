import Tracker from '../Tracker'

function ManageTrackingObject() {
  return (
    <div>
      <div className='-mt-3 flex flex-wrap'>
        <div className='mb-12 w-full'>
          {/* <CardTableTrackingObject color='light' /> */}
          <Tracker />
        </div>
      </div>
    </div>
  )
}

export default ManageTrackingObject
