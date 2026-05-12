import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeys } from '../context/KeysContext';
import { runDiscussion } from '../services/api';
import AiBubble from '../components/AiBubble';
import SynthesisCard from '../components/SynthesisCard';

const AI_OPTIONS = [
  { id: 'use_openai', label: 'ChatGPT', color: '#10a37f' },
  { id: 'use_gemini', label: 'Gemini',  color: '#4285f4' },
  { id: 'use_claude', label: 'Claude',  color: '#cc785c' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { userId, keys } = useKeys();

  const [question, setQuestion] = useState('');
  const [selected, setSelected] = useState({ use_openai: true, use_gemini: true, use_claude: true });
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(null);
  const [messages, setMessages] = useState([]);
  const [synthesis, setSynthesis] = useState(null);
  const [synthLoading, setSynthLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState(null);

  const toggle = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));

  const handleAsk = async () => {
    if (!question.trim()) return;
    if (!keys.anthropic_key) {
      setError('Please add your Anthropic API key in Settings first.');
      return;
    }

    setError('');
    setLoading(true);
    setMessages([]);
    setSynthesis(null);
    setSynthLoading(false);

    try {
      const payload = {
        question: question.trim(),
        user_identifier: userId,
        ...selected,
        ...keys,
      };
      const { data } = await runDiscussion(payload);
      setMessages(data.messages);
      setSessionId(data.session.id);
      if (data.synthesis) setSynthesis(data.synthesis.content);
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong. Check your API keys and backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10 }}>
          Ask the Council
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15 }}>
          ChatGPT, Gemini, and Claude discuss your question — then deliver one answer.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {AI_OPTIONS.map(({ id, label, color }) => (
          <button key={id} onClick={() => toggle(id)} style={{
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            background: selected[id] ? `${color}18` : 'transparent',
            border: `1px solid ${selected[id] ? color : 'var(--border)'}`,
            color: selected[id] ? color : 'var(--muted)',
            transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
          placeholder="Ask anything — e.g. Will AI replace software engineers?"
          rows={3}
          style={{
            width: '100%',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '16px 140px 16px 18px',
            color: 'var(--text)',
            fontSize: 15,
            resize: 'none',
            lineHeight: 1.6,
          }}
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim()}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: loading ? 'var(--surface2)' : 'var(--text)',
            color: loading ? 'var(--muted)' : 'var(--bg)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {loading ? 'Asking…' : 'Ask Council'}
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          color: '#f87171',
          fontSize: 13,
          marginBottom: '1.5rem',
        }}>{error}</div>
      )}

      {messages.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {messages.map((m, i) => (
            <AiBubble key={m.id} aiName={m.ai_name} content={m.content} />
          ))}
          {synthesis && <SynthesisCard content={synthesis} />}
        </div>
      )}

      {sessionId && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={() => navigate(`/discussion/${sessionId}`)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border2)',
              borderRadius: 20,
              padding: '8px 20px',
              fontSize: 13,
              color: 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            View full session →
          </button>
        </div>
      )}

      {!messages.length && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--hint)',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12, display: 'flex', justifyContent: 'center', gap: 12 }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--openai)', display: 'inline-block', marginTop: 4 }} />
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--gemini)', display: 'inline-block', marginTop: 4 }} />
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--claude)', display: 'inline-block', marginTop: 4 }} />
          </div>
          <p style={{ fontSize: 14 }}>Type a question above to start the council</p>
        </div>
      )}
    </div>
  );
}
