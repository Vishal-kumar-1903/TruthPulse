'use client';

import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Check, 
  Flame, 
  FileText 
} from 'lucide-react';
import { BreakingShort } from './BreakingShorts';
import { AuthUser } from './AuthModal';

interface ReelActionSidebarProps {
  short: BreakingShort;
  currentUser: AuthUser | null;
  onRequireAuth: (reason?: string) => void;
  onOpenComments: () => void;
  commentCount?: number;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onOpenFullArticle?: (short: BreakingShort) => void;
}

export default function ReelActionSidebar({
  short,
  currentUser,
  onRequireAuth,
  onOpenComments,
  commentCount = 14,
  isAudioOn,
  onToggleAudio,
  onOpenFullArticle
}: ReelActionSidebarProps) {
  const [upvotes, setUpvotes] = useState<number>((short?.trustScore ?? 95) * 14 + 120);
  const [downvotes, setDownvotes] = useState<number>(Math.max(1, Math.floor((100 - (short?.trustScore ?? 95)) / 2)));
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // 1. Role-Gated Green Thumb (Sahi News)
  const handleGreenVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onRequireAuth('Sign in with a verified account to cast your Sahi News credibility vote.');
      return;
    }

    if (userVote === 'UP') {
      setUserVote(null);
      setUpvotes((prev) => Math.max(0, prev - 1));
    } else {
      if (userVote === 'DOWN') {
        setDownvotes((prev) => Math.max(0, prev - 1));
      }
      setUserVote('UP');
      setUpvotes((prev) => prev + 1);
    }
  };

  // 2. Role-Gated Red Thumb (Fake News / Dispute)
  const handleRedVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onRequireAuth('Sign in to dispute or flag this reel as misleading.');
      return;
    }

    if (userVote === 'DOWN') {
      setUserVote(null);
      setDownvotes((prev) => Math.max(0, prev - 1));
    } else {
      if (userVote === 'UP') {
        setUpvotes((prev) => Math.max(0, prev - 1));
      }
      setUserVote('DOWN');
      setDownvotes((prev) => prev + 1);
    }
  };

  // 3. Native Share / Clipboard Link
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `[TruthShort] ${short?.headline || 'Breaking News'}`,
      text: `${short?.headline || ''} - ${short?.snippet || ''} (Verified on TruthPulse SatyaNews)`,
      url: typeof window !== 'undefined' ? window.location.href : 'https://truthpulse.news'
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${short.headline}\n${shareData.url}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3.5 sm:gap-4 select-none z-30 pointer-events-auto">
      
      {/* 1. TRUST SCORE BADGE */}
      <div 
        className="flex flex-col items-center" 
        title={`${short.trustScore}% Algorithmic & Civic Trust Rating`}
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="w-5 h-5 animate-pulse" />
        </div>
        <span className="text-[10px] font-mono font-black text-emerald-400 mt-1 tracking-tight drop-shadow">
          {short.trustScore}%
        </span>
      </div>

      {/* 2. GREEN THUMB (SAHI NEWS) */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleGreenVote}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl backdrop-blur-md ${
            userVote === 'UP'
              ? 'bg-emerald-500 text-white scale-110 ring-4 ring-emerald-400/40'
              : 'bg-black/50 hover:bg-black/70 text-white/90 hover:text-emerald-400 border border-white/15'
          }`}
          title="Verify (Sahi News)"
        >
          <ThumbsUp className={`w-5 h-5 ${userVote === 'UP' ? 'fill-current' : ''}`} />
        </button>
        <span className="text-[11px] font-mono font-bold text-white mt-1 drop-shadow">
          {upvotes}
        </span>
      </div>

      {/* 3. RED THUMB (FAKE / DISPUTE) */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleRedVote}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl backdrop-blur-md ${
            userVote === 'DOWN'
              ? 'bg-red-600 text-white scale-110 ring-4 ring-red-500/40'
              : 'bg-black/50 hover:bg-black/70 text-white/90 hover:text-red-400 border border-white/15'
          }`}
          title="Dispute / Flag (Fake News)"
        >
          <ThumbsDown className={`w-5 h-5 ${userVote === 'DOWN' ? 'fill-current' : ''}`} />
        </button>
        <span className="text-[11px] font-mono font-bold text-white mt-1 drop-shadow">
          {downvotes}
        </span>
      </div>

      {/* 4. COMMENTS DRAWER TRIGGER */}
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenComments();
          }}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/70 text-white/90 hover:text-cyan-400 border border-white/15 flex items-center justify-center transition-all shadow-xl backdrop-blur-md"
          title="View Citizen Perspectives & Ground Proofs"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
        <span className="text-[11px] font-mono font-bold text-white mt-1 drop-shadow">
          {commentCount}
        </span>
      </div>

      {/* 5. SHARE BUTTON */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleShare}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/70 text-white/90 hover:text-amber-400 border border-white/15 flex items-center justify-center transition-all shadow-xl backdrop-blur-md"
          title="Share Reel"
        >
          {isCopied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
        </button>
        <span className="text-[10px] font-mono text-white/90 mt-1 drop-shadow">
          {isCopied ? 'Copied' : 'Share'}
        </span>
      </div>

      {/* 6. TTS AI AUDIO READOUT TOGGLE */}
      <div className="flex flex-col items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleAudio();
          }}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all shadow-xl backdrop-blur-md ${
            isAudioOn
              ? 'bg-rose-600 text-white ring-2 ring-rose-400/50 animate-pulse'
              : 'bg-black/50 hover:bg-black/70 text-white/80 border border-white/15'
          }`}
          title={isAudioOn ? 'Mute AI Audio Voiceover' : 'Play AI Voiceover Readout'}
        >
          {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <span className="text-[9px] font-mono uppercase text-white/80 mt-1 drop-shadow">
          {isAudioOn ? 'Voice On' : 'Voice Off'}
        </span>
      </div>

      {/* 7. READ FULL SOURCED ARTICLE LINK */}
      {onOpenFullArticle && (
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFullArticle(short);
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center transition-all shadow-lg shadow-red-600/30"
            title="Read Sourced Article"
          >
            <FileText className="w-4 h-4" />
          </button>
          <span className="text-[9px] font-mono uppercase text-white/80 mt-1 drop-shadow">
            Article
          </span>
        </div>
      )}

    </div>
  );
}
