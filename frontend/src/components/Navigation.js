import React from 'react';

export default function Navigation({ isLoggedIn, onLogout }) {
    return (
        <nav className="bg-indigo-700 text-white p-4 flex justify-between">
            <div className="font-bold text-xl">SkillTrackr</div>
            {isLoggedIn && (
                <button onClick={onLogout} className="text-white hover:underline">
                    Logout
                </button>
            )}
        </nav>
    );
}
