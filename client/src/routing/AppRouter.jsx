import { useEffect, useState } from 'react';
import AuthPage from '../auth/AuthPage.jsx';
import StudentApp from '../student/StudentApp.jsx';
import AdminApp from '../admin/AdminApp.jsx';
function readUser() { try { return JSON.parse(localStorage.getItem('campusUser') || 'null'); } catch { return null; } }
export default function AppRouter() {
  const [user, setUser] = useState(readUser);
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { const onPop = () => setPath(window.location.pathname); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const go = (next) => { if (window.location.pathname !== next) { window.history.pushState({}, '', next); setPath(next); } };
  const authenticated = Boolean(localStorage.getItem('campusToken') && user?.role);
  useEffect(() => {
    if (!authenticated) { if (path !== '/signup') go('/login'); return; }
    const target = user.role === 'admin' ? '/admin' : '/';
    if (path !== target) go(target);
  }, [authenticated, path, user]);
  const onAuthenticated = (nextUser) => { localStorage.setItem('campusUser', JSON.stringify(nextUser)); setUser(nextUser); go(nextUser.role === 'admin' ? '/admin' : '/'); };
  const logout = () => { localStorage.removeItem('campusToken'); localStorage.removeItem('campusUser'); sessionStorage.removeItem('campussync:admin-session'); setUser(null); go('/login'); };
  if (!authenticated) return <AuthPage key={path} initialMode={path === '/signup' ? 'signup' : 'login'} onAuthenticated={onAuthenticated} />;
  if (user.role === 'admin') return <AdminApp externalAuthUser={user} onExternalLogout={logout} />;
  return <StudentApp />;
}
