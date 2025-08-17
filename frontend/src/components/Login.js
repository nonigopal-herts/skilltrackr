import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
    const [form, setForm] = useState({ email: '', password: '' });

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        const res = await axios.post('/api/auth/login', form);
        onLogin(res.data.token);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 mt-4">
            <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Login
            </button>
        </form>
    );
}
