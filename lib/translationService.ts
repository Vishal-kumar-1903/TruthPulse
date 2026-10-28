'use client';

import { useState, useEffect } from 'react';
import { SupportedLanguage, translateContentText, translateHeadline, translateArticle } from './translations';
import { ArticleItem } from '@/components/NewsCard';

// Client-side cache to eliminate repeated API calls
const clientTranslationCache = new Map<string, string>();

function getCacheKey(text: string, lang: string): string {
  return `${lang}:${text.trim()}`;
}

/**
 * Synchronous instant check for existing translation in dictionary, memory cache, or localStorage
 */
export function getCachedTranslation(text: string, targetLang: SupportedLanguage): string | null {
  if (!text || targetLang === 'en') return text;
  
  // 1. Instant static dictionary
  const dictMatch = translateContentText(text, targetLang);
  if (dictMatch && dictMatch !== text) {
    return dictMatch;
  }

  // 2. Memory cache
  const key = getCacheKey(text, targetLang);
  if (clientTranslationCache.has(key)) {
    return clientTranslationCache.get(key)!;
  }

  // 3. LocalStorage persistence
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`tp_tr_${key.slice(0, 80)}`);
      if (stored) {
        clientTranslationCache.set(key, stored);
        return stored;
      }
    } catch {}
  }

  return null;
}

/**
 * Save translation into runtime memory and localStorage
 */
export function setCachedTranslation(text: string, targetLang: SupportedLanguage, translated: string) {
  if (!text || !translated || text === translated) return;
  const key = getCacheKey(text, targetLang);
  clientTranslationCache.set(key, translated);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`tp_tr_${key.slice(0, 80)}`, translated);
    } catch {}
  }
}

/**
 * Asynchronously translates single text using /api/translate
 */
export async function translateAsync(text: string, targetLang: SupportedLanguage): Promise<string> {
  if (!text || targetLang === 'en') return text;

  const cached = getCachedTranslation(text, targetLang);
  if (cached) return cached;

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.translated) {
        setCachedTranslation(text, targetLang, data.translated);
        return data.translated;
      }
    }
  } catch (err) {
    console.warn(`[TruthPulse Translate] Fallback for "${text.slice(0, 20)}...":`, err);
  }

  return text;
}

/**
 * Asynchronously translates a batch of texts in one single network round-trip
 */
export async function translateBatchAsync(texts: string[], targetLang: SupportedLanguage): Promise<string[]> {
  if (!texts || texts.length === 0 || targetLang === 'en') return texts;

  const results: string[] = new Array(texts.length);
  const uncachedIndices: number[] = [];
  const uncachedTexts: string[] = [];

  // Check cache for each item first
  texts.forEach((t, i) => {
    if (!t) {
      results[i] = t;
      return;
    }
    const cached = getCachedTranslation(t, targetLang);
    if (cached) {
      results[i] = cached;
    } else {
      uncachedIndices.push(i);
      uncachedTexts.push(t);
    }
  });

  // If all were cached, return immediately
  if (uncachedTexts.length === 0) {
    return results;
  }

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: uncachedTexts, targetLang })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.translated)) {
        data.translated.forEach((trans: string, idx: number) => {
          const originalIndex = uncachedIndices[idx];
          const originalText = uncachedTexts[idx];
          results[originalIndex] = trans || originalText;
          setCachedTranslation(originalText, targetLang, trans || originalText);
        });
        return results;
      }
    }
  } catch (err) {
    console.warn('[TruthPulse Translate] Batch translation error:', err);
  }

  // Fallback to original text for uncached
  uncachedIndices.forEach((origIdx, idx) => {
    results[origIdx] = uncachedTexts[idx];
  });

  return results;
}

/**
 * Translates an entire article (title, summary, bullets) in one batch call
 */
export async function translateArticleAsync(
  article: ArticleItem, 
  targetLang: SupportedLanguage
): Promise<{ title: string; summary: string; bullets: string[] }> {
  if (!article || targetLang === 'en') {
    return {
      title: article?.title || '',
      summary: article?.summary || '',
      bullets: article?.bullets || []
    };
  }

  const textsToTranslate = [
    article.title,
    article.summary,
    ...(article.bullets || [])
  ];

  const translatedList = await translateBatchAsync(textsToTranslate, targetLang);

  return {
    title: translatedList[0] || article.title,
    summary: translatedList[1] || article.summary,
    bullets: translatedList.slice(2)
  };
}

/**
 * React hook for auto-translating single strings (e.g. headlines, captions, ticker text)
 */
export function useAutoTranslate(text: string, targetLang: SupportedLanguage = 'en'): string {
  const [translated, setTranslated] = useState<string>(() => {
    const cached = getCachedTranslation(text, targetLang);
    return cached || text;
  });

  useEffect(() => {
    if (!text || targetLang === 'en') {
      setTranslated(text);
      return;
    }

    const cached = getCachedTranslation(text, targetLang);
    if (cached) {
      setTranslated(cached);
      return;
    }

    let isMounted = true;
    translateAsync(text, targetLang).then((res) => {
      if (isMounted && res) {
        setTranslated(res);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [text, targetLang]);

  return translated;
}

/**
 * React hook for auto-translating a full NewsCard article with 0 layout shift
 */
export function useTranslatedArticle(article: ArticleItem, targetLang: SupportedLanguage = 'en') {
  const [data, setData] = useState(() => {
    const cachedTitle = getCachedTranslation(article.title, targetLang) || article.title;
    const cachedSummary = getCachedTranslation(article.summary, targetLang) || article.summary;
    const cachedBullets = article.bullets?.map(b => getCachedTranslation(b, targetLang) || b) || [];

    return {
      title: cachedTitle,
      summary: cachedSummary,
      bullets: cachedBullets
    };
  });

  useEffect(() => {
    if (!article) return;

    if (targetLang === 'en') {
      setData({
        title: article.title,
        summary: article.summary,
        bullets: article.bullets || []
      });
      return;
    }

    // Instant check
    const cachedTitle = getCachedTranslation(article.title, targetLang);
    const cachedSummary = getCachedTranslation(article.summary, targetLang);
    const allBulletsCached = article.bullets?.every(b => !!getCachedTranslation(b, targetLang)) ?? true;

    if (cachedTitle && cachedSummary && allBulletsCached) {
      setData({
        title: cachedTitle,
        summary: cachedSummary,
        bullets: article.bullets?.map(b => getCachedTranslation(b, targetLang) || b) || []
      });
      return;
    }

    let isMounted = true;
    translateArticleAsync(article, targetLang).then((res) => {
      if (isMounted) {
        setData(res);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [article._id, article.title, article.summary, article.bullets, targetLang]);

  return data;
}
