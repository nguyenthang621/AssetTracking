import { CameraResponse, CameraResponsePost, formDataCamera } from 'src/types/camera.type'
import { ZoneResponse } from 'src/types/zone.type'
import http from 'src/utils/http'

const cameraAPI = {
  insertCamera: function (body: formDataCamera) {
    return http.post<ZoneResponse>('/camera', body)
  },
  editCamera: function (body: formDataCamera) {
    return http.patch<ZoneResponse>('/camera', body)
  },
  getAllCamera: function (user_id: string) {
    return http.get<CameraResponse>(`/camera/${user_id}`)
  },
  deleteCamera: function (camera_id: string) {
    return http.delete<ZoneResponse>(`/camera/${camera_id}`)
  },
  changeReceiverCamera: function (body: { camera_id: string; receiver_email: string }) {
    return http.post<ZoneResponse>('/camera/receiver_mail', body)
  }
}

export default cameraAPI
