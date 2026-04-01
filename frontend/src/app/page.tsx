'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowUpRight } from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <main style={{ maxWidth: '800px' }}>
        <h1 style={{ 
          fontSize: '5rem', 
          fontWeight: '200', 
          letterSpacing: '-0.04em', 
          lineHeight: '0.9',
          marginBottom: '2rem',
          color: 'var(--primary)'
        }}>
          Simplicity is the <br/> ultimate <span style={{ color: 'var(--secondary)', fontWeight: '400' }}>sophistication.</span>
        </h1>
        
        <p style={{ fontSize: '1.25rem', fontWeight: '300', color: 'var(--text-muted)', marginBottom: '4rem', maxWidth: '500px' }}>
          Accelerate your workflow with TaskFlow. A minimalist approach to high-performance task management.
        </p>
        
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          {isAuthenticated ? (
            <Link href="/dashboard" className="subtle-hover" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Enter Dashboard <ArrowUpRight size={18} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="primary-btn">
                Launch System
              </Link>
              <Link href="/register" className="subtle-hover" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                Create Account
              </Link>
            </>
          )}
        </div>
      </main>
      
      <footer style={{ marginTop: 'auto', padding: '4rem 0', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', opacity: 0.5 }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TaskFlow © 2026</span>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </footer>
    </div>
  );
}
