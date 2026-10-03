'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { EventItem, TicketTier, EventFormat } from '@/types';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Ticket, 
  Building2, 
  CheckCircle2, 
  Plus, 
  Trash2,
  GraduationCap,
  Award
} from 'lucide-react';

const SAMPLE_BANNERS = [
  { label: 'Google Campus Hackathon', url: '/events/google-campus.jpg' },
  { label: 'Microsoft Azure Summit', url: '/events/microsoft-azure.jpg' },
  { label: 'Meta Reality Labs & AI', url: '/events/meta-ai.jpg' },
  { label: 'NVIDIA DLI Masterclass', url: '/events/nvidia-deeplearning.jpg' },
  { label: 'Amazon AWS Cloud Bootcamp', url: '/events/tech-summit.jpg' },
  { label: 'Apple Swift Challenge', url: '/events/design-workshop.jpg' },
];

export default function CreateEventPage() {
  const router = useRouter();
  const { addEvent } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState<any>('Google');
  const [category, setCategory] = useState<any>('HACKATHON');
  const [format, setFormat] = useState<any>('hybrid');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [studentPerks, setStudentPerks] = useState('Direct SWE Interview Fast-Track, $500 Cloud Credits, Free Swag Kit');
  const [eligibility, setEligibility] = useState('All currently enrolled undergraduate & graduate college students.');
  const [tags, setTags] = useState('Hackathon, Google, AI, Collegiate, Free Pass');

  // Step 2: Date & Venue
  const [startDate, setStartDate] = useState('2026-11-25T09:00');
  const [endDate, setEndDate] = useState('2026-11-26T18:00');
  const [venueName, setVenueName] = useState('Google Tech Campus & Live Stream');
  const [venueAddress, setVenueAddress] = useState('1600 Amphitheatre Pkwy');
  const [city, setCity] = useState('Mountain View, CA');

  // Step 3: Ticket Tiers
  const [ticketTiers, setTicketTiers] = useState<Array<{
    name: string;
    price: number;
    capacity: number;
    description: string;
    perks: string;
  }>>([
    {
      name: 'Free Student Pass (.edu verified)',
      price: 0,
      capacity: 500,
      description: 'Free collegiate access. Includes full hackathon track, cloud credits, and recruiter meetings.',
      perks: 'Full Event Entry, Cloud Credits, Recruiter Fast-Track, Lunch Included',
    },
    {
      name: 'Student Team Pass (2-4 Members)',
      price: 0,
      capacity: 100,
      description: 'Group registration with reserved collaborative workspace and hardware kits.',
      perks: 'Reserved Team Table, Dedicated Mentor, Priority Presentation Slot',
    },
  ]);

  // Step 4: Media & Organizer
  const [selectedBanner, setSelectedBanner] = useState('/events/google-campus.jpg');
  const [organizerName, setOrganizerName] = useState('Google University Talent & DevRel');
  const [organizerBio, setOrganizerBio] = useState('Empowering collegiate computer scientists through open challenges.');
  const [refundPolicy, setRefundPolicy] = useState('100% Free collegiate pass with university verification.');

  const handleAddTier = () => {
    setTicketTiers((prev) => [
      ...prev,
      {
        name: 'VIP Student Scholar Pass',
        price: 20,
        capacity: 50,
        description: 'Includes 1-on-1 resume critique with hiring managers.',
        perks: 'Mock Technical Interview, Private Q&A Lunch',
      },
    ]);
  };

  const handleRemoveTier = (index: number) => {
    if (ticketTiers.length <= 1) return;
    setTicketTiers((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublishEvent = () => {
    const formattedTiers: TicketTier[] = ticketTiers.map((t, idx) => ({
      id: `tier-new-${Date.now()}-${idx}`,
      eventId: '',
      name: t.name,
      price: Number(t.price),
      capacity: Number(t.capacity),
      remainingCapacity: Number(t.capacity),
      description: t.description,
      perks: t.perks.split(',').map((p) => p.trim()).filter(Boolean),
      isStudentOnly: Number(t.price) === 0,
    }));

    const newEvt = addEvent({
      title: title || `${company} Campus Challenge 2026`,
      summary: summary || `Official collegiate event hosted by ${company} featuring hands-on challenges and recruiter networking.`,
      description: description || `Join ${company} engineers and university recruiters for an intensive learning and career development experience.`,
      category,
      company,
      format,
      locationType: format === 'virtual' ? 'ONLINE' : 'VENUE',
      status: 'PUBLISHED',
      bannerUrl: selectedBanner,
      venueName: venueName || 'MNC Tech Campus',
      venueAddress: venueAddress || '100 Silicon Way',
      city: city || 'San Francisco, CA',
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      totalCapacity: formattedTiers.reduce((acc: number, t: TicketTier) => acc + (t.capacity || 0), 0) || 500,
      ticketsSold: 0,
      isCampusOnly: false,
      isFreeFood: true,
      hasCertificate: true,
      isFeatured: false,
      isStudentFocused: true,
      internshipEligible: true,
      studentPerks: studentPerks.split(',').map((p) => p.trim()).filter(Boolean),
      eligibility,
      organizer: {
        id: `org-${Date.now()}`,
        name: organizerName,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        bio: organizerBio,
        verified: true,
        eventsHosted: 1,
        rating: 5.0,
        company,
      },
      ticketTiers: formattedTiers,
      agenda: [
        {
          id: 'ag-new-1',
          time: '09:00 AM - 10:30 AM',
          title: 'Opening Ceremony & Keynote Address',
          description: 'Mission briefing and track unveiling.',
        },
        {
          id: 'ag-new-2',
          time: '11:00 AM - 01:00 PM',
          title: 'Student Hackathon & Recruiter Booths',
          description: 'Interactive workshops and portfolio reviews.',
        },
      ],
      speakers: [],
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      refundPolicy,
    });

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#db2777', '#8b5cf6'],
    });

    router.push(`/events/${newEvt.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#f8f9fe]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <Link
            href="/organizer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-1 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
            <span>Cancel &amp; Return to Ventixe Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Host New Collegiate Event
          </h1>
        </div>

        <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          Step {currentStep} of 5
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-semibold">
        {[
          { num: 1, label: 'Company & Basics' },
          { num: 2, label: 'Location' },
          { num: 3, label: 'Student Passes' },
          { num: 4, label: 'Media' },
          { num: 5, label: 'Launch' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setCurrentStep(s.num)}
            className={`p-2.5 rounded-2xl border transition-all ${
              currentStep === s.num
                ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold shadow-sm'
                : currentStep > s.num
                ? 'bg-white border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-200/80 text-slate-400'
            }`}
          >
            <span className="block">{s.num}. {s.label}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: GENERAL DETAILS */}
      {currentStep === 1 && (
        <div className="ventixe-card p-6 sm:p-8 space-y-5 bg-white shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Event Host &amp; Classification</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  MNC Host Organization *
                </label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-500"
                >
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Meta">Meta</option>
                  <option value="NVIDIA">NVIDIA</option>
                  <option value="Amazon AWS">Amazon AWS</option>
                  <option value="Apple">Apple</option>
                  <option value="Goldman Sachs">Goldman Sachs</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Global Community">Global Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Student Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-500"
                >
                  <option value="Tech & Hackathons">Tech &amp; Hackathons</option>
                  <option value="Career & Internships">Career &amp; Internships</option>
                  <option value="AI & Cloud">AI &amp; Cloud</option>
                  <option value="Workshops & Certs">Workshops &amp; Certs</option>
                  <option value="Student Competitions">Student Competitions</option>
                  <option value="Fintech & Quant">Fintech &amp; Quant</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Google Cloud & Vertex AI Campus Hackathon"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Student Perks (Comma separated)
              </label>
              <input
                type="text"
                placeholder="SWE Interview Fast-Track, $500 Cloud Credits, Free Swag Kit"
                value={studentPerks}
                onChange={(e) => setStudentPerks(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Collegiate Eligibility
              </label>
              <input
                type="text"
                placeholder="Open to all currently enrolled college students"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Description
              </label>
              <textarea
                rows={4}
                placeholder="Detailed student curriculum, recruiter schedule, prizes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white ventixe-gradient flex items-center gap-1.5 shadow-md shadow-rose-500/20"
            >
              <span>Next: Date &amp; Location</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & VENUE */}
      {currentStep === 2 && (
        <div className="ventixe-card p-6 sm:p-8 space-y-5 bg-white shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Date, Timings &amp; Campus Location</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Start Timestamp
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                End Timestamp
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Campus / Auditorium Name
              </label>
              <input
                type="text"
                placeholder="Google Tech Campus Bay View"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="2000 N Shoreline Blvd"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  City, State
                </label>
                <input
                  type="text"
                  placeholder="Mountain View, CA"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white ventixe-gradient flex items-center gap-1.5 shadow-md shadow-rose-500/20"
            >
              <span>Next: Student Passes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TICKET TIERS */}
      {currentStep === 3 && (
        <div className="ventixe-card p-6 sm:p-8 space-y-6 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Define Student Pass Tiers</h3>
              <p className="text-xs text-slate-400">Offer free student tickets with .edu identification.</p>
            </div>
            <button
              type="button"
              onClick={handleAddTier}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pass Tier</span>
            </button>
          </div>

          <div className="space-y-4">
            {ticketTiers.map((tier, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-600 uppercase">
                    Tier #{idx + 1}
                  </span>
                  {ticketTiers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pass Name</label>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTicketTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, name: val } : t)));
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Price ($0 for Free)</label>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTicketTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, price: val } : t)));
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Seat Capacity</label>
                    <input
                      type="number"
                      value={tier.capacity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTicketTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, capacity: val } : t)));
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Pass Perks (Comma separated)</label>
                  <input
                    type="text"
                    value={tier.perks}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTicketTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, perks: val } : t)));
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white ventixe-gradient flex items-center gap-1.5 shadow-md shadow-rose-500/20"
            >
              <span>Next: Media &amp; Host</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MEDIA & HOST */}
      {currentStep === 4 && (
        <div className="ventixe-card p-6 sm:p-8 space-y-6 bg-white shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Media &amp; Host Identity</h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Select Curated MNC Event Banner
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SAMPLE_BANNERS.map((b) => (
                <div
                  key={b.url}
                  onClick={() => setSelectedBanner(b.url)}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedBanner === b.url
                      ? 'border-rose-500 scale-[1.02] shadow-md shadow-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={b.url} alt={b.label} className="w-full aspect-video object-cover" />
                  <p className="text-[10px] text-center p-2 font-bold text-slate-800 truncate bg-slate-50">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Host Organization Name
              </label>
              <input
                type="text"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Student Admission Policy Note
              </label>
              <input
                type="text"
                value={refundPolicy}
                onChange={(e) => setRefundPolicy(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white ventixe-gradient flex items-center gap-1.5 shadow-md shadow-rose-500/20"
            >
              <span>Next: Review &amp; Launch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & PUBLISH */}
      {currentStep === 5 && (
        <div className="ventixe-card p-6 sm:p-8 space-y-6 bg-white shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
              Pre-Flight Review
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              Ready to Publish Your Collegiate Event
            </h3>
          </div>

          {/* Live Card Preview */}
          <div className="max-w-md mx-auto rounded-3xl ventixe-card overflow-hidden border border-rose-200 shadow-xl p-4 space-y-3 bg-white">
            <img src={selectedBanner} alt="Preview" className="w-full aspect-video object-cover rounded-2xl" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                {company} • {category}
              </span>
              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {title || `${company} Campus Innovation Challenge`}
              </h4>
              <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{venueName}, {city}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">{ticketTiers.length} Pass Tiers</span>
              <span className="text-rose-600">Free Student Admission</span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200"
            >
              Back
            </button>
            <button
              onClick={handlePublishEvent}
              className="px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm text-white ventixe-gradient hover:opacity-95 shadow-xl shadow-rose-500/30 flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Event &amp; Open Student Passes</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
