'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, 
  ArrowLeft,
  Radio, 
  BookOpen,
  MessageCircle,
  Scale,
  Sparkles,
  SlidersHorizontal,
  LogIn,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  Coins,
  Building2
} from 'lucide-react';
import { AuthUser } from './AuthModal';
import LanguageSelector from './LanguageSelector';
import { SupportedLanguage } from '@/lib/translations';

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
  currentUser,
  onOpenAuthModal,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onOpenLiveStream,
  currentLang = 'hi',
  onSelectLang,
  onOpenWhatsAppTipline,
  onOpenGazetteRag
}: SidebarDrawerProps) {
  if (!isOpen) return null;

  const isEditor = currentUser && (currentUser.role === 'CHIEF_EDITOR' || currentUser.role === 'ADMIN' || (currentUser.role as string) === 'EDITOR');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      
      {/* 1. BACKDROP OVERLAY */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 animate-fadeIn"
        onClick={onClose}
      />

      {/* 2. SLIDING OFF-CANVAS DRAWER (MINIMAL, POINT-TO-POINT, WHITE THEME) */}
      <div 
        className="fixed inset-y-0 left-0 max-w-xs sm:max-w-sm w-full bg-white border-r border-slate-200 text-slate-900 shadow-2xl flex flex-col justify-between z-50 transform transition-transform duration-200 ease-in-out"
      >
        
        {/* A. DRAWER HEADER */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          
          {/* Logo & SATYA Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/20 shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-base tracking-tight">TruthPulse</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-600 text-white uppercase tracking-wider">
                  SATYA
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500">Verified Press Bureau</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-sm"
            title="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* B. POINT-TO-POINT CONTENT AREA (NO CLUTTER, NO REDUNDANT HOME ITEMS) */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-4">

          {/* 1. USER IDENTITY & REPUTATION CARD */}
          {currentUser ? (
            <div className={`p-3.5 rounded-2xl border ${
              isEditor 
                ? 'bg-emerald-50/70 border-emerald-200' 
                : 'bg-blue-50/70 border-blue-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 truncate text-sm">{currentUser.name}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider ${
                  isEditor ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {isEditor ? 'VERIFIED BUREAU' : 'CITIZEN'}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs font-mono">
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currentUser.truthCredits} Credits</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {currentUser.email.split('@')[0]}
                </span>
              </div>

              {/* Quick direct desk jump for editors */}
              {isEditor && (
                <Link
                  href="/studio"
                  onClick={onClose}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Editor Studio Desk</span>
                </Link>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuthModal();
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Sign In / Verify Citizen Profile</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 group-hover:text-white">1-Click ↗</span>
            </button>
          )}

          {/* 2. SPECIALIZED DESKS (IMPORTANT POINT-TO-POINT ONLY) */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Editorial & Verification Desks
            </span>

            <div className="space-y-1.5">
              
              {/* Live TV */}
              <button
                onClick={() => {
                  if (onOpenLiveStream) onOpenLiveStream();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition text-xs font-bold group"
              >
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-red-600" />
                  <span>Live TV News Broadcast</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-600 text-white animate-pulse">
                  LIVE
                </span>
              </button>

              {/* Digital Magazine / E-Paper */}
              <Link
                href="/magazine"
                onClick={onClose}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition text-xs font-bold"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Digital Magazine & E-Paper</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800">
                  FLIPBOOK
                </span>
              </Link>

              {/* WhatsApp Tipline */}
              {onOpenWhatsAppTipline && (
                <button
                  onClick={() => {
                    onOpenWhatsAppTipline();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition text-xs font-bold"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
                    <span>WhatsApp 24/7 Fact-Check Bot</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    AI BOT
                  </span>
                </button>
              )}

              {/* e-Gazette RAG */}
              {onOpenGazetteRag && (
                <button
                  onClick={() => {
                    onOpenGazetteRag();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition text-xs font-bold"
                >
                  <div className="flex items-center gap-2.5">
                    <Scale className="w-4 h-4 text-indigo-600" />
                    <span>e-Gazette Statutory RAG Proof</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-100 text-indigo-800">
                    GOV PROOF
                  </span>
                </button>
              )}

              {/* Admin Console */}
              <Link
                href="/admin"
                onClick={onClose}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition text-xs font-bold"
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                  <span>Admin Configuration Console</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Tools ↗</span>
              </Link>

            </div>
          </div>

          {/* 3. APP PREFERENCES */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Preferences
            </span>

            <div className="space-y-2">
              {/* Language Selector */}
              {onSelectLang && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <LanguageSelector
                    currentLang={currentLang}
                    onSelectLang={onSelectLang}
                    variant="drawer"
                  />
                </div>
              )}

              {/* Theme Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
                  <span>Display Mode</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 font-bold">
                  {darkMode ? 'Dark' : 'Light'}
                </span>
              </button>

              {/* Log Out */}
              {currentUser && (
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 border border-red-100 transition text-xs font-bold"
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
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SHA-256 Tamper-Proof
          </span>
          <span>v2.4 Editorial Grid</span>
        </div>

      </div>

    </div>
  );
}
