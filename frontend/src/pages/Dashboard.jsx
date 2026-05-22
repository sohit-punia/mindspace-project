import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/journals/stats'),
      api.get('/chat/insight')
    ]).then(([s, i]) => {
      setStats(s.data);
      setInsight(i.data.insight);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const firstName = user?.name?.split(' ')[0];

  const chartData = stats?.weeklyMoods?.map(m => ({
    day: new Date(m.date).toLocaleDateString('en', { weekday: 'short' }),
    mood: m.score
  })) || [];

  const riskColor = { low: 'badge-green', moderate: 'badge-amber', high: 'badge-red', crisis: 'badge-red' };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Welcome back, {firstName} 👋</div>
        <div className="page-sub">{new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>

      {insight && (
        <div className="insight-card">
          <div className="insight-title">✨ Your Weekly AI Insight</div>
          <div className="insight-text">{insight}</div>
        </div>
      )}

      {loading ? (
        <div className="loading"><div className="spinner" />Loading your stats...</div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Avg mood (7 days)</div>
              <div className="stat-val">{stats?.avgMood || '—'}</div>
              <div className="stat-trend">out of 10</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Journal streak</div>
              <div className="stat-val">{stats?.streak || 0} <span style={{ fontSize: 18 }}>🔥</span></div>
              <div className="stat-trend">{stats?.streak > 0 ? 'Keep it up!' : 'Start today!'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">PHQ-9 risk level</div>
              <div className="stat-val" style={{ fontSize: 20, paddingTop: 6 }}>
                <span className={`badge ${riskColor[stats?.riskLevel] || 'badge-green'}`}>
                  {(stats?.riskLevel || 'low').charAt(0).toUpperCase() + (stats?.riskLevel || 'low').slice(1)}
                </span>
              </div>
              <div className="stat-trend">{stats?.totalEntries || 0} total entries</div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="chart-wrap">
              <div className="chart-title">Mood this week</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 13, fill: '#8FAAA0' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 13, fill: '#8FAAA0' }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip
                    contentStyle={{ fontFamily: 'var(--font)', fontSize: 13, borderRadius: 10, border: '1px solid var(--border)' }}
                    formatter={(v) => [`${v}/10`, 'Mood']}
                  />
                  <Area type="monotone" dataKey="mood" stroke="#1D9E75" strokeWidth={2.5} fill="url(#moodGrad)" dot={{ fill: '#1D9E75', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {chartData.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 32, marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📓</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No journal entries yet</div>
              <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 18 }}>Start journaling to see your mood trends here</div>
              <button className="btn btn-primary" onClick={() => navigate('/journal/new')}>Write your first entry</button>
            </div>
          )}

          <div className="section-label">Quick actions</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/journal/new')}>📓 Write today's journal</button>
            <button className="btn btn-secondary" onClick={() => navigate('/chat')}>💬 Talk to Mira</button>
            <button className="btn btn-secondary" onClick={() => navigate('/breathe')}>🌿 Breathing exercise</button>
          </div>
        </>
      )}
    </div>
  );
}
