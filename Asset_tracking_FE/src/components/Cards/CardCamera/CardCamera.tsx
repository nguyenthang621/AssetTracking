import React, { useEffect, useRef, useState } from 'react'
import { GoogleMap, LoadScript, DrawingManager, useGoogleMap } from '@react-google-maps/api'
import io from 'socket.io-client'
import { toast } from 'react-toastify'

const API_KEY = 'AIzaSyBlL8NlnnC9q_N9Ih-s5b58MDHKY788r9E'
const urlApi = 'http://172.16.16.85:5000'

const CardCamera: React.FC = () => {
  const mapRef = useRef<google.maps.Map | null>(null)
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null)
  const [shapes, setShapes] = useState<(google.maps.Polygon | google.maps.Rectangle | google.maps.Circle)[]>([])
  const [selectedShape, setSelectedShape] = useState<
    google.maps.Polygon | google.maps.Rectangle | google.maps.Circle | null
  >(null)

  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current

      const dm = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['polygon', 'rectangle', 'circle']
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

      setDrawingManager(dm)
      dm.setMap(map)

      google.maps.event.addListener(dm, 'overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
        const newShape = event.overlay as google.maps.Polygon | google.maps.Rectangle | google.maps.Circle
        setShapes((prevShapes) => [...prevShapes, newShape])

        google.maps.event.addListener(newShape, 'rightclick', (e) => {
          selectShape(newShape, e)
        })

        sendShapeData(newShape)
      })

      // Initialize WebSocket
      const socketIo = io(urlApi, {
        query: `username=defaultUser&room=defaultRoom`
      })

      socketIo.on('update_location', (data: any) => {
        const lat = data.latitude
        const lng = data.longitude
        const newPosition = new google.maps.LatLng(lat, lng)
        const marker = new google.maps.Marker({
          position: newPosition,
          map: map
        })

        if (data.inside === 'OUTSIDE') {
          toast.warn('Vật thể ra ngoài vùng an toàn')
        }
      })

      setSocket(socketIo)

      return () => {
        socketIo.disconnect()
      }
    }
  }, [shapes])

  const selectShape = (
    shape: google.maps.Polygon | google.maps.Rectangle | google.maps.Circle,
    event: google.maps.MouseEvent
  ) => {
    if (selectedShape) {
      ;(selectedShape as google.maps.Polygon | google.maps.Rectangle | google.maps.Circle).setEditable(false)
    }
    setSelectedShape(shape)
    shape.setEditable(true)

    const deleteOption = document.getElementById('deleteOption')!
    deleteOption.style.display = 'block'
    deleteOption.style.left = `${event.pixel.x}px`
    deleteOption.style.top = `${event.pixel.y}px`
  }

  const handleDeleteShape = () => {
    if (selectedShape) {
      selectedShape.setMap(null)
      setShapes((prevShapes) => prevShapes.filter((shape) => shape !== selectedShape))
      setSelectedShape(null)
      const deleteOption = document.getElementById('deleteOption')!
      deleteOption.style.display = 'none'

      const shapeData = {
        type: 'DELETE',
        coordinates: []
      }

      fetch(urlApi + '/set_zone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shapeData)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }

  const sendShapeData = (shape: google.maps.Polygon | google.maps.Rectangle | google.maps.Circle) => {
    const shapeData: any = {
      type:
        shape instanceof google.maps.Polygon
          ? 'polygon'
          : shape instanceof google.maps.Rectangle
          ? 'rectangle'
          : shape instanceof google.maps.Circle
          ? 'circle'
          : '',
      coordinates: []
    }

    if (shape instanceof google.maps.Polygon || shape instanceof google.maps.Rectangle) {
      shape.getPath().forEach((latlng: google.maps.LatLng) => {
        shapeData.coordinates.push({
          lat: latlng.lat(),
          lng: latlng.lng()
        })
      })
    } else if (shape instanceof google.maps.Circle) {
      shapeData.coordinates.push({
        center: {
          lat: shape.getCenter().lat(),
          lng: shape.getCenter().lng()
        },
        radius: shape.getRadius()
      })
    }

    fetch(urlApi + '/set_zone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shapeData)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={['drawing']}>
      <div>
        <GoogleMap
          id='map'
          mapContainerStyle={{ height: '500px', width: '100%' }}
          center={{ lat: 0, lng: 0 }}
          zoom={2}
          onLoad={(map) => (mapRef.current = map)}
        >
          {drawingManager && (
            <DrawingManager
              drawingMode={google.maps.drawing.OverlayType.POLYGON}
              drawingControl={true}
              drawingControlOptions={{
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['polygon', 'rectangle', 'circle']
              }}
              polygonOptions={{
                editable: true,
                draggable: true
              }}
              rectangleOptions={{
                editable: true,
                draggable: true
              }}
              circleOptions={{
                editable: true,
                draggable: true
              }}
              onOverlayComplete={(event: google.maps.drawing.OverlayCompleteEvent) => {
                const newShape = event.overlay as google.maps.Polygon | google.maps.Rectangle | google.maps.Circle
                setShapes((prevShapes) => [...prevShapes, newShape])

                google.maps.event.addListener(newShape, 'rightclick', (e) => {
                  selectShape(newShape, e)
                })

                sendShapeData(newShape)
              }}
            />
          )}
        </GoogleMap>
        <div id='deleteOption' className='delete-option' onClick={handleDeleteShape}>
          Delete Shape
        </div>
      </div>
    </LoadScript>
  )
}

export default CardCamera
