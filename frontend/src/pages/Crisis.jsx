const HELPLINES = [
  { name: 'iCall — TISS', number: '9152987821', desc: 'Mon–Sat, 8am–10pm · Counselling & support', emoji: '📞' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 · Free mental health helpline', emoji: '📞' },
  { name: 'NIMHANS', number: '080-46110007', desc: 'National mental health helpline', emoji: '🏥' },
  { name: 'Snehi', number: '044-24640050', desc: 'Emotional support helpline', emoji: '💬' },
  { name: 'Sumaitri', number: '011-23389090', desc: 'Suicide prevention · Delhi', emoji: '🤝' },
  { name: 'iCall (Chat)', number: null, desc: 'icallhelpline.in — Online counselling', emoji: '💻', link: 'https://icallhelpline.in' },
];

const SELF_HELP = [
  { emoji: '🫁', title: 'Breathe', desc: 'Do the 4-7-8 breathing exercise to calm your nervous system immediately.', action: '/breathe' },
  { emoji: '💬', title: 'Talk to Mira', desc: 'Our AI companion is available 24/7. Sometimes just expressing yourself helps.', action: '/chat' },
  { emoji: '📓', title: 'Journal it out', desc: 'Write down what you are feeling — getting it out of your head can reduce overwhelm.', action: '/journal/new' },
];

export default function Crisis() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Crisis Support 🆘</div>
        <div className="page-sub">You are not alone. Real help is just a call away.</div>
      </div>

      <div className="crisis-banner">
        <div style={{ fontSize: 24 }}>🚨</div>
        <div className="crisis-text" style={{ fontSize: 15 }}>
          <strong>If you are in immediate danger</strong> or feel you might harm yourself, please call emergency services at <strong>112</strong> right now.
        </div>
        <a href="tel:112"><button className="btn-crisis">Call 112</button></a>
      </div>

      <div className="section-label" style={{ marginTop: 20 }}>Helplines — India</div>
      {HELPLINES.map((h, i) => (
        <div key={i} className="resource-item">
          <div className="res-emoji">{h.emoji}</div>
          <div style={{ flex: 1 }}>
            <div className="res-name">{h.name}</div>
            <div className="res-desc">{h.number || h.desc}</div>
            {h.number && <div className="res-desc">{h.desc}</div>}
          </div>
          {h.number ? (
            <a href={`tel:${h.number}`} style={{ textDecoration: 'none' }}>
              <button style={{ background: 'var(--red)', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600 }}>
                Call
              </button>
            </a>
          ) : (
            <a href={h.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600 }}>
                Visit
              </button>
            </a>
          )}
        </div>
      ))}

      <div className="section-label" style={{ marginTop: 24 }}>Immediate self-help</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        {SELF_HELP.map((s, i) => (
          <a key={i} href={s.action} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
            >
              <div style={{ fontSize: 30, marginBottom: 10 }}>{s.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          </a>
        ))}
      </div>

      <div className="card" style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 8 }}>💚 Remember</div>
        <div style={{ fontSize: 14, color: '#085041', lineHeight: 1.7 }}>
          What you're feeling is real and valid. Reaching out for help is one of the bravest things you can do.
          You don't have to face this alone — trained counsellors are waiting to listen without judgment.
        </div>
      </div>
    </div>
  );
}
