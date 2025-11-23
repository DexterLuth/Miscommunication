import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './UploadFile.css';

export default function UploadFile() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [loadingAgents, setLoadingAgents] = useState(true);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            setLoadingAgents(true);
            const { data, error } = await supabase
                .from('agent')
                .select('id, first_name, last_name')
                .order('first_name', { ascending: true });

            if (error) throw error;

            setAgents(data || []);
        } catch (error) {
            console.error('Error fetching agents:', error);
            setUploadStatus('✗ Failed to load agents');
        } finally {
            setLoadingAgents(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
                setUploadStatus('✗ Please select a .txt file');
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setUploadStatus('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('✗ Please select a file first');
            return;
        }

        if (!selectedAgent) {
            setUploadStatus('✗ Please select an agent');
            return;
        }

        setUploading(true);
        setUploadStatus('Uploading...');

        try {
            // Read the file content
            const fileContent = await selectedFile.text();

            await fetch("http://127.0.0.1:5000/response", {
                method:'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    file: fileContent
                })
            })
            .then((res) => {console.log(res.json())})
            .catch(err => {console.log(err)})

            // Insert the transcript into the interaction table
            const { data, error } = await supabase
                .from('interaction')
                .insert([
                    {
                        transcript: fileContent,
                        date_added: new Date().toISOString(),
                        score: null,
                        agent_id: selectedAgent
                    }
                ])
                .select();

            if (error) throw error;

            setUploadStatus('✓ File uploaded successfully!');
            setTimeout(() => {
                navigate('/transcripts');
            }, 2000);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('✗ Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <div className="upload-container">
            <div className="upload-header">
                <div className="upload-title">
                    <span className="upload-title-icon">📁</span>
                    <h1>Upload Transcript</h1>
                </div>
                <button className="back-button" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
            </div>

            <div className="upload-card">
                <div className="upload-area">
                    <div className="upload-icon">☁️</div>
                    <h2 className="upload-heading">Upload Transcript File</h2>
                    <p className="upload-description">
                        Select a .txt file containing the conversation transcript
                    </p>

                    {/* Agent Selection Dropdown */}
                    <div className="agent-selection">
                        <label htmlFor="agentSelect" className="agent-label">
                            <span className="label-icon">🎧</span>
                            Select Agent
                        </label>
                        <select
                            id="agentSelect"
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                            className="agent-select"
                            disabled={loadingAgents || uploading}
                        >
                            <option value="">
                                {loadingAgents ? 'Loading agents...' : '-- Choose an agent --'}
                            </option>
                            {agents.map((agent) => (
                                <option key={agent.id} value={agent.id}>
                                    {agent.first_name} {agent.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="file"
                        id="fileInput"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept=".txt"
                    />

                    <button 
                        className="select-file-button" 
                        onClick={triggerFileInput}
                        disabled={uploading}
                    >
                        <span className="button-icon">📂</span>
                        {selectedFile ? 'Change File' : 'Select .txt File'}
                    </button>

                    {selectedFile && (
                        <div className="file-info">
                            <div className="file-icon">📄</div>
                            <div className="file-details">
                                <p className="file-name">{selectedFile.name}</p>
                                <p className="file-size">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                    )}

                    {selectedFile && selectedAgent && (
                        <button 
                            className="upload-submit-button" 
                            onClick={handleUpload}
                            disabled={uploading}
                        >
                            <span className="button-icon">⬆️</span>
                            {uploading ? 'Uploading...' : 'Upload to Database'}
                        </button>
                    )}

                    {uploadStatus && (
                        <div className={`upload-status ${uploadStatus.includes('✓') ? 'success' : uploadStatus.includes('✗') ? 'error' : 'info'}`}>
                            {uploadStatus}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}



