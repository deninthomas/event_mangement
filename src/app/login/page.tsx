"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        document.cookie = `session_token=${data.token}; path=/;`; 
        router.push('/calendar');
      } else {
        alert(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (e) {
      alert('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in">
      <div className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-violet-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-white">Welcome Back</h2> 
          <p className="text-slate-400 text-center mb-8 text-sm">Sign in to manage your schedule</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-slate-300 font-medium mb-1.5 text-sm">Email Address</label>
              <input 
                id="email"
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-slate-300 font-medium mb-1.5 text-sm">Password</label>
              <input 
                id="password"
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3.5 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            
            <div className="flex justify-between items-center text-sm pt-2">
              <label className="flex items-center text-slate-400 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500" /> Remember me
              </label>
              <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">Forgot Password?</a>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>

            <div className="text-center mt-6 text-sm text-slate-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Create one
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
