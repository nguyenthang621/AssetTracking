import React, { useEffect, useRef, useState } from 'react'
import { GoogleMap, LoadScript, DrawingManager, InfoWindow, Polygon } from '@react-google-maps/api'
import io from 'socket.io-client'
import { toast } from 'react-toastify'
import Draggable from 'react-draggable'
import { useMutation, useQuery } from '@tanstack/react-query'
import zoneAPI from 'src/apis/zone.api'
import { formDataZone, Zone } from 'src/types/zone.type'
import { getShapeStyle } from 'src/utils/utils'
import { useForm } from 'react-hook-form'
import { schemaShade } from 'src/utils/rules'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'src/components/Button'
import { Point } from 'framer-motion'
import _ from 'lodash'
// import { getShapeStyle } from '../../../utils/utils'

const API_KEY = 'AIzaSyC9TWY_9-JIYhWg9iNngJJvqhR9G45D6Qg'
const urlApi = 'http://172.16.16.85:5000'
type formData = yup.InferType<typeof schemaShade>

const CardLocation: React.FC = () => {
  var zones: Zone[] = []
  // Init type form submit
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(schemaShade)
  })
  // Get all zone to show
  const { data: responseDataZone, refetch } = useQuery({
    queryKey: ['get-zones'],
    queryFn: () => zoneAPI.getAllZone()
  })

  if (responseDataZone?.data.data) {
    console.log('responseDataZone: ' + responseDataZone.data.data)
    if (responseDataZone.data.data.length > 0) {
      zones = responseDataZone.data.data
    }
  }

  // Insert zone
  const insertZoneMutation = useMutation({
    mutationFn: (body: formDataZone) => zoneAPI.insertZone(body)
  })

  const mapRef = useRef<google.maps.Map | null>(null)
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null)
  const [shapes, setShapes] = useState<(google.maps.Polygon | google.maps.Rectangle | google.maps.Circle)[]>([])
  const [selectedShape, setSelectedShape] = useState<
    google.maps.Polygon | google.maps.Rectangle | google.maps.Circle | null
  >(null)
  const [center, setCenter] = useState<google.maps.LatLng | null>(null)
  const [drawingMode, setDrawingMode] = useState<google.maps.drawing.OverlayType | null>(null)

  // State for shape style adjustments
  const [fillColor, setFillColor] = useState('#FF0000')
  const [strokeColor, setStrokeColor] = useState('#FF0000')
  const [fillOpacity, setFillOpacity] = useState(0.4)
  const [strokeOpacity, setStrokeOpacity] = useState(1.0)
  const [strokeWeight, setStrokeWeight] = useState(2)
  const [zoneTitle, setZoneTitle] = useState('')
  const [titles, setTitles] = useState<
    { shape: google.maps.Polygon | google.maps.Rectangle | google.maps.Circle; title: string }[]
  >([])

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map

    const dm = new google.maps.drawing.DrawingManager({
      drawingMode: drawingMode,
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
        draggable: true,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight
      },
      rectangleOptions: {
        editable: true,
        draggable: true,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight
      },
      circleOptions: {
        editable: true,
        draggable: true,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        strokeColor: strokeColor,
        strokeOpacity: strokeOpacity,
        strokeWeight: strokeWeight
      }
    })

    setDrawingManager(dm)
    dm.setMap(map)

    google.maps.event.addListener(dm, 'overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
      const newShape = event.overlay as google.maps.Polygon | google.maps.Rectangle | google.maps.Circle
      setShapes((prevShapes) => [...prevShapes, newShape])

      google.maps.event.addListener(newShape, 'rightclick', (e: google.maps.MouseEvent) => {
        selectShape(newShape, e)
      })

      const currentCenter = map.getCenter()
      if (currentCenter) {
        setCenter(currentCenter)
      }

      // sendShapeData(newShape)

      // Stop drawing mode and deselect any shape
      // dm.setDrawingMode(null)
      setSelectedShape(null)
    })

    // Handel click outside shade
    google.maps.event.addListener(map, 'rightclick', (event: google.maps.MouseEvent) => {
      if (selectedShape) {
        console.log('Deselected shape due to right-click outside the shape')
      } else {
        setSelectedShape(null)
        const deleteOption = document.getElementById('deleteOption')!
        deleteOption.style.display = 'none'
        console.log('Right-clicked outside any shapes, map location:', event.latLng?.toString())
      }
    })
  }

  const selectShape = (
    shape: google.maps.Polygon | google.maps.Rectangle | google.maps.Circle,
    event: google.maps.MouseEvent
  ) => {
    console.log('event: ', event)
    if (selectedShape) {
      selectedShape.setEditable(false)
    }

    setSelectedShape(shape)
    console.log('true: ', shape)
    shape.setEditable(true)

    const mouseEvent = event as google.maps.MouseEvent & { domEvent: MouseEvent }

    const deleteOption = document.getElementById('deleteOption')!
    deleteOption.style.display = 'block'

    deleteOption.style.left = `${mouseEvent.domEvent.clientX}px`
    deleteOption.style.top = `${mouseEvent.domEvent.clientY}px`

    // Prevent the map click listener from deselecting the shape
    event.stop()
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

      fetch('/set_zone', {
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
      type: '',
      coordinates: []
    }
    if (shape instanceof google.maps.Polygon) {
      shapeData.type = 'polygon'
      shape.getPath().forEach((latlng: google.maps.LatLng) => {
        shapeData.coordinates.push({
          lat: latlng.lat(),
          lng: latlng.lng()
        })
      })
    } else if (shape instanceof google.maps.Rectangle) {
      shapeData.type = 'rectangle'
      const bounds = shape.getBounds()
      if (bounds) {
        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()
        shapeData.coordinates.push({ lat: ne.lat(), lng: ne.lng() }, { lat: sw.lat(), lng: sw.lng() })
      }
    } else if (shape instanceof google.maps.Circle) {
      shapeData.type = 'circle'
      const center = shape.getCenter()

      if (center) {
        shapeData.coordinates.push({
          center: {
            lat: center.lat(),
            lng: center.lng()
          },
          radius: shape.getRadius()
        })
      }
    }

    // // Sending data
    const shapestyle = getShapeStyle(shape)

    let payloadFormDataZone: formDataZone = {
      nameZone: zoneTitle,
      coordinates: shapeData.coordinates,
      description: 'string',
      status: 'ACTIVE',
      type: shapeData.type,
      fillColor: shapestyle.fillColor,
      fillOpacity: shapestyle.fillOpacity,
      strokeColor: shapestyle.strokeColor,
      strokeOpacity: shapestyle.strokeOpacity,
      strokeWeight: shapestyle.strokeWeight,
      createBy: 'admin',
      rules: 'string'
    }
    excuteSubmit(payloadFormDataZone)
    return payloadFormDataZone
  }

  const excuteSubmit = (body: formDataZone) => {
    console.log('body: ', body)
    insertZoneMutation.mutate(body as Zone, {
      onSuccess(data) {
        toast.info('Insert Done')
      },
      onError(error: any) {
        console.log('error: ', error)
      }
    })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (drawingManager) {
        drawingManager.setDrawingMode(null) // Stop drawing mode
        setDrawingMode(null)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [drawingManager])

  const updateShapeStyles = () => {
    if (!selectedShape) {
      console.log('selectedShape null')
      return
    }
    if (selectedShape) {
      if (selectedShape instanceof google.maps.Polygon) {
        selectedShape.setOptions({
          fillColor: fillColor,
          fillOpacity: fillOpacity,
          strokeColor: strokeColor,
          strokeOpacity: strokeOpacity,
          strokeWeight: strokeWeight
        })
      } else if (selectedShape instanceof google.maps.Rectangle) {
        selectedShape.setOptions({
          fillColor: fillColor,
          fillOpacity: fillOpacity,
          strokeColor: strokeColor,
          strokeOpacity: strokeOpacity,
          strokeWeight: strokeWeight
        })
      } else if (selectedShape instanceof google.maps.Circle) {
        selectedShape.setOptions({
          fillColor: fillColor,
          fillOpacity: fillOpacity,
          strokeColor: strokeColor,
          strokeOpacity: strokeOpacity,
          strokeWeight: strokeWeight
        })
      }
    }
    console.log(sendShapeData(selectedShape))

    handleTitleChange()
  }

  const handleTitleChange = () => {
    if (selectedShape) {
      setTitles((prevTitles) => [...prevTitles, { shape: selectedShape, title: zoneTitle }])
      setZoneTitle('') // Clear input after adding title
    }
  }

  const calculatePolygonCenter = (polygon: google.maps.Polygon): google.maps.LatLng | null => {
    const paths = polygon.getPath().getArray()
    if (paths.length === 0) return null

    let latSum = 0
    let lngSum = 0

    paths.forEach((latLng) => {
      latSum += latLng.lat()
      lngSum += latLng.lng()
    })

    const lat = latSum / paths.length
    const lng = lngSum / paths.length

    return new google.maps.LatLng(lat, lng)
  }

  return (
    <div className='relative overflow-hidden rounded bg-white'>
      <div className='mb-0 rounded-t border-0 px-4 py-5'>
        <div className='flex flex-wrap items-center justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-black'>Map History</h2>
          </div>
        </div>
      </div>
      <LoadScript googleMapsApiKey={API_KEY} libraries={['drawing']}>
        <div className='overflow-hidden'>
          <GoogleMap
            id='map'
            mapContainerStyle={{ height: '80vh', width: '100%' }}
            center={center || { lat: 0, lng: 0 }}
            zoom={2}
            onLoad={handleMapLoad}
            options={{
              restriction: {
                latLngBounds: {
                  north: 85,
                  south: -85,
                  west: -180,
                  east: 180
                },
                strictBounds: true
              },
              mapTypeId: 'hybrid',
              // mapTypeId: google.maps.MapTypeId.HYBRID,
              mapTypeControl: true,
              mapTypeControlOptions: {
                style: 0,
                position: 23.0
              }
            }}
          >
            {drawingManager && (
              <DrawingManager
                options={{
                  drawingMode: drawingMode,
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
                    draggable: true,
                    fillColor: fillColor,
                    fillOpacity: fillOpacity,
                    strokeColor: strokeColor,
                    strokeOpacity: strokeOpacity,
                    strokeWeight: strokeWeight
                  },
                  rectangleOptions: {
                    editable: true,
                    draggable: true,
                    fillColor: fillColor,
                    fillOpacity: fillOpacity,
                    strokeColor: strokeColor,
                    strokeOpacity: strokeOpacity,
                    strokeWeight: strokeWeight
                  },
                  circleOptions: {
                    editable: true,
                    draggable: true,
                    fillColor: fillColor,
                    fillOpacity: fillOpacity,
                    strokeColor: strokeColor,
                    strokeOpacity: strokeOpacity,
                    strokeWeight: strokeWeight
                  }
                }}
                onOverlayComplete={(event: google.maps.drawing.OverlayCompleteEvent) => {
                  const newShape = event.overlay as google.maps.Polygon | google.maps.Rectangle | google.maps.Circle
                  setShapes((prevShapes) => [...prevShapes, newShape])

                  google.maps.event.addListener(newShape, 'rightclick', (e: google.maps.MouseEvent) => {
                    selectShape(newShape, e)
                  })

                  const currentCenter = mapRef.current?.getCenter()
                  if (currentCenter) {
                    setCenter(currentCenter)
                  }

                  sendShapeData(newShape)
                }}
              />
            )}
            {/* Display Zone */}
            {zones.length > 0 &&
              zones.map((zone) => {
                const coordinates = zone.coordinates.map(({ lat, lng }: any) => ({ lat, lng }))
                return (
                  <Polygon
                    key={zone.id}
                    paths={coordinates}
                    options={{
                      editable: true,
                      draggable: true,
                      fillColor: zone.fillColor,
                      fillOpacity: parseFloat(zone.fillOpacity),
                      strokeColor: zone.strokeColor,
                      strokeOpacity: parseFloat(zone.strokeOpacity),
                      strokeWeight: parseFloat(zone.strokeWeight)
                    }}
                  />
                )
              })}

            {/* Display Zone Titles */}
            {titles.map((item, index) => {
              let position: google.maps.LatLng | null = null

              if (item.shape instanceof google.maps.Circle) {
                position = item.shape.getCenter()
              } else if (item.shape instanceof google.maps.Rectangle) {
                position = item.shape.getBounds()?.getCenter() || null
              } else if (item.shape instanceof google.maps.Polygon) {
                position = calculatePolygonCenter(item.shape)
              }

              return position ? (
                <InfoWindow key={index} position={position}>
                  <div>{item.title}</div>
                </InfoWindow>
              ) : null
            })}
          </GoogleMap>

          {/* {selectedShape && ( */}
          {selectedShape && (
            <Draggable handle='.handle' bounds='parent' defaultPosition={{ x: 0, y: -400 }}>
              <div className='style-form  absolute mx-auto mt-11 overflow-hidden rounded-lg border-[1px] bg-white shadow'>
                <div className='p-2'>
                  <h3 className='handle cursor-grab border-b-2 border-gray-300 p-2 font-bold'>Adjust Shape Style</h3>
                  <div className='mt-2 flex w-full items-center px-2 text-sm'>
                    <div className='tems-center flex w-full flex-nowrap '>
                      <div className='w-5/12'>
                        <label className='flex'>
                          <p className='whitespace-nowrap'>Fill Color:</p>
                          <input
                            className='ml-2'
                            type='color'
                            value={fillColor}
                            onChange={(e) => setFillColor(e.target.value)}
                          />
                        </label>
                      </div>
                      <div className='w-5/12'>
                        <label className='flex'>
                          <p className='whitespace-nowrap'>Stroke Color:</p>
                          <input
                            className='ml-2'
                            type='color'
                            value={strokeColor}
                            onChange={(e) => setStrokeColor(e.target.value)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className='mt-2 flex w-full items-center justify-between px-2 text-sm'>
                    <div className='tems-center flex flex-nowrap'>
                      <div className='mr-2 w-2/6'>
                        <label className='flex'>
                          <p className='whitespace-nowrap'>Fill Opacity:</p>
                          <input
                            className='ml-2 w-10'
                            type='number'
                            step='0.1'
                            min='0'
                            max='1'
                            value={fillOpacity}
                            onChange={(e) => setFillOpacity(parseFloat(e.target.value))}
                          />
                        </label>
                      </div>
                      <div className='mr-2 w-2/6'>
                        <label className='flex'>
                          <p className='whitespace-nowrap'>Stroke Opacity:</p>
                          <input
                            className='ml-2 w-10'
                            type='number'
                            step='0.1'
                            min='0'
                            max='1'
                            value={strokeOpacity}
                            onChange={(e) => setStrokeOpacity(parseFloat(e.target.value))}
                          />
                        </label>
                      </div>
                      <div className='mr-2 w-2/6'>
                        <label className='flex'>
                          <p className='whitespace-nowrap'>Stroke Weight:</p>
                          <input
                            className='ml-2 w-10'
                            type='number'
                            step='1'
                            min='1'
                            value={strokeWeight}
                            onChange={(e) => setStrokeWeight(parseInt(e.target.value))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className='mt-2 flex w-full items-center justify-between px-2 text-sm'>
                    <div className='tems-center flex w-full flex-nowrap'>
                      <div className='zone-title-form mr-2 flex w-full'>
                        <p>Set Zone Title: </p>
                        <input
                          type='text'
                          value={zoneTitle}
                          onChange={(e) => setZoneTitle(e.target.value)}
                          className='ml-2 rounded border-2 border-gray-300 px-1'
                          placeholder='Enter zone name'
                        />
                        {/* <button onClick={handleTitleChange}>Set Title</button> */}
                      </div>
                    </div>
                  </div>

                  <div className='mx-2 mt-2 flex items-center justify-between border-gray-300 pt-2'>
                    {/* <button
                        className='rounded bg-lightBlue-200 px-2 py-1 text-lightBlue-600'
                        >
                        
                      </button> */}
                    <Button
                      onClick={updateShapeStyles}
                      // isLoading={true}
                      // disabled={true}
                      className='flex h-12 w-1/4 cursor-pointer items-center justify-center rounded-[7px] bg-[#e0ebff] text-sm font-semibold text-[#5b7a9d]'
                    >
                      Update
                    </Button>
                    <div
                      id='deleteOption'
                      className='delete-option rounded bg-red-200 px-2 py-1 text-red-600'
                      onClick={handleDeleteShape}
                    >
                      Delete
                    </div>
                  </div>
                </div>
              </div>
              {/* )} */}
            </Draggable>
          )}
        </div>
      </LoadScript>
    </div>
  )
}

export default CardLocation
