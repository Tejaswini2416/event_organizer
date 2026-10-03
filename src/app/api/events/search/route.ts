import { NextResponse } from 'next/server';
import { INITIAL_DISCOVERY_EVENTS } from '@/lib/mockData';
import { EventItem, Category, LocationType } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase().trim() || '';
    const city = searchParams.get('city')?.trim() || '';
    const category = searchParams.get('category')?.toUpperCase().trim() || '';
    const price = searchParams.get('price')?.toLowerCase().trim() || '';
    const tagsParam = searchParams.get('tags')?.trim() || '';
    const locationType = searchParams.get('locationType')?.toUpperCase().trim() || '';
    const major = searchParams.get('major')?.toLowerCase().trim() || '';
    const isAutocomplete = searchParams.get('autocomplete') === 'true' || searchParams.get('autocomplete') === '1';

    const tagsFilter = tagsParam
      ? tagsParam.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean)
      : [];

    let results: EventItem[] = [...INITIAL_DISCOVERY_EVENTS];

    // Filter by Search Query
    if (q) {
      results = results.filter((evt) => {
        const titleMatch = evt.title.toLowerCase().includes(q);
        const shortDescMatch = evt.shortDescription.toLowerCase().includes(q);
        const fullDescMatch = evt.fullDescription.toLowerCase().includes(q);
        const organizerMatch = evt.organizerName.toLowerCase().includes(q);
        const cityMatch = (evt.city || '').toLowerCase().includes(q);
        const venueMatch = (evt.venueName || '').toLowerCase().includes(q);
        const tagsMatch = evt.tags.some((t) => t.toLowerCase().includes(q));
        const majorMatch = evt.eligibleMajors.some((m) => m.toLowerCase().includes(q));

        return (
          titleMatch ||
          shortDescMatch ||
          fullDescMatch ||
          organizerMatch ||
          cityMatch ||
          venueMatch ||
          tagsMatch ||
          majorMatch
        );
      });
    }

    // Filter by City
    if (city && city.toLowerCase() !== 'all' && city.toLowerCase() !== 'all cities') {
      results = results.filter((evt) => {
        if (city.toLowerCase() === 'online') {
          return evt.locationType === 'ONLINE' || (evt.city || '').toLowerCase() === 'online';
        }
        return (evt.city || '').toLowerCase() === city.toLowerCase();
      });
    }

    // Filter by Category
    if (category && category !== 'ALL') {
      results = results.filter((evt) => evt.category === category);
    }

    // Filter by Price (Free vs Paid)
    if (price === 'free') {
      results = results.filter((evt) => evt.entryFee === 0);
    } else if (price === 'paid') {
      results = results.filter((evt) => evt.entryFee > 0);
    }

    // Filter by Location Type
    if (locationType && locationType !== 'ALL') {
      results = results.filter((evt) => evt.locationType === locationType);
    }

    // Filter by Tags (e.g. Free Food, Certificates)
    if (tagsFilter.length > 0) {
      results = results.filter((evt) =>
        tagsFilter.every((reqTag) =>
          evt.tags.some((t) => t.toLowerCase().includes(reqTag))
        )
      );
    }

    // Filter by Major
    if (major && major !== 'all' && major !== 'open to all') {
      results = results.filter((evt) =>
        evt.eligibleMajors.some(
          (m) => m.toLowerCase() === 'open to all' || m.toLowerCase().includes(major)
        )
      );
    }

    // If autocomplete query requested, return lightweight results
    if (isAutocomplete) {
      const suggestions = results.slice(0, 6).map((evt) => ({
        id: evt.id,
        title: evt.title,
        slug: evt.slug,
        category: evt.category,
        city: evt.city,
        organizerName: evt.organizerName,
        prizePool: evt.prizePool,
        externalApplyUrl: evt.externalApplyUrl,
        bannerImageUrl: evt.bannerImageUrl,
        entryFee: evt.entryFee,
      }));

      return NextResponse.json({
        success: true,
        count: suggestions.length,
        suggestions,
      });
    }

    return NextResponse.json({
      success: true,
      total: results.length,
      events: results,
      filtersApplied: {
        q: q || null,
        city: city || null,
        category: category || null,
        price: price || null,
        tags: tagsFilter.length > 0 ? tagsFilter : null,
        locationType: locationType || null,
        major: major || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to search events' },
      { status: 500 }
    );
  }
}
