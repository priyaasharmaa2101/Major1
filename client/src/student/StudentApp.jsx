// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Users, Award, Calendar, AlertCircle, Ticket, CheckCircle2, 
//   Clock, Bell, ShieldCheck, Sparkles, LayoutDashboard,
//   Sun, Moon, Menu, X, ArrowRight, CheckCheck, Briefcase, LogOut
// } from 'lucide-react';
// import { loadCommittees } from '../shared/committeeService';
// import OverviewTab from './components/OverviewTab';
// import CommitteesTab from './components/CommitteesTab';
// import Super50Tab from './components/Super50Tab';
// import EventsTab from './components/EventsTab';
// import GrievanceTab from './components/GrievanceTab';
// import { loadApplications, applyRemote } from '../shared/applicationService';
// import { useDB, actions, select, getDB } from '../shared/store';
// import { useAutomationLoop } from '../shared/hooks';
// import { loadSlots, bookSlotRemote } from '../shared/slotService';
// import { loadEventData, payRemote } from '../shared/eventService';
// import { loadGrievances, raiseGrievanceRemote } from '../shared/grievanceService';
// import { loadCandidates } from '../shared/candidateService';
// import { loadNotifications } from '../shared/notificationService';

// export default function StudentApp({ onLogout }) {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [toastMessage, setToastMessage] = useState(null);
//   const [isDarkMode, setIsDarkMode] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // Notifications & Profile Modal States
//   const [isNotifOpen, setIsNotifOpen] = useState(false);
//   const [isFullNotifOpen, setIsFullNotifOpen] = useState(false);
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const notifRef = useRef(null);

//   // Close notification dropdown on outside click

//   useEffect(() => {
//     document.documentElement.classList.toggle('light-theme', !isDarkMode);
//   }, [isDarkMode]);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (notifRef.current && !notifRef.current.contains(event.target)) {
//         setIsNotifOpen(false);
//       }
//     }
//     if (isNotifOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isNotifOpen]);

//   // Close modals on Escape key
//   useEffect(() => {
//     function handleKeyDown(e) {
//       if (e.key === 'Escape') {
//         setIsProfileModalOpen(false);
//         setIsFullNotifOpen(false);
//         setIsNotifOpen(false);
//       }
//     }
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, []);

//   const showToast = (msg) => {
//     setToastMessage(msg);
//     setTimeout(() => setToastMessage(null), 3500);
//   };

//   // Working Logout Handler
//   const handleLogout = () => {
//     localStorage.removeItem('campusToken');
//     localStorage.removeItem('campusUser');
//     localStorage.removeItem('campusnexus_user');
//     setIsProfileModalOpen(false);

//     if (typeof onLogout === 'function') {
//       onLogout();
//     } else {
//       window.location.href = '/';
//     }
//   };

//   // ---- Shared Store Data + Authenticated Sign-Up User Override ----
//   const db = useDB();
//   const now = useAutomationLoop();
//      useEffect(() => {
//     const load = () => {
//       loadCommittees().catch(console.error);
//       loadApplications().catch(console.error);
//        loadSlots().catch(console.error);
//        loadEventData().catch(console.error);
//              loadGrievances().catch(console.error);
//             loadCandidates().catch(console.error); 
//             loadNotifications().catch(console.error);
//     };
//     load();
//     const id = setInterval(load, 15000);
//     return () => clearInterval(id);
//   }, []);
//   const authUser = (() => {
//     try {
//       return JSON.parse(localStorage.getItem('campusUser'));
//     } catch {
//       return null;
//     }
//   })();
// const studentRollNo = authUser?.rollNo || '';
//   const storeStudent = select.student(db, studentRollNo) || {};

//   // Do not show demo profile values when the authenticated profile is incomplete.
//   const studentProfile = {
//     ...storeStudent,
//     name: authUser?.name || storeStudent.name || 'Student',
//     rollNo: studentRollNo || storeStudent.rollNo || '',
//     email: authUser?.email || '',
//     branch: authUser?.branch || storeStudent.branch || '',
//     semester: authUser?.semester || storeStudent.semester || '',
//     cgpa: storeStudent.cgpa ?? authUser?.cgpa ?? null,
//   };

//   const committees = select.openCommittees(db);
//   const committeeNames = select.committeeNames(db);
//   const appliedCommittees = select.studentApplications(db, studentRollNo);
//   const super50 = select.super50(db, studentRollNo);
//   const events = select.events(db);
//    console.log('events in store:', events.length); 
//   const myPasses = select.passesFor(db, studentRollNo);
//   const grievances = select.grievancesFor(db, studentRollNo, now);
//   const myNotifications = select.notificationsFor(db, studentRollNo);
//   const unreadCount = myNotifications.filter((n) => !n.read).length;

//   // Modals
//   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
//   const [selectedCommittee, setSelectedCommittee] = useState(null);
//   const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
//   const [slotTargetId, setSlotTargetId] = useState(null);
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
//   const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
//     const [selectedCommitteeForGrievance, setSelectedCommitteeForGrievance] = useState('');
//   const [grievanceForm, setGrievanceForm] = useState({ title: '', description: '' });

//   const freeSlots = select.freeSlotsFor(db, slotTargetId);

//   const navItems = [
//     { id: 'overview', label: 'Overview', icon: LayoutDashboard },
//     { id: 'committees', label: 'Committees & Hiring', icon: Users },
//     { id: 'super50', label: 'Super 50 Cohort', icon: Award },
//     { id: 'events', label: 'Garba & Fiesta Passes', icon: Ticket },
//     { id: 'grievance', label: 'Grievance Desk (SLA)', icon: AlertCircle }
//   ];

//   // Handlers
//   const handleApplyClick = (comm) => {
//     setSelectedCommittee(comm);
//     setIsApplyModalOpen(true);
//   };

//       const submitApplication = async () => {
//     setIsApplyModalOpen(false);
//     try {
//       const app = await applyRemote(selectedCommittee.id);
//       if (app.status === 'Rejected') {
//         showToast(`Auto-Screening Failed: ${app.remark}.`);
//         setActiveTab('overview');
//       } else {
//         showToast(`Success! You are Shortlisted. Pick your interview slot.`);
//         setSlotTargetId(app.id);
//         setIsSlotModalOpen(true);
//       }
//     } catch (e) {
//       showToast(e.message);
//     }
//   };

//   const confirmSlotBooking = async (slot) => {
//     try {
//       await bookSlotRemote(slotTargetId, slot.id);
//       setIsSlotModalOpen(false);
//       showToast(`Interview slot confirmed for ${slot.label}!`);
//       setActiveTab('overview');
//     } catch (e) {
//       showToast(e.message);
//     }
//   };

//     const bookEvent = async (ev) => {
//     setIsPaymentModalOpen(false);
//     try {
//       const { payment } = await payRemote(ev.id);
//       if (ev.numericPrice === 0) {
//         showToast('You are registered! Your pass is ready.');
//       } else if (payment.status === 'Verified') {
//         showToast(`Payment of ${ev.price} verified! Digital QR pass issued.`);
//       } else {
//         showToast('Payment received. Waiting for admin verification, your pass will appear here.');
//       }
//       setActiveTab('events');
//     } catch (e) {
//       showToast(e.message);
//     }
//   };

//   const processPayment = () => bookEvent(selectedEventForBooking);

//   const handleBookPass = (event) => {
//     if (event.numericPrice === 0) {
//       bookEvent(event);
//       return;
//     }
//     setSelectedEventForBooking(event);
//     setIsPaymentModalOpen(true);
//   };

//     const submitGrievance = async (e) => {
//     e.preventDefault();
//     if (!grievanceForm.title.trim()) return;
//     const target = committeeNames.includes(selectedCommitteeForGrievance)
//       ? selectedCommitteeForGrievance
//       : committeeNames[0];
//     if (!target) {
//       showToast('No committees are available yet to receive a complaint.');
//       return;
//     }
//     try {
//       const g = await raiseGrievanceRemote({
//         committee: target,
//         title: grievanceForm.title.trim(),
//         description: (grievanceForm.description || '').trim() || grievanceForm.title.trim(),
//       });
//       setGrievanceForm({ title: '', description: '' });
//       setIsGrievanceModalOpen(false);
//       showToast(`Complaint ${g.id} filed with ${target}. ${g.slaHours}-hour SLA escalation clock started!`);
//     } catch (err) {
//       showToast(err.message);
//     }
//   };

//   const initials = studentProfile.name
//     .split(' ')
//     .filter(Boolean)
//     .map((n) => n[0])
//     .join('')
//     .slice(0, 2)
//     .toUpperCase();

//   const mySuper50Row = super50.rows.find((r) => r.rollNo === studentRollNo);

//   return (
//     <div className={`flex min-h-screen font-sans transition-colors duration-200 ${
//       isDarkMode 
//         ? 'bg-zinc-950 text-zinc-100 selection:bg-emerald-400 selection:text-zinc-950' 
//         : 'bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white'
//     }`}>
//       {/* Toast Notification */}
//       {toastMessage && (
//         <div className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border animate-bounce ${
//           isDarkMode 
//             ? 'bg-zinc-900 text-zinc-100 border-zinc-700' 
//             : 'bg-white text-slate-900 border-slate-200 shadow-lg'
//         }`}>
//           <Sparkles className="w-4 h-4 text-emerald-500" />
//           {toastMessage}
//         </div>
//       )}

//       {/* --- LEFT SIDEBAR NAVBAR --- */}
//       <aside className={`border-r transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen flex flex-col justify-between hidden md:flex ${
//         isSidebarOpen ? 'w-64' : 'w-20'
//       } ${
//         isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
//       }`}>
//         <div>
//           {/* YouTube-style Hamburger Menu + CampusNexus Logo */}
//           <div className={`h-16 px-4 border-b flex items-center gap-3 overflow-hidden ${
//             isDarkMode ? 'border-zinc-800' : 'border-slate-100'
//           }`}>
//             <button
//               onClick={() => setIsSidebarOpen(prev => !prev)}
//               aria-label="Toggle Sidebar"
//               className={`p-2 rounded-xl transition-all shrink-0 ${
//                 isDarkMode 
//                   ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
//                   : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
//               }`}
//             >
//               <Menu className="w-5 h-5" />
//             </button>

//             <div className="flex items-center gap-2.5 overflow-hidden">
//               <div className={`p-2 rounded-xl font-black text-xs shrink-0 flex items-center justify-center ${
//                 isDarkMode ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/20' : 'bg-emerald-600 text-white'
//               }`}>
//                 <span>⚡</span>
//               </div>
//               {isSidebarOpen && (
//                 <div className="overflow-hidden">
//                   <span className={`font-extrabold text-base tracking-tight truncate block ${
//                     isDarkMode ? 'text-white' : 'text-slate-900'
//                   }`}>CampusNexus</span>
//                   <div className={`text-[10px] tracking-tight truncate ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
//                     Student Governance
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Navigation Links */}
//           <nav className="p-3 space-y-1.5">
//             {navItems.map(tab => {
//               const Icon = tab.icon;
//               const isActive = activeTab === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   title={!isSidebarOpen ? tab.label : ''}
//                   className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
//                     isActive 
//                       ? isDarkMode 
//                         ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm' 
//                         : 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm'
//                       : isDarkMode 
//                         ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' 
//                         : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
//                   }`}
//                 >
//                   <Icon className="w-4 h-4 shrink-0" />
//                   {isSidebarOpen && <span className="truncate">{tab.label}</span>}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Sidebar Footer User Profile */}
//         <div className={`p-3 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
//           <button
//             onClick={() => setIsProfileModalOpen(true)}
//             title="View student profile"
//             className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
//               isDarkMode 
//                 ? 'bg-zinc-800/60 hover:bg-zinc-800 border-zinc-800 hover:border-emerald-500/30' 
//                 : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-emerald-300'
//             }`}
//           >
//             <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
//               isDarkMode ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-600 text-white'
//             }`}>
//               {initials}
//             </div>
//             {isSidebarOpen && (
//               <div className="overflow-hidden flex-1">
//                 <div className={`font-bold text-xs truncate ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
//                   {studentProfile.name}
//                 </div>
//                 <div className={`text-[10px] font-mono truncate ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
//                   {studentProfile.rollNo}
//                 </div>
//               </div>
//             )}
//           </button>
//         </div>
//       </aside>

//       {/* --- RIGHT SIDE MAIN CONTAINER --- */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Top Header */}
//         <header className={`border-b sticky top-0 z-30 h-16 px-6 flex items-center justify-between backdrop-blur-md transition-colors ${
//           isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'
//         }`}>
//           <div className="flex items-center gap-2">
//             <div className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
//               CampusNexus / <span className={`font-bold capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab}</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Theme Toggle Button */}
//             <button
//               onClick={() => setIsDarkMode(prev => !prev)}
//               aria-label="Toggle Theme"
//               className={`p-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-semibold ${
//                 isDarkMode 
//                   ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-amber-300' 
//                   : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
//               }`}
//             >
//               {isDarkMode ? (
//                 <>
//                   <Sun className="w-4 h-4 text-amber-300" />
//                   <span className="hidden sm:inline">Light</span>
//                 </>
//               ) : (
//                 <>
//                   <Moon className="w-4 h-4 text-slate-700" />
//                   <span className="hidden sm:inline">Dark</span>
//                 </>
//               )}
//             </button>

//             {/* Notifications */}
//             <div className="relative" ref={notifRef}>
//               <button
//                 onClick={() => {
//                   const open = !isNotifOpen;
//                   setIsNotifOpen(open);
//                   if (open) actions.markRead(studentRollNo);
//                 }}
//                 aria-label="Notifications"
//                 className={`p-2 rounded-xl transition-all relative border ${
//                   isDarkMode 
//                     ? 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-800' 
//                     : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
//                 }`}
//               >
//                 <Bell className="w-4 h-4" />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {isNotifOpen && (
//                 <div className={`absolute right-0 mt-2 w-80 md:w-96 rounded-2xl border shadow-2xl z-40 overflow-hidden ${
//                   isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
//                 }`}>
//                   <div className={`px-4 py-3 text-xs font-bold border-b flex items-center justify-between ${
//                     isDarkMode ? 'border-zinc-800 text-white' : 'border-slate-100 text-slate-900'
//                   }`}>
//                     <span>Notifications</span>
//                     <button
//                       onClick={() => actions.markRead(studentRollNo)}
//                       className="text-[11px] text-emerald-500 hover:underline font-semibold"
//                     >
//                       Mark all read
//                     </button>
//                   </div>

//                   <div className="max-h-72 overflow-y-auto">
//                     {myNotifications.length === 0 && (
//                       <div className={`p-4 text-xs ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
//                         No notifications yet.
//                       </div>
//                     )}
//                     {myNotifications.slice(0, 5).map((n) => (
//                       <div key={n.id} className={`px-4 py-2.5 text-xs border-b last:border-0 ${
//                         isDarkMode ? 'border-zinc-800 text-zinc-300' : 'border-slate-100 text-slate-700'
//                       }`}>
//                         <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
//                           n.tone === 'good' ? 'bg-emerald-500' : n.tone === 'bad' ? 'bg-rose-500' : n.tone === 'warn' ? 'bg-amber-500' : 'bg-sky-500'
//                         }`} />
//                         {n.text}
//                         <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
//                           {new Date(n.ts).toLocaleString()}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className={`p-2.5 border-t ${isDarkMode ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-100 bg-slate-50'}`}>
//                     <button
//                       onClick={() => {
//                         setIsNotifOpen(false);
//                         setIsFullNotifOpen(true);
//                       }}
//                       className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
//                     >
//                       Show all ({myNotifications.length}) <ArrowRight className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Mobile Sub-Nav */}
//         <div className={`md:hidden flex overflow-x-auto border-b p-2 gap-2 ${
//           isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
//         }`}>
//           {navItems.map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
//                 activeTab === tab.id 
//                   ? isDarkMode
//                     ? 'bg-zinc-800 text-emerald-400 border-emerald-500/30'
//                     : 'bg-emerald-50 text-emerald-800 border-emerald-200'
//                   : isDarkMode
//                     ? 'bg-zinc-950 text-zinc-400 border-zinc-800'
//                     : 'bg-slate-100 text-slate-600 border-slate-200'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Main Routed Content Area */}
//         <main className="p-6 max-w-6xl w-full mx-auto">
//           {activeTab === 'overview' && (
//                        <OverviewTab 
//               studentProfile={studentProfile}
//               appliedCommittees={appliedCommittees}
//               setActiveTab={setActiveTab}
//               setIsSlotModalOpen={setIsSlotModalOpen}
//               setSlotTargetId={setSlotTargetId}
//               setIsGrievanceModalOpen={setIsGrievanceModalOpen}
//               super50={super50}
//               grievances={grievances}
//               isDarkMode={isDarkMode}
//             />
//           )}

//           {activeTab === 'committees' && (
//             <CommitteesTab 
//               committees={committees}
//               handleApplyClick={handleApplyClick}
//               setIsGrievanceModalOpen={setIsGrievanceModalOpen}
//               setSelectedCommitteeForGrievance={setSelectedCommitteeForGrievance}
//               isDarkMode={isDarkMode}
//             />
//           )}

//           {activeTab === 'super50' && (
//             <Super50Tab 
//               super50List={super50.rows}
//               myRank={super50.myRank}
//               totalCandidates={super50.total}
//               studentProfile={studentProfile}
//               isDarkMode={isDarkMode}
//             />
//           )}

//           {activeTab === 'events' && (
//             <EventsTab 
//               events={events}
//               myPasses={myPasses}
//               handleBookPass={handleBookPass}
//               isDarkMode={isDarkMode}
//             />
//           )}

//           {activeTab === 'grievance' && (
//             <GrievanceTab 
//               grievances={grievances}
//               setIsGrievanceModalOpen={setIsGrievanceModalOpen}
//               setSelectedCommitteeForGrievance={setSelectedCommitteeForGrievance}
//               isDarkMode={isDarkMode}
//             />
//           )}
//         </main>
//       </div>

//       {/* --- CLEAN EXECUTIVE STUDENT PROFILE MODAL (CLICK OUTSIDE TO CLOSE) --- */}
//       {isProfileModalOpen && (
//         <div 
//           onClick={() => setIsProfileModalOpen(false)}
//           className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()}
//             className={`max-w-4xl w-full rounded-3xl border shadow-2xl overflow-hidden transition-all ${
//               isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
//             }`}
//           >
//             {/* Top Banner Header */}
//             <div className={`px-6 py-6 md:px-8 md:py-7 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
//               isDarkMode 
//                 ? 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-zinc-800' 
//                 : 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200'
//             }`}>
//               <div className="flex items-center gap-4">
//                 <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-zinc-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
//                   {initials}
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">{studentProfile.name}</h2>
//                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
//                       <ShieldCheck className="w-3 h-3" /> Verified
//                     </span>
//                   </div>
//                   <div className={`text-xs font-mono mt-1 flex flex-wrap items-center gap-2 ${
//                     isDarkMode ? 'text-zinc-400' : 'text-slate-500'
//                   }`}>
//                     <span className="font-semibold text-emerald-500">{studentProfile.rollNo}</span>
//                     <span>•</span>
//                     <span>{studentProfile.branch}</span>
//                     <span>•</span>
//                     <span>{studentProfile.semester}</span>
//                   </div>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => setIsProfileModalOpen(false)}
//                 aria-label="Close profile"
//                 className={`self-end sm:self-center p-2 rounded-xl border transition-colors ${
//                   isDarkMode 
//                     ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' 
//                     : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
//                 }`}
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Key Metrics Strip */}
//             <div className={`grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-b ${
//               isDarkMode ? 'divide-zinc-800 border-zinc-800 bg-zinc-950/40' : 'divide-slate-200 border-slate-200 bg-slate-50/60'
//             }`}>
//               <div className="p-4 text-center">
//                 <div className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Cumulative CGPA</div>
//                 <div className="text-lg font-black text-emerald-500 mt-0.5">{studentProfile.cgpa ?? "N/A"}{studentProfile.cgpa != null ? " / 10" : ""}</div>
//               </div>
//               <div className="p-4 text-center">
//                 <div className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Super 50 Standing</div>
//                 <div className="text-lg font-black text-amber-500 mt-0.5">
//                   {super50.myRank ? `Rank #${super50.myRank}` : 'Unranked'}
//                 </div>
//               </div>
//               <div className="p-4 text-center">
//                 <div className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Committee Drives</div>
//                 <div className="text-lg font-black mt-0.5">{appliedCommittees.length} Applied</div>
//               </div>
//               <div className="p-4 text-center">
//                 <div className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Active Passes</div>
//                 <div className="text-lg font-black text-emerald-500 mt-0.5">{myPasses.length} Verified</div>
//               </div>
//             </div>

//             {/* Structured Two-Column Body */}
//             <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Left Column: Committee Applications & Event Passes */}
//               <div className="space-y-5">
//                 <div>
//                   <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
//                     isDarkMode ? 'text-zinc-400' : 'text-slate-500'
//                   }`}>
//                     <Briefcase className="w-3.5 h-3.5 text-emerald-500" /> Committee Applications & Roles
//                   </h3>
//                   {appliedCommittees.length === 0 ? (
//                     <div className={`p-4 rounded-2xl border text-xs ${
//                       isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-400'
//                     }`}>
//                       No active committee applications yet.
//                     </div>
//                   ) : (
//                     <div className="space-y-2.5">
//                       {appliedCommittees.map((app) => (
//                         <div key={app.id} className={`p-4 rounded-2xl border ${
//                           isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
//                         }`}>
//                           <div className="flex items-start justify-between gap-2">
//                             <div>
//                               <div className="font-bold text-sm">{app.name}</div>
//                               <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
//                                 Role: <span className="font-medium">{app.role}</span>
//                               </div>
//                             </div>
//                             <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
//                               app.status === 'Rejected'
//                                 ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
//                                 : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
//                             }`}>
//                               {app.status}
//                             </span>
//                           </div>
//                           {app.interviewSlot && (
//                             <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center gap-1.5 ${
//                               isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-600'
//                             }`}>
//                               <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
//                               <span>Next Event / Slot: <b className="text-emerald-500">{app.interviewSlot}</b></span>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Registered Event Passes */}
//                 <div>
//                   <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
//                     isDarkMode ? 'text-zinc-400' : 'text-slate-500'
//                   }`}>
//                     <Ticket className="w-3.5 h-3.5 text-emerald-500" /> Issued Gate Passes
//                   </h3>
//                   {myPasses.length === 0 ? (
//                     <div className={`p-4 rounded-2xl border text-xs ${
//                       isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-400'
//                     }`}>
//                       No event passes booked yet.
//                     </div>
//                   ) : (
//                     <div className="space-y-2">
//                       {myPasses.map((p) => (
//                         <div key={p.id} className={`px-4 py-3 rounded-xl border flex items-center justify-between text-xs ${
//                           isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
//                         }`}>
//                           <span className="font-semibold truncate pr-2">{p.eventTitle}</span>
//                           <span className="font-mono text-[11px] font-bold text-emerald-500 shrink-0">{p.passId}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right Column: Super 50 Cohort Analytics */}
//               <div>
//                 <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
//                   isDarkMode ? 'text-zinc-400' : 'text-slate-500'
//                 }`}>
//                   <Award className="w-3.5 h-3.5 text-amber-500" /> Super 50 Cohort Evaluation
//                 </h3>

//                 {mySuper50Row ? (
//                   <div className={`p-5 rounded-2xl border space-y-4 ${
//                     isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
//                   }`}>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="text-xs text-zinc-400">Overall Cohort Position</div>
//                         <div className="text-xl font-black mt-0.5">
//                           Rank #{mySuper50Row.rank} <span className="text-xs font-normal text-zinc-500">of {super50.total}</span>
//                         </div>
//                       </div>
//                       <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
//                         {mySuper50Row.status}
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-3 gap-2.5">
//                       <div className={`p-3 rounded-xl border text-center ${
//                         isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
//                       }`}>
//                         <div className="text-[10px] text-zinc-400">Aptitude</div>
//                         <div className="text-sm font-extrabold mt-0.5">{mySuper50Row.assessmentScore}</div>
//                       </div>
//                       <div className={`p-3 rounded-xl border text-center ${
//                         isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
//                       }`}>
//                         <div className="text-[10px] text-zinc-400">Rubric</div>
//                         <div className="text-sm font-extrabold mt-0.5">{mySuper50Row.interviewScore}</div>
//                       </div>
//                       <div className={`p-3 rounded-xl border text-center ${
//                         isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
//                       }`}>
//                         <div className="text-[10px] text-zinc-400">Composite</div>
//                         <div className="text-sm font-extrabold text-emerald-500 mt-0.5">{mySuper50Row.compositeScore}</div>
//                       </div>
//                     </div>

//                     {mySuper50Row.rank > 50 ? (
//                       <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 leading-relaxed">
//                         <b>Improvement Area:</b> Currently outside the Top 50 threshold. Raise your coding assessment or panel rubric score to qualify.
//                       </div>
//                     ) : (
//                       <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 leading-relaxed">
//                         You meet all academic and technical benchmarks for the Super 50 flagship cohort.
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className={`p-5 rounded-2xl border text-xs space-y-2 ${
//                     isDarkMode ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-600'
//                   }`}>
//                     <div className="font-bold text-sm text-amber-500">Not Yet Ranked</div>
//                     <p className="leading-relaxed">
//                       You have not completed the Super 50 proctored coding assessment and panel interview yet. Complete both evaluations to unlock your cohort rank.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer Action Bar with Working Logout Button */}
//             <div className={`px-6 py-4 md:px-8 border-t flex items-center justify-between gap-4 ${
//               isDarkMode ? 'border-zinc-800 bg-zinc-950/60' : 'border-slate-200 bg-slate-50'
//             }`}>
//               <button
//                 onClick={handleLogout}
//                 className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
//                   isDarkMode
//                     ? 'bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border-rose-800/50'
//                     : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
//                 }`}
//               >
//                 <LogOut className="w-4 h-4" />
//                 Sign Out
//               </button>

//               <button
//                 onClick={() => setIsProfileModalOpen(false)}
//                 className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
//                   isDarkMode
//                     ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
//                     : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
//                 }`}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- FULL-SCREEN NOTIFICATIONS MODAL (CLICK OUTSIDE TO CLOSE) --- */}
//       {isFullNotifOpen && (
//         <div 
//           onClick={() => setIsFullNotifOpen(false)}
//           className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()}
//             className={`max-w-3xl w-full rounded-3xl border p-6 md:p-8 shadow-2xl relative ${
//               isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
//             }`}
//           >
//             <div className={`flex items-center justify-between pb-5 border-b ${
//               isDarkMode ? 'border-zinc-800' : 'border-slate-200'
//             }`}>
//               <div>
//                 <h2 className="text-xl font-extrabold flex items-center gap-2">
//                   <Bell className="w-5 h-5 text-emerald-500" /> All Notifications
//                 </h2>
//                 <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
//                   Complete activity log of committee updates, passes, and SLA alerts.
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <button 
//                   onClick={() => actions.markRead(studentRollNo)}
//                   className="text-xs text-emerald-500 hover:underline font-semibold flex items-center gap-1"
//                 >
//                   <CheckCheck className="w-4 h-4" /> Mark all read
//                 </button>
//                 <button 
//                   onClick={() => setIsFullNotifOpen(false)}
//                   className={`p-2 rounded-xl border ${
//                     isDarkMode ? 'border-zinc-800 text-zinc-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'
//                   }`}
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="mt-5 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
//               {myNotifications.length === 0 ? (
//                 <div className={`p-8 text-center text-xs rounded-2xl border ${
//                   isDarkMode ? 'border-zinc-800 text-zinc-500' : 'border-slate-200 text-slate-400'
//                 }`}>
//                   No notifications recorded yet.
//                 </div>
//               ) : (
//                 myNotifications.map((n) => (
//                   <div 
//                     key={n.id} 
//                     className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
//                       isDarkMode ? 'bg-zinc-950/70 border-zinc-800' : 'bg-slate-50 border-slate-200'
//                     }`}
//                   >
//                     <div className="flex items-start gap-3">
//                       <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
//                         n.tone === 'good' ? 'bg-emerald-500' : n.tone === 'bad' ? 'bg-rose-500' : n.tone === 'warn' ? 'bg-amber-500' : 'bg-sky-500'
//                       }`} />
//                       <div className="text-xs leading-relaxed">{n.text}</div>
//                     </div>
//                     <span className={`text-[10px] shrink-0 font-mono ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
//                       {new Date(n.ts).toLocaleString()}
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- OTHER MODALS (CLICK OUTSIDE TO CLOSE) --- */}

//       {/* 1. Auto-Screening Modal */}
//       {isApplyModalOpen && selectedCommittee && (
//         <div 
//           onClick={() => setIsApplyModalOpen(false)}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()}
//             className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
//               isDarkMode 
//                 ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
//                 : 'bg-white border-slate-200 text-slate-900'
//             }`}
//           >
//             <h3 className="font-bold text-lg">Apply for {selectedCommittee.name}</h3>
//             <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
//               Designation: <b>{selectedCommittee.role}</b>
//             </p>
//             <div className={`mt-4 p-4 rounded-xl text-xs space-y-2 border ${
//               isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
//             }`}>
//               <div className="flex justify-between">
//                 <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>Your Current CGPA:</span>
//                 <span className="font-bold">{studentProfile.cgpa ?? "N/A"}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>Minimum Cutoff:</span>
//                 <span className="font-bold text-emerald-500">{selectedCommittee.minCgpa} CGPA</span>
//               </div>
//               <div className={`flex justify-between pt-1 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
//                 <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>Screening Result:</span>
//                 {studentProfile.cgpa == null ? (
//                   <span className="font-bold text-amber-500">PENDING (Profile data unavailable)</span>
//                 ) : studentProfile.cgpa >= selectedCommittee.minCgpa ? (
//                   <span className="font-bold text-emerald-500">PASS (Eligible to Auto-Shortlist)</span>
//                 ) : (
//                   <span className="font-bold text-rose-500">FAIL (Below CGPA cutoff)</span>
//                 )}
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end gap-3">
//               <button 
//                 onClick={() => setIsApplyModalOpen(false)} 
//                 className={`px-4 py-2 text-xs font-semibold rounded-xl ${
//                   isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-100'
//                 }`}
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={submitApplication} 
//                 className="px-5 py-2 text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md"
//               >
//                 Submit Application
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 2. Self-Service Slot Modal */}
//       {isSlotModalOpen && (
//         <div 
//           onClick={() => setIsSlotModalOpen(false)}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()}
//             className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
//               isDarkMode 
//                 ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
//                 : 'bg-white border-slate-200 text-slate-900'
//             }`}
//           >
//             <h3 className="font-bold text-lg">Select Interview Slot</h3>
//             <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
//               Slots auto-lock upon selection to prevent double bookings.
//             </p>
//             <div className="mt-4 space-y-2">
//               {freeSlots.length === 0 && (
//                 <div className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>No free slots right now. The admin will be notified.</div>
//               )}
//               {freeSlots.map((slot) => (
//                 <button
//                   key={slot.id}
//                   onClick={() => confirmSlotBooking(slot)}
//                   className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
//                     isDarkMode
//                       ? 'border-zinc-800 bg-zinc-950/70 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-zinc-200'
//                       : 'border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800'
//                   }`}
//                 >
//                   <span className="flex items-center gap-2">
//                     <Clock className="w-3.5 h-3.5 text-emerald-500" /> {slot.label}
//                   </span>
//                   <span className="text-[10px] text-emerald-500 font-bold">Claim Slot →</span>
//                 </button>
//               ))}
//             </div>
//             <div className="mt-5 text-right">
//               <button 
//                 onClick={() => setIsSlotModalOpen(false)} 
//                 className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 3. Event Pass Payment Modal */}
//       {isPaymentModalOpen && selectedEventForBooking && (
//         <div 
//           onClick={() => setIsPaymentModalOpen(false)}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()}
//             className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
//               isDarkMode 
//                 ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
//                 : 'bg-white border-slate-200 text-slate-900'
//             }`}
//           >
//             <h3 className="font-bold text-lg">Confirm & Pay: {selectedEventForBooking.title}</h3>
//             <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
//               Instant seat reservation with UPI QR simulation.
//             </p>
//             <div className={`mt-4 p-4 rounded-xl border text-center ${
//               isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
//             }`}>
//               <div className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Payable Amount:</div>
//               <div className="text-3xl font-black mt-1 text-emerald-500">{selectedEventForBooking.price}</div>
//               <div className={`mt-3 inline-block p-3 rounded-xl border ${
//                 isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-inner'
//               }`}>
//                 <div className="w-36 h-36 bg-zinc-950 border border-zinc-800 text-white rounded-lg flex flex-col items-center justify-center mx-auto text-xs font-mono">
//                   <span className="text-emerald-400 font-bold">[ UPI QR CODE ]</span>
//                   <span className="text-[9px] text-zinc-400 mt-1">GPay / Paytm / PhonePe</span>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-5 flex gap-3">
//               <button 
//                 onClick={() => setIsPaymentModalOpen(false)} 
//                 className={`flex-1 py-2.5 text-xs font-semibold rounded-xl ${
//                   isDarkMode ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-100'
//                 }`}
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={processPayment} 
//                 className="flex-1 py-2.5 text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md"
//               >
//                 Simulate Payment Success
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 4. Raise Grievance Modal */}
//       {isGrievanceModalOpen && (
//         <div 
//           onClick={() => setIsGrievanceModalOpen(false)}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()}
//             className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
//               isDarkMode 
//                 ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
//                 : 'bg-white border-slate-200 text-slate-900'
//             }`}
//           >
//             <h3 className="font-bold text-lg">Lodge Campus Grievance</h3>
//             <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
//               Protected by a 48-hour automated escalation SLA.
//             </p>
//             <form onSubmit={submitGrievance} className="mt-4 space-y-3">
//               <div>
//                 <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>
//                   Target Committee
//                 </label>
//                 <select 
//                   value={selectedCommitteeForGrievance} 
//                   onChange={(e) => setSelectedCommitteeForGrievance(e.target.value)}
//                   className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
//                     isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-900'
//                   }`}
//                 >
//                   {committeeNames.map((name) => (
//                     <option key={name} value={name}>{name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>
//                   Issue Subject
//                 </label>
//                 <input 
//                   type="text" 
//                   placeholder="e.g. Broken water cooler on 2nd floor" 
//                   value={grievanceForm.title}
//                   onChange={(e) => setGrievanceForm(prev => ({ ...prev, title: e.target.value }))}
//                   required
//                   className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
//                     isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600' : 'bg-white border-slate-200 text-slate-900'
//                   }`}
//                 />
//               </div>
//               <div>
//                 <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>
//                   Details
//                 </label>
//                 <textarea 
//                   rows={3} 
//                   placeholder="Explain the issue clearly..." 
//                   value={grievanceForm.description}
//                   onChange={(e) => setGrievanceForm(prev => ({ ...prev, description: e.target.value }))}
//                   required
//                   className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
//                     isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600' : 'bg-white border-slate-200 text-slate-900'
//                   }`}
//                 />
//               </div>
//               <div className="flex justify-end gap-3 pt-3">
//                 <button 
//                   type="button" 
//                   onClick={() => setIsGrievanceModalOpen(false)} 
//                   className={`px-4 py-2 text-xs font-semibold rounded-xl ${
//                     isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-100'
//                   }`}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md"
//                 >
//                   Submit Ticket
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Award, Calendar, AlertCircle, Ticket, CheckCircle2, 
  Clock, Bell, ShieldCheck, Sparkles, LayoutDashboard,
  Sun, Moon, Menu, X, ArrowRight, CheckCheck, Briefcase, LogOut
} from 'lucide-react';
import { loadCommittees } from '../shared/committeeService';
import OverviewTab from './components/OverviewTab';
import CommitteesTab from './components/CommitteesTab';
import Super50Tab from './components/Super50Tab';
import EventsTab from './components/EventsTab';
import GrievanceTab from './components/GrievanceTab';
import { loadApplications, applyRemote } from '../shared/applicationService';
import { useDB, actions, select, getDB } from '../shared/store';
import { useAutomationLoop } from '../shared/hooks';
import { loadSlots, bookSlotRemote } from '../shared/slotService';
import { loadEventData, payRemote } from '../shared/eventService';
import { loadGrievances, raiseGrievanceRemote } from '../shared/grievanceService';
import { loadCandidates } from '../shared/candidateService';
import { loadNotifications } from '../shared/notificationService';

export default function StudentApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Notifications & Profile Modal States
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isFullNotifOpen, setIsFullNotifOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const notifRef = useRef(null);

  // Close notification dropdown on outside click

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', !isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  // Close modals on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsProfileModalOpen(false);
        setIsFullNotifOpen(false);
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock background page scroll while a full-screen modal is open
  useEffect(() => {
    const locked = isProfileModalOpen || isFullNotifOpen;
    const prev = document.body.style.overflow;
    if (locked) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isProfileModalOpen, isFullNotifOpen]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Working Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('campusToken');
    localStorage.removeItem('campusUser');
    localStorage.removeItem('campusnexus_user');
    setIsProfileModalOpen(false);

    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      window.location.href = '/';
    }
  };

  // ---- Shared Store Data + Authenticated Sign-Up User Override ----
  const db = useDB();
  const now = useAutomationLoop();
     useEffect(() => {
    const load = () => {
      loadCommittees().catch(console.error);
      loadApplications().catch(console.error);
       loadSlots().catch(console.error);
       loadEventData().catch(console.error);
             loadGrievances().catch(console.error);
            loadCandidates().catch(console.error); 
            loadNotifications().catch(console.error);
    };
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);
  const authUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('campusUser'));
    } catch {
      return null;
    }
  })();
const studentRollNo = authUser?.rollNo || '';
  const storeStudent = select.student(db, studentRollNo) || {};

  // Do not show demo profile values when the authenticated profile is incomplete.
  const studentProfile = {
    ...storeStudent,
    name: authUser?.name || storeStudent.name || 'Student',
    rollNo: studentRollNo || storeStudent.rollNo || '',
    email: authUser?.email || '',
    branch: authUser?.branch || storeStudent.branch || '',
    semester: authUser?.semester || storeStudent.semester || '',
    cgpa: storeStudent.cgpa ?? authUser?.cgpa ?? null,
  };

  const committees = select.openCommittees(db);
  const committeeNames = select.committeeNames(db);
  const appliedCommittees = select.studentApplications(db, studentRollNo);
  const super50 = select.super50(db, studentRollNo);
  const events = select.events(db);
   console.log('events in store:', events.length); 
  const myPasses = select.passesFor(db, studentRollNo);
  const grievances = select.grievancesFor(db, studentRollNo, now);
  const myNotifications = select.notificationsFor(db, studentRollNo);
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotTargetId, setSlotTargetId] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
    const [selectedCommitteeForGrievance, setSelectedCommitteeForGrievance] = useState('');
  const [grievanceForm, setGrievanceForm] = useState({ title: '', description: '' });

  const freeSlots = select.freeSlotsFor(db, slotTargetId);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'committees', label: 'Committees & Hiring', icon: Users },
    { id: 'super50', label: 'Super 50 Cohort', icon: Award },
    { id: 'events', label: 'Garba & Fiesta Passes', icon: Ticket },
    { id: 'grievance', label: 'Grievance Desk (SLA)', icon: AlertCircle }
  ];

  // Handlers
  const handleApplyClick = (comm) => {
    setSelectedCommittee(comm);
    setIsApplyModalOpen(true);
  };

      const submitApplication = async () => {
    setIsApplyModalOpen(false);
    try {
      const app = await applyRemote(selectedCommittee.id);
      if (app.status === 'Rejected') {
        showToast(`Auto-Screening Failed: ${app.remark}.`);
        setActiveTab('overview');
      } else {
        showToast(`Success! You are Shortlisted. Pick your interview slot.`);
        setSlotTargetId(app.id);
        setIsSlotModalOpen(true);
      }
    } catch (e) {
      showToast(e.message);
    }
  };

  const confirmSlotBooking = async (slot) => {
    try {
      await bookSlotRemote(slotTargetId, slot.id);
      setIsSlotModalOpen(false);
      showToast(`Interview slot confirmed for ${slot.label}!`);
      setActiveTab('overview');
    } catch (e) {
      showToast(e.message);
    }
  };

    const bookEvent = async (ev) => {
    setIsPaymentModalOpen(false);
    try {
      const { payment } = await payRemote(ev.id);
      if (ev.numericPrice === 0) {
        showToast('You are registered! Your pass is ready.');
      } else if (payment.status === 'Verified') {
        showToast(`Payment of ${ev.price} verified! Digital QR pass issued.`);
      } else {
        showToast('Payment received. Waiting for admin verification, your pass will appear here.');
      }
      setActiveTab('events');
    } catch (e) {
      showToast(e.message);
    }
  };

  const processPayment = () => bookEvent(selectedEventForBooking);

  const handleBookPass = (event) => {
    if (event.numericPrice === 0) {
      bookEvent(event);
      return;
    }
    setSelectedEventForBooking(event);
    setIsPaymentModalOpen(true);
  };

    const submitGrievance = async (e) => {
    e.preventDefault();
    if (!grievanceForm.title.trim()) return;
    const target = committeeNames.includes(selectedCommitteeForGrievance)
      ? selectedCommitteeForGrievance
      : committeeNames[0];
    if (!target) {
      showToast('No committees are available yet to receive a complaint.');
      return;
    }
    try {
      const g = await raiseGrievanceRemote({
        committee: target,
        title: grievanceForm.title.trim(),
        description: (grievanceForm.description || '').trim() || grievanceForm.title.trim(),
      });
      setGrievanceForm({ title: '', description: '' });
      setIsGrievanceModalOpen(false);
      showToast(`Complaint ${g.id} filed with ${target}. ${g.slaHours}-hour SLA escalation clock started!`);
    } catch (err) {
      showToast(err.message);
    }
  };

  const initials = studentProfile.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const mySuper50Row = super50.rows.find((r) => r.rollNo === studentRollNo);

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-zinc-950 text-zinc-100 selection:bg-emerald-400 selection:text-zinc-950' 
        : 'bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border animate-bounce ${
          isDarkMode 
            ? 'bg-zinc-900 text-zinc-100 border-zinc-700' 
            : 'bg-white text-slate-900 border-slate-200 shadow-lg'
        }`}>
          <Sparkles className="w-4 h-4 text-emerald-500" />
          {toastMessage}
        </div>
      )}

      {/* --- LEFT SIDEBAR NAVBAR --- */}
      <aside className={`border-r transition-all duration-300 ease-in-out shrink-0 sticky top-0 h-screen flex flex-col justify-between hidden md:flex ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          {/* YouTube-style Hamburger Menu + CampusNexus Logo */}
          <div className={`h-16 px-4 border-b flex items-center gap-3 overflow-hidden ${
            isDarkMode ? 'border-zinc-800' : 'border-slate-100'
          }`}>
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              aria-label="Toggle Sidebar"
              className={`p-2 rounded-xl transition-all shrink-0 ${
                isDarkMode 
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className={`p-2 rounded-xl font-black text-xs shrink-0 flex items-center justify-center ${
                isDarkMode ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/20' : 'bg-emerald-600 text-white'
              }`}>
                <span>⚡</span>
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <span className={`font-extrabold text-base tracking-tight truncate block ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>CampusNexus</span>
                  <div className={`text-[10px] tracking-tight truncate ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                    Student Governance
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={!isSidebarOpen ? tab.label : ''}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? isDarkMode 
                        ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm' 
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm'
                      : isDarkMode 
                        ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {isSidebarOpen && <span className="truncate">{tab.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className={`p-3 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
          <button
            onClick={() => setIsProfileModalOpen(true)}
            title="View student profile"
            className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
              isDarkMode 
                ? 'bg-zinc-800/60 hover:bg-zinc-800 border-zinc-800 hover:border-emerald-500/30' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
              isDarkMode ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-600 text-white'
            }`}>
              {initials}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden flex-1">
                <div className={`font-bold text-xs truncate ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                  {studentProfile.name}
                </div>
                <div className={`text-[10px] font-mono truncate ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {studentProfile.rollNo}
                </div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* --- RIGHT SIDE MAIN CONTAINER --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className={`border-b sticky top-0 z-30 h-16 px-6 flex items-center justify-between backdrop-blur-md transition-colors ${
          isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              CampusNexus / <span className={`font-bold capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              aria-label="Toggle Theme"
              className={`p-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-semibold ${
                isDarkMode 
                  ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-amber-300' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  const open = !isNotifOpen;
                  setIsNotifOpen(open);
                  if (open) actions.markRead(studentRollNo);
                }}
                aria-label="Notifications"
                className={`p-2 rounded-xl transition-all relative border ${
                  isDarkMode 
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-800' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className={`absolute right-0 mt-2 w-80 md:w-96 rounded-2xl border shadow-2xl z-40 overflow-hidden ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                }`}>
                  <div className={`px-4 py-3 text-xs font-bold border-b flex items-center justify-between ${
                    isDarkMode ? 'border-zinc-800 text-white' : 'border-slate-100 text-slate-900'
                  }`}>
                    <span>Notifications</span>
                    <button
                      onClick={() => actions.markRead(studentRollNo)}
                      className="text-[11px] text-emerald-500 hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {myNotifications.length === 0 && (
                      <div className={`p-4 text-xs ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                        No notifications yet.
                      </div>
                    )}
                    {myNotifications.slice(0, 5).map((n) => (
                      <div key={n.id} className={`px-4 py-2.5 text-xs border-b last:border-0 ${
                        isDarkMode ? 'border-zinc-800 text-zinc-300' : 'border-slate-100 text-slate-700'
                      }`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                          n.tone === 'good' ? 'bg-emerald-500' : n.tone === 'bad' ? 'bg-rose-500' : n.tone === 'warn' ? 'bg-amber-500' : 'bg-sky-500'
                        }`} />
                        {n.text}
                        <div className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                          {new Date(n.ts).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`p-2.5 border-t ${isDarkMode ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-100 bg-slate-50'}`}>
                    <button
                      onClick={() => {
                        setIsNotifOpen(false);
                        setIsFullNotifOpen(true);
                      }}
                      className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      Show all ({myNotifications.length}) <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Sub-Nav */}
        <div className={`md:hidden flex overflow-x-auto border-b p-2 gap-2 ${
          isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          {navItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                activeTab === tab.id 
                  ? isDarkMode
                    ? 'bg-zinc-800 text-emerald-400 border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : isDarkMode
                    ? 'bg-zinc-950 text-zinc-400 border-zinc-800'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Routed Content Area */}
        <main className="p-6 max-w-6xl w-full mx-auto">
          {activeTab === 'overview' && (
                       <OverviewTab 
              studentProfile={studentProfile}
              appliedCommittees={appliedCommittees}
              setActiveTab={setActiveTab}
              setIsSlotModalOpen={setIsSlotModalOpen}
              setSlotTargetId={setSlotTargetId}
              setIsGrievanceModalOpen={setIsGrievanceModalOpen}
              super50={super50}
              grievances={grievances}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'committees' && (
            <CommitteesTab 
              committees={committees}
              handleApplyClick={handleApplyClick}
              setIsGrievanceModalOpen={setIsGrievanceModalOpen}
              setSelectedCommitteeForGrievance={setSelectedCommitteeForGrievance}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'super50' && (
            <Super50Tab 
              super50List={super50.rows}
              myRank={super50.myRank}
              totalCandidates={super50.total}
              studentProfile={studentProfile}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'events' && (
            <EventsTab 
              events={events}
              myPasses={myPasses}
              handleBookPass={handleBookPass}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'grievance' && (
            <GrievanceTab 
              grievances={grievances}
              setIsGrievanceModalOpen={setIsGrievanceModalOpen}
              setSelectedCommitteeForGrievance={setSelectedCommitteeForGrievance}
              isDarkMode={isDarkMode}
            />
          )}
        </main>
      </div>

      {/* --- CLEAN EXECUTIVE STUDENT PROFILE MODAL (CLICK OUTSIDE TO CLOSE) --- */}
      {isProfileModalOpen && (
        <div 
          onClick={() => setIsProfileModalOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md"
        >
          <div className="min-h-full flex items-center justify-center p-4 md:p-8">
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`max-w-4xl w-full rounded-3xl border shadow-2xl overflow-hidden transition-all ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Top Banner Header */}
            <div className={`px-6 py-6 md:px-8 md:py-7 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-zinc-800' 
                : 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-zinc-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">{studentProfile.name}</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <div className={`text-xs font-mono mt-1 flex flex-wrap items-center gap-2 ${
                    isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                  }`}>
                    <span className="font-semibold text-emerald-500">{studentProfile.rollNo}</span>
                    <span>•</span>
                    <span>{studentProfile.branch}</span>
                    <span>•</span>
                    <span>{studentProfile.semester}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsProfileModalOpen(false)}
                aria-label="Close profile"
                className={`self-end sm:self-center p-2 rounded-xl border transition-colors ${
                  isDarkMode 
                    ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' 
                    : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Metrics Strip */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border-b ${
              isDarkMode ? 'divide-zinc-800 border-zinc-800 bg-zinc-950/40' : 'divide-slate-200 border-slate-200 bg-slate-50/60'
            }`}>
              <div className="p-4 text-center">
                <div className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Cumulative CGPA</div>
                <div className="text-lg font-black text-emerald-500 mt-0.5">{studentProfile.cgpa ?? "N/A"}{studentProfile.cgpa != null ? " / 10" : ""}</div>
              </div>
              <div className="p-4 text-center">
                <div className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Super 50 Standing</div>
                <div className="text-lg font-black text-amber-500 mt-0.5">
                  {super50.myRank ? `Rank #${super50.myRank}` : 'Unranked'}
                </div>
              </div>
              <div className="p-4 text-center">
                <div className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Committee Drives</div>
                <div className="text-lg font-black mt-0.5">{appliedCommittees.length} Applied</div>
              </div>
              <div className="p-4 text-center">
                <div className={`text-[11px] font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Active Passes</div>
                <div className="text-lg font-black text-emerald-500 mt-0.5">{myPasses.length} Verified</div>
              </div>
            </div>

            {/* Structured Two-Column Body */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Committee Applications & Event Passes */}
              <div className="space-y-5">
                <div>
                  <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                  }`}>
                    <Briefcase className="w-3.5 h-3.5 text-emerald-500" /> Committee Applications & Roles
                  </h3>
                  {appliedCommittees.length === 0 ? (
                    <div className={`p-4 rounded-2xl border text-xs ${
                      isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      No active committee applications yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {appliedCommittees.map((app) => (
                        <div key={app.id} className={`p-4 rounded-2xl border ${
                          isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-sm">{app.name}</div>
                              <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                                Role: <span className="font-medium">{app.role}</span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                              app.status === 'Rejected'
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          {app.interviewSlot && (
                            <div className={`mt-3 pt-2.5 border-t text-[11px] flex items-center gap-1.5 ${
                              isDarkMode ? 'border-zinc-800 text-zinc-400' : 'border-slate-200 text-slate-600'
                            }`}>
                              <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>Next Event / Slot: <b className="text-emerald-500">{app.interviewSlot}</b></span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Registered Event Passes */}
                <div>
                  <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                  }`}>
                    <Ticket className="w-3.5 h-3.5 text-emerald-500" /> Issued Gate Passes
                  </h3>
                  {myPasses.length === 0 ? (
                    <div className={`p-4 rounded-2xl border text-xs ${
                      isDarkMode ? 'bg-zinc-950/50 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      No event passes booked yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {myPasses.map((p) => (
                        <div key={p.id} className={`px-4 py-3 rounded-xl border flex items-center justify-between text-xs ${
                          isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <span className="font-semibold truncate pr-2">{p.eventTitle}</span>
                          <span className="font-mono text-[11px] font-bold text-emerald-500 shrink-0">{p.passId}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Super 50 Cohort Analytics */}
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                  isDarkMode ? 'text-zinc-400' : 'text-slate-500'
                }`}>
                  <Award className="w-3.5 h-3.5 text-amber-500" /> Super 50 Cohort Evaluation
                </h3>

                {mySuper50Row ? (
                  <div className={`p-5 rounded-2xl border space-y-4 ${
                    isDarkMode ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-zinc-400">Overall Cohort Position</div>
                        <div className="text-xl font-black mt-0.5">
                          Rank #{mySuper50Row.rank} <span className="text-xs font-normal text-zinc-500">of {super50.total}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {mySuper50Row.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div className={`p-3 rounded-xl border text-center ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                      }`}>
                        <div className="text-[10px] text-zinc-400">Aptitude</div>
                        <div className="text-sm font-extrabold mt-0.5">{mySuper50Row.assessmentScore}</div>
                      </div>
                      <div className={`p-3 rounded-xl border text-center ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                      }`}>
                        <div className="text-[10px] text-zinc-400">Rubric</div>
                        <div className="text-sm font-extrabold mt-0.5">{mySuper50Row.interviewScore}</div>
                      </div>
                      <div className={`p-3 rounded-xl border text-center ${
                        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                      }`}>
                        <div className="text-[10px] text-zinc-400">Composite</div>
                        <div className="text-sm font-extrabold text-emerald-500 mt-0.5">{mySuper50Row.compositeScore}</div>
                      </div>
                    </div>

                    {mySuper50Row.rank > 50 ? (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 leading-relaxed">
                        <b>Improvement Area:</b> Currently outside the Top 50 threshold. Raise your coding assessment or panel rubric score to qualify.
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 leading-relaxed">
                        You meet all academic and technical benchmarks for the Super 50 flagship cohort.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`p-5 rounded-2xl border text-xs space-y-2 ${
                    isDarkMode ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold text-sm text-amber-500">Not Yet Ranked</div>
                    <p className="leading-relaxed">
                      You have not completed the Super 50 proctored coding assessment and panel interview yet. Complete both evaluations to unlock your cohort rank.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Action Bar with Working Logout Button */}
            <div className={`px-6 py-4 md:px-8 border-t flex items-center justify-between gap-4 ${
              isDarkMode ? 'border-zinc-800 bg-zinc-950/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                onClick={handleLogout}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                  isDarkMode
                    ? 'bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border-rose-800/50'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>

              <button
                onClick={() => setIsProfileModalOpen(false)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isDarkMode
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                }`}
              >
                Close
              </button>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* --- FULL-SCREEN NOTIFICATIONS MODAL (CLICK OUTSIDE TO CLOSE) --- */}
      {isFullNotifOpen && (
        <div 
          onClick={() => setIsFullNotifOpen(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md"
        >
          <div className="min-h-full flex items-center justify-center p-4 md:p-8">
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`max-w-3xl w-full rounded-3xl border p-6 md:p-8 shadow-2xl relative ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`flex items-center justify-between pb-5 border-b ${
              isDarkMode ? 'border-zinc-800' : 'border-slate-200'
            }`}>
              <div>
                <h2 className="text-xl font-extrabold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-emerald-500" /> All Notifications
                </h2>
                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Complete activity log of committee updates, passes, and SLA alerts.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => actions.markRead(studentRollNo)}
                  className="text-xs text-emerald-500 hover:underline font-semibold flex items-center gap-1"
                >
                  <CheckCheck className="w-4 h-4" /> Mark all read
                </button>
                <button 
                  onClick={() => setIsFullNotifOpen(false)}
                  className={`p-2 rounded-xl border ${
                    isDarkMode ? 'border-zinc-800 text-zinc-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {myNotifications.length === 0 ? (
                <div className={`p-8 text-center text-xs rounded-2xl border ${
                  isDarkMode ? 'border-zinc-800 text-zinc-500' : 'border-slate-200 text-slate-400'
                }`}>
                  No notifications recorded yet.
                </div>
              ) : (
                myNotifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      isDarkMode ? 'bg-zinc-950/70 border-zinc-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        n.tone === 'good' ? 'bg-emerald-500' : n.tone === 'bad' ? 'bg-rose-500' : n.tone === 'warn' ? 'bg-amber-500' : 'bg-sky-500'
                      }`} />
                      <div className="text-xs leading-relaxed">{n.text}</div>
                    </div>
                    <span className={`text-[10px] shrink-0 font-mono ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                      {new Date(n.ts).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* --- OTHER MODALS (CLICK OUTSIDE TO CLOSE) --- */}

      {/* 1. Auto-Screening Modal */}
      {isApplyModalOpen && selectedCommittee && (
        <div 
          onClick={() => setIsApplyModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="font-bold text-lg">Apply for {selectedCommittee.name}</h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Designation: <b>{selectedCommittee.role}</b>
            </p>
            <div className={`mt-4 p-4 rounded-xl text-xs space-y-2 border ${
              isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>Your Current CGPA:</span>
                <span className="font-bold">{studentProfile.cgpa ?? "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>Minimum Cutoff:</span>
                <span className="font-bold text-emerald-500">{selectedCommittee.minCgpa} CGPA</span>
              </div>
              <div className={`flex justify-between pt-1 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
                <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>Screening Result:</span>
                {studentProfile.cgpa == null ? (
                  <span className="font-bold text-amber-500">PENDING (Profile data unavailable)</span>
                ) : studentProfile.cgpa >= selectedCommittee.minCgpa ? (
                  <span className="font-bold text-emerald-500">PASS (Eligible to Auto-Shortlist)</span>
                ) : (
                  <span className="font-bold text-rose-500">FAIL (Below CGPA cutoff)</span>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setIsApplyModalOpen(false)} 
                className={`px-4 py-2 text-xs font-semibold rounded-xl ${
                  isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button 
                onClick={submitApplication} 
                className="px-5 py-2 text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Self-Service Slot Modal */}
      {isSlotModalOpen && (
        <div 
          onClick={() => setIsSlotModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="font-bold text-lg">Select Interview Slot</h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Slots auto-lock upon selection to prevent double bookings.
            </p>
            <div className="mt-4 space-y-2">
              {freeSlots.length === 0 && (
                <div className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>No free slots right now. The admin will be notified.</div>
              )}
              {freeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => confirmSlotBooking(slot)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                    isDarkMode
                      ? 'border-zinc-800 bg-zinc-950/70 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-zinc-200'
                      : 'border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" /> {slot.label}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold">Claim Slot →</span>
                </button>
              ))}
            </div>
            <div className="mt-5 text-right">
              <button 
                onClick={() => setIsSlotModalOpen(false)} 
                className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Event Pass Payment Modal */}
      {isPaymentModalOpen && selectedEventForBooking && (
        <div 
          onClick={() => setIsPaymentModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="font-bold text-lg">Confirm & Pay: {selectedEventForBooking.title}</h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Instant seat reservation with UPI QR simulation.
            </p>
            <div className={`mt-4 p-4 rounded-xl border text-center ${
              isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Payable Amount:</div>
              <div className="text-3xl font-black mt-1 text-emerald-500">{selectedEventForBooking.price}</div>
              <div className={`mt-3 inline-block p-3 rounded-xl border ${
                isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-inner'
              }`}>
                <div className="w-36 h-36 bg-zinc-950 border border-zinc-800 text-white rounded-lg flex flex-col items-center justify-center mx-auto text-xs font-mono">
                  <span className="text-emerald-400 font-bold">[ UPI QR CODE ]</span>
                  <span className="text-[9px] text-zinc-400 mt-1">GPay / Paytm / PhonePe</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button 
                onClick={() => setIsPaymentModalOpen(false)} 
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl ${
                  isDarkMode ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button 
                onClick={processPayment} 
                className="flex-1 py-2.5 text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md"
              >
                Simulate Payment Success
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Raise Grievance Modal */}
      {isGrievanceModalOpen && (
        <div 
          onClick={() => setIsGrievanceModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <h3 className="font-bold text-lg">Lodge Campus Grievance</h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Protected by a 48-hour automated escalation SLA.
            </p>
            <form onSubmit={submitGrievance} className="mt-4 space-y-3">
              <div>
                <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Target Committee
                </label>
                <select 
                  value={selectedCommitteeForGrievance} 
                  onChange={(e) => setSelectedCommitteeForGrievance(e.target.value)}
                  className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {committeeNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Issue Subject
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Broken water cooler on 2nd floor" 
                  value={grievanceForm.title}
                  onChange={(e) => setGrievanceForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className={`text-xs font-semibold block mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>
                  Details
                </label>
                <textarea 
                  rows={3} 
                  placeholder="Explain the issue clearly..." 
                  value={grievanceForm.description}
                  onChange={(e) => setGrievanceForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                  className={`w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-200 placeholder-zinc-600' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setIsGrievanceModalOpen(false)} 
                  className={`px-4 py-2 text-xs font-semibold rounded-xl ${
                    isDarkMode ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}