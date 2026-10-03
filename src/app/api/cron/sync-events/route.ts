import { NextResponse } from 'next/server';
import { POST as syncHandler } from '@/app/api/events/sync/route';

export async function GET(request: Request) {
  // Can be called by Vercel Cron or any cron scheduler
  const authHeader = request.headers.get('authorization');
  // Optional cron secret verification if CRON_SECRET is configured
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
  }

  return syncHandler(request);
}
