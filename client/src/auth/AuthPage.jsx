import { useState } from 'react';
import { ArrowRight, ShieldCheck, Users, GraduationCap, Eye, EyeOff, Sparkles } from 'lucide-react';
import './auth.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AuthPage({ initialMode = 'login', onAuthenticated }) {
  const [mode, setMode] = useState(initialMode);
  const [loginRole, setLoginRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '', rollNo: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const update = (e) => setForm((old) => ({ ...old, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError(''); setNotice(''); setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const response = await fetch(`${API}${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'signup'
          ? { name: form.name, email: form.email, password: form.password, rollNo: form.rollNo }
          : { email: form.email, password: form.password, role: loginRole })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to authenticate.');
      localStorage.setItem('campusToken', data.token);
      localStorage.setItem('campusUser', JSON.stringify(data.user));
      onAuthenticated(data.user);
    } catch (err) {
      setError(err.message || 'Could not connect to the server. Make sure the MVC API is running.');
    } finally { setLoading(false); }
  }

  return <main className="auth-shell">
    <section className="auth-story">
      <div className="auth-brand"><span className="brand-mark"><Sparkles size={20}/></span><span>Campus<span className="brand-light">Sync</span></span></div>
      <div className="story-copy">
        <p className="eyebrow"><span className="eyebrow-dot"/> ONE CAMPUS. EVERY COMMUNITY.</p>
        <h1>Where campus life<br/><em>comes together.</em></h1>
        <p className="story-description">A single space to discover committees, find your people, join events, and make your time on campus count.</p>
        <div className="story-stats"><div><strong>01</strong><span>Connect</span></div><div><strong>02</strong><span>Contribute</span></div><div><strong>03</strong><span>Grow</span></div></div>
      </div>
      <div className="story-footer"><span>BUILT FOR CAMPUS COMMUNITIES</span><span>© 2026 CampusSync</span></div>
      <div className="story-orb orb-one"/><div className="story-orb orb-two"/>
    </section>
    <section className="auth-panel">
      <div className="auth-panel-top"><span className="mobile-brand">CampusSync</span><span className="secure-label"><ShieldCheck size={15}/> SECURE ACCESS</span></div>
      <div className="auth-form-wrap">
        <div className="form-icon">{mode === 'login' ? <GraduationCap size={24}/> : <Users size={24}/>}</div>
        <p className="form-kicker">{mode === 'login' ? 'WELCOME BACK' : 'YOUR CAMPUS JOURNEY STARTS HERE'}</p>
        <h2>{mode === 'login' ? 'Sign in to your space.' : 'Create your account.'}</h2>
        <p className="form-subtitle">{mode === 'login' ? 'Pick up right where you left off.' : 'Join your campus community in a few steps.'}</p>
        {mode === 'login' && <div className="role-tabs" aria-label="Choose account type">
          <button type="button" className={loginRole === 'student' ? 'active' : ''} onClick={() => {setLoginRole('student');setError('')}}><GraduationCap size={16}/> Student login</button>
          <button type="button" className={loginRole === 'admin' ? 'active' : ''} onClick={() => {setLoginRole('admin');setError('')}}><ShieldCheck size={16}/> Admin login</button>
        </div>}
        <div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => {setMode('login');setError('');setNotice('')}} type="button">Sign in</button><button className={mode === 'signup' ? 'active' : ''} onClick={() => {setMode('signup');setError('');setNotice('')}} type="button">Create account</button></div>
        <form onSubmit={submit} className="auth-form">
          {mode === 'signup' && <label>Full name<input name="name" value={form.name} onChange={update} placeholder="e.g. Aanya Sharma" autoComplete="name" required/></label>}
          <label>College email<input name="email" type="email" value={form.email} onChange={update} placeholder="you@college.edu" autoComplete="email" required/></label>
          {mode === 'signup' && <label>Roll number <span className="optional-label">(optional)</span><input name="rollNo" value={form.rollNo} onChange={update} placeholder="e.g. 23CS1089"/></label>}
          <label>Password<div className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update} placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter your password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={mode === 'signup' ? 8 : 1} required/><button type="button" className="show-password" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
          {error && <p className="auth-alert error-alert">{error}</p>}{notice && <p className="auth-alert">{notice}</p>}
          <button className="submit-auth" type="submit" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in to CampusSync' : 'Create student account'}<ArrowRight size={17}/></button>
        </form>
        <p className="auth-terms">By continuing, you agree to your institution’s acceptable-use policy.</p>
      </div>
      <div className="auth-panel-bottom"><span>Need help? Contact your campus administrator.</span><span>STUDENT PORTAL · ADMIN ACCESS</span></div>
    </section>
  </main>;
}
