'use client';

import React from 'react';
import { 
  Newspaper, 
  Flame, 
  Building2, 
  Menu,
  Radio,
  BookOpen
} from 'lucide-react';
import { SupportedLanguage, getUIText } from '@/lib/translations';

interface MobileBottomNavProps {
  onOpenFeed: () => void;
  onOpenReels: () => void;
  onOpenMetro: () => void;
  onOpenMenu: () => void;
  onOpenMagazine?: () => void;
  activeTab?: 'feed' | 'reels' | 'metro' | 'menu';
  currentLang?: SupportedLanguage;
}

export default function MobileBottomNav({
  onOpenFeed,
  onOpenReels,
  onOpenMetro,
  onOpenMenu,
  activeTab = 'feed',
  currentLang = 'hi'
}: MobileBottomNavProps) {
  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-pb"
    >
      {/* 1. Feed Tab */}
      <button
        onClick={onOpenFeed}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition ${
          activeTab === 'feed'
            ? 'text-red-600 dark:text-red-400 font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Newspaper className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">{getUIText('news', currentLang)}</span>
      </button>

      {/* 2. Reels / Shorts Tab */}
      <button
        onClick={onOpenReels}
        className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition group"
      >
        <div className="relative">
          <Flame className="w-5 h-5 text-red-500 fill-current group-hover:scale-110 transition-transform" />
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 absolute -top-0.5 -right-0.5 animate-ping"></span>
        </div>
        <span className="text-[10px] tracking-tight font-semibold">{getUIText('reels', currentLang)}</span>
      </button>

      {/* 3. Metro Hubs Tab */}
      <button
        onClick={onOpenMetro}
        className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <Building2 className="w-5 h-5 text-amber-500" />
        <span className="text-[10px] tracking-tight font-semibold">{getUIText('metros', currentLang)}</span>
      </button>

      {/* 4. Menu / Drawer Tab */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] tracking-tight font-semibold">{getUIText('menu', currentLang)}</span>
      </button>
    </nav>
  );
}
