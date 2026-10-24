import React from 'react';
import Link from 'next/link';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl mb-5 text-blue-400">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="text-4xl font-black font-mono text-red-500 tracking-wider mb-2">404</div>
        <h1 className="text-xl font-bold text-white mb-2">Story or Dispatch Not Found</h1>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          The requested news article, fact-check certificate, or statutory dispatch does not exist or may have been unlisted due to credibility retraction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Back to Live Headlines</span>
          </Link>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
          TruthPulse News Portal • Verifiable Media Infrastructure
        </div>
      </div>
    </div>
  );
}
