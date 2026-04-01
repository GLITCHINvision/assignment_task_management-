'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, name);
      toast.success('Account Created Successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '10rem' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }} className="subtle-hover">
        <ArrowLeft size={16} /> Home
      </Link>
      
      <div style={{ maxWidth: '400px', marginTop: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '200', letterSpacing: '-0.02em', color: 'var(--primary)', marginBottom: '3rem' }}>
          Create an account.
        </h1>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '2rem' }}>
            Get Started
          </button>
        </form>
        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
