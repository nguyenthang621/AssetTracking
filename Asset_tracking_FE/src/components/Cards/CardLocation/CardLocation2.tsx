import React, { useEffect, useRef, useState } from 'react'
import { GoogleMap, InfoWindow, Polygon, Marker, Polyline } from '@react-google-maps/api'
import { toast } from 'react-toastify'
import Draggable from 'react-draggable'
import { useMutation, useQuery } from '@tanstack/react-query'
import zoneAPI from 'src/apis/zone.api'
import { formDataZone, Zone } from 'src/types/zone.type'
import { createDashedPolyline, createDashedPolyline2, getShapeStyle } from 'src/utils/utils'
import { useForm } from 'react-hook-form'
import { schemaShade } from 'src/utils/rules'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'src/components/Button'
import _ from 'lodash'
import { SearchInput } from 'src/components/SearchInput/SearchInput'
import { Socket } from 'socket.io-client'
import coordinatesAPI from 'src/apis/coordinates.api'
import { Coordinates, Marker_Response } from 'src/types/coordinates.type'
import InputDropdown from 'src/components/InputDropDown/InputDropDown'
import { Asset } from 'src/types/asset.type'
import assetAPI from 'src/apis/asset.api'
import { cursorTo } from 'readline'

type formData = yup.InferType<typeof schemaShade>

interface Props {
  socket: Socket
  currentAssetMonitor: Asset | null
}

interface OptionType {
  value: string
  label: string
}

const optionsType = [
  { value: '0', label: 'Available Area' },
  { value: '1', label: 'Ban Area' }
]

const optionsAlert = [
  { value: 'nthang621@gmail.com', label: 'nthang621@gmail.com' },
  { value: 'ndthang2@istt.com.vn', label: 'ndthang2@istt.com.vn' }
]

function CardLocation2({ socket, currentAssetMonitor }: Props) {
  var totalzoneOfAsset: Zone[] = []
  var datacoordinates: Coordinates[] = []
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm<formData>({
    resolver: yupResolver(schemaShade)
  })

  const insertZoneMutation = useMutation({
    mutationFn: (body: formDataZone) => zoneAPI.insertZone(body)
  })
  const mapRef = useRef<google.maps.Map | null>(null)
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null)
  const [shapes, setShapes] = useState<(google.maps.Polygon | google.maps.Rectangle | google.maps.Circle)[]>([])
  const [selectedShape, setSelectedShape] = useState<
    google.maps.Polygon | google.maps.Rectangle | google.maps.Circle | null
  >(null)
  const [center, setCenter] = useState<any | null>({ lat: 20, lng: 106 })
  const [drawingMode, setDrawingMode] = useState<google.maps.drawing.OverlayType | null>(null)
  const [fillColor, setFillColor] = useState('#FF0000')
  const [strokeColor, setStrokeColor] = useState('#FF0000')
  const [fillOpacity, setFillOpacity] = useState(0.2)
  const [strokeOpacity, setStrokeOpacity] = useState(0.5)
  const [strokeWeight, setStrokeWeight] = useState(1)
  const [zoneTitle, setZoneTitle] = useState('') // title current set
  const [zoneRule, setZoneRule] = useState<OptionType | null>(null)
  const [zoneAlertTo, setZoneAlertTo] = useState<OptionType[] | null>(null)
  const [titles, setTitles] = useState<
    { shape: google.maps.Polygon | google.maps.Rectangle | google.maps.Circle; title: string }[]
  >([])

  const [currentSelectEditZone, setCurrentSelectEditZone] = useState<Zone | null>(null)
  const [datacoordinatesRender, setDatacoordinatesRender] = useState<Coordinates[] | []>([]) // toa do đã đi
  const [coordinatesDevices, setCoordinatesDevices] = useState<Marker_Response[] | []>([])

  if (currentAssetMonitor && currentAssetMonitor?.trackers) {
    if (currentAssetMonitor?.trackers.length > 0) {
      const curentTracker = currentAssetMonitor.trackers[0].trackerId
      if (curentTracker) {
        var { data: responseDataAsset, refetch } = useQuery({
          queryKey: ['get-zones-of-asset'],
          queryFn: () => assetAPI.getAsset(currentAssetMonitor.assetId)
        })
        if (responseDataAsset?.data.data) {
          if (responseDataAsset.data.data.trackers.length > 0) {
            var totalzoneOfAsset: Zone[] = []

            responseDataAsset.data.data.trackers.forEach((a) => {
              totalzoneOfAsset = [...totalzoneOfAsset, ...a.zones]
            })

            totalzoneOfAsset = totalzoneOfAsset.filter(
              (item, index, self) => index === self.findIndex((t) => t.zoneId === item.zoneId)
            )
          }
        }

        const { data: responseDatacoordinates } = useQuery({
          queryKey: ['get-coordinates'],
          queryFn: () => coordinatesAPI.getcoordinatesByTrackerId(curentTracker)
        })
        if (responseDatacoordinates?.data.data) {
          if (responseDatacoordinates.data.data.length > 0) {
            datacoordinates = responseDatacoordinates.data.data
          }
        }
      }
    }
  } else {
    return
  }

  useEffect(() => {
    if (datacoordinates) {
      if (datacoordinates.length > 0) {
        setDatacoordinatesRender(datacoordinates)

        const coordinatesDevicesLast: Marker_Response[] = []
        coordinatesDevicesLast[0] = {
          move: true,
          point: {
            lat: datacoordinates[datacoordinates.length - 1].point.y,
            lng: datacoordinates[datacoordinates.length - 1].point.x
          }
        }
        setCoordinatesDevices(coordinatesDevicesLast)
        console.log('coordinatesDevicesLast:::', coordinatesDevicesLast)
      }
    }
  }, [datacoordinates])

  useEffect(() => {
    socket.on('disconnect', () => {
      console.log('Disconnected from server')
      socket.emit('client_join_room', { room: 'userId' }) // try reconnect
    })

    const handleUpdateLocation = (response: Marker_Response) => {
      if (!response) return

      let newCoordinatesDevices: Marker_Response[] = []
      newCoordinatesDevices[0] = response
      setCoordinatesDevices(newCoordinatesDevices)
      if (newCoordinatesDevices[0].move) {
        let newDatacoordinates: Coordinates = {
          createAt: Date.now(),
          createBy: null,
          coordinatesId: null,
          dwellTime: null,
          location: null,
          zoneEntered: [],
          updateAt: Date.now(),
          point: {
            x: 0,
            y: 0
          }
        }
        newDatacoordinates.point.y = newCoordinatesDevices[0].point.lat
        newDatacoordinates.point.x = newCoordinatesDevices[0].point.lng
        datacoordinates = [...datacoordinates, newDatacoordinates]
        setDatacoordinatesRender(datacoordinates)
      }
    }

    //  Listening even reciver update location device
    socket.on('update_location_device', handleUpdateLocation)

    socket.emit('client_join_room', { room: 'userId' })

    return () => {
      socket.emit('client_leave_room', { room: 'userId' })
      socket.off('update_location_device', handleUpdateLocation)
      socket.off('disconnect')
    }
  }, [])

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

      google.maps.event.addListener(newShape, 'click', (e: google.maps.MouseEvent) => {
        selectShape(newShape, e)
      })

      const currentCenter = map.getCenter()
      if (currentCenter) {
        setCenter(currentCenter)
      }
      setSelectedShape(newShape)
    })

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
    const shapestyle = getShapeStyle(shape)
    let positionTitle = calculateShadeCenter(shape)
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
      rules: zoneRule ? zoneRule.value : '',
      alertTo: zoneAlertTo
        ? zoneAlertTo.map((item) => {
            return item.value
          })
        : [],
      positionTitle: String(positionTitle)
    }
    excuteSubmit(payloadFormDataZone)
    setZoneRule(null)
    setZoneAlertTo(null)
    return payloadFormDataZone
  }
  const excuteSubmit = (body: formDataZone) => {
    console.log('body: ', body)
    insertZoneMutation.mutate(body as Zone, {
      onSuccess(data) {
        toast.info('Insert zone ' + data.data.data.nameZone + ' done')
        refetch()
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
  const calculateShadeCenter = (item: google.maps.Polygon | google.maps.Rectangle | google.maps.Circle) => {
    let position = null
    if (item instanceof google.maps.Circle) {
      position = item.getCenter()
    } else if (item instanceof google.maps.Rectangle) {
      position = item.getBounds()?.getCenter() || null
    } else if (item instanceof google.maps.Polygon) {
      position = calculatePolygonCenter(item)
    }
    return position
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
    sendShapeData(selectedShape)
    handleTitleChange()
  }
  const handleTitleChange = () => {
    if (selectedShape && zoneTitle) {
      setTitles((prevTitles) => {
        const exists = prevTitles.some((title) => title.shape === selectedShape)
        if (!exists) {
          return [...prevTitles, { shape: selectedShape, title: zoneTitle }]
        }
        return prevTitles
      })
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

  const handleClickShade = (zone: Zone, polygon: google.maps.Polygon) => {
    setSelectedShape(polygon)
    setFillColor(zone.fillColor)
    setStrokeColor(zone.strokeColor)
    setFillOpacity(parseFloat(zone.fillOpacity))
    setStrokeOpacity(parseFloat(zone.strokeOpacity))
    setStrokeWeight(parseFloat(zone.strokeWeight))
    setZoneTitle(zone.nameZone)
    setCurrentSelectEditZone(zone)


    const bounds = new google.maps.LatLngBounds()
    const path = polygon.getPath()
    path.forEach((latLng) => {
      bounds.extend(latLng)
    })
    const center = bounds.getCenter()
    setCenter(center)
  }
  const handlePolygonLoad = (zone: Zone) => (polygon: google.maps.Polygon) => {
    polygon.addListener('click', () => {
      handleClickShade(zone, polygon)
    })
  }
  const handleCloseModalStyle = () => {
    setSelectedShape(null)
    setFillColor('#FF0000')
    setStrokeColor('#FF0000')
    setFillOpacity(0.4)
    setStrokeOpacity(1.0)
    setStrokeWeight(1)
    setZoneTitle('')
    setZoneRule(null)
    setZoneAlertTo(null)
    setCurrentSelectEditZone(null)
  }
  const convertStringToLatLng = (str: string) => {
    const [lat, lng] = str.replace(/[()]/g, '').split(', ').map(Number)
    const latLng = new google.maps.LatLng(lat, lng)
    return latLng
  }

  const lineSymbol = {
    path: window.google?.maps.SymbolPath.CIRCLE, // Ensure `google` object is loaded
    fillOpacity: 1,
    scale: 2
  }

  const polylineOptions = {
    strokeColor: '#9f98FF',
    strokeOpacity: 0,
    cursorTo: PointerEvent,
    icons: [
      {
        icon: lineSymbol,
        offset: '0',
        repeat: '10px'
      }
    ]
  }

  // const lineSymbol = {
  //   path: 'M 0,-1 0,1',
  //   strokeOpacity: 1,
  //   scale: 3,
  //   strokeColor: 'red'
  // }

  // const polylineOptions = {
  //   strokeOpacity: 0,
  //   fillOpacity: 0,
  //   zIndex: 1,
  //   icons: [
  //     {
  //       icon: lineSymbol,
  //       offset: '0',
  //       repeat: '10px'
  //     }
  //   ]
  // }

  return (
    <div className='relative overflow-hidden rounded bg-white'>
      <div className='mb-0 rounded-t border-0 px-4 py-5'>
        <div className='flex flex-wrap items-center justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-black'>Map History</h2>
          </div>
        </div>
      </div>
      {/* <LoadScript googleMapsApiKey={API_KEY} libraries={['marker', 'geocoding', 'routes', 'geometry', 'drawing']}> */}
      <div className='overflow-hidden'>
        <GoogleMap
          id='map'
          mapContainerStyle={{ height: '80vh', width: '100%' }}
          center={center || { lat: 20, lng: 106 }}
          // center={center}
          zoom={10}
          tilt={47.5}
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
            // mapTypeId: 'hybrid',
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: 0,
              position: 23.0
            }
          }}
        >
          {/* Display Markers
          {coordinatesDevices.map((coordinate: any, index) => (
            <Marker
              key={index}
              position={{ lat: coordinate.lat, lng: coordinate.lng }}
              icon={{
                url: '../../../../public/marker.jpg',
                scaledSize: window.google ? new window.google.maps.Size(15, 15) : null // Fallback if google is not loaded
              }}
              onClick={() => console.log('Marker clicked')}
              onMouseOver={() => console.log('Mouse over Marker')}
              onMouseOut={() => console.log('Mouse out of Marker')}
            />
          ))} */}
          {/* Display Markers */}
          {coordinatesDevices.length > 0 &&
            coordinatesDevices.map((coordinate: any, index) => (
              <Marker
                key={index}
                // icon={customIcon}

                label='Z'
                position={{ lat: coordinate.point.lat, lng: coordinate.point.lng }}
                onClick={() => console.log('Marker clicked')}
                onMouseOver={() => console.log('Mouse over Marker')}
                onMouseOut={() => console.log('Mouse out of Marker')}
              />
            ))}
          {/* route */}

          {/* Polyline Dot*/}
          {createDashedPolyline2(datacoordinatesRender, 0.5).map((listCoordinates) => {
            return (
              // <div className='cursor-pointer' key={JSON.stringify(listCoordinates[-1])}>
              <Polyline
                path={listCoordinates}
                key={JSON.stringify(listCoordinates[-1])}
                options={polylineOptions}
                onClick={(e) => console.log('Polyline clicked: ', e)}
                onMouseOver={(e) => console.log('Mouse over polyline', e)}
                // onMouseOut={() => console.log('Mouse out of polyline')}
              />
              // </div>
            )
          })}

          {/* <Polyline
            path={createDashedPolyline2(datacoordinatesRender, 0.5)}
            key={JSON.stringify(datacoordinatesRender)}
            options={polylineOptions}
            onClick={() => console.log('Polyline clicked: ')}
            onMouseOver={() => console.log('Mouse over polyline')}
            onMouseOut={() => console.log('Mouse out of polyline')}
          /> */}

          {/* Display Zone */}
          {totalzoneOfAsset.length > 0 &&
            totalzoneOfAsset.map((zone) => {
              const coordinates = zone.coordinates.map(({ lat, lng }: any) => ({ lat, lng }))
              const position = zone.positionTitle ? convertStringToLatLng(zone.positionTitle) : null
              return (
                <React.Fragment key={zone.zoneId}>
                  <Polygon
                    paths={coordinates}
                    onLoad={handlePolygonLoad(zone)}
                    options={{
                      // editable: true,
                      draggable: true,
                      fillColor: zone.fillColor,
                      fillOpacity: parseFloat(zone.fillOpacity),
                      strokeColor: zone.strokeColor,
                      strokeOpacity: parseFloat(zone.strokeOpacity),
                      strokeWeight: parseFloat(zone.strokeWeight)
                    }}
                  />
                  {/* {position && (
                    <InfoWindow position={position}>
                      <div>{zone.nameZone}</div>
                    </InfoWindow>
                  )} */}
                </React.Fragment>
              )
            })}
        </GoogleMap>

        {/* {selectedShape && ( */}
        {selectedShape && (
          <Draggable handle='.handle' bounds='parent' defaultPosition={{ x: 0, y: -600 }}>
            <div className='style-form  absolute mx-auto mt-11 overflow-hidden rounded-lg border-[1px] bg-white shadow'>
              <div className='p-2'>
                <div className='flex w-full'>
                  <h3 className='handle w-full cursor-grab border-b-2 border-gray-300 p-2 font-bold'>Adjust Zone</h3>
                  <span
                    className='absolute right-0 top-0 flex w-1/12 cursor-pointer items-center justify-center rounded py-2 hover:text-gray-400'
                    onClick={() => handleCloseModalStyle()}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-6 h-4 w-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                    </svg>
                  </span>
                </div>

                <div className='mt-2 flex w-full items-center justify-between px-2 text-sm'>
                  <div className='tems-center mt-2 flex w-full flex-nowrap'>
                    <div className='zone-title-form mr-2  flex w-full items-center'>
                      <p className='w-3/12'>Set Zone Title: </p>
                      <input
                        type='text'
                        value={zoneTitle}
                        onChange={(e) => setZoneTitle(e.target.value)}
                        className='ml-2 rounded border-[1px] border-gray-300 p-2 px-1'
                        placeholder='Enter zone name'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-2 flex w-full items-center justify-between px-2 text-sm'>
                  <div className='tems-center flex w-full flex-nowrap'>
                    <div className='zone-title-form mr-2 flex w-full items-center '>
                      <p className='w-3/12'>Rule: </p>
                      {/* <input
                        type='text'
                        value={zoneRule}
                        onChange={(e) => setZoneTitle(e.target.value)}
                        className='ml-2 rounded border-2 border-gray-300 px-1'
                        placeholder='Enter zone name'
                      /> */}
                      <div className='ml-2 w-8/12'>
                        <InputDropdown
                          setSelect={setZoneRule}
                          options={optionsType}
                          // checkDisable={(nameAccount && nameAccount?.length > 0) ?? false}
                          currenValue={zoneRule}
                          isMulti={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-2 flex w-full items-center justify-between px-2 text-sm'>
                  <div className='tems-center flex w-full flex-nowrap'>
                    <div className='zone-title-form mr-2 flex w-full items-center'>
                      <p className='w-3/12'>Send alert to: </p>
                      <div className='ml-2 w-8/12'>
                        <InputDropdown
                          setSelect={setZoneAlertTo}
                          options={optionsAlert}
                          // checkDisable={(nameAccount && nameAccount?.length > 0) ?? false}
                          currenValue={zoneAlertTo}
                          isMulti={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='w-full pt-2'>
                  <p className='p-2 font-bold'>Style</p>
                  <div className='w-full rounded border-[1px] border-gray-300 py-2'>
                    <div className='flex w-full items-center px-2 text-sm'>
                      <div className='tems-center flex w-full flex-nowrap '>
                        <div className='flex w-5/12 items-center'>
                          <label className='flex'>
                            <p className='whitespace-nowrap pr-2'>Fill Color:</p>
                          </label>
                          <SearchInput
                            type='color'
                            delay={150}
                            initColor={fillColor}
                            // value={fillColor}
                            placeholder='Enter keyword...'
                            handleSearch={setFillColor}
                          />
                        </div>
                        <div className='flex w-5/12 items-center'>
                          <label className='flex'>
                            <p className='whitespace-nowrap pr-2'>Stroke Color:</p>
                          </label>
                          <SearchInput
                            initColor={strokeColor}
                            type='color'
                            delay={150}
                            placeholder='Enter keyword...'
                            handleSearch={setStrokeColor}
                          />
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
                  </div>
                </div>

                <div className='mx-2 mt-2 flex items-center justify-between border-gray-300 pt-2'>
                  <Button
                    onClick={updateShapeStyles}
                    // isLoading={true}
                    // disabled={true}
                    className='flex h-12 w-1/4 cursor-pointer items-center justify-center rounded-[7px] bg-[#e0ebff] text-sm font-semibold text-[#5b7a9d]'
                  >
                    {currentSelectEditZone ? 'Update' : 'Create'}
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
          </Draggable>
        )}
      </div>
      {/* </LoadScript> */}
    </div>
  )
}
export default CardLocation2
