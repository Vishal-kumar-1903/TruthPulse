'use client';

import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Share2, 
  CheckCircle2,
  Lock,
  MessageSquare,
  Send,
  Eye,
  Cpu,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Scan,
  Scale,
  Users,
  Heart,
  Coins,
  Volume2,
  VolumeX
} from 'lucide-react';
import { AuthUser } from './AuthModal';
import { SupportedLanguage, translateHeadline, getUIText } from '@/lib/translations';
import AnimatedMedia from './AnimatedMedia';

export type MediaType = 'IMAGE' | 'VIDEO_LOOP' | 'LOTTIE_ANIMATION';

export interface ArticleItem {
  _id: string;
  title: string;
  summary: string;
  bullets?: string[];
  content?: string;
  category: string;
  region: 'National' | 'International';
  state?: string;
  city?: string;
  location?: {
    regionType: string;
    state?: string;
    city?: string;
  };
  sources?: Array<{
    name: string;
    url: string;
    stance: string;
    reliability?: number;
    rawSnippet?: string;
  }>;
  upvotes: number;
  downvotes: number;
  greenVoters?: string[];
  redVoters?: string[];
  isVerified: boolean;
  trustScore: number;
  isPinned?: boolean;
  contentHash?: string;
  imageUrl?: string;
  mediaType?: MediaType;
  mediaUrl?: string;
  createdAt?: string;
  author?: string;
  comments?: Array<{
    userId: string;
    userName: string;
    userRole?: string;
    text: string;
    evidenceUrl?: string;
    createdAt: string;
  }>;
}

interface NewsCardProps {
  article: ArticleItem;
  currentUser: AuthUser | null;
  onRequireAuth: (reason?: string) => void;
  onOpenCryptoSeal?: (article: ArticleItem) => void;
  onOpenForensics?: (imageUrl: string, title: string) => void;
  onOpenGazetteRag?: (claim: string) => void;
  onOpenCommunityNotes?: (articleId: string, articleTitle: string) => void;
  onOpenUpiTip?: (authorName: string, articleTitle: string) => void;
  isHero?: boolean;
  currentLang?: SupportedLanguage;
}

export default function NewsCard({ 
  article, 
  currentUser, 
  onRequireAuth, 
  onOpenCryptoSeal,
  onOpenForensics,
  onOpenGazetteRag,
  onOpenCommunityNotes,
  onOpenUpiTip,
  isHero = false,
  currentLang = 'en'
}: NewsCardProps) {
  const [upvotes, setUpvotes] = useState(article.upvotes || 0);
  const [downvotes, setDownvotes] = useState(article.downvotes || 0);
  const [isVerified, setIsVerified] = useState(article.isVerified || false);
  const [trustScore, setTrustScore] = useState(article.trustScore || 80);
  
  // Track user's specific vote
  const initialUserVote = currentUser 
    ? (article.greenVoters?.includes(currentUser.id) ? 'GREEN' : (article.redVoters?.includes(currentUser.id) ? 'RED' : null))
    : null;
  const [userVote, setUserVote] = useState<'GREEN' | 'RED' | null>(initialUserVote);
  const [submittingVote, setSubmittingVote] = useState(false);

  // Dual-Audience Mode toggle on card
  const [viewMode, setViewMode] = useState<'OBSERVER' | 'INVESTIGATOR'>('OBSERVER');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(article.comments || []);
  const [commentText, setCommentText] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // 1-Click TTS Audio Narration State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${displayTitle}. ${article.summary}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (currentLang === 'hi') {
      const hiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('Hindi'));
      if (hiVoice) utterance.voice = hiVoice;
    } else {
      const inVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN'));
      if (inVoice) utterance.voice = inVoice;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // Compute time ago
  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Just now';
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Color-coded category badge styling
  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'politics':
        return 'bg-red-600 text-white';
      case 'business':
        return 'bg-blue-600 text-white';
      case 'sports':
        return 'bg-emerald-600 text-white';
      case 'weather':
        return 'bg-sky-600 text-white';
      case 'entertainment':
        return 'bg-purple-600 text-white';
      case 'health':
        return 'bg-teal-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  // ROLE-GATED GREEN THUMB VOTE (Sahi News / Verified)
  // HELPFUL APPRECIATION VOTE (Replaces binary Right/Wrong judging)
  const handleHelpfulVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      onRequireAuth('Please sign in to mark this dispatch as helpful.');
      return;
    }

    if (submittingVote) return;
    setSubmittingVote(true);

    // Optimistic UI state update
    if (userVote === 'GREEN') {
      setUserVote(null);
      setUpvotes((prev) => Math.max(0, prev - 1));
    } else {
      setUserVote('GREEN');
      setUpvotes((prev) => prev + 1);
    }

    try {
      const res = await fetch(`/api/articles/${article._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VOTE',
          type: 'GREEN',
          userId: currentUser.id,
          userName: currentUser.name
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setUpvotes(data.data.upvotes);
        setUserVote(data.data.userVote);
      }
    } catch (err) {
      console.error('Failed to submit helpful reaction:', err);
    } finally {
      setSubmittingVote(false);
    }
  };

  // Submit comment / counter-evidence
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth('Please sign in to submit community comments or counter-evidence links.');
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/articles/${article._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'COMMENT',
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          text: commentText.trim(),
          evidenceUrl: evidenceUrl.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.comments) {
        setComments(data.comments);
        setCommentText('');
        setEvidenceUrl('');
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Share story
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      });
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title} - Read verified on TruthPulse: ${window.location.href}`);
    }
  };

  const locationLabel = article.city 
    ? `${article.city}, ${article.state || ''}` 
    : article.state || article.location?.city || article.location?.state || article.region || 'India';

  const displayTitle = currentLang && currentLang !== 'en' 
    ? translateHeadline(article.title, currentLang) 
    : article.title;

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group font-sans w-full max-w-full ${
      isHero ? 'grid grid-cols-1 lg:grid-cols-12 gap-0' : 'flex flex-col justify-between'
    }`}>
      
      {/* 1. COVER DYNAMIC MEDIA (VIDEO LOOP / LOTTIE / KEN-BURNS) & BADGES */}
      <div className={`relative ${isHero ? 'lg:col-span-7 aspect-[16/10] lg:aspect-auto' : 'aspect-[16/10]'} w-full overflow-hidden bg-slate-100 dark:bg-slate-800`}>
        <AnimatedMedia
          mediaType={article.mediaType || 'IMAGE'}
          mediaUrl={article.mediaUrl}
          imageUrl={article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800'}
          alt={article.title}
          category={article.category}
          isHero={isHero}
          showBadge={true}
        />

        {/* Category & Global Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${getCategoryColor(article.category)}`}>
            {article.category || 'General'}
          </span>

          {article.region === 'International' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-cyan-300 backdrop-blur-sm border border-cyan-500/30">
              Global
            </span>
          )}

          {isHero && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 backdrop-blur-sm border border-amber-500/30">
              Featured Lead
            </span>
          )}
        </div>

        {/* Dual Mode Switcher & Forensics Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {onOpenForensics && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenForensics(article.imageUrl || '', article.title);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 hover:bg-black/90 text-[10px] font-mono text-cyan-400 backdrop-blur-md border border-cyan-500/40 transition shadow-sm"
              title="Inspect C2PA AI Deepfake Forensics & ELA Spectrum"
            >
              <Scan className="w-3 h-3 text-cyan-400" />
              <span className="hidden xs:inline">C2PA</span>
              <span>Forensics</span>
            </button>
          )}

          <button
            onClick={() => setViewMode(viewMode === 'OBSERVER' ? 'INVESTIGATOR' : 'OBSERVER')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 hover:bg-black/90 text-[10px] font-mono text-slate-200 backdrop-blur-md border border-white/20 transition shadow-sm"
            title="Toggle Observer Mode / Investigator Mode"
          >
            {viewMode === 'OBSERVER' ? <Eye className="w-3 h-3 text-emerald-400" /> : <Cpu className="w-3 h-3 text-cyan-400" />}
            <span>{viewMode === 'OBSERVER' ? 'Observer' : 'Evidence'}</span>
          </button>
        </div>

        {/* Verified Status Banner */}
        {isVerified && (
          <div className="absolute bottom-2 left-3 py-0.5 px-2 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm backdrop-blur-sm">
            <CheckCircle2 className="w-3 h-3" />
            <span>{getUIText('verifiedByEditor', currentLang)}</span>
          </div>
        )}
      </div>

      {/* 2. CARD CONTENT (Dual-Mode: Observer vs Investigator) */}
      <div className={`p-4 sm:p-5 ${isHero ? 'lg:col-span-5 lg:p-7' : ''} flex-1 flex flex-col justify-between`}>
        
        <div>
          {/* Location & Time Stamp */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{locationLabel}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0 font-mono">
              <Clock className="w-3 h-3" />
              <span>{getTimeAgo(article.createdAt)}</span>
            </span>
          </div>

          {/* Headline */}
          <h3 className={`${isHero ? 'text-lg sm:text-2xl lg:text-3xl font-black' : 'text-base sm:text-lg font-bold'} text-slate-900 dark:text-slate-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 sm:line-clamp-3 leading-snug mb-2.5`}>
            {displayTitle}
          </h3>

          {/* 1-Click "Listen in 20s" Audio Narration */}
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition shadow-sm ${
                isPlayingAudio
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
              }`}
              title={isPlayingAudio ? 'Stop audio' : 'Listen to 60-word dispatch in 20s'}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 shrink-0" />
                  <span>Playing...</span>
                  <span className="flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce"></span>
                    <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-1 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Listen in 20s</span>
                </>
              )}
            </button>

            <span className="text-[10px] font-mono text-slate-400">
              ⚡ 60 Words
            </span>
          </div>

          {/* Observer Mode Content (60-80w summary + 3 bullets) */}
          {viewMode === 'OBSERVER' ? (
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-3">
                {article.summary}
              </p>

              {article.bullets && article.bullets.length > 0 && (
                <ul className="space-y-1 mb-4 text-[11px] text-slate-500 dark:text-slate-400 font-sans border-l-2 border-red-500/30 pl-2.5">
                  {article.bullets.slice(0, 3).map((b, i) => (
                    <li key={i} className="line-clamp-1">• {b}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            /* Investigator Mode Content (Evidence Graph & Sources) */
            <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs mb-4 space-y-2 font-mono">
              <div className="flex items-center justify-between text-cyan-400 text-[11px] font-bold">
                <span>Evidence Provenance</span>
                <span className="text-emerald-400">{trustScore}% Trust Score</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Primary Sources: {article.sources?.length || 1} verified dispatch(es).
              </p>
              {article.sources && article.sources[0] && (
                <div className="text-[10px] text-slate-400 truncate">
                  Source: <a href={article.sources[0].url} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{article.sources[0].name}</a>
                </div>
              )}

              {/* Gazette RAG Trigger */}
              {onOpenGazetteRag && (
                <button
                  type="button"
                  onClick={() => onOpenGazetteRag(article.title)}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-[11px] flex items-center justify-between transition border border-amber-500/30"
                >
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>e-Gazette of India RAG Proof</span>
                  </span>
                  <span className="text-[10px] underline">Inspect Statute</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3. CARD FOOTER: HELPFUL APPRECIATION & EDITORIAL VERIFICATION ACTIONS */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2 text-xs w-full">
          
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            {/* Reaction: Helpful Appreciation (Non-judgmental) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleHelpfulVote}
                disabled={submittingVote}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition duration-150 shrink-0 ${
                  userVote === 'GREEN'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}
                title={currentUser ? 'Mark as Helpful / Informative' : 'Sign in to appreciate this story'}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${userVote === 'GREEN' ? 'fill-current text-white' : 'text-emerald-500'}`} />
                <span>Helpful</span>
                <span className="font-mono text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded bg-black/5 dark:bg-white/10 font-bold">
                  {upvotes}
                </span>
              </button>
            </div>

            {/* Right Actions: Community Notes, Micro-Tip, Comments, Crypto Seal & Share */}
            <div className="flex items-center gap-1 text-slate-400">
              {/* Community Notes Trigger */}
              {onOpenCommunityNotes && (
                <button
                  type="button"
                  onClick={() => onOpenCommunityNotes(article._id, article.title)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-purple-400 hover:text-purple-300 transition"
                  title="Community Notes (Twitter/X Bridging Algorithm)"
                >
                  <Users className="w-3.5 h-3.5" />
                </button>
              )}

              {/* UPI Micro-Tip Trigger */}
              {onOpenUpiTip && (
                <button
                  type="button"
                  onClick={() => onOpenUpiTip(article.author || 'Ground Bureau', article.title)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-emerald-500 hover:text-emerald-400 transition"
                  title="Tip Ground Reporter with UPI"
                >
                  <Heart className="w-3.5 h-3.5 fill-current opacity-80" />
                </button>
              )}

              <button
                onClick={() => setShowComments(!showComments)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition flex items-center gap-1"
                title="Counter Evidence / Comments"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">{comments.length}</span>
              </button>

              {onOpenCryptoSeal && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCryptoSeal(article);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition"
                  title="Inspect Cryptographic Seal"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-500" />
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                title="Share Story"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. EXPANDABLE COMMENTS & COUNTER-EVIDENCE SUBMISSION DRAWER */}
          {showComments && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <input
                  type="text"
                  placeholder={currentUser ? "Add perspective or ground confirmation..." : "Sign in to add verification comment..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={!currentUser}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                />

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="Optional Counter-Evidence URL (Gazette / Fact-Check)"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      disabled={!currentUser}
                      className="w-full pl-7 pr-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingComment || !currentUser || !commentText.trim()}
                    className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              {comments.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {comments.map((comm, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                        <strong className="text-slate-700 dark:text-slate-300 font-bold">{comm.userName}</strong>
                        <span>{getTimeAgo(comm.createdAt)}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">{comm.text}</p>
                      {comm.evidenceUrl && (
                        <a
                          href={comm.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 text-[10px] text-cyan-500 hover:underline flex items-center gap-1 font-mono"
                        >
                          <LinkIcon className="w-2.5 h-2.5" />
                          <span>Source: {comm.evidenceUrl.slice(0, 35)}...</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
