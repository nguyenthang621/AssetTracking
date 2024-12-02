import { TrackerResponses, formDataTracker } from 'src/types/tracker.type'
import http from 'src/utils/http'

const trackerAPI = {
  insertTracker: function (body: formDataTracker) {
    return http.post<TrackerResponses>('/trackers', body)
  },
  editTracker: function (body: formDataTracker) {
    return http.put<TrackerResponses>('/trackers', body)
  },
  getAllTracker: function () {
    return http.get<TrackerResponses>(`/trackers`)
  },
  deleteTracker: function (tracker_id: string[]) {
    return http.delete<TrackerResponses>(`/trackers/${tracker_id}`)
  }
}

export default trackerAPI
