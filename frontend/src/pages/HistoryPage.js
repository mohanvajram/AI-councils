import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listSessions } from '../services/api';

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSessions()
      .then(r => setSessions(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
        History
      </h1>

      {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}

      {!loading && sessions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--hint)',
        }}>
          <p>No sessions yet. Go ask the council something!</p>
          <Link to="/" style={{
            display: 'inline-block', marginTop: 16,
            padding: '8px 20px',
            background: 'var(--surface2)',
            borderRadius: 20,
            fontSize: 13,
            color: 'var(--text)',
          }}>Start a discussion →</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sessions.map(s => (
          <Link key={s.id} to={`/discussion/${s.id}`} style={{
            display: 'block',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '16px 20px',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6, color: 'var(--text)' }}>
              {s.question}
            </p>
            <p style={{ fontSize: 12, color: 'var(--hint)' }}>
              {new Date(s.created_at).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
