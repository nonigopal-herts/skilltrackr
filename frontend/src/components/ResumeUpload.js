import React, { useState } from 'react';
import axios from 'axios';

export default function ResumeUpload({ token, onUpload }) {
    const [file, setFile] = useState(null);

    const uploadResume = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('resume', file);
        const res = await axios.post('/api/resume/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        alert('Resume uploaded');
        onUpload(res.data.file); // save file name
    };

    return (
        <form onSubmit={uploadResume} className="mt-6">
            <input type="file" onChange={e => setFile(e.target.files[0])} className="mb-2" />
            <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">
                Upload Resume
            </button>
        </form>
    );
}
