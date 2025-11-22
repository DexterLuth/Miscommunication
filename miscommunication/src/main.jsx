import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TranscriptTable from './assets/TranscriptTable.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TranscriptTable />
  </StrictMode>,
)
