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
  Building2,
  BookOpen,
  Sparkles,
  Search
} from 'lucide-react';
import { AuthUser } from './AuthModal';
import LanguageSelector from './LanguageSelector';
import { SupportedLanguage, getUIText } from '@/lib/translations';
import { METROPOLITAN_HUBS } from '@/lib/metroHubs';

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
  currentMetro?: string;
  onSelectMetro?: (metroId: string) => void;
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
  currentLang = 'hi',
  onSelectLang,
  onOpenWhatsAppTipline,
  onOpenGazetteRag,
  currentMetro,
  onSelectMetro
}: SidebarDrawerProps) {
  const [isStatesAccordionOpen, setIsStatesAccordionOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [geoSearchQuery, setGeoSearchQuery] = useState('');

  // Filtered Metros
  const filteredMetros = METROPOLITAN_HUBS.filter(hub => {
    if (!geoSearchQuery.trim()) return true;
    const q = geoSearchQuery.toLowerCase().trim();
    return hub.shortLabel.toLowerCase().includes(q) || 
           hub.primaryCity.toLowerCase().includes(q) || 
           hub.state.toLowerCase().includes(q);
  });

  // Filtered States
  const filteredStates = ALL_INDIAN_STATES.filter(state => {
    if (!geoSearchQuery.trim()) return true;
    const q = geoSearchQuery.toLowerCase().trim();
    return state.toLowerCase().includes(q);
  });

  const shouldShowStatesList = isStatesAccordionOpen || geoSearchQuery.trim().length > 0;

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
      
      {/* 1. BACKDROP OVERLAY */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />

      {/* 2. SLIDING OFF-CANVAS DRAWER (PRISTINE WHITE THEME) */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-white border-r border-slate-200 text-slate-900 shadow-2xl flex flex-col justify-between z-50 transform transition-transform duration-300 ease-in-out"
      >
        
        {/* A. DRAWER HEADER */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          
          {/* Left: Instant Back Button + Logo */}
          <div className="flex items-center gap-2">
            
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition shadow-sm flex items-center justify-center group shrink-0"
              title="Go back to news feed"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-600/30 shrink-0">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-900 text-sm sm:text-base tracking-tight">TruthPulse</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-600 text-white uppercase tracking-wider">
                    {currentEdition === 'National' ? 'IN' : 'GLOBAL'}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-slate-500">SatyaNews Grid</p>
              </div>
            </div>

          </div>

          {/* Right: Dedicated Back Pill Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition text-xs font-bold group shadow-sm shrink-0"
            title="Go back (Close drawer)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-600 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[11px] font-mono tracking-wide uppercase">Back</span>
          </button>
        </div>

        {/* B. SCROLLABLE VERTICAL NAVIGATION */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-6">

          {/* 1. CORE HUB SECTION */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2 px-2">
              Core Hub
            </span>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryClick('Home')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition ${
                  currentCategory === 'Home' || currentCategory === 'ALL'
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Home className="w-4 h-4 text-red-600" />
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
                <span>Live TV & Studio Audio</span>
                <span className="ml-auto text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-600 text-white animate-pulse">
                  LIVE
                </span>
              </button>

              {/* Dedicated Editor Studio Desk link */}
              {currentUser && (currentUser.role === 'CHIEF_EDITOR' || currentUser.role === 'ADMIN' || (currentUser.role as string) === 'EDITOR') && (
                <Link
                  href="/studio"
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 transition shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Editor Studio Desk</span>
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-600 text-white font-bold">
                    STUDIO
                  </span>
                </Link>
              )}

              <Link
                href="/magazine"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>Digital Magazine & E-Paper</span>
                <span className="ml-auto text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
                  <span>WhatsApp Fact-Check Bot</span>
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 transition"
                >
                  <Scale className="w-4 h-4 text-amber-600" />
                  <span>e-Gazette Statutory RAG</span>
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                    GOV PROOF
                  </span>
                </button>
              )}

              <div className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50 cursor-not-allowed opacity-80">
                <Newspaper className="w-4 h-4 text-cyan-600" />
                <span>E-Paper Edition</span>
                <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                  Daily 6 AM
                </span>
              </div>
            </div>
          </div>

          {/* 2. REGIONAL & METRO DIRECTORY WITH INTEGRATED FAST SEARCH */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Regional & Metro Directory
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">28 States + 8 Metros</span>
            </div>

            {/* In-Menu Geo Search Input (Fixes space and provides instant lookup) */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={geoSearchQuery}
                onChange={(e) => setGeoSearchQuery(e.target.value)}
                placeholder="राज्य, शहर या मेट्रो हब खोजें..."
                className="w-full pl-8 pr-7 py-2 rounded-xl text-xs bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-red-500 text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-inner"
              />
              {geoSearchQuery && (
                <button
                  type="button"
                  onClick={() => setGeoSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* A. Metropolitan Hubs Grid */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Metropolitan Hubs</span>
                </span>
                <span className="text-[9px] font-mono text-slate-500 font-semibold">Tier-1 Mega Clusters</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {filteredMetros.length === 0 ? (
                  <p className="col-span-2 text-[10px] font-mono text-slate-400 py-1 text-center">No metro matches &quot;{geoSearchQuery}&quot;</p>
                ) : (
                  filteredMetros.map((hub) => {
                    const isSelected = currentMetro === hub.id;
                    return (
                      <button
                        key={hub.id}
                        onClick={() => {
                          if (onSelectMetro) onSelectMetro(hub.id);
                          else onSelectState(hub.state);
                          onClose();
                        }}
                        className={`flex flex-col text-left p-2.5 rounded-xl transition border text-xs ${
                          isSelected
                            ? 'bg-red-50 border-red-300 text-red-700 font-bold shadow-sm ring-1 ring-red-500/20'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-xs truncate">{hub.shortLabel}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-red-600' : 'bg-emerald-500'} shrink-0`} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{hub.primaryCity}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* B. State & UT Directory */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>State & UT Directory</span>
                </span>
                <span className="text-[9px] font-mono text-slate-500 font-semibold">Hyper-Local Grid</span>
              </div>

              <div className="space-y-1.5">
                {/* International Switcher */}
                <button
                  onClick={() => handleEditionClick('International')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition border ${
                    currentEdition === 'International'
                      ? 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe2 className="w-4 h-4 text-cyan-600" />
                    <span>International (Global)</span>
                  </div>
                  {currentEdition === 'International' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                  )}
                </button>

                {/* National (India) with States Accordion */}
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => {
                      handleEditionClick('National');
                      setIsStatesAccordionOpen(!isStatesAccordionOpen);
                    }}
                    className={`w-full flex items-center justify-between p-3 text-xs font-bold transition ${
                      currentEdition === 'National' ? 'text-red-600 bg-red-50/50' : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">🇮🇳</span>
                      <span>National (India - 28 States)</span>
                      {filteredStates.length < ALL_INDIAN_STATES.length && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold">
                          {filteredStates.length} found
                        </span>
                      )}
                    </div>
                    {shouldShowStatesList ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  {/* Expanded 2-Column State List (Eliminates awkward scrolling) */}
                  {shouldShowStatesList && (
                    <div className="p-2 border-t border-slate-200 max-h-64 overflow-y-auto scrollbar-none bg-slate-50">
                      <div className="grid grid-cols-2 gap-1">
                        {filteredStates.map((state) => {
                          const isStateActive = currentState === state || (!currentState && state === 'All India');
                          return (
                            <button
                              key={state}
                              onClick={() => handleStateClick(state)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition flex items-center justify-between border ${
                                isStateActive
                                  ? 'bg-red-50 border-red-300 text-red-700 font-bold shadow-sm'
                                  : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                                <span className="truncate">{state}</span>
                              </span>
                              {isStateActive && <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. CATEGORIES SECTION */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2 px-2">
              Primary Categories
            </span>
            <div className="space-y-1">
              {[
                { name: 'Business', icon: Briefcase, color: 'text-blue-600' },
                { name: 'Politics', icon: Landmark, color: 'text-red-600' },
                { name: 'Sports', icon: Trophy, color: 'text-emerald-600' },
                { name: 'Weather', icon: CloudSun, color: 'text-sky-600' },
                { name: 'Entertainment', icon: Film, color: 'text-purple-600' },
                { name: 'Health', icon: HeartPulse, color: 'text-teal-600' }
              ].map((item) => {
                const CategoryIcon = item.icon;
                const isCatActive = currentCategory === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleCategoryClick(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isCatActive
                        ? 'bg-slate-900 text-white font-black shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
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

          {/* 5. USER & SETTINGS SECTION */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2 px-2">
              User & Credibility
            </span>
            <div className="space-y-1">
              {currentUser ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]">{currentUser.name}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-700">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>{currentUser.truthCredits} TruthCredits</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Verify Account</span>
                </button>
              )}

              <Link
                href="/admin"
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span>Editorial Admin Desk</span>
              </Link>

              <button
                onClick={onToggleDarkMode}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <div className="flex items-center gap-2.5">
                  {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
                  <span>Theme: {darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
              </button>

              {/* Vernacular Language Selector */}
              {onSelectLang && (
                <div className="pt-2 border-t border-slate-200 mt-2">
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
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({currentUser.name.split(' ')[0]})</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* C. DRAWER FOOTER */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span className="flex items-center gap-1 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SHA-256 Tamper Proof
          </span>
          <span>v2.4 Multi-Agent</span>
        </div>

      </div>

    </div>
  );
}
