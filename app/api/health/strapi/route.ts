import { NextResponse } from 'next/server';
import { checkStrapiHealth } from '@/lib/strapi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const health = await checkStrapiHealth();
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
