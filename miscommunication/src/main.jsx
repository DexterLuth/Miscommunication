import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TranscriptTable from './assets/TranscriptTable.jsx'
import Stats from './assets/Stats.jsx'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/transcripts" element={<TranscriptTable />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
