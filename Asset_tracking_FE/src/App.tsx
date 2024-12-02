import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './layouts/Auth'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './layouts/Admin'
import Dashboard from './pages/Dashboard'
import { withProtectedRoute, withRejectedRoute } from './hoc/useRoute'
import NotFound from './pages/NotFound'
import SettingPage from './pages/SettingPage'
import { path } from './constants/paths'
import Location from './pages/Location'
import ManageTrackingObject from './pages/ManageTrackingObject'
import ManageAseets from './pages/ManageAssets/ManageAssets'
import ManageTrackers from './pages/ManageTrackers/ManageTrackers'

const ProtectedDashboard = withProtectedRoute(Dashboard)
const ProtectedLocation = withProtectedRoute(Location)
const ProtectedManageAseets = withProtectedRoute(ManageAseets)
const ProtectedManageTrackers = withProtectedRoute(ManageTrackers)
const ProtectedSettingPage = withProtectedRoute(SettingPage)
const ProtectedManageTrackingObject = withProtectedRoute(ManageTrackingObject)

const RejectedLogin = withRejectedRoute(Login)
const RejectedRegister = withRejectedRoute(Register)

function App() {
  return (
    <>
      <Routes>
        {/* add routes with layouts */}
        <Route path={path.home} element={<Admin />} />
        <Route path={path.auth} element={<Auth />}>
          <Route path={path.login} element={<RejectedLogin />} />
          <Route path={path.register} element={<RejectedRegister />} />
          <Route path={path.auth} element={<Navigate to={path.login} replace />} />
        </Route>

        <Route path={path.admin} element={<Admin />}>
          {/* <Route path={path.controls} element={<ProtectedManageAseets />} /> */}
          <Route path={path.manage_assets} element={<ProtectedManageAseets />} />
          <Route path={path.manage_trackers} element={<ProtectedManageTrackers />} />
          <Route path={path.settings} element={<ProtectedSettingPage />} />
          <Route path={path.object_tracking} element={<ProtectedManageTrackingObject />} />
          <Route path={path.zones} element={<ProtectedLocation />} />
          <Route path={path.admin} element={<Navigate to={path.controls} replace />} />
        </Route>
        {/* add routes without layouts */}

        <Route path='*' element={<NotFound />} />
        {/* add redirect for first page */}
      </Routes>
    </>
  )
}

export default App
