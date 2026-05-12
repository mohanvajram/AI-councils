import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Council' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60,
        position: 'sticky',
        top: 0,
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'conic-gradient(from 0deg, var(--openai), var(--gemini), var(--claude), var(--openai))',
            flexShrink: 0,
          }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
            AI Council
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: 4 }}>
          {navLinks.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link key={to} to={to} style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
                color: active ? 'var(--text)' : 'var(--muted)',
                background: active ? 'var(--surface2)' : 'transparent',
                transition: 'all 0.15s',
              }}>{label}</Link>
            );
          })}
        </nav>
      </header>

      <main style={{ flex: 1, padding: '2rem', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        {children}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1rem 2rem',
        textAlign: 'center',
        fontSize: 12,
        color: 'var(--hint)',
      }}>
        AI Council — ChatGPT · Gemini · Claude discussing together
      </footer>
    </div>
  );
}
