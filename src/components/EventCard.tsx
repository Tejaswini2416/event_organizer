'use client';

import React from 'react';
import Link from 'next/link';
import { EventItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { resolveRegistrationUrl, getProviderLabel, isEventRegistrationClosed, getApplyButtonText } from '@/lib/urlUtils';
import { 
  Calendar, 
  MapPin, 
  Bookmark, 
  ExternalLink,
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Globe,
  Building2,
  Lock
} from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  viewMode?: 'grid' | 'list';
}

export const EventCard: React.FC<EventCardProps> = ({ event, viewMode = 'grid' }) => {
  const { isBookmarked, toggleBookmark, addRecentView } = useApp();
  const bookmarked = isBookmarked(event.id);

  const startDate = new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const isClosed = isEventRegistrationClosed(event);

  // Calculate deadline countdown / closed state
  let deadlineBadge = null;
  if (isClosed) {
    deadlineBadge = (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-700 text-white shadow-sm flex items-center gap-1 border border-rose-600">
        <Lock className="w-3 h-3" />
        <span>Registration Closed</span>
      </span>
    );
  } else if (event.registrationDeadline) {
    const deadlineTime = new Date(event.registrationDeadline).getTime();
    const nowTime = Date.now();
    const diffDays = Math.ceil((deadlineTime - nowTime) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0 && diffDays <= 4) {
      deadlineBadge = (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-sm flex items-center gap-1 animate-pulse">
          <Clock className="w-3 h-3" />
          <span>Closes in {diffDays} {diffDays === 1 ? 'day' : 'days'}!</span>
        </span>
      );
    }
  }

  // Sanitize external registration URL to guarantee 200 OK without dead ends
  const validApplyUrl = resolveRegistrationUrl(event.externalApplyUrl, event.category);

  // Determine platform label for external redirection CTA
  const getApplyButtonLabel = () => {
    return getApplyButtonText(validApplyUrl, isClosed);
  };

  const categoryMap: Record<string, string> = {
    HACKATHON: 'bg-rose-50 text-rose-700 border-rose-200',
    TECH_EVENT: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    CONFERENCE: 'bg-blue-50 text-blue-700 border-blue-200',
    WORKSHOP: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    WEBINAR: 'bg-purple-50 text-purple-700 border-purple-200',
    COLLEGE_FEST: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  const categoryColorClass = categoryMap[event.category] || 'bg-slate-50 text-slate-700 border-slate-200';

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => addRecentView(event.id)}
        className="group ventixe-card p-5 hover:border-rose-300 transition-all duration-300 hover:shadow-lg flex flex-col md:flex-row gap-5 items-center bg-white"
      >
        {/* Banner image */}
        <div className="relative w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0 bg-slate-900">
          <img
            src={event.bannerImageUrl || event.bannerUrl || '/events/google-campus.jpg'}
            alt={event.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              isClosed ? 'grayscale-[25%] opacity-90' : ''
            }`}
          />

          {/* Closed overlay banner */}
          {isClosed && (
            <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-rose-700/95 text-white shadow-lg border border-rose-500/80 flex items-center gap-1.5 uppercase tracking-wide">
                <Lock className="w-3.5 h-3.5" />
                <span>Registration Closed</span>
              </span>
            </div>
          )}

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/95 text-slate-800 shadow-sm border border-slate-100 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-rose-500" />
              <span>{event.organizerName}</span>
            </span>
          </div>

          {/* Bottom badge on banner */}
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
            {deadlineBadge}
            {event.prizePool && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-900 shadow-md flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-900" />
                <span>{event.prizePool}</span>
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(event.id);
            }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-20 ${
              bookmarked
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 text-slate-700 hover:text-rose-600 hover:bg-white'
            }`}
            aria-label="Bookmark event"
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 w-full space-y-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${categoryColorClass}`}>
              {event.category.replace('_', ' ')}
            </span>

            {isClosed ? (
              <span className="px-2.5 py-0.5 rounded-full font-black bg-rose-100 text-rose-800 border border-rose-300 text-[10px] flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-rose-600" />
                <span>Closed 🚫</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open 🟢</span>
              </span>
            )}

            <span className="px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 text-[11px] flex items-center gap-1">
              {event.locationType === 'ONLINE' ? (
                <>
                  <Globe className="w-3 h-3 text-blue-500" />
                  <span>Online / Virtual</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>{event.city} • {event.locationType}</span>
                </>
              )}
            </span>

            {event.entryFee === 0 && (
              <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
                Free Entry 🆓
              </span>
            )}

            <span className="text-slate-400 font-medium ml-auto flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              {formattedDate}
            </span>
          </div>

          <Link 
            href={`/events/${event.slug || event.id}`}
            className="block group-hover:text-rose-600 transition-colors"
          >
            <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-1">
              {event.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {event.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-semibold border border-slate-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* External Redirection CTA */}
        <div className="w-full md:w-auto shrink-0 flex md:flex-col justify-between md:justify-center items-center md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Entry</span>
            <span className="text-base font-black text-rose-600">
              {event.entryFee === 0 ? 'FREE' : `₹${event.entryFee}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/events/${event.slug || event.id}`}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Details
            </Link>

            {isClosed ? (
              <span
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 cursor-not-allowed select-none"
                title="Registration for this event has concluded"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Registration Closed</span>
              </span>
            ) : (
              <a
                href={validApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white ventixe-gradient hover:opacity-95 shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02]"
              >
                <span>{getApplyButtonLabel()}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div 
      onClick={() => addRecentView(event.id)}
      className="group ventixe-card rounded-3xl overflow-hidden hover:border-rose-300 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/5 flex flex-col h-full bg-white"
    >
      {/* Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={event.bannerImageUrl || event.bannerUrl || '/events/google-campus.jpg'}
          alt={event.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isClosed ? 'grayscale-[25%] opacity-90' : ''
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

        {/* Closed Overlay Watermark */}
        {isClosed && (
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-rose-700/95 text-white shadow-xl border border-rose-500/80 flex items-center gap-1.5 uppercase tracking-wide">
              <Lock className="w-3.5 h-3.5" />
              <span>Registration Closed</span>
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-white/95 text-slate-900 shadow-md backdrop-blur-md flex items-center gap-1.5 line-clamp-1 max-w-[70%]">
            <Building2 className="w-3 h-3 text-rose-600 shrink-0" />
            <span className="truncate">{event.organizerName}</span>
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(event.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              bookmarked
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-slate-700 hover:text-rose-600 hover:bg-white'
            }`}
            aria-label="Bookmark event"
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Bottom Banner Overlays */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-20">
          <div className="flex items-center gap-1.5">
            {deadlineBadge}
            {event.prizePool && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-md flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-900" />
                <span className="truncate max-w-[120px]">{event.prizePool}</span>
              </span>
            )}
          </div>

          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white font-medium text-[10px] flex items-center gap-1">
            {event.locationType === 'ONLINE' ? (
              <>
                <Globe className="w-2.5 h-2.5 text-blue-400" />
                <span>Online</span>
              </>
            ) : (
              <>
                <MapPin className="w-2.5 h-2.5 text-rose-400" />
                <span>{event.city}</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Category & Perks */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${categoryColorClass}`}>
              {event.category.replace('_', ' ')}
            </span>

            {isClosed ? (
              <span className="px-2.5 py-0.5 rounded-full font-black bg-rose-100 text-rose-800 border border-rose-300 text-[10px] flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-rose-600" />
                <span>Closed 🚫</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open 🟢</span>
              </span>
            )}

            {event.entryFee === 0 ? (
              <span className="px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                Free Entry 🆓
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 text-[10px]">
                ₹{event.entryFee}
              </span>
            )}

            <span className="text-slate-400 font-semibold flex items-center gap-1 text-[11px] ml-auto">
              <Calendar className="w-3 h-3 text-rose-500" />
              <span>{formattedDate}</span>
            </span>
          </div>

          {/* Title */}
          <Link 
            href={`/events/${event.slug || event.id}`}
            className="block group-hover:text-rose-600 transition-colors"
          >
            <h3 className="text-base font-bold text-slate-900 tracking-tight line-clamp-2 leading-snug">
              {event.title}
            </h3>
          </Link>

          {/* Venue & City */}
          <p className="text-xs text-slate-500 flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{event.venueName || event.city}</span>
          </p>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {event.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-semibold border border-slate-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Details & External Redirection Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            href={`/events/${event.slug || event.id}`}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline px-2 py-1"
          >
            View Details
          </Link>

          {isClosed ? (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 cursor-not-allowed select-none"
              title="Registration for this event has concluded"
            >
              <Lock className="w-3.5 h-3.5 text-rose-600" />
              <span>Registration Closed</span>
            </span>
          ) : (
            <a
              href={validApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white ventixe-gradient hover:opacity-95 shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02]"
            >
              <span>{getApplyButtonLabel()}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
