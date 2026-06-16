"use client";

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    // In a real app we'd get the token from localStorage or cookies. For testing bugs, we just simulate the fetch.
    const token = localStorage.getItem('token') || '';
    fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data.data);
          setFormData({ name: data.data.name, email: data.data.email });
        }
      });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || '';
    
    // BUG INJECTED #39: Storing the raw form data state into localStorage directly before sending, potentially leaking PII.
    localStorage.setItem('draftProfile', JSON.stringify(formData));

    await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(formData)
    });
    
    setIsEditing(false);
    setProfile({ ...profile, ...formData });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || '';
    
    await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(passwordData)
    });

    // BUG INJECTED #40: Doesn't clear the password fields after a successful update, leaving them visible on screen.
    alert('Password updated (maybe?)');
  };

  if (!profile) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl flex flex-col md:flex-row gap-8">
      {/* Profile Card */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex-1">
        <h2 className="text-2xl font-bold mb-6 text-violet-400">Your Profile</h2>
        
        {isEditing ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1">Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
              />
            </div>
            {/* BUG INJECTED #41: The save button is outside the form and triggers submit via an onClick instead of type="submit", which sometimes fails to trigger HTML5 validation */}
            <div className="flex gap-4">
              <button onClick={handleUpdateProfile} className="bg-violet-600 hover:bg-violet-500 px-4 py-2 rounded font-bold transition-colors">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded font-bold transition-colors">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-slate-400 text-sm">Name</p>
              <p className="text-lg font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Email</p>
              <p className="text-lg font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Role</p>
              <p className="text-lg font-medium capitalize">{profile.role}</p>
            </div>
            <button onClick={() => setIsEditing(true)} className="mt-4 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-bold transition-colors">
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex-1">
        <h2 className="text-2xl font-bold mb-6 text-indigo-400">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-1">Current Password</label>
            {/* BUG INJECTED #42: Input type is "text" instead of "password" for the old password, so anyone looking over the shoulder can see it. */}
            <input 
              type="text" 
              value={passwordData.oldPassword} 
              onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">New Password</label>
            <input 
              type="password" 
              value={passwordData.newPassword} 
              onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
              required
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-bold transition-colors">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
