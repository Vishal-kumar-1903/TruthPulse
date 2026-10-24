import { NextRequest, NextResponse } from 'next/server';
import { generateUpiIntentUrl, TipRecord } from '@/lib/tipping';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { articleId, authorName = 'Ground Reporter', amount = 25, donorName = 'Anonymous Reader' } = body;

    const reporterUpiVpa = 'truthpulse.reporter@okhdfcbank';
    const upiIntent = generateUpiIntentUrl({
      vpa: reporterUpiVpa,
      payeeName: authorName,
      amount,
      transactionNote: `TruthPulse Tip for ${authorName}`
    });

    const tipRecord: TipRecord = {
      id: `tip-${Date.now()}`,
      articleId,
      authorName,
      reporterUpiVpa,
      amount,
      donorName,
      timestamp: new Date().toISOString(),
      truthCreditsGranted: Math.floor(amount * 0.75)
    };

    return NextResponse.json({
      success: true,
      tipRecord,
      upiIntent,
      message: `UPI payment initiated for ₹${amount} to ${authorName}.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
