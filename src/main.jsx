import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import societyLogo from './assets/logo/logo.png.jpeg'
import './index.css'
import App from './App.jsx'

const favicon = document.querySelector('link[rel="icon"]')

if (favicon) {
  favicon.href = societyLogo
  favicon.type = 'image/jpeg'
} else {
  const faviconLink = document.createElement('link')
  faviconLink.rel = 'icon'
  faviconLink.type = 'image/jpeg'
  faviconLink.href = societyLogo
  document.head.appendChild(faviconLink)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
