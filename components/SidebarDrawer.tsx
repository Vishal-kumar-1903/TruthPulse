'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  ArrowLeft,
  Home, 
  Flame, 
  Radio, 
  Newspaper, 
  Globe2, 
  MapPin, 
  ChevronDown, 
  ChevronRight, 
  Briefcase, 
  Landmark, 
  Trophy, 
  CloudSun, 
  Film, 
  HeartPulse, 
  User, 
  Bookmark, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  Coins, 
  SlidersHorizontal,
  Layers,
  MessageCircle,
  Scale,
  BookOpen
} from 'lucide-react';
import { AuthUser } from './AuthModal';
import LanguageSelector from './LanguageSelector';
import { SupportedLanguage, getUIText } from '@/lib/translations';

export const ALL_INDIAN_STATES = [
  'All India',
  'Chhattisgarh',
  'Maharashtra',
  'Delhi',
  'Uttar Pradesh',
  'Bihar',
  'Karnataka',
  'Gujarat',
  'West Bengal',
  'Tamil Nadu',
  'Rajasthan',
  'Punjab',
  'Kerala',
  'Madhya Pradesh',
  'Telangana',
  'Andhra Pradesh',
  'Haryana',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Uttarakhand',
  'Himachal Pradesh',
  'Goa'
];

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentEdition: 'National' | 'International';
  currentCategory: string;
  currentState: string;
  onSelectCategory: (category: string) => void;
  onSelectEdition: (edition: 'National' | 'International') => void;
  onSelectState: (state: string) => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenLiveStream?: () => void;
  onOpenReels?: () => void;
  currentLang?: SupportedLanguage;
  onSelectLang?: (lang: SupportedLanguage) => void;
  onOpenWhatsAppTipline?: () => void;
  onOpenGazetteRag?: () => void;
}

export default function SidebarDrawer({
  isOpen,
  onClose,
  currentEdition,
  currentCategory,
  currentState,
  onSelectCategory,
  onSelectEdition,
  onSelectState,
  currentUser,
  onOpenAuthModal,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onOpenLiveStream,
  onOpenReels,
  currentLang = 'en',
  onSelectLang,
  onOpenWhatsAppTipline,
  onOpenGazetteRag
}: SidebarDrawerProps) {
  const [isStatesAccordionOpen, setIsStatesAccordionOpen] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!isOpen) return null;

  // Swipe Left Gesture on Drawer (Mobile fast back)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    // Swipe left (> 45px) -> Close drawer back to main feed
    if (diff > 45) {
      onClose();
    }
    setTouchStartX(null);
  };

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    onClose();
  };

  const handleStateClick = (state: string) => {
    onSelectState(state);
    onClose();
  };

  const handleEditionClick = (edition: 'National' | 'International') => {
    onSelectEdition(edition);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      
      {/* 1. DARK BACKDROP OVERLAY */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* 2. SLIDING OFF-CANVAS DRAWER */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-slate-950 border-r border-slate-800 text-slate-100 shadow-2xl flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out"
      >
        
        {/* A. DRAWER HEADER */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
          
          {/* Left: Instant Back Button (In same position as the 3-line hamburger menu) + Logo */}
          <div className="flex items-center gap-2">
            
            {/* LEFT BACK BUTTON (1-TAP BACK TO HAMBURGER POSITION) */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition shadow-sm flex items-center justify-center group shrink-0"
              title="Go back to news feed"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-600/30 shrink-0">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white text-sm sm:text-base tracking-tight">TruthPulse</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-600 text-white uppercase tracking-wider">
                    {currentEdition === 'National' ? 'IN' : 'GLOBAL'}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-400">SatyaNews Grid</p>
              </div>
            </div>

          </div>

          {/* Right: Dedicated Back Pill Button (Replaces the cross X with back action) */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition text-xs font-bold group shadow-sm shrink-0"
            title="Go back (Close drawer)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[11px] font-mono tracking-wide uppercase">Back</span>
          </button>
        </div>

        {/* B. SCROLLABLE VERTICAL NAVIGATION */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-6">

          {/* 1. CORE HUB SECTION */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              Core Hub
            </span>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryClick('Home')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  currentCategory === 'Home' || currentCategory === 'ALL'
                    ? 'bg-red-600/15 text-red-400 border border-red-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4 text-red-500" />
                <span>Home News Feed</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenReels) {
                    onOpenReels();
                  } else {
                    const el = document.getElementById('breaking-shorts-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Trending Breaking Reels</span>
                <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-gradient-to-r from-red-600 to-rose-600 text-white font-black animate-pulse">
                  REEL
                </span>
              </button>

              <button
                onClick={() => {
                  if (onOpenLiveStream) onOpenLiveStream();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Live TV & Studio Audio</span>
                <span className="ml-auto text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-600 text-white animate-pulse">
                  LIVE
                </span>
              </button>

              <Link
                href="/magazine"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Digital Magazine & E-Paper</span>
                <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-600/30 text-amber-300 border border-amber-500/40 font-bold">
                  FLIPBOOK
                </span>
              </Link>

              {/* WhatsApp Tipline Shortcut */}
              {onOpenWhatsAppTipline && (
                <button
                  onClick={() => {
                    onOpenWhatsAppTipline();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>WhatsApp Fact-Check Bot</span>
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    24/7 AI
                  </span>
                </button>
              )}

              {/* Gazette RAG Shortcut */}
              {onOpenGazetteRag && (
                <button
                  onClick={() => {
                    onOpenGazetteRag();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-500/10 transition"
                >
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>e-Gazette Statutory RAG</span>
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                    GOV PROOF
                  </span>
                </button>
              )}

              <div className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-900/50 cursor-not-allowed opacity-80">
                <Newspaper className="w-4 h-4 text-cyan-400" />
                <span>E-Paper Edition</span>
                <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  Daily 6 AM
                </span>
              </div>
            </div>
          </div>

          {/* 2. EDITION & GEO SELECTOR ACCORDION */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              Edition & Geo Filter
            </span>

            <div className="space-y-1.5">
              
              {/* International Switcher */}
              <button
                onClick={() => handleEditionClick('International')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                  currentEdition === 'International'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  <span>International (Global)</span>
                </div>
                {currentEdition === 'International' && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                )}
              </button>

              {/* National (India) with States Accordion */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => {
                    handleEditionClick('National');
                    setIsStatesAccordionOpen(!isStatesAccordionOpen);
                  }}
                  className={`w-full flex items-center justify-between p-3 text-xs font-bold transition ${
                    currentEdition === 'National' ? 'text-red-400' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>National (India - 28 States)</span>
                  </div>
                  {isStatesAccordionOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* Expanded State List */}
                {isStatesAccordionOpen && (
                  <div className="p-2 border-t border-slate-800/60 max-h-56 overflow-y-auto space-y-0.5 scrollbar-none">
                    {ALL_INDIAN_STATES.map((state) => {
                      const isStateActive = currentState === state || (!currentState && state === 'All India');
                      return (
                        <button
                          key={state}
                          onClick={() => handleStateClick(state)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold transition flex items-center justify-between ${
                            isStateActive
                              ? 'bg-red-600/20 text-red-400 font-bold'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-red-500/70 shrink-0" />
                            <span>{state}</span>
                          </span>
                          {isStateActive && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* 3. CATEGORIES SECTION */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              Primary Categories
            </span>
            <div className="space-y-1">
              {[
                { name: 'Business', icon: Briefcase, color: 'text-blue-400' },
                { name: 'Politics', icon: Landmark, color: 'text-red-400' },
                { name: 'Sports', icon: Trophy, color: 'text-emerald-400' },
                { name: 'Weather', icon: CloudSun, color: 'text-sky-400' },
                { name: 'Entertainment', icon: Film, color: 'text-purple-400' },
                { name: 'Health', icon: HeartPulse, color: 'text-teal-400' }
              ].map((item) => {
                const CategoryIcon = item.icon;
                const isCatActive = currentCategory === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleCategoryClick(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isCatActive
                        ? 'bg-slate-800 text-white font-black'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <CategoryIcon className={`w-4 h-4 ${item.color}`} />
                      <span>{getUIText(item.name.toLowerCase(), currentLang)}</span>
                    </div>
                    {isCatActive && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. USER & SETTINGS SECTION */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
              User & Credibility
            </span>
            <div className="space-y-1">
              {currentUser ? (
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate max-w-[170px]">{currentUser.name}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{currentUser.truthCredits} TruthCredits</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs transition shadow-md shadow-red-600/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Verify Account</span>
                </button>
              )}

              <Link
                href="/admin"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Editorial Admin Desk</span>
              </Link>

              <button
                onClick={onToggleDarkMode}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-900 hover:text-white transition"
              >
                <div className="flex items-center gap-2.5">
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                  <span>Theme: {darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
              </button>

              {/* Vernacular Language Selector */}
              {onSelectLang && (
                <div className="pt-2 border-t border-slate-900 mt-2">
                  <LanguageSelector
                    currentLang={currentLang}
                    onSelectLang={onSelectLang}
                    variant="drawer"
                  />
                </div>
              )}

              {currentUser && (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({currentUser.name.split(' ')[0]})</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* C. DRAWER FOOTER */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Tamper Proof
          </span>
          <span>v2.4 Multi-Agent</span>
        </div>

      </div>

    </div>
  );
}
