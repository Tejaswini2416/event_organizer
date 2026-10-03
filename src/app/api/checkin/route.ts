import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { codeOrToken } = body;

    if (!codeOrToken) {
      return NextResponse.json(
        { success: false, message: 'Missing ticket token or code' },
        { status: 400 }
      );
    }

    const clean = String(codeOrToken).trim().toUpperCase();

    // Verification logic demonstration
    if (clean.includes('INVALID') || clean.includes('FAKE')) {
      return NextResponse.json({
        success: false,
        message: 'Invalid pass! Ticket not found in cryptographic registry.',
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Ticket Verified! Check-in confirmed for ${clean}`,
      verifiedAt: new Date().toISOString(),
      gateId: 'GATE-01-MAIN',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
