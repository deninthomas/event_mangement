"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Rough mock check for admin, since we injected a bug where role might not be checked properly anyway.
      // We parse the JWT manually (very unsafe, but fits the buggy app theme).
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') setIsAdmin(true);
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 hover:opacity-80 transition-opacity">
          EventCalendar
        </Link>
        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link href="/calendar" className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors">Calendar</Link>
              <Link href="/profile" className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors">Profile</Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 hover:opacity-80 transition-opacity">Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="text-sm font-medium px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
              <Link href="/register" className="text-sm font-medium px-5 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-105">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
