import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import { FALLBACK_ARTICLES } from '@/lib/fallbackArticles';

function escapeXml(unsafe: string = ''): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truthpulse-live.web.app';
  let articles: any[] = [];

  try {
    const conn = await connectDB();
    if (conn && conn.connection.readyState === 1) {
      articles = await Article.find({})
        .sort({ createdAt: -1 })
        .limit(30)
        .lean();
    }
  } catch (err) {
    // fallback
  }

  if (!articles || articles.length === 0) {
    articles = FALLBACK_ARTICLES;
  }

  const itemsXml = articles
    .map((art) => {
      const pubDate = art.createdAt ? new Date(art.createdAt).toUTCString() : new Date().toUTCString();
      const link = `${baseUrl}/article/${art._id}`;
      return `
    <item>
      <title>${escapeXml(art.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(art.summary || '')}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(art.category || 'News')}</category>
      <author>${escapeXml(art.author || 'TruthPulse Bureau')}</author>
    </item>`;
    })
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TruthPulse - Decentralized Verified Intelligence Feed</title>
    <link>${baseUrl}</link>
    <description>Real-time citizen intelligence, cryptographic consensus, and fact-checking ledger.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate',
    },
  });
}
