import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AuthCard({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', niche: '' });
  const toggle = () => setMode((prev) => (prev === 'login' ? 'register' : 'login'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, form);
      onAuth?.(res.data);
    } catch (err) {
      console.error('Auth failed', err);
      alert('Authentication failed');
    }
  };

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <section className="max-w-md mx-auto bg-white/80 rounded-3xl border border-purple-100 p-6 shadow-lg shadow-purple-100/50">
      <div className="text-center mb-4">
        <p className="text-sm text-purple-500 font-semibold">CreatorLens</p>
        <h2 className="text-2xl font-semibold text-slate-800">{mode === 'login' ? 'Sign In' : 'Create Brand Account'}</h2>
        <p className="text-xs text-slate-500">Access AI-driven influencer recommendations instantly.</p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Brand name"
            value={form.name}
            onChange={update('name')}
            required
            className="w-full px-4 py-3 rounded-2xl border border-purple-100 bg-white/80 text-sm"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={update('email')}
          required
          className="w-full px-4 py-3 rounded-2xl border border-purple-100 bg-white/80 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={update('password')}
          required
          className="w-full px-4 py-3 rounded-2xl border border-purple-100 bg-white/80 text-sm"
        />
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Primary niche"
            value={form.niche}
            onChange={update('niche')}
            className="w-full px-4 py-3 rounded-2xl border border-purple-100 bg-white/80 text-sm"
          />
        )}
        <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-2xl text-sm font-semibold">
          {mode === 'login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <p className="text-xs text-center text-slate-500 mt-4">
        {mode === 'login' ? 'New to CreatorLens?' : 'Already onboard?'}{' '}
        <button className="text-purple-500 font-semibold" onClick={toggle}>
          {mode === 'login' ? 'Create account' : 'Sign in'}
        </button>
      </p>
    </section>
  );
}

