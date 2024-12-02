import { Point } from './coordinates.type'
import { SuccessResponseAPi } from './utils.type'

export interface formDataZone {
  nameZone: string
  coordinates: Point[]
  description?: string
  status: string
  type: string

  fillColor: string
  fillOpacity: string
  strokeColor: string
  strokeOpacity: string
  strokeWeight: string
  createBy?: string
  rules?: string
  alertTo?: string[]
  positionTitle?: string
}

export interface Zone {
  zoneId: string
  nameZone: string
  coordinates: Point[]
  description?: string
  status: string
  type: string

  fillColor: string
  fillOpacity: string
  strokeColor: string
  strokeOpacity: string
  strokeWeight: string
  createAt?: string
  createBy?: string
  rules?: string
  alertTo?: string[]
  positionTitle?: string
}

export type ZoneResponses = SuccessResponseAPi<Zone[]>

export type ZoneResponse = SuccessResponseAPi<Zone>

export type ZoneResponsePost = SuccessResponseAPi<{
  message: string
}>
