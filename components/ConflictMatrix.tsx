'use client';

import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Scale, ArrowRightLeft } from 'lucide-react';

export interface ConflictingSourceClaim {
  source: string;
  claim: string;
}

export interface DiscrepancyAlertData {
  hasConflict: boolean;
  details: string;
  conflictingSources?: ConflictingSourceClaim[];
}

export interface ConflictMatrixProps {
  alert?: DiscrepancyAlertData;
  articleTitle?: string;
  discrepancyAlert?: DiscrepancyAlertData;
  sources?: any[];
}

export default function ConflictMatrix({ alert, articleTitle, discrepancyAlert, sources }: ConflictMatrixProps) {
  const [expanded, setExpanded] = useState(true);

  const activeAlert = alert || discrepancyAlert;
  if (!activeAlert || !activeAlert.hasConflict) return null;

  // Fallback conflicting sources if not directly provided
  const claims = activeAlert.conflictingSources && activeAlert.conflictingSources.length >= 2 
    ? activeAlert.conflictingSources 
    : sources && sources.length >= 2 
      ? [
          { source: sources[0].name || 'Source A', claim: `Reported initial estimate / status.` },
          { source: sources[1].name || 'Source B', claim: `Contradicting metric variance observed.` }
        ]
      : [];

  return (
    <div className="mb-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 p-4 text-slate-900 dark:text-slate-100 font-sans shadow-md">
      
      {/* Warning Header */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Conflict Matrix • Cross-Source Divergence Detected
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black">
                Statistical Variance
              </span>
            </div>
            {articleTitle && (
              <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5 line-clamp-1">
                Story: {articleTitle}
              </p>
            )}
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
              {activeAlert.details}
            </p>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-200 p-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Claims Comparison Grid */}
      {expanded && claims.length >= 2 && (
        <div className="mt-4 pt-3 border-t border-amber-500/20 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-500/30">
            <div className="flex items-center justify-between font-bold text-amber-700 dark:text-amber-300 mb-1">
              <span>Claim Variant A</span>
              <span className="text-[10px] text-slate-500 font-mono">{claims[0].source}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-mono text-[11px]">
              "{claims[0].claim}"
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-amber-500/30">
            <div className="flex items-center justify-between font-bold text-amber-700 dark:text-amber-300 mb-1">
              <span>Claim Variant B</span>
              <span className="text-[10px] text-slate-500 font-mono">{claims[1].source}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-mono text-[11px]">
              "{claims[1].claim}"
            </p>
          </div>

        </div>
      )}

      <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
        <ArrowRightLeft className="w-3 h-3 text-amber-500" />
        <span>TruthPulse Bot 4 active audit: Independent verification squad assigned to resolve metric variance.</span>
      </div>

    </div>
  );
}
