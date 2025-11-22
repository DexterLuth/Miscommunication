import { use, useState } from 'react'

import './App.css'

import TranscriptTable from './components/TranscriptTable.jsx'
import Stats from './components/Stats.jsx'

import { useNavigate } from 'react-router-dom'

function App() {
  let navigate = useNavigate();

  return (
    <>
      <h1>Miscommunication Home</h1>
      <button onClick ={() => navigate('/transcripts')}>Go to Transcripts</button>
      <button onClick ={() => navigate('/stats')}>Go to Stats</button>
    </>
  )
}

export default App
