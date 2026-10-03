'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { VentixeLogo } from '@/components/Navbar';
import { 
  Calendar as CalendarIcon, 
  Ticket, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Bell, 
  Moon, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Download, 
  Eye, 
  Trash2, 
  ScanLine, 
  PlusCircle, 
  Building2, 
  Sparkles,
  LayoutDashboard,
  FileText,
  Mail,
  PieChart,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

export default function VentixeAdminDashboard() {
  const { events, tickets, orders, deleteEvent, updateEvent } = useApp();
  const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(14);
  const [attendeeSearch, setAttendeeSearch] = useState('');

  // Top metric calculations matching the screenshot
  const totalRevenue = tickets.reduce((acc: number, t: any) => acc + (t.pricePaid || 0), 0);
  const upcomingEventsCount = events.length;
  const totalBookingsCount = 1798 + tickets.length;
  const ticketsSoldCount = 1250 + tickets.length;
  const totalEarningsDisplay = `$${(275450 + totalRevenue).toLocaleString()}`;

  const featuredEvent = events[0] || {
    id: 'evt-google-ai',
    title: 'Google Cloud & Vertex AI Campus Hackathon 2026',
    bannerUrl: '/events/google-campus.jpg',
    category: 'Tech & Hackathons',
    venueName: 'Google Campus Bay View',
    startDate: '2026-10-28T09:00:00Z',
  };

  const handleExportCSV = () => {
    const headers = ['Ticket Code', 'Event Title', 'Tier', 'Attendee Name', 'Email', 'College', 'Price', 'Status'];
    const rows = tickets.map((t: any) => [
      t.ticketCode,
      `"${t.eventTitle.replace(/"/g, '""')}"`,
      t.ticketTierName,
      `"${t.attendeeName.replace(/"/g, '""')}"`,
      t.attendeeEmail,
      `"${(t.studentCollege || 'Collegiate').replace(/"/g, '""')}"`,
      `$${t.pricePaid}`,
      t.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ventixe_attendees_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fe] text-slate-800 flex flex-col lg:flex-row">
      
      {/* LEFT SIDEBAR (Identical to Ventixe Figma design) */}
      <aside className="w-full lg:w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 px-6 py-7 space-y-8">
        
        {/* Logo */}
        <Link href="/" className="px-2">
          <VentixeLogo size="md" />
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5 text-xs font-semibold">
          {[
            { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'Bookings', label: 'Bookings', icon: Ticket, badge: '1,798' },
            { id: 'Events', label: 'MNC Events', icon: Building2 },
            { id: 'Calendar', label: 'Calendar', icon: CalendarIcon },
            { id: 'Invoices', label: 'Invoices', icon: FileText },
            { id: 'Inbox', label: 'Inbox', icon: Mail },
            { id: 'Financials', label: 'Financials', icon: DollarSign },
            { id: 'Feedback', label: 'Feedback', icon: HelpCircle },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSidebarTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all ${
                  isActive
                    ? 'text-rose-600 bg-rose-50/80 font-bold shadow-sm shadow-rose-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-rose-200 text-rose-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Launch Gate Scanner Button */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <Link
            href="/organizer/scanner"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200/60"
          >
            <ScanLine className="w-4 h-4 text-emerald-600" />
            <span>Gate Scanner</span>
          </Link>

          <Link
            href="/organizer/create"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-white ventixe-gradient hover:opacity-95 shadow-md shadow-rose-500/25 transition-transform hover:scale-[1.01]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>

        {/* Student Hub Shortcut */}
        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 border border-rose-100 text-xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Student Career Hub</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
            Google, Microsoft, Amazon &amp; Meta campus events live.
          </p>
          <Link
            href="/"
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline"
          >
            Browse Student Events →
          </Link>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 px-4 sm:px-8 py-8 space-y-7 max-w-7xl overflow-x-hidden">
        
        {/* TOP BAR: Greeting & Search & Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Hello Orlando, welcome back! Manage MNC summits, bookings, and student passes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Pill Search Input matching Ventixe design */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 w-60 sm:w-72 bg-white border border-slate-200/80 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm"
              />
            </div>

            {/* Notification & Light/Dark icons */}
            <button className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-sm relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2.5 right-2.5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Orlando Laurentius"
                className="w-10 h-10 rounded-full object-cover border-2 border-rose-200"
              />
              <div className="hidden sm:block text-left text-xs">
                <span className="font-bold text-slate-900 block leading-tight">Orlando Laurentius</span>
                <span className="text-[11px] text-slate-400 font-medium">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 STAT CARDS (Identical to Ventixe top metric row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Stat 1: Upcoming Events */}
          <div className="ventixe-card p-5 flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Upcoming Events</span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">{upcomingEventsCount}</span>
            </div>
          </div>

          {/* Stat 2: Total Bookings */}
          <div className="ventixe-card p-5 flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total Bookings</span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalBookingsCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Stat 3: Tickets Sold */}
          <div className="ventixe-card p-5 flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Tickets Sold</span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">{ticketsSoldCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Stat 4: Total Earnings */}
          <div className="ventixe-card p-5 flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Total Earnings</span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalEarningsDisplay}</span>
            </div>
          </div>

        </div>

        {/* MIDDLE SECTION: Ticket Sales Donut + Sales Revenue Bar Chart + Featured Upcoming Event */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* TICKET SALES DONUT CHART (col-span-4) */}
          <div className="lg:col-span-4 ventixe-card p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Ticket Sales</h3>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
                <span>This Week</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Donut graphic representation */}
            <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Available 25% (Navy) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="14"
                  strokeDasharray="238"
                  strokeDashoffset="0"
                />
                {/* Fully Booked 30% (Purple) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8b5cf6"
                  strokeWidth="14"
                  strokeDasharray="238"
                  strokeDashoffset="59"
                />
                {/* Sold Out 45% (Hot Pink / Magenta) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#e11d48"
                  strokeWidth="14"
                  strokeDasharray="238"
                  strokeDashoffset="130"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Ticket</span>
                <span className="text-xl font-black text-slate-900">2,780</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span className="text-slate-600">Sold Out</span>
                  <span className="text-slate-400 font-medium">1,251</span>
                </div>
                <span className="font-bold text-slate-900">45%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-600">Fully Booked</span>
                  <span className="text-slate-400 font-medium">834</span>
                </div>
                <span className="font-bold text-slate-900">30%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <span className="text-slate-600">Available</span>
                  <span className="text-slate-400 font-medium">695</span>
                </div>
                <span className="font-bold text-slate-900">25%</span>
              </div>
            </div>
          </div>

          {/* SALES REVENUE BAR CHART (col-span-5) */}
          <div className="lg:col-span-5 ventixe-card p-6 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Sales Revenue</h3>
                <span className="text-2xl font-black text-slate-900 mt-1 block">$348,805</span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +$98,322 vs prior quarter
                </span>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
                <span>Last 6 Months</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Legend dots */}
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Profit
              </span>
            </div>

            {/* Monthly Bars Visualization */}
            <div className="pt-4 flex items-end justify-between h-40 gap-2">
              {[
                { month: 'Jan', rev: 40, prof: 25 },
                { month: 'Feb', rev: 65, prof: 40 },
                { month: 'Mar', rev: 55, prof: 32 },
                { month: 'Apr', rev: 85, prof: 60 },
                { month: 'May', rev: 95, prof: 70 },
                { month: 'Jun', rev: 75, prof: 50 },
                { month: 'Jul', rev: 90, prof: 65 },
                { month: 'Aug', rev: 100, prof: 78 },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    {/* Revenue Bar (Pink) */}
                    <div
                      style={{ height: `${item.rev}%` }}
                      className="w-2 sm:w-2.5 rounded-full bg-gradient-to-t from-rose-600 to-rose-400 group-hover:opacity-90 transition-all"
                    />
                    {/* Profit Bar (Purple) */}
                    <div
                      style={{ height: `${item.prof}%` }}
                      className="w-2 sm:w-2.5 rounded-full bg-gradient-to-t from-purple-600 to-purple-400 group-hover:opacity-90 transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURED UPCOMING EVENT (col-span-3) */}
          <div className="lg:col-span-3 ventixe-card p-5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Upcoming Event</h3>
              <MoreHorizontal className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>

            {/* Event Banner */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900">
              <img
                src={featuredEvent.bannerUrl}
                alt={featuredEvent.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow">
                {featuredEvent.category}
              </span>
            </div>

            {/* Event details */}
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                {featuredEvent.title}
              </h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-rose-500" />
                <span>Oct 28, 2026 • 09:00 AM</span>
              </p>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {featuredEvent.summary}
              </p>
            </div>

            {/* Pink View Details CTA */}
            <Link
              href={`/events/${featuredEvent.id}`}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white ventixe-gradient hover:opacity-95 text-center shadow-md shadow-rose-500/20 block"
            >
              View Details
            </Link>
          </div>

        </div>

        {/* LOWER SECTION: Popular Event Categories + Mini Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* POPULAR EVENTS CATEGORIES (col-span-7) */}
          <div className="lg:col-span-7 ventixe-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Popular Events Breakdown</h3>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
                <span>Popular</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              {/* Category 1: Tech & Hackathons */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Tech &amp; MNC Hackathons (Google, Microsoft)</span>
                  </div>
                  <span className="font-bold text-slate-900">40% • 20,000 events</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>

              {/* Category 2: AI & Cloud Masterclasses */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>AI &amp; Cloud Masterclasses (Meta, NVIDIA, AWS)</span>
                  </div>
                  <span className="font-bold text-slate-900">35% • 17,500 events</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              {/* Category 3: Career & Internships */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <span>Collegiate Career &amp; Resume Clinics</span>
                  </div>
                  <span className="font-bold text-slate-900">15% • 12,500 events</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full" style={{ width: '15%' }} />
                </div>
              </div>

              {/* Category 4: Student Competitions */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <span>Student Challenges (Apple Swift, Tesla Robotics)</span>
                  </div>
                  <span className="font-bold text-slate-900">10% • 8,200 events</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>

            {/* Quick CSV export */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total registered guests: {tickets.length}</span>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-rose-500" />
                <span>Export Guest CSV</span>
              </button>
            </div>
          </div>

          {/* MINI CALENDAR & SCHEDULE WIDGET (col-span-5) */}
          <div className="lg:col-span-5 ventixe-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">{selectedMonth}</h3>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="text-[11px] font-bold text-slate-400 py-1">
                  {d}
                </span>
              ))}

              {[
                { day: 28, isDim: true },
                { day: 29, isDim: true },
                { day: 30, isDim: true },
                { day: 1 },
                { day: 2 },
                { day: 3, hasEvent: true },
                { day: 4 },
                { day: 5, hasEvent: true },
                { day: 6 },
                { day: 7 },
                { day: 8 },
                { day: 9 },
                { day: 10 },
                { day: 11 },
                { day: 12 },
                { day: 13 },
                { day: 14, isSelected: true },
                { day: 15 },
                { day: 16 },
                { day: 17 },
                { day: 18 },
                { day: 19 },
                { day: 20 },
                { day: 21, hasEvent: true },
                { day: 22 },
                { day: 23 },
                { day: 24 },
                { day: 25 },
                { day: 26 },
                { day: 27 },
                { day: 28, hasEvent: true },
                { day: 29 },
                { day: 30 },
                { day: 31 },
                { day: 1, isDim: true },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCalendarDay(item.day)}
                  className={`py-1.5 rounded-full text-xs font-semibold transition-all ${
                    item.isSelected
                      ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-500/30'
                      : item.hasEvent
                      ? 'text-rose-600 font-bold bg-rose-50'
                      : item.isDim
                      ? 'text-slate-300'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.day}
                </button>
              ))}
            </div>

            {/* Upcoming Agenda Items under Calendar */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex flex-col items-center justify-center shrink-0 text-[10px]">
                  <span className="uppercase text-[9px]">Sat</span>
                  <span className="text-sm font-black leading-none">3</span>
                </div>
                <div className="flex-1 text-xs">
                  <h5 className="font-bold text-slate-800">Panel Discussion: Google AI Internships</h5>
                  <p className="text-[11px] text-slate-400">10:00 AM - 12:00 PM • Tech Concourse</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 font-bold flex flex-col items-center justify-center shrink-0 text-[10px]">
                  <span className="uppercase text-[9px]">Mon</span>
                  <span className="text-sm font-black leading-none">5</span>
                </div>
                <div className="flex-1 text-xs">
                  <h5 className="font-bold text-slate-800">Microsoft Azure Cloud Workshop</h5>
                  <p className="text-[11px] text-slate-400">09:30 AM - 05:00 PM • Building 1</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ALL EVENTS / BOOKINGS TABLE */}
        <div className="ventixe-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">All Scheduled MNC Events</h3>
              <p className="text-xs text-slate-400">Active university hackathons, certifications, and career summits.</p>
            </div>
            <Link
              href="/organizer/create"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white ventixe-gradient hover:opacity-95 shadow-md shadow-rose-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Event</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Event Details</th>
                  <th className="py-3 px-4">MNC Company</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Student Perks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.bannerUrl}
                          alt={evt.title}
                          className="w-12 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block max-w-xs truncate">
                            {evt.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {evt.city} • {new Date(evt.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800">
                        {evt.company}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700">
                        {evt.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 max-w-xs truncate text-slate-500 text-[11px]">
                      {evt.studentPerks?.[0] || evt.tags?.[0] || 'Direct Recruiter Access'}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● Published
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/events/${evt.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="View Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Remove event "${evt.title}"?`)) {
                              deleteEvent(evt.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
