import React, { useState } from 'react';
import { 
  Users, Award, Calendar, AlertCircle, Ticket, CheckCircle2, 
  Clock, Bell, ShieldCheck, Sparkles, LayoutDashboard, ChevronRight,
  Sun, Moon, LogOut
} from 'lucide-react';

import OverviewTab from './components/OverviewTab';
import CommitteesTab from './components/CommitteesTab';
import Super50Tab from './components/Super50Tab';
import EventsTab from './components/EventsTab';
import GrievanceTab from './components/GrievanceTab';

export default function App({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMessage, setToastMessage] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Student State
  const [studentProfile] = useState({
    name: user?.name || 'Student',
    rollNo: user?.rollNo || '—',
    cgpa: 8.42,
    branch: 'Computer Science & Engineering',
    semester: '5th Sem',
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
    { rank: 1, name: 'Ananya Deshmukh', rollNo: '23CS1012', branch: 'CSE', assessmentScore: '98/100', interviewScore: '9.8/10', compositeScore: '98.4%', status: 'Confirmed' },
    { rank: 2, name: 'Riddhiman Ghosh', rollNo: '23EC1044', branch: 'ECE', assessmentScore: '96/100', interviewScore: '9.5/10', compositeScore: '96.2%', status: 'Confirmed' },
    { rank: 3, name: 'Tanmay Saxena', rollNo: '23IT1023', branch: 'IT', assessmentScore: '95/100', interviewScore: '9.4/10', compositeScore: '95.1%', status: 'Confirmed' },
    { rank: 4, name: 'Kabir Verma (You)', rollNo: '23CS1089', branch: 'CSE', assessmentScore: '94/100', interviewScore: '9.4/10', compositeScore: '94.2%', status: 'Confirmed' },
    { rank: 5, name: 'Ishita Rawat', rollNo: '23ME1008', branch: 'ME', assessmentScore: '92/100', interviewScore: '9.2/10', compositeScore: '92.4%', status: 'Confirmed' }
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
      userName: 'Kabir Verma',
      rollNo: '23CS1089',
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

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'committees', label: 'Committees & Hiring', icon: Users, badge: '3 Open' },
    { id: 'super50', label: 'Super 50 Cohort', icon: Award, badge: 'Rank #4' },
    { id: 'events', label: 'Garba & Fiesta Passes', icon: Ticket, badge: 'Live' },
    { id: 'grievance', label: 'Grievance Desk (SLA)', icon: AlertCircle, badge: '2 Active' }
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

  return (
    <div className={`flex min-h-screen font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-zinc-950 text-zinc-100selection:bg-emerald-400 selection:text-zinc-950' : 'bg-slate-50 text-slate-900 selection:bg-emerald-400 selection:text-zinc-950'
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
      <aside className={`w-64 flex flex-col justify-between shrink-0 sticky top-0 h-screen hidden md:flex border-r transition-colors ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
      }`}>
        <div>
          {/* Logo & Brand */}
          <div className={`p-6 border-b flex items-center gap-3 ${
            isDarkMode ? 'border-zinc-800' : 'border-slate-100'
          }`}>
            <div className={`p-2.5 rounded-xl font-black text-sm shadow-sm flex items-center justify-center ${
              isDarkMode ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/20' : 'bg-emerald-600 text-white'
            }`}>
              <span>⚡</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-extrabold text-base tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>CampusSync</span>
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                  isDarkMode 
                    ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' 
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}>PRO</span>
              </div>
              <div className={`text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                College Governance OS
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className={`text-[10px] font-bold uppercase px-3 mb-2 tracking-wider ${
              isDarkMode ? 'text-zinc-500' : 'text-slate-400'
            }`}>
              Student Modules
            </div>
            {navItems.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? isDarkMode 
                        ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/30 shadow-sm' 
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm'
                      : isDarkMode 
                        ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border ${
                      isActive 
                        ? isDarkMode
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : isDarkMode
                          ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-slate-100'}`}>
          <div className={`p-3 rounded-xl border flex items-center gap-3 ${
            isDarkMode ? 'bg-zinc-850/50 border-zinc-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 ${
              isDarkMode ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-600 text-white'
            }`}>
              {(studentProfile.name || 'Student').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className={`font-bold text-xs truncate ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>
                {studentProfile.name}
              </div>
              <div className={`text-[10px] truncate ${isDarkMode ? 'text-zinc-400' : 'text-slate-400'}`}>
                {studentProfile.rollNo} • {studentProfile.semester}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* --- RIGHT SIDE MAIN CONTAINER --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className={`border-b sticky top-0 z-30 h-16 px-6 flex items-center justify-between backdrop-blur-md transition-colors ${
          isDarkMode 
            ? 'bg-zinc-900/90 border-zinc-800' 
            : 'bg-white/90 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              Campus Platform / <span className={`font-bold capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Campus Tag */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border ${
              isDarkMode 
                ? 'bg-zinc-800 border-zinc-700 text-zinc-300' 
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Main Engineering Block
            </div>

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

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className={`px-3 py-2 rounded-xl transition-all border flex items-center gap-2 text-xs font-semibold ${
                isDarkMode
                  ? 'bg-zinc-800 hover:bg-rose-950/60 border-zinc-700 hover:border-rose-900 text-zinc-200 hover:text-rose-200'
                  : 'bg-white hover:bg-rose-50 border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700'
              }`}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Notifications */}
            <button className={`p-2 rounded-xl transition-all relative border ${
              isDarkMode 
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-800 border-zinc-800' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
            }`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
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

      {/* --- ALL MODALS (DYNAMIC THEMING) --- */}

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