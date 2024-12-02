import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppProvider } from './Context/app.context'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LoadScript } from '@react-google-maps/api'

// Create a client
const queryClient = new QueryClient()
const API_KEY = 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppProvider>
        <LoadScript googleMapsApiKey={API_KEY} libraries={['marker', 'geocoding', 'routes', 'geometry', 'drawing']}>
          <App />
        </LoadScript>
        <ToastContainer />
      </AppProvider>
    </BrowserRouter>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
)
