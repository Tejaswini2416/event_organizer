'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Category, LocationType, EventSubmission, EventItem } from '@/types';
import { resolveRegistrationUrl } from '@/lib/urlUtils';
import { EventCard } from '@/components/EventCard';
import { 
  PlusCircle, 
  Sparkles, 
  Building2, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Trophy, 
  CheckCircle2, 
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Send,
  Eye,
  Check
} from 'lucide-react';

const SAMPLE_BANNERS = [
  { label: 'Campus Hackathon', url: '/events/google-campus.jpg' },
  { label: 'Robotics & AI Arena', url: '/events/tech-summit.jpg' },
  { label: 'Deep Learning Workshop', url: '/events/nvidia-deeplearning.jpg' },
  { label: 'Cloud & Tech Summit', url: '/events/microsoft-azure.jpg' },
  { label: 'College Fest Gala', url: '/events/culinary-gala.jpg' },
];

export default function SubmitEventPage() {
  const router = useRouter();
  const { submitEvent } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('HACKATHON');
  const [organizerName, setOrganizerName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [externalApplyUrl, setExternalApplyUrl] = useState('');
  const [selectedBanner, setSelectedBanner] = useState('/events/google-campus.jpg');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [locationType, setLocationType] = useState<LocationType>('VENUE');
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [entryFee, setEntryFee] = useState<number>(0);
  const [tagsInput, setTagsInput] = useState('Free Food 🍕, Certificates 📜, Beginner Friendly');
  const [eligibleMajorsInput, setEligibleMajorsInput] = useState('CS, IT, ECE, Open to All');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState<EventItem | null>(null);

  // Dynamic preview event item
  const previewEvent: EventItem = {
    id: 'evt-preview',
    title: title || 'Your College Hackathon / Fest Title',
    slug: 'preview-event',
    shortDescription: shortDescription || 'A brief summary of what students will build, learn, or compete for during this collegiate event.',
    fullDescription: fullDescription || 'Full description will appear here.',
    category,
    tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    locationType,
    venueName: venueName || (locationType === 'ONLINE' ? 'Virtual Sandbox' : `${collegeName || 'Campus'} Auditorium`),
    city: locationType === 'ONLINE' ? 'Online' : (city || 'Bengaluru'),
    country: 'India',
    startDate: startDate || new Date(Date.now() + 86400000 * 10).toISOString(),
    endDate: endDate || new Date(Date.now() + 86400000 * 12).toISOString(),
    registrationDeadline: registrationDeadline || new Date(Date.now() + 86400000 * 7).toISOString(),
    eligibleMajors: eligibleMajorsInput.split(',').map((m) => m.trim()).filter(Boolean),
    prizePool: prizePool || '₹2,00,000 Prize Pool',
    entryFee: Number(entryFee) || 0,
    organizerName: organizerName || collegeName || 'Student Club Organizing Team',
    externalApplyUrl: externalApplyUrl || 'https://unstop.com',
    bannerImageUrl: selectedBanner,
    isVerified: true,
    viewsCount: 1,
    createdAt: new Date().toISOString(),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !externalApplyUrl || !submitterEmail) return;

    setIsSubmitting(true);

    const submissionData: EventSubmission = {
      title: title.trim(),
      category,
      organizerName: organizerName.trim() || collegeName.trim() || 'Collegiate Organizing Committee',
      externalApplyUrl: resolveRegistrationUrl(externalApplyUrl.trim(), category),
      bannerImageUrl: selectedBanner,
      shortDescription: shortDescription.trim() || `Official ${category.toLowerCase().replace('_', ' ')} organized by ${organizerName || collegeName}.`,
      fullDescription: fullDescription.trim() || shortDescription.trim() || 'Full details available at the official portal.',
      locationType,
      venueName: venueName.trim() || (locationType === 'ONLINE' ? 'Online' : `${collegeName} Auditorium`),
      city: locationType === 'ONLINE' ? 'Online' : city.trim(),
      country: 'India',
      startDate: startDate ? new Date(startDate).toISOString() : new Date(Date.now() + 86400000 * 14).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : new Date(Date.now() + 86400000 * 15).toISOString(),
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline).toISOString() : undefined,
      eligibleMajors: eligibleMajorsInput.split(',').map((m) => m.trim()).filter(Boolean),
      prizePool: prizePool.trim() || undefined,
      entryFee: Number(entryFee) || 0.0,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      submitterEmail: submitterEmail.trim(),
      submitterName: submitterName.trim() || 'Club Lead',
      collegeName: collegeName.trim() || 'Engineering College',
    };

    const newEvt = submitEvent(submissionData);
    setSubmittedEvent(newEvt);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#f8f9fe]">
      
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
            <span>Back to Discovery Directory</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Submit Your College Event or Hackathon
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Are you a student club lead, fest convener, or campus ambassador? Index your event for thousands of student developers.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2 self-start sm:self-auto shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Free Public Student Indexing</span>
        </div>
      </div>

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Event Identity */}
          <div className="ventixe-card p-6 bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>1. Event Essentials</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeStorm Hackathon 2026 or Robomania IIT Fest"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Event Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500"
                  >
                    <option value="HACKATHON">HACKATHON 💻</option>
                    <option value="COLLEGE_FEST">COLLEGE FEST 🎪</option>
                    <option value="WORKSHOP">WORKSHOP 🛠️</option>
                    <option value="CONFERENCE">CONFERENCE 🎙️</option>
                    <option value="WEBINAR">WEBINAR 📡</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Official Apply / Register URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://unstop.com/hackathons or official portal"
                    value={externalApplyUrl}
                    onChange={(e) => setExternalApplyUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Organizing Club / Student Chapter
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ACM Student Chapter or GDG Campus"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    College / University Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIT-AP, IIT Kanpur, BITS Pilani"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Short Hook / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="One sentence describing what students will build or compete for..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Dates & Location */}
          <div className="ventixe-card p-6 bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <span>2. Timing &amp; Venue</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Location Type
                </label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value as LocationType)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-rose-500"
                >
                  <option value="VENUE">In-Person (VENUE)</option>
                  <option value="HYBRID">HYBRID</option>
                  <option value="ONLINE">ONLINE / VIRTUAL</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Kanpur, Amaravati"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Campus Auditorium / Hall 7"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Perks, Prize Pool & Student Submitter */}
          <div className="ventixe-card p-6 bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-rose-600" />
              <span>3. Prizes, Perks &amp; Submitter Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Prize Pool / Awards
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹5,00,000 or Swag Boxes + Trophies"
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Entry Fee (₹0 for Free)
                </label>
                <input
                  type="number"
                  min="0"
                  value={entryFee}
                  onChange={(e) => setEntryFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Free Food 🍕, Certificates 📜, AI/ML, Beginner Friendly"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Visual Banner
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {SAMPLE_BANNERS.map((banner) => (
                  <button
                    type="button"
                    key={banner.url}
                    onClick={() => setSelectedBanner(banner.url)}
                    className={`relative rounded-xl overflow-hidden border-2 text-left transition-all ${
                      selectedBanner === banner.url ? 'border-rose-600 ring-2 ring-rose-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={banner.url} alt={banner.label} className="w-full h-14 object-cover" />
                    <span className="p-1 text-[10px] font-bold text-slate-700 block truncate bg-white">
                      {banner.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your Name (Club Lead / Ambassador) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Your College / Club Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@vitstudent.ac.in"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-black text-sm text-white ventixe-gradient hover:opacity-95 shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Indexing Your Event...' : 'Submit & Index College Event'}</span>
          </button>
        </form>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-28 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-700">
                <Eye className="w-3.5 h-3.5 text-rose-500" />
                <span>Live Event Card Preview</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Real-Time Render
              </span>
            </div>

            <div className="pointer-events-none">
              <EventCard event={previewEvent} viewMode="grid" />
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 space-y-1.5">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>How verification works:</span>
              </span>
              <p className="text-[11px] leading-relaxed">
                Submitted events are published immediately in your local directory for preview. Our automated crawler verifies your official application URL within 15 minutes before global syndication.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Success Dialog Modal */}
      {submittedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">
                Event Successfully Indexed!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                <span className="font-bold text-slate-800">{submittedEvent.title}</span> has been indexed on Ventixe. Students can now discover your event and apply directly via your official portal.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/events/${submittedEvent.slug || submittedEvent.id}`}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs text-white ventixe-gradient shadow-md"
              >
                View Live Event Page
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800"
              >
                Go to Discovery Feed
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
