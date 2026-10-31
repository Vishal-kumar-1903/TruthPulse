import { NextRequest, NextResponse } from 'next/server';
import { checkPayloadHealth, fetchPayloadDocuments } from '@/lib/payloadClient';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const collection = (searchParams.get('collection') as 'articles' | 'reels') || 'articles';
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const [health, docs] = await Promise.all([
      checkPayloadHealth(),
      fetchPayloadDocuments(collection, { limit, search, status })
    ]);

    return NextResponse.json({
      success: true,
      cms: 'Payload CMS v3 (Native MongoDB Engine)',
      health,
      activeCollection: collection,
      count: docs.length,
      docs
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, summary, content, category, contentType = 'NEWS', status = 'PUBLISHED', author } = body;

    if (!title || !summary) {
      return NextResponse.json(
        { success: false, error: 'Title and Summary are required for Payload Document.' },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { success: false, error: 'Database connection offline' },
        { status: 503 }
      );
    }

    const newDoc = await Article.create({
      title: title.trim(),
      summary: summary.trim(),
      content: (content || summary).trim(),
      category: category || 'General',
      contentType,
      status,
      author: author || 'Payload Editor',
      trustScore: 92,
      upvotes: 0,
      downvotes: 0,
      isVerified: true
    });

    return NextResponse.json({
      success: true,
      message: 'Document saved to Payload MongoDB Collection!',
      id: newDoc._id.toString(),
      data: newDoc
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
