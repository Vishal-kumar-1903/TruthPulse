'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SidebarDrawer from '@/components/SidebarDrawer';
import NewsFeed from '@/components/NewsFeed';
import GeoDetector from '@/components/GeoDetector';
import { AuthUser } from '@/components/AuthModal';
import { DEFAULT_BREAKING_SHORTS } from '@/components/BreakingShorts';
import { ArticleItem } from '@/components/NewsCard';
import { SupportedLanguage } from '@/lib/translations';
import { analyzeMediaForensics } from '@/lib/forensics';
import { queryGazetteRag } from '@/lib/ragEngine';
import { FALLBACK_ARTICLES, filterFallbackArticles } from '@/lib/fallbackArticles';
import { METROPOLITAN_HUBS } from '@/lib/metroHubs';
import { usePortalModals } from '@/hooks/usePortalModals';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Cpu, Sparkles } from 'lucide-react';

// Code-splitting heavy interactive modals with dynamic imports (ssr: false)
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });
const LiveStreamModal = dynamic(() => import('@/components/LiveStreamModal'), { ssr: false });
const ReelsViewer = dynamic(() => import('@/components/ReelsViewer'), { ssr: false });
const CryptoSealBadge = dynamic(() => import('@/components/CryptoSealBadge'), { ssr: false });
const MediaForensicsModal = dynamic(() => import('@/components/MediaForensicsModal'), { ssr: false });
const GazetteRagModal = dynamic(() => import('@/components/GazetteRagModal'), { ssr: false });
const CommunityNotesDrawer = dynamic(() => import('@/components/CommunityNotesDrawer'), { ssr: false });
const WhatsAppFactCheckModal = dynamic(() => import('@/components/WhatsAppFactCheckModal'), { ssr: false });
const UpiTipModal = dynamic(() => import('@/components/UpiTipModal'), { ssr: false });

function NewsPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Parameters
  const editionParam = (searchParams.get('edition') as 'National' | 'International') || 'National';
  const categoryParam = searchParams.get('category') || 'Home';
  const stateParam = searchParams.get('state') || 'All India';
  const cityParam = searchParams.get('city') || '';
  const metroParam = searchParams.get('metro') || '';
  const searchParam = searchParams.get('search') || '';

  // Core Feed Filter State
  const [currentEdition, setCurrentEdition] = useState<'National' | 'International'>(editionParam);
  const [currentCategory, setCurrentCategory] = useState<string>(categoryParam);
  const [currentState, setCurrentState] = useState<string>(stateParam);
  const [currentCity, setCurrentCity] = useState<string>(cityParam);
  const [currentMetro, setCurrentMetro] = useState<string>(metroParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);

  // Article data state - Pre-populated with instant verified dispatches for 0ms initial paint!
  const [articles, setArticles] = useState<ArticleItem[]>(() => {
    return filterFallbackArticles({
      edition: editionParam,
      category: categoryParam,
      state: stateParam,
      city: cityParam,
      metro: metroParam,
      search: searchParam
    });
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // User & Portal Preferences
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Centralized Modal Manager Hook
  const modals = usePortalModals();

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('truthpulse_lang') as SupportedLanguage;
      if (savedLang) setCurrentLang(savedLang);
      const savedUser = localStorage.getItem('truthpulse_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      const savedGeo = localStorage.getItem('truthpulse_geo');
      if (savedGeo) {
        const parsed = JSON.parse(savedGeo);
        if (parsed.state && stateParam === 'All India') {
          setCurrentState(parsed.state);
          if (parsed.city) setCurrentCity(parsed.city);
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('truthpulse_user', JSON.stringify(user));
      document.cookie = `truthpulse_auth=${encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, role: user.role, email: user.email }))}; path=/; max-age=604800; SameSite=Lax`;
    } catch {
      // Ignore storage errors
    }

    // Role-based routing: Editors automatically enter the Editor Studio Hub
    if (user.role === 'CHIEF_EDITOR' || user.role === 'ADMIN' || (user.role as string) === 'EDITOR') {
      router.push('/studio');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('truthpulse_user');
      document.cookie = 'truthpulse_auth=; path=/; max-age=0; SameSite=Lax';
    } catch {
      // Ignore storage errors
    }
  };

  const handleRequireAuth = (reason?: string) => {
    modals.auth.open(reason);
  };

  // Sync state from URL params
  useEffect(() => {
    if (editionParam) setCurrentEdition(editionParam);
    if (categoryParam) setCurrentCategory(categoryParam);
    if (stateParam) setCurrentState(stateParam);
    if (cityParam !== undefined) setCurrentCity(cityParam);
    if (metroParam !== undefined) setCurrentMetro(metroParam);
    if (searchParam !== undefined) setSearchQuery(searchParam);
  }, [editionParam, categoryParam, stateParam, cityParam, metroParam, searchParam]);

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update URL Query Parameters
  const updateQueryParams = (
    newEdition: string,
    newCategory: string,
    newState: string,
    newSearch: string,
    newCity: string = '',
    newMetro: string = ''
  ) => {
    const params = new URLSearchParams();
    if (newEdition && newEdition !== 'National') params.set('edition', newEdition);
    if (newCategory && newCategory !== 'ALL' && newCategory !== 'Home') params.set('category', newCategory);
    if (newState && newState !== 'All India') params.set('state', newState);
    if (newCity) params.set('city', newCity);
    if (newMetro) params.set('metro', newMetro);
    if (newSearch) params.set('search', newSearch);

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  // Fetch articles from API with background revalidation
  const fetchArticles = async () => {
    if (articles.length === 0) {
      setLoading(true);
    }
    setError(null);
    try {
      const params = new URLSearchParams();
      if (currentEdition) params.set('edition', currentEdition);
      if (currentCategory && currentCategory !== 'ALL' && currentCategory !== 'Home') {
        params.set('category', currentCategory);
      }
      if (currentEdition === 'National' && currentState && currentState !== 'All India') {
        params.set('state', currentState);
      }
      if (currentCity) {
        params.set('city', currentCity);
      }
      if (currentMetro) {
        params.set('metro', currentMetro);
      }
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }

      const res = await fetch(`/api/articles?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setArticles(data.data);
      }
    } catch (err: any) {
      // In case of any network hiccup, keep serving current articles smoothly
      console.warn('Silent live wire sync note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [currentEdition, currentCategory, currentState, currentCity, currentMetro, searchQuery]);

  // Navigation handlers with instant optimistic feedback
  const handleSelectMetro = (metroId: string) => {
    if (currentMetro === metroId) {
      // Toggle off
      setCurrentMetro('');
      const instantFiltered = filterFallbackArticles({ edition: currentEdition, category: currentCategory, state: currentState, city: currentCity, search: searchQuery });
      if (instantFiltered.length > 0) setArticles(instantFiltered);
      updateQueryParams(currentEdition, currentCategory, currentState, searchQuery, currentCity, '');
      return;
    }

    const hub = METROPOLITAN_HUBS.find(h => h.id === metroId);
    if (hub) {
      setCurrentMetro(hub.id);
      setCurrentState(hub.state);
      setCurrentCity(hub.primaryCity);
      const instantFiltered = filterFallbackArticles({
        edition: currentEdition,
        category: currentCategory,
        state: hub.state,
        city: hub.primaryCity,
        metro: hub.id,
        search: searchQuery
      });
      if (instantFiltered.length > 0) setArticles(instantFiltered);
      updateQueryParams(currentEdition, currentCategory, hub.state, searchQuery, hub.primaryCity, hub.id);
    }
  };

  const handleSelectCategory = (cat: string) => {
    setCurrentCategory(cat);
    const instantFiltered = filterFallbackArticles({ edition: currentEdition, category: cat, state: currentState, city: currentCity, metro: currentMetro, search: searchQuery });
    if (instantFiltered.length > 0) setArticles(instantFiltered);
    updateQueryParams(currentEdition, cat, currentState, searchQuery, currentCity, currentMetro);
  };

  const handleSelectEdition = (edition: 'National' | 'International') => {
    setCurrentEdition(edition);
    const newState = edition === 'International' ? 'All India' : currentState;
    const newCity = edition === 'International' ? '' : currentCity;
    const newMetro = edition === 'International' ? '' : currentMetro;
    setCurrentState(newState);
    setCurrentCity(newCity);
    setCurrentMetro(newMetro);
    const instantFiltered = filterFallbackArticles({ edition, category: currentCategory, state: newState, city: newCity, metro: newMetro, search: searchQuery });
    if (instantFiltered.length > 0) setArticles(instantFiltered);
    updateQueryParams(edition, currentCategory, newState, searchQuery, newCity, newMetro);
  };

  const handleSelectState = (state: string) => {
    setCurrentState(state);
    setCurrentCity('');
    setCurrentMetro('');
    const instantFiltered = filterFallbackArticles({ edition: currentEdition, category: currentCategory, state, city: '', metro: '', search: searchQuery });
    if (instantFiltered.length > 0) setArticles(instantFiltered);
    updateQueryParams(currentEdition, currentCategory, state, searchQuery, '', '');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const instantFiltered = filterFallbackArticles({ edition: currentEdition, category: currentCategory, state: currentState, city: currentCity, metro: currentMetro, search: query });
    if (instantFiltered.length > 0) setArticles(instantFiltered);
    updateQueryParams(currentEdition, currentCategory, currentState, query, currentCity, currentMetro);
  };

  const handleClearFilters = () => {
    setCurrentCategory('Home');
    setCurrentState('All India');
    setCurrentCity('');
    setCurrentMetro('');
    setSearchQuery('');
    setArticles(FALLBACK_ARTICLES);
    updateQueryParams(currentEdition, 'Home', 'All India', '', '', '');
  };

  // Modern feature trigger handlers
  const handleOpenForensics = (imageUrl: string, title: string) => {
    const report = analyzeMediaForensics(imageUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000', title);
    modals.forensics.open(report);
  };

  const handleOpenGazetteRag = (claim?: string) => {
    const targetClaim = claim || (articles.length > 0 ? articles[0].title : 'Parliament clears landmark Electoral Transparency Bill');
    const result = queryGazetteRag(targetClaim);
    modals.gazette.open(result);
  };

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200 font-sans`}>
      
      {/* 1. TOP NAVBAR */}
      <Navbar
        currentCategory={currentCategory}
        currentEdition={currentEdition}
        currentState={currentState}
        currentMetro={currentMetro}
        onSelectCategory={handleSelectCategory}
        onSelectEdition={handleSelectEdition}
        onSelectState={handleSelectState}
        onSelectMetro={handleSelectMetro}
        onSearch={handleSearch}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenLiveStream={modals.liveStream.open}
        onOpenSidebar={modals.sidebar.open}
        onOpenReels={() => modals.reels.open(0)}
        currentUser={currentUser}
        onOpenAuthModal={() => modals.auth.open('Sign in to access credibility voting, bookmark articles, and view personal TruthCredits.')}
        onLogout={handleLogout}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenWhatsAppTipline={modals.whatsApp.open}
      />

      {/* 2. SLEEK DARK SLIDING SIDEBAR DRAWER */}
      <SidebarDrawer
        isOpen={modals.sidebar.isOpen}
        onClose={modals.sidebar.close}
        currentEdition={currentEdition}
        currentCategory={currentCategory}
        currentState={currentState}
        currentMetro={currentMetro}
        onSelectCategory={handleSelectCategory}
        onSelectEdition={handleSelectEdition}
        onSelectState={handleSelectState}
        onSelectMetro={handleSelectMetro}
        currentUser={currentUser}
        onOpenAuthModal={() => modals.auth.open('Sign in to verify stories and access the citizen credibility economy.')}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenLiveStream={modals.liveStream.open}
        onOpenReels={() => modals.reels.open(0)}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenWhatsAppTipline={modals.whatsApp.open}
        onOpenGazetteRag={() => handleOpenGazetteRag()}
      />

      {/* 3. MAIN NEWS FEED & RESPONSIVE GRID */}
      <main className="w-full max-w-full overflow-x-hidden pb-16 md:pb-0">
        {/* HYPER-LOCAL GPS GEO-ROUTING BANNER & DIRECTORY MODAL */}
        <div id="metro-detector-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <GeoDetector
            currentState={currentState}
            currentCity={currentCity}
            currentMetro={currentMetro}
            onLocationChange={(st, ct, mt) => {
              setCurrentState(st);
              setCurrentCity(ct || '');
              if (mt) setCurrentMetro(mt);
              const instantFiltered = filterFallbackArticles({
                edition: currentEdition,
                category: currentCategory,
                state: st,
                city: ct || '',
                metro: mt || currentMetro,
                search: searchQuery
              });
              if (instantFiltered.length > 0) setArticles(instantFiltered);
              updateQueryParams(currentEdition, currentCategory, st, searchQuery, ct || '', mt || currentMetro);
            }}
            onClearLocation={handleClearFilters}
          />
        </div>

        <NewsFeed
          articles={articles}
          loading={loading}
          error={error}
          currentEdition={currentEdition}
          currentCategory={currentCategory}
          currentState={currentState}
          onSelectState={handleSelectState}
          onClearFilters={handleClearFilters}
          onOpenCryptoSeal={(art) => modals.cryptoSeal.open(art)}
          onOpenForensics={handleOpenForensics}
          onOpenGazetteRag={handleOpenGazetteRag}
          onOpenCommunityNotes={(id, title) => modals.communityNotes.open(id, title)}
          onOpenUpiTip={(author, title) => modals.tip.open(author, title)}
          currentUser={currentUser}
          onRequireAuth={handleRequireAuth}
          onOpenReels={(idx) => modals.reels.open(idx)}
          currentLang={currentLang}
        />
      </main>

      {/* 4. CODE-SPLIT LAZY LOADED MODALS */}
      {modals.reels.isOpen && (
        <ReelsViewer
          shorts={DEFAULT_BREAKING_SHORTS}
          initialIndex={modals.reels.initialIndex}
          isOpen={modals.reels.isOpen}
          onClose={modals.reels.close}
          currentUser={currentUser}
          onRequireAuth={handleRequireAuth}
          currentLang={currentLang}
          onOpenFullArticle={(short) => {
            modals.reels.close();
            const matched = articles.find(a => a._id === short.fullArticleId || a.title.toLowerCase().includes(short.headline.slice(0, 25).toLowerCase()));
            if (matched) {
              modals.cryptoSeal.open(matched);
            } else {
              const el = document.getElementById('news-grid-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}

      {modals.auth.isOpen && (
        <AuthModal
          isOpen={modals.auth.isOpen}
          onClose={modals.auth.close}
          onLoginSuccess={handleLoginSuccess}
          reasonMessage={modals.auth.reason}
        />
      )}

      {modals.liveStream.isOpen && (
        <LiveStreamModal
          isOpen={modals.liveStream.isOpen}
          onClose={modals.liveStream.close}
        />
      )}

      {modals.cryptoSeal.article && (
        <CryptoSealBadge
          article={modals.cryptoSeal.article}
          onClose={modals.cryptoSeal.close}
        />
      )}

      {modals.forensics.report && (
        <MediaForensicsModal
          isOpen={!!modals.forensics.report}
          onClose={modals.forensics.close}
          report={modals.forensics.report}
        />
      )}

      {modals.gazette.result && (
        <GazetteRagModal
          isOpen={!!modals.gazette.result}
          onClose={modals.gazette.close}
          initialResult={modals.gazette.result}
        />
      )}

      {modals.communityNotes.target && (
        <CommunityNotesDrawer
          isOpen={!!modals.communityNotes.target}
          onClose={modals.communityNotes.close}
          articleId={modals.communityNotes.target.id}
          articleTitle={modals.communityNotes.target.title}
          currentUser={currentUser}
          onRequireAuth={handleRequireAuth}
        />
      )}

      {modals.whatsApp.isOpen && (
        <WhatsAppFactCheckModal
          isOpen={modals.whatsApp.isOpen}
          onClose={modals.whatsApp.close}
        />
      )}

      {modals.tip.target && (
        <UpiTipModal
          isOpen={!!modals.tip.target}
          onClose={modals.tip.close}
          authorName={modals.tip.target.author}
          articleTitle={modals.tip.target.title}
          currentUser={currentUser}
        />
      )}

      {/* 5. FOOTER */}
      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 text-xs text-slate-500 dark:text-slate-400 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <strong className="text-slate-800 dark:text-slate-200">TruthPulse News Portal (SatyaNews)</strong>
            <span>• National & State Editorial Grid</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span>Verified Citizen Credibility • Multi-Agent Autonomous Fact-Checking</span>
          </div>
        </div>
      </footer>

      {/* 6. FLOATING QUICK RETURN BUTTON FOR EDITORS BROWSING LIVE PORTAL */}
      {currentUser && (currentUser.role === 'CHIEF_EDITOR' || currentUser.role === 'ADMIN' || (currentUser.role as string) === 'EDITOR') && (
        <div className="fixed bottom-16 md:bottom-6 right-4 md:right-6 z-40">
          <Link
            href="/studio"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/95 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 shadow-xl backdrop-blur-md text-xs font-mono font-medium transition active:scale-95 group"
            title="Return to Editor Workstation"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Editor Studio</span>
          </Link>
        </div>
      )}

      {/* 7. DEDICATED MOBILE BOTTOM NAVIGATION BAR (< 640px) */}
      <MobileBottomNav
        onOpenFeed={() => {
          handleClearFilters();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReels={() => modals.reels.open(0)}
        onOpenMetro={() => {
          const el = document.getElementById('metro-detector-banner');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            modals.sidebar.open();
          }
        }}
        onOpenMenu={modals.sidebar.open}
        activeTab="feed"
      />

    </div>
  );
}

export default function ReaderPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-mono text-xs">
        <Cpu className="w-6 h-6 animate-spin text-red-500 mr-2" />
        <span>Loading TruthPulse SatyaNews...</span>
      </div>
    }>
      <NewsPortalContent />
    </Suspense>
  );
}
