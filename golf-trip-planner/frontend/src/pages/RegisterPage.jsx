import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      login(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: '4rem auto' }}>
      <h2>Create Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email<br />
          <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>Password (min 8 characters)<br />
          <input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ width: '100%', marginBottom: 12 }} />
        </label>
        <label>Confirm Password<br />
          <input type="password" required value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} style={{ width: '100%', marginBottom: 16 }} />
        </label>
        <button type="submit" disabled={loading} style={{ width: '100%' }}>{loading ? 'Creating account…' : 'Register'}</button>
      </form>
      <p style={{ marginTop: 12 }}>Already have an account? <a href="/login">Sign in</a></p>
    </div>
  );
}
