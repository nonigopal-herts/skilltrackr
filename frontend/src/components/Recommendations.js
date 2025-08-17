import React, { useState } from 'react';
import axios from 'axios';

export default function Recommendations({ token, uploadedFilename }) {
    const [careers, setCareers] = useState([]);

    const fetchRecommendations = async () => {
        const res = await axios.post(
            '/api/recommend',
            { file: uploadedFilename },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setCareers(res.data.careers);
    };

    return (
        <div className="mt-6">
            <p className="mb-2 text-sm text-gray-700">File: {uploadedFilename}</p>
            <button onClick={fetchRecommendations} className="bg-indigo-600 text-white px-4 py-2 rounded">
                Get Career Recommendations
            </button>
            <ul className="list-disc mt-4 ml-6 text-gray-800">
                {careers.map((career, idx) => (
                    <li key={idx}>{career}</li>
                ))}
            </ul>
        </div>
    );
}
