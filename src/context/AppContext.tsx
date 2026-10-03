'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EventItem, Bookmark, EventSubmission, Ticket, Order, UserRole, EventReview } from '@/types';
import { INITIAL_DISCOVERY_EVENTS } from '@/lib/mockData';
import { resolveRegistrationUrl } from '@/lib/urlUtils';

import { supabase } from '@/lib/supabase';

interface CheckInResult {
  success: boolean;
  message: string;
  ticket?: Ticket;
}

interface AppContextType {
  events: EventItem[];
  bookmarkedIds: string[];
  recentViewIds: string[];
  submissions: EventSubmission[];
  lastSyncTime: Date;
  isLiveSyncing: boolean;
  syncEventsNow: () => Promise<void>;
  toggleBookmark: (eventId: string) => void;
  isBookmarked: (eventId: string) => boolean;
  addRecentView: (eventId: string) => void;
  submitEvent: (submission: EventSubmission) => EventItem;
  getEventBySlugOrId: (identifier: string) => EventItem | undefined;
  
  // Compatibility helpers & legacy stubs
  tickets: Ticket[];
  orders: Order[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  toggleRole: () => void;
  savedEventIds: string[];
  toggleSaveEvent: (eventId: string) => void;
  isEventSaved: (eventId: string) => boolean;
  addEvent: (event: any) => EventItem;
  updateEvent: (event: EventItem) => void;
  deleteEvent: (eventId: string) => void;
  bookTickets: (data: any) => { order: Order; newTickets: Ticket[] };
  validateAndCheckInTicket: (codeOrToken: string) => CheckInResult;
  addReview: (eventId: string, review: any) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENTS: 'ventixe_discovery_events_v7',
  BOOKMARKS: 'ventixe_discovery_bookmarks_v7',
  RECENT_VIEWS: 'ventixe_recent_views_v7',
  SUBMISSIONS: 'ventixe_event_submissions_v7',
};

// Helper: Check and dynamically flip expired event deadlines
const checkAndCloseExpiredEvents = (currentList: EventItem[]): EventItem[] => {
  const nowTime = Date.now();
  let changed = false;
  const updated: EventItem[] = currentList.map((evt) => {
    if (evt.status !== 'COMPLETED' && evt.status !== 'CANCELLED' && evt.registrationDeadline) {
      const deadline = new Date(evt.registrationDeadline).getTime();
      if (!isNaN(deadline) && deadline < nowTime) {
        changed = true;
        const tags = evt.tags.some((t) => t.toLowerCase().includes('closed'))
          ? evt.tags
          : ['Registration Closed 🚫', ...evt.tags];
        return {
          ...evt,
          status: 'COMPLETED' as const,
          tags,
        };
      }
    }
    return evt;
  });
  return changed ? updated : currentList;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(() => checkAndCloseExpiredEvents(INITIAL_DISCOVERY_EVENTS));
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([
    'evt-google-cloud-day-2026',
    'evt-sih-2026',
    'evt-techkriti-iitk',
    'evt-quanthacks-2026',
  ]);
  const [recentViewIds, setRecentViewIds] = useState<string[]>([
    'evt-google-cloud-day-2026',
    'evt-sih-2026',
    'evt-shaastra-iitm',
  ]);
  const [submissions, setSubmissions] = useState<EventSubmission[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      // Clean up legacy storage versions (v1 through v6)
      ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'].forEach((v) => {
        localStorage.removeItem(`ventixe_discovery_events_${v}`);
        localStorage.removeItem(`ventixe_discovery_bookmarks_${v}`);
        localStorage.removeItem(`ventixe_recent_views_${v}`);
        localStorage.removeItem(`ventixe_event_submissions_${v}`);
      });

      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      const storedRecent = localStorage.getItem(STORAGE_KEYS.RECENT_VIEWS);
      const storedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);

      if (storedEvents) {
        const parsed = JSON.parse(storedEvents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seedMap = new Map(INITIAL_DISCOVERY_EVENTS.map((s) => [s.id, s]));
          
          // Seed events take canonical precedence, user submissions preserved
          const merged = parsed.map((e: EventItem) => {
            const seed = seedMap.get(e.id);
            if (seed) {
              return { ...seed };
            }
            return {
              ...e,
              externalApplyUrl: resolveRegistrationUrl(e.externalApplyUrl, e.category),
            };
          });

          // Add any missing seed events (such as new Tech Events)
          const existingIds = new Set(merged.map((e: EventItem) => e.id));
          for (const seed of INITIAL_DISCOVERY_EVENTS) {
            if (!existingIds.has(seed.id)) {
              merged.push(seed);
            }
          }

          setEvents(checkAndCloseExpiredEvents(merged));
        }
      } else {
        // First load with v7 seed data
        setEvents(checkAndCloseExpiredEvents(INITIAL_DISCOVERY_EVENTS));
      }

      if (storedBookmarks) {
        setBookmarkedIds(JSON.parse(storedBookmarks));
      }

      if (storedRecent) {
        setRecentViewIds(JSON.parse(storedRecent));
      }

      if (storedSubmissions) {
        setSubmissions(JSON.parse(storedSubmissions));
      }
    } catch (err) {
      console.warn('Failed to parse localStorage data:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarkedIds));
      localStorage.setItem(STORAGE_KEYS.RECENT_VIEWS, JSON.stringify(recentViewIds));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  }, [events, bookmarkedIds, recentViewIds, submissions, isLoaded]);

  // Periodic Deadline Ticker: Automatically flips expired registrations to closed in real-time
  useEffect(() => {
    const ticker = setInterval(() => {
      setEvents((prev) => checkAndCloseExpiredEvents(prev));
      setLastSyncTime(new Date());
    }, 15000); // Every 15 seconds

    const onWakeOrFocus = () => {
      setEvents((prev) => checkAndCloseExpiredEvents(prev));
      setLastSyncTime(new Date());
    };

    window.addEventListener('focus', onWakeOrFocus);
    window.addEventListener('visibilitychange', onWakeOrFocus);

    return () => {
      clearInterval(ticker);
      window.removeEventListener('focus', onWakeOrFocus);
      window.removeEventListener('visibilitychange', onWakeOrFocus);
    };
  }, []);

  // Real-time Event Ingestion & Supabase Channel
  useEffect(() => {
    if (!supabase) return;
    try {
      const channel = supabase
        .channel('realtime:events')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'events' },
          (payload) => {
            if (payload.eventType === 'INSERT' && payload.new) {
              const row: any = payload.new;
              const newEvt: EventItem = {
                id: row.id || `evt-live-${Date.now()}`,
                title: row.title,
                slug: row.slug || `evt-slug-${Date.now()}`,
                shortDescription: row.short_description || row.summary || '',
                fullDescription: row.full_description || row.description || '',
                category: row.category || 'TECH_EVENT',
                tags: row.tags || ['Live Event ⚡', 'Open 🟢'],
                locationType: row.location_type || 'VENUE',
                venueName: row.venue_name || 'Campus',
                city: row.city || 'Online',
                country: row.country || 'India',
                startDate: row.start_date || new Date().toISOString(),
                endDate: row.end_date || new Date(Date.now() + 86400000).toISOString(),
                registrationDeadline: row.registration_deadline || null,
                eligibleMajors: row.eligible_majors || ['Open to All'],
                prizePool: row.prize_pool || '',
                entryFee: Number(row.entry_fee) || 0,
                organizerName: row.organizer_name || row.company || 'Community',
                externalApplyUrl: row.external_apply_url || 'https://unstop.com',
                bannerImageUrl: row.banner_image_url || row.banner_url || '/events/google-campus.jpg',
                isVerified: true,
                viewsCount: 1,
                createdAt: row.created_at || new Date().toISOString(),
                status: row.status || 'PUBLISHED',
              };
              setEvents((prev) => [newEvt, ...prev.filter((e) => e.id !== newEvt.id && e.slug !== newEvt.slug)]);
              setLastSyncTime(new Date());
            } else if (payload.eventType === 'UPDATE' && payload.new) {
              const row: any = payload.new;
              setEvents((prev) =>
                prev.map((e) => (e.id === row.id || e.slug === row.slug ? { ...e, ...row } : e))
              );
              setLastSyncTime(new Date());
            }
          }
        )
        .subscribe();

      return () => {
        if (supabase) {
          supabase.removeChannel(channel);
        }
      };
    } catch (err) {
      console.warn('Supabase realtime channel notice:', err);
    }
  }, []);

  // Manual or periodic trigger to re-sync events from remote API
  const syncEventsNow = async () => {
    setIsLiveSyncing(true);
    try {
      const res = await fetch('/api/events/search?limit=50');
      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events)) {
          setEvents((prev) => {
            const map = new Map(prev.map((e) => [e.id, e]));
            for (const item of data.events) {
              if (!map.has(item.id)) {
                map.set(item.id, item);
              }
            }
            return checkAndCloseExpiredEvents(Array.from(map.values()));
          });
        }
      }
      setLastSyncTime(new Date());
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setIsLiveSyncing(false);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (eventId: string) => {
    setBookmarkedIds((prev) => {
      const isAlready = prev.includes(eventId);
      if (isAlready) {
        return prev.filter((id) => id !== eventId);
      } else {
        return [eventId, ...prev];
      }
    });
  };

  const isBookmarked = (eventId: string) => {
    return bookmarkedIds.includes(eventId);
  };

  // Add to Recent Views & increment view count
  const addRecentView = (eventId: string) => {
    setRecentViewIds((prev) => {
      const filtered = prev.filter((id) => id !== eventId);
      return [eventId, ...filtered].slice(0, 12);
    });

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, viewsCount: (e.viewsCount || 0) + 1 } : e))
    );
  };

  // Submit crowdsourced event from /submit-event
  const submitEvent = (submission: EventSubmission): EventItem => {
    const newId = `evt-user-${Date.now()}`;
    const slug = `${submission.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newEvent: EventItem = {
      id: newId,
      title: submission.title,
      slug,
      shortDescription: submission.shortDescription,
      fullDescription: submission.fullDescription,
      category: submission.category,
      tags: submission.tags.length > 0 ? submission.tags : ['Student Fest 🎪', 'Open to All'],
      locationType: submission.locationType,
      venueName: submission.venueName || `${submission.collegeName} Campus`,
      city: submission.city || 'Bengaluru',
      country: submission.country || 'India',
      startDate: submission.startDate,
      endDate: submission.endDate,
      registrationDeadline: submission.registrationDeadline || null,
      eligibleMajors: submission.eligibleMajors.length > 0 ? submission.eligibleMajors : ['Open to All'],
      prizePool: submission.prizePool || 'Certificates & Trophies',
      entryFee: Number(submission.entryFee) || 0.0,
      organizerName: submission.organizerName || submission.collegeName,
      externalApplyUrl: submission.externalApplyUrl,
      bannerImageUrl: submission.bannerImageUrl || '/events/google-campus.jpg',
      isVerified: true,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
      summary: submission.shortDescription,
      description: submission.fullDescription,
      bannerUrl: submission.bannerImageUrl || '/events/google-campus.jpg',
      company: submission.organizerName,
    };

    // Broadcast / Upsert to Supabase if available
    if (supabase) {
      supabase
        .from('events')
        .insert([
          {
            title: newEvent.title,
            slug: newEvent.slug,
            short_description: newEvent.shortDescription,
            full_description: newEvent.fullDescription,
            category: newEvent.category,
            tags: newEvent.tags,
            location_type: newEvent.locationType,
            venue_name: newEvent.venueName,
            city: newEvent.city,
            start_date: newEvent.startDate,
            end_date: newEvent.endDate,
            registration_deadline: newEvent.registrationDeadline,
            eligible_majors: newEvent.eligibleMajors,
            prize_pool: newEvent.prizePool,
            entry_fee: newEvent.entryFee,
            organizer_name: newEvent.organizerName,
            external_apply_url: newEvent.externalApplyUrl,
            banner_image_url: newEvent.bannerImageUrl,
          },
        ])
        .then(() => {})
        .catch((err: unknown) => console.warn('Supabase crowdsource submit notice:', err));
    }

    setEvents((prev) => [newEvent, ...prev]);
    setSubmissions((prev) => [{ ...submission, id: `sub-${Date.now()}`, status: 'APPROVED' }, ...prev]);

    return newEvent;
  };

  const getEventBySlugOrId = (identifier: string): EventItem | undefined => {
    return events.find((e) => e.slug === identifier || e.id === identifier);
  };

  // Compatibility stubs
  const toggleRole = () => {
    setCurrentRole((prev) => (prev === 'student' ? 'organizer' : 'student'));
  };

  const addEvent = (data: any): EventItem => {
    const newId = `evt-gen-${Date.now()}`;
    const slug = (data.title || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
    const newEvt: EventItem = {
      id: newId,
      slug,
      title: data.title || 'Untitled Event',
      shortDescription: data.summary || data.shortDescription || '',
      fullDescription: data.description || data.fullDescription || '',
      category: data.category || 'HACKATHON',
      tags: data.tags || ['Tech'],
      locationType: data.locationType || 'VENUE',
      venueName: data.venueName || 'Campus Venue',
      city: data.city || 'Bengaluru',
      country: 'India',
      startDate: data.startDate || new Date().toISOString(),
      endDate: data.endDate || new Date(Date.now() + 86400000).toISOString(),
      eligibleMajors: data.eligibleMajors || ['Open to All'],
      entryFee: data.entryFee || 0,
      organizerName: data.organizerName || data.company || 'Host',
      externalApplyUrl: data.externalApplyUrl || data.externalSourceUrl || 'https://unstop.com',
      bannerImageUrl: data.bannerImageUrl || data.bannerUrl || '/events/google-campus.jpg',
      isVerified: true,
      viewsCount: 0,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setEvents((prev) => [newEvt, ...prev]);
    return newEvt;
  };

  const updateEvent = (updated: EventItem) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const bookTickets = (data: any) => {
    const dummyOrder: Order = {
      id: `ord-${Date.now()}`,
      eventId: data.eventId,
      eventTitle: 'Event Registration',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      ticketsCount: data.quantity,
      totalAmount: 0,
      status: 'completed',
      createdAt: new Date().toISOString(),
      ticketIds: [`tkt-${Date.now()}`],
    };
    return { order: dummyOrder, newTickets: [] };
  };

  const validateAndCheckInTicket = (codeOrToken: string): CheckInResult => {
    return { success: true, message: 'Valid check-in token' };
  };

  const addReview = (eventId: string, review: any) => {
    // Review stub
  };

  const resetDemoData = () => {
    setEvents(INITIAL_DISCOVERY_EVENTS);
    setBookmarkedIds(['evt-codestorm-vit', 'evt-techkriti-iitk']);
  };

  return (
    <AppContext.Provider
      value={{
        events,
        bookmarkedIds,
        recentViewIds,
        submissions,
        lastSyncTime,
        isLiveSyncing,
        syncEventsNow,
        toggleBookmark,
        isBookmarked,
        addRecentView,
        submitEvent,
        getEventBySlugOrId,
        tickets,
        orders,
        currentRole,
        setCurrentRole,
        toggleRole,
        savedEventIds: bookmarkedIds,
        toggleSaveEvent: toggleBookmark,
        isEventSaved: isBookmarked,
        addEvent,
        updateEvent,
        deleteEvent,
        bookTickets,
        validateAndCheckInTicket,
        addReview,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
