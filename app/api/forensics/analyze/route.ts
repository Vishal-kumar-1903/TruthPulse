import { NextRequest, NextResponse } from 'next/server';
import { analyzeMediaForensics } from '@/lib/forensics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, title } = body;

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'imageUrl is required' }, { status: 400 });
    }

    const report = analyzeMediaForensics(imageUrl, title || '');

    return NextResponse.json({
      success: true,
      report,
      analyzedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
