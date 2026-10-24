import { NextResponse } from 'next/server';
import { runWireCrawler, OFFICIAL_RSS_FEEDS } from '@/lib/rssCrawler';

export async function GET() {
  try {
    const result = await runWireCrawler();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Crawler execution failed' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    let customFeeds = OFFICIAL_RSS_FEEDS;
    try {
      const body = await req.json();
      if (body.feeds && Array.isArray(body.feeds)) {
        customFeeds = body.feeds;
      }
    } catch (e) {
      // Body not provided, use defaults
    }

    const result = await runWireCrawler(customFeeds);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Crawler execution failed' },
      { status: 500 }
    );
  }
}
