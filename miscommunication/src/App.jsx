import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
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
