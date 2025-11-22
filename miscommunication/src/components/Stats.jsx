import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import './Stats.css';
import StatsTable from "./StatsTable";

export default function Stats() {
    const [stats, setStats] = useState([{
        agent_id: null,
        first_name: null,
        last_name: null,
        interaction_count: null,
        average_score: null
    }]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.rpc('stats_for_agents');
                
            if (error) {
                setError(error.message);
            }
            else {
                setStats(data);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading stats...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <h1>Stats Page</h1>
            
            <StatsTable stats={stats} />
        </>
    );
}
