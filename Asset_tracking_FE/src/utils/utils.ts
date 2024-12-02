import axios, { AxiosError, HttpStatusCode } from 'axios'
import { useLocation } from 'react-router-dom'
import { titleNavbar } from 'src/constants/constants'
import { Coordinates } from 'src/types/coordinates.type'
import { Zone } from 'src/types/zone.type'

// type predicate
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function isUnauthorizedError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return (
    isAxiosError(error) &&
    (error.response?.status === HttpStatusCode.BadRequest ||
      error.response?.status === HttpStatusCode.Unauthorized ||
      error.response?.status === HttpStatusCode.Forbidden ||
      error.response?.status === HttpStatusCode.Conflict)
  )
}

export function generateUUID() {
  let d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now() // sử dụng hiệu năng hiện tại nếu có
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

type keyTitle = 'maps' | 'manage_users' | 'settings' | 'controls' | 'manage_cameras'
export const handleGenTitleNavbar = () => {
  const location = useLocation()
  const currentPath = location.pathname
  let keyTitle: string[] = currentPath.split('admin/')
  return titleNavbar[keyTitle[1] as keyTitle]
}
export const genGoogleObject = () => {
  return new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.RECTANGLE,
        google.maps.drawing.OverlayType.CIRCLE
      ]
    },
    polygonOptions: {
      editable: true,
      draggable: true
    },
    rectangleOptions: {
      editable: true,
      draggable: true
    },
    circleOptions: {
      editable: true,
      draggable: true
    }
  })
}

export const getShapeStyle = (shape: google.maps.Polygon | google.maps.Rectangle | google.maps.Circle) => {
  let styleInfo = {
    fillColor: '',
    fillOpacity: '',
    strokeColor: '',
    strokeOpacity: '',
    strokeWeight: ''
  }

  // if (shape instanceof google.maps.Polygon) {
  styleInfo = {
    fillColor: shape.get('fillColor') || '',
    fillOpacity: String(shape.get('fillOpacity')) || '',
    strokeColor: shape.get('strokeColor') || '',
    strokeOpacity: String(shape.get('strokeOpacity')) || '',
    strokeWeight: String(shape.get('strokeWeight')) || ''
  }

  return styleInfo
}

export const coordinates = []

export const createDashedPolyline = (coordinatesraws: Coordinates[]) => {
  const coordinates: google.maps.LatLngLiteral[] = coordinatesraws.map((coordinatesraw) => {
    return { lat: coordinatesraw.point.y, lng: coordinatesraw.point.x }
  })
  const dashLength = 10

  const spaceLength = 10

  const dashedPath = []
  for (let i = 0; i < coordinates.length - 1; i++) {
    const start = coordinates[i]
    const end = coordinates[i + 1]

    const segmentLength = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(start),
      new google.maps.LatLng(end)
    )

    let distanceCovered = 0
    while (distanceCovered < segmentLength) {
      const ratio = Math.min(dashLength, segmentLength - distanceCovered) / segmentLength
      const intermediateLatLng = google.maps.geometry.spherical.computeOffset(
        new google.maps.LatLng(start),
        ratio * segmentLength,
        google.maps.geometry.spherical.computeHeading(new google.maps.LatLng(start), new google.maps.LatLng(end))
      )
      dashedPath.push(intermediateLatLng.toJSON())

      distanceCovered += dashLength + spaceLength
    }
  }
  console.log('dashedPath: ', dashedPath)
  return dashedPath
}

export const svgHtml = `
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" stroke="#000000" stroke-width="2" fill="none" stroke-dasharray="4" />
  </svg>
`

export function htmlToDataUrl(html: string) {
  return `data:image/svg+xml;base64,${btoa(html)}`
}

// export const createDashedPolyline2 = (coordinatesraws: Coordinates[]) => {
//   const coordinates: google.maps.LatLngLiteral[] = coordinatesraws.map((coordinatesraw) => {
//     return { lat: coordinatesraw.point.y, lng: coordinatesraw.point.x }
//   })
//   return coordinates
// }

export function calculateDistance(point1: google.maps.LatLngLiteral, point2: google.maps.LatLngLiteral): number {
  const R = 6371 // Bán kính Trái đất theo km
  const lat1 = point1.lat
  const lon1 = point1.lng
  const lat2 = point2.lat
  const lon2 = point2.lng

  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Khoảng cách tính bằng km

  return distance
}

export function createDashedPolyline2(coordinatesraws: Coordinates[], maxDistance: number = 0.2) {
  const filteredPath: google.maps.LatLngLiteral[][] = []

  const datacoordinates: google.maps.LatLngLiteral[] = coordinatesraws.map((coordinatesraw) => {
    return { lat: coordinatesraw.point.y, lng: coordinatesraw.point.x }
  })

  for (let i = 0; i < datacoordinates.length - 1; i++) {
    const currentPoint = datacoordinates[i]
    const nextPoint = datacoordinates[i + 1]

    const distance = calculateDistance(currentPoint, nextPoint)

    if (distance <= maxDistance) {
      // If filteredPath is empty or the last segment is already present, just add the current point
      if (filteredPath.length === 0 || filteredPath[filteredPath.length - 1].length === 0) {
        filteredPath.push([currentPoint])
      }
      filteredPath[filteredPath.length - 1].push(nextPoint)
    } else {
      // If distance exceeds maxDistance, start a new segment
      filteredPath.push([nextPoint])
    }
  }

  // Ensure the last point is included if it's not already added
  if (filteredPath.length > 0 && filteredPath[filteredPath.length - 1].length === 0) {
    filteredPath.pop() // Remove empty segments if present
  }

  return filteredPath
}

export const convertNameZone = (zoneIds: string[], zones: Zone[]) => {
  let result: Zone[] = []

  zones.forEach((zone) => {
    if (zoneIds.includes(zone.zoneId)) result.push(zone)
  })
  return result
}

export function timestampToDate(timestamp: number) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function timeDifferenceToDate(timestamp1: number, timestamp2: number) {
  const differenceInMilliseconds = Math.abs(timestamp1 - timestamp2)

  // const millisecondsPerMinute = 1000 * 60
  const millisecondsPerMinute = 1000 // s

  return Math.floor(differenceInMilliseconds / millisecondsPerMinute)
}
