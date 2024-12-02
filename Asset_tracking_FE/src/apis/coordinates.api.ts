import { CoordinatesResponses, LocationHistoryResponse } from 'src/types/coordinates.type'
import http from 'src/utils/http'

const coordinatesAPI = {
  getcoordinatesByTrackerId: function (tracker_id: string) {
    return http.get<CoordinatesResponses>(`/coordinates/${tracker_id}`)
  },
  getLocationHistoryByTrackerId: function (tracker_id: string) {
    return http.get<LocationHistoryResponse>(`/coordinates/history/${tracker_id}`)
  }
}

export default coordinatesAPI
