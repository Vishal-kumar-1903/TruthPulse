import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { queryGazetteRag } from '@/lib/ragEngine';

const RagVerifySchema = z.object({
  claim: z.string().trim().min(3, 'Claim query must be at least 3 characters').max(500, 'Claim query cannot exceed 500 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = RagVerifySchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid statutory claim query',
          details: parseResult.error.issues.map(i => i.message),
        },
        { status: 422 }
      );
    }

    const { claim } = parseResult.data;
    const result = queryGazetteRag(claim);

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Gazette RAG search error' }, { status: 500 });
  }
}
