import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import AdminUser from '@/models/AdminUser';
import { generateContentHash } from '@/lib/crypto';
import { bot4VerificationAuditor } from '@/lib/agents';
import { DEFAULT_BREAKING_SHORTS, BreakingShort } from '@/lib/reelsData';
import { publishArticleToStrapi } from '@/lib/strapi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Format time ago for reader convenience
function formatTimeAgo(dateString?: string | Date): string {
  if (!dateString) return 'Just now';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

// Map MongoDB Article to UI BreakingShort format
function articleToShort(doc: any): BreakingShort {
  return {
    id: doc._id?.toString() || `short-${Date.now()}`,
    badge: (doc.reelBadge || 'BREAKING') as 'BREAKING' | 'ALERT' | 'FACT-CHECK',
    headline: doc.title || doc.headline || 'Verified News Dispatch',
    snippet: doc.snippet || doc.summary || 'Real-time multi-agent news verification stream.',
    location: doc.city ? `${doc.city}${doc.state ? ', ' + doc.state : ''}` : (doc.state || 'National'),
    source: doc.sources?.[0]?.name || doc.author || 'Editorial Bureau Wire',
    fullArticleId: doc._id?.toString(),
    category: doc.category || 'Politics',
    imageUrl: doc.imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000',
    mediaType: doc.mediaType || 'VIDEO_LOOP',
    mediaUrl: doc.mediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
    trustScore: doc.trustScore || 95,
    timeAgo: formatTimeAgo(doc.createdAt)
  };
}

export async function GET(req: NextRequest) {
  try {
    const conn = await connectDB();
    if (conn && conn.connection.readyState === 1) {
      const dbReels = await Article.find({
        $or: [
          { contentType: 'REEL' },
          { mediaType: 'VIDEO_LOOP' }
        ],
        $and: [
          {
            $or: [
              { status: 'PUBLISHED' },
              { status: 'SCHEDULED', scheduledPublishAt: { $lte: new Date() } }
            ]
          }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

      if (dbReels && dbReels.length > 0) {
        const customShorts = dbReels.map(articleToShort);

        // Merge custom shorts with default fallback shorts, ensuring no duplicate headlines
        const combined = [...customShorts];
        for (const def of DEFAULT_BREAKING_SHORTS) {
          if (!combined.some(c => (c.headline || '').toLowerCase() === (def.headline || '').toLowerCase())) {
            combined.push(def);
          }
        }

        return NextResponse.json({
          success: true,
          count: combined.length,
          shorts: combined
        });
      }
    }

    // Default fallback shorts
    return NextResponse.json({
      success: true,
      count: DEFAULT_BREAKING_SHORTS.length,
      shorts: DEFAULT_BREAKING_SHORTS
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      count: DEFAULT_BREAKING_SHORTS.length,
      shorts: DEFAULT_BREAKING_SHORTS,
      notice: 'Fallback shorts active'
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      headline,
      title,
      snippet,
      summary,
      badge = 'BREAKING',
      mediaUrl,
      imageUrl,
      category = 'Politics',
      location = 'New Delhi',
      state,
      city,
      sourceName = 'Primary Video Wire',
      sourceUrl,
      author = 'TruthPulse Editorial Bureau',
      trustScore = 92,
      isScheduled = false,
      scheduledPublishAt
    } = body;

    const effectiveStatus = (isScheduled && scheduledPublishAt) ? 'SCHEDULED' : 'PUBLISHED';
    const effectiveScheduledPublishAt = (isScheduled && scheduledPublishAt) ? new Date(scheduledPublishAt) : undefined;

    const reelHeadline = (headline || title || '').trim();
    const reelSnippet = (snippet || summary || '').trim();

    if (!reelHeadline || !reelSnippet) {
      return NextResponse.json(
        { success: false, error: 'Reel Headline and Caption/Snippet are required.' },
        { status: 400 }
      );
    }

    if (!sourceUrl || !sourceUrl.trim()) {
      return NextResponse.json(
        { success: false, error: 'MANDATORY EDITORIAL GATING: Kam se kam 1 verified source URL attach karna anivarya hai.' },
        { status: 400 }
      );
    }

    const sources = [
      {
        name: sourceName.trim() || 'Verified Video Wire',
        url: sourceUrl.trim(),
        stance: 'CORROBORATING'
      }
    ];

    const audit = bot4VerificationAuditor(reelHeadline, reelSnippet, sources as any);
    const finalScore = Math.max(audit.trustScore, trustScore);

    if (finalScore < 80) {
      return NextResponse.json(
        { success: false, error: `Editorial Gating: AI Trust Score (${finalScore}%) kam se kam 80% hona anivarya hai.` },
        { status: 400 }
      );
    }

    const contentHash = generateContentHash(reelHeadline, reelSnippet, reelSnippet);

    // Resolve state and city
    let resolvedState = state || '';
    let resolvedCity = city || '';
    if (!resolvedCity && location.includes(',')) {
      const parts = location.split(',');
      resolvedCity = parts[0].trim();
      resolvedState = parts[1].trim();
    } else if (!resolvedCity) {
      resolvedCity = location.trim();
    }

    const reelDocData = {
      title: reelHeadline,
      summary: reelSnippet,
      snippet: reelSnippet,
      bullets: [reelSnippet.slice(0, 80)],
      content: reelSnippet,
      category,
      contentType: 'REEL',
      reelBadge: badge,
      region: 'National',
      state: resolvedState,
      city: resolvedCity,
      location: {
        regionType: resolvedCity ? 'CITY' : 'NATIONAL',
        state: resolvedState,
        city: resolvedCity
      },
      sources,
      trustScore: finalScore,
      upvotes: 0,
      downvotes: 0,
      isVerified: true,
      contentHash,
      status: effectiveStatus,
      isScheduled: Boolean(isScheduled && scheduledPublishAt),
      scheduledPublishAt: effectiveScheduledPublishAt,
      isPinned: effectiveStatus === 'SCHEDULED' ? false : true,
      author,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000',
      mediaType: 'VIDEO_LOOP',
      mediaUrl: mediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4'
    };

    const conn = await connectDB();
    let savedArticle: any = null;

    if (conn && conn.connection.readyState === 1) {
      savedArticle = await Article.create(reelDocData);

      // Reward editor truthCredits
      try {
        await AdminUser.findOneAndUpdate(
          { email: 'editor@truthpulse.in' },
          { 
            $inc: { truthCredits: 25 },
            $push: {
              history: {
                action: `Published Breaking Reel: "${reelHeadline.slice(0, 30)}..."`,
                creditChange: 25,
                timestamp: new Date()
              }
            }
          }
        );
      } catch (e) {}
    } else {
      savedArticle = {
        _id: `reel-${Date.now()}`,
        ...reelDocData,
        createdAt: new Date().toISOString()
      };
    }

    // Dual-Sync Reel to Strapi Open-Source CMS
    let strapiSyncResult: any = null;
    try {
      strapiSyncResult = await publishArticleToStrapi({
        title: reelHeadline,
        summary: reelSnippet,
        snippet: reelSnippet,
        content: reelSnippet,
        category,
        contentType: 'REEL',
        reelBadge: badge,
        region: 'National',
        state: resolvedState,
        city: resolvedCity,
        trustScore: finalScore,
        author,
        imageUrl: reelDocData.imageUrl,
        mediaType: 'VIDEO_LOOP',
        mediaUrl: reelDocData.mediaUrl,
        sources
      });

      if (strapiSyncResult?.success && strapiSyncResult.strapiId && savedArticle?.save) {
        savedArticle.strapiId = strapiSyncResult.strapiId.toString();
        await savedArticle.save();
      }
    } catch (strapiErr) {
      console.warn('Strapi Reel dual-sync notice:', strapiErr);
    }

    const formattedShort = articleToShort(savedArticle);

    const message = effectiveStatus === 'SCHEDULED'
      ? `Breaking Video Reel scheduled for broadcast at ${effectiveScheduledPublishAt?.toLocaleString()}! +25 TruthCredits awarded.`
      : 'Breaking Video Reel published to live registry! +25 TruthCredits awarded.';

    return NextResponse.json({
      success: true,
      message,
      short: formattedShort,
      strapi: strapiSyncResult
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
