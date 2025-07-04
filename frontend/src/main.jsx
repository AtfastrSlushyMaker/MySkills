import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './tailwind.css'
import StepApp from './StepApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StepApp />
    </BrowserRouter>
  </StrictMode>,
)
