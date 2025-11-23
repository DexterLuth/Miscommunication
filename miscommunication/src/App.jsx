import { useState } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1 className="app-title">Miscommunication Dashboard</h1>
      <p className="app-subtitle">
        Analyze agent interactions and track performance metrics
      </p>
      
      <div className="button-group">
        <button className="nav-button" onClick={() => navigate('/transcripts')}>
          <span className="icon">📝</span>
          <span>View Transcripts</span>
        </button>
        <button className="nav-button" onClick={() => navigate('/stats')}>
          <span className="icon">📊</span>
          <span>View Statistics</span>
        </button>
        <button className= "upload-button" onClick={() => navigate('/upload')}>
          <span className="icon">⬆️</span>
          <span>Upload Data</span>
        </button>
      </div>

      <div className="feature-grid">
        <div className="feature-card fade-in">
          <span className="feature-icon">🔍</span>
          <h3 className="feature-title">Detailed Analysis</h3>
          <p className="feature-description">
            Review complete conversation transcripts with timestamps and context
          </p>
        </div>
        <div className="feature-card fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="feature-icon">📈</span>
          <h3 className="feature-title">Performance Metrics</h3>
          <p className="feature-description">
            Track agent ratings and interaction counts in real-time
          </p>
        </div>
        <div className="feature-card fade-in" style={{ animationDelay: '0.2s' }}>
          <span className="feature-icon">⚡</span>
          <h3 className="feature-title">Fast & Responsive</h3>
          <p className="feature-description">
            Built with modern tech for smooth performance and reliability
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
