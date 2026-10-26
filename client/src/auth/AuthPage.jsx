
import { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Users,
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

import './auth.css';

const API = '/api';

export default function AuthPage({
  initialMode = 'login',
  onAuthenticated,
}) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState('student');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rollNo: '',
    adminSetupKey: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const update = (e) => {
    const { name, value } = e.target;

    setForm((old) => ({
      ...old,
      [name]: value,
    }));
  };

  async function submit(e) {
    e.preventDefault();

    setError('');
    setNotice('');
    setLoading(true);

    try {
      const endpoint =
        mode === 'signup' ? '/auth/signup' : '/auth/login';

      const payload =
        mode === 'signup'
          ? {
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
              rollNo: form.rollNo.trim(),
              role,
              ...(role === 'admin'
                ? { adminSetupKey: form.adminSetupKey }
                : {}),
            }
          : {
              email: form.email.trim(),
              password: form.password,
              role,
            };

      const response = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      console.log('Auth API:', `${API}${endpoint}`);
      console.log('HTTP status:', response.status);
      console.log('API response:', responseText);

      let data;

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Server returned an invalid response (HTTP ${response.status}). Check the backend route and terminal.`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Request failed with HTTP ${response.status}.`
        );
      }

      if (!data.token || !data.user) {
        throw new Error(
          data.message ||
            'Authentication response is missing token or user details.'
        );
      }

      if (data.user.role !== role) {
        throw new Error(
          'The server returned a different account role. Please check the backend.'
        );
      }

      localStorage.setItem('campusToken', data.token);
      localStorage.setItem(
        'campusUser',
        JSON.stringify(data.user)
      );

      if (typeof onAuthenticated === 'function') {
        onAuthenticated(data.user);
      }
    } catch (err) {
      console.error('Authentication error:', err);

      setError(
        err.message ||
          'Could not connect to the server. Check whether the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setError('');
    setNotice('');

    setForm((old) => ({
      ...old,
      adminSetupKey: '',
    }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setNotice('');
  };

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <div className="auth-brand">
          <span className="brand-mark">
            <Sparkles size={20} />
          </span>

          <span>
            Campus
            <span className="brand-light">Sync</span>
          </span>
        </div>

        <div className="story-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            ONE CAMPUS. EVERY COMMUNITY.
          </p>

          <h1>
            Where campus life
            <br />
            <em>comes together.</em>
          </h1>

          <p className="story-description">
            A single space to discover committees, find your people,
            join events, and make your time on campus count.
          </p>

          <div className="story-stats">
            <div>
              <strong>01</strong>
              <span>Connect</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Contribute</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Grow</span>
            </div>
          </div>
        </div>

        <div className="story-footer">
          <span>BUILT FOR CAMPUS COMMUNITIES</span>
          <span>© 2026 CampusSync</span>
        </div>

        <div className="story-orb orb-one" />
        <div className="story-orb orb-two" />
      </section>

      <section className="auth-panel">
        <div className="auth-panel-top">
          <span className="mobile-brand">CampusSync</span>

          <span className="secure-label">
            <ShieldCheck size={15} />
            SECURE ACCESS
          </span>
        </div>

        <div className="auth-form-wrap">
          <div className="form-icon">
            {role === 'admin' ? (
              <ShieldCheck size={24} />
            ) : mode === 'login' ? (
              <GraduationCap size={24} />
            ) : (
              <Users size={24} />
            )}
          </div>

          <p className="form-kicker">
            {mode === 'login'
              ? role === 'admin'
                ? 'ADMINISTRATOR CONSOLE'
                : 'WELCOME BACK'
              : role === 'admin'
                ? 'ADMIN REGISTRATION'
                : 'YOUR CAMPUS JOURNEY STARTS HERE'}
          </p>

          <h2>
            {mode === 'login'
              ? role === 'admin'
                ? 'Sign in to admin console.'
                : 'Sign in to your space.'
              : role === 'admin'
                ? 'Create admin account.'
                : 'Create student account.'}
          </h2>

          <p className="form-subtitle">
            {mode === 'login'
              ? role === 'admin'
                ? 'Access campus governance and operations.'
                : 'Pick up right where you left off.'
              : role === 'admin'
                ? 'Set up administrative control for campus governance.'
                : 'Join your campus community in a few steps.'}
          </p>

          <div className="role-tabs" aria-label="Choose account type">
            <button
              type="button"
              className={role === 'student' ? 'active' : ''}
              onClick={() => switchRole('student')}
            >
              <GraduationCap size={16} />
              {mode === 'login' ? 'Student login' : 'Student account'}
            </button>

            <button
              type="button"
              className={role === 'admin' ? 'active' : ''}
              onClick={() => switchRole('admin')}
            >
              <ShieldCheck size={16} />
              {mode === 'login' ? 'Admin login' : 'Admin account'}
            </button>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}
            >
              Sign in
            </button>

            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => switchMode('signup')}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="auth-form">
            {mode === 'signup' && role === 'admin' && (
              <label>
                Admin setup key

                <input
                  name="adminSetupKey"
                  type="password"
                  value={form.adminSetupKey}
                  onChange={update}
                  placeholder="Provided by the system owner"
                  autoComplete="off"
                  required
                />
              </label>
            )}

            {mode === 'signup' && (
              <label>
                Full name

                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder={
                    role === 'admin'
                      ? 'e.g. Dr. Rajesh Sharma'
                      : 'e.g. Aanya Sharma'
                  }
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label>
              {role === 'admin'
                ? 'Official / campus email'
                : 'College email'}

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder={
                  role === 'admin'
                    ? 'admin@college.edu'
                    : 'you@college.edu'
                }
                autoComplete="email"
                required
              />
            </label>

            {mode === 'signup' && (
              <label>
                {role === 'admin' ? 'Staff / Admin ID' : 'Roll number'}

                <span className="optional-label"> (optional)</span>

                <input
                  name="rollNo"
                  value={form.rollNo}
                  onChange={update}
                  placeholder={
                    role === 'admin'
                      ? 'e.g. ADM-2026'
                      : 'e.g. 23CS1089'
                  }
                />
              </label>
            )}

            <label>
              Password

              <div className="password-field">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update}
                  placeholder={
                    mode === 'signup'
                      ? 'At least 8 characters'
                      : 'Enter your password'
                  }
                  autoComplete={
                    mode === 'signup'
                      ? 'new-password'
                      : 'current-password'
                  }
                  minLength={mode === 'signup' ? 8 : 1}
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </label>

            {error && (
              <p className="auth-alert error-alert" role="alert">
                {error}
              </p>
            )}

            {notice && (
              <p className="auth-alert" role="status">
                {notice}
              </p>
            )}

            <button
              className="submit-auth"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Please wait…'
                : mode === 'login'
                  ? role === 'admin'
                    ? 'Sign in to Admin Console'
                    : 'Sign in to CampusSync'
                  : role === 'admin'
                    ? 'Create Admin Account'
                    : 'Create Student Account'}

              <ArrowRight size={17} />
            </button>
          </form>

          <p className="auth-terms">
            By continuing, you agree to your institution’s acceptable-use
            policy.
          </p>
        </div>

        <div className="auth-panel-bottom">
          <span>Need help? Contact your campus administrator.</span>
          <span>STUDENT PORTAL · ADMIN ACCESS</span>
        </div>
      </section>
    </main>
  );
}
