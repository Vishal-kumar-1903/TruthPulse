'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Coins, 
  Award, 
  AlertTriangle, 
  Pin, 
  BellRing, 
  History, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

interface AdminHUDProps {
  user: {
    name: string;
    email: string;
    role: string;
    truthCredits: number;
    accuracyRate: number;
    strikes: number;
    history?: Array<{ action: string; creditChange: number; timestamp: string }>;
  };
  onPerformAction: (action: 'PIN_STORY' | 'PUSH_ALERT', articleId?: string) => Promise<{ success: boolean; message: string }>;
  articles?: Array<{ _id: string; title: string; location: any }>;
}

export default function AdminHUD({ user, onPerformAction, articles = [] }: AdminHUDProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'CHIEF_EDITOR':
        return {
          title: 'Chief Editor',
          badgeClass: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/40',
          icon: Sparkles
        };
      case 'CONTRIBUTOR':
        return {
          title: 'Senior Contributor',
          badgeClass: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/40',
          icon: Award
        };
      default:
        return {
          title: 'Rookie Contributor',
          badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
          icon: ShieldCheck
        };
    }
  };

  const roleInfo = getRoleBadge(user.role);
  const RoleIcon = roleInfo.icon;

  const handleSpend = async (action: 'PIN_STORY' | 'PUSH_ALERT', articleId?: string) => {
    setLoadingAction(action);
    setFeedback(null);
    try {
      const res = await onPerformAction(action, articleId);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setShowPinModal(false);
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Action failed' });
    } finally {
      setLoadingAction(null);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl font-sans text-white relative overflow-hidden">
      
      {/* Background radial gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1. TOP BAR: USER IDENTITY & TIER */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-emerald-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <span className="font-mono font-bold text-lg text-cyan-400">
                {user.name ? user.name.charAt(0) : 'E'}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-100">{user.name}</h2>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${roleInfo.badgeClass}`}>
                <RoleIcon className="w-3 h-3" />
                <span>{roleInfo.title}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
          </div>
        </div>

        {/* View Transaction Log Button */}
        <button
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span>Credits Ledger</span>
        </button>

      </div>

      {/* 2. STATS COUNTERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        
        {/* Wallet Balance */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> TruthCredits Wallet
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              {user.truthCredits} <span className="text-xs font-normal text-slate-400">TC</span>
            </div>
          </div>
          <div className="text-right text-[10px] text-emerald-400 font-mono">
            +10/pub <br /> +25 ground
          </div>
        </div>

        {/* Editorial Accuracy */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Verification Accuracy
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {user.accuracyRate}%
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-400 font-mono">
            Bot 4 Audited <br /> Zero Disinformation
          </div>
        </div>

        {/* Strikes Indicator */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className={`w-3.5 h-3.5 ${user.strikes > 0 ? 'text-red-400' : 'text-slate-400'}`} /> Account Strikes
            </div>
            <div className={`text-2xl font-black font-mono mt-1 ${user.strikes > 0 ? 'text-red-400' : 'text-slate-200'}`}>
              {user.strikes} <span className="text-xs font-normal text-slate-400">/ 3 Max</span>
            </div>
          </div>
          <div className="text-right text-[10px] text-slate-400 font-mono">
            {user.strikes === 0 ? 'Clean Record' : '3 Strikes = Auto Suspend'}
          </div>
        </div>

      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`mb-4 p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
          feedback.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* 3. TRUTHCREDITS SPEND ACTIONS */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-950/80 border border-cyan-500/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" /> Credit Spend Actions (Editorial Powers)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Spend accumulated TruthCredits to boost visibility or trigger high-priority alerts across regional channels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Action 1: Pin Story */}
            <button
              onClick={() => setShowPinModal(true)}
              disabled={loadingAction !== null || user.truthCredits < 20}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold transition shadow-md"
            >
              <Pin className="w-3.5 h-3.5" />
              <span>Pin Story to City Top</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-700/60">-20 TC</span>
            </button>

            {/* Action 2: Send Push Notification */}
            <button
              onClick={() => handleSpend('PUSH_ALERT')}
              disabled={loadingAction !== null || user.truthCredits < 35}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-bold transition shadow-md"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Send Breaking Push Alert</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-700/60">-35 TC</span>
            </button>

          </div>

        </div>
      </div>

      {/* MODAL: PIN STORY SELECTION */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Pin className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Select Story to Pin for 24h</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Pinning places this verified article at the very top of its designated Hyper-Local City and State feed.
              Cost: <strong className="text-amber-400">20 TruthCredits</strong>.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-5">
              {articles.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No published articles available to pin.</p>
              ) : (
                articles.map((art) => (
                  <button
                    key={art._id}
                    onClick={() => setSelectedArticleId(art._id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                      selectedArticleId === art._id
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold line-clamp-1">{art.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {art.location?.city || art.location?.regionType} • ID: {art._id.slice(-6)}
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPinModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSpend('PIN_STORY', selectedArticleId)}
                disabled={!selectedArticleId || loadingAction !== null}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold transition"
              >
                {loadingAction === 'PIN_STORY' ? 'Pinning...' : 'Confirm Pin (-20 TC)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREDITS TRANSACTION HISTORY */}
      {showHistory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
            <button
              onClick={() => setShowHistory(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <History className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">TruthCredits Audit Ledger</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Cryptographically verified journal of all credit earnings, deductions, and editorial actions.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {(!user.history || user.history.length === 0) ? (
                <p className="text-xs text-slate-500 italic">No transactions recorded yet.</p>
              ) : (
                user.history.map((tx, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{tx.action}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      tx.creditChange > 0 
                        ? 'text-emerald-400 bg-emerald-500/10' 
                        : 'text-amber-400 bg-amber-500/10'
                    }`}>
                      {tx.creditChange > 0 ? `+${tx.creditChange}` : tx.creditChange} TC
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHistory(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
