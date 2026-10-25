import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Award, Calendar, AlertCircle, Ticket, CheckCircle2, 
  Clock, Bell, ShieldCheck, Sparkles, LayoutDashboard,
  Sun, Moon, Menu, X, ArrowRight, CheckCheck, ExternalLink
} from 'lucide-react';

import OverviewTab from './components/OverviewTab';
import CommitteesTab from './components/CommitteesTab';
import Super50Tab from './components/Super50Tab';
import EventsTab from './components/EventsTab';
import GrievanceTab from './components/GrievanceTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Notifications State & Outside Click Ref
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isFullNotifOpen, setIsFullNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Interview Slot Confirmed',
      desc: 'Hostel & Mess Committee interview scheduled for Today, 4:20 PM - 4:40 PM.',
      time: '15m ago',
      unread: true,
      tag: 'Hiring'
    },
    {
      id: 2,
      title: 'Super 50 Cohort Verified',
      desc: 'You are ranked #1 in the Super 50 merit list with 98.4% composite score.',
      time: '2h ago',
      unread: true,
      tag: 'Super 50'
    },
    {
      id: 3,
      title: 'Garba Pass Issued',
      desc: 'Payment of ₹150 verified via UPI. Digital QR pass is ready for gate check.',
      time: '1d ago',
      unread: false,
      tag: 'Events'
    },
    {
      id: 4,
      title: 'Grievance SLA Escalation Alert',
      desc: 'Ticket #TKT-1082 exceeded 48 hrs. Auto-escalated to Chief Warden.',
      time: '2d ago',
      unread: false,
      tag: 'SLA Desk'
    }
  ]);

  // Click Outside Listener for Notifications
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

  // Student Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Student State
  const [studentProfile] = useState({
    name: 'Samriddhi Agrawal',
    rollNo: '0187CS231202',
    cgpa: 9.5,
    branch: 'Computer Science & Engineering',
    semester: '7th Sem',
  });

  // Committee State
  const [committees, setCommittees] = useState([
    {
      id: 'sac-tech',
      name: 'SAC Technical Committee',
      tag: 'Flagship Body',
      lead: 'Aarav Sharma (B.Tech CS 4th Yr)',
      role: 'Web & Infrastructure Lead',
      deadline: 'Oct 28, 2026',
      minCgpa: 7.5,
      requiredBranch: 'All Branches',
      vacancies: 4,
      description: 'Oversees college technical symposiums, hackathons, and web infrastructure.'
    },
    {
      id: 'hostel-mess',
      name: 'Hostel & Mess Committee',
      tag: 'Governance',
      lead: 'Neha Patel (B.Tech ME 3rd Yr)',
      role: 'Quality & Inventory Auditor',
      deadline: 'Oct 25, 2026',
      minCgpa: 7.0,
      requiredBranch: 'Hostel Residents Only',
      vacancies: 6,
      description: 'Liaison with food vendors, cafeteria management, and hostel maintenance oversight.'
    },
    {
      id: 'cultural-sac',
      name: 'Cultural & Fiesta Council',
      tag: 'Events & Arts',
      lead: 'Rohan Gupta (B.Tech EC 4th Yr)',
      role: 'Stage & Operations Coordinator',
      deadline: 'Nov 02, 2026',
      minCgpa: 6.5,
      requiredBranch: 'All Branches',
      vacancies: 8,
      description: 'Coordinates annual cultural fest Fiesta, Garba nights, and literary events.'
    }
  ]);

  const [appliedCommittees, setAppliedCommittees] = useState([
    {
      id: 'hostel-mess',
      name: 'Hostel & Mess Committee',
      role: 'Quality & Inventory Auditor',
      minCgpa: 7.0,
      appliedOn: '2026-10-18',
      status: 'Slot Booked',
      interviewSlot: 'Today, Oct 23 • 4:20 PM - 4:40 PM',
      step: 3
    }
  ]);

  // Super 50 State
  const [super50List] = useState([
    { rank: 1, name: 'Samriddhi Agrawal', rollNo: '0187CS231202', branch: 'CSE', assessmentScore: '98/100', interviewScore: '9.8/10', compositeScore: '98.4%', status: 'Confirmed' },
    { rank: 2, name: 'Priya Sharma', rollNo: '0187CS231169', branch: 'ECE', assessmentScore: '96/100', interviewScore: '9.5/10', compositeScore: '96.2%', status: 'Confirmed' },
    { rank: 3, name: 'Ajay Mishra', rollNo: '0187CS231169', branch: 'IT', assessmentScore: '95/100', interviewScore: '9.4/10', compositeScore: '95.1%', status: 'Confirmed' },
    { rank: 4, name: 'Tanishka Gupta', rollNo: '0187CS231240', branch: 'CSE', assessmentScore: '94/100', interviewScore: '9.4/10', compositeScore: '94.2%', status: 'Confirmed' },
    { rank: 5, name: 'Khushi Richhariya', rollNo: '0187CS231099', branch: 'ME', assessmentScore: '92/100', interviewScore: '9.2/10', compositeScore: '92.4%', status: 'Confirmed' }
  ]);

  // Events State
  const [events] = useState([
    {
      id: 'garba-2026',
      title: 'Grand Campus Dandiya & Garba Night 2026',
      tag: 'Garba Special',
      date: 'Oct 26, 2026 • 6:30 PM Onwards',
      venue: 'Main College Amphitheatre',
      price: '₹150',
      numericPrice: 150,
      seatsLeft: 42,
      description: 'Traditional Garba celebration with live band DJ, traditional attire contest, and food stalls.'
    },
    {
      id: 'fiesta-hack',
      title: 'Fiesta 2026: 24-Hour Inter-College Hackathon',
      tag: 'Fiesta Flagship',
      date: 'Nov 12-13, 2026 • 10:00 AM',
      venue: 'SAC Tech Lab & Innovation Block',
      price: '₹300 / Team',
      numericPrice: 300,
      seatsLeft: 14,
      description: 'Open to internal college students and external teams. Cash prize pool of ₹50,000.'
    }
  ]);

  const [myPasses, setMyPasses] = useState([
    {
      id: 'PASS-7890',
      eventTitle: 'Grand Campus Dandiya & Garba Night 2026',
      passId: 'GNB-2026-CS89',
      userName: 'Samriddhi Agrawal',
      rollNo: '0187CS231202',
      price: '₹150'
    }
  ]);

  // Grievance State
  const [grievances, setGrievances] = useState([
    {
      id: 'TKT-1082',
      committee: 'Hostel & Mess Committee',
      title: 'Hot water geyser failure in Block-C 3rd Floor',
      description: 'Geyser tripping main MCB switch repeatedly since Wednesday morning.',
      slaRemaining: '0 hrs (Overdue)',
      status: 'Escalated',
      createdAt: 'Oct 20, 2026'
    },
    {
      id: 'TKT-1094',
      committee: 'Hostel & Mess Committee',
      title: 'Mess quality feedback: uneven breakfast distribution',
      description: 'Morning breakfast running out 30 minutes before official closing time.',
      slaRemaining: '26 hrs remaining',
      status: 'In Progress',
      createdAt: 'Oct 22, 2026'
    }
  ]);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [isGrievanceModalOpen, setIsGrievanceModalOpen] = useState(false);
  const [selectedCommitteeForGrievance, setSelectedCommitteeForGrievance] = useState('Hostel & Mess Committee');
  const [grievanceForm, setGrievanceForm] = useState({ title: '', description: '' });

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

  const submitApplication = () => {
    if (studentProfile.cgpa >= selectedCommittee.minCgpa) {
      const newApp = {
        id: selectedCommittee.id,
        name: selectedCommittee.name,
        role: selectedCommittee.role,
        minCgpa: selectedCommittee.minCgpa,
        appliedOn: '2026-10-23',
        status: 'Shortlisted',
        interviewSlot: 'Slot Pending - Choose below',
        step: 2
      };
      setAppliedCommittees(prev => [...prev.filter(a => a.id !== selectedCommittee.id), newApp]);
      setIsApplyModalOpen(false);
      showToast(`Success! Auto-screening verified your CGPA (${studentProfile.cgpa} >= ${selectedCommittee.minCgpa}). You are Shortlisted!`);
      
      setNotifications(prev => [
        {
          id: Date.now(),
          title: `Shortlisted: ${selectedCommittee.name}`,
          desc: `Eligibility criteria cleared. Please pick an interview slot.`,
          time: 'Just now',
          unread: true,
          tag: 'Hiring'
        },
        ...prev
      ]);
      
      setIsSlotModalOpen(true);
    } else {
      showToast(`Auto-Screening Failed: Minimum CGPA requirement is ${selectedCommittee.minCgpa}.`);
      setIsApplyModalOpen(false);
    }
  };

  const confirmSlotBooking = (slot) => {
    setSelectedSlot(slot);
    setAppliedCommittees(prev => prev.map(item => ({
      ...item,
      interviewSlot: slot,
      status: 'Slot Booked',
      step: 3
    })));
    setIsSlotModalOpen(false);
    showToast(`Interview slot confirmed for ${slot}! Auto-calendar sync done.`);
  };

  const handleBookPass = (event) => {
    setSelectedEventForBooking(event);
    setIsPaymentModalOpen(true);
  };

  const processPayment = () => {
    const newPass = {
      id: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      eventTitle: selectedEventForBooking.title,
      passId: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
      userName: studentProfile.name,
      rollNo: studentProfile.rollNo,
      price: selectedEventForBooking.price
    };
    setMyPasses(prev => [newPass, ...prev]);
    setIsPaymentModalOpen(false);
    showToast(`Payment of ${selectedEventForBooking.price} Verified via UPI! Digital QR pass issued.`);
    setActiveTab('events');
  };

  const submitGrievance = (e) => {
    e.preventDefault();
    if (!grievanceForm.title) return;
    const newTicket = {
      id: `TKT-${Math.floor(1100 + Math.random() * 900)}`,
      committee: selectedCommitteeForGrievance,
      title: grievanceForm.title,
      description: grievanceForm.description,
      slaRemaining: '48 hrs remaining',
      status: 'In Progress',
      createdAt: 'Just now'
    };
    setGrievances(prev => [newTicket, ...prev]);
    setGrievanceForm({ title: '', description: '' });
    setIsGrievanceModalOpen(false);
    showToast(`Complaint filed with ${selectedCommitteeForGrievance}. 48-hour SLA escalation clock started!`);
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

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
          {/* Logo & YouTube-style Hamburger Button Header */}
          <div className={`h-16 px-4 border-b flex items-center gap-3 overflow-hidden ${
            isDarkMode ? 'border-zinc-800' : 'border-slate-100'
          }`}>
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              aria-label="Toggle Sidebar"
              className={`p-2 rounded-xl transition-all shrink-0 hover:scale-105 active:scale-95 ${
                isDarkMode 
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Name (No OS text) */}
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
            title="Click to view full screen profile dossier"
            className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
              isDarkMode 
                ? 'bg-zinc-850/60 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
              isDarkMode ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-600 text-white'
            }`}>
              SA
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden flex-1">
                <div className={`font-bold text-xs truncate ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                  {studentProfile.name}
                </div>
                <div className={`text-[10px] truncate ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                  {studentProfile.rollNo} • {studentProfile.semester}
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

          <div className="flex items-center gap-3 relative" ref={notifRef}>
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

            {/* Notification Bell Button */}
            <button 
              onClick={() => setIsNotifOpen(prev => !prev)}
              aria-label="Notifications"
              className={`p-2 rounded-xl transition-all relative border ${
                isDarkMode 
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-800' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown with Click-Outside Auto-Close */}
            {isNotifOpen && (
              <div className={`absolute right-0 top-12 w-80 md:w-96 rounded-2xl shadow-2xl border z-50 p-4 transition-all ${
                isDarkMode 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={markAllNotifsRead}
                    className="text-[11px] text-emerald-500 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="divide-y divide-zinc-800/60 max-h-72 overflow-y-auto mt-2">
                  {notifications.slice(0, 3).map(n => (
                    <div key={n.id} className={`py-2.5 px-1 flex flex-col gap-1 ${n.unread ? 'opacity-100' : 'opacity-65'}`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-emerald-400">{n.title}</span>
                        <span className={`text-[10px] ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>{n.time}</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Show All Fullscreen Button */}
                <div className="pt-3 border-t border-zinc-800 text-center">
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      setIsFullNotifOpen(true);
                    }}
                    className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    Show all notifications ({notifications.length}) <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Navigation */}
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

        {/* Main Content Area */}
        <main className="p-6 max-w-6xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewTab 
              studentProfile={studentProfile}
              appliedCommittees={appliedCommittees}
              setActiveTab={setActiveTab}
              setIsSlotModalOpen={setIsSlotModalOpen}
              setIsGrievanceModalOpen={setIsGrievanceModalOpen}
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
              super50List={super50List}
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

      {/* --- 1. FULL-SCREEN STUDENT PROFILE MODAL --- */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fadeIn">
          <div className={`max-w-5xl w-full mx-auto rounded-3xl border p-6 md:p-10 shadow-2xl relative ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Close Button */}
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Profile Header Dossier */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 pb-8 border-b border-zinc-800">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500 text-zinc-950 font-black text-3xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                SA
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Scholar Profile
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{studentProfile.name}</h2>
                <div className="text-sm text-zinc-400 font-mono mt-1">
                  Roll No: {studentProfile.rollNo} • {studentProfile.branch} • {studentProfile.semester}
                </div>
              </div>
              <div className="md:ml-auto flex items-center gap-4 bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl">
                <div>
                  <div className="text-xs text-zinc-400">Current CGPA</div>
                  <div className="text-2xl font-black text-emerald-400">{studentProfile.cgpa} / 10.0</div>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div>
                  <div className="text-xs text-zinc-400">Merit Status</div>
                  <div className="text-2xl font-black text-amber-400">Top 1%</div>
                </div>
              </div>
            </div>

            {/* Grid Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Committee Applications & Roles */}
              <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/70 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Committee Applications & Governance
                </h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-sm">Hostel & Mess Committee</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                        Shortlisted (Slot Booked)
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-2">
                      Role applied: <b className="text-zinc-200">Quality & Inventory Auditor</b>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2 pt-2 border-t border-zinc-800/80">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      Next Slot: <span className="text-emerald-400 font-semibold">Today, Oct 23 • 4:20 PM - 4:40 PM</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-zinc-800/40 bg-zinc-900/30 opacity-70">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-zinc-300">SAC Technical Committee</span>
                      <span className="text-[10px] text-zinc-500">Recruitment opens Nov 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Super 50 Standing */}
              <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-950/70 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Super 50 Merit Cohort standing
                </h3>
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" /> Confirmed Rank #1
                    </span>
                    <span className="text-xs font-bold text-emerald-400">Passed all Cutoffs</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                      <div className="text-zinc-400 text-[10px]">Coding Test</div>
                      <div className="font-bold text-white text-base mt-0.5">98/100</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                      <div className="text-zinc-400 text-[10px]">Interview</div>
                      <div className="font-bold text-white text-base mt-0.5">9.8/10</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                      <div className="text-zinc-400 text-[10px]">Composite</div>
                      <div className="font-bold text-emerald-400 text-base mt-0.5">98.4%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-right">
              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 2. FULL-SCREEN NOTIFICATIONS CENTER MODAL --- */}
      {isFullNotifOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fadeIn">
          <div className={`max-w-4xl w-full mx-auto rounded-3xl border p-6 md:p-8 shadow-2xl relative ${
            isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button 
              onClick={() => setIsFullNotifOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                  <Bell className="w-6 h-6 text-emerald-400" /> Notifications & Activity Log
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Lifecycle updates on hiring drives, SLA escalation clocks, and passes.
                </p>
              </div>
              <button 
                onClick={markAllNotifsRead}
                className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" /> Mark all read
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {notifications.map(n => (
                <div 
                  key={n.id} 
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    n.unread 
                      ? isDarkMode ? 'bg-zinc-950/90 border-emerald-500/40' : 'bg-emerald-50/50 border-emerald-300'
                      : isDarkMode ? 'bg-zinc-950/40 border-zinc-800 opacity-70' : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{n.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-zinc-800 text-emerald-400 border border-zinc-700">
                        {n.tag}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{n.desc}</p>
                  </div>
                  <span className="text-[11px] text-zinc-500 shrink-0 font-mono">{n.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-right">
              <button 
                onClick={() => setIsFullNotifOpen(false)}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close Activity Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- OTHER MODALS --- */}
      {/* 1. Auto-Screening Modal */}
      {isApplyModalOpen && selectedCommittee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="font-bold text-lg">Apply for {selectedCommittee.name}</h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Designation: <b>{selectedCommittee.role}</b>
            </p>
            <div className={`mt-4 p-4 rounded-xl text-xs space-y-2 border ${
              isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>Your Current CGPA:</span>
                <span className="font-bold">{studentProfile.cgpa}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>Minimum Cutoff:</span>
                <span className="font-bold text-emerald-500">{selectedCommittee.minCgpa} CGPA</span>
              </div>
              <div className={`flex justify-between pt-1 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
                <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>Screening Result:</span>
                <span className="font-bold text-emerald-500">PASS (Eligible to Auto-Shortlist)</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="font-bold text-lg">Select Interview Slot</h3>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Slots auto-lock upon selection to prevent double bookings.
            </p>
            <div className="mt-4 space-y-2">
              {[
                'Today, Oct 23 • 3:40 PM - 4:00 PM',
                'Today, Oct 23 • 4:20 PM - 4:40 PM',
                'Tomorrow, Oct 24 • 11:00 AM - 11:20 AM',
                'Tomorrow, Oct 24 • 2:30 PM - 2:50 PM'
              ].map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => confirmSlotBooking(slot)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                    isDarkMode
                      ? 'border-zinc-800 bg-zinc-950/70 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-zinc-200'
                      : 'border-slate-200 bg-slate-50 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" /> {slot}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl transition-colors ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-100' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
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
                  <option value="Hostel & Mess Committee">Hostel & Mess Committee</option>
                  <option value="SAC Technical Committee">SAC Technical Committee</option>
                  <option value="Cultural & Fiesta Council">Cultural & Fiesta Council</option>
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