import { AssetResponses, formDataAsset, OneAssetResponses } from 'src/types/asset.type'
import http from 'src/utils/http'

const assetAPI = {
  insertAsset: function (body: formDataAsset) {
    return http.post<AssetResponses>('/assets', body)
  },
  editAsset: function (body: formDataAsset) {
    return http.put<AssetResponses>('/assets', body)
  },
  getAllAsset: function () {
    return http.get<AssetResponses>(`/assets`)
  },
  deleteAsset: function (asset_id: string[]) {
    return http.delete<AssetResponses>(`/assets/${asset_id}`)
  },
  getAsset: function (asset_id: string) {
    return http.get<OneAssetResponses>(`/assets/${asset_id}`)
  }
}

export default assetAPI
