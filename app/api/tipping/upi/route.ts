import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateUpiIntentUrl, TipRecord } from '@/lib/tipping';

const UpiTipSchema = z.object({
  articleId: z.string().optional().default('default-article'),
  authorName: z.string().trim().min(1, 'Author name is required').max(100).default('Ground Reporter'),
  amount: z.number().int().min(1, 'Minimum tip is ₹1').max(100000, 'Maximum single tip is ₹1,00,000').default(25),
  donorName: z.string().trim().max(100).optional().default('Anonymous Reader'),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = UpiTipSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid tip details',
          details: parseResult.error.issues.map(i => i.message),
        },
        { status: 422 }
      );
    }

    const { articleId, authorName, amount, donorName } = parseResult.data;

    const reporterUpiVpa = 'truthpulse.reporter@okhdfcbank';
    const upiIntent = generateUpiIntentUrl({
      vpa: reporterUpiVpa,
      payeeName: authorName,
      amount,
      transactionNote: `TruthPulse Tip for ${authorName}`,
    });

    const tipRecord: TipRecord = {
      id: `tip-${Date.now()}`,
      articleId,
      authorName,
      reporterUpiVpa,
      amount,
      donorName,
      timestamp: new Date().toISOString(),
      truthCreditsGranted: Math.floor(amount * 0.75),
    };

    return NextResponse.json({
      success: true,
      tipRecord,
      upiIntent,
      message: `UPI payment initiated for ₹${amount} to ${authorName}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error processing UPI tip' }, { status: 500 });
  }
}
