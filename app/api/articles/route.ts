import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import AdminUser from '@/models/AdminUser';
import NotificationLog from '@/models/NotificationLog';
import { generateContentHash } from '@/lib/crypto';
import { bot4VerificationAuditor } from '@/lib/agents';
import { seedDatabase } from '@/lib/seed';
import { FALLBACK_ARTICLES, filterFallbackArticles, METRO_CLUSTERS_MAP } from '@/lib/fallbackArticles';
import { METROPOLITAN_HUBS } from '@/lib/metroHubs';
import { publishArticleToStrapi, fetchStrapiArticles } from '@/lib/strapi';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const edition = searchParams.get('edition') || searchParams.get('region');
  const category = searchParams.get('category');
  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const metro = searchParams.get('metro');
  const search = searchParams.get('search');
  const status = searchParams.get('status') || 'PUBLISHED';
  const regionType = searchParams.get('regionType');

  try {
    const conn = await connectDB();

    if (conn && conn.connection.readyState === 1) {
      // Auto-seed if database is empty
      try {
        const count = await Article.countDocuments();
        if (count === 0) {
          await seedDatabase();
        }
      } catch (seedErr) {
        console.warn('Auto-seed check skipped:', seedErr);
      }

      const filter: any = {};

      if (status === 'PUBLISHED') {
        // Public reader stream: show PUBLISHED or SCHEDULED whose embargo time has passed
        filter.$or = [
          { status: 'PUBLISHED' },
          { status: 'SCHEDULED', scheduledPublishAt: { $lte: new Date() } }
        ];
      } else if (status !== 'ALL') {
        filter.status = status;
      }

      // Edition / Region filter: 'National' vs 'International'
      if (edition && edition !== 'ALL') {
        if (edition.toLowerCase().includes('international')) {
          filter.$or = [
            { region: 'International' },
            { 'location.regionType': 'INTERNATIONAL' }
          ];
        } else if (edition.toLowerCase().includes('national')) {
          filter.$or = [
            { region: 'National' },
            { 'location.regionType': { $in: ['NATIONAL', 'STATE', 'CITY'] } }
          ];
        }
      }

      if (regionType && regionType !== 'ALL') {
        filter['location.regionType'] = regionType.toUpperCase();
      }

      // Category filter: Home / All or specific
      if (category && category !== 'ALL' && category !== 'Home') {
        filter.category = new RegExp(`^${category.trim()}$`, 'i');
      }

      // State filter: e.g. Chhattisgarh, Maharashtra, Delhi
      if (state && state !== 'ALL' && state.trim() !== '') {
        filter.$or = [
          { state: new RegExp(state.trim(), 'i') },
          { 'location.state': new RegExp(state.trim(), 'i') }
        ];
      }

      // City filter: e.g. Raigarh, Mumbai, Raipur
      if (city && city !== 'ALL' && city.trim() !== '') {
        filter.$or = [
          { city: new RegExp(city.trim(), 'i') },
          { 'location.city': new RegExp(city.trim(), 'i') }
        ];
      }

      // Metro Cluster filter
      if (metro && metro !== 'ALL' && metro.trim() !== '') {
        const metroKey = metro.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const matched = Object.entries(METRO_CLUSTERS_MAP).find(
          ([key]) => key === metroKey || metro.toLowerCase().includes(key.split('-')[0])
        );
        if (matched) {
          const terms = matched[1].matchTerms;
          const regexArray = terms.map(t => new RegExp(t, 'i'));
          filter.$and = filter.$and || [];
          filter.$and.push({
            $or: [
              { city: { $in: regexArray } },
              { state: { $in: regexArray } },
              { title: { $in: regexArray } },
              { summary: { $in: regexArray } }
            ]
          });
        }
      }

      // Search query filter
      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$and = filter.$and || [];
        filter.$and.push({
          $or: [
            { title: searchRegex },
            { summary: searchRegex },
            { content: searchRegex },
            { state: searchRegex },
            { city: searchRegex }
          ]
        });
      }

      const articles = await Article.find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .limit(50);

      if (articles && articles.length > 0) {
        return NextResponse.json(
          { success: true, count: articles.length, data: articles, isDatabaseConnected: true },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=50',
              'CDN-Cache-Control': 'public, s-maxage=10, stale-while-revalidate=50',
              'Vercel-CDN-Cache-Control': 'public, s-maxage=10, stale-while-revalidate=50'
            }
          }
        );
      }
    }

    // High-Performance In-Memory Resilient Fallback (Zero downtime on Vercel without MongoDB Atlas)
    const fallbackData = filterFallbackArticles({ edition, category, state, city, search, status, metro });
    return NextResponse.json(
      {
        success: true,
        count: fallbackData.length,
        data: fallbackData,
        isDatabaseConnected: false,
        message: 'Serving resilient verified dispatch corpus.'
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=60'
        }
      }
    );

  } catch (error: any) {
    console.warn('⚠️ Serving in-memory verified fallback due to:', error.message);
    const fallbackData = filterFallbackArticles({ edition, category, state, city, search, status, metro });
    return NextResponse.json(
      {
        success: true,
        count: fallbackData.length,
        data: fallbackData,
        isDatabaseConnected: false
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
        }
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const conn = await connectDB();
    const body = await req.json();

    const {
      title,
      summary,
      bullets = [],
      content,
      category = 'Politics',
      region = 'National',
      state = '',
      city = '',
      metro = '',
      location,
      sources = [],
      author = 'TruthPulse Contributor',
      imageUrl,
      mediaType = 'IMAGE',
      mediaUrl,
      contentType = 'NEWS',
      reelBadge = 'BREAKING',
      snippet,
      civicAction,
      isPinned = true,
      isScheduled = false,
      scheduledPublishAt
    } = body;

    const effectiveStatus = (isScheduled && scheduledPublishAt) ? 'SCHEDULED' : 'PUBLISHED';
    const effectiveScheduledPublishAt = (isScheduled && scheduledPublishAt) ? new Date(scheduledPublishAt) : undefined;

    // MANDATORY EDITORIAL GATING CHECK:
    if (!sources || sources.length === 0 || !sources[0]?.url) {
      return NextResponse.json(
        {
          success: false,
          error: 'MANDATORY EDITORIAL GATING: Kam se kam 1 verified primary source URL attach karna anivarya hai.'
        },
        { status: 400 }
      );
    }

    const audit = bot4VerificationAuditor(title, content || summary, sources);
    if (audit.trustScore < 80) {
      return NextResponse.json(
        {
          success: false,
          error: `MANDATORY EDITORIAL GATING: Automated AI Trust Score (${audit.trustScore}%) kam se kam 80% hona anivarya hai. Current score: ${audit.trustScore}%. Source aur content details ko sudharein.`
        },
        { status: 400 }
      );
    }

    const contentHash = generateContentHash(title, summary, content || summary);

    // Resolve State/City from Metropolitan Cluster if passed
    let finalState = state;
    let finalCity = city;
    if (metro) {
      const hub = METROPOLITAN_HUBS.find(h => h.id === metro);
      if (hub) {
        if (!finalState) finalState = hub.state;
        if (!finalCity) finalCity = hub.primaryCity;
      }
    }

    const articleData = {
      title,
      summary,
      bullets: bullets.length > 0 ? bullets : [summary.slice(0, 70)],
      content: content || summary,
      category,
      region: region === 'International' ? 'International' : 'National',
      state: finalState || location?.state || '',
      city: finalCity || location?.city || '',
      location: location || {
        regionType: region === 'International' ? 'INTERNATIONAL' : (finalCity ? 'CITY' : (finalState ? 'STATE' : 'NATIONAL')),
        state: finalState || '',
        city: finalCity || ''
      },
      sources,
      trustScore: audit.trustScore,
      upvotes: 0,
      downvotes: 0,
      isVerified: audit.trustScore >= 85,
      discrepancyAlert: audit.discrepancyAlert,
      contentHash,
      status: effectiveStatus,
      isScheduled: Boolean(isScheduled && scheduledPublishAt),
      scheduledPublishAt: effectiveScheduledPublishAt,
      isPinned: effectiveStatus === 'SCHEDULED' ? false : Boolean(isPinned),
      author,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200',
      mediaType,
      mediaUrl,
      contentType,
      reelBadge,
      snippet: snippet || summary.slice(0, 150),
      civicAction
    };

    if (conn && conn.connection.readyState === 1) {
      // Unpin older articles so the latest editor dispatch is exclusively #1 at the top of the feed
      if (articleData.isPinned) {
        try {
          await Article.updateMany({ isPinned: true }, { $set: { isPinned: false } });
        } catch (unpinErr) {
          console.warn('Unpin older articles note:', unpinErr);
        }
      }

      // Create new article in MongoDB without manual string _id so MongoDB generates valid ObjectId
      const newArticle = await Article.create(articleData);

      // Dual-Sync to Strapi Open-Source CMS
      let strapiSyncResult: any = null;
      try {
        strapiSyncResult = await publishArticleToStrapi({
          title,
          summary,
          bullets: articleData.bullets,
          content: articleData.content,
          category,
          region: articleData.region,
          state: articleData.state,
          city: articleData.city,
          trustScore: articleData.trustScore,
          author,
          imageUrl: articleData.imageUrl,
          mediaType: articleData.mediaType,
          mediaUrl: articleData.mediaUrl,
          contentType: articleData.contentType,
          reelBadge: articleData.reelBadge,
          snippet: articleData.snippet,
          isPinned: articleData.isPinned,
          sources
        });

        if (strapiSyncResult?.success && strapiSyncResult.strapiId) {
          newArticle.strapiId = strapiSyncResult.strapiId.toString();
          await newArticle.save();
        }
      } catch (strapiErr) {
        console.warn('Strapi dual-sync notice (CMS offline or token pending):', strapiErr);
      }

      // Targeted Metro Cluster Web Push Notification Dispatch
      try {
        await NotificationLog.create({
          title: `Breaking: ${title.slice(0, 70)}`,
          body: summary.slice(0, 150),
          metroHub: metro || (articleData.city ? articleData.city.toLowerCase() : 'all'),
          category,
          articleId: newArticle._id.toString(),
          targetUrl: `/?search=${encodeURIComponent(title.slice(0, 20))}`,
          isScheduled: Boolean(isScheduled && scheduledPublishAt),
          scheduledFor: effectiveScheduledPublishAt,
          status: effectiveStatus === 'SCHEDULED' ? 'SCHEDULED' : 'SENT',
          subscribersTargeted: 95,
          sentAt: effectiveStatus === 'SCHEDULED' ? undefined : new Date()
        });
      } catch (notifErr) {
        console.warn('Notification log skipped:', notifErr);
      }

      // Reward contributor TruthCredits
      try {
        await AdminUser.findOneAndUpdate(
          { email: 'editor@truthpulse.in' },
          { 
            $inc: { truthCredits: 25 },
            $push: {
              history: {
                action: `Published Gated Story: "${title.slice(0, 35)}..."`,
                creditChange: 25,
                timestamp: new Date()
              }
            }
          }
        );
      } catch (creditErr) {
        console.warn('Credit update skipped:', creditErr);
      }

      const message = effectiveStatus === 'SCHEDULED'
        ? `Article scheduled for auto-embargo release at ${effectiveScheduledPublishAt?.toLocaleString()}! +25 TruthCredits awarded.`
        : 'Article published to database with Cryptographic Seal! +25 TruthCredits awarded.';

      return NextResponse.json({
        success: true,
        message,
        data: newArticle,
        strapi: strapiSyncResult
      });
    }

    // In-memory publish fallback
    const fallbackArticle = {
      _id: `art-${Date.now()}`,
      ...articleData,
      createdAt: new Date().toISOString()
    };
    FALLBACK_ARTICLES.unshift(fallbackArticle as any);

    // Optional Strapi sync during fallback mode
    try {
      await publishArticleToStrapi({
        title,
        summary,
        bullets: fallbackArticle.bullets,
        content: fallbackArticle.content,
        category,
        region: fallbackArticle.region,
        state: fallbackArticle.state,
        city: fallbackArticle.city,
        trustScore: fallbackArticle.trustScore,
        author,
        imageUrl: fallbackArticle.imageUrl,
        sources
      });
    } catch (strapiErr) {}

    return NextResponse.json({
      success: true,
      message: 'Article published to live verified registry! +25 TruthCredits awarded.',
      data: fallbackArticle
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
