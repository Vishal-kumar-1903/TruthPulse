import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const PushSubscriptionSchema = z.object({
  endpoint: z.string().trim().optional(),
  categories: z.array(z.string()).optional().default(['BREAKING', 'POLITICS', 'WEATHER']),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = PushSubscriptionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid notification subscription payload',
          details: parseResult.error.issues.map(i => i.message),
        },
        { status: 422 }
      );
    }

    const { categories } = parseResult.data;

    return NextResponse.json({
      success: true,
      message: 'Subscribed to TruthPulse real-time push dispatches.',
      subscriptionId: `sub-${Date.now()}`,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Notification error' }, { status: 500 });
  }
}
