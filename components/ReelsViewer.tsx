'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ArrowLeft, 
  ChevronUp, 
  ChevronDown, 
  Pause, 
  Play, 
  Radio, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  Volume2, 
  VolumeX, 
  Share2,
  FileText,
  Flame,
  Sparkles,
  Info
} from 'lucide-react';
import { BreakingShort } from './BreakingShorts';
import { AuthUser } from './AuthModal';
import ReelActionSidebar from './ReelActionSidebar';
import ReelCommentDrawer from './ReelCommentDrawer';
import { SupportedLanguage, SUPPORTED_LANGUAGES, translateHeadline, getUIText } from '@/lib/translations';

interface ReelsViewerProps {
  shorts: BreakingShort[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onRequireAuth: (reason?: string) => void;
  onOpenFullArticle?: (short: BreakingShort) => void;
  currentLang?: SupportedLanguage;
}

export default function ReelsViewer({
  shorts,
  initialIndex = 0,
  isOpen,
  onClose,
  currentUser,
  onRequireAuth,
  onOpenFullArticle,
  currentLang = 'en'
}: ReelsViewerProps) {
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
  const [durationSec, setDurationSec] = useState<number>(6); // 6-second auto-transition

  // Touch gesture state
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const wheelLockRef = useRef<boolean>(false);

  // Sync initialIndex on open
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
      setProgress(0);
      setIsPaused(false);
      setIsCommentsOpen(false);
    }
  }, [isOpen, initialIndex]);

  const activeShort = shorts[activeIndex] || shorts[0];

  // 1. Text-to-Speech (TTS) Voiceover
  const speakReel = useCallback((short: BreakingShort) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!isAudioOn) return;

    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang);
    const speechCode = langObj?.speechCode || 'en-IN';

    const translatedHeadline = currentLang !== 'en' ? translateHeadline(short.headline, currentLang) : short.headline;
    const speechText = `${short.badge}. ${translatedHeadline}. ${short.snippet}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.05;
    utterance.lang = speechCode;
    window.speechSynthesis.speak(utterance);
  }, [isAudioOn, currentLang]);

  const toggleAudio = useCallback(() => {
    if (isAudioOn) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAudioOn(false);
    } else {
      setIsAudioOn(true);
      speakReel(activeShort);
    }
  }, [isAudioOn, activeShort, speakReel]);

  // Clean TTS on close
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  // Read on slide switch if audio enabled
  useEffect(() => {
    if (isOpen && isAudioOn && activeShort) {
      speakReel(activeShort);
    }
  }, [activeIndex, isAudioOn, isOpen, activeShort, speakReel]);

  // 2. Navigation Next / Prev
  const goToNext = useCallback(() => {
    setProgress(0);
    setActiveIndex((prev) => (prev + 1) % shorts.length);
  }, [shorts.length]);

  const goToPrev = useCallback(() => {
    setProgress(0);
    setActiveIndex((prev) => (prev - 1 + shorts.length) % shorts.length);
  }, [shorts.length]);

  // 3. Auto-Advance Timer & Segmented Progress Bar
  const TICK_MS = 50;
  const STEP_PERCENT = 100 / ((durationSec * 1000) / TICK_MS);

  useEffect(() => {
    if (!isOpen || isPaused || isHolding || isCommentsOpen) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + STEP_PERCENT;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, isHolding, isCommentsOpen, goToNext, STEP_PERCENT, durationSec]);

  // 4. Keyboard Shortcuts (ArrowUp, ArrowDown, Space, Esc, M)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommentsOpen) return; // Don't intercept when commenting

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          goToNext();
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          goToPrev();
          break;
        case ' ':
          e.preventDefault();
          setIsPaused((p) => !p);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleAudio();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isCommentsOpen, goToNext, goToPrev, onClose, toggleAudio]);

  // 5. Touch Gestures (Vertical Swipe UP / DOWN & Press-and-Hold to Freeze)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHolding(true);
    touchStartYRef.current = e.touches[0].clientY;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsHolding(false);
    if (touchStartYRef.current === null) return;

    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
    const diffX = touchStartXRef.current ? touchStartXRef.current - e.changedTouches[0].clientX : 0;

    // Primarily vertical swipe
    if (Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 45) {
        // Swipe UP -> Next Reel
        goToNext();
      } else if (diffY < -45) {
        // Swipe DOWN -> Previous Reel
        goToPrev();
      }
    } else {
      // Horizontal swipe: Swipe right (> 60px) -> Close
      if (diffX < -60) {
        onClose();
      }
    }

    touchStartYRef.current = null;
    touchStartXRef.current = null;
  };

  // 6. Mouse Wheel Scroll (Desktop Vertical Snap)
  const handleWheel = (e: React.WheelEvent) => {
    if (isCommentsOpen) return;
    if (wheelLockRef.current) return;

    if (Math.abs(e.deltaY) > 25) {
      wheelLockRef.current = true;
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 350);
    }
  };

  // Badge Color Helper
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'BREAKING':
        return 'bg-red-600 text-white shadow-red-600/40 ring-1 ring-red-400/50';
      case 'ALERT':
        return 'bg-amber-600 text-white shadow-amber-600/40 ring-1 ring-amber-400/50';
      case 'FACT-CHECK':
        return 'bg-emerald-600 text-white shadow-emerald-600/40 ring-1 ring-emerald-400/50';
      default:
        return 'bg-blue-600 text-white shadow-blue-600/40';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center font-sans overflow-hidden select-none"
      onWheel={handleWheel}
    >
      
      {/* DESKTOP BLURRED BACKGROUND MEDIA */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden md:block pointer-events-none">
        <img
          src={activeShort.imageUrl}
          alt={activeShort.headline}
          className="w-full h-full object-cover blur-3xl opacity-25 scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl"></div>
      </div>

      {/* DESKTOP FLOATING CONTROLS & KEYBOARD GUIDE */}
      <div className="hidden lg:flex flex-col items-center gap-3 absolute left-12 top-1/2 -translate-y-1/2 z-40 text-white/70">
        <button
          onClick={goToPrev}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition shadow-xl hover:scale-105"
          title="Previous Reel (Arrow Up)"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-[10px] font-mono text-slate-400 space-y-1 py-1">
          <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-bold">↑ UP</span>
          <span>Reel</span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-bold">↓ DOWN</span>
        </div>

        <button
          onClick={goToNext}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition shadow-xl hover:scale-105"
          title="Next Reel (Arrow Down)"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* =========================================================================
          MAIN SMARTPHONE REEL CONTAINER (100% on Mobile, 9:16 Frame on Desktop)
         ========================================================================= */}
      <div 
        className="relative z-10 w-full h-full md:w-[420px] md:h-[92vh] md:max-h-[860px] md:rounded-3xl overflow-hidden bg-slate-950 md:border md:border-slate-800 shadow-2xl flex flex-col justify-between"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={() => setIsHolding(true)}
        onMouseUp={() => setIsHolding(false)}
      >
        
        {/* BACKGROUND MEDIA WITH HIGH DYNAMIC CONTRAST GRADIENTS */}
        <div className="absolute inset-0 z-0">
          <img
            key={activeShort.id}
            src={activeShort.imageUrl}
            alt={activeShort.headline}
            className="w-full h-full object-cover transition-transform duration-1000 scale-100 hover:scale-105"
          />
          {/* Top Gradient for Status & Progress Visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-transparent h-44 pointer-events-none"></div>
          {/* Bottom Gradient for Headline & Takeaways Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent top-1/4 pointer-events-none"></div>
        </div>

        {/* 1. TOP SEGMENTED PROGRESS BARS (WhatsApp/Instagram Story Style) */}
        <div className="relative z-30 pt-3 px-3 sm:px-4 shrink-0">
          <div className="flex items-center gap-1.5 w-full">
            {shorts.map((_, idx) => {
              let segmentFill = '0%';
              if (idx < activeIndex) segmentFill = '100%';
              else if (idx === activeIndex) segmentFill = `${progress}%`;

              return (
                <div
                  key={idx}
                  className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden cursor-pointer backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProgress(0);
                    setActiveIndex(idx);
                  }}
                  title={`Reel ${idx + 1}`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-amber-400 rounded-full transition-all duration-75 ease-linear"
                    style={{ width: segmentFill }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. REEL HEADER BAR (Back/Close, Badges, Speed, Status) */}
        <div className="relative z-30 px-3 sm:px-4 py-2 flex items-center justify-between text-xs text-white shrink-0">
          
          {/* Left: Close / Back Arrow + Badge */}
          <div className="flex items-center gap-2">
            
            {/* INSTANT CLOSE / BACK BUTTON */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 sm:p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition shadow-md group"
              title="Return to News Portal"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Reel Badge (BREAKING / ALERT / FACT-CHECK) */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getBadgeStyle(activeShort.badge)}`}>
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{activeShort.badge}</span>
            </span>

            {/* Category Badge */}
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/15 backdrop-blur-md text-white border border-white/10">
              {activeShort.category}
            </span>
          </div>

          {/* Right: Pause Indicator, Speed Pill, and Volume */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Pause Status Indicator */}
            {(isPaused || isHolding) && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30 animate-pulse">
                <Pause className="w-2.5 h-2.5" />
                <span>PAUSED</span>
              </span>
            )}

            {/* Speed Pill (6s default -> 9s -> 3s) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProgress(0);
                setDurationSec((prev) => (prev === 6 ? 9 : (prev === 9 ? 3 : 6)));
              }}
              className="px-2 py-0.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-200 text-[10px] font-mono font-bold border border-white/20 transition backdrop-blur-md"
              title="Click to toggle reel duration (6s / 9s / 3s)"
            >
              <span>{durationSec}s</span>
            </button>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition backdrop-blur-md"
              title={isPaused ? 'Resume Auto-Play' : 'Pause Reel'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Close Cross Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 backdrop-blur-md transition shadow-md"
              title="Close Reels"
            >
              <X className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

        {/* 3. CENTER TAP ZONES (Tap Left -> Prev, Tap Right -> Next) */}
        <div 
          className="relative z-10 flex-1 flex"
          title="Tap left for prev, tap right for next, hold to freeze"
        >
          <div 
            className="w-1/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
          />
          <div 
            className="w-2/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          />
        </div>

        {/* 4. BOTTOM INTERACTION AREA (Headline, AI Takeaway, Source, Floating Right Sidebar) */}
        <div className="relative z-20 p-4 sm:p-5 flex items-end justify-between gap-3 shrink-0">
          
          {/* Left Content Stack */}
          <div className="flex-1 space-y-2.5 max-w-[calc(100%-60px)]">
            
            {/* Location & Time Stamp */}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                <span className="truncate max-w-[130px]">{activeShort.location}</span>
              </span>

              <span className="flex items-center gap-1 text-[10px] font-mono text-slate-300">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{activeShort.timeAgo}</span>
              </span>
            </div>

            {/* Bold 2-Line Headline */}
            <h2 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight drop-shadow-md line-clamp-2">
              {currentLang !== 'en' ? translateHeadline(activeShort.headline, currentLang) : activeShort.headline}
            </h2>

            {/* 40-Word AI-Synthesized Bullet Takeaway */}
            <div className="p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-slate-200 leading-relaxed shadow-lg">
              <p className="line-clamp-3">
                {activeShort.snippet}
              </p>
            </div>

            {/* Source Attribution & Read Full Article Trigger */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[10px] font-mono text-slate-400 truncate">
                Wire: <strong className="text-slate-200">{activeShort.source}</strong>
              </span>

              {onOpenFullArticle && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenFullArticle(activeShort);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold shadow-md transition shrink-0"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>

          </div>

          {/* Right Floating Action Sidebar (Sahi, Fake, Comment, Share, TTS) */}
          <ReelActionSidebar
            short={activeShort}
            currentUser={currentUser}
            onRequireAuth={onRequireAuth}
            onOpenComments={() => setIsCommentsOpen(true)}
            isAudioOn={isAudioOn}
            onToggleAudio={toggleAudio}
            onOpenFullArticle={onOpenFullArticle}
          />

        </div>

        {/* 5. SLIDE-UP COMMENTS DRAWER OVERLAY */}
        <ReelCommentDrawer
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          short={activeShort}
          currentUser={currentUser}
          onRequireAuth={onRequireAuth}
        />

      </div>

    </div>
  );
}
