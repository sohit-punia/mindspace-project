import { useState, useEffect, useRef } from 'react';

const PHASES = [
  { label: 'Inhale', instruction: 'Breathe in slowly through your nose', duration: 4, scale: true },
  { label: 'Hold', instruction: 'Hold your breath gently', duration: 7, scale: true },
  { label: 'Exhale', instruction: 'Breathe out slowly through your mouth', duration: 8, scale: false },
];

const EXERCISES = [
  {
    title: '5-4-3-2-1 Grounding',
    emoji: '👁️',
    desc: 'Engage your senses to anchor yourself to the present moment',
    steps: ['Name 5 things you can SEE right now', 'Name 4 things you can physically FEEL', 'Name 3 things you can HEAR', 'Name 2 things you can SMELL', 'Name 1 thing you can TASTE']
  },
  {
    title: 'Progressive Muscle Relaxation',
    emoji: '💪',
    desc: 'Tense and release muscle groups to release physical tension',
    steps: ['Tense your feet for 5 seconds, then release', 'Tense your calves for 5 seconds, then release', 'Tense your thighs for 5 seconds, then release', 'Tense your stomach for 5 seconds, then release', 'Tense your shoulders for 5 seconds, then release', 'Take 3 deep breaths and notice the relaxation']
  },
  {
    title: 'Body Scan Meditation',
    emoji: '🧘',
    desc: 'Gently bring awareness to each part of your body',
    steps: ['Close your eyes and take 3 deep breaths', 'Bring attention to the top of your head', 'Slowly move awareness down to your face and jaw', 'Continue down through your neck and shoulders', 'Move through your chest, stomach, and back', 'Finally, bring awareness to your legs and feet']
  }
];

export default function Breathe() {
  const [active, setActive] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const timerRef = useRef(null);
  const countRef = useRef(null);

  const stopBreathing = () => {
    setActive(false);
    clearTimeout(timerRef.current);
    clearInterval(countRef.current);
    setPhaseIdx(0);
    setCountdown(null);
  };

  const runPhase = (idx) => {
    const phase = PHASES[idx % 3];
    setPhaseIdx(idx % 3);
    setCountdown(phase.duration);

    countRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countRef.current); return null; }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setTimeout(() => { runPhase(idx + 1); }, phase.duration * 1000);
  };

  const startBreathing = () => {
    if (active) { stopBreathing(); return; }
    setActive(true);
    runPhase(0);
  };

  useEffect(() => () => { clearTimeout(timerRef.current); clearInterval(countRef.current); }, []);

  const phase = PHASES[phaseIdx];

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Breathing & Grounding</div>
        <div className="page-sub">Calm your nervous system in minutes</div>
      </div>

      <div className="breath-card">
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 4 }}>
          4-7-8 Breathing Technique
        </div>
        <div style={{ fontSize: 14, color: '#085041' }}>
          {active ? phase.instruction : 'Tap the circle to begin'}
        </div>

        <div
          className={`breath-circle ${active && phase.scale ? 'expand' : ''} ${active && phase.label === 'Hold' ? 'hold' : ''}`}
          onClick={startBreathing}
          style={{ transition: `transform ${phase?.duration || 2}s ease` }}
        >
          {active ? (countdown || phase.label) : 'Start'}
        </div>

        <div className="breath-instruction">
          {active
            ? `${phase.label} · ${countdown || 0}s`
            : 'Inhale 4s → Hold 7s → Exhale 8s'}
        </div>

        {active && (
          <button onClick={stopBreathing} style={{ marginTop: 16, background: 'none', border: '1.5px solid var(--green-dark)', color: 'var(--green-dark)', padding: '8px 20px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600 }}>
            Stop
          </button>
        )}
      </div>

      <div className="section-label">Grounding Exercises</div>
      {EXERCISES.map((ex, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div className="resource-item" onClick={() => setExpanded(expanded === i ? null : i)} style={{ marginBottom: 0 }}>
            <div className="res-emoji">{ex.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="res-name">{ex.title}</div>
              <div className="res-desc">{ex.desc}</div>
            </div>
            <div style={{ color: 'var(--text3)', fontSize: 18, transition: 'transform 0.2s', transform: expanded === i ? 'rotate(180deg)' : 'none' }}>▾</div>
          </div>
          {expanded === i && (
            <div style={{ background: 'var(--green-light)', borderRadius: '0 0 12px 12px', padding: '14px 18px', border: '1px solid var(--border)', borderTop: 'none' }}>
              {ex.steps.map((s, j) => (
                <div key={j} style={{ display: 'flex', gap: 12, fontSize: 14, color: '#085041', marginBottom: j < ex.steps.length - 1 ? 10 : 0 }}>
                  <span style={{ width: 22, height: 22, background: 'var(--green)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{j + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
