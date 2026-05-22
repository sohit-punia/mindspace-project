import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.age ? parseInt(form.age) : undefined);
      toast.success('Welcome to MindSpace! 💚');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ width: 56, height: 56, background: 'var(--green)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28, color: 'white', fontWeight: 700 }}>M</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>MindSpace</div>
        </div>

        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Start your mental wellness journey today</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input type="text" placeholder="Your name" value={form.name} onChange={set('name')} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label className="form-label">Age (optional)</label>
            <input type="text" placeholder="e.g. 20" value={form.age} onChange={set('age')} />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} />
          </div>
          <div style={{ background: 'var(--green-light)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--green-dark)' }}>
            🔒 Your journal entries are private. AI analyzes patterns, not your secrets.
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
