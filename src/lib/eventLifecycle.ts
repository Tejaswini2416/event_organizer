import { EventItem, LifecycleStatus, AvailabilityStatus } from '@/types';

export interface ComputedEventState {
  lifecycleStatus: LifecycleStatus;
  availabilityStatus: AvailabilityStatus;
  isUpcoming: boolean;
  isLive: boolean;
  isCompleted: boolean;
  isSoldOut: boolean;
  isAvailable: boolean;
  isExternal: boolean;
  totalCapacity: number;
  ticketsSold: number;
  remainingCapacity: number;
  percentFilled: number;
  canRegister: boolean;
}

/**
 * Computes real-time dynamic lifecycle and ticket capacity states for any event
 */
export function computeEventState(event: EventItem, referenceDate?: Date): ComputedEventState {
  const now = referenceDate ? referenceDate.getTime() : Date.now();
  const startTime = new Date(event.startDate).getTime();
  const endTime = new Date(event.endDate).getTime();

  // 1. Lifecycle status
  let lifecycleStatus: LifecycleStatus = 'UPCOMING';
  if (now > endTime) {
    lifecycleStatus = 'COMPLETED';
  } else if (now >= startTime && now <= endTime) {
    lifecycleStatus = 'LIVE';
  }

  const isUpcoming = lifecycleStatus === 'UPCOMING';
  const isLive = lifecycleStatus === 'LIVE';
  const isCompleted = lifecycleStatus === 'COMPLETED';

  // 2. Capacity calculations
  const tierCapacitySum = event.ticketTiers?.reduce((acc: number, t: any) => acc + (t.capacity || 0), 0) || 0;
  const tierRemainingSum = event.ticketTiers?.reduce((acc: number, t: any) => acc + (t.remainingCapacity || 0), 0) || 0;

  const totalCapacity: number = (typeof event.totalCapacity === 'number' && event.totalCapacity > 0) 
    ? event.totalCapacity 
    : (tierCapacitySum > 0 ? tierCapacitySum : 500);
  
  // Calculate tickets sold from either explicit property or difference
  let ticketsSold = typeof event.ticketsSold === 'number' ? event.ticketsSold : 0;
  if (tierCapacitySum > 0 && ticketsSold === 0) {
    ticketsSold = Math.max(0, tierCapacitySum - tierRemainingSum);
  }

  const remainingCapacity = Math.max(0, totalCapacity - ticketsSold);
  const percentFilled = totalCapacity > 0 ? Math.min(100, Math.round((ticketsSold / totalCapacity) * 100)) : 0;

  const isSoldOut = ticketsSold >= totalCapacity || remainingCapacity === 0;
  const availabilityStatus: AvailabilityStatus = isSoldOut ? 'SOLD_OUT' : 'AVAILABLE';
  const isAvailable = !isSoldOut;

  // External sync check
  const isExternal = Boolean(
    (event.externalApplyUrl && event.externalApplyUrl.startsWith('http')) ||
    (event.externalSourceUrl && event.externalSourceUrl.startsWith('http'))
  );

  // Registration eligibility: cannot register if completed or sold out (unless it's an external listing)
  const canRegister = (!isCompleted && !isSoldOut) || isExternal;

  return {
    lifecycleStatus,
    availabilityStatus,
    isUpcoming,
    isLive,
    isCompleted,
    isSoldOut,
    isAvailable,
    isExternal,
    totalCapacity,
    ticketsSold,
    remainingCapacity,
    percentFilled,
    canRegister,
  };
}

/**
 * Filter predicate helper for discovery views
 */
export function filterByDynamicStatus(
  events: EventItem[],
  filter: 'all' | 'upcoming' | 'live' | 'past' | 'free_food' | 'certificates' | 'campus_only' | 'external'
): EventItem[] {
  const now = Date.now();

  return events.filter((evt) => {
    const state = computeEventState(evt, new Date(now));

    switch (filter) {
      case 'upcoming':
        return state.isUpcoming;
      case 'live':
        return state.isLive;
      case 'past':
        return state.isCompleted;
      case 'free_food':
        return evt.isFreeFood;
      case 'certificates':
        return evt.hasCertificate;
      case 'campus_only':
        return evt.isCampusOnly;
      case 'external':
        return state.isExternal;
      default:
        return true;
    }
  });
}
