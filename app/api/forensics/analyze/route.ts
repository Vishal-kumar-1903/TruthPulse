import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeMediaForensics } from '@/lib/forensics';

const AnalyzeForensicsSchema = z.object({
  imageUrl: z.string().trim().min(5, 'Image URL or base64 data must be at least 5 characters'),
  title: z.string().trim().max(300).optional().default(''),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = AnalyzeForensicsSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid forensics payload',
          details: parseResult.error.issues.map(i => i.message),
        },
        { status: 422 }
      );
    }

    const { imageUrl, title } = parseResult.data;
    const report = analyzeMediaForensics(imageUrl, title);

    return NextResponse.json({
      success: true,
      report,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Forensics processing error' }, { status: 500 });
  }
}
