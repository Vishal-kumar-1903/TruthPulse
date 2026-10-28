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

export interface BreakingShort {
  id: string;
  badge: 'BREAKING' | 'ALERT' | 'FACT-CHECK';
  headline: string;
  snippet: string; // Under 30 words
  location: string;
  source: string;
  fullArticleId?: string;
  category: string;
  imageUrl: string;
  mediaType?: 'IMAGE' | 'VIDEO_LOOP' | 'LOTTIE_ANIMATION';
  mediaUrl?: string;
  trustScore: number;
  timeAgo: string;
}

export const DEFAULT_BREAKING_SHORTS: BreakingShort[] = [
  {
    id: 'short-1',
    badge: 'BREAKING',
    headline: 'Parliament Clears Historic Electoral Transparency & Digital Infrastructure Act',
    snippet: 'Mandatory algorithmic verification and real-time treasury expenditure dashboards codified into national law across all parliamentary constituencies.',
    location: 'New Delhi',
    source: 'ANI National Wire',
    fullArticleId: '6adaec408ec6de7245571a3e',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000',
    mediaType: 'VIDEO_LOOP',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
    trustScore: 96,
    timeAgo: '12m ago'
  },
  {
    id: 'short-2',
    badge: 'ALERT',
    headline: 'Raigarh Collector Enforces 48-Hour Stack Emission Telemetry Audit',
    snippet: 'Special surveillance squads dispatched along Taraimal industrial corridor to verify continuous electrostatic precipitator uptime across sponge iron rolling mills.',
    location: 'Raigarh, CG',
    source: 'CECB Statutory Desk',
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1000',
    mediaType: 'VIDEO_LOOP',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-solar-panels-in-a-field-42517-large.mp4',
    trustScore: 95,
    timeAgo: '24m ago'
  },
  {
    id: 'short-3',
    badge: 'FACT-CHECK',
    headline: 'Debunked: Fabricated Social Circular Claims Bottled Water Suspension in North India',
    snippet: 'FSSAI confirms routine quality tests ongoing; no sales suspension or production halts have been ordered. Public urged to disregard manipulated video clips.',
    location: 'New Delhi / Lucknow',
    source: 'PIB Fact-Check Bureau',
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000',
    mediaType: 'IMAGE',
    trustScore: 98,
    timeAgo: '35m ago'
  },
  {
    id: 'short-4',
    badge: 'BREAKING',
    headline: 'Sensex Rallies 780 Points as Indian Manufacturing PMI Hits 16-Year Record of 59.4',
    snippet: 'Capital goods and electronics exports power secondary desks; foreign institutional desks record net positive buying surpassing ₹4,800 crore in single session.',
    location: 'Mumbai, MH',
    source: 'Reuters / Dalal Street',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000',
    mediaType: 'LOTTIE_ANIMATION',
    trustScore: 94,
    timeAgo: '42m ago'
  },
  {
    id: 'short-5',
    badge: 'ALERT',
    headline: 'Convective Lightning & Squall Advisory Issued for Central Chhattisgarh',
    snippet: 'Raigarh, Bilaspur, and Janjgir placed on alert for 45 km/h gusts and localized cloud-to-ground strikes. Farmers advised to shelter in masonry dwellings.',
    location: 'Bilaspur & Raigarh, CG',
    source: 'IMD Raipur Radar',
    category: 'Weather',
    imageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1000',
    mediaType: 'LOTTIE_ANIMATION',
    trustScore: 93,
    timeAgo: '50m ago'
  },
  {
    id: 'short-6',
    badge: 'BREAKING',
    headline: 'Geneva Climate Accord Ratified: 42 Sovereign Nations Back $15B Transition Fund',
    snippet: 'United Nations delegates approve binding satellite registry standards for sovereign green issuances, guaranteeing emergency resilience grants for coastal corridors.',
    location: 'Geneva, Switzerland',
    source: 'UN Palais Wire',
    category: 'International',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000',
    trustScore: 97,
    timeAgo: '1h ago'
  }
];

interface BreakingShortsProps {
  shorts?: BreakingShort[];
  onSelectArticle?: (short: BreakingShort) => void;
  onOpenReels?: (index: number) => void;
  currentLang?: SupportedLanguage;
}

export default function BreakingShorts({
  shorts = DEFAULT_BREAKING_SHORTS,
  onSelectArticle,
  onOpenReels,
  currentLang = 'hi'
}: BreakingShortsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const [durationSec, setDurationSec] = useState<number>(5); // 5-second fast auto-transition default
  const DURATION_MS = durationSec * 1000;
  const TICK_MS = 50; // Smoother 50ms progress ticks
  const STEP_PERCENT = 100 / (DURATION_MS / TICK_MS);

  const activeShort = shorts[currentIndex] || shorts[0];
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
    setCurrentIndex((prev) => (prev + 1) % shorts.length);
  }, [shorts.length]);

  const goToPrev = useCallback(() => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + shorts.length) % shorts.length);
  }, [shorts.length]);

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
          {shorts.map((item, idx) => {
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
          MAIN SHORTS REEL ENGINE (RESPONSIVE PC & MOBILE CARD)
         ========================================================================= */}
      <div
        className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl transition-all select-none group w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Background Visual Layer with High-Res Image & Dramatic Gradients */}
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
            className="w-full h-full object-cover opacity-35 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent pointer-events-none"></div>
        </div>

        {/* 1. TOP SEGMENTED PROGRESS BARS (WhatsApp/Instagram Story Style) */}
        <div className="relative z-20 pt-3 px-4 sm:px-6">
          <div className="flex items-center gap-1.5 w-full">
            {shorts.map((_, idx) => {
              let segmentFill = '0%';
              if (idx < currentIndex) segmentFill = '100%';
              else if (idx === currentIndex) segmentFill = `${progress}%`;

              return (
                <div
                  key={idx}
                  className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden cursor-pointer backdrop-blur-sm"
                  onClick={() => {
                    setProgress(0);
                    setCurrentIndex(idx);
                  }}
                  title={`Story ${idx + 1}`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-amber-400 rounded-full transition-all duration-100 ease-linear"
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
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md ${getBadgeStyle(activeShort.badge)}`}>
              <Radio className="w-3 h-3 animate-pulse" />
              <span>{activeShort.badge}</span>
            </span>

            {/* Location Tag */}
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10 max-w-[110px] sm:max-w-none truncate">
              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
              <span className="truncate">{activeShort.location}</span>
            </span>

            {/* Time Ago */}
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400">
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
              className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-[10px] font-mono font-bold transition flex items-center gap-1 border border-white/10"
              title="Click to toggle reel transition speed (5s / 8s / 3s)"
            >
              <Clock className="w-2.5 h-2.5 text-amber-400" />
              <span>{durationSec}s</span>
            </button>

            {/* Pause Status Indicator */}
            {isPaused && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30 animate-pulse">
                <Pause className="w-2.5 h-2.5" />
                <span>PAUSED</span>
              </span>
            )}

            {/* 1-Click TTS Audio Readout Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-1.5 rounded-full transition flex items-center gap-1 text-[11px] font-bold ${
                isAudioOn
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
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
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
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
          <h3 className="text-base sm:text-xl md:text-2xl font-black text-white leading-snug tracking-tight mb-2 drop-shadow-md">
            {translatedHeadline}
          </h3>

          {/* Under 30-word Ultra-Crisp Snippet */}
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl drop-shadow line-clamp-2 sm:line-clamp-none">
            {translatedSnippet}
          </p>

          <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center gap-2">
            <span>Wire Attribution: <strong className="text-slate-200">{activeShort.source}</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">{activeShort.trustScore}% Verified Authenticity</span>
          </div>
        </div>

        {/* 4. BOTTOM INTERACTIVE BAR & THUMB CONTROLS */}
        <div className="relative z-20 px-3 sm:px-6 py-2.5 sm:py-3 border-t border-white/10 bg-slate-950/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Quick Fact-Check & Verification Status */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-Agent Audited</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <span>Short {currentIndex + 1} of {shorts.length}</span>
            </span>
          </div>

          {/* Actions: Prev / Next, Share & Read Full Article */}
          <div className="flex items-center gap-2">
            
            {/* Manual Skip Controls (Desktop & Mobile) */}
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition"
                title="Previous Short (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="h-3 w-px bg-white/20"></div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition"
                title="Next Short (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition"
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
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white text-xs font-black tracking-wide transition shadow-lg shadow-red-600/30 animate-pulse"
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700 shadow-sm"
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
