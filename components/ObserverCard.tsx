'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Globe2, 
  Share2, 
  Eye,
  Hash
} from 'lucide-react';
import ConflictMatrix from './ConflictMatrix';
import CivicDesk from './CivicDesk';

interface ObserverCardProps {
  article: any;
  onOpenCryptoSeal: (article: any) => void;
}

export default function ObserverCard({ article, onOpenCryptoSeal }: ObserverCardProps) {
  const readTimeWords = article.summary ? article.summary.split(' ').length : 65;
  const readTime = Math.max(1, Math.ceil(readTimeWords / 70));

  const shareStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: article.title, text: article.summary, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${article.title} - Read verified on TruthPulse`);
    }
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 font-sans group">
      
      {/* 1. TOP HEADER & METADATA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        
        {/* Geographic Scope & City Tag */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            {article.location?.regionType === 'INTERNATIONAL' ? (
              <Globe2 className="w-3.5 h-3.5 text-sky-500" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-red-500" />
            )}
            <span>
              {article.location?.city ? `${article.location.city}, ` : ''}
              {article.location?.state ? `${article.location.state}` : article.location?.regionType}
            </span>
          </span>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
          
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {article.category || 'General'}
          </span>
        </div>

        {/* AI Trust Score & Cryptographic Seal Badge */}
        <div className="flex items-center gap-2">
          
          {/* Trust Score */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{article.trustScore}% Trust</span>
          </div>

          {/* Cryptographic SHA-256 Seal Pill */}
          <button
            onClick={() => onOpenCryptoSeal(article)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-slate-800/80 transition"
            title="Inspect SHA-256 Cryptographic Origin Seal"
          >
            <Hash className="w-3 h-3 text-cyan-500" />
            <span>{article.contentHash ? article.contentHash.slice(0, 8) : 'SHA-256'}</span>
          </button>

        </div>

      </div>

      {/* 2. CONFLICT MATRIX (If Cross-Source Divergence Exists) */}
      {article.discrepancyAlert && article.discrepancyAlert.hasConflict && (
        <ConflictMatrix alert={article.discrepancyAlert} />
      )}

      {/* 3. HEADLINE */}
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight leading-snug mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
        {article.title}
      </h2>

      {/* 4. CLEAN 60-80 WORD SYNTHESIS (Observer Mode Core) */}
      <div className="relative mb-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-normal">
          {article.summary}
        </p>
        <div className="mt-2 text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center gap-2">
          <span>Synthesized by Neural Bot 3</span>
          <span>•</span>
          <span>{article.summary ? article.summary.split(' ').length : 65} Words</span>
        </div>
      </div>

      {/* 5. 3 KEY BULLET TAKEAWAYS */}
      {article.bullets && article.bullets.length > 0 && (
        <div className="space-y-2 mb-6">
          {article.bullets.slice(0, 3).map((bullet: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-normal">{bullet}</span>
            </div>
          ))}
        </div>
      )}

      {/* 6. CIVIC ACTION (If Hyper-Local Civic Issue) */}
      {article.civicAction && article.civicAction.isCivic && (
        <CivicDesk civicAction={article.civicAction} articleId={article._id} />
      )}

      {/* 7. CARD FOOTER */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{readTime} min read</span>
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.views || 0} views</span>
          </span>
          <span>By {article.author || 'TruthPulse Network'}</span>
        </div>

        <button
          onClick={shareStory}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 text-xs font-semibold"
          title="Share Verified Story"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

    </article>
  );
}
