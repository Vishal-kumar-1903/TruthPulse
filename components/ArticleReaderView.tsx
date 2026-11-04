'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Share2, 
  Volume2, 
  VolumeX, 
  Hash, 
  Coins, 
  Check, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  User, 
  FileCheck2, 
  Sparkles,
  TrendingUp,
  MessageCircle,
  Copy,
  Sun,
  Moon
} from 'lucide-react';
import AnimatedMedia from './AnimatedMedia';
import CryptoSealBadge from './CryptoSealBadge';
import UpiTipModal from './UpiTipModal';
import { ArticleItem } from './NewsCard';

interface ArticleReaderViewProps {
  article: ArticleItem;
  siteUrl: string;
}

export default function ArticleReaderView({ article, siteUrl }: ArticleReaderViewProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showSealModal, setShowSealModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage (default: LIGHT)
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('truthpulse_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    try {
      localStorage.setItem('truthpulse_theme', next ? 'dark' : 'light');
    } catch {}
  };

  const fullShareUrl = `${siteUrl}/article/${article._id}`;
  const whatsappShareText = encodeURIComponent(
    `*${article.title}*\n\n${article.summary}\n\n✅ *Verified by TruthPulse* (Truth Score: ${article.trustScore || 95}%)\n📌 Cryptographic Audit Link:\n${fullShareUrl}`
  );

  const twitterShareText = encodeURIComponent(
    `Verified Intel: ${article.title}\n\nTruth Score: ${article.trustScore || 95}% via @TruthPulse\n${fullShareUrl}`
  );

  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${article.title}. ${article.summary}. ${article.content || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopyLink = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(fullShareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 antialiased font-sans ${
      isDarkMode 
        ? 'bg-[#0b1120] text-slate-100 selection:bg-red-900/50 selection:text-red-200' 
        : 'bg-[#fafafa] text-slate-900 selection:bg-red-500/20 selection:text-red-950'
    }`}>
      {/* Top sticky navigation bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md px-4 lg:px-8 py-3.5 flex items-center justify-between border-b transition-colors ${
        isDarkMode ? 'bg-[#0b1120]/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-xs'
      }`}>
        <Link 
          href="/" 
          className={`inline-flex items-center gap-2 text-xs font-bold transition group ${
            isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-red-600'
          }`}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Live Wire</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Audio read button */}
          <button
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              isPlayingAudio 
                ? 'bg-red-600 text-white border-red-600 animate-pulse' 
                : isDarkMode
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600 hover:text-white'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-red-600 shadow-xs'
            }`}
            title="Listen to 60s Audio Briefing"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-red-600" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
          </button>

          {/* Crypto Seal Verify Trigger */}
          <button
            onClick={() => setShowSealModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Verify Hash</span>
          </button>

          {/* Tip Author UPI */}
          <button
            onClick={() => setShowTipModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-600/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition"
          >
            <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Tip UPI</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Article Metadata Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-red-600 text-white shadow-xs">
            {article.category || 'General'}
          </span>

          {article.state && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
              isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-xs'
            }`}>
              <MapPin className="w-3 h-3 text-red-600" />
              {article.city ? `${article.city}, ${article.state}` : article.state}
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            {article.trustScore || 95}% Truth Score
          </span>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />
            {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified Dispatch'}
          </span>
        </div>

        {/* Headline */}
        <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-snug mb-6 ${
          isDarkMode ? 'text-white' : 'text-slate-950'
        }`}>
          {article.title}
        </h1>

        {/* Byline / Author Bar */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border mb-8 transition ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                  {article.author || 'TruthPulse Bureau'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30">
                  PRESS ACCREDITED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                Consensus Audited • Tamper-Evident Ledger
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowTipModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-400 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Support Author</span>
          </button>
        </div>

        {/* Media Block */}
        <div className={`relative rounded-3xl overflow-hidden border shadow-xl bg-slate-900 mb-8 aspect-video max-h-[500px] ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <AnimatedMedia
            mediaType={(article.mediaType as any) || 'IMAGE'}
            mediaUrl={article.mediaUrl || article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Executive Summary Callout */}
        <div className={`p-6 sm:p-7 rounded-2xl border mb-8 shadow-xs ${
          isDarkMode 
            ? 'bg-slate-900/60 border-slate-800 text-slate-200' 
            : 'bg-gradient-to-br from-red-50/40 via-white to-amber-50/20 border-red-200/70 text-slate-800'
        }`}>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-red-600 mb-2.5 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4" />
            Executive Fact-Check Summary
          </h2>
          <p className="text-base sm:text-lg leading-relaxed font-normal">
            {article.summary}
          </p>

          {article.bullets && article.bullets.length > 0 && (
            <ul className="mt-4 space-y-2.5 border-t border-slate-200 dark:border-slate-800 pt-4">
              {article.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0"></span>
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Full Article Content */}
        {article.content && (
          <article className={`prose max-w-none mb-10 text-base sm:text-lg leading-relaxed whitespace-pre-line font-sans ${
            isDarkMode ? 'prose-invert text-slate-300' : 'text-slate-800'
          }`}>
            {article.content}
          </article>
        )}

        {/* Cryptographic Ledger & Merkle Proof Banner */}
        <div className={`p-5 rounded-2xl border mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-slate-900 border-emerald-900/40' : 'bg-emerald-50/60 border-emerald-200 shadow-xs'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 tracking-wider">
                CRYPTOGRAPHIC TAMPER-EVIDENT SEAL
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono break-all">
              SHA-256: <span className="font-semibold text-slate-900 dark:text-slate-200">{article.contentHash || 'verified-genesis-hash'}</span>
            </p>
          </div>

          <button
            onClick={() => setShowSealModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shrink-0 shadow-sm"
          >
            <Hash className="w-4 h-4" />
            Inspect Merkle Tree
          </button>
        </div>

        {/* Sources & Citations */}
        {article.sources && article.sources.length > 0 && (
          <section className={`mb-10 p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-red-600" />
              Corroborating Primary Sources & Official Dispatches ({article.sources.length})
            </h3>
            <div className="space-y-2">
              {article.sources.map((src, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{src.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30">
                      {src.reliability}% Reliability
                    </span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 font-mono font-semibold"
                      >
                        Inspect Citation <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Viral Share Bar (WhatsApp, X/Twitter, Copy Link) */}
        <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h4 className={`font-bold text-sm flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
              <Share2 className="w-4 h-4 text-red-600" />
              Combat Disinformation: Share Verified Intel
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Directly forward this verified fact-check with cryptographic proof to your groups.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs transition shadow-md shadow-[#25D366]/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${twitterShareText}`}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200'
              }`}
            >
              <span>X Post</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-200'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Crypto Seal Merkle Modal */}
      {showSealModal && (
        <CryptoSealBadge article={article} onClose={() => setShowSealModal(false)} />
      )}

      {/* UPI Tip Modal */}
      {showTipModal && (
        <UpiTipModal
          isOpen={showTipModal}
          onClose={() => setShowTipModal(false)}
          authorName={article.author || 'TruthPulse Bureau'}
          articleTitle={article.title}
          currentUser={null}
        />
      )}
    </div>
  );
}
