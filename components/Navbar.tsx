'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  Search, 
  Bell, 
  CloudSun, 
  Wind, 
  ChevronDown, 
  Moon, 
  Sun, 
  Radio, 
  X, 
  Flame, 
  User, 
  LogIn, 
  LogOut, 
  Coins, 
  ShieldCheck, 
  SlidersHorizontal,
  MapPin,
  MessageCircle,
  BookOpen,
  Building2,
  Sparkles
} from 'lucide-react';
import { AuthUser } from './AuthModal';
import LanguageSelector from './LanguageSelector';
import { SupportedLanguage, getUIText } from '@/lib/translations';
import { METROPOLITAN_HUBS } from '@/lib/metroHubs';

export const CATEGORIES = [
  'Home',
  'Business',
  'Politics',
  'Sports',
  'Weather',
  'Entertainment',
  'Health'
];

interface NavbarProps {
  currentCategory: string;
  currentEdition: 'National' | 'International';
  currentState: string;
  onSelectCategory: (cat: string) => void;
  onSelectEdition: (edition: 'National' | 'International') => void;
  onSelectState: (state: string) => void;
  onSearch: (query: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenLiveStream?: () => void;
  onOpenSidebar: () => void;
  onOpenReels?: () => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  currentLang?: SupportedLanguage;
  onSelectLang?: (lang: SupportedLanguage) => void;
  onOpenWhatsAppTipline?: () => void;
  currentMetro?: string;
  onSelectMetro?: (metroId: string) => void;
}

export default function Navbar({
  currentCategory,
  currentEdition,
  currentState,
  onSelectCategory,
  onSelectEdition,
  onSelectState,
  onSearch,
  darkMode,
  onToggleDarkMode,
  onOpenLiveStream,
  onOpenSidebar,
  onOpenReels,
  currentUser,
  onOpenAuthModal,
  onLogout,
  currentLang = 'en',
  onSelectLang,
  onOpenWhatsAppTipline,
  currentMetro,
  onSelectMetro
}: NavbarProps) {
  const [searchInput, setSearchInput] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live Date / Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput.trim());
  };

  const activeDisplayLocation = currentState && currentState !== 'All India' 
    ? currentState 
    : (currentEdition === 'National' ? 'India' : 'Global');

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm font-sans w-full max-w-full">
      
      {/* 1. TOP UTILITY BAR (Hamburger, Logo, AQI, Live TV, Notifications, User Profile) */}
      <div className="border-b border-slate-100 dark:border-slate-900 bg-slate-50/90 dark:bg-slate-900/60 py-2 px-3 sm:px-4 md:px-6 lg:px-8 text-xs w-full max-w-full">
        <div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
          
          {/* Left: Hamburger Button + Brand Logo + Weather Chip */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            
            {/* 3-LINE HAMBURGER BUTTON (OPENS SLIDING SIDEBAR DRAWER) */}
            <button
              onClick={onOpenSidebar}
              className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/40 transition shadow-sm flex items-center justify-center group shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
              </div>
              <div className="leading-tight">
                <span className="font-black text-slate-900 dark:text-white tracking-tight text-sm sm:text-base lg:text-lg flex items-center gap-1">
                  <span>TruthPulse</span>
                  <span className="hidden sm:inline text-[9px] sm:text-[10px] font-bold tracking-wider px-1.5 py-0.2 rounded bg-red-600 text-white uppercase">
                    SATYA
                  </span>
                </span>
              </div>
            </Link>

            {/* Date Tag (Ultra-wide screens) */}
            <span className="hidden 2xl:inline text-[11px] font-mono text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
              {currentTime}
            </span>

            {/* AQI & Weather Widget (2XL+ only to guarantee ample breathing room) */}
            <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px] shrink-0">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeDisplayLocation}: 28°C</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                <Wind className="w-3 h-3" /> AQI 128
              </span>
            </div>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0 pr-1 sm:pr-2">
            
            {/* Search Input (Desktop lg+) */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={getUIText('searchPlaceholder', currentLang) || 'Search by city, title, topic or keywords...'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-8 py-1.5 rounded-full text-xs bg-slate-50 hover:bg-white focus:bg-white dark:bg-slate-900 dark:focus:bg-slate-950 border border-slate-200 hover:border-slate-300 dark:border-slate-800 focus:outline-none focus:border-red-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 w-52 xl:w-72 2xl:w-84 focus:w-80 2xl:focus:w-96 transition-all shadow-inner"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); onSearch(''); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* EDITOR STUDIO TRIGGER PILL (FOR EDITOR/ADMIN ROLE) */}
            {currentUser && (currentUser.role === 'CHIEF_EDITOR' || currentUser.role === 'ADMIN' || (currentUser.role as string) === 'EDITOR') && (
              <Link
                href="/studio"
                className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-900 font-mono text-[11px] font-bold tracking-wide transition shadow-sm shrink-0 border border-emerald-500/50 hover:border-emerald-600 ring-1 ring-emerald-500/20"
                title="Open Dedicated Editor Workstation"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>STUDIO</span>
              </Link>
            )}

            {/* LIVE STREAM BUTTON */}
            <button
              onClick={onOpenLiveStream}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-[11px] tracking-wide transition shadow-sm shrink-0"
              title="Watch Live Stream / Broadcast"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-ping"></span>
              <span className="hidden sm:inline">LIVE TV</span>
              <span className="sm:hidden">LIVE</span>
            </button>

            {/* BREAKING SHORTS / REELS TRIGGER PILL (2xl+ only to preserve navbar breathing room) */}
            <button
              onClick={() => {
                if (onOpenReels) {
                  onOpenReels();
                } else {
                  const el = document.getElementById('breaking-shorts-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hidden 2xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold text-[11px] tracking-wide transition border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm"
              title="Open Full-Screen Vertical Breaking Reels"
            >
              <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>REELS</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative shrink-0 z-50">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-1.5 sm:p-2 rounded-full relative transition ${
                  showNotifications
                    ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
                title="Notifications / सूचनाएँ"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1 right-1 ring-2 ring-white dark:ring-slate-950 animate-pulse"></span>
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[1px]" 
                    onClick={() => setShowNotifications(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 shadow-2xl z-[100] text-xs space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-red-500" />
                        <span>Live Dispatches</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-600 text-white font-bold">3 NEW</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-[11px] leading-relaxed">
                        <div className="flex items-center justify-between mb-0.5 font-bold">
                          <span>🚨 Electoral Bill Passed</span>
                          <span className="text-[10px] font-mono opacity-70">2m ago</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">
                          Parliament enacts landmark digital verification and infrastructure act in New Delhi.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        <div className="flex items-center justify-between mb-0.5 font-bold">
                          <span className="text-amber-500 font-bold">⚡ Raigarh Solar Subsidies</span>
                          <span className="text-[10px] font-mono text-slate-400">14m ago</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          Chhattisgarh launches 90% capital grant for 1.8L farmers.
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        <div className="flex items-center justify-between mb-0.5 font-bold">
                          <span className="text-emerald-500 font-bold">🛰️ ISRO Mission Update</span>
                          <span className="text-[10px] font-mono text-slate-400">42m ago</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          Integrated thermal vacuum tests completed on Gaganyaan flight module.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Real-time SSE Active</span>
                      <button 
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="text-red-600 dark:text-red-400 font-bold hover:underline"
                      >
                        Dismiss All
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Language Selector Dropdown */}
            {onSelectLang && (
              <LanguageSelector
                currentLang={currentLang}
                onSelectLang={onSelectLang}
                variant="navbar"
              />
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-1 sm:p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition shrink-0"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* USER PROFILE AVATAR / SIGN-IN BUTTON */}
            <div className="relative shrink-0 z-50">
              {currentUser ? (
                <div>
                  {(() => {
                    const isEditor = currentUser.role === 'CHIEF_EDITOR' || currentUser.role === 'ADMIN' || (currentUser.role as string) === 'EDITOR';
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowProfileMenu(!showProfileMenu)}
                          className={`flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full transition shadow-sm shrink-0 group ${
                            isEditor
                              ? 'bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-700/60'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800'
                          }`}
                          title={`Logged in as ${currentUser.name} (${currentUser.role})`}
                        >
                          <div className={`w-6 h-6 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-sm ${
                            isEditor ? 'bg-emerald-600 text-white' : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                          }`}>
                            {currentUser.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="inline-block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[85px] sm:max-w-[110px] truncate">
                            {currentUser.name.split(' ')[0]}
                          </span>
                          {isEditor ? (
                            <span className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-600 text-white uppercase tracking-wider">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>Bureau</span>
                            </span>
                          ) : (
                            <span className="hidden xl:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-600 text-white uppercase tracking-wider">
                              Reader
                            </span>
                          )}
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors shrink-0" />
                        </button>

                        {/* Profile Dropdown */}
                        {showProfileMenu && (
                          <>
                            <div 
                              className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[1px]" 
                              onClick={() => setShowProfileMenu(false)} 
                            />
                            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 shadow-2xl z-[100] text-xs space-y-2 animate-fadeIn">
                              
                              {/* Distinct Role Header Card */}
                              <div className={`p-3 rounded-xl border ${
                                isEditor 
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50' 
                                  : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50'
                              }`}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-bold text-slate-900 dark:text-white truncate text-sm">{currentUser.name}</div>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider ${
                                    isEditor
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-blue-600 text-white'
                                  }`}>
                                    {isEditor ? 'VERIFIED BUREAU' : 'CITIZEN READER'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                                <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] font-mono">
                                  <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                                    <Coins className="w-3 h-3 shrink-0" />
                                    <span>{currentUser.truthCredits} Credits</span>
                                  </span>
                                  <span className={`font-bold text-[10px] ${isEditor ? 'text-emerald-600' : 'text-blue-600'}`}>
                                    {isEditor ? 'Editorial Passkey' : 'Citizen Voter'}
                                  </span>
                                </div>
                              </div>

                              {isEditor && (
                                <Link
                                  href="/studio"
                                  onClick={() => setShowProfileMenu(false)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold transition shadow-sm"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>Open Editor Studio Desk</span>
                                </Link>
                              )}

                              <Link
                                href="/admin"
                                onClick={() => setShowProfileMenu(false)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold transition"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Admin Console</span>
                              </Link>

                              <button
                                type="button"
                                onClick={() => {
                                  onLogout();
                                  setShowProfileMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition"
                              >
                                <LogOut className="w-3.5 h-3.5 shrink-0" />
                                <span>Log Out</span>
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs transition shadow-sm shrink-0 border border-transparent active:scale-95"
                  title="Sign In / Register"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 shrink-0" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 2. PRIMARY CATEGORIES BAR (Desktop & Mobile Scrollable) */}
      <nav className="bg-white dark:bg-slate-950 px-3 sm:px-4 md:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-800 w-full max-w-full overflow-hidden">
        <div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto flex items-center overflow-x-auto scrollbar-none overscroll-x-contain py-1">
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {CATEGORIES.map((category) => {
              const isActive = (currentCategory === category) || (!currentCategory && category === 'Home');
              const localizedLabel = getUIText(category.toLowerCase(), currentLang);
              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category === 'Home' ? 'ALL' : category)}
                  className={`px-3 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition whitespace-nowrap relative ${
                    isActive
                      ? 'text-red-600 dark:text-red-400 font-black'
                      : 'text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <span>{localizedLabel}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 3. METROPOLITAN HUBS QUICK SWITCHER (Tier-1 Mega Clusters) */}
      <div className="bg-slate-50/90 dark:bg-slate-900/60 px-3 sm:px-4 md:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-800/80 w-full max-w-full overflow-hidden text-xs py-1.5">
        <div className="w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none overscroll-x-contain">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-bold uppercase shrink-0 pr-2 border-r border-slate-200 dark:border-slate-800">
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Metro Hubs:</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {METROPOLITAN_HUBS.map((hub) => {
              const isSelected = currentMetro === hub.id;
              return (
                <button
                  key={hub.id}
                  onClick={() => onSelectMetro ? onSelectMetro(hub.id) : onSelectState(hub.state)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition whitespace-nowrap flex items-center gap-1 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span>{hub.shortLabel}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </header>
  );
}
