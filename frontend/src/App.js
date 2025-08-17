import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import ResumeUpload from './components/ResumeUpload';
import Recommendations from './components/Recommendations';
import Navigation from './components/Navigation';

function App() {
    const [token, setToken] = useState('');
    const [uploadedFilename, setUploadedFilename] = useState('');

    const handleLogout = () => {
        setToken('');
        setUploadedFilename('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation isLoggedIn={!!token} onLogout={handleLogout} />
            <main className="max-w-2xl mx-auto p-6">
                {!token ? (
                    <>
                        <Register />
                        <Login onLogin={setToken} />
                    </>
                ) : (
                    <>
                        <Profile token={token} />
                        <ResumeUpload token={token} onUpload={setUploadedFilename} />
                        {uploadedFilename && (
                            <Recommendations token={token} uploadedFilename={uploadedFilename} />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default App;
