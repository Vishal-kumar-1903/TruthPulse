import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import { FALLBACK_ARTICLES } from '@/lib/fallbackArticles';
import ArticleReaderView from '@/components/ArticleReaderView';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string) {
  let article: any = null;

  try {
    const conn = await connectDB();
    if (conn && conn.connection.readyState === 1) {
      article = await Article.findById(id).lean();
    }
  } catch (err) {
    // MongoDB lookup failed or invalid ObjectId; try fallback
  }

  if (!article) {
    article = FALLBACK_ARTICLES.find(
      (a) => a._id === id || a.contentHash === id
    );
  }

  if (article && article._id) {
    // Normalize object for serialization
    return JSON.parse(JSON.stringify(article));
  }

  return null;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truthpulse-live.web.app';

  if (!article) {
    return {
      title: 'Article Not Found | TruthPulse Intelligence',
      description: 'The requested verified dispatch could not be found.',
    };
  }

  const title = `${article.title} | TruthPulse`;
  const description = article.summary || 'Decentralized verified intelligence dispatch.';
  const shareImage = article.mediaUrl || article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200';
  const articleUrl = `${baseUrl}/article/${article._id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName: 'TruthPulse - Citizen Intelligence & Fact-Checking Ledger',
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImage],
      creator: '@TruthPulseIndia',
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = await getArticle(id);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truthpulse-live.web.app';

  if (!article) {
    notFound();
  }

  // Schema.org NewsArticle JSON-LD for Google News & Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [article.mediaUrl || article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200'],
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Person',
      name: article.author || 'TruthPulse Bureau',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TruthPulse',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/article/${article._id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleReaderView article={article} siteUrl={baseUrl} />
    </>
  );
}
