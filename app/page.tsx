'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import SidebarDrawer from '@/components/SidebarDrawer';
import NewsFeed from '@/components/NewsFeed';
import AuthModal, { AuthUser } from '@/components/AuthModal';
import CryptoSealBadge from '@/components/CryptoSealBadge';
import LiveStreamModal from '@/components/LiveStreamModal';
import ReelsViewer from '@/components/ReelsViewer';
import { DEFAULT_BREAKING_SHORTS } from '@/components/BreakingShorts';
import { ArticleItem } from '@/components/NewsCard';
import { ShieldCheck, Cpu } from 'lucide-react';

function NewsPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Parameters
  const editionParam = (searchParams.get('edition') as 'National' | 'International') || 'National';
  const categoryParam = searchParams.get('category') || 'Home';
  const stateParam = searchParams.get('state') || 'All India';
  const searchParam = searchParams.get('search') || '';

  const [currentEdition, setCurrentEdition] = useState<'National' | 'International'>(editionParam);
  const [currentCategory, setCurrentCategory] = useState<string>(categoryParam);
  const [currentState, setCurrentState] = useState<string>(stateParam);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam);

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authReason, setAuthReason] = useState<string>('Please sign in to verify or dispute this story.');
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState<boolean>(false);
  const [isReelsOpen, setIsReelsOpen] = useState<boolean>(false);
  const [reelsInitialIndex, setReelsInitialIndex] = useState<number>(0);
  const [selectedSealArticle, setSelectedSealArticle] = useState<ArticleItem | null>(null);

  // Authenticated User State (Loaded from localStorage)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('truthpulse_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('truthpulse_user', JSON.stringify(user));
    } catch (e) {
      // Ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('truthpulse_user');
    } catch (e) {
      // Ignore
    }
  };

  const handleRequireAuth = (reason?: string) => {
    if (reason) setAuthReason(reason);
    setIsAuthModalOpen(true);
  };

  // Sync state from URL params
  useEffect(() => {
    if (editionParam) setCurrentEdition(editionParam);
    if (categoryParam) setCurrentCategory(categoryParam);
    if (stateParam) setCurrentState(stateParam);
    if (searchParam !== undefined) setSearchQuery(searchParam);
  }, [editionParam, categoryParam, stateParam, searchParam]);

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update URL Query Parameters
  const updateQueryParams = (newEdition: string, newCategory: string, newState: string, newSearch: string) => {
    const params = new URLSearchParams();
    if (newEdition && newEdition !== 'National') params.set('edition', newEdition);
    if (newCategory && newCategory !== 'ALL' && newCategory !== 'Home') params.set('category', newCategory);
    if (newState && newState !== 'All India') params.set('state', newState);
    if (newSearch) params.set('search', newSearch);

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  // Fetch articles from API
  const fetchArticles = async () => {
    setLoading(true);
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
      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }

      const res = await fetch(`/api/articles?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setArticles(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch news articles');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching dispatches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [currentEdition, currentCategory, currentState, searchQuery]);

  // Category select handler
  const handleSelectCategory = (cat: string) => {
    setCurrentCategory(cat);
    updateQueryParams(currentEdition, cat, currentState, searchQuery);
  };

  // Edition select handler
  const handleSelectEdition = (edition: 'National' | 'International') => {
    setCurrentEdition(edition);
    const newState = edition === 'International' ? 'All India' : currentState;
    setCurrentState(newState);
    updateQueryParams(edition, currentCategory, newState, searchQuery);
  };

  // State select handler
  const handleSelectState = (state: string) => {
    setCurrentState(state);
    updateQueryParams(currentEdition, currentCategory, state, searchQuery);
  };

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateQueryParams(currentEdition, currentCategory, currentState, query);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setCurrentCategory('Home');
    setCurrentState('All India');
    setSearchQuery('');
    updateQueryParams(currentEdition, 'Home', 'All India', '');
  };

  const handleOpenReels = (index: number = 0) => {
    setReelsInitialIndex(index);
    setIsReelsOpen(true);
  };

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200 font-sans`}>
      
      {/* 1. TOP NAVBAR (Hamburger, Brand, Categories, Weather/AQI, Live Stream, Notifications, Profile) */}
      <Navbar
        currentCategory={currentCategory}
        currentEdition={currentEdition}
        currentState={currentState}
        onSelectCategory={handleSelectCategory}
        onSelectEdition={handleSelectEdition}
        onSelectState={handleSelectState}
        onSearch={handleSearch}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenLiveStream={() => setIsLiveStreamOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenReels={() => handleOpenReels(0)}
        currentUser={currentUser}
        onOpenAuthModal={() => {
          setAuthReason('Sign in to access credibility voting, bookmark articles, and view personal TruthCredits.');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* 2. SLEEK DARK SLIDING SIDEBAR DRAWER (Core Hub, Geo Accordion, Categories, User/Settings) */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentEdition={currentEdition}
        currentCategory={currentCategory}
        currentState={currentState}
        onSelectCategory={handleSelectCategory}
        onSelectEdition={handleSelectEdition}
        onSelectState={handleSelectState}
        currentUser={currentUser}
        onOpenAuthModal={() => {
          setAuthReason('Sign in to verify stories and access the citizen credibility economy.');
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenLiveStream={() => setIsLiveStreamOpen(true)}
        onOpenReels={() => handleOpenReels(0)}
      />

      {/* 3. MAIN NEWS FEED & RESPONSIVE GRID (Shorts Reel, State Pills, Breaking Banner, Cards) */}
      <main className="w-full max-w-full overflow-x-hidden">
        <NewsFeed
          articles={articles}
          loading={loading}
          error={error}
          currentEdition={currentEdition}
          currentCategory={currentCategory}
          currentState={currentState}
          onSelectState={handleSelectState}
          onClearFilters={handleClearFilters}
          onOpenCryptoSeal={(art) => setSelectedSealArticle(art)}
          currentUser={currentUser}
          onRequireAuth={handleRequireAuth}
          onOpenReels={(idx) => handleOpenReels(idx)}
        />
      </main>

      {/* 4. FULL-SCREEN VERTICAL SWIPE REELS / SHORTS VIEWER */}
      <ReelsViewer
        shorts={DEFAULT_BREAKING_SHORTS}
        initialIndex={reelsInitialIndex}
        isOpen={isReelsOpen}
        onClose={() => setIsReelsOpen(false)}
        currentUser={currentUser}
        onRequireAuth={handleRequireAuth}
        onOpenFullArticle={(short) => {
          setIsReelsOpen(false);
          const matched = articles.find(a => a._id === short.fullArticleId || a.title.toLowerCase().includes(short.headline.slice(0, 25).toLowerCase()));
          if (matched) {
            setSelectedSealArticle(matched);
          } else {
            const el = document.getElementById('news-grid-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 4. AUTH MODAL (Login / Create Account Prompt for Role-Gated Actions) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        reasonMessage={authReason}
      />

      {/* 5. LIVE STREAM BROADCAST MODAL */}
      <LiveStreamModal
        isOpen={isLiveStreamOpen}
        onClose={() => setIsLiveStreamOpen(false)}
      />

      {/* 6. CRYPTOGRAPHIC SEAL INSPECTOR MODAL */}
      {selectedSealArticle && (
        <CryptoSealBadge
          article={selectedSealArticle}
          onClose={() => setSelectedSealArticle(null)}
        />
      )}

      {/* 7. FOOTER */}
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
