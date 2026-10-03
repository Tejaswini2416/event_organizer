'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { EventCard } from '@/components/EventCard';
import { 
  Bookmark, 
  Clock, 
  History, 
  Trophy, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Calendar, 
  Flame, 
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function StudentDashboard() {
  const { events, bookmarkedIds, recentViewIds, toggleBookmark } = useApp();
  const [activeTab, setActiveTab] = useState<'saved' | 'recent'>('saved');

  // Bookmarked Events
  const savedEvents = useMemo(() => {
    return events.filter((e) => bookmarkedIds.includes(e.id));
  }, [events, bookmarkedIds]);

  // Recently Viewed Events
  const recentEvents = useMemo(() => {
    return recentViewIds
      .map((id) => events.find((e) => e.id === id))
      .filter((e): e is typeof events[0] => Boolean(e));
  }, [events, recentViewIds]);

  // Closing Soon calculation
  const closingSoonCount = useMemo(() => {
    const nowTime = Date.now();
    return savedEvents.filter((e) => {
      if (!e.registrationDeadline) return false;
      const diffDays = Math.ceil((new Date(e.registrationDeadline).getTime() - nowTime) / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 5;
    }).length;
  }, [savedEvents]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#f8f9fe]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
              Student Workspace
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              Active Discovery Hub
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            My Saved Events &amp; Deadline Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Keep track of upcoming hackathon deadlines, college fests, and recently explored opportunities.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white ventixe-gradient hover:opacity-95 shadow-md shadow-rose-500/20 transition-all self-start sm:self-auto"
        >
          <span>Explore More Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Analytics / Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="ventixe-card p-5 bg-white space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Saved Bookmarks</span>
            <Bookmark className="w-4 h-4 text-rose-500" fill="currentColor" />
          </div>
          <p className="text-2xl font-black text-slate-900">{savedEvents.length}</p>
          <span className="text-[11px] text-slate-400">Ready to apply</span>
        </div>

        <div className="ventixe-card p-5 bg-white space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Closing in ≤ 5 Days</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{closingSoonCount}</p>
          <span className="text-[11px] text-amber-700/80 font-medium">Urgent deadlines pending</span>
        </div>

        <div className="ventixe-card p-5 bg-white space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Recently Inspected</span>
            <History className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-600">{recentEvents.length}</p>
          <span className="text-[11px] text-slate-400">Cached in local session</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'saved'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" fill={activeTab === 'saved' ? 'currentColor' : 'none'} />
          <span>Saved Bookmarks ({savedEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'recent'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Recently Viewed ({recentEvents.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: SAVED EVENTS */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {savedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEvents.map((evt) => (
                <div key={evt.id} className="relative group">
                  <EventCard event={evt} viewMode="grid" />
                  
                  {/* Quick Remove Bookmark bar below card */}
                  <div className="mt-2 flex items-center justify-between text-xs px-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Deadline: {evt.registrationDeadline ? new Date(evt.registrationDeadline).toLocaleDateString() : 'Rolling'}
                    </span>
                    <button
                      onClick={() => toggleBookmark(evt.id)}
                      className="text-[11px] text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ventixe-card p-12 text-center space-y-4 bg-white">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No saved events yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Browse upcoming hackathons and click the heart bookmark icon to save them to your workspace.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white ventixe-gradient"
              >
                <span>Find Events to Save</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: RECENT VIEWS */}
      {activeTab === 'recent' && (
        <div className="space-y-6">
          {recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="ventixe-card p-12 text-center space-y-4 bg-white">
              <History className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No recently viewed events</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                As you click and explore hackathons and workshops, your history will show up here.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white ventixe-gradient"
              >
                <span>Explore Tech Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
