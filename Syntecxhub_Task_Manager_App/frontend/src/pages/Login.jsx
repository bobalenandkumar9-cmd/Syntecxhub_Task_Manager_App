import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.email.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <form className="card auth__card" onSubmit={handleSubmit} noValidate>
        <div className="auth__logo" aria-hidden="true">✓</div>
        <h1>Welcome back</h1>
        <p className="auth__sub">Log in to manage your tasks.</p>

        {error && <div className="alert alert--error" role="alert">{error}</div>}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
          />
        </label>

        <button className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="auth__switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
