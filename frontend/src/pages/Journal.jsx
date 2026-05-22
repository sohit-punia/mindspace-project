import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const moodEmoji = { 'Very Low': '😔', 'Low': '😕', 'Okay': '😐', 'Good': '🙂', 'Great': '😄' };

export default function Journal() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/journals').then(r => setJournals(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  if (selected) {
    const ai = selected.aiAnalysis;
    return (
      <div className="page">
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontSize: 15, fontFamily: 'var(--font)', fontWeight: 600, marginBottom: 16, padding: 0 }}>
          ← Back to journal
        </button>
        <div className="page-header">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 30 }}>{moodEmoji[selected.moodLabel] || '😐'}</span>
            <div>
              <div className="page-title" style={{ fontSize: 20 }}>{formatDate(selected.date)}</div>
              <div className="page-sub">Mood: {selected.moodScore}/10 · {selected.moodLabel}</div>
            </div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>{selected.content}</div>
        </div>
        {ai && (
          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>✦ AI Analysis</div>
            {ai.summary && <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>{ai.summary}</div>}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <span className={`badge badge-${ai.phq9Risk === 'low' ? 'green' : ai.phq9Risk === 'moderate' ? 'amber' : 'red'}`}>PHQ-9: {ai.phq9Risk}</span>
              <span className="badge badge-green">{ai.sentiment}</span>
              {ai.keyThemes?.map(t => <span key={t} className="badge" style={{ background: 'var(--surface2)', color: 'var(--text2)' }}>{t}</span>)}
            </div>
            {ai.suggestions?.length > 0 && (
              <div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8 }}>Suggestions:</div>
                {ai.suggestions.map((s, i) => <div key={i} style={{ fontSize: 14, color: 'var(--text)', marginBottom: 6 }}><span style={{ color: 'var(--green)' }}>→</span> {s}</div>)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="page-title">My Journal</div>
          <div className="page-sub">{journals.length} entries saved</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/journal/new')}>+ New entry</button>
      </div>

      {loading && <div className="loading"><div className="spinner" />Loading journals...</div>}

      {!loading && journals.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>📓</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No entries yet</div>
          <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>Start your wellness journey by writing your first entry</div>
          <button className="btn btn-primary" onClick={() => navigate('/journal/new')}>Write first entry</button>
        </div>
      )}

      {journals.map(j => (
        <div key={j._id} className="journal-entry" onClick={() => setSelected(j)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div className="journal-date">{formatDate(j.date)}</div>
            <span className={`badge badge-${j.aiAnalysis?.phq9Risk === 'low' ? 'green' : j.aiAnalysis?.phq9Risk === 'moderate' ? 'amber' : 'red'}`}>
              {j.aiAnalysis?.phq9Risk || 'low'}
            </span>
          </div>
          <div className="journal-preview">{j.content}</div>
          <div className="journal-mood">
            <span style={{ fontSize: 16 }}>{moodEmoji[j.moodLabel] || '😐'}</span>
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>{j.moodScore}/10 · {j.moodLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
