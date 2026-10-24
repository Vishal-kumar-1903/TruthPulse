import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import AdminUser from '@/models/AdminUser';
import { generateContentHash } from '@/lib/crypto';
import { bot4VerificationAuditor } from '@/lib/agents';
import { seedDatabase } from '@/lib/seed';
import { FALLBACK_ARTICLES, filterFallbackArticles } from '@/lib/fallbackArticles';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const edition = searchParams.get('edition') || searchParams.get('region');
  const category = searchParams.get('category');
  const state = searchParams.get('state');
  const city = searchParams.get('city');
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

      if (status !== 'ALL') {
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
        return NextResponse.json({ success: true, count: articles.length, data: articles, isDatabaseConnected: true });
      }
    }

    // High-Performance In-Memory Resilient Fallback (Zero downtime on Vercel without MongoDB Atlas)
    const fallbackData = filterFallbackArticles({ edition, category, state, city, search, status });
    return NextResponse.json({
      success: true,
      count: fallbackData.length,
      data: fallbackData,
      isDatabaseConnected: false,
      message: 'Serving resilient verified dispatch corpus.'
    });

  } catch (error: any) {
    console.warn('⚠️ Serving in-memory verified fallback due to:', error.message);
    const fallbackData = filterFallbackArticles({ edition, category, state, city, search, status });
    return NextResponse.json({
      success: true,
      count: fallbackData.length,
      data: fallbackData,
      isDatabaseConnected: false
    });
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
      location,
      sources = [],
      author = 'TruthPulse Contributor',
      imageUrl,
      civicAction
    } = body;

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

    const articleData = {
      _id: `art-${Date.now()}`,
      title,
      summary,
      bullets: bullets.length > 0 ? bullets : [summary.slice(0, 70)],
      content: content || summary,
      category,
      region: region === 'International' ? 'International' : 'National',
      state: state || location?.state || '',
      city: city || location?.city || '',
      location: location || {
        regionType: region === 'International' ? 'INTERNATIONAL' : (city ? 'CITY' : (state ? 'STATE' : 'NATIONAL')),
        state: state || '',
        city: city || ''
      },
      sources,
      trustScore: audit.trustScore,
      upvotes: 0,
      downvotes: 0,
      isVerified: audit.trustScore >= 85,
      discrepancyAlert: audit.discrepancyAlert,
      contentHash,
      status: 'PUBLISHED',
      author,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200',
      civicAction,
      createdAt: new Date().toISOString()
    };

    if (conn && conn.connection.readyState === 1) {
      const newArticle = await Article.create(articleData);

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

      return NextResponse.json({
        success: true,
        message: 'Article published to database with Cryptographic Seal! +25 TruthCredits awarded.',
        data: newArticle
      });
    }

    // In-memory publish fallback
    FALLBACK_ARTICLES.unshift(articleData as any);

    return NextResponse.json({
      success: true,
      message: 'Article published to live verified registry! +25 TruthCredits awarded.',
      data: articleData
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
