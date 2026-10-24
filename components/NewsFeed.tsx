'use client';

import React, { useState, useEffect } from 'react';
import NewsCard, { ArticleItem } from './NewsCard';
import NativeSponsoredCard, { DEFAULT_PARTNER_CARDS } from './NativeSponsoredCard';
import BreakingShorts, { DEFAULT_BREAKING_SHORTS, BreakingShort } from './BreakingShorts';
import { AuthUser } from './AuthModal';
import { SupportedLanguage, getUIText, translateHeadline } from '@/lib/translations';
import { 
  Flame, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  Cpu, 
  X, 
  Radio, 
  ArrowRight,
  TrendingUp,
  Clock,
  Wifi
} from 'lucide-react';
import { ALL_INDIAN_STATES } from './SidebarDrawer';

interface NewsFeedProps {
  articles: ArticleItem[];
  loading: boolean;
  error: string | null;
  currentEdition: 'National' | 'International';
  currentCategory: string;
  currentState: string;
  onSelectState: (state: string) => void;
  onClearFilters: () => void;
  onOpenCryptoSeal?: (article: ArticleItem) => void;
  onOpenForensics?: (imageUrl: string, title: string) => void;
  onOpenGazetteRag?: (claim: string) => void;
  onOpenCommunityNotes?: (articleId: string, articleTitle: string) => void;
  onOpenUpiTip?: (authorName: string, articleTitle: string) => void;
  onSelectArticle?: (article: ArticleItem) => void;
  currentUser: AuthUser | null;
  onRequireAuth: (reason?: string) => void;
  onOpenReels?: (index: number) => void;
  currentLang?: SupportedLanguage;
}

export default function NewsFeed({
  articles,
  loading,
  error,
  currentEdition,
  currentCategory,
  currentState,
  onSelectState,
  onClearFilters,
  onOpenCryptoSeal,
  onOpenForensics,
  onOpenGazetteRag,
  onOpenCommunityNotes,
  onOpenUpiTip,
  onSelectArticle,
  currentUser,
  onRequireAuth,
  onOpenReels,
  currentLang = 'en'
}: NewsFeedProps) {
  // Live SSE Wire Alerts
  const [liveSseHeadline, setLiveSseHeadline] = useState<string | null>(null);
  const [sseConnected, setSseConnected] = useState<boolean>(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/stream/breaking');
      
      eventSource.onopen = () => {
        setSseConnected(true);
      };

      eventSource.addEventListener('breaking_alert', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data && data.headline) {
            setLiveSseHeadline(data.headline);
          }
        } catch (err) {}
      });

      eventSource.onerror = () => {
        setSseConnected(false);
      };
    } catch (e) {
      // Fallback
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // Identify Hero / Featured Story (pinned or highest trustScore / first article)
  const heroArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? articles.slice(1) : [];

  // Breaking ticker headline (prioritizes live SSE alert, then hero article, then default)
  const rawBreaking = liveSseHeadline || (heroArticle 
    ? heroArticle.title 
    : 'Parliament clears landmark Electoral Transparency and Digital Infrastructure Bill in New Delhi.');

  const breakingHeadline = currentLang && currentLang !== 'en'
    ? translateHeadline(rawBreaking, currentLang)
    : rawBreaking;

  const hasActiveFilter = (currentCategory && currentCategory !== 'ALL' && currentCategory !== 'Home') || 
                          (currentState && currentState !== 'All India');

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 font-sans overflow-x-hidden">
      
      {/* 1. TOP BREAKING NEWS TICKER BANNER */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-0.5 shadow-md overflow-hidden w-full">
        <div className="bg-slate-950 dark:bg-slate-950 rounded-[14px] px-3.5 py-2.5 flex items-center gap-3 w-full">
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[11px] uppercase tracking-wider shrink-0 animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>{getUIText('breakingNews', currentLang)}</span>
          </div>

          <div className="flex-1 overflow-hidden min-w-0">
            <p className="text-xs sm:text-sm font-bold text-slate-100 truncate hover:text-red-400 transition cursor-pointer">
              {breakingHeadline}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 shrink-0">
            <span className={`w-2 h-2 rounded-full ${sseConnected ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
            <span>{getUIText('realTimeWire', currentLang)}</span>
          </div>
        </div>
      </div>

      {/* 2. BREAKING NEWS "SHORTS" REEL ENGINE (10s Auto-Transition & Mobile Story Rings) */}
      <BreakingShorts 
        onOpenReels={onOpenReels}
        onSelectArticle={(short) => {
          if (onSelectArticle) {
            const matched = articles.find(a => a._id === short.fullArticleId || a.title.toLowerCase().includes(short.headline.slice(0, 25).toLowerCase()));
            if (matched) {
              onSelectArticle(matched);
            }
          }
        }} 
      />

      {/* 3. STATE SELECTION PILL BUTTONS (When Edition is 'National') */}
      {currentEdition === 'National' && (
        <div className="mb-6 w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Explore State Desks (India)
              </h2>
            </div>
            {currentState && currentState !== 'All India' && (
              <button
                onClick={() => onSelectState('All India')}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
              >
                <span>Reset to All India</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Horizontal Pill Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 w-full max-w-full">
            {ALL_INDIAN_STATES.slice(0, 10).map((state) => {
              const isSelected = currentState === state || (!currentState && state === 'All India');
              return (
                <button
                  key={state}
                  onClick={() => onSelectState(state)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {state}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ACTIVE FILTER PILL BADGES */}
      {hasActiveFilter && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs w-full max-w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 dark:text-slate-400">Active Filters:</span>
            
            {currentCategory && currentCategory !== 'ALL' && currentCategory !== 'Home' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 font-bold border border-red-500/20">
                <span>Category: {currentCategory}</span>
              </span>
            )}

            {currentState && currentState !== 'All India' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
                <span>State: {currentState}</span>
              </span>
            )}

            <span className="text-slate-500 dark:text-slate-400 font-mono">
              ({articles.length} verified dispatches found)
            </span>
          </div>

          <button
            onClick={onClearFilters}
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 flex items-center gap-1"
          >
            <span>Clear All</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4. LOADING & ERROR STATES */}
      {loading && (
        <div className="py-24 text-center space-y-3">
          <Cpu className="w-9 h-9 text-red-600 animate-spin mx-auto" />
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
            Synchronizing live state feeds & cryptographic verification registers...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center space-y-3">
          <AlertCircle className="w-9 h-9 text-red-500 mx-auto" />
          <h3 className="text-base font-bold text-red-500">Failed to load news dispatches</h3>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
      )}

      {/* 5. EMPTY STATE */}
      {!loading && !error && articles.length === 0 && (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <MapPin className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No articles found for selected filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try switching to "All India" or clearing your category filters to view verified dispatches from other regional desks.
          </p>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* 6. HERO FEATURED STORY SECTION */}
      {!loading && !error && heroArticle && (
        <div className="mb-10 w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-red-600 dark:text-red-400">
              {getUIText('topStoryLead', currentLang)}
            </h2>
          </div>

          <NewsCard 
            article={heroArticle} 
            isHero={true}
            currentUser={currentUser}
            onRequireAuth={onRequireAuth}
            onOpenCryptoSeal={onOpenCryptoSeal} 
            onOpenForensics={onOpenForensics}
            onOpenGazetteRag={onOpenGazetteRag}
            onOpenCommunityNotes={onOpenCommunityNotes}
            onOpenUpiTip={onOpenUpiTip}
            currentLang={currentLang}
          />
        </div>
      )}

      {/* 7. THREE-COLUMN RESPONSIVE CARD GRID */}
      {!loading && !error && gridArticles.length > 0 && (
        <div id="news-grid-section" className="w-full max-w-full">
          <div className="flex items-center justify-between pb-2 mb-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{getUIText('verifiedDispatches', currentLang)}</span>
              <span className="text-xs font-mono font-normal text-slate-500">
                ({gridArticles.length} stories)
              </span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {getUIText('doubleVerifiedFeed', currentLang)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.map((article, index) => (
              <React.Fragment key={article._id}>
                
                <NewsCard
                  article={article}
                  currentUser={currentUser}
                  onRequireAuth={onRequireAuth}
                  onOpenCryptoSeal={onOpenCryptoSeal}
                  onOpenForensics={onOpenForensics}
                  onOpenGazetteRag={onOpenGazetteRag}
                  onOpenCommunityNotes={onOpenCommunityNotes}
                  onOpenUpiTip={onOpenUpiTip}
                  currentLang={currentLang}
                />

                {/* In-feed native sponsored partner card after index 2 */}
                {index === 2 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <NativeSponsoredCard partner={DEFAULT_PARTNER_CARDS[0]} />
                  </div>
                )}

              </React.Fragment>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
