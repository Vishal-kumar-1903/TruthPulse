import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import { generateContentHash } from '@/lib/crypto';
import { normalizeStrapiArticle } from '@/lib/strapi';

export const dynamic = 'force-dynamic';

/**
 * Strapi Webhook Handler
 * Listens for events from Strapi CMS (e.g. entry.publish, entry.update, entry.delete)
 * Auto-syncs Strapi content directly to TruthPulse Live News Grid & MongoDB.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Webhook Secret (if configured)
    const secret = process.env.STRAPI_WEBHOOK_SECRET;
    const authHeader = req.headers.get('authorization');
    const signature = req.headers.get('x-strapi-signature');

    if (secret && authHeader !== `Bearer ${secret}` && signature !== secret) {
      console.warn('Unauthorized Strapi webhook ping received');
      return NextResponse.json({ success: false, error: 'Unauthorized webhook request' }, { status: 401 });
    }

    const payload = await req.json();
    const { event, model, entry } = payload;

    // Only process article model events
    if (model && model !== 'article') {
      return NextResponse.json({ success: true, message: `Ignored event for model: ${model}` });
    }

    console.log(`[Strapi Webhook] Event: ${event}, Entry ID: ${entry?.id || entry?.documentId}`);

    const conn = await connectDB();
    if (!conn || conn.connection.readyState !== 1) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 });
    }

    // 2. Handle 'entry.publish' or 'entry.update' or 'entry.create'
    if (event === 'entry.publish' || event === 'entry.update' || event === 'entry.create') {
      if (!entry) {
        return NextResponse.json({ success: false, error: 'No entry in payload' }, { status: 400 });
      }

      const normalized = normalizeStrapiArticle(entry);
      const contentHash = generateContentHash(normalized.title, normalized.summary, normalized.content);

      const strapiId = entry.id?.toString() || entry.documentId?.toString();

      // Upsert into MongoDB Atlas
      const updatedArticle = await Article.findOneAndUpdate(
        { 
          $or: [
            { strapiId: strapiId },
            { title: normalized.title }
          ]
        },
        {
          $set: {
            title: normalized.title,
            summary: normalized.summary,
            bullets: normalized.bullets,
            content: normalized.content,
            category: normalized.category,
            region: normalized.region,
            state: normalized.state,
            city: normalized.city,
            location: normalized.location,
            trustScore: normalized.trustScore,
            author: normalized.author,
            imageUrl: normalized.imageUrl,
            mediaType: normalized.mediaType,
            mediaUrl: normalized.mediaUrl,
            status: 'PUBLISHED',
            isPinned: normalized.isPinned,
            contentHash,
            strapiId,
            updatedAt: new Date()
          },
          $setOnInsert: {
            upvotes: 0,
            downvotes: 0,
            isVerified: true,
            createdAt: new Date()
          }
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        success: true,
        message: `Strapi article [${event}] successfully synchronized with TruthPulse!`,
        articleId: updatedArticle._id,
        strapiId
      });
    }

    // 3. Handle 'entry.unpublish' or 'entry.delete'
    if (event === 'entry.unpublish' || event === 'entry.delete') {
      const strapiId = entry?.id?.toString() || entry?.documentId?.toString();
      if (strapiId) {
        await Article.findOneAndUpdate(
          { strapiId },
          { $set: { status: 'DEBUNKED' } }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Strapi article [${event}] archived from live portal.`
      });
    }

    return NextResponse.json({ success: true, message: `Event ${event} acknowledged.` });
  } catch (error: any) {
    console.error('Strapi webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
