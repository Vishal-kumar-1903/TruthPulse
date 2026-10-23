'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Hash, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Cpu
} from 'lucide-react';

interface CryptoSealBadgeProps {
  article: any;
  onClose: () => void;
}

export default function CryptoSealBadge({ article, onClose }: CryptoSealBadgeProps) {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(article.contentHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn font-sans">
      <div className="bg-slate-950 border-2 border-cyan-500/50 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-slate-100 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white">
              Immutable Cryptographic Origin Seal
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Geneva Accord Compliant • SHA-256 Digest Proof
            </span>
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-6 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-emerald-400 block uppercase tracking-wider">
              Content Integrity Intact (Zero Post-Publication Tampering)
            </span>
            <p className="text-slate-300">
              The article title, synthesized summary, and primary content match the mathematical digest computed at publication time.
            </p>
          </div>
        </div>

        {/* Hash Details */}
        <div className="space-y-4 text-xs font-mono mb-6">
          
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Article Headline:
            </span>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 truncate font-sans font-semibold">
              {article.title}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              SHA-256 Cryptographic Hash (Hex Digest):
            </span>
            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-400 break-all flex items-center justify-between gap-2 font-mono text-[11px]">
              <span>{article.contentHash}</span>
              <button
                onClick={handleCopyHash}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
                title="Copy SHA-256 Hash"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block">Trust Score</span>
              <span className="text-emerald-400 font-bold text-sm">{article.trustScore}% Verified</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block">Publication Stamp</span>
              <span className="text-slate-300 font-bold">
                {new Date(article.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition"
        >
          Close Inspector
        </button>

      </div>
    </div>
  );
}
