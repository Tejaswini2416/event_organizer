'use client';

import React, { useState } from 'react';
import { EventItem, TicketTier, Ticket } from '@/types';
import { useApp } from '@/context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Ticket as TicketIcon, 
  Calendar, 
  MapPin, 
  ArrowRight,
  GraduationCap,
  Building2,
  Tag,
  Award
} from 'lucide-react';
import Link from 'next/link';

interface TicketCheckoutModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  selectedTierId?: string;
}

export const TicketCheckoutModal: React.FC<TicketCheckoutModalProps> = ({
  event,
  isOpen,
  onClose,
  selectedTierId,
}) => {
  const { bookTickets } = useApp();

  const tiers = event.ticketTiers || [];
  const [activeTierId, setActiveTierId] = useState<string>(
    selectedTierId || tiers[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('Tejaswini Sharma');
  const [email, setEmail] = useState<string>('tejaswini@student.edu');
  const [collegeName, setCollegeName] = useState<string>('University Institute of Technology');
  const [studentId, setStudentId] = useState<string>('STU-2026-8812');
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedTickets, setCompletedTickets] = useState<Ticket[] | null>(null);

  if (!isOpen) return null;

  const currentTier = tiers.find((t: any) => t.id === activeTierId) || tiers[0];

  const subtotal = (currentTier?.price || 0) * quantity;
  const discount = appliedPromo ? (subtotal * appliedPromo.percent) / 100 : 0;
  const platformFee = subtotal > 0 ? 3.0 : 0;
  const total = Math.max(0, subtotal - discount + platformFee);
  const isFree = total === 0;

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'STUDENT100') {
      setAppliedPromo({ code, percent: 100 });
    } else if (code === 'EARLYBIRD20') {
      setAppliedPromo({ code, percent: 20 });
    } else if (code === 'VENTIXEVIP') {
      setAppliedPromo({ code, percent: 30 });
    } else {
      setPromoError('Invalid promo code. Try: STUDENT100 or EARLYBIRD20');
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTier) return;

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const result = bookTickets({
          eventId: event.id,
          ticketTierId: currentTier.id,
          quantity,
          customerName: fullName,
          customerEmail: email,
          studentCollege: collegeName,
          studentIdNumber: studentId,
          promoCode: appliedPromo?.code,
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#db2777', '#8b5cf6', '#06b6d4'],
        });

        setCompletedTickets(result.newTickets);
      } catch (err: any) {
        alert(err.message || 'Registration failed');
      } finally {
        setIsProcessing(false);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 my-8 border border-slate-200/80 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!completedTickets ? (
          <div>
            {/* Header */}
            <div className="border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {event.company} Official Event
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  Collegiate Pass Issuance
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                {event.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  {new Date(event.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {event.venueName}
                </span>
              </div>
            </div>

            <form onSubmit={handleCompleteRegistration} className="space-y-6">
              {/* Step 1: Select Tier */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Select Admission Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tiers.map((tier: any) => {
                    const isSelected = tier.id === activeTierId;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setActiveTierId(tier.id)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                          isSelected
                            ? 'bg-rose-50/70 border-rose-500 shadow-sm'
                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{tier.name}</h4>
                          <span className="text-sm sm:text-base font-black text-rose-600">
                            {tier.price === 0 ? 'FREE' : `$${tier.price}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {tier.description}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100 font-semibold">
                          <span>Seats remaining</span>
                          <span className="text-slate-700">{tier.remainingCapacity} passes</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Student Collegiate Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-rose-500"
                    placeholder="Tejaswini Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    College / University Email (.edu preferred) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-rose-500"
                    placeholder="student@university.edu"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    University / College Institution
                  </label>
                  <input
                    type="text"
                    required
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-rose-500"
                    placeholder="e.g. Stanford University / IIT"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Student ID / Enrollment Number
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-rose-500"
                    placeholder="STU-2026-8812"
                  />
                </div>
              </div>

              {/* Promo Code Input if paid tier */}
              {!isFree && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        placeholder="Voucher Code (e.g. STUDENT100 or EARLYBIRD20)"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 uppercase focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-xs text-emerald-600 mt-2 font-semibold">
                      Discount applied: {appliedPromo.percent}% OFF
                    </p>
                  )}
                  {promoError && (
                    <p className="text-xs text-rose-500 mt-2 font-medium">{promoError}</p>
                  )}
                </div>
              )}

              {/* Order summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex justify-between">
                  <span>{currentTier?.name} x {quantity}</span>
                  <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Scholarship Discount ({appliedPromo.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Amount Due</span>
                  <span className="text-rose-600 text-base font-black">
                    {total === 0 ? 'FREE ($0.00)' : `$${total.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Free Student Pass Confirmation Banner */}
              {isFree ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No payment required! Your student verification credentials will issue your digital QR pass instantly.</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-rose-500" />
                    <span>Mock Stripe Checkout (Test Card 4242)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600">256-Bit SSL</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm text-white ventixe-gradient hover:opacity-95 shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials &amp; Minting QR Pass...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isFree ? 'Claim Free Student Pass & Mint QR' : `Pay $${total.toFixed(2)} & Issue Pass`}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Display */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Student Pass Verified &amp; Minted
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                You’re Going to {event.title}!
              </h2>
              <p className="text-xs text-slate-500 mt-1.5">
                We sent your confirmed gate pass to <strong className="text-slate-800">{email}</strong>.
              </p>
            </div>

            {/* Generated QR Pass Preview */}
            {completedTickets[0] && (
              <div className="max-w-sm mx-auto ventixe-card p-5 border-2 border-rose-200 shadow-xl space-y-4 text-left bg-gradient-to-b from-white to-rose-50/20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block">
                      Ventixe Collegiate Pass
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{completedTickets[0].ticketTierName}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    {completedTickets[0].ticketCode}
                  </span>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mx-auto w-fit">
                  <QRCodeSVG
                    value={completedTickets[0].qrToken}
                    size={150}
                    level="H"
                    includeMargin={false}
                  />
                  <span className="text-[10px] font-mono text-slate-600 mt-1.5 font-bold">
                    {completedTickets[0].ticketCode}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong className="text-slate-800">Student:</strong> {completedTickets[0].attendeeName}</p>
                  <p><strong className="text-slate-800">Institution:</strong> {completedTickets[0].studentCollege}</p>
                  <p><strong className="text-slate-800">Venue:</strong> {completedTickets[0].venueName}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white ventixe-gradient hover:opacity-95 shadow-md shadow-rose-500/20 flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>View in Student Pass Wallet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-2xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
