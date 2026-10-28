import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

// In-memory translation cache to guarantee sub-millisecond response for recurring dispatches
const translationMemoryCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 2000;

async function fetchGoogleTranslate(text: string, targetLang: string, sourceLang: string = 'auto'): Promise<string> {
  const cacheKey = `${sourceLang}:${targetLang}:${text.trim()}`;
  if (translationMemoryCache.has(cacheKey)) {
    return translationMemoryCache.get(cacheKey)!;
  }

  // 1. Try native fetch first
  const encodedQuery = encodeURIComponent(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedQuery}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0] || '').join('').trim();
        if (translated) {
          if (translationMemoryCache.size > MAX_CACHE_ENTRIES) {
            translationMemoryCache.clear();
          }
          translationMemoryCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch (err) {
    // Proceed to fallback https.get with loose certificate validation for local development environments
  }

  // 2. Fallback via Node https.get (handles local dev TLS/proxy certificate chains)
  try {
    const fallbackResult = await new Promise<string>((resolve, reject) => {
      https.get(
        url,
        {
          rejectUnauthorized: false,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        },
        (response) => {
          let rawData = '';
          response.on('data', (chunk) => { rawData += chunk; });
          response.on('end', () => {
            try {
              const parsed = JSON.parse(rawData);
              if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
                const textResult = parsed[0].map((item: any) => item[0] || '').join('').trim();
                resolve(textResult);
              } else {
                resolve(text);
              }
            } catch {
              resolve(text);
            }
          });
        }
      ).on('error', (e) => reject(e));
    });

    if (fallbackResult && fallbackResult !== text) {
      translationMemoryCache.set(cacheKey, fallbackResult);
      return fallbackResult;
    }
  } catch {
    // Both attempts failed, return original text safely
  }

  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, texts, targetLang, sourceLang = 'auto' } = body;

    if (!targetLang || targetLang === 'en') {
      return NextResponse.json({
        success: true,
        translated: texts || text,
        targetLang: targetLang || 'en'
      });
    }

    // Handle batch texts (e.g. title, summary, bullets in one round trip)
    if (Array.isArray(texts)) {
      const translatedList = await Promise.all(
        texts.map(async (t: string) => {
          if (!t || typeof t !== 'string' || !t.trim()) return t;
          return await fetchGoogleTranslate(t, targetLang, sourceLang);
        })
      );

      return NextResponse.json({
        success: true,
        translated: translatedList,
        targetLang
      });
    }

    // Handle single text
    if (text && typeof text === 'string') {
      const translated = await fetchGoogleTranslate(text, targetLang, sourceLang);
      return NextResponse.json({
        success: true,
        translated,
        targetLang
      });
    }

    return NextResponse.json({ success: false, error: 'No text or texts provided' }, { status: 400 });
  } catch (error: any) {
    console.error('Translation API route error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Translation failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('q');
  const targetLang = searchParams.get('target');
  const sourceLang = searchParams.get('source') || 'auto';

  if (!text || !targetLang || targetLang === 'en') {
    return NextResponse.json({ success: true, translated: text || '', targetLang: targetLang || 'en' });
  }

  const translated = await fetchGoogleTranslate(text, targetLang, sourceLang);
  return NextResponse.json({ success: true, translated, targetLang });
}
