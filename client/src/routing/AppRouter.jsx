import { useEffect, useState } from 'react';
import LandingPage from '../landing/LandingPage.jsx';
import AuthPage from '../auth/AuthPage.jsx';
import StudentApp from '../student/StudentApp.jsx';
import AdminApp from '../admin/AdminApp.jsx';

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('campusUser') || 'null');
  } catch {
    return null;
  }
}

export default function AppRouter() {
  const [user, setUser] = useState(readUser);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const go = (next) => {
    if (window.location.pathname !== next) {
      window.history.pushState({}, '', next);
      setPath(next);
    }
  };

  const authenticated = Boolean(localStorage.getItem('campusToken') && user?.role);

  useEffect(() => {
    if (!authenticated) {
      if (path !== '/' && path !== '/login' && path !== '/signup') {
        go('/');
      }
      return;
    }
    const target = user.role === 'admin' ? '/admin' : '/';
    if (path !== target) go(target);
  }, [authenticated, path, user]);

  const onAuthenticated = (nextUser) => {
    localStorage.setItem('campusUser', JSON.stringify(nextUser));
    setUser(nextUser);
    go(nextUser.role === 'admin' ? '/admin' : '/');
  };

  const logout = () => {
    localStorage.removeItem('campusToken');
    localStorage.removeItem('campusUser');
    localStorage.removeItem('campusnexus_user');
    sessionStorage.removeItem('campussync:admin-session');
    setUser(null);
    go('/');
  };

  if (!authenticated) {
    if (path === '/login' || path === '/signup') {
      return (
        <AuthPage
          key={path}
          initialMode={path === '/signup' ? 'signup' : 'login'}
          onAuthenticated={onAuthenticated}
          onBackHome={() => go('/')}
        />
      );
    }
    return <LandingPage onNavigate={go} />;
  }

  if (user.role === 'admin') {
    return <AdminApp externalAuthUser={user} onExternalLogout={logout} />;
  }

  return <StudentApp onLogout={logout} />;
}