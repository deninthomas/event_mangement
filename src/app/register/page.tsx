"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);

    const payload = {
      name,
      email,
      password,
      // BUG INJECTED #75: Hardcodes the role to 'admin' in the request payload! 
      role: 'admin' 
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if(data.success) {
        alert('Registration successful! Please log in.');
        router.push('/login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch(err) {
      alert('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 animate-fade-in py-10">
      <div className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-md relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-violet-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-white">Join Us</h2> 
          <p className="text-slate-400 text-center mb-8 text-sm">Create an account to manage your events</p>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="nameInput" className="block text-slate-300 font-medium mb-1.5 text-sm">Full Name</label>
              <input 
                id="nameInput"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="emailInput" className="block text-slate-300 font-medium mb-1.5 text-sm">Email Address</label>
              <input 
                id="emailInput"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="pwd" className="block text-slate-300 font-medium mb-1.5 text-sm">Password</label>
              <input 
                id="pwd"
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="cpwd" className="block text-slate-300 font-medium mb-1.5 text-sm">Confirm Password</label>
              <input 
                id="cpwd"
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div className="text-xs text-slate-400 mt-2 text-center pt-2">
              By registering, you agree to our 
              <a href="#" className="text-violet-400 mx-1 hover:underline">Terms of Service</a>.
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
