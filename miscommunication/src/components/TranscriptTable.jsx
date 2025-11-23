import './TranscriptTable.css'
import { ChevronDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function DoughnutChart(props) {
  const data = [
    { name: 'Safe', value: parseInt(props.safe * 10) },
    { name: 'Risky', value: parseInt((10 - props.safe) * 10) }
  ];

  const COLORS = {
    Safe: '#10b981',
    Risky: '#ef4444'
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'center' : 'center'}
        dominantBaseline="central"
        style={{ fontSize: '20px', fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="chart-container">
      <div className="chartWrapper">
        <h3 className="chart-title">
          <span className="chart-icon">🛡️</span>
          Safety Analysis
        </h3>

        <div className="pie-chart-wrapper">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx={200}
              cy={200}
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={150}
              innerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--ultra-light-purple)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{
                color: 'var(--text-secondary)'
              }}
            />
          </PieChart>
        </div>

        <div className="stats-summary">
          <div className="stat-summary-card" style={{ borderLeftColor: COLORS.Safe }}>
            <div className="stat-summary-dot" style={{ backgroundColor: COLORS.Safe }}></div>
            <div>
              <p className="stat-summary-label">Safe Interactions</p>
              <p className="stat-summary-value">{data[0].value}%</p>
            </div>
          </div>

          <div className="stat-summary-card" style={{ borderLeftColor: COLORS.Risky }}>
            <div className="stat-summary-dot" style={{ backgroundColor: COLORS.Risky }}></div>
            <div>
              <p className="stat-summary-label">Risk Detected</p>
              <p className="stat-summary-value">{data[1].value}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Entry(props) {
  const { callerid, agentid, transcript, safe } = props;
  const [open, setOpen] = useState(false);

  const getScoreClass = (score) => {
    if (score >= 7) return 'score-high';
    if (score >= 5) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="wrapper">
      <button
        className="rowButton"
        onClick={() => setOpen(!open)}
      >
        <div className="cell caller-cell">
          <span className="cell-icon">👤</span>
          <span className="cell-text">{callerid}</span>
        </div>
        <div className="cell agent-cell">
          <span className="cell-icon">🎧</span>
          <span className="cell-text agent-id-cell">{agentid}</span>
        </div>
        <div className={`cell score-cell ${getScoreClass(safe)}`}>
          <span className="score-text">{safe.toFixed(1)}</span>
        </div>
        <div className={`chevronCell ${open} ? 'rotated' : ''`}>
          <ChevronDown
            className={`chevron ${open ? 'rotated' : ''}`}
          />
        </div>
      </button>

      <div className={`expandedContent ${open ? 'open' : ''}`}>
        <div className="detailsGrid">
          <div className="transcript-section">
            <div className="section-header-expanded">
              <span className="section-icon">📝</span>
              <h3 className="section-title">Conversation Transcript</h3>
            </div>
            <div className="transcript-box">
              <div className="transcriptValue">{transcript}</div>
            </div>
            <div className="transcript-meta">
              <div className="meta-item">
                <span className="meta-label">Caller:</span>
                <span className="meta-value">{callerid}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Agent:</span>
                <span className="meta-value">{agentid}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Safety Score:</span>
                <span className={`meta-value ${getScoreClass(safe).replace('score-', 'score-')}`}>
                  {safe.toFixed(1)}/10
                </span>
              </div>
            </div>
          </div>

          <div className="chart-section">
            <DoughnutChart safe={safe} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TranscriptTable() {
  const navigate = useNavigate();
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interaction')
        .select('*');

      if (error) throw error;

      // Map the data to match the component structure
      const formattedData = data.map(item => ({
        callid: item.id?.slice(0, 8) || 'Unknown',
        agentid: item.agent_id?.slice(0, 8) || 'Unknown',
        transcript: item.transcript || 'No transcript available',
        safe: item.score || 5
      }));

      setTranscripts(formattedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function boldWords(text) {
    const words = ['Client', 'Banker'];
    const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");

    return text.split(regex).map((part, i) =>
      words.some(word => word.toLowerCase() === part.toLowerCase()) 
        ? <strong key={i} className="highlighted-speaker">{part}</strong> 
        : part
    );
  }

  const filteredTranscripts = transcripts.filter(t =>
    t.callid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.agentid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading transcripts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="transcript-container">
      <div className="transcript-header">
        <div className="transcript-title">
          <span className="transcript-title-icon">📝</span>
          <h1>Conversation Transcripts</h1>
        </div>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search by Caller or Agent ID..."
          className="filter-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="results-count">
          {filteredTranscripts.length} {filteredTranscripts.length === 1 ? 'result' : 'results'}
        </div>
      </div>

      {filteredTranscripts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">No transcripts found</div>
          <div className="empty-state-subtext">
            {searchTerm ? 'Try adjusting your search terms' : 'No data available yet'}
          </div>
        </div>
      ) : (
        <div className="table">
          <div className="header">
            <div className="headerCell">
              <span className="header-icon">👤</span>
              Caller ID
            </div>
            <div className="headerCell">
              <span className="header-icon">🎧</span>
              Agent ID
            </div>
            <div className="headerCell">
              <span className="header-icon">🛡️</span>
              Score
            </div>
            <div className="headerCell"></div>
          </div>
          {filteredTranscripts.map((item, index) => (
            <Entry
              key={index}
              callerid={item.callid}
              agentid={item.agentid}
              transcript={boldWords(item.transcript)}
              safe={item.safe}
            />
          ))}
        </div>
      )}
    </div>
  );
}