'use client';

import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Link as LinkIcon, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { BreakingShort } from './BreakingShorts';
import { AuthUser } from './AuthModal';

export interface ReelComment {
  id: string;
  userName: string;
  role: string;
  text: string;
  timeAgo: string;
  evidenceUrl?: string;
  isEditorVerified?: boolean;
}

const DEFAULT_REEL_COMMENTS: ReelComment[] = [
  {
    id: 'rc-1',
    userName: 'Vikramaditya S.',
    role: 'Civic Auditor',
    text: 'Ground confirmation verified with local statutory records. Official gazette notification matches telemetry reported.',
    timeAgo: '18m ago',
    evidenceUrl: 'https://cecb.cg.gov.in/gazette/air-audit-2026',
    isEditorVerified: true
  },
  {
    id: 'rc-2',
    userName: 'Ananya Sharma',
    role: 'Verified Citizen',
    text: 'Clear skies reported since morning in Bilaspur belt, squall advisory is active on IMD radar feed.',
    timeAgo: '32m ago',
    isEditorVerified: false
  },
  {
    id: 'rc-3',
    userName: 'Prakash Rao',
    role: 'Bureau Reporter',
    text: 'Ministry press release corroborates cross-bench support. Final enactment slated for presidential sign-off.',
    timeAgo: '45m ago',
    evidenceUrl: 'https://pib.gov.in/PressReleasePage.aspx?PRID=209841',
    isEditorVerified: true
  }
];

interface ReelCommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  short: BreakingShort;
  currentUser: AuthUser | null;
  onRequireAuth: (reason?: string) => void;
}

export default function ReelCommentDrawer({
  isOpen,
  onClose,
  short,
  currentUser,
  onRequireAuth
}: ReelCommentDrawerProps) {
  const [comments, setComments] = useState<ReelComment[]>(DEFAULT_REEL_COMMENTS);
  const [inputText, setInputText] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [showEvidenceInput, setShowEvidenceInput] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth('Please sign in to submit community evidence or ground confirmations.');
      return;
    }

    if (!inputText.trim()) return;

    const isEditor = currentUser.role === 'CHIEF_EDITOR' || currentUser.role === 'ADMIN';

    const newComment: ReelComment = {
      id: `rc-${Date.now()}`,
      userName: currentUser.name,
      role: isEditor ? 'Chief Editor' : 'Verified Citizen',
      text: inputText.trim(),
      timeAgo: 'Just now',
      evidenceUrl: evidenceUrl.trim() || undefined,
      isEditorVerified: isEditor
    };

    setComments([newComment, ...comments]);
    setInputText('');
    setEvidenceUrl('');
    setShowEvidenceInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto select-none font-sans">
      
      {/* 1. DARK BACKDROP */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 2. SLIDE-UP BOTTOM SHEET */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg mx-auto bg-slate-950 border-t border-slate-800 rounded-t-3xl shadow-2xl flex flex-col max-h-[75vh] sm:max-h-[70vh] animate-fadeIn text-slate-100"
      >
        
        {/* Drag Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Drawer Header */}
        <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-black text-white">Community & Ground Verification</h3>
              <span className="text-[11px] font-mono text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20">
                {comments.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md mt-0.5 font-mono">
              Reel: {short?.headline || 'Breaking News'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments Scrollable Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none">
          
          {/* Fact-Check Trust Banner */}
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] text-emerald-300 font-medium">
                {short?.trustScore ?? 95}% Multi-Agent Consensus Score verified from {short?.source || 'Editorial Bureau Wire'}.
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase font-black text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/20 shrink-0">
              Audited
            </span>
          </div>

          {/* Comment List */}
          {comments.map((comm) => (
            <div 
              key={comm.id}
              className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 text-white font-bold text-[10px] flex items-center justify-center">
                    {comm.userName.charAt(0)}
                  </div>
                  <strong className="text-white font-bold">{comm.userName}</strong>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {comm.role}
                  </span>
                  {comm.isEditorVerified && (
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-bold" title="Editor Verified Evidence">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{comm.timeAgo}</span>
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed pl-6">
                {comm.text}
              </p>

              {comm.evidenceUrl && (
                <div className="pl-6 pt-1">
                  <a
                    href={comm.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:underline bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20"
                  >
                    <LinkIcon className="w-2.5 h-2.5" />
                    <span className="max-w-[200px] sm:max-w-xs truncate">Proof: {comm.evidenceUrl}</span>
                  </a>
                </div>
              )}
            </div>
          ))}

        </div>

        {/* Comment Input Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/90 shrink-0">
          <form onSubmit={handleSubmit} className="space-y-2">
            
            {showEvidenceInput && (
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  placeholder="Paste statutory gazette URL / ground verification link..."
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={currentUser ? "Add your ground verification note..." : "Sign in to add verification note..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!currentUser}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500"
              />

              <button
                type="button"
                onClick={() => setShowEvidenceInput(!showEvidenceInput)}
                className={`p-2 rounded-xl border text-xs transition ${
                  showEvidenceInput || evidenceUrl 
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Add Counter-Evidence Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!currentUser || !inputText.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-red-600/20 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </div>

            {!currentUser && (
              <p className="text-[10px] font-mono text-amber-400 text-center">
                * Please sign in to participate in the TruthCredits civic verification ledger.
              </p>
            )}

          </form>
        </div>

      </div>

    </div>
  );
}
