export type Category = 
  | 'HACKATHON' 
  | 'COLLEGE_FEST'
  | 'TECH_EVENT'
  | 'CONFERENCE' 
  | 'WORKSHOP' 
  | 'WEBINAR' 
  | 'Tech & Hackathons'
  | 'Career & Internships'
  | 'AI & Cloud'
  | 'Workshops & Certs'
  | 'Student Competitions'
  | 'Design & Creative'
  | 'Fintech & Quant';

export type LocationType = 'VENUE' | 'HYBRID' | 'ONLINE';
export type EventFormat = 'in_person' | 'virtual' | 'hybrid';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED' | 'draft' | 'published' | 'cancelled' | 'completed';
export type TicketStatus = 'valid' | 'checked_in' | 'cancelled';
export type UserRole = 'student' | 'attendee' | 'organizer' | 'admin';
export type LifecycleStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';
export type AvailabilityStatus = 'AVAILABLE' | 'SOLD_OUT';

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  price: number;
  capacity: number;
  remainingCapacity: number;
  description: string;
  perks: string[];
  isStudentOnly?: boolean;
}

export interface Ticket {
  id: string;
  ticketCode: string;
  orderId: string;
  eventId: string;
  eventTitle: string;
  eventBanner: string;
  eventStartDate: string;
  eventEndDate: string;
  venueName: string;
  venueAddress: string;
  ticketTierId: string;
  ticketTierName: string;
  attendeeName: string;
  attendeeEmail: string;
  studentCollege?: string;
  studentIdNumber?: string;
  pricePaid: number;
  qrToken: string;
  status: TicketStatus;
  checkedInAt?: string;
  purchasedAt: string;
}

export interface Order {
  id: string;
  eventId: string;
  eventTitle: string;
  customerName: string;
  customerEmail: string;
  studentCollege?: string;
  ticketsCount: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'refunded';
  createdAt: string;
  ticketIds: string[];
}

export interface OrganizerProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  verified: boolean;
  eventsHosted: number;
  rating: number;
  company?: string;
}

export interface EventSpeaker {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
}

export interface EventReview {
  id: string;
  eventId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  studentCollege?: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: Category;
  tags: string[]; // e.g. ["AI/ML", "Web3", "Free Food 🍕", "Certificates 📜", "Beginner Friendly"]
  
  // Location & Venue Details
  locationType: LocationType;
  venueName?: string;
  venueAddress?: string;
  city?: string;
  country: string;
  
  // Timing & Schedule
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  registrationDeadline?: string | null;

  // Eligibility & Perks
  eligibleMajors: string[]; // ["CS", "IT", "ECE", "Open to All"]
  prizePool?: string | null; // e.g. "₹45,00,000" or "Swag Boxes"
  entryFee: number; // 0 for Free events
  
  // External Redirection
  organizerName: string; // e.g. "Google Developer Group", "Techkriti", "Nasscom"
  externalApplyUrl: string; // Official event registration link
  externalSourceUrl?: string; // Link if synced from Devpost/Eventbrite
  externalSourceName?: string;
  bannerImageUrl: string;
  
  // Verification & Metadata
  isVerified: boolean;
  viewsCount: number;
  createdAt: string;

  // Compatibility fields
  summary?: string;
  description?: string;
  bannerUrl?: string;
  company?: string;
  format?: EventFormat;
  status?: EventStatus;
  totalCapacity?: number;
  ticketsSold?: number;
  isCampusOnly?: boolean;
  isFreeFood?: boolean;
  hasCertificate?: boolean;
  isFeatured?: boolean;
  isStudentFocused?: boolean;
  internshipEligible?: boolean;
  studentPerks?: string[];
  eligibility?: string;
  refundPolicy?: string;
  ticketTiers?: TicketTier[];
  agenda?: any[];
  speakers?: EventSpeaker[];
  reviews?: EventReview[];
  rating?: number;
  reviewCount?: number;
  organizer?: OrganizerProfile;
}

export interface Bookmark {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  event?: EventItem;
}

export interface EventSubmission {
  id?: string;
  title: string;
  category: Category;
  organizerName: string;
  externalApplyUrl: string;
  bannerImageUrl: string;
  shortDescription: string;
  fullDescription: string;
  locationType: LocationType;
  venueName?: string;
  city?: string;
  country?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  eligibleMajors: string[];
  prizePool?: string;
  entryFee: number;
  tags: string[];
  submitterEmail: string;
  submitterName: string;
  collegeName: string;
  createdAt?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SearchFilters {
  q?: string;
  city?: string;
  category?: Category | 'ALL';
  price?: 'all' | 'free' | 'paid';
  tags?: string[];
  locationType?: LocationType | 'ALL';
  major?: string;
}
