import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Registration successful! Check your email to verify your account if required.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-brand-bg text-white selection:bg-cyan-500/30 font-sans">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-brand-border rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-brand-accent italic mb-2">STEM<span className="text-white">Edge</span></h1>
          <p className="text-slate-400 text-sm">Interactive Learning Engine v2.0</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-lg text-center">{message}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="student@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-brand-accent text-black font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-cyan-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
            className="text-xs text-slate-400 hover:text-brand-accent transition-colors underline underline-offset-4"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
