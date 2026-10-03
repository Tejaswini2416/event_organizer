'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Bookmark, 
  PlusCircle, 
  Menu, 
  X,
  Search,
  Sparkles,
  GraduationCap,
  Trophy,
  Flame,
  CalendarCheck
} from 'lucide-react';

export const VentixeLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className="flex items-center gap-3 group">
      {/* Ventixe Geometric Ribbon Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${
        isSm ? 'w-8 h-8' : isLg ? 'w-12 h-12' : 'w-10 h-10'
      }`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full drop-shadow-sm">
          <path
            d="M8 8L20 20L14 32L4 18L8 8Z"
            fill="url(#ventixe-pink-grad)"
          />
          <path
            d="M32 8L20 20L26 32L36 18L32 8Z"
            fill="url(#ventixe-purple-grad)"
          />
          <path
            d="M20 20L14 32L26 32L20 20Z"
            fill="url(#ventixe-center-grad)"
            opacity="0.85"
          />
          <defs>
            <linearGradient id="ventixe-pink-grad" x1="4" y1="8" x2="20" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f43f5e" />
              <stop offset="1" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="ventixe-purple-grad" x1="20" y1="8" x2="36" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="ventixe-center-grad" x1="14" y1="20" x2="26" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#db2777" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div>
        <span className={`font-black tracking-tight text-slate-900 block leading-tight ${
          isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl'
        }`}>
          Ventixe
        </span>
        <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">
          Student Event Discovery Engine
        </span>
      </div>
    </div>
  );
};

const NavLinksInner: React.FC<{
  pathname: string;
  bookmarkedCount: number;
  onNavigate?: () => void;
  isMobile?: boolean;
}> = ({ pathname, bookmarkedCount, onNavigate, isMobile }) => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const isExplore = pathname === '/' && !category;
  const isHackathon = pathname === '/' && category === 'HACKATHON';
  const isTech = pathname === '/' && category === 'TECH_EVENT';
  const isFest = pathname === '/' && category === 'COLLEGE_FEST';
  const isDashboard = pathname === '/dashboard';

  if (isMobile) {
    return (
      <div className="flex flex-col gap-1 py-2">
        <Link
          href="/"
          onClick={onNavigate}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm ${
            isExplore ? 'bg-rose-50 text-rose-600 font-black' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          Explore All Events
        </Link>
        <Link
          href="/?category=TECH_EVENT"
          onClick={onNavigate}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm ${
            isTech ? 'bg-rose-50 text-rose-600 font-black' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          Tech Events ⚡
        </Link>
        <Link
          href="/?category=HACKATHON"
          onClick={onNavigate}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm ${
            isHackathon ? 'bg-rose-50 text-rose-600 font-black' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          Hackathons 💻
        </Link>
        <Link
          href="/?category=COLLEGE_FEST"
          onClick={onNavigate}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm ${
            isFest ? 'bg-rose-50 text-rose-600 font-black' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          College Fests 🎪
        </Link>
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between ${
            isDashboard ? 'bg-rose-50 text-rose-600 font-black' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Saved Events</span>
          {bookmarkedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
              {bookmarkedCount}
            </span>
          )}
        </Link>
      </div>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-xs font-bold text-slate-600">
      <Link
        href="/"
        className={`px-3 py-2 rounded-xl transition-all ${
          isExplore
            ? 'text-rose-600 bg-rose-50/80 font-black shadow-sm'
            : 'hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        Explore Events
      </Link>

      <Link
        href="/?category=TECH_EVENT"
        className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${
          isTech
            ? 'text-rose-600 bg-rose-50/80 font-black shadow-sm'
            : 'hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <span>Tech Events ⚡</span>
      </Link>

      <Link
        href="/?category=HACKATHON"
        className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${
          isHackathon
            ? 'text-rose-600 bg-rose-50/80 font-black shadow-sm'
            : 'hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <span>Hackathons 💻</span>
      </Link>

      <Link
        href="/?category=COLLEGE_FEST"
        className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${
          isFest
            ? 'text-rose-600 bg-rose-50/80 font-black shadow-sm'
            : 'hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <span>College Fests 🎪</span>
      </Link>

      <Link
        href="/dashboard"
        className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
          isDashboard
            ? 'text-rose-600 bg-rose-50/80 font-black shadow-sm'
            : 'hover:text-slate-900 hover:bg-slate-50'
        }`}
      >
        <Bookmark className="w-3.5 h-3.5 text-rose-500" />
        <span>Saved Events</span>
        {bookmarkedCount > 0 && (
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-600 text-white">
            {bookmarkedCount}
          </span>
        )}
      </Link>
    </nav>
  );
};

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { bookmarkedIds } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <VentixeLogo size="md" />
          </Link>

          {/* Desktop Navigation Links (with search params support) */}
          <Suspense fallback={
            <nav className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="px-3 py-2">Explore Events</span>
              <span className="px-3 py-2">Hackathons 💻</span>
              <span className="px-3 py-2">College Fests 🎪</span>
            </nav>
          }>
            <NavLinksInner
              pathname={pathname}
              bookmarkedCount={bookmarkedIds.length}
            />
          </Suspense>

          {/* Right Action: Submit Event button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/submit-event"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-black text-white ventixe-gradient hover:opacity-95 shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit College Event</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/dashboard"
              className="p-2 text-slate-600 hover:text-rose-600 relative"
            >
              <Bookmark className="w-5 h-5 text-rose-500" />
              {bookmarkedIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] text-white flex items-center justify-center font-bold">
                  {bookmarkedIds.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-3">
          <Suspense fallback={null}>
            <NavLinksInner
              pathname={pathname}
              bookmarkedCount={bookmarkedIds.length}
              onNavigate={() => setMobileMenuOpen(false)}
              isMobile={true}
            />
          </Suspense>
          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/submit-event"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white ventixe-gradient shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit College Event</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
