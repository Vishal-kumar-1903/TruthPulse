'use client';

import React, { useState } from 'react';
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
  Copy
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
    <div className="min-h-screen bg-[#070b12] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top sticky navigation bar */}
      <header className="sticky top-0 z-40 bg-[#070b12]/90 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-3 flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Live Intelligence Feed</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Audio read button */}
          <button
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              isPlayingAudio 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 animate-pulse' 
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-cyan-500/30 hover:text-white'
            }`}
            title="Listen to 60s Audio Briefing"
          >
            {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5 text-cyan-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
          </button>

          {/* Crypto Seal Verify Trigger */}
          <button
            onClick={() => setShowSealModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verify Hash</span>
          </button>

          {/* Tip Author UPI */}
          <button
            onClick={() => setShowTipModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Tip UPI</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Article Metadata Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {article.category || 'General'}
          </span>

          {article.state && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/5 text-slate-300 border border-white/10">
              <MapPin className="w-3 h-3 text-cyan-400" />
              {article.city ? `${article.city}, ${article.state}` : article.state}
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3 h-3" />
            {article.trustScore || 95}% Truth Score
          </span>

          <span className="text-xs text-slate-400 font-mono flex items-center gap-1 ml-auto">
            <Calendar className="w-3 h-3" />
            {article.createdAt ? new Date(article.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified Dispatch'}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-snug mb-6">
          {article.title}
        </h1>

        {/* Byline / Author Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-200">
                  {article.author || 'TruthPulse Bureau'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PRESS ACCREDITED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Consensus Audited • Tamper-Evident Ledger
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowTipModal(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Support Author</span>
          </button>
        </div>

        {/* Media Block */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black mb-8 aspect-video max-h-[500px]">
          <AnimatedMedia
            mediaType={(article.mediaType as any) || 'IMAGE'}
            mediaUrl={article.mediaUrl || article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Executive Summary Callout */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-slate-900/40 to-indigo-950/30 border border-cyan-500/30 mb-8 shadow-lg">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4" />
            Executive Fact-Check Summary
          </h2>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            {article.summary}
          </p>

          {article.bullets && article.bullets.length > 0 && (
            <ul className="mt-4 space-y-2 border-t border-cyan-500/20 pt-4">
              {article.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Full Article Content */}
        {article.content && (
          <article className="prose prose-invert max-w-none mb-10 text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line font-sans">
            {article.content}
          </article>
        )}

        {/* Cryptographic Ledger & Merkle Proof Banner */}
        <div className="p-5 rounded-2xl bg-black/60 border border-emerald-500/30 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                CRYPTOGRAPHIC TAMPER-EVIDENT SEAL
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono break-all">
              SHA-256: <span className="text-slate-200">{article.contentHash || 'verified-genesis-hash'}</span>
            </p>
          </div>

          <button
            onClick={() => setShowSealModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center gap-2 shrink-0"
          >
            <Hash className="w-4 h-4" />
            Inspect Merkle Tree
          </button>
        </div>

        {/* Sources & Citations */}
        {article.sources && article.sources.length > 0 && (
          <section className="mb-10 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              Corroborating Primary Sources & Official Dispatches ({article.sources.length})
            </h3>
            <div className="space-y-2">
              {article.sources.map((src, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                  <span className="text-slate-200 font-medium">{src.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300">
                      {src.reliability}% Reliability
                    </span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-mono"
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
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-cyan-950/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              Combat Disinformation: Share Verified Intel
            </h4>
            <p className="text-xs text-slate-400">
              Directly forward this verified fact-check with cryptographic proof to your groups.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs transition shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${twitterShareText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition"
            >
              <span>X Post</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
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
