import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './UploadFile.css';

export default function UploadFile() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');

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

        setUploading(true);
        setUploadStatus('Uploading...');

        try {
            // Read the file content
            const fileContent = await selectedFile.text();

            // Insert the transcript into the interaction table
            const { data, error } = await supabase
                .from('interaction')
                .insert([
                    {
                        transcript: fileContent,
                        date_added: new Date().toISOString(),
                        score: null, // You can set a default score or leave it null
                        agent_id: null // You can prompt for agent_id or leave it null
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

                    {selectedFile && (
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



