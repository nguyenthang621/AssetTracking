import { ZoneResponse, ZoneResponses, formDataZone } from 'src/types/zone.type'
import http from 'src/utils/http'

const zoneAPI = {
  insertZone: function (body: formDataZone) {
    return http.post<ZoneResponse>('/zones', body)
  },
  editZone: function (body: formDataZone) {
    return http.put<ZoneResponse>('/zones', body)
  },
  getAllZone: function () {
    return http.get<ZoneResponses>(`/zones`)
  },
  deleteZone: function (zone_id: string[]) {
    return http.delete<ZoneResponses>(`/zones/${zone_id}`)
  }
}

export default zoneAPI
