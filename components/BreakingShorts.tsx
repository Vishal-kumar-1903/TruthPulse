'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Volume2, 
  VolumeX, 
  Share2, 
  ArrowUpRight, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  Clock 
} from 'lucide-react';
import AnimatedMedia from './AnimatedMedia';
import { SupportedLanguage, SUPPORTED_LANGUAGES, useAutoTranslate, getUIText } from '@/lib/translations';
import { BreakingShort, DEFAULT_BREAKING_SHORTS } from '@/lib/reelsData';
export type { BreakingShort };
export { DEFAULT_BREAKING_SHORTS };

interface BreakingShortsProps {
  shorts?: BreakingShort[];
  onSelectArticle?: (short: BreakingShort) => void;
  onOpenReels?: (index: number) => void;
  currentLang?: SupportedLanguage;
}

export default function BreakingShorts({
  shorts: initialShorts = DEFAULT_BREAKING_SHORTS,
  onSelectArticle,
  onOpenReels,
  currentLang = 'hi'
}: BreakingShortsProps) {
  const [liveShorts, setLiveShorts] = useState<BreakingShort[]>(initialShorts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Fetch dynamic published reels from /api/reels on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDynamicReels() {
      try {
        const res = await fetch('/api/reels');
        const data = await res.json();
        if (data.success && Array.isArray(data.shorts) && data.shorts.length > 0 && isMounted) {
          setLiveShorts(data.shorts);
        }
      } catch (err) {
        // Fallback to initialShorts
      }
    }
    loadDynamicReels();

    // Listen for newly published reels from Studio
    const handleNewReel = (e: any) => {
      if (e.detail?.short) {
        setLiveShorts(prev => [e.detail.short, ...prev.filter(s => s.id !== e.detail.short.id)]);
        setCurrentIndex(0);
        setProgress(0);
      } else {
        loadDynamicReels();
      }
    };

    window.addEventListener('truthpulse_new_reel', handleNewReel);
    return () => {
      isMounted = false;
      window.removeEventListener('truthpulse_new_reel', handleNewReel);
    };
  }, []);

  const [durationSec, setDurationSec] = useState<number>(5); // 5-second fast auto-transition default
  const DURATION_MS = durationSec * 1000;
  const TICK_MS = 50; // Smoother 50ms progress ticks
  const STEP_PERCENT = 100 / (DURATION_MS / TICK_MS);

  const activeShort = liveShorts[currentIndex] || liveShorts[0] || DEFAULT_BREAKING_SHORTS[0];
  const translatedHeadline = useAutoTranslate(activeShort.headline, currentLang);
  const translatedSnippet = useAutoTranslate(activeShort.snippet, currentLang);

  // 1. Text-to-Speech (TTS) Voiceover Synthesis
  const speakCurrentShort = useCallback((short: BreakingShort) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!isAudioOn) return;

    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang);
    const speechCode = langObj?.speechCode || 'en-IN';

    const speechText = `${short.badge}. ${translatedHeadline}. ${translatedSnippet}`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = speechCode;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase().includes(currentLang) || 
      v.lang.replace('_', '-').toLowerCase().includes(speechCode.toLowerCase())
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [isAudioOn, currentLang, translatedHeadline, translatedSnippet]);

  // Handle Audio toggle
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAudioOn) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsAudioOn(false);
    } else {
      setIsAudioOn(true);
      speakCurrentShort(activeShort);
    }
  };

  // 2. Next / Prev Handlers
  const goToNext = useCallback(() => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % liveShorts.length);
  }, [liveShorts.length]);

  const goToPrev = useCallback(() => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + liveShorts.length) % liveShorts.length);
  }, [liveShorts.length]);

  // Read next when slide switches if audio enabled
  useEffect(() => {
    if (isAudioOn) {
      speakCurrentShort(activeShort);
    }
  }, [currentIndex, isAudioOn, activeShort, speakCurrentShort]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 3. 10-Second Auto-Transition & Progress Timer
  useEffect(() => {
    if (isPaused) return;

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
  }, [isPaused, goToNext, STEP_PERCENT]);

  // 4. Touch Gestures (Mobile Swipe & Tap Zones)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    // Swipe left (> 50px) -> Next
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }
    setTouchStartX(null);
  };

  // Tap zone handler (left 30% for prev, right 70% for next)
  const handleTapZone = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width * 0.3) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  // Share handler
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `[TruthShort] ${activeShort.headline}`,
        text: activeShort.snippet,
        url: window.location.href
      });
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${activeShort.headline} - ${activeShort.snippet} (via TruthPulse Shorts)`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Badge badge styling
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'BREAKING':
        return 'bg-red-600 text-white shadow-red-600/30';
      case 'ALERT':
        return 'bg-amber-600 text-white shadow-amber-600/30';
      case 'FACT-CHECK':
        return 'bg-emerald-600 text-white shadow-emerald-600/30';
      default:
        return 'bg-blue-600 text-white shadow-blue-600/30';
    }
  };

  return (
    <div id="breaking-shorts-section" className="mb-8 font-sans scroll-mt-24 w-full max-w-full overflow-hidden">
      
      {/* =========================================================================
          MOBILE VIEW ONLY: INSTAGRAM-STYLE STORY AVATAR RINGS (< 768px)
         ========================================================================= */}
      <div className="block md:hidden mb-4 w-full overflow-hidden">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" />
            <span>Breaking Reels & Story Rings</span>
          </div>
          {onOpenReels ? (
            <button
              onClick={() => onOpenReels(currentIndex)}
              className="text-[10px] font-mono text-red-500 hover:text-red-400 font-bold flex items-center gap-0.5"
            >
              <span>Watch Reels</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          ) : (
            <span className="text-[10px] font-mono text-slate-400">Tap to watch</span>
          )}
        </div>

        {/* Horizontal Scrollable Avatar Rings */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 px-1 w-full max-w-full">
          {liveShorts.map((item, idx) => {
            const isRingActive = currentIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setProgress(0);
                  setCurrentIndex(idx);
                  if (onOpenReels) {
                    onOpenReels(idx);
                  }
                }}
                className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none"
              >
                <div className={`p-0.5 rounded-full transition-all duration-300 ${
                  isRingActive
                    ? 'bg-gradient-to-tr from-amber-500 via-red-500 to-rose-600 scale-105 ring-2 ring-red-500/30'
                    : 'bg-gradient-to-tr from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800'
                }`}>
                  <div className="w-14 h-14 rounded-full overflow-hidden p-0.5 bg-white dark:bg-slate-950">
                    <img
                      src={item.imageUrl}
                      alt={item.headline}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
                <span className={`text-[10px] font-bold max-w-[64px] truncate text-center ${
                  isRingActive 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {item.location.split(',')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MAIN SHORTS REEL ENGINE (RESPONSIVE PC & MOBILE CARD - CRISP WHITE THEME)
         ========================================================================= */}
      <div
        className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 text-slate-900 shadow-xl transition-all select-none group w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Background Visual Layer with High-Res Image & Clean White Gradients */}
        <div className="absolute inset-0 z-0">
          <AnimatedMedia
            key={activeShort.id}
            mediaType={activeShort.mediaType || 'IMAGE'}
            mediaUrl={activeShort.mediaUrl}
            imageUrl={activeShort.imageUrl}
            alt={activeShort.headline}
            category={activeShort.category}
            isReel={true}
            showBadge={false}
            className="w-full h-full object-cover opacity-20 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/70 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>
        </div>

        {/* 1. TOP SEGMENTED PROGRESS BARS (WhatsApp/Instagram Story Style) */}
        <div className="relative z-20 pt-3 px-4 sm:px-6">
          <div className="flex items-center gap-1.5 w-full">
            {liveShorts.map((_, idx) => {
              let segmentFill = '0%';
              if (idx < currentIndex) segmentFill = '100%';
              else if (idx === currentIndex) segmentFill = `${progress}%`;

              return (
                <div
                  key={idx}
                  className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => {
                    setProgress(0);
                    setCurrentIndex(idx);
                  }}
                  title={`Story ${idx + 1}`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-100 ease-linear"
                    style={{ width: segmentFill }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. REEL TOP CONTROLS & STATUS BAR */}
        <div className="relative z-20 px-4 sm:px-6 pt-3 pb-1 flex items-center justify-between text-xs">
          
          <div className="flex items-center gap-2">
            {/* Reel Badge (BREAKING / ALERT / FACT-CHECK) */}
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-sm ${getBadgeStyle(activeShort.badge)}`}>
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{activeShort.badge}</span>
            </span>

            {/* Location Tag */}
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white/90 px-2.5 py-0.5 rounded-md border border-slate-200 shadow-sm max-w-[120px] sm:max-w-none truncate">
              <MapPin className="w-3 h-3 text-red-600 shrink-0" />
              <span className="truncate">{activeShort.location}</span>
            </span>

            {/* Time Ago */}
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-500 font-semibold">
              <Clock className="w-3 h-3" />
              <span>{activeShort.timeAgo}</span>
            </span>
          </div>

          {/* Right Header Buttons: Speed Selector, TTS Audio & Pause Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Speed Selector Toggle Pill (5s default -> 8s -> 3s) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProgress(0);
                setDurationSec((prev) => (prev === 5 ? 8 : (prev === 8 ? 3 : 5)));
              }}
              className="px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-mono font-bold transition flex items-center gap-1 border border-slate-200 shadow-sm"
              title="Click to toggle reel transition speed (5s / 8s / 3s)"
            >
              <Clock className="w-2.5 h-2.5 text-amber-500" />
              <span>{durationSec}s</span>
            </button>

            {/* Pause Status Indicator */}
            {isPaused && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono border border-amber-300 animate-pulse font-bold">
                <Pause className="w-2.5 h-2.5" />
                <span>PAUSED</span>
              </span>
            )}

            {/* 1-Click TTS Audio Readout Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-1.5 rounded-full transition flex items-center gap-1 text-[11px] font-bold shadow-sm ${
                isAudioOn
                  ? 'bg-red-600 text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
              title={isAudioOn ? 'Mute AI Voiceover' : 'Turn ON AI Voiceover Readout'}
            >
              {isAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline font-mono">{isAudioOn ? 'Voice On' : 'Voice Off'}</span>
            </button>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(!isPaused);
              }}
              className="p-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-sm"
              title={isPaused ? 'Resume Auto-Play' : 'Pause Reel'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

          </div>

        </div>

        {/* 3. MAIN REEL CONTENT AREA (With Left/Right Tap Zones on Mobile) */}
        <div 
          onClick={handleTapZone}
          className="relative z-10 p-5 sm:p-7 min-h-[170px] sm:min-h-[190px] flex flex-col justify-center cursor-pointer"
        >
          {/* Headline */}
          <h3 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 leading-snug tracking-tight mb-2">
            {translatedHeadline}
          </h3>

          {/* Under 30-word Ultra-Crisp Snippet */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl line-clamp-2 sm:line-clamp-none">
            {translatedSnippet}
          </p>

          <div className="mt-2 text-[10px] font-mono text-slate-500 flex items-center gap-2">
            <span>Wire Attribution: <strong className="text-slate-800">{activeShort.source}</strong></span>
            <span>•</span>
            <span className="text-emerald-600 font-bold">{activeShort.trustScore}% Verified Authenticity</span>
          </div>
        </div>

        {/* 4. BOTTOM INTERACTIVE BAR & THUMB CONTROLS */}
        <div className="relative z-20 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Quick Fact-Check & Verification Status */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Multi-Agent Audited</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-500">
              <span>Short {currentIndex + 1} of {liveShorts.length}</span>
            </span>
          </div>

          {/* Actions: Prev / Next, Share & Read Full Article */}
          <div className="flex items-center gap-2">
            
            {/* Manual Skip Controls (Desktop & Mobile) */}
            <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200 shadow-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                title="Previous Short (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="h-3 w-px bg-slate-200"></div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
                title="Next Short (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition border border-slate-200 shadow-sm"
              title="Share Short"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedShare ? 'Copied!' : 'Share'}</span>
            </button>

            {/* FULL-SCREEN REELS VERTICAL MODE TRIGGER BUTTON */}
            {onOpenReels && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenReels(currentIndex);
                }}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white text-xs font-black tracking-wide transition shadow-md shadow-red-600/30 animate-pulse"
                title="Enter Immersive Vertical Swipe Reels Mode"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>WATCH REEL</span>
              </button>
            )}

            {/* Read Full Article Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectArticle) {
                  onSelectArticle(activeShort);
                } else {
                  // Smooth scroll to news feed
                  const el = document.getElementById('news-grid-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
            >
              <span>Read Full</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
