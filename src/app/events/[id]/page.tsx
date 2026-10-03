'use client';

import React, { useState, use, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { EventCard } from '@/components/EventCard';
import { resolveRegistrationUrl, getProviderLabel, isEventRegistrationClosed } from '@/lib/urlUtils';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  Bookmark, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Check, 
  Copy, 
  Award,
  ExternalLink,
  Globe,
  Building2,
  GraduationCap,
  CalendarPlus,
  Eye,
  ShieldCheck,
  Lock,
  AlertTriangle
} from 'lucide-react';

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const identifier = unwrappedParams.id;

  const { events, isBookmarked, toggleBookmark, addRecentView } = useApp();
  
  // Match by slug or by id
  const event = events.find((e) => e.slug === identifier || e.id === identifier);

  const [copiedLink, setCopiedLink] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Track recent view on mount
  React.useEffect(() => {
    if (event) {
      addRecentView(event.id);
    }
  }, [event?.id]);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-sm text-slate-500">
          The event you are looking for might have been moved or removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white ventixe-gradient"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Discovery</span>
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(event.id);

  const eventStartDate = new Date(event.startDate);
  const eventEndDate = new Date(event.endDate);

  const formattedDate = eventStartDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventStartDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const formattedDeadline = event.registrationDeadline
    ? new Date(event.registrationDeadline).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Verified apply URL & status
  const validApplyUrl = resolveRegistrationUrl(event.externalApplyUrl, event.category);
  const isClosed = isEventRegistrationClosed(event);

  // Calendar Helpers
  const handleAddToGoogleCalendar = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.shortDescription}\n\nOfficial Portal: ${validApplyUrl}`);
    const location = encodeURIComponent(event.venueName || event.city || 'Online');
    const startIso = eventStartDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endIso = eventEndDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const handleAddToOutlookCalendar = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.shortDescription}\n\nApply: ${validApplyUrl}`);
    const location = encodeURIComponent(event.venueName || event.city || 'Online');
    const startIso = eventStartDate.toISOString();
    const endIso = eventEndDate.toISOString();
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&location=${location}&startdt=${startIso}&enddt=${endIso}`;
    window.open(outlookUrl, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Similar / Recommended events based on category and tags
  const similarEvents = useMemo(() => {
    return events
      .filter((e) => e.id !== event.id)
      .map((e) => {
        let score = 0;
        if (e.category === event.category) score += 3;
        if (e.city === event.city) score += 2;
        const sharedTags = e.tags.filter((t) => event.tags.includes(t));
        score += sharedTags.length;
        return { event: e, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.event);
  }, [events, event]);

  const getSourceLabel = () => {
    return getProviderLabel(validApplyUrl, event.organizerName);
  };

  return (
    <div className="pb-24 bg-[#f8f9fe]">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between text-xs text-slate-500">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:text-slate-900 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-rose-500" />
          <span>Back to All Student Events</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleBookmark(event.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-colors ${
              bookmarked
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-white border-slate-200 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? 'currentColor' : 'none'} />
            <span className="font-semibold">{bookmarked ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:text-slate-900 transition-colors font-semibold"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative w-full aspect-[21/9] max-h-[460px] overflow-hidden bg-slate-900">
        <img
          src={event.bannerImageUrl || event.bannerUrl || '/events/google-campus.jpg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        
        {/* Banner Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-white text-slate-900 shadow-md flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{event.organizerName}</span>
            </span>

            <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-600 text-white shadow-md">
              {event.category.replace('_', ' ')}
            </span>

            {isClosed ? (
              <span className="px-3 py-1 text-xs font-black rounded-full bg-rose-700 text-white shadow-md flex items-center gap-1.5 border border-rose-600">
                <Lock className="w-3.5 h-3.5" />
                <span>Registration Closed</span>
              </span>
            ) : event.isVerified ? (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Student Opportunity</span>
              </span>
            ) : null}

            {event.prizePool && (
              <span className="px-3 py-1 text-xs font-black rounded-full bg-amber-400 text-slate-950 shadow-md flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-950" />
                <span>{event.prizePool}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight max-w-4xl leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-200 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              {event.locationType === 'ONLINE' ? (
                <>
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Online / Virtual Access</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{event.venueName || event.city}, {event.country}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{event.viewsCount} students viewed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout: Overview + Sticky External Apply Widget */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT 2 COLUMNS: Details, Eligibility, Timeline, Rules */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview & Full Description */}
            <div className="ventixe-card p-6 sm:p-8 space-y-4 bg-white">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                About This Event
              </h2>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {event.fullDescription || event.shortDescription}
              </div>

              {/* Tags */}
              <div className="pt-4 flex flex-wrap gap-2 border-t border-slate-100">
                {event.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility & Major Criteria */}
            <div className="ventixe-card p-6 sm:p-8 space-y-4 bg-white">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-rose-600" />
                <span>Student Eligibility &amp; Department Requirements</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {event.eligibleMajors.map((major, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Eligible: {major}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2">
                Open to students currently enrolled in undergraduate, postgraduate, or diploma programs across recognized universities. Valid college ID card required at event check-in.
              </p>
            </div>

            {/* Event Schedule & Important Dates */}
            <div className="ventixe-card p-6 sm:p-8 space-y-4 bg-white">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-600" />
                <span>Important Dates &amp; Deadlines</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600">Registration Deadline:</span>
                  <span className="font-black text-rose-600">
                    {formattedDeadline || 'Until seats last'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600">Event Start Date:</span>
                  <span className="font-bold text-slate-900">{formattedDate}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600">Venue / Location:</span>
                  <span className="font-bold text-slate-900">{event.venueName || event.city}</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky External Apply Card & Calendar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              {/* Main External Registration Card */}
              <div className="ventixe-card p-6 space-y-5 border-2 border-rose-100 shadow-xl shadow-slate-200/50 bg-white">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">
                    Official Registration
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {event.entryFee === 0 ? 'Free Entry for Students' : `Entry Fee: ₹${event.entryFee}`}
                  </h3>
                </div>

                {/* Redirection Provider Notice or Closed Warning */}
                {isClosed ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-xs text-rose-950">
                    <div className="flex items-center gap-1.5 font-black text-rose-800 text-sm">
                      <Lock className="w-4 h-4 text-rose-600" />
                      <span>Applications Closed / Event Ended</span>
                    </div>
                    <p className="text-[11px] text-rose-700 leading-relaxed font-medium">
                      The official application deadline ({formattedDeadline || 'past date'}) has passed. This event is no longer accepting new registrations on {getSourceLabel()}.
                    </p>
                    {validApplyUrl && (
                      <a
                        href={validApplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 underline hover:text-rose-950 pt-1"
                      >
                        <span>View archived projects &amp; winners on {getSourceLabel()}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1 text-xs">
                    <span className="font-bold text-rose-800 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
                      <span>Hosted on {getSourceLabel()}</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Clicking the button below redirects you directly to the official external application portal.
                    </p>
                  </div>
                )}

                {/* Primary Outward Apply CTA or Closed Indicator */}
                {isClosed ? (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full py-4 rounded-2xl font-black text-xs sm:text-sm text-rose-700 bg-rose-50 border-2 border-rose-200 cursor-not-allowed flex items-center justify-center gap-2 select-none"
                    >
                      <Lock className="w-4 h-4 text-rose-600" />
                      <span>Registration Closed</span>
                    </button>

                    <Link
                      href={event.category === 'COLLEGE_FEST' ? '/?category=COLLEGE_FEST' : '/?category=HACKATHON'}
                      className="w-full py-3 rounded-2xl font-bold text-xs text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Explore Active {event.category === 'COLLEGE_FEST' ? 'College Fests' : 'Hackathons'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <a
                    href={validApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-2xl font-black text-xs sm:text-sm text-white ventixe-gradient hover:opacity-95 shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    <span>Register on {getSourceLabel()}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {/* Add to Calendar Widget */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Don&apos;t miss this deadline:
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleAddToGoogleCalendar}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-rose-500" />
                      <span>Google Cal</span>
                    </button>

                    <button
                      onClick={handleAddToOutlookCalendar}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-blue-500" />
                      <span>Outlook Cal</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Bookmark & Reminder Note */}
              <div className="ventixe-card p-5 bg-white border border-slate-200 space-y-3">
                <button
                  onClick={() => toggleBookmark(event.id)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                    bookmarked
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
                  <span>{bookmarked ? 'Saved to Your Bookmarks' : 'Save Event for Later'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* SIMILAR & RECOMMENDED EVENTS */}
        {similarEvents.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200 space-y-6">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
                Recommended For You
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Similar Hackathons &amp; Events
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarEvents.map((simEvt) => (
                <EventCard key={simEvt.id} event={simEvt} viewMode="grid" />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Share This Student Event</h4>
              <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-slate-800">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Send to college classmates and study groups:
            </p>
            <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="w-full bg-transparent text-xs text-slate-700 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shrink-0 flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
