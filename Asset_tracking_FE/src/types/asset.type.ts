import { Tracker } from './tracker.type'
import { User } from './user.type'
import { SuccessResponseAPi } from './utils.type'
import { Zone } from './zone.type'

export interface formDataAsset {
  nameAsset: string
  description?: string
  location?: string[]
  images?: string[]
  resolvedOn?: number
  resolvedBy?: string
  locationPosition?: string
  status?: string
  destination?: string
  expiredArrivalDate?: string | null
  zones?: { zoneId: string }[]
  trackers?: { trackerId: string }[]
}

export interface Asset {
  assetId: string
  nameAsset: string
  description: string
  location: string[]
  images: string[]
  resolvedOn: number
  resolvedBy: string
  locationPosition: string
  status: string
  destination?: string[]
  expiredArrivalDate?: string | null
  alert: string
  users: User[]
  zones: Zone[]
  trackers: Tracker[]
}

export type AssetResponses = SuccessResponseAPi<Asset[]>
export type OneAssetResponses = SuccessResponseAPi<Asset>
