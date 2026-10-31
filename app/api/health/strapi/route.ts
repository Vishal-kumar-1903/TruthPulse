import { NextRequest, NextResponse } from 'next/server';
import { checkStrapiHealth } from '@/lib/strapi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customUrl = searchParams.get('url') || undefined;
    const health = await checkStrapiHealth(customUrl);
    return NextResponse.json({
      success: true,
      ...health
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      online: false,
      error: err.message
    });
  }
}
