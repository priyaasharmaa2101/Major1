// import React, { useState, useEffect } from 'react';
// import { 
//   LayoutDashboard, 
//   Users, 
//   Award, 
//   Ticket, 
//   AlertCircle, 
//   Settings, 
//   Search, 
//   Bell, 
//   Calendar, 
//   Clock, 
//   CheckCircle2, 
//   ChevronRight, 
//   ExternalLink, 
//   QrCode, 
//   Filter, 
//   ArrowUpRight, 
//   ShieldAlert, 
//   MessageSquare, 
//   Camera, 
//   X, 
//   CreditCard, 
//   Sparkles,
//   ChevronDown,
//   UserCheck,
//   Zap,
//   Check,
//   Building,
//   HelpCircle
// } from 'lucide-react';

// export default function App() {
//   // Navigation State
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [toastMessage, setToastMessage] = useState(null);

//   // Notifications State
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([
//     { id: 1, title: 'Interview Slot Confirmed', desc: 'Hostel Committee PI scheduled for tomorrow at 2:30 PM', time: '10m ago', unread: true },
//     { id: 2, title: 'Garba Pass Issued', desc: 'Your VIP pass for Garba Night 2026 is confirmed with QR code', time: '1h ago', unread: true },
//     { id: 3, title: 'Super 50 Screening Passed', desc: 'You cleared the automated CGPA & aptitude screening', time: '1d ago', unread: false }
//   ]);

//   // Toast Helper
//   const showToast = (msg) => {
//     setToastMessage(msg);
//     setTimeout(() => setToastMessage(null), 3500);
//   };

//   // 1. Committee Hiring State
//   const [committees, setCommittees] = useState([
//     {
//       id: 'sac-tech',
//       name: 'SAC Technical Committee',
//       tag: 'Flagship Body',
//       lead: 'Aarav Sharma (B.Tech CS 4th Yr)',
//       role: 'Web & Infrastructure Lead',
//       deadline: 'Oct 28, 2026',
//       minCgpa: 7.5,
//       requiredBranch: 'All Branches',
//       vacancies: 4,
//       status: 'Open'
//     },
//     {
//       id: 'hostel-mess',
//       name: 'Hostel & Mess Management Committee',
//       tag: 'Student Welfare',
//       lead: 'Pooja Verma (B.Tech ME 3rd Yr)',
//       role: 'Junior Food Quality Auditor',
//       deadline: 'Oct 25, 2026',
//       minCgpa: 6.5,
//       requiredBranch: 'Hostel Residents Only',
//       vacancies: 6,
//       status: 'Open'
//     },
//     {
//       id: 'cultural-fiesta',
//       name: 'Fiesta & Cultural Society',
//       tag: 'Events & Arts',
//       lead: 'Rohan Mehra (B.Des 4th Yr)',
//       role: 'Sponsorship & Artist Relations',
//       deadline: 'Nov 02, 2026',
//       minCgpa: 6.0,
//       requiredBranch: 'All Branches',
//       vacancies: 8,
//       status: 'Open'
//     }
//   ]);

//   // Current Application Status
//   const [myApplication, setMyApplication] = useState({
//     committee: 'Hostel & Mess Management Committee',
//     role: 'Junior Food Quality Auditor',
//     currentStage: 3, // 1: Applied, 2: Screened, 3: Slot Booked, 4: Selected
//     slot: 'Tomorrow, Oct 23 • 02:30 PM - 02:50 PM',
//     appliedDate: 'Oct 20, 2026'
//   });

//   // Modal States
//   const [applyModalOpen, setApplyModalOpen] = useState(false);
//   const [selectedCommitteeToApply, setSelectedCommitteeToApply] = useState(null);
//   const [applicantCgpa, setApplicantCgpa] = useState('8.42');
//   const [applicantBranch, setApplicantBranch] = useState('Computer Science & Engg');
//   const [applicantStatement, setApplicantStatement] = useState('');

//   // Slot Booking Modal State
//   const [slotModalOpen, setSlotModalOpen] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const availableSlots = [
//     { id: 's1', time: '10:00 AM - 10:20 AM', date: 'Oct 24', available: true },
//     { id: 's2', time: '10:30 AM - 10:50 AM', date: 'Oct 24', available: false },
//     { id: 's3', time: '11:15 AM - 11:35 AM', date: 'Oct 24', available: true },
//     { id: 's4', time: '02:00 PM - 02:20 PM', date: 'Oct 24', available: true },
//     { id: 's5', time: '02:30 PM - 02:50 PM', date: 'Oct 24', available: true },
//     { id: 's6', time: '03:30 PM - 03:50 PM', date: 'Oct 24', available: false },
//   ];

//   // 2. Super 50 State
//   const [leaderboard, setLeaderboard] = useState([
//     { rank: 1, name: 'Devansh Khandelwal', roll: '23CS1004', branch: 'CSE', score: 96.4, status: 'Interview Cleared' },
//     { rank: 2, name: 'Ananya Deshmukh', roll: '23EC1022', branch: 'ECE', score: 94.8, status: 'Interview Cleared' },
//     { rank: 3, name: 'Sameer Patel', roll: '23IT1018', branch: 'IT', score: 92.5, status: 'Interview Cleared' },
//     { rank: 4, name: 'You (Kabir Verma)', roll: '23CS1089', branch: 'CSE', score: 89.2, status: 'Slot Scheduled' },
//     { rank: 5, name: 'Priya Sundaram', roll: '23EE1045', branch: 'EE', score: 87.6, status: 'Assessment Verified' },
//     { rank: 6, name: 'Tanmay Bhatt', roll: '23ME1011', branch: 'ME', score: 85.0, status: 'Assessment Verified' },
//     { rank: 7, name: 'Kavya Singhania', roll: '23CE1009', branch: 'CE', score: 84.1, status: 'Screened' },
//   ]);

//   // 3. Events & Ticketing State
//   const [events, setEvents] = useState([
//     {
//       id: 'ev-garba',
//       title: 'Dandiya Dhoom: Mega Garba Night 2026',
//       category: 'Cultural',
//       date: 'Friday, Oct 24, 2026',
//       time: '07:00 PM - 11:30 PM',
//       venue: 'Main Sports Complex Arena',
//       price: 150,
//       totalSeats: 1200,
//       remainingSeats: 64,
//       imageGradient: 'from-amber-500 via-rose-500 to-purple-600',
//       badge: 'Selling Out Fast'
//     },
//     {
//       id: 'ev-fiesta-hack',
//       title: 'Fiesta 2026: 36H National Hackathon',
//       category: 'Fiesta Technical',
//       date: 'Nov 07 - 09, 2026',
//       time: 'Starts 09:00 AM',
//       venue: 'Auditorium & Innovation Labs',
//       price: 250,
//       totalSeats: 300,
//       remainingSeats: 112,
//       imageGradient: 'from-blue-600 via-indigo-600 to-purple-700',
//       badge: 'Open to Other Colleges'
//     },
//     {
//       id: 'ev-fiesta-battle',
//       title: 'Fiesta 2026: Battle of the Bands & DJ Night',
//       category: 'Fiesta Flagship',
//       date: 'Nov 10, 2026',
//       time: '06:00 PM Onwards',
//       venue: 'Open Air Amphitheatre (OAT)',
//       price: 199,
//       totalSeats: 2500,
//       remainingSeats: 820,
//       imageGradient: 'from-emerald-500 via-teal-600 to-indigo-700',
//       badge: 'Guest Pass Available'
//     }
//   ]);

//   const [bookingModalEvent, setBookingModalEvent] = useState(null);
//   const [passAttendeeName, setPassAttendeeName] = useState('Kabir Verma');
//   const [passCollege, setPassCollege] = useState('Our College (Home Student)');
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
//   const [bookedPass, setBookedPass] = useState({
//     ticketId: 'CSYNC-GB-9921',
//     eventTitle: 'Dandiya Dhoom: Mega Garba Night 2026',
//     date: 'Oct 24, 2026 • 7:00 PM',
//     venue: 'Main Sports Complex Arena',
//     name: 'Kabir Verma',
//     amount: '₹150.00',
//     qrPayload: 'PASS-VERIFIED-KABIR-23CS1089'
//   });

//   // 4. Grievance Desk State (with 48h SLA timer)
//   const [tickets, setTickets] = useState([
//     {
//       id: 'TKT-1082',
//       category: 'Mess & Food Quality',
//       committee: 'Hostel & Mess Management Committee',
//       subject: 'Inadequate drinking water cooling in Block B mess dining',
//       description: 'The primary water dispenser filter has not been serviced and cooling is not functioning during lunch rush.',
//       status: 'In Progress',
//       createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), // 14 hours ago
//       slaHoursLeft: 34, // 48 - 14 = 34
//       escalated: false
//     },
//     {
//       id: 'TKT-1049',
//       category: 'Hostel Maintenance',
//       committee: 'Hostel & Mess Management Committee',
//       subject: 'Streetlights malfunctioning near Hostel 4 pathway',
//       description: 'Three lampposts are flickering leading to low visibility at night near the library curve.',
//       status: 'Escalated to Chief Warden',
//       createdAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(), // 50 hours ago (>48h)
//       slaHoursLeft: 0,
//       escalated: true
//     }
//   ]);

//   const [ticketModalOpen, setTicketModalOpen] = useState(false);
//   const [newTicketCategory, setNewTicketCategory] = useState('Hostel Maintenance');
//   const [newTicketSubject, setNewTicketSubject] = useState('');
//   const [newTicketDesc, setNewTicketDesc] = useState('');

//   // Handle Application Submission
//   const handleApplySubmit = (e) => {
//     e.preventDefault();
//     if (parseFloat(applicantCgpa) < selectedCommitteeToApply.minCgpa) {
//       showToast(`⚠️ CGPA Cutoff mismatch! Requires minimum ${selectedCommitteeToApply.minCgpa}`);
//       return;
//     }
//     setMyApplication({
//       committee: selectedCommitteeToApply.name,
//       role: selectedCommitteeToApply.role,
//       currentStage: 2, // Automatically screened!
//       slot: 'Select Your Slot Now',
//       appliedDate: 'Today, Oct 22, 2026'
//     });
//     setApplyModalOpen(false);
//     showToast(`✅ Automation Screened: Application accepted for ${selectedCommitteeToApply.name}! Please book interview slot.`);
//   };

//   // Handle Slot Booking
//   const handleSlotConfirm = () => {
//     if (!selectedSlot) return;
//     setMyApplication(prev => ({
//       ...prev,
//       currentStage: 3,
//       slot: `${selectedSlot.date} • ${selectedSlot.time}`
//     }));
//     setSlotModalOpen(false);
//     showToast(`🎉 Interview Slot Locked for ${selectedSlot.time}! Auto calendar invite sent to college mail.`);
//   };

//   // Handle Pass Payment
//   const handlePassPayment = () => {
//     setIsProcessingPayment(true);
//     setTimeout(() => {
//       setIsProcessingPayment(false);
//       const generatedPass = {
//         ticketId: `CSYNC-${Math.floor(1000 + Math.random() * 9000)}`,
//         eventTitle: bookingModalEvent.title,
//         date: bookingModalEvent.date,
//         venue: bookingModalEvent.venue,
//         name: passAttendeeName,
//         amount: `₹${bookingModalEvent.price}.00`,
//         qrPayload: `PASS-${Math.random().toString(36).substring(7).toUpperCase()}`
//       };
//       setBookedPass(generatedPass);
//       setBookingModalEvent(null);
//       showToast('🎟️ Payment successful! Digital Pass with verified QR generated.');
//     }, 1200);
//   };

//   // Handle Grievance Submission
//   const handleCreateTicket = (e) => {
//     e.preventDefault();
//     if (!newTicketSubject.trim()) return;

//     const assignedCommittee = newTicketCategory.includes('Mess') || newTicketCategory.includes('Hostel')
//       ? 'Hostel & Mess Management Committee'
//       : 'SAC Technical Committee';

//     const newTkt = {
//       id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
//       category: newTicketCategory,
//       committee: assignedCommittee,
//       subject: newTicketSubject,
//       description: newTicketDesc,
//       status: 'Open (Under 48h SLA)',
//       createdAt: new Date().toISOString(),
//       slaHoursLeft: 48,
//       escalated: false
//     };

//     setTickets([newTkt, ...tickets]);
//     setNewTicketSubject('');
//     setNewTicketDesc('');
//     setTicketModalOpen(false);
//     showToast('📨 Complaint logged! Auto 48-Hour SLA escalation timer activated.');
//   };

//   return (
//     <div className="flex h-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      
//       {/* Toast Notification */}
//       {toastMessage && (
//         <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-bounce text-sm font-medium">
//           <Sparkles className="w-4 h-4 text-amber-400" />
//           <span>{toastMessage}</span>
//         </div>
//       )}

//       {/* LEFT SIDEBAR */}
//       <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between border-r border-slate-800 flex-shrink-0">
//         <div>
//           {/* Logo Brand */}
//           <div className="p-6 flex items-center gap-3 border-b border-slate-800">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
//               <Zap className="w-5 h-5 fill-white" />
//             </div>
//             <div>
//               <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
//                 CampusSync <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30 font-semibold uppercase">PRO</span>
//               </h1>
//               <p className="text-xs text-slate-400 font-medium">College Governance OS</p>
//             </div>
//           </div>

//           {/* Navigation Links */}
//           <nav className="p-4 space-y-1.5">
//             <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">Student Hub</p>
            
//             <button 
//               onClick={() => setActiveTab('dashboard')} 
//               className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                 activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//               }`}
//             >
//               <LayoutDashboard className="w-4 h-4" />
//               <span>Overview</span>
//             </button>

//             <button 
//               onClick={() => setActiveTab('committees')} 
//               className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                 activeTab === 'committees' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <Users className="w-4 h-4" />
//                 <span>Committees & Hiring</span>
//               </div>
//               <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">3 Open</span>
//             </button>

//             <button 
//               onClick={() => setActiveTab('super50')} 
//               className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                 activeTab === 'super50' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <Award className="w-4 h-4 text-amber-400" />
//                 <span>Super 50 Cohort</span>
//               </div>
//               <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/30 font-semibold">Rank #4</span>
//             </button>

//             <button 
//               onClick={() => setActiveTab('events')} 
//               className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                 activeTab === 'events' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <Ticket className="w-4 h-4" />
//                 <span>Garba & Fiesta Passes</span>
//               </div>
//               <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded-full border border-rose-500/30 font-semibold">Live</span>
//             </button>

//             <button 
//               onClick={() => setActiveTab('grievances')} 
//               className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
//                 activeTab === 'grievances' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <AlertCircle className="w-4 h-4 text-rose-400" />
//                 <span>Grievance Desk (SLA)</span>
//               </div>
//               <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full font-semibold">2 Active</span>
//             </button>
//           </nav>
//         </div>

//         {/* Bottom Student Profile */}
//         <div className="p-4 border-t border-slate-800 bg-slate-900/60">
//           <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
//             <div className="w-10 h-10 rounded-lg bg-indigo-500 text-white font-bold flex items-center justify-center text-sm ring-2 ring-indigo-400/30">
//               KV
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-xs font-semibold text-white truncate">Kabir Verma</p>
//               <p className="text-[11px] text-slate-400 truncate">23CS1089 • Sem 5</p>
//             </div>
//             <div className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" title="Authenticated student"></div>
//           </div>
//         </div>
//       </aside>

//       {/* MAIN VIEW CONTAINER */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
//         {/* TOP HEADER */}
//         <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 z-10 shadow-xs">
          
//           {/* Search Bar */}
//           <div className="relative w-80">
//             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input 
//               type="text" 
//               placeholder="Search committees, tickets, passes..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 border border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
//             />
//           </div>

//           {/* Right Header Badges */}
//           <div className="flex items-center gap-4">
            
//             {/* Quick Campus Tag */}
//             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-medium text-indigo-700">
//               <Building className="w-3.5 h-3.5" />
//               <span>Campus: Main Engineering Block</span>
//             </div>

//             {/* Notification Dropdown Trigger */}
//             <div className="relative">
//               <button 
//                 onClick={() => setNotificationsOpen(!notificationsOpen)}
//                 className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
//               >
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
//               </button>

//               {/* Notifications Popup */}
//               {notificationsOpen && (
//                 <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 animate-in fade-in slide-in-from-top-2">
//                   <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
//                     <span className="text-xs font-bold text-slate-800">Campus Alerts & Updates</span>
//                     <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">3 New</span>
//                   </div>
//                   <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
//                     {notifications.map(n => (
//                       <div key={n.id} className="py-2.5 px-1 hover:bg-slate-50 rounded-lg transition-colors">
//                         <p className="text-xs font-semibold text-slate-800">{n.title}</p>
//                         <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.desc}</p>
//                         <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Quick Action Button */}
//             <button 
//               onClick={() => { setActiveTab('grievances'); setTicketModalOpen(true); }}
//               className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white px-3.5 py-2 rounded-xl hover:bg-indigo-700 transition shadow-sm"
//             >
//               <AlertCircle className="w-3.5 h-3.5" />
//               <span>Raise Grievance</span>
//             </button>
//           </div>
//         </header>

//         {/* SCROLLABLE DASHBOARD VIEWPORT */}
//         <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50/70">

//           {/* ======================= VIEW 1: OVERVIEW DASHBOARD ======================= */}
//           {activeTab === 'dashboard' && (
//             <div className="space-y-8 max-w-7xl mx-auto">
              
//               {/* Welcome Banner */}
//               <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-7 text-white shadow-lg">
//                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <div>
//                     <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-semibold text-indigo-300 mb-2">
//                       <Sparkles className="w-3 h-3 text-amber-300" /> Automated Lifecycle System Active
//                     </div>
//                     <h2 className="text-2xl font-bold tracking-tight">Welcome back, Kabir 👋</h2>
//                     <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
//                       Your recruitment screening for <strong>Hostel & Mess Committee</strong> is cleared. Next interview slot is confirmed with automated live rubric scoring.
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <button 
//                       onClick={() => setActiveTab('events')}
//                       className="px-4 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition shadow-sm"
//                     >
//                       Book Garba Pass (₹150)
//                     </button>
//                     <button 
//                       onClick={() => setActiveTab('super50')}
//                       className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition shadow-sm"
//                     >
//                       Super 50 Status
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* STAT SUMMARY CARDS */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
//                 <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
//                   <div>
//                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Application</p>
//                     <h3 className="text-2xl font-bold text-slate-900 mt-1">1 Drive</h3>
//                     <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
//                       <CheckCircle2 className="w-3 h-3" /> Auto-Screened (CGPA: 8.42)
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
//                     <Users className="w-6 h-6" />
//                   </div>
//                 </div>

//                 <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
//                   <div>
//                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Next Interview</p>
//                     <h3 className="text-2xl font-bold text-slate-900 mt-1">Tomorrow</h3>
//                     <p className="text-[11px] text-slate-500 font-medium mt-1">
//                       02:30 PM • Slot Confirmed
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
//                     <Clock className="w-6 h-6" />
//                   </div>
//                 </div>

//                 <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
//                   <div>
//                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Passes</p>
//                     <h3 className="text-2xl font-bold text-slate-900 mt-1">1 Pass</h3>
//                     <p className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
//                       <QrCode className="w-3 h-3" /> Garba Night QR Ready
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
//                     <Ticket className="w-6 h-6" />
//                   </div>
//                 </div>

//                 <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
//                   <div>
//                     <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Grievances Raised</p>
//                     <h3 className="text-2xl font-bold text-slate-900 mt-1">2 Tickets</h3>
//                     <p className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
//                       <ShieldAlert className="w-3 h-3" /> 1 Escalated to Warden
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
//                     <AlertCircle className="w-6 h-6" />
//                   </div>
//                 </div>

//               </div>

//               {/* LIVE APPLICATION STEPPER & PROGRESS */}
//               <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-slate-100">
//                   <div>
//                     <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Automated Recruitment Pipeline</span>
//                     <h3 className="text-base font-bold text-slate-900 mt-0.5">{myApplication.committee}</h3>
//                     <p className="text-xs text-slate-500">Position Applied: <span className="font-semibold text-slate-700">{myApplication.role}</span></p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
//                       Slot: {myApplication.slot}
//                     </span>
//                     <button 
//                       onClick={() => setSlotModalOpen(true)}
//                       className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
//                     >
//                       Reschedule Slot
//                     </button>
//                   </div>
//                 </div>

//                 {/* 4-Step Visual Stepper */}
//                 <div className="pt-8 pb-4">
//                   <div className="grid grid-cols-4 gap-2 relative">
                    
//                     {/* Connecting Line */}
//                     <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -z-0">
//                       <div 
//                         className="h-full bg-indigo-600 transition-all duration-500"
//                         style={{ width: myApplication.currentStage === 1 ? '15%' : myApplication.currentStage === 2 ? '45%' : myApplication.currentStage === 3 ? '78%' : '100%' }}
//                       ></div>
//                     </div>

//                     {/* Step 1 */}
//                     <div className="flex flex-col items-center text-center z-10">
//                       <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${myApplication.currentStage >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
//                         <Check className="w-4 h-4" />
//                       </div>
//                       <span className="text-xs font-bold text-slate-800 mt-2">1. Form Submitted</span>
//                       <span className="text-[10px] text-slate-400">Oct 20, 2026</span>
//                     </div>

//                     {/* Step 2 */}
//                     <div className="flex flex-col items-center text-center z-10">
//                       <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${myApplication.currentStage >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
//                         <Check className="w-4 h-4" />
//                       </div>
//                       <span className="text-xs font-bold text-slate-800 mt-2">2. Auto Screened</span>
//                       <span className="text-[10px] text-emerald-600 font-semibold">CGPA &ge; 6.5 Passed</span>
//                     </div>

//                     {/* Step 3 */}
//                     <div className="flex flex-col items-center text-center z-10">
//                       <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${myApplication.currentStage >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
//                         {myApplication.currentStage >= 3 ? <Clock className="w-4 h-4" /> : '3'}
//                       </div>
//                       <span className="text-xs font-bold text-slate-800 mt-2">3. Slot Booked</span>
//                       <span className="text-[10px] text-indigo-600 font-semibold">Live Room Assigned</span>
//                     </div>

//                     {/* Step 4 */}
//                     <div className="flex flex-col items-center text-center z-10">
//                       <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${myApplication.currentStage >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
//                         4
//                       </div>
//                       <span className="text-xs font-bold text-slate-800 mt-2">4. Final Decision</span>
//                       <span className="text-[10px] text-slate-400">Post Interview</span>
//                     </div>

//                   </div>
//                 </div>
//               </div>

//               {/* TWO COLUMN LOWER SECTION */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
//                 {/* Super 50 Mini Card */}
//                 <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2">
//                         <Award className="w-5 h-5 text-amber-500" />
//                         <h4 className="font-bold text-slate-900 text-sm">Super 50 Cohort Ranking</h4>
//                       </div>
//                       <button 
//                         onClick={() => setActiveTab('super50')}
//                         className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
//                       >
//                         Full Leaderboard <ChevronRight className="w-3.5 h-3.5" />
//                       </button>
//                     </div>
//                     <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/60 mb-4 flex items-center justify-between">
//                       <div>
//                         <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Your Live Standing</span>
//                         <p className="text-lg font-extrabold text-amber-950 mt-0.5">Rank #4 out of 380 Applicants</p>
//                         <p className="text-xs text-amber-700">Composite Score: <strong>89.2%</strong> (Aptitude + Technical)</p>
//                       </div>
//                       <div className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-sm">
//                         Top 2%
//                       </div>
//                     </div>
//                     <div className="space-y-2 text-xs">
//                       <div className="flex justify-between text-slate-500 font-medium">
//                         <span>Aptitude Online Proctored Test</span>
//                         <span className="text-slate-800 font-bold">48 / 50</span>
//                       </div>
//                       <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
//                         <div className="bg-emerald-500 h-full w-[96%]"></div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
//                     <span className="flex items-center gap-1.5">
//                       <ShieldAlert className="w-4 h-4 text-emerald-600" />
//                       Anti-Cheat Proctored Audit Verified
//                     </span>
//                     <span className="font-semibold text-slate-800">Final List: Oct 30</span>
//                   </div>
//                 </div>

//                 {/* Digital Event Pass Preview */}
//                 <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2">
//                         <Ticket className="w-5 h-5 text-rose-500" />
//                         <h4 className="font-bold text-slate-900 text-sm">Active Digital Pass (QR Verified)</h4>
//                       </div>
//                       <button 
//                         onClick={() => setActiveTab('events')}
//                         className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
//                       >
//                         Explore Events <ChevronRight className="w-3.5 h-3.5" />
//                       </button>
//                     </div>

//                     <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">Official Entry Pass</span>
//                           <h5 className="font-bold text-sm text-white mt-1">{bookedPass.eventTitle}</h5>
//                           <p className="text-[11px] text-slate-300 mt-1">{bookedPass.venue}</p>
//                           <p className="text-[11px] text-amber-300 mt-0.5">{bookedPass.date}</p>
//                         </div>
//                         <div className="bg-white p-2 rounded-xl text-slate-900 shadow-md">
//                           <QrCode className="w-16 h-16" />
//                         </div>
//                       </div>
//                       <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px]">
//                         <span className="text-slate-400">Holder: <strong className="text-white">{bookedPass.name}</strong></span>
//                         <span className="text-emerald-400 font-mono font-bold">{bookedPass.ticketId}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <p className="text-[11px] text-slate-400 mt-3 text-center">
//                     Show this QR at the Main Sports Arena Gate for instant contactless entry.
//                   </p>
//                 </div>

//               </div>

//             </div>
//           )}

//           {/* ======================= VIEW 2: COMMITTEES & HIRING ======================= */}
//           {activeTab === 'committees' && (
//             <div className="space-y-6 max-w-7xl mx-auto">
              
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active College Committees & Recruitment Drives</h2>
//                   <p className="text-xs text-slate-500 mt-0.5">Automated eligibility screening runs instantaneously on submission.</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
//                     Your Registered CGPA: <strong>8.42</strong>
//                   </span>
//                 </div>
//               </div>

//               {/* Committee Cards Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {committees.map(c => (
//                   <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-indigo-300 transition-all">
//                     <div>
//                       <div className="flex items-center justify-between mb-3">
//                         <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
//                           {c.tag}
//                         </span>
//                         <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
//                           <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {c.status}
//                         </span>
//                       </div>

//                       <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
//                       <p className="text-xs text-slate-500 mt-1">Lead: <span className="font-medium text-slate-700">{c.lead}</span></p>

//                       <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
//                         <div className="flex justify-between">
//                           <span className="text-slate-500">Target Role:</span>
//                           <span className="font-semibold text-slate-800">{c.role}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-slate-500">Auto CGPA Cutoff:</span>
//                           <span className="font-bold text-indigo-600">&ge; {c.minCgpa}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-slate-500">Eligibility:</span>
//                           <span className="font-medium text-slate-700">{c.requiredBranch}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-slate-500">Drive Deadline:</span>
//                           <span className="font-medium text-rose-600">{c.deadline}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
//                       <button 
//                         onClick={() => { setSelectedCommitteeToApply(c); setApplyModalOpen(true); }}
//                         className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition"
//                       >
//                         Apply for Role
//                       </button>
//                       <button 
//                         onClick={() => {
//                           showToast(`Direct message channel opened with ${c.lead}`);
//                         }}
//                         className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
//                         title="Contact Committee Lead"
//                       >
//                         <MessageSquare className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Active Application Slot Management Box */}
//               <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                   <div className="flex items-start gap-4">
//                     <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
//                       <Calendar className="w-5 h-5" />
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-bold text-slate-900">Your Current Interview Schedule</h4>
//                       <p className="text-xs text-slate-600 mt-0.5">
//                         {myApplication.committee} • <strong>{myApplication.slot}</strong>
//                       </p>
//                     </div>
//                   </div>
//                   <button 
//                     onClick={() => setSlotModalOpen(true)}
//                     className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 text-xs font-bold rounded-xl transition shadow-xs"
//                   >
//                     Change / Book Slot
//                   </button>
//                 </div>
//               </div>

//             </div>
//           )}

//           {/* ======================= VIEW 3: SUPER 50 COHORT ======================= */}
//           {activeTab === 'super50' && (
//             <div className="space-y-6 max-w-7xl mx-auto">
              
//               {/* Header */}
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <Award className="w-6 h-6 text-amber-500" />
//                     <h2 className="text-xl font-bold text-slate-900">Super 50 Talent Assessment Suite</h2>
//                   </div>
//                   <p className="text-xs text-slate-500 mt-0.5">Instant code-graded scoring, live panel rubric averages, and dynamic rank calculation.</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl">
//                     Target Cohort Size: 50 Students
//                   </span>
//                 </div>
//               </div>

//               {/* Leaderboard Table */}
//               <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
//                 <div className="p-5 border-b border-slate-100 flex items-center justify-between">
//                   <h3 className="font-bold text-slate-800 text-sm">Live Candidate Leaderboard</h3>
//                   <span className="text-[11px] text-slate-400">Auto-updates as interview panelists submit ratings</span>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full text-left border-collapse text-xs">
//                     <thead>
//                       <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px]">
//                         <th className="py-3.5 px-5">Rank</th>
//                         <th className="py-3.5 px-5">Candidate Name</th>
//                         <th className="py-3.5 px-5">Roll No</th>
//                         <th className="py-3.5 px-5">Branch</th>
//                         <th className="py-3.5 px-5">Composite Score</th>
//                         <th className="py-3.5 px-5">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100">
//                       {leaderboard.map(c => {
//                         const isMe = c.name.includes('You');
//                         return (
//                           <tr key={c.rank} className={`hover:bg-slate-50/80 transition-colors ${isMe ? 'bg-indigo-50/50 font-semibold' : ''}`}>
//                             <td className="py-3.5 px-5">
//                               <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
//                                 c.rank === 1 ? 'bg-amber-100 text-amber-800' :
//                                 c.rank === 2 ? 'bg-slate-200 text-slate-700' :
//                                 c.rank === 3 ? 'bg-amber-700/20 text-amber-900' :
//                                 'text-slate-600'
//                               }`}>
//                                 {c.rank}
//                               </span>
//                             </td>
//                             <td className="py-3.5 px-5 font-medium text-slate-900 flex items-center gap-2">
//                               {c.name}
//                               {isMe && <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">YOU</span>}
//                             </td>
//                             <td className="py-3.5 px-5 font-mono text-slate-600">{c.roll}</td>
//                             <td className="py-3.5 px-5 text-slate-600">{c.branch}</td>
//                             <td className="py-3.5 px-5">
//                               <div className="flex items-center gap-2">
//                                 <span className="font-bold text-slate-900">{c.score}%</span>
//                                 <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                                   <div className="bg-indigo-600 h-full" style={{ width: `${c.score}%` }}></div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="py-3.5 px-5">
//                               <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
//                                 c.status.includes('Cleared') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
//                                 c.status.includes('Scheduled') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
//                                 'bg-slate-100 text-slate-700'
//                               }`}>
//                                 {c.status}
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//             </div>
//           )}

//           {/* ======================= VIEW 4: EVENTS & PASSES (GARBA & FIESTA) ======================= */}
//           {activeTab === 'events' && (
//             <div className="space-y-6 max-w-7xl mx-auto">
              
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">Garba & Fiesta Event Passes</h2>
//                   <p className="text-xs text-slate-500 mt-0.5">Online seat reservation, automated UPI payments, and contactless QR generation.</p>
//                 </div>
//                 <div className="text-xs text-slate-500">
//                   Open to: <span className="font-bold text-slate-800">Home College & External Guests</span>
//                 </div>
//               </div>

//               {/* Event Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {events.map(ev => (
//                   <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition">
//                     <div>
//                       {/* Gradient Header Banner */}
//                       <div className={`h-28 bg-gradient-to-r ${ev.imageGradient} p-4 flex flex-col justify-between text-white relative`}>
//                         <span className="self-start text-[10px] uppercase font-extrabold tracking-wider bg-black/30 backdrop-blur-md px-2 py-0.5 rounded">
//                           {ev.category}
//                         </span>
//                         <div className="text-right">
//                           <span className="text-xs bg-white text-slate-900 px-2 py-0.5 rounded font-bold shadow-xs">
//                             {ev.badge}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="p-5 space-y-3">
//                         <h3 className="font-bold text-slate-900 text-base leading-snug">{ev.title}</h3>
                        
//                         <div className="space-y-1.5 text-xs text-slate-600">
//                           <p className="flex items-center gap-2">
//                             <Calendar className="w-3.5 h-3.5 text-slate-400" /> {ev.date}
//                           </p>
//                           <p className="flex items-center gap-2">
//                             <Clock className="w-3.5 h-3.5 text-slate-400" /> {ev.time}
//                           </p>
//                           <p className="flex items-center gap-2">
//                             <Building className="w-3.5 h-3.5 text-slate-400" /> {ev.venue}
//                           </p>
//                         </div>

//                         {/* Capacity Tracker */}
//                         <div className="pt-2">
//                           <div className="flex justify-between text-[11px] mb-1">
//                             <span className="text-slate-500">Seats Remaining:</span>
//                             <span className="font-bold text-rose-600">{ev.remainingSeats} / {ev.totalSeats}</span>
//                           </div>
//                           <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                             <div 
//                               className="bg-rose-500 h-full"
//                               style={{ width: `${((ev.totalSeats - ev.remainingSeats) / ev.totalSeats) * 100}%` }}
//                             ></div>
//                           </div>
//                         </div>

//                       </div>
//                     </div>

//                     <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
//                       <div>
//                         <span className="text-[10px] text-slate-400 block uppercase">Price per pass</span>
//                         <span className="text-lg font-extrabold text-slate-900">₹{ev.price}</span>
//                       </div>
//                       <button 
//                         onClick={() => setBookingModalEvent(ev)}
//                         className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center gap-1.5"
//                       >
//                         <Ticket className="w-3.5 h-3.5" /> Book Pass
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Verified Pass Download / View Card */}
//               <div className="bg-white rounded-2xl border border-slate-200 p-6">
//                 <h4 className="text-sm font-bold text-slate-900 mb-3">Your Booked Passes (Ready to scan)</h4>
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-white p-1 rounded-lg border border-slate-200">
//                       <QrCode className="w-full h-full text-slate-900" />
//                     </div>
//                     <div>
//                       <p className="font-bold text-xs text-slate-900">{bookedPass.eventTitle}</p>
//                       <p className="text-[11px] text-slate-500">Pass ID: <span className="font-mono text-indigo-600 font-bold">{bookedPass.ticketId}</span> • Holder: {bookedPass.name}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">VERIFIED & PAID</span>
//                     <button 
//                       onClick={() => showToast(`Pass ${bookedPass.ticketId} downloaded to device!`)}
//                       className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
//                     >
//                       Download PDF
//                     </button>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           )}

//           {/* ======================= VIEW 5: GRIEVANCE DESK (48H SLA) ======================= */}
//           {activeTab === 'grievances' && (
//             <div className="space-y-6 max-w-7xl mx-auto">
              
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">Hostel, Mess & SAC Grievance Helpdesk</h2>
//                   <p className="text-xs text-slate-500 mt-0.5">Automated 48-hour SLA: If a committee does not resolve issues on time, it escalates automatically to the Chief Warden.</p>
//                 </div>
//                 <button 
//                   onClick={() => setTicketModalOpen(true)}
//                   className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2"
//                 >
//                   <AlertCircle className="w-4 h-4" /> Log New Grievance
//                 </button>
//               </div>

//               {/* Tickets List */}
//               <div className="space-y-4">
//                 {tickets.map(t => (
//                   <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                       <div className="flex items-center gap-2.5">
//                         <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
//                           {t.id}
//                         </span>
//                         <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
//                           {t.category}
//                         </span>
//                         <span className="text-xs text-slate-500 font-medium">
//                           Routed To: <strong>{t.committee}</strong>
//                         </span>
//                       </div>

//                       {/* SLA Timer Badge */}
//                       <div className="flex items-center gap-2">
//                         {t.escalated ? (
//                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
//                             <ShieldAlert className="w-3.5 h-3.5" /> SLA BREACHED: ESCALATED TO WARDEN
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
//                             <Clock className="w-3.5 h-3.5 text-amber-600" /> {t.slaHoursLeft}h left before auto-escalation
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="text-sm font-bold text-slate-900">{t.subject}</h4>
//                       <p className="text-xs text-slate-600 mt-1 leading-relaxed">{t.description}</p>
//                     </div>

//                     <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
//                       <span>Status: <strong className={t.escalated ? 'text-rose-600' : 'text-amber-600'}>{t.status}</strong></span>
//                       <button 
//                         onClick={() => showToast(`Comment posted to Ticket ${t.id}`)}
//                         className="text-indigo-600 hover:underline font-semibold"
//                       >
//                         Add follow-up notes
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//             </div>
//           )}

//         </main>
//       </div>

//       {/* ======================= MODAL: COMMITTEE APPLICATION ======================= */}
//       {applyModalOpen && selectedCommitteeToApply && (
//         <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
//             <div className="flex justify-between items-start">
//               <div>
//                 <span className="text-[10px] font-bold uppercase text-indigo-600">Automated Screening Active</span>
//                 <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedCommitteeToApply.name}</h3>
//                 <p className="text-xs text-slate-500">Applying for: <strong className="text-slate-800">{selectedCommitteeToApply.role}</strong></p>
//               </div>
//               <button onClick={() => setApplyModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleApplySubmit} className="space-y-4 pt-2">
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-xs font-semibold text-slate-700 block mb-1">Your CGPA (Verified)</label>
//                   <input 
//                     type="number" 
//                     step="0.01" 
//                     value={applicantCgpa} 
//                     onChange={e => setApplicantCgpa(e.target.value)}
//                     className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-800"
//                     required
//                   />
//                   <p className="text-[10px] text-slate-500 mt-1">Rule Cutoff: &ge; {selectedCommitteeToApply.minCgpa}</p>
//                 </div>
//                 <div>
//                   <label className="text-xs font-semibold text-slate-700 block mb-1">Current Branch</label>
//                   <input 
//                     type="text" 
//                     value={applicantBranch} 
//                     onChange={e => setApplicantBranch(e.target.value)}
//                     className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-xs font-semibold text-slate-700 block mb-1">Why do you want to join this committee?</label>
//                 <textarea 
//                   rows="3" 
//                   value={applicantStatement}
//                   onChange={e => setApplicantStatement(e.target.value)}
//                   placeholder="Share your prior experience in hosting, food quality audit, or tech stack..."
//                   className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
//                   required
//                 ></textarea>
//               </div>

//               <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-800 flex items-center gap-2">
//                 <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
//                 <span>If CGPA &ge; {selectedCommitteeToApply.minCgpa}, you will be automatically shortlisted for an interview slot immediately.</span>
//               </div>

//               <div className="flex items-center justify-end gap-3 pt-2">
//                 <button 
//                   type="button" 
//                   onClick={() => setApplyModalOpen(false)}
//                   className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
//                 >
//                   Submit & Auto-Screen
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ======================= MODAL: SELF-SERVICE INTERVIEW SLOT BOOKING ======================= */}
//       {slotModalOpen && (
//         <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
//             <div className="flex justify-between items-start">
//               <div>
//                 <span className="text-[10px] font-bold uppercase text-indigo-600">Self-Service Slot Scheduler</span>
//                 <h3 className="text-base font-bold text-slate-900 mt-0.5">Pick Your Interview Slot</h3>
//                 <p className="text-xs text-slate-500">Hostel & Mess Management Committee</p>
//               </div>
//               <button onClick={() => setSlotModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <p className="text-xs text-slate-600">
//               Select an open 20-minute window. Once booked, it instantly locks out other candidates and sends calendar invites.
//             </p>

//             <div className="grid grid-cols-2 gap-2.5 pt-2">
//               {availableSlots.map(s => (
//                 <button
//                   key={s.id}
//                   disabled={!s.available}
//                   onClick={() => setSelectedSlot(s)}
//                   className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
//                     !s.available 
//                       ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
//                       : selectedSlot?.id === s.id
//                         ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-md'
//                         : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400'
//                   }`}
//                 >
//                   <span className="block font-bold">{s.date}</span>
//                   <span className="block text-[11px] mt-0.5">{s.time}</span>
//                   <span className="block text-[9px] mt-1 font-semibold uppercase">
//                     {s.available ? (selectedSlot?.id === s.id ? 'Selected' : 'Available') : 'Booked by peer'}
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
//               <button 
//                 type="button" 
//                 onClick={() => setSlotModalOpen(false)}
//                 className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
//               >
//                 Cancel
//               </button>
//               <button 
//                 disabled={!selectedSlot}
//                 onClick={handleSlotConfirm}
//                 className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-xl shadow-md transition"
//               >
//                 Confirm Slot
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================= MODAL: BOOK EVENT PASS & UPI PAYMENT ======================= */}
//       {bookingModalEvent && (
//         <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
//             <div className="flex justify-between items-start">
//               <div>
//                 <span className="text-[10px] font-bold uppercase text-rose-600">Event Pass Reservation</span>
//                 <h3 className="text-base font-bold text-slate-900 mt-0.5">{bookingModalEvent.title}</h3>
//                 <p className="text-xs text-slate-500">{bookingModalEvent.date} • {bookingModalEvent.venue}</p>
//               </div>
//               <button onClick={() => setBookingModalEvent(null)} className="text-slate-400 hover:text-slate-600 p-1">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="space-y-3 pt-2 text-xs">
//               <div>
//                 <label className="font-semibold text-slate-700 block mb-1">Attendee Name</label>
//                 <input 
//                   type="text" 
//                   value={passAttendeeName} 
//                   onChange={e => setPassAttendeeName(e.target.value)}
//                   className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
//                 />
//               </div>

//               <div>
//                 <label className="font-semibold text-slate-700 block mb-1">College Status</label>
//                 <select 
//                   value={passCollege} 
//                   onChange={e => setPassCollege(e.target.value)}
//                   className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white"
//                 >
//                   <option value="Our College (Home Student)">Our College (Home Student)</option>
//                   <option value="External College (Fiesta Guest)">External College (Fiesta Guest)</option>
//                 </select>
//               </div>

//               {/* Payment Summary */}
//               <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
//                 <div className="flex justify-between text-slate-600">
//                   <span>Pass Tier:</span>
//                   <span className="font-semibold text-slate-900">Standard Access</span>
//                 </div>
//                 <div className="flex justify-between text-slate-600">
//                   <span>Payable Amount:</span>
//                   <span className="text-base font-extrabold text-indigo-700">₹{bookingModalEvent.price}.00</span>
//                 </div>
//                 <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
//                   <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
//                   <span>Instant UPI QR & Wallet Checkout Enabled</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-end gap-3 pt-2">
//               <button 
//                 type="button" 
//                 onClick={() => setBookingModalEvent(null)}
//                 className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
//               >
//                 Cancel
//               </button>
//               <button 
//                 disabled={isProcessingPayment}
//                 onClick={handlePassPayment}
//                 className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition flex items-center gap-2"
//               >
//                 {isProcessingPayment ? (
//                   <>Processing UPI...</>
//                 ) : (
//                   <>Pay ₹{bookingModalEvent.price} & Generate QR Pass</>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ======================= MODAL: LOG GRIEVANCE (48H SLA) ======================= */}
//       {ticketModalOpen && (
//         <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
//             <div className="flex justify-between items-start">
//               <div>
//                 <span className="text-[10px] font-bold uppercase text-rose-600">48-Hour SLA Tracking</span>
//                 <h3 className="text-base font-bold text-slate-900 mt-0.5">Log Student Grievance</h3>
//                 <p className="text-xs text-slate-500">Directly routed to the responsible committee head</p>
//               </div>
//               <button onClick={() => setTicketModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleCreateTicket} className="space-y-3.5 pt-2 text-xs">
//               <div>
//                 <label className="font-semibold text-slate-700 block mb-1">Issue Category</label>
//                 <select 
//                   value={newTicketCategory} 
//                   onChange={e => setNewTicketCategory(e.target.value)}
//                   className="w-full p-2.5 rounded-xl border border-slate-300 font-medium bg-white"
//                 >
//                   <option value="Mess & Food Quality">Mess & Food Quality</option>
//                   <option value="Hostel Maintenance">Hostel Maintenance & Plumbing</option>
//                   <option value="SAC Technical Infrastructure">SAC Technical Infrastructure / Wifi</option>
//                   <option value="Sports Arena & Equipment">Sports Arena & Equipment</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="font-semibold text-slate-700 block mb-1">Subject</label>
//                 <input 
//                   type="text" 
//                   value={newTicketSubject} 
//                   onChange={e => setNewTicketSubject(e.target.value)}
//                   placeholder="e.g. Broken water cooler on 2nd floor Block C"
//                   className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="font-semibold text-slate-700 block mb-1">Detailed Description</label>
//                 <textarea 
//                   rows="3" 
//                   value={newTicketDesc} 
//                   onChange={e => setNewTicketDesc(e.target.value)}
//                   placeholder="Please describe location, duration of issue, and current impact..."
//                   className="w-full p-3 rounded-xl border border-slate-300 font-medium"
//                   required
//                 ></textarea>
//               </div>

//               <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
//                 <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
//                 <span>Our automated cron checks this ticket. If unaddressed in 48 hours, it escalates to the Chief Warden automatically.</span>
//               </div>

//               <div className="flex items-center justify-end gap-3 pt-2">
//                 <button 
//                   type="button" 
//                   onClick={() => setTicketModalOpen(false)}
//                   className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
//                 >
//                   Submit Grievance
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }