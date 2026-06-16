"use client";

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  
  // BUG INJECTED #49: Exposes admin token hardcoded in state if not found in localStorage! Extremely dangerous fallback.
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || 'admin_fallback_token_123';
    setToken(storedToken);

    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setUsers(data.data); });

    fetch('/api/admin/events', { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(res => res.json())
      .then(data => { if (data.success) setEvents(data.data); });
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    // BUG INJECTED #50: Doesn't update the local state after changing status, requiring a hard refresh to see the change.
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, isActive: !currentStatus })
    });
    alert('User status updated. Please refresh the page to see changes.');
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-red-400 border-b border-red-500/30 pb-4">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-violet-400">Manage Users</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {users.map(user => (
              <div key={user._id} className="bg-slate-900 p-4 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                  <p className="text-xs text-slate-500">Role: {user.role}</p>
                </div>
                <button 
                  onClick={() => toggleUserStatus(user._id, user.isActive)}
                  className={`px-3 py-1 rounded text-sm font-bold ${user.isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-indigo-400">All Events</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {events.map(event => (
              <div key={event._id} className="bg-slate-900 p-4 rounded">
                <p className="font-bold">{event.title}</p>
                <p className="text-sm text-slate-400">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-xs text-slate-500 mt-2">
                  Created by: {event.createdBy?.name || 'Unknown User'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
