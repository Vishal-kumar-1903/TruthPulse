'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for monitoring
    console.error('TruthPulse Portal Unhandled Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-lg w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-4 bg-red-500/10 border border-red-500/30 rounded-2xl mb-5 text-red-500">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
          Editorial Feed Interruption
        </h1>

        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          An unexpected error occurred while processing verified news streams. Our autonomous multi-agent consensus monitors have been alerted.
        </p>

        {(error.message || error.digest) && (
          <div className="mb-6 px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block mb-0.5">Audit Trace</span>
            <code className="text-xs font-mono text-red-400 break-all">{error.message || error.digest}</code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              try {
                if (typeof window !== 'undefined') {
                  sessionStorage.clear();
                }
              } catch {}
              reset();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recover Stream</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Portal</span>
          </Link>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
          TruthPulse Autonomous Integrity Protection • System Fail-Safe Mode
        </div>
      </div>
    </div>
  );
}
