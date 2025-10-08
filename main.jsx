import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppPreview from './src/App.preview'
import './src/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AppPreview />
  </StrictMode>,
)