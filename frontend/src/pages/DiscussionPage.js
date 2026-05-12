import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSession } from '../services/api';
import AiBubble from '../components/AiBubble';
import SynthesisCard from '../components/SynthesisCard';

export default function DiscussionPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getSession(id)
      .then(r => setSession(r.data))
      .catch(() => setError('Session not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ color: 'var(--muted)', padding: '2rem' }}>Loading…</div>;
  if (error) return <div style={{ color: '#f87171', padding: '2rem' }}>{error}</div>;
  if (!session) return null;

  return (
    <div>
      <Link to="/history" style={{ fontSize: 13, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: '1.5rem' }}>
        ← History
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {session.session.question}
        </h1>
        <p style={{ fontSize: 12, color: 'var(--hint)' }}>
          {new Date(session.session.created_at).toLocaleString()}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {session.messages.map(m => (
          <AiBubble key={m.id} aiName={m.ai_name} content={m.content} />
        ))}
        {session.synthesis && <SynthesisCard content={session.synthesis.content} />}
      </div>
    </div>
  );
}
