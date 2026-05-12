import React, { useState } from 'react';
import { useKeys } from '../context/KeysContext';

const Field = ({ label, placeholder, value, onChange, hint }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--muted)', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
      {label}
    </label>
    <input
      type="password"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 14px',
        color: 'var(--text)',
        fontSize: 13,
        fontFamily: 'var(--font-body)',
      }}
    />
    {hint && <p style={{ fontSize: 11, color: 'var(--hint)', marginTop: 4 }}>{hint}</p>}
  </div>
);

export default function SettingsPage() {
  const { keys, persistKeys, keySaved, userId } = useKeys();
  const [form, setForm] = useState({ ...keys });

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    await persistKeys(form);
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Settings</h1>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '2rem' }}>
        Your API keys are stored in Supabase, tied to your browser session. They are never shared.
      </p>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1.25rem', color: 'var(--muted)' }}>API Keys</h2>

        <Field
          label="OpenAI API Key"
          placeholder="sk-..."
          value={form.openai_key}
          onChange={set('openai_key')}
          hint="Get yours at platform.openai.com/api-keys"
        />
        <Field
          label="Google Gemini API Key"
          placeholder="AIza..."
          value={form.gemini_key}
          onChange={set('gemini_key')}
          hint="Get yours at aistudio.google.com/app/apikey"
        />
        <Field
          label="Anthropic API Key"
          placeholder="sk-ant-..."
          value={form.anthropic_key}
          onChange={set('anthropic_key')}
          hint="Required for synthesis. Get yours at console.anthropic.com/settings/keys"
        />

        <button
          onClick={handleSave}
          style={{
            background: keySaved ? 'rgba(16,163,127,0.12)' : 'var(--text)',
            color: keySaved ? '#10a37f' : 'var(--bg)',
            border: keySaved ? '1px solid #10a37f' : 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'var(--font-display)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {keySaved ? '✓ Saved' : 'Save Keys'}
        </button>
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '1.25rem 1.5rem',
      }}>
        <p style={{ fontSize: 12, color: 'var(--hint)', lineHeight: 1.6 }}>
          Your session ID: <code style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}>{userId}</code>
        </p>
      </div>
    </div>
  );
}
