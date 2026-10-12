import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAntiTamperProtection } from './utils/security'

// Initialize anti-tamper protection (blocks Inspect, Console, F12, Right-click)
initAntiTamperProtection();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
