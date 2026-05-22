import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [safeWord, setSafeWord] = useState(user?.safeWord || 'HELP NOW');
  const [contact, setContact] = useState({ name: user?.trustedContact?.name || '', phone: user?.trustedContact?.phone || '', relationship: user?.trustedContact?.relationship || '' });
  const [saving, setSaving] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', { name, safeWord, trustedContact: contact.name ? contact : undefined });
      updateUser(data);
      toast.success('Profile updated! 💚');
    } catch {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">My Profile</div>
        <div className="page-sub">Manage your account and safety settings</div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 700 }}>{initials}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: 14, color: 'var(--text3)' }}>{user?.email}</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Display name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <hr className="divider" />
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🔒 Safety Settings</div>

        <div className="form-group">
          <label className="form-label">Safe word</label>
          <input type="text" value={safeWord} onChange={e => setSafeWord(e.target.value)} />
          <div className="form-hint">Type this word in AI chat to instantly show crisis resources</div>
        </div>

        <hr className="divider" />
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>👤 Trusted Contact</div>
        <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 14 }}>
          This person will be notified if MindSpace detects a crisis in your entries.
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))} placeholder="e.g. Mum" />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input type="text" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} placeholder="+91 98765 43210" />
        </div>
        <div className="form-group">
          <label className="form-label">Relationship</label>
          <input type="text" value={contact.relationship} onChange={e => setContact(c => ({ ...c, relationship: e.target.value }))} placeholder="e.g. Parent, Friend" />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
          <button className="btn btn-secondary" onClick={logout}>Sign out</button>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--green-light)', border: '1px solid var(--green-mid)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green-dark)', marginBottom: 6 }}>🔒 Your Privacy</div>
        <div style={{ fontSize: 14, color: '#085041', lineHeight: 1.6 }}>
          Your journal entries are encrypted and never read by humans. AI analysis runs automatically to detect patterns — it sees signals, not your secrets. You can delete your data at any time.
        </div>
      </div>
    </div>
  );
}
