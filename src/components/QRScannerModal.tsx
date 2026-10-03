'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Ticket } from '@/types';
import { 
  ScanLine, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  Search,
  GraduationCap,
  Building2,
  Zap
} from 'lucide-react';

interface QRScannerModalProps {
  onCheckInCompleted?: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onCheckInCompleted }) => {
  const { tickets, validateAndCheckInTicket } = useApp();
  
  const [manualCode, setManualCode] = useState('');
  const [lastResult, setLastResult] = useState<{
    status: 'idle' | 'success' | 'duplicate' | 'error';
    message: string;
    ticket?: Ticket;
  }>({
    status: 'idle',
    message: 'Position student QR code pass in front of camera or enter pass code below.',
  });

  const [scanHistory, setScanHistory] = useState<Array<{
    code: string;
    status: 'success' | 'duplicate' | 'error';
    time: string;
    name?: string;
  }>>([]);

  const handleValidate = (codeToTest: string) => {
    if (!codeToTest.trim()) return;

    const res = validateAndCheckInTicket(codeToTest);
    const nowTime = new Date().toLocaleTimeString();

    if (res.success) {
      setLastResult({
        status: 'success',
        message: res.message,
        ticket: res.ticket,
      });
      setScanHistory((prev) => [
        { code: codeToTest, status: 'success', time: nowTime, name: res.ticket?.attendeeName },
        ...prev.slice(0, 9),
      ]);
    } else {
      const isDuplicate = res.message.includes('ALREADY CHECKED IN');
      setLastResult({
        status: isDuplicate ? 'duplicate' : 'error',
        message: res.message,
        ticket: res.ticket,
      });
      setScanHistory((prev) => [
        { code: codeToTest, status: isDuplicate ? 'duplicate' : 'error', time: nowTime, name: res.ticket?.attendeeName },
        ...prev.slice(0, 9),
      ]);
    }

    if (onCheckInCompleted) onCheckInCompleted();
  };

  const totalValidTickets = tickets.filter((t: any) => t.status === 'valid').length;
  const totalCheckedIn = tickets.filter((t: any) => t.status === 'checked_in').length;

  return (
    <div className="space-y-6">
      {/* Scanner Screen Viewport */}
      <div className="relative w-full max-w-xl mx-auto rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-xl p-6">
        
        {/* Top Camera Status Bar */}
        <div className="flex items-center justify-between text-xs pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
              Ventixe Gate Optical Sensor Active
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Camera className="w-3.5 h-3.5" />
            <span className="text-[11px]">1080p 60fps</span>
          </div>
        </div>

        {/* Viewfinder simulation */}
        <div className="relative my-6 aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden group shadow-inner">
          
          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Scanner Reticle target frame */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 border-2 border-dashed border-rose-400/70 rounded-2xl flex items-center justify-center">
            {/* Corner accents */}
            <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-4 border-l-4 border-rose-500 rounded-tl-lg" />
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-4 border-r-4 border-rose-500 rounded-tr-lg" />
            <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-4 border-l-4 border-rose-500 rounded-bl-lg" />
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-4 border-r-4 border-rose-500 rounded-br-lg" />

            {/* Glowing laser scanning beam */}
            <div className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] laser-beam" />

            <div className="text-center p-4 text-slate-400">
              <ScanLine className="w-10 h-10 text-rose-400 mx-auto opacity-80 animate-pulse mb-2" />
              <p className="text-[11px] font-mono text-rose-200">Align Student QR Code Inside Box</p>
            </div>
          </div>

          <div className="absolute bottom-3 text-center text-[10px] text-slate-500 font-mono">
            Optical QR Sensor • Automatic Duplicate Admission Lock
          </div>
        </div>

        {/* Live Result Status Banner */}
        <div className={`p-4 rounded-2xl border transition-all duration-300 ${
          lastResult.status === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : lastResult.status === 'duplicate'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : lastResult.status === 'error'
            ? 'bg-rose-50 border-rose-300 text-rose-900'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-start gap-3">
            {lastResult.status === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />}
            {lastResult.status === 'duplicate' && <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />}
            {lastResult.status === 'error' && <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />}
            {lastResult.status === 'idle' && <Zap className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                {lastResult.status === 'success' && 'ACCESS GRANTED'}
                {lastResult.status === 'duplicate' && 'ENTRY DENIED (DUPLICATE PASS)'}
                {lastResult.status === 'error' && 'INVALID TICKET TOKEN'}
                {lastResult.status === 'idle' && 'READY FOR ATTENDEE SCAN'}
              </h4>
              <p className="text-xs mt-1 leading-relaxed">{lastResult.message}</p>

              {lastResult.ticket && (
                <div className="mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Student Name</span>
                    <strong className="text-slate-900">{lastResult.ticket.attendeeName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Pass Tier</span>
                    <strong className="text-rose-600">{lastResult.ticket.ticketTierName}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manual Code Entry & Test Simulation Actions */}
        <div className="mt-6 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleValidate(manualCode);
              setManualCode('');
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter Student Pass Code (e.g. VTX-8492-STU)"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 uppercase focus:outline-none focus:border-rose-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white ventixe-gradient hover:opacity-95 shadow-md shadow-rose-500/20"
            >
              Verify Pass
            </button>
          </form>

          {/* Quick Simulation Shortcuts */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              1-Click Pass Simulation (Test with registered student tickets):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tickets.slice(0, 2).map((t: any) => (
                <button
                  key={t.id}
                  onClick={() => handleValidate(t.ticketCode)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition-colors"
                >
                  <div className="truncate">
                    <span className="font-mono text-rose-600 font-bold">{t.ticketCode}</span>
                    <span className="text-slate-500 block text-[10px] truncate">{t.attendeeName} ({t.studentCollege || 'Student'})</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 shrink-0 ${
                    t.status === 'checked_in'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {t.status === 'checked_in' ? 'Scanned' : 'Valid'}
                  </span>
                </button>
              ))}
              <button
                onClick={() => handleValidate('FAKE-PASS-9999')}
                className="p-2.5 rounded-xl text-left bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs text-rose-700 transition-colors flex items-center justify-between"
              >
                <span>Test Fake / Counterfeit Code</span>
                <span className="text-[10px] font-mono bg-rose-200 px-2 py-0.5 rounded-full font-bold">Error Test</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Metrics under scanner */}
      <div className="max-w-xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="ventixe-card p-4 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Checked In Today</span>
          <span className="text-2xl font-black text-emerald-600">{totalCheckedIn}</span>
        </div>
        <div className="ventixe-card p-4 rounded-2xl text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Entry</span>
          <span className="text-2xl font-black text-rose-600">{totalValidTickets}</span>
        </div>
        <div className="ventixe-card p-4 rounded-2xl text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gate Status</span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block mt-1">
            Online &amp; Locked
          </span>
        </div>
      </div>

      {/* Gate Log */}
      {scanHistory.length > 0 && (
        <div className="max-w-xl mx-auto ventixe-card p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Live Gate Admission Log
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {scanHistory.map((h, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    h.status === 'success' ? 'bg-emerald-500' : h.status === 'duplicate' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  <span className="font-mono font-bold text-slate-800">{h.code}</span>
                  {h.name && <span className="text-slate-500">({h.name})</span>}
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
                  <span>{h.time}</span>
                  <span className={`uppercase font-bold text-[10px] ${
                    h.status === 'success' ? 'text-emerald-700' : h.status === 'duplicate' ? 'text-amber-700' : 'text-rose-700'
                  }`}>
                    {h.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
