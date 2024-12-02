import React from 'react'

interface SVGComponentProps {
  color?: string
  size?: number
}

export const SVGComponent: React.FC<SVGComponentProps> = () => {
  return (
    <svg
      fill='#000000'
      width='800px'
      height='800px'
      viewBox='0 0 24 24'
      id='gps-location'
      data-name='Line Color'
      xmlns='http://www.w3.org/2000/svg'
      className='icon line-color'
    >
      <path
        id='secondary'
        d='M12,3V5m9,7H19m-7,9V19M3,12H5m9-1a2,2,0,0,0-4,0c0,2,2,4,2,4S14,13,14,11Z'
        style={{
          fill: 'none',
          stroke: 'rgb(44, 169, 188)',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2
        }}
      />
      <circle
        id='primary'
        cx={12}
        cy={12}
        r={7}
        style={{
          fill: 'none',
          stroke: 'rgb(0, 0, 0)',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2
        }}
      />
    </svg>
  )
}

const svgToDataUrl = (svg: string) => {
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Tạo chuỗi SVG
const createSvgString = (color: string, size: number) => {
  return `  <svg
    fill="#000000"
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    id="gps-location"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}
  >
    <path
      id="secondary"
      d="M12,3V5m9,7H19m-7,9V19M3,12H5m9-1a2,2,0,0,0-4,0c0,2,2,4,2,4S14,13,14,11Z"
      style={{
        fill: "none",
        stroke: "rgb(44, 169, 188)",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <circle
      id="primary"
      cx={12}
      cy={12}
      r={7}
      style={{
        fill: "none",
        stroke: "rgb(0, 0, 0)",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
  </svg>`
}

// Chuyển đổi SVG thành data URL
const svgHtml = createSvgString('red', 24)
export const svgDataUrl = svgToDataUrl(svgHtml)
