import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint, categories = ['BREAKING', 'POLITICS', 'WEATHER'] } = body;

    return NextResponse.json({
      success: true,
      message: 'Subscribed to TruthPulse real-time push dispatches.',
      subscriptionId: `sub-${Date.now()}`,
      categories
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
