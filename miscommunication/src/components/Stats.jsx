import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import './Stats.css';

function Stats() {
    const navigate = useNavigate();
    const [agents, setAgents] = useState([]);
    const [interactions, setInteractions] = useState([]);
    const [avgRatings, setAvgRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            
            const { data: agentData, error: agentError } = await supabase
                .from("agent")
                .select("*");
            
            if (agentError) throw agentError;
            setAgents(agentData || []);

            const { data: interactionData, error: interactionError } = await supabase
                .from("interaction")
                .select("*");
            
            if (interactionError) throw interactionError;
            setInteractions(interactionData || []);

            const ratings = {};
            agentData?.forEach(agent => {
                const agentInteractions = interactionData?.filter(
                    i => i.agent_id === agent.id && i.score != null
                );
                const scores = agentInteractions?.map(i => i.score) || [];
                ratings[agent.id] = scores.length > 0
                    ? (scores.reduce((a, b) => a + b, 0) / scores.length)
                    : 0;
            });
            setAvgRatings(ratings);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStars = (rating) => {
        const stars = Math.round(rating);
        return "⭐".repeat(Math.min(stars, 5));
    };

    if (loading) return <div className="loading">Loading statistics...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    const totalScore = Object.values(avgRatings).reduce((a, b) => a + b, 0);
    const overallAvg = agents.length > 0 ? (totalScore / agents.length).toFixed(2) : 0;

    return (
        <div className="stats-container">
            <div className="stats-header">
                <div className="stats-title">
                    <span className="stats-title-icon">📊</span>
                    <h1>Performance Dashboard</h1>
                </div>
                <button className="back-button" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card fade-in">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{agents.length}</div>
                    <div className="stat-label">Total Agents</div>
                </div>
                <div className="stat-card fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-icon">💬</div>
                    <div className="stat-value">{interactions.length}</div>
                    <div className="stat-label">Total Interactions</div>
                </div>
                <div className="stat-card fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">{overallAvg}</div>
                    <div className="stat-label">Average Rating</div>
                </div>
            </div>

            <section className="agents-section">
                <div className="section-header">
                    <h2>Agent Performance</h2>
                    <span className="agent-count">{agents.length} agents</span>
                </div>
                <div className="agent-list">
                    {agents.map((agent, index) => (
                        <div 
                            key={agent.id} 
                            className="agent-item slide-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="agent-info">
                                <div className="agent-avatar">
                                    {getInitials(agent.name || agent.first_name)}
                                </div>
                                <div className="agent-details">
                                    <div className="agent-name">
                                        {agent.name || `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unknown Agent'}
                                    </div>
                                    <div className="agent-id">ID: {agent.id.slice(0, 8)}...</div>
                                </div>
                            </div>
                            <div className="agent-stats">
                                <div className="agent-rating">
                                    <div className="rating-value">
                                        {avgRatings[agent.id]?.toFixed(2) || "N/A"}
                                    </div>
                                    <div className="rating-label">Avg Rating</div>
                                    {avgRatings[agent.id] > 0 && (
                                        <div className="rating-stars">
                                            {getStars(avgRatings[agent.id])}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Stats;
