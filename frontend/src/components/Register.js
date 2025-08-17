import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        await axios.post('/api/auth/register', form);
        alert('Registered successfully');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 mt-4">
            <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Register
            </button>
        </form>
    );
}
