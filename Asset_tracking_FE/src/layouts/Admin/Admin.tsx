import { Outlet, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'
import HeaderStats from 'src/components/Headers/HeaderStats'
// import ModalConfirm from 'src/components/Modal/ModalConfirm/ModalConfirm'
import NavbarAdmin from 'src/components/Navbar/NavbarAdmin'
import Sidebar from 'src/components/Sidebar/Sidebar'
import env from 'src/constants/env'
import { useContext, useEffect } from 'react'
import { AppContext } from 'src/Context/app.context'
import ModalAdvance from 'src/components/Modal/ModalAdvance'
import CardHeaderDashboard from 'src/components/Cards/CardHeaderDashboard'
import { path } from 'src/constants/paths'
import ModalAsset from 'src/components/Modal/ModalAsset'
import ModalTracker from 'src/components/Modal/ModelTracker/ModelTracker'

function Admin() {
  const { setSocket } = useContext(AppContext)
  const location = useLocation()
  const currentPath = location.pathname
  useEffect(() => {
    const socket = io(env.BASE_SOCKET)
    if (socket) setSocket(socket)
  }, [])
  return (
    <div className='relative'>
      {/* <ModalConfirm /> */}
      <ModalAsset />
      <ModalTracker />
      <ModalAdvance />

      <Sidebar currentPath={currentPath} />
      <NavbarAdmin />
      {currentPath != path.object_tracking && <CardHeaderDashboard />}
      <div className='relative bg-gray-100 md:ml-64'>
        {/* <NavbarAdmin /> */}
        {/* Header */}
        <HeaderStats currentPath={currentPath} />
        <div className='z-8 relative -m-24 mx-auto mt-[14px] w-full'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Admin
