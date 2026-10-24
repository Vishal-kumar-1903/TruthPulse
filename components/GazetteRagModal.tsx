'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ExternalLink, 
  Search, 
  Scale, 
  ShieldCheck, 
  Download,
  Building,
  Calendar,
  Sparkles
} from 'lucide-react';
import { GazetteRagResult } from '@/lib/ragEngine';

interface GazetteRagModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialResult: GazetteRagResult;
}

export default function GazetteRagModal({ isOpen, onClose, initialResult }: GazetteRagModalProps) {
  const [activeResult, setActiveResult] = useState<GazetteRagResult>(initialResult);
  const [customClaim, setCustomClaim] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !activeResult) return null;

  const isFact = activeResult.verdict === 'STATUTORY_FACT_CONFIRMED';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClaim.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/rag/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: customClaim.trim() })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setActiveResult(data.result);
      }
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-5 font-sans animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Close Gazette Inspector"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-amber-400">
              <Scale className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Official e-Gazette RAG Vector Verification</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Statutory Proof
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              The Gazette of India • Extraordinary Part II Regulatory Corpus
            </p>
          </div>
        </div>

        {/* Investigated Claim Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 mb-4 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Investigated Claim:
          </span>
          <p className="text-slate-100 font-bold leading-relaxed">
            "{activeResult.queryClaim}"
          </p>
        </div>

        {/* Statutory Verdict Banner */}
        <div className={`p-4 rounded-2xl mb-5 border flex items-start gap-3.5 ${
          isFact
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {isFact ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-sm font-black uppercase tracking-wide">
                {activeResult.verdict.replace(/_/g, ' ')}
              </strong>
              <span className="text-xs font-mono font-normal opacity-80">
                ({activeResult.confidence}% Mathematical Confidence)
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90 font-sans">
              {activeResult.legalImplication}
            </p>
          </div>
        </div>

        {/* Cited Official Gazette Document Box */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 mb-5 text-xs space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-amber-500/10">
            <span className="flex items-center gap-2 text-amber-400 font-bold">
              <Building className="w-4 h-4" />
              <span>{activeResult.matchingGazette.ministry}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeResult.matchingGazette.enactmentDate}</span>
            </span>
          </div>

          <div>
            <strong className="text-white text-xs block font-sans font-bold">
              {activeResult.matchingGazette.actTitle}
            </strong>
            <span className="text-[10px] text-amber-400/80 break-all block mt-0.5">
              Ref: {activeResult.matchingGazette.gazetteNumber}
            </span>
          </div>

          {/* Exact Statutory Excerpt */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed border-l-2 border-l-amber-500 pl-3">
            <span className="text-[10px] font-mono text-amber-400 block mb-1 uppercase font-bold">
              Excerpt from {activeResult.citedClause}:
            </span>
            "{activeResult.matchingGazette.statutoryText}"
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-slate-400">Semantic Cosine Score: <strong className="text-white">{(activeResult.similarityScore * 100).toFixed(1)}%</strong></span>
            <a
              href={activeResult.matchingGazette.officialPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition font-sans text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Gazette PDF</span>
            </a>
          </div>
        </div>

        {/* Claim Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Verify another statutory claim against e-Gazette..."
            value={customClaim}
            onChange={(e) => setCustomClaim(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-sans"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-90 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Querying...' : 'Verify Claim'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
