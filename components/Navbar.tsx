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
      <div className="border-b border-slate-100 dark:border-slate-900 bg-slate-50/90 dark:bg-slate-900/60 py-2 px-3 sm:px-6 lg:px-8 text-xs w-full max-w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 w-full">
          
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

            {/* AQI & Weather Widget (XL+ only, compact neutral styling) */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px] shrink-0">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeDisplayLocation}: 28°C</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                <Wind className="w-3 h-3" /> AQI 128
              </span>
            </div>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
            
            {/* Search Input (Desktop lg+) */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search verified news..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8 pr-3 py-1 rounded-full text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-red-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 w-28 xl:w-40 focus:w-48 transition-all"
              />
            </form>

            {/* EDITOR STUDIO TRIGGER PILL (FOR EDITOR/ADMIN ROLE) */}
            {currentUser && (currentUser.role === 'CHIEF_EDITOR' || currentUser.role === 'ADMIN' || (currentUser.role as string) === 'EDITOR') && (
              <Link
                href="/studio"
                className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-mono text-[10px] sm:text-[11px] font-semibold tracking-wide transition shadow-sm shrink-0 border border-zinc-700/80"
                title="Open Dedicated Editor Workstation"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>STUDIO</span>
              </Link>
            )}

            {/* LIVE STREAM BUTTON */}
            <button
              onClick={onOpenLiveStream}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] sm:text-[11px] tracking-wide transition shadow-sm shrink-0"
              title="Watch Live Stream / Broadcast"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-ping"></span>
              <span className="hidden sm:inline">LIVE TV</span>
              <span className="sm:hidden">LIVE</span>
            </button>

            {/* BREAKING SHORTS / REELS TRIGGER PILL (xl+ only) */}
            <button
              onClick={() => {
                if (onOpenReels) {
                  onOpenReels();
                } else {
                  const el = document.getElementById('breaking-shorts-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold text-[11px] tracking-wide transition border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm"
              title="Open Full-Screen Vertical Breaking Reels"
            >
              <Flame className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>REELS</span>
            </button>

            {/* E-PAPER / DIGITAL MAGAZINE FLIPBOOK BUTTON (2xl+ only) */}
            <Link
              href="/magazine"
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold text-[11px] tracking-wide transition border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm"
              title="Open Digital E-Paper & Magazine Flipbook"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>E-PAPER</span>
            </Link>

            {/* WHATSAPP FACT-CHECK TIPLINE BUTTON (2xl+ only) */}
            {onOpenWhatsAppTipline && (
              <button
                type="button"
                onClick={onOpenWhatsAppTipline}
                className="hidden 2xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] tracking-wide transition shadow-sm shrink-0"
                title="Open WhatsApp Fact-Check Tipline Bot"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </button>
            )}

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
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-1 p-1 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
                    title={`Logged in as ${currentUser.name}`}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="hidden 2xl:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[70px] truncate pr-0.5">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[1px]" 
                        onClick={() => setShowProfileMenu(false)} 
                      />
                      <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 shadow-2xl z-[100] text-xs space-y-1 animate-fadeIn">
                        <div className="p-2 border-b border-slate-100 dark:border-slate-850">
                          <div className="font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                          <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-amber-500 font-bold">
                            <Coins className="w-3 h-3 shrink-0" />
                            <span>{currentUser.truthCredits} Credits</span>
                          </div>
                        </div>

                        {(currentUser.role === 'CHIEF_EDITOR' || currentUser.role === 'ADMIN' || (currentUser.role as string) === 'EDITOR') && (
                          <Link
                            href="/studio"
                            onClick={() => setShowProfileMenu(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-900 dark:text-zinc-100 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold transition"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Editor Studio Desk</span>
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
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-800 shadow-sm shrink-0"
                  title="Sign In"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* 2. PRIMARY CATEGORIES BAR (Desktop & Mobile Scrollable) */}
      <nav className="bg-white dark:bg-slate-950 px-3 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-800 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex items-center overflow-x-auto scrollbar-none overscroll-x-contain py-1">
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
      <div className="bg-slate-50/90 dark:bg-slate-900/60 px-3 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-800/80 w-full max-w-full overflow-hidden text-xs py-1.5">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-2 overflow-x-auto scrollbar-none overscroll-x-contain">
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
