/**
 * TruthPulse Strapi CMS Integration Client
 * Connects Next.js Editorial Ecosystem with Strapi Open-Source Headless CMS
 * Supports Strapi v4 and Strapi v5 Content APIs & Draft-and-Publish Workflows.
 */

export interface StrapiArticleInput {
  title: string;
  summary: string;
  bullets?: string[];
  content?: string;
  category: string;
  region?: 'National' | 'International' | string;
  state?: string;
  city?: string;
  trustScore?: number;
  sources?: Array<{ name: string; url: string; stance?: string }>;
  author?: string;
  imageUrl?: string;
  mediaType?: 'IMAGE' | 'VIDEO_LOOP' | 'LOTTIE_ANIMATION';
  mediaUrl?: string;
  contentType?: 'NEWS' | 'ARTICLE' | 'REEL' | string;
  reelBadge?: 'BREAKING' | 'ALERT' | 'FACT-CHECK' | string;
  snippet?: string;
  isPinned?: boolean;
  publishedAt?: string | null; // null for draft, ISO string for published
}

export interface StrapiConfig {
  url: string;
  apiToken?: string;
  webhookSecret?: string;
}

export function getStrapiURL(path = ''): string {
  const base = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${base.replace(/\/$/, '')}${path}`;
}

export function getStrapiToken(): string | undefined {
  return process.env.STRAPI_API_TOKEN;
}

/**
 * Universal Fetcher for Strapi REST API
 */
export async function fetchStrapi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const url = getStrapiURL(endpoint);
  const token = getStrapiToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Strapi HTTP Error');
      return { data: null, error: `Strapi [${res.status}]: ${errorText}`, status: res.status };
    }

    const json = await res.json();
    return { data: json.data || json, error: null, status: res.status };
  } catch (err: any) {
    return {
      data: null,
      error: err.name === 'AbortError' ? 'Strapi connection timed out' : (err.message || 'Strapi unreachable'),
      status: 503
    };
  }
}

/**
 * Publish an article into Strapi CMS
 * Supports immediate publishing or saving as draft.
 */
export async function publishArticleToStrapi(
  article: StrapiArticleInput,
  options: { publishImmediately?: boolean } = { publishImmediately: true }
): Promise<{ success: boolean; strapiId?: string | number; error?: string; data?: any }> {
  const payload = {
    data: {
      title: article.title,
      summary: article.summary,
      bullets: article.bullets || [article.summary.slice(0, 70)],
      content: article.content || article.summary,
      category: article.category,
      region: article.region || 'National',
      state: article.state || '',
      city: article.city || '',
      trustScore: article.trustScore ?? 92,
      author: article.author || 'Editorial Bureau',
      imageUrl: article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200',
      mediaType: article.mediaType || 'IMAGE',
      mediaUrl: article.mediaUrl || '',
      contentType: article.contentType || 'NEWS',
      reelBadge: article.reelBadge || 'BREAKING',
      snippet: article.snippet || article.summary.slice(0, 150),
      isPinned: Boolean(article.isPinned),
      sources: article.sources || [],
      publishedAt: options.publishImmediately ? (article.publishedAt || new Date().toISOString()) : null
    }
  };

  const res = await fetchStrapi('/api/articles', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (res.error || !res.data) {
    return { success: false, error: res.error || 'Failed to dispatch article to Strapi' };
  }

  // Handle Strapi v4 ({ id, attributes: { ... } }) or Strapi v5 ({ id, documentId })
  const strapiId = res.data.id || res.data.documentId || res.data._id;
  return { success: true, strapiId, data: res.data };
}

/**
 * Fetch published articles from Strapi
 */
export async function fetchStrapiArticles(params: {
  category?: string;
  state?: string;
  city?: string;
  search?: string;
  limit?: number;
} = {}): Promise<any[]> {
  const query = new URLSearchParams();
  query.append('populate', '*');
  query.append('sort', 'createdAt:desc');
  
  if (params.limit) {
    query.append('pagination[limit]', params.limit.toString());
  } else {
    query.append('pagination[limit]', '25');
  }

  if (params.category && params.category !== 'ALL' && params.category !== 'Home') {
    query.append('filters[category][$eqi]', params.category);
  }

  if (params.state && params.state !== 'ALL' && params.state !== 'All India') {
    query.append('filters[state][$eqi]', params.state);
  }

  if (params.city && params.city !== 'ALL') {
    query.append('filters[city][$eqi]', params.city);
  }

  if (params.search) {
    query.append('filters[title][$containsi]', params.search);
  }

  const res = await fetchStrapi(`/api/articles?${query.toString()}`);
  if (!res.data || !Array.isArray(res.data)) {
    return [];
  }

  return res.data.map(normalizeStrapiArticle);
}

/**
 * Normalize Strapi Article format (both Strapi v4 and v5) into TruthPulse schema
 */
export function normalizeStrapiArticle(item: any): any {
  if (!item) return null;

  // Strapi v4 format has attributes
  const attrs = item.attributes || item;
  const id = item.id?.toString() || item.documentId || item._id?.toString() || `strapi-${Math.random()}`;

  return {
    _id: id,
    title: attrs.title || 'Untitled Strapi Wire',
    summary: attrs.summary || '',
    bullets: Array.isArray(attrs.bullets) ? attrs.bullets : [attrs.summary?.slice(0, 70) || ''],
    content: attrs.content || attrs.summary || '',
    category: attrs.category || 'General',
    region: attrs.region || 'National',
    state: attrs.state || '',
    city: attrs.city || '',
    location: {
      regionType: attrs.region === 'International' ? 'INTERNATIONAL' : (attrs.city ? 'CITY' : (attrs.state ? 'STATE' : 'NATIONAL')),
      state: attrs.state || '',
      city: attrs.city || ''
    },
    sources: attrs.sources || [
      { name: 'Strapi Headless CMS Editorial', url: 'http://localhost:1337', stance: 'CORROBORATING' }
    ],
    trustScore: attrs.trustScore ?? 90,
    upvotes: attrs.upvotes || 0,
    downvotes: attrs.downvotes || 0,
    isVerified: attrs.isVerified ?? true,
    contentHash: attrs.contentHash || `strapi_hash_${id}`,
    status: attrs.publishedAt ? 'PUBLISHED' : 'DRAFT',
    isPinned: Boolean(attrs.isPinned),
    author: attrs.author || 'Strapi Editor',
    imageUrl: attrs.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200',
    mediaType: attrs.mediaType || 'IMAGE',
    mediaUrl: attrs.mediaUrl || '',
    civicAction: attrs.civicAction || undefined,
    createdAt: attrs.createdAt || new Date().toISOString(),
    updatedAt: attrs.updatedAt || new Date().toISOString(),
    isStrapiSynced: true,
    strapiId: item.id || item.documentId
  };
}

/**
 * Check whether the Strapi instance is online and reachable
 */
export async function checkStrapiHealth(overrideUrl?: string): Promise<{ online: boolean; url: string; latencyMs: number; error?: string }> {
  const base = overrideUrl || getStrapiURL();
  const cleanBase = base.replace(/\/$/, '');
  const url = `${cleanBase}/api/articles?pagination[limit]=1`;
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500); // 3.5s ping

    const res = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeout);
    const latencyMs = Date.now() - start;

    return {
      online: res.status < 500, // 200, 401, 403, 404 all mean server is alive
      url: cleanBase,
      latencyMs
    };
  } catch (err: any) {
    return {
      online: false,
      url: cleanBase,
      latencyMs: Date.now() - start,
      error: err.name === 'AbortError' ? 'Connection timed out' : 'Server Offline / Connection Refused'
    };
  }
}
