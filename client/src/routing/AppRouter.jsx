import { useEffect, useState } from 'react';
import { ShieldCheck, LogOut, ArrowUpRight } from 'lucide-react';
import App from '../App.jsx';
import AuthPage from '../auth/AuthPage.jsx';

function getUser() { try { return JSON.parse(localStorage.getItem('campusUser') || 'null'); } catch { return null; } }
function go(path) { if (window.location.pathname !== path) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); } }

function AdminDashboard({ user, onLogout }) {
  const cardStyle = { background:'#fff', border:'1px solid #e2e8df', borderRadius:18, padding:22, minHeight:150 };
  return <div style={{minHeight:'100vh',background:'#f5f7f3',color:'#1d3428',fontFamily:'Inter,system-ui,sans-serif',padding:'32px clamp(20px,5vw,72px)'}}>
    <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,flexWrap:'wrap',borderBottom:'1px solid #dfe6dc',paddingBottom:24}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}><span style={{display:'grid',placeItems:'center',width:42,height:42,background:'#1d4938',color:'#e2f39a',borderRadius:13}}><ShieldCheck size={21}/></span><div><div style={{fontWeight:800,fontSize:19}}>CampusSync <span style={{fontWeight:500,color:'#7a8c7f'}}>Admin</span></div><div style={{fontSize:11,color:'#7a8c7f',marginTop:3}}>CAMPUS OPERATIONS CONSOLE</div></div></div>
      <button onClick={onLogout} style={{display:'flex',alignItems:'center',gap:8,border:'1px solid #d5ded3',background:'#fff',borderRadius:10,padding:'10px 14px',cursor:'pointer',color:'#355241'}}><LogOut size={15}/> Sign out</button>
    </header>
    <section style={{padding:'48px 0 30px'}}><div style={{fontSize:11,letterSpacing:1.5,fontWeight:800,color:'#6d8c70'}}>ADMINISTRATOR ACCESS</div><h1 style={{fontSize:'clamp(32px,5vw,52px)',letterSpacing:-2,margin:'12px 0'}}>Welcome, {user?.name || 'Administrator'}.</h1><p style={{color:'#718075',maxWidth:600,lineHeight:1.7}}>You’re signed in to the administration area. This presentation view establishes role-based access; connect committee management controls here as the next step.</p></section>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>{[['Committee oversight','Review committee structures and leadership.','COMMITTEES'],['Student directory','Manage student access and profiles.','STUDENTS'],['Events & notices','Coordinate campus-wide announcements.','EVENTS']].map(([title,desc,tag])=><article key={title} style={cardStyle}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:10,letterSpacing:1.2,fontWeight:800,color:'#6e8a72'}}>{tag}</span><ArrowUpRight size={17} color="#819487"/></div><h2 style={{fontSize:18,margin:'24px 0 8px'}}>{title}</h2><p style={{fontSize:12,color:'#77847a',lineHeight:1.6,margin:0}}>{desc}</p></article>)}</div>
    <p style={{marginTop:30,fontSize:11,color:'#8a968d'}}>Signed in as {user?.email || 'admin account'} · Role: administrator</p>
  </div>;
}

export default function AppRouter() {
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState(getUser);
  useEffect(() => { const onPop = () => setPath(window.location.pathname); window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop); }, []);
  const authenticated = Boolean(localStorage.getItem('campusToken') && user);
  useEffect(() => {
    if (!authenticated && path !== '/signup' && path !== '/login' && path !== '/') go('/login');
    if (authenticated && user?.role === 'admin' && path !== '/admin/dashboard') go('/admin/dashboard');
    if (authenticated && user?.role !== 'admin' && path !== '/student/dashboard') go('/student/dashboard');
  }, [authenticated, path, user]);
  const authenticate = (nextUser) => { setUser(nextUser); go(nextUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'); };
  const logout = () => { localStorage.removeItem('campusToken'); localStorage.removeItem('campusUser'); setUser(null); go('/login'); };
  if (!authenticated) return <AuthPage key={path} initialMode={path === '/signup' ? 'signup' : 'login'} onAuthenticated={authenticate}/>;
  if (user.role === 'admin') return <AdminDashboard user={user} onLogout={logout}/>;
  return <div><div style={{position:'fixed',zIndex:1000,top:12,right:16,display:'flex',alignItems:'center',gap:10,background:'#18181b',border:'1px solid #3f3f46',color:'#f4f4f5',padding:'8px 12px',borderRadius:12,fontSize:12,boxShadow:'0 4px 18px #0002'}}><span>{user.name || user.email}</span><button onClick={logout} style={{display:'flex',alignItems:'center',gap:5,background:'#27272a',color:'#f4f4f5',border:0,borderRadius:8,padding:'6px 8px',cursor:'pointer'}}><LogOut size={13}/> Logout</button></div><App user={user} onLogout={logout}/></div>;
}
