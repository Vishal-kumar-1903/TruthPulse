import { NextRequest, NextResponse } from 'next/server';
import { queryGazetteRag } from '@/lib/ragEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claim } = body;

    if (!claim) {
      return NextResponse.json({ success: false, error: 'Claim text is required' }, { status: 400 });
    }

    const result = queryGazetteRag(claim);

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
