import { createContext, useState } from 'react'
import { Socket } from 'socket.io-client'
import { Asset } from 'src/types/asset.type'
import { Tracker } from 'src/types/tracker.type'
import { User } from 'src/types/user.type'
import { LocalStorage } from 'src/utils/localStorage'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  isConnected: boolean
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  fps: number
  setFps: React.Dispatch<React.SetStateAction<number>>
  modeFps: '0' | '1'
  setModeFps: React.Dispatch<React.SetStateAction<'0' | '1'>>
  pump: '0' | '1'
  setPump: React.Dispatch<React.SetStateAction<'0' | '1'>>

  isShowModalConFirmDelete: boolean
  setIsShowModalConfirmDelete: React.Dispatch<React.SetStateAction<boolean>>

  socket: Socket | null
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>
  currentIdCam: string | null
  setCurrentIdCam: React.Dispatch<React.SetStateAction<string | null>>
  currentAvatar: File | null
  setCurrentAvatar: React.Dispatch<React.SetStateAction<File | null>>

  currentAssetPick: Asset | null
  setCurrentAssetPick: React.Dispatch<React.SetStateAction<Asset | null>>
  isShowModalAsset: boolean
  setIsShowModalAsset: React.Dispatch<React.SetStateAction<boolean>>
  actionAsset: 'EDIT' | 'ADD' | 'DELETE' | null
  setActionAsset: React.Dispatch<React.SetStateAction<'EDIT' | 'ADD' | 'DELETE' | null>>
  currentAssetMonitor: Asset | null
  setCurrentAssetMonitor: React.Dispatch<React.SetStateAction<Asset | null>>

  currentTrackerPick: Tracker | null
  setCurrentTrackerPick: React.Dispatch<React.SetStateAction<Tracker | null>>
  isShowModalTracker: boolean
  setIsShowModalTracker: React.Dispatch<React.SetStateAction<boolean>>
  actionTracker: 'EDIT' | 'ADD' | 'DELETE' | null
  setActionTracker: React.Dispatch<React.SetStateAction<'EDIT' | 'ADD' | 'DELETE' | null>>
  currentTrackerMonitor: Tracker | null
  setCurrentTrackerMonitor: React.Dispatch<React.SetStateAction<Tracker | null>>
}

const initialAppContext: AppContextInterface = {
  // isAuthenticated: Boolean(LocalStorage.getItemStorage('access_token')),
  isAuthenticated: true,
  setIsAuthenticated: () => null,
  isConnected: false,
  setIsConnected: () => null,
  profile: JSON.parse(LocalStorage.getItemStorage('profile') as string),
  setProfile: () => null,
  fps: 0,
  setFps: () => null,
  pump: '0',
  setPump: () => null,
  modeFps: '0',
  setModeFps: () => null,
  isShowModalConFirmDelete: false,
  setIsShowModalConfirmDelete: () => null,
  socket: null,
  setSocket: () => null,
  currentIdCam: null,
  setCurrentIdCam: () => null,
  currentAvatar: null,
  setCurrentAvatar: () => null,

  isShowModalAsset: false,
  setIsShowModalAsset: () => null,
  currentAssetPick: null,
  setCurrentAssetPick: () => null,
  actionAsset: null,
  setActionAsset: () => null,
  currentAssetMonitor: null,
  setCurrentAssetMonitor: () => null,

  isShowModalTracker: false,
  setIsShowModalTracker: () => null,
  currentTrackerPick: null,
  setCurrentTrackerPick: () => null,
  actionTracker: null,
  setActionTracker: () => null,
  currentTrackerMonitor: null,
  setCurrentTrackerMonitor: () => null
}

export const AppContext = createContext(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [isConnected, setIsConnected] = useState<boolean>(initialAppContext.isConnected)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const [fps, setFps] = useState<number>(initialAppContext.fps)
  const [modeFps, setModeFps] = useState<'0' | '1'>('0')
  const [isShowModalConFirmDelete, setIsShowModalConfirmDelete] = useState<boolean>(
    initialAppContext.isShowModalConFirmDelete
  )
  const [isShowModalAsset, setIsShowModalAsset] = useState<boolean>(initialAppContext.isShowModalAsset)
  const [currentAssetPick, setCurrentAssetPick] = useState(initialAppContext.currentAssetPick)
  const [actionAsset, setActionAsset] = useState(initialAppContext.actionAsset)
  const [currentAssetMonitor, setCurrentAssetMonitor] = useState<Asset | null>(null)

  const [isShowModalTracker, setIsShowModalTracker] = useState<boolean>(initialAppContext.isShowModalTracker)
  const [currentTrackerPick, setCurrentTrackerPick] = useState(initialAppContext.currentTrackerPick)
  const [actionTracker, setActionTracker] = useState(initialAppContext.actionTracker)
  const [currentTrackerMonitor, setCurrentTrackerMonitor] = useState<Tracker | null>(null)

  const [socket, setSocket] = useState<Socket | null>(null)
  const [currentIdCam, setCurrentIdCam] = useState<string | null>(null)
  const [currentAvatar, setCurrentAvatar] = useState<File | null>(null)
  const [pump, setPump] = useState<'0' | '1'>('0')
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isConnected,
        setIsConnected,
        profile,
        setProfile,
        fps,
        setFps,
        isShowModalConFirmDelete,
        setIsShowModalConfirmDelete,
        socket,
        setSocket,
        currentIdCam,
        setCurrentIdCam,
        currentAvatar,
        setCurrentAvatar,
        pump,
        setPump,
        modeFps,
        setModeFps,

        isShowModalAsset,
        setIsShowModalAsset,
        currentAssetPick,
        setCurrentAssetPick,
        actionAsset,
        setActionAsset,
        currentAssetMonitor,
        setCurrentAssetMonitor,

        isShowModalTracker,
        setIsShowModalTracker,
        currentTrackerPick,
        setCurrentTrackerPick,
        actionTracker,
        setActionTracker,
        currentTrackerMonitor,
        setCurrentTrackerMonitor
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
