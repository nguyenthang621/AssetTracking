import { Asset } from './asset.type'

import { SuccessResponseAPi } from './utils.type'
import { Zone } from './zone.type'

export interface formDataTracker {
  trackerId: string
  nameTracker: string
  description?: string
  status?: string
  type?: string
  dataset?: string
  zones?: { zoneId: string }[]
  assets?: { assetId: string }[]
}

export interface Tracker {
  trackerId: string
  nameTracker: string
  description: string
  status: string
  type: string
  dataset: string
  zones: Zone[]
  assets: Asset[]
}

export type TrackerResponses = SuccessResponseAPi<Tracker[]>
