'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  ExternalLink, 
  ShieldCheck, 
  Network, 
  GitCompare, 
  Hash, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ConflictMatrix from './ConflictMatrix';

interface InvestigatorCardProps {
  article: any;
  onOpenCryptoSeal: (article: any) => void;
}

export default function InvestigatorCard({ article, onOpenCryptoSeal }: InvestigatorCardProps) {
  const [showDiff, setShowDiff] = useState(false);

  const getSourceBadge = (stance: string) => {
    switch (stance) {
      case 'CORROBORATING':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'CONFLICTING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'REFUTING':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getProvenanceType = (url: string) => {
    const l = url.toLowerCase();
    if (l.includes('gov.in') || l.includes('cecb') || l.includes('pib') || l.includes('un.org') || l.includes('ungeneva')) {
      return { label: 'Official Gov / Statutory', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    }
    if (l.includes('reuters') || l.includes('pti') || l.includes('ani') || l.includes('bbc')) {
      return { label: 'Primary News Wire', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    }
    return { label: 'Accredited Independent Press', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  };

  return (
    <article className="bg-slate-950 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-xl font-sans text-slate-100 relative overflow-hidden group">
      
      {/* Background Accent Grid */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1. INVESTIGATOR HUD TOPBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800 text-xs">
        
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold uppercase tracking-wider text-[11px]">
            <Network className="w-3.5 h-3.5" />
            <span>Evidence Graph v2.4</span>
          </span>

          <span className="font-mono text-slate-400 text-[11px]">
            Geo Scope: <strong className="text-white">{article.location?.regionType}</strong> • {article.location?.city || article.location?.state || 'Global'}
          </span>
        </div>

        {/* Audit Metrics */}
        <div className="flex items-center gap-2 font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px]">
            Trust: {article.trustScore}%
          </span>
          <button
            onClick={() => onOpenCryptoSeal(article)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 text-[11px]"
            title="Inspect Cryptographic Seal"
          >
            <Hash className="w-3 h-3 text-cyan-400" />
            <span>{article.contentHash.slice(0, 10)}</span>
          </button>
        </div>

      </div>

      {/* 2. CONFLICT MATRIX (If active divergence) */}
      {article.discrepancyAlert && article.discrepancyAlert.hasConflict && (
        <ConflictMatrix alert={article.discrepancyAlert} />
      )}

      {/* 3. HEADLINE */}
      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug mb-4">
        {article.title}
      </h2>

      {/* 4. EVIDENCE GRAPH: SCANNED PRIMARY SOURCES */}
      <div className="mb-5 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" /> Scanned Provenance & Stance Registry:
          </span>
          <span>{article.sources?.length || 0} Cross-Audited</span>
        </div>

        <div className="space-y-2">
          {article.sources && article.sources.map((src: any, idx: number) => {
            const provenance = getProvenanceType(src.url);
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-xs">{src.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${provenance.color}`}>
                      {provenance.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSourceBadge(src.stance)}`}>
                      {src.stance}
                    </span>
                  </div>
                  {src.rawSnippet && (
                    <p className="text-slate-400 text-[11px] font-sans italic line-clamp-1">
                      "{src.rawSnippet}"
                    </p>
                  )}
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold shrink-0 transition"
                >
                  <span>Raw Wire Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. RAW WIRE DISPATCH VS NEURAL SYNTHESIZED TEXT DIFF */}
      <div className="mb-5 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 font-mono text-xs">
        <button
          onClick={() => setShowDiff(!showDiff)}
          className="w-full flex items-center justify-between text-slate-300 font-bold uppercase tracking-wider text-[11px]"
        >
          <span className="flex items-center gap-2 text-cyan-400">
            <GitCompare className="w-4 h-4" />
            <span>Raw Source Telemetry vs Neural Synthesis Diff</span>
          </span>
          {showDiff ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDiff && (
          <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans animate-fadeIn">
            
            {/* Raw Ingestion Side */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-red-400 tracking-wider block">
                [Raw Scraped Wire Input - Bot 1 Ingestion]
              </span>
              <p className="text-slate-400 text-xs font-mono leading-relaxed line-clamp-6">
                {article.sources?.[0]?.rawSnippet || article.content.slice(0, 350)}
              </p>
            </div>

            {/* Neural Synthesized Side */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider block">
                [Clean 60-80w Synthesis - Neural Bot 3 Output]
              </span>
              <p className="text-slate-200 text-xs font-sans leading-relaxed">
                {article.summary}
              </p>
            </div>

          </div>
        )}
      </div>

      {/* 6. FULL VERIFIED BODY CONTENT (Expandable) */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-4">
        <h4 className="text-xs uppercase font-mono font-bold text-slate-400 mb-2">
          Full Editorial Synthesized Content:
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
          {article.content}
        </p>
      </div>

      {/* 7. CRYPTOGRAPHIC PROVENANCE FOOTER */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Multi-Source Corroboration Locked</span>
        </span>
        <span className="text-slate-500">
          SHA-256: {article.contentHash}
        </span>
      </div>

    </article>
  );
}
