import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import { FALLBACK_ARTICLES } from '@/lib/fallbackArticles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truthpulse-live.web.app';

  let articleUrls: MetadataRoute.Sitemap = [];

  try {
    const conn = await connectDB();
    if (conn && conn.connection.readyState === 1) {
      const articles = await Article.find({}, '_id updatedAt createdAt')
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      if (articles && articles.length > 0) {
        articleUrls = articles.map((art: any) => ({
          url: `${baseUrl}/article/${art._id}`,
          lastModified: art.updatedAt || art.createdAt || new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        }));
      }
    }
  } catch (err) {
    // MongoDB lookup failed, fallback to in-memory articles
  }

  if (articleUrls.length === 0) {
    articleUrls = FALLBACK_ARTICLES.map((art) => ({
      url: `${baseUrl}/article/${art._id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shorts`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/reels`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/magazine`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/studio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...articleUrls];
}
