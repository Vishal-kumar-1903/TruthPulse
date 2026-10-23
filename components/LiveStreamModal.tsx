'use client';

import React from 'react';
import { X, Radio, Volume2, ShieldCheck, Play, Users, MessageSquare } from 'lucide-react';

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveStreamModal({ isOpen, onClose }: LiveStreamModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 font-sans">
      <div className="bg-slate-950 border border-red-500/40 rounded-3xl max-w-4xl w-full p-4 sm:p-6 text-white shadow-2xl relative my-auto animate-fadeIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs uppercase tracking-wider animate-pulse">
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE 24x7 STREAM</span>
          </div>
          <span className="text-sm font-bold text-slate-200">
            TruthPulse Newsroom • Direct Studio Broadcast
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 ml-auto text-xs text-emerald-400 font-mono">
            <Users className="w-3.5 h-3.5" /> 48,219 Watching
          </span>
        </div>

        {/* Video Player Shell */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center group">
          
          {/* Simulated Broadcast Background */}
          <img
            src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1600"
            alt="Live Broadcast Studio"
            className="w-full h-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          {/* Center Play Graphic */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-600/40 animate-pulse">
              <Play className="w-8 h-8 ml-1 fill-current" />
            </div>
            <div>
              <h4 className="text-lg font-black text-white">
                Live Debate: Electoral Bill Passage & Regional Microgrid Transition
              </h4>
              <p className="text-xs text-slate-300 font-mono">
                Streaming in 1080p Ultra HD • Low Latency CDN Node (Mumbai / Delhi)
              </p>
            </div>
          </div>

          {/* Live Studio Ticker Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-red-600/95 py-2 px-4 flex items-center justify-between text-xs font-bold text-white tracking-wide">
            <span className="truncate">
              BREAKING: Chhattisgarh inaugurates ₹1,420 Cr decentralized solar pump initiative across Raigarh & Bastar...
            </span>
            <span className="shrink-0 font-mono bg-black/40 px-2 py-0.5 rounded text-[10px] ml-2">
              STUDIO 1
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Multi-Agent Fact Verification Active on Live Transcription</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Close Broadcast
          </button>
        </div>

      </div>
    </div>
  );
}
