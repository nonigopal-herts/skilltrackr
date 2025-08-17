import React, { useState } from 'react';
import axios from 'axios';

export default function Profile({ token }) {
    const [name, setName] = useState('');

    const updateProfile = async () => {
        await axios.put(
            '/api/user/profile',
            { name },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Profile updated');
    };

    return (
        <div className="mt-6">
            <input
                placeholder="New name"
                onChange={e => setName(e.target.value)}
                className="border p-2 w-full mb-2"
            />
            <button onClick={updateProfile} className="bg-purple-600 text-white px-4 py-2 rounded">
                Update Profile
            </button>
        </div>
    );
}
