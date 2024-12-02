export const authenticationPath = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout'
}

export const path = {
  home: '/',
  user: '/users',
  login: '/auth/login',
  auth: '/auth',
  register: '/auth/register',
  logout: '/auth/logout',
  admin: '/admin',
  controls: '/admin/controls',
  settings: '/admin/settings',
  manage_users: '/admin/manage_users',
  manage_cameras: '/admin/manage_cameras',
  manage_assets: '/admin/manage_assets',
  manage_trackers: '/admin/manage_trackers',
  maps: '/admin/maps',
  zones: '/admin/zones',
  object_tracking: '/admin/object_tracking'
} as const
