'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { EventCard } from '@/components/EventCard';
import { Category, LocationType, EventItem } from '@/types';
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  Trophy, 
  Sparkles, 
  Grid, 
  List, 
  SlidersHorizontal, 
  ArrowRight,
  ExternalLink,
  Flame,
  Globe,
  Clock,
  CheckCircle2,
  X,
  Lock
} from 'lucide-react';
import { isEventRegistrationClosed } from '@/lib/urlUtils';

const CITIES = [
  'All Cities',
  'Bengaluru',
  'Delhi-NCR',
  'Chennai',
  'Mumbai',
  'Kanpur',
  'Rourkela',
  'Online',
] as const;

const MAJORS = [
  'All Majors',
  'CS / IT',
  'ECE',
  'Mechanical',
  'Open to All',
] as const;

export type StatusFilter = 'ALL' | 'OPEN' | 'CLOSED';

type FilterChipId = 
  | 'all' 
  | 'tech_event'
  | 'hackathon' 
  | 'college_fest' 
  | 'open_only'
  | 'closed_only'
  | 'free_entry' 
  | 'free_food' 
  | 'certificates' 
  | 'workshop' 
  | 'online' 
  | 'closing_soon';

interface FilterChip {
  id: FilterChipId;
  label: string;
}

const FILTER_CHIPS: FilterChip[] = [
  { id: 'all', label: 'All Events 🎯' },
  { id: 'tech_event', label: 'Tech Events ⚡' },
  { id: 'hackathon', label: 'Hackathons 💻' },
  { id: 'college_fest', label: 'College Fests 🎪' },
  { id: 'open_only', label: 'Open Only 🟢' },
  { id: 'closed_only', label: 'Closed / Archive 🚫' },
  { id: 'free_entry', label: 'Free Entry 🆓' },
  { id: 'free_food', label: 'Free Food 🍕' },
  { id: 'certificates', label: 'Certificates 📜' },
  { id: 'workshop', label: 'Workshops 🛠️' },
  { id: 'online', label: 'Virtual / Online 🌐' },
  { id: 'closing_soon', label: 'Closing Soon ⏳' },
];

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const { events } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedChip, setSelectedChip] = useState<FilterChipId>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedMajor, setSelectedMajor] = useState<string>('All Majors');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize category query param with selectedChip
  useEffect(() => {
    if (categoryParam === 'TECH_EVENT') {
      setSelectedChip('tech_event');
    } else if (categoryParam === 'HACKATHON') {
      setSelectedChip('hackathon');
    } else if (categoryParam === 'COLLEGE_FEST') {
      setSelectedChip('college_fest');
    } else if (!categoryParam && (selectedChip === 'hackathon' || selectedChip === 'college_fest' || selectedChip === 'tech_event')) {
      setSelectedChip('all');
    }
  }, [categoryParam]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Click outside to close autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Filter Chip Selection & URL Sync
  const handleChipSelect = (chipId: FilterChipId) => {
    setSelectedChip(chipId);
    if (chipId === 'tech_event') {
      router.push('/?category=TECH_EVENT', { scroll: false });
    } else if (chipId === 'hackathon') {
      router.push('/?category=HACKATHON', { scroll: false });
    } else if (chipId === 'college_fest') {
      router.push('/?category=COLLEGE_FEST', { scroll: false });
    } else if (chipId === 'all') {
      setStatusFilter('ALL');
      router.push('/', { scroll: false });
    } else if (chipId === 'open_only') {
      setStatusFilter('OPEN');
    } else if (chipId === 'closed_only') {
      setStatusFilter('CLOSED');
    }
  };

  // Autocomplete Suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    return events
      .filter((evt) => {
        // If on tech events tab, only suggest tech events
        if (selectedChip === 'tech_event') {
          const isTech = evt.category === 'TECH_EVENT' || evt.category === 'CONFERENCE' || evt.tags.some((t) => t.toLowerCase().includes('tech'));
          if (!isTech) return false;
        }
        // If on hackathon tab, only suggest hackathons
        if (selectedChip === 'hackathon' && evt.category !== 'HACKATHON') return false;
        // If on college fest tab, only suggest college fests
        if (selectedChip === 'college_fest' && evt.category !== 'COLLEGE_FEST') return false;

        return (
          evt.title.toLowerCase().includes(q) ||
          evt.organizerName.toLowerCase().includes(q) ||
          (evt.city && evt.city.toLowerCase().includes(q)) ||
          evt.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .slice(0, 5);
  }, [events, searchQuery, selectedChip]);

  // Main Filtered Events (STRICT ISOLATION)
  const filteredEvents = useMemo(() => {
    const nowTime = Date.now();

    return events.filter((evt) => {
      // 1. STRICT CATEGORY ISOLATION
      // When Tech Events is selected, show Tech Events, Conferences, and Tech Summits
      if (selectedChip === 'tech_event' || categoryParam === 'TECH_EVENT') {
        const isTech = evt.category === 'TECH_EVENT' || evt.category === 'CONFERENCE' || evt.tags.some((t) => t.toLowerCase().includes('tech'));
        if (!isTech) return false;
      }

      // When Hackathons is selected, show ONLY hackathons
      if (selectedChip === 'hackathon' || categoryParam === 'HACKATHON') {
        if (evt.category !== 'HACKATHON') return false;
      }

      // When College Fests is selected, show ONLY college fests
      if (selectedChip === 'college_fest' || categoryParam === 'COLLEGE_FEST') {
        if (evt.category !== 'COLLEGE_FEST') return false;
      }

      // 2. Search Query filter
      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase().trim();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchDesc = evt.shortDescription.toLowerCase().includes(q) || evt.fullDescription.toLowerCase().includes(q);
        const matchOrganizer = evt.organizerName.toLowerCase().includes(q);
        const matchCity = (evt.city || '').toLowerCase().includes(q);
        const matchVenue = (evt.venueName || '').toLowerCase().includes(q);
        const matchTags = evt.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchTitle && !matchDesc && !matchOrganizer && !matchCity && !matchVenue && !matchTags) {
          return false;
        }
      }

      // 3. City Filter
      if (selectedCity !== 'All Cities') {
        if (selectedCity === 'Online') {
          if (evt.locationType !== 'ONLINE' && (evt.city || '').toLowerCase() !== 'online') {
            return false;
          }
        } else if ((evt.city || '').toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
      }

      // 4. Major Filter
      if (selectedMajor !== 'All Majors') {
        const majorKey = selectedMajor.replace(' / IT', '').toLowerCase();
        const hasMajor = evt.eligibleMajors.some(
          (m) => m.toLowerCase() === 'open to all' || m.toLowerCase().includes(majorKey)
        );
        if (!hasMajor) return false;
      }

      // 5. Status / Registration Closed Filter
      const isClosed = isEventRegistrationClosed(evt);
      if (statusFilter === 'OPEN' || selectedChip === 'open_only') {
        if (isClosed) return false;
      } else if (statusFilter === 'CLOSED' || selectedChip === 'closed_only') {
        if (!isClosed) return false;
      }

      // 6. Secondary Quick Filter Chips
      switch (selectedChip) {
        case 'free_entry':
          if (evt.entryFee > 0) return false;
          break;
        case 'free_food':
          if (!evt.tags.some((t) => t.toLowerCase().includes('free food'))) return false;
          break;
        case 'certificates':
          if (!evt.tags.some((t) => t.toLowerCase().includes('certificate'))) return false;
          break;
        case 'workshop':
          if (evt.category !== 'WORKSHOP') return false;
          break;
        case 'online':
          if (evt.locationType !== 'ONLINE' && evt.locationType !== 'HYBRID') return false;
          break;
        case 'closing_soon':
          if (!evt.registrationDeadline) return false;
          const diffDays = Math.ceil((new Date(evt.registrationDeadline).getTime() - nowTime) / (1000 * 60 * 60 * 24));
          if (diffDays <= 0 || diffDays > 5) return false;
          break;
        default:
          break;
      }

      return true;
    });
  }, [events, debouncedQuery, selectedCity, selectedMajor, selectedChip, categoryParam, statusFilter]);

  // Spotlight Events (Filtered Strictly to Match Current Category View and ONLY ACTIVE/OPEN)
  const spotlightEvents = useMemo(() => {
    let pool = [...events].filter((e) => !isEventRegistrationClosed(e));
    if (selectedChip === 'tech_event' || categoryParam === 'TECH_EVENT') {
      pool = pool.filter((e) => e.category === 'TECH_EVENT' || e.category === 'CONFERENCE' || e.tags.some((t) => t.toLowerCase().includes('tech')));
    } else if (selectedChip === 'hackathon' || categoryParam === 'HACKATHON') {
      pool = pool.filter((e) => e.category === 'HACKATHON');
    } else if (selectedChip === 'college_fest' || categoryParam === 'COLLEGE_FEST') {
      pool = pool.filter((e) => e.category === 'COLLEGE_FEST');
    }
    return pool.filter((e) => e.prizePool && e.viewsCount > 3000).slice(0, 3);
  }, [events, selectedChip, categoryParam]);

  // Dynamic headings based on active filter
  const isHackathonMode = selectedChip === 'hackathon' || categoryParam === 'HACKATHON';
  const isFestMode = selectedChip === 'college_fest' || categoryParam === 'COLLEGE_FEST';
  const isTechMode = selectedChip === 'tech_event' || categoryParam === 'TECH_EVENT';

  const getSpotlightTitle = () => {
    if (isTechMode) return 'Featured Flagship Tech Events ⚡';
    if (isHackathonMode) return 'Featured Flagship Hackathons 💻';
    if (isFestMode) return 'Featured Premier College Fests 🎪';
    return 'Featured Flagship Tech Events & Fests';
  };

  const getDirectoryTitle = () => {
    if (isTechMode) return 'Explore Premier Tech Events & Summits';
    if (isHackathonMode) return 'Explore Student Hackathons';
    if (isFestMode) return 'Explore College Technical Festivals';
    return 'Explore All Tech Events & Fests';
  };

  const openCount = useMemo(() => filteredEvents.filter((e) => !isEventRegistrationClosed(e)).length, [filteredEvents]);
  const closedCount = useMemo(() => filteredEvents.filter((e) => isEventRegistrationClosed(e)).length, [filteredEvents]);

  const getDirectorySubtitle = () => {
    let base = '';
    if (isTechMode) {
      base = `Showing ${filteredEvents.length} developer summits, cloud conferences, and tech days`;
    } else if (isHackathonMode) {
      base = `Showing ${filteredEvents.length} hackathons`;
    } else if (isFestMode) {
      base = `Showing ${filteredEvents.length} official college fests hosted by IITs, NITs, and universities`;
    } else {
      base = `Showing ${filteredEvents.length} student opportunities across engineering, tech, and design`;
    }
    return `${base} (${openCount} Open 🟢, ${closedCount} Closed 🚫)`;
  };

  return (
    <div className="space-y-12 pb-24 bg-[#f8f9fe]">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-16 pb-12 overflow-hidden bg-gradient-to-b from-white via-rose-50/25 to-[#f8f9fe] border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-sm">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Collegiate Tech Events, Hackathons &amp; Fests Discovery Engine</span>
          </div>

          {/* Heading */}
          <div className="space-y-3 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {isTechMode ? (
                <>Connect, Learn &amp; Build at <br /><span className="ventixe-text-gradient">India&apos;s Biggest Tech Events.</span></>
              ) : isHackathonMode ? (
                <>Search, Build &amp; Win in <br /><span className="ventixe-text-gradient">India&apos;s Biggest Hackathons.</span></>
              ) : isFestMode ? (
                <>Experience Asia&apos;s Premier <br /><span className="ventixe-text-gradient">College Technical Festivals.</span></>
              ) : (
                <>Search, Explore &amp; Apply to <br /><span className="ventixe-text-gradient">India&apos;s Best Student Tech Events.</span></>
              )}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              {isTechMode
                ? 'Register directly on official portals for Google Cloud Community Days, Microsoft AI Tours, AWS Summits, NVIDIA Tech Days, and open-source gatherings.'
                : isHackathonMode
                ? 'Directly access official registration pages for Smart India Hackathon (SIH), Devfolio collegiate hackathons, and top university sprints.'
                : isFestMode
                ? 'Register directly on official portals for Techkriti (IIT Kanpur), Shaastra (IIT Madras), Techfest (IIT Bombay), and leading campus fests.'
                : 'Discover official hackathons, robotics challenges, coding fests, and workshops hosted by IITs, NITs, and top tech communities. One-click apply directly to official portals.'}
            </p>
          </div>

          {/* Search Bar + Live Autocomplete */}
          <div ref={searchContainerRef} className="max-w-2xl mx-auto relative z-30">
            <div className="ventixe-card p-2 sm:p-2.5 flex items-center gap-2 border-2 border-rose-100/80 shadow-xl shadow-rose-500/5 bg-white rounded-3xl">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-rose-500 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsAutocompleteOpen(true);
                  }}
                  onFocus={() => setIsAutocompleteOpen(true)}
                  placeholder={
                    isHackathonMode
                      ? 'Search SIH, HackNITR, Devfolio hackathons, Web3, or cities...'
                      : isFestMode
                      ? 'Search IIT Kanpur Techkriti, Shaastra, RoboWars, or campus...'
                      : 'Search hackathons, AI/ML, IIT fests, Devpost, or cities...'
                  }
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50/80 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium border border-slate-100"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsAutocompleteOpen(false);
                    }}
                    className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <a
                href="#discovery-grid"
                className="hidden sm:flex px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white ventixe-gradient hover:opacity-95 shadow-md shadow-rose-500/25 transition-transform hover:scale-[1.02] items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Instant Autocomplete Suggestions Dropdown */}
            {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-left z-50 divide-y divide-slate-100">
                <div className="p-2.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Direct Match Suggestions</span>
                  <span>{autocompleteSuggestions.length} found</span>
                </div>
                {autocompleteSuggestions.map((sug) => (
                  <Link
                    key={sug.id}
                    href={`/events/${sug.slug || sug.id}`}
                    onClick={() => setIsAutocompleteOpen(false)}
                    className="p-3.5 hover:bg-rose-50/50 flex items-center justify-between gap-4 transition-colors group"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-rose-600 truncate block">
                        {sug.title}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{sug.organizerName}</span>
                        <span>•</span>
                        <span>{sug.city || 'Online'}</span>
                      </div>
                    </div>
                    {sug.prizePool && (
                      <span className="shrink-0 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {sug.prizePool}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Value Highlights */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-slate-500 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-700 font-bold">Live Dynamic Sync Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Direct Registration Portals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>₹1 Crore+ Active Student Prizes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-rose-500" />
              <span>SIH, Google Cloud, IITs &amp; Devfolio</span>
            </div>
          </div>

        </div>
      </section>

      {/* SPOTLIGHT BANNER (STRICTLY CATEGORY FILTERED) */}
      {spotlightEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {getSpotlightTitle()}
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              High Student Engagement
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {spotlightEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} viewMode="grid" />
            ))}
          </div>
        </section>
      )}

      {/* MAIN DISCOVERY SECTION */}
      <section id="discovery-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
              {isHackathonMode ? 'Hackathon Directory' : isFestMode ? 'Fest Directory' : 'Event Directory'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              {getDirectoryTitle()}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {getDirectorySubtitle()}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-rose-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-rose-600 text-white shadow' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 1. Quick Student Filter Chips */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {FILTER_CHIPS.map((chip) => {
              const isSelected = selectedChip === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => handleChipSelect(chip.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'ventixe-gradient text-white shadow-md shadow-rose-500/25 scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-sm'
                  }`}
                >
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. City & Major Dropdowns & Reset Bar */}
        <div className="ventixe-card p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold bg-white">
          <div className="flex flex-wrap items-center gap-4">
            {/* City Selector */}
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="text-slate-500">Hub:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-500"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Major Selector */}
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span className="text-slate-500">Major:</span>
              <select
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-500"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Status / Availability Selector */}
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  const val = e.target.value as StatusFilter;
                  setStatusFilter(val);
                  if (val === 'OPEN') setSelectedChip('open_only');
                  else if (val === 'CLOSED') setSelectedChip('closed_only');
                  else if (selectedChip === 'open_only' || selectedChip === 'closed_only') setSelectedChip('all');
                }}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open Only 🟢</option>
                <option value="CLOSED">Closed Only 🚫</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          {(selectedChip !== 'all' || selectedCity !== 'All Cities' || selectedMajor !== 'All Majors' || statusFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                handleChipSelect('all');
                setStatusFilter('ALL');
                setSelectedCity('All Cities');
                setSelectedMajor('All Majors');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Event Grid / List */}
        {filteredEvents.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="ventixe-card p-12 text-center space-y-4 bg-white">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              No matching {isHackathonMode ? 'hackathons' : isFestMode ? 'college fests' : 'student events'} found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your city filter or clearing your keyword search.
            </p>
            <button
              onClick={() => {
                handleChipSelect('all');
                setSelectedCity('All Cities');
                setSelectedMajor('All Majors');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white ventixe-gradient"
            >
              Clear Filters
            </button>
          </div>
        )}

      </section>

      {/* STUDENT CROWDSOURCING CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ventixe-card p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white shadow-xl shadow-rose-500/20 rounded-3xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/20 inline-block backdrop-blur-md">
              Collegiate Club Leads &amp; Fest Ambassadors
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Hosting a Hackathon or College Fest?
            </h2>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              List your college event on Ventixe to reach 100,000+ student developers across India. Instant verification and direct redirection to your official registration portal.
            </p>
            <div className="pt-2">
              <Link
                href="/submit-event"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all hover:scale-[1.02]"
              >
                <span>Submit Your College Event Now</span>
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto" />
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
