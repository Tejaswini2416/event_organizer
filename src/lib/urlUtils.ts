/**
 * URL Utility & Registration State Helper
 * Ensures all external registration links resolve directly to active portals or valid opportunity pages,
 * preventing 404 dead ends, and clearly identifies registration status.
 */

/**
 * Checks whether an event's registration has expired or been closed
 */
export function isEventRegistrationClosed(event: {
  registrationDeadline?: string | null;
  status?: string;
  tags?: string[];
  title?: string;
}): boolean {
  const statusUpper = (event.status || '').toUpperCase();
  if (
    statusUpper === 'COMPLETED' ||
    statusUpper === 'CANCELLED' ||
    statusUpper === 'CLOSED' ||
    statusUpper === 'ENDED'
  ) {
    return true;
  }

  // Check tags for explicit closure markers
  if (
    event.tags &&
    event.tags.some((t) => {
      const tl = t.toLowerCase();
      return (
        tl.includes('registration closed') ||
        tl.includes('hackathon ended') ||
        tl.includes('closed event') ||
        tl.includes('concluded')
      );
    })
  ) {
    return true;
  }

  // Check title for closed marker
  if (event.title && event.title.toLowerCase().includes('[closed]')) {
    return true;
  }

  // Check deadline
  if (event.registrationDeadline) {
    const deadlineTime = new Date(event.registrationDeadline).getTime();
    if (!isNaN(deadlineTime) && deadlineTime < Date.now()) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves registration URL to a valid working link
 */
export function resolveRegistrationUrl(rawUrl: string, category?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return getCategoryFallbackUrl(category);
  }

  let url = rawUrl.trim();

  // If user pasted without protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);

    // 1. Direct Devfolio micro-sites (e.g. hacknitr5.devfolio.co, electrothon6.devfolio.co)
    if (parsed.hostname.includes('.devfolio.co') || parsed.hostname === 'devfolio.co') {
      return url;
    }

    // 2. Direct College Fest portals (Techkriti, Shaastra, Techfest)
    if (parsed.hostname.includes('techkriti.org') || parsed.hostname.includes('shaastra.org') || parsed.hostname.includes('techfest.org')) {
      return url;
    }

    // 3. Government / National Hackathons (e.g. sih.gov.in)
    if (parsed.hostname.includes('sih.gov.in')) {
      return url;
    }

    // 4. Unstop Normalization
    if (parsed.hostname.includes('unstop.com')) {
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      const validSections = [
        'hackathons', 
        'competitions', 
        'workshops', 
        'webinars', 
        'college-fests', 
        'all-opportunities'
      ];

      if (pathParts.length === 1 && validSections.includes(pathParts[0])) {
        return `https://unstop.com/${pathParts[0]}${parsed.search}`;
      }

      // If opportunity slug does not end with real numeric ID (e.g. /hackathons/codestorm-2026-vit-ap)
      if (pathParts.length > 1) {
        const lastPart = pathParts[pathParts.length - 1];
        const hasNumericId = /\d{4,}/.test(lastPart);
        if (!hasNumericId) {
          const section = pathParts[0];
          if (validSections.includes(section)) {
            return `https://unstop.com/${section}`;
          }
          return getCategoryFallbackUrl(category);
        }
      }

      if (pathParts.length === 0) {
        return 'https://unstop.com/competitions';
      }
    }

    // 5. Devpost Link Normalization
    if (parsed.hostname.includes('devpost.com')) {
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      if (pathParts.length > 1 && pathParts[0] === 'hackathons') {
        const slug = pathParts[1].toLowerCase();
        if (slug.includes('google-vertex-ai') || slug.includes('2026')) {
          return 'https://devpost.com/hackathons';
        }
      }
    }

    // 6. Google Developer Groups Normalization
    if (parsed.hostname.includes('gdg.community.dev')) {
      if (parsed.pathname.includes('/events/details/')) {
        return 'https://gdg.community.dev/events/';
      }
    }

    // 7. IEEE Bangalore Section
    if (parsed.hostname.includes('ieeebangalore.org')) {
      if (parsed.pathname.includes('/wit-2026') || parsed.pathname.includes('/events/2026')) {
        return 'https://ieeebangalore.org/events/';
      }
    }

    // 8. Eventbrite demo links
    if (parsed.hostname.includes('eventbrite.com')) {
      if (parsed.pathname.includes('student-rag-ai-workshop') || parsed.pathname.includes('tickets-2026')) {
        return 'https://unstop.com/workshops';
      }
    }

    // 9. Meetup demo links
    if (parsed.hostname.includes('meetup.com')) {
      if (parsed.pathname.includes('pytorch-india-webinars') || parsed.pathname.includes('2026-edge-vision')) {
        return 'https://pytorch.org/';
      }
    }

    return url;
  } catch {
    return getCategoryFallbackUrl(category);
  }
}

export function getCategoryFallbackUrl(category?: string): string {
  switch (category) {
    case 'HACKATHON':
      return 'https://sih.gov.in/';
    case 'COLLEGE_FEST':
      return 'https://techkriti.org/competitions';
    case 'TECH_EVENT':
      return 'https://gdg.community.dev/events/';
    case 'WORKSHOP':
      return 'https://unstop.com/workshops';
    case 'WEBINAR':
      return 'https://unstop.com/webinars';
    case 'CONFERENCE':
      return 'https://gdg.community.dev/events/';
    default:
      return 'https://sih.gov.in/';
  }
}

/**
 * Returns a human-friendly provider name for display on CTAs
 */
export function getProviderLabel(url: string, organizerName?: string): string {
  const lower = (url || '').toLowerCase();
  if (lower.includes('sih.gov.in')) return 'Smart India Hackathon';
  if (lower.includes('devfolio.co')) return 'Devfolio';
  if (lower.includes('techkriti.org')) return 'IIT Kanpur Fest';
  if (lower.includes('shaastra.org')) return 'IIT Madras Shaastra';
  if (lower.includes('techfest.org')) return 'IIT Bombay Techfest';
  if (lower.includes('unstop.com')) return 'Unstop';
  if (lower.includes('devpost.com')) return 'Devpost';
  if (lower.includes('gdg.community.dev')) return 'Google Developer Group';
  if (lower.includes('developer.microsoft.com') || lower.includes('microsoft.com')) return 'Microsoft Developer';
  if (lower.includes('aws.amazon.com') || lower.includes('amazon.com')) return 'AWS User Group';
  if (lower.includes('nvidia.com')) return 'NVIDIA Developer';
  if (lower.includes('fossunited.org')) return 'FOSS United';
  if (lower.includes('bengalurutechsummit.com')) return 'Bengaluru Tech Summit';
  if (lower.includes('ieeebangalore.org') || lower.includes('ieee.org')) return 'IEEE';
  if (lower.includes('pytorch.org')) return 'PyTorch Foundation';
  return organizerName || 'Official Portal';
}

/**
 * Returns precise button text based on status and provider
 */
export function getApplyButtonText(url: string, isClosed: boolean): string {
  if (isClosed) return 'Registration Closed';
  const lower = (url || '').toLowerCase();
  if (lower.includes('sih.gov.in')) return 'Register on SIH Portal';
  if (lower.includes('devfolio.co')) return 'Apply on Devfolio';
  if (lower.includes('techkriti.org')) return 'Register on Techkriti';
  if (lower.includes('shaastra.org')) return 'Register on Shaastra';
  if (lower.includes('techfest.org')) return 'Register on Techfest';
  if (lower.includes('unstop.com')) return 'Apply on Unstop';
  if (lower.includes('devpost.com')) return 'Apply on Devpost';
  if (lower.includes('gdg.community.dev')) return 'Register on GDG';
  if (lower.includes('developer.microsoft.com') || lower.includes('microsoft.com')) return 'Register on Microsoft';
  if (lower.includes('aws.amazon.com') || lower.includes('amazon.com')) return 'Register on AWS';
  if (lower.includes('nvidia.com')) return 'Register on NVIDIA';
  if (lower.includes('fossunited.org')) return 'Register on FOSS United';
  if (lower.includes('ieeebangalore.org') || lower.includes('ieee.org')) return 'Register on IEEE';
  return 'Register on Official Site';
}
