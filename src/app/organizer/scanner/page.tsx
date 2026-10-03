'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QRScannerModal } from '@/components/QRScannerModal';
import { ArrowLeft, ScanLine, ShieldCheck, Radio, GraduationCap } from 'lucide-react';

export default function OrganizerScannerPage() {
  const [activeGate, setActiveGate] = useState('Gate 1 - Google Campus Concourse');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#f8f9fe]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <Link
            href="/organizer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-2 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
            <span>Back to Ventixe Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ScanLine className="w-8 h-8 text-rose-600" />
              <span>Gate Access Scanner</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Scan attendee student QR passes or enter ticket codes to validate admission and prevent duplicate fraud.
          </p>
        </div>

        {/* Gate Selector */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse ml-2" />
          <select
            value={activeGate}
            onChange={(e) => setActiveGate(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none pr-3"
          >
            <option value="Gate 1 - Google Campus Concourse">Gate 1 - Google Campus Concourse</option>
            <option value="Gate 2 - Microsoft Silicon Valley">Gate 2 - Microsoft Silicon Valley</option>
            <option value="Gate 3 - Meta MPK Reality Lab">Gate 3 - Meta MPK Reality Lab</option>
            <option value="Gate 4 - NVIDIA CUDA Pavilion">Gate 4 - NVIDIA CUDA Pavilion</option>
          </select>
        </div>
      </div>

      {/* Embedded Scanner Tool */}
      <QRScannerModal />

      {/* Security notice */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-500 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-rose-500" />
          <span>Real-time Anti-Duplication Security • Connected to Supabase atbrmfzhfcxprznnmoap.supabase.co</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
          SYNC ACTIVE
        </span>
      </div>

    </div>
  );
}
