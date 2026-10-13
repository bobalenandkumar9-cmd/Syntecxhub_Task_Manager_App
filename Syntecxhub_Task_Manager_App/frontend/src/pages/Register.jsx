import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Please enter a valid email address';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirm) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
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
        <h1>Create your account</h1>
        <p className="auth__sub">Start organising your work in minutes.</p>

        {error && <div className="alert alert--error" role="alert">{error}</div>}

        <label className="field">
          <span>Name</span>
          <input name="name" autoComplete="name" value={form.name} onChange={handleChange} placeholder="Your name" />
        </label>

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
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
          />
        </label>

        <label className="field">
          <span>Confirm password</span>
          <input
            type="password"
            name="confirm"
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Repeat your password"
          />
        </label>

        <button className="btn btn--primary btn--block" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="auth__switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
