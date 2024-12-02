import { Tracker } from './tracker.type'
import { SuccessResponseAPi } from './utils.type'

export interface Point {
  lat: number
  lng: number
}

export interface Marker_Response {
  move: Boolean
  point: Point
  tracker?: Tracker
}
export interface markers {
  markerId: string
  marker: Marker_Response
}

export interface Coordinates {
  dwellTime: number | null
  location: string | null
  zoneEntered: string[]
  createAt?: number | null
  createBy?: string | null
  coordinatesId?: string | null
  updateAt: number | null
  point: {
    x: number
    y: number
  }
}

export interface HistoryTrackerElement {
  [key: string]: Coordinates[]
}

export type CoordinatesResponses = SuccessResponseAPi<Coordinates[]>

export type LocationHistoryResponse = SuccessResponseAPi<HistoryTrackerElement[]>
