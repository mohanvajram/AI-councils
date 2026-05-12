import React from 'react';

const AI_META = {
  ChatGPT: { color: '#10a37f', bg: 'rgba(16,163,127,0.1)', initial: 'G', label: 'gpt-4o' },
  Gemini:  { color: '#4285f4', bg: 'rgba(66,133,244,0.1)', initial: 'G', label: 'gemini-1.5-flash' },
  Claude:  { color: '#cc785c', bg: 'rgba(204,120,92,0.1)', initial: 'C', label: 'claude-sonnet' },
};

export default function AiBubble({ aiName, content, isLoading }) {
  const meta = AI_META[aiName] || { color: '#888', bg: 'rgba(136,136,136,0.1)', initial: aiName[0], label: '' };

  return (
    <div className="fade-in" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: meta.bg,
          border: `1.5px solid ${meta.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: meta.color,
          flexShrink: 0,
        }}>{meta.initial}</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: meta.color }}>
          {aiName}
        </span>
        <span style={{ fontSize: 11, color: 'var(--hint)', marginLeft: 'auto' }}>{meta.label}</span>
      </div>
      {isLoading ? (
        <div style={{ display: 'flex', gap: 5, padding: '4px 0' }}>
          {[0,1,2].map(i => (
            <div key={i} className="pulse" style={{
              width: 6, height: 6, borderRadius: '50%',
              background: meta.color,
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)' }}>{content}</p>
      )}
    </div>
  );
}
