'use client';

import React from 'react';
import Link from 'next/link';
import { VentixeLogo } from '@/components/Navbar';
import { Sparkles, ShieldCheck, Database, Zap, Building2, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-500 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <VentixeLogo size="sm" />
            <p className="text-xs text-slate-500 leading-relaxed pt-2">
              The premier collegiate event management &amp; career discovery platform connecting ambitious students with Google, Microsoft, Meta, NVIDIA, Amazon, Apple, Goldman Sachs &amp; Tesla.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Connected
              </span>
            </div>
          </div>

          {/* Student Hub */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Student Scholars
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-rose-600 transition-colors">
                  Browse MNC Hackathons
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-rose-600 transition-colors">
                  My Student Passes &amp; QR Wallet
                </Link>
              </li>
              <li>
                <Link href="/#events" className="hover:text-rose-600 transition-colors">
                  Internship Fast-Tracks
                </Link>
              </li>
              <li>
                <Link href="/#events" className="hover:text-rose-600 transition-colors">
                  Free Certification Vouchers
                </Link>
              </li>
            </ul>
          </div>

          {/* Ventixe Admin Suite */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Ventixe Admin
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/organizer" className="hover:text-rose-600 transition-colors font-semibold text-rose-600">
                  Ventixe Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/organizer/create" className="hover:text-rose-600 transition-colors">
                  Host New Student Event
                </Link>
              </li>
              <li>
                <Link href="/organizer/scanner" className="hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Gate Scanner
                </Link>
              </li>
              <li>
                <Link href="/organizer" className="hover:text-rose-600 transition-colors">
                  Attendee Roster &amp; Export CSV
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Credentials */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              MNC Partner Ecosystem
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-600">
              {['Google', 'Microsoft', 'Meta', 'NVIDIA', 'Amazon AWS', 'Apple', 'Goldman Sachs', 'Tesla'].map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500">
              <p className="font-bold text-slate-700">Supabase Connected</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">atbrmfzhfcxprznnmoap.supabase.co</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Ventixe Event Management. Designed for university innovators.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-slate-600 cursor-pointer">Student Guidelines</span>
            <span className="hover:text-slate-600 cursor-pointer">Privacy &amp; Data Security</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
