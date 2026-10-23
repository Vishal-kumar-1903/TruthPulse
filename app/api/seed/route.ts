import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    await seedDatabase(force);
    return NextResponse.json({
      success: true,
      message: force 
        ? 'Database forcefully re-seeded with all categories & Indian states.' 
        : 'Database verified and seeded if empty.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
