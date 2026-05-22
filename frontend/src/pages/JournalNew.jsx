import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

const MOODS = [
  { score: 2, emoji: '😔', label: 'Very Low' },
  { score: 4, emoji: '😕', label: 'Low' },
  { score: 6, emoji: '😐', label: 'Okay' },
  { score: 8, emoji: '🙂', label: 'Good' },
  { score: 10, emoji: '😄', label: 'Great' },
];

const PROMPTS = [
  'How was your day? What moments stood out?',
  'What emotions are you carrying right now?',
  'What is one thing you are grateful for today?',
  'What is weighing on your mind?',
  'How did you take care of yourself today?',
  'What would make tomorrow better?',
];

export default function JournalNew() {
  const [mood, setMood] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const randomPrompt = () => {
    setContent(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  };

  const handleSave = async () => {
    if (!mood) return toast.error('Please select your mood first');
    if (!content.trim() || content.trim().length < 10) return toast.error('Please write at least a sentence');
    setLoading(true);
    try {
      const { data } = await api.post('/journals', {
        content,
        moodScore: mood.score,
        moodLabel: mood.label,
      });
      setResult(data);
      toast.success('Journal entry saved! 💚');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const ai = result.aiAnalysis;
    const riskColors = { low: '#1D9E75', moderate: '#EF9F27', high: '#E24B4A', crisis: '#E24B4A' };
    return (
      <div className="page">
        <div className="page-header">
          <div className="page-title">Entry saved ✓</div>
          <div className="page-sub">Here's what your AI companion noticed</div>
        </div>

        {ai?.crisisDetected && (
          <div className="crisis-banner" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 22 }}>🚨</div>
            <div className="crisis-text">
              <strong>We noticed some concerning patterns.</strong> Please reach out to iCall at <strong>9152987821</strong> or the Vandrevala Foundation at <strong>1860-2662-345</strong>. You are not alone. 💚
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ fontSize: 36 }}>{MOODS.find(m => m.score === result.moodScore)?.emoji || '😐'}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Mood: {result.moodScore}/10 — {result.moodLabel}</div>
              <div style={{ fontSize: 14, color: 'var(--text2)' }}>Sentiment: <span style={{ color: riskColors[ai?.phq9Risk] || 'var(--green)', fontWeight: 600 }}>{ai?.sentiment}</span></div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className={`badge badge-${ai?.phq9Risk === 'low' ? 'green' : ai?.phq9Risk === 'moderate' ? 'amber' : 'red'}`}>
                PHQ-9: {ai?.phq9Risk || 'low'}
              </span>
            </div>
          </div>

          {ai?.summary && (
            <div style={{ background: 'var(--green-light)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--green-dark)', marginBottom: 4 }}>✦ AI Summary</div>
              <div style={{ fontSize: 14, color: '#085041', lineHeight: 1.6 }}>{ai.summary}</div>
            </div>
          )}

          {ai?.keyThemes?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 6 }}>Key themes detected:</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {ai.keyThemes.map(t => <span key={t} className="badge badge-green">{t}</span>)}
              </div>
            </div>
          )}

          {ai?.suggestions?.length > 0 && (
            <div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8 }}>Suggestions for you:</div>
              {ai.suggestions.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
                  <span style={{ color: 'var(--green)', flexShrink: 0 }}>→</span> {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Back to dashboard</button>
          <button className="btn btn-secondary" onClick={() => { setResult(null); setMood(null); setContent(''); }}>Write another entry</button>
          <button className="btn btn-secondary" onClick={() => navigate('/chat')}>Talk to Mira</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Today's Journal</div>
        <div className="page-sub">Express freely — AI reads patterns, not your secrets</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-label">How are you feeling?</div>
        <div className="mood-grid">
          {MOODS.map(m => (
            <button
              key={m.score}
              className={`mood-btn ${mood?.score === m.score ? 'selected' : ''}`}
              onClick={() => setMood(m)}
            >
              <span className="mood-emoji">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div className="ai-tag">✦ AI sentiment screening active</div>
          <button onClick={randomPrompt} style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font)', fontWeight: 600 }}>
            + Use a prompt
          </button>
        </div>

        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="How was your day? What's on your mind? Write freely..."
          rows={7}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>{content.length} characters</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/journal')}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>
              {loading ? 'Analyzing...' : 'Save & analyze'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
