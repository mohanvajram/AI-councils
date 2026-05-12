import React from 'react';

export default function SynthesisCard({ content, isLoading }) {
  return (
    <div className="fade-in" style={{
      background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(167,139,250,0.03))',
      border: '1px solid rgba(167,139,250,0.25)',
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      marginTop: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--synth)',
        }} />
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--synth)',
        }}>Synthesized Answer</span>
      </div>
      {isLoading ? (
        <div style={{ display: 'flex', gap: 5, padding: '4px 0' }}>
          {[0,1,2].map(i => (
            <div key={i} className="pulse" style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--synth)',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text)' }}>{content}</p>
      )}
    </div>
  );
}
