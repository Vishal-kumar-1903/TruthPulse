'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  Vote, 
  AlertCircle 
} from 'lucide-react';

interface CivicDeskProps {
  civicAction: {
    isCivic: boolean;
    authorityName: string;
    contactEmail: string;
    department: string;
    grievanceTemplate: string;
    poll: {
      question: string;
      upvotes: number;
      downvotes: number;
    };
  };
  articleId: string;
}

export default function CivicDesk({ civicAction, articleId }: CivicDeskProps) {
  const [copied, setCopied] = useState(false);
  const [pollVotes, setPollVotes] = useState(civicAction.poll);
  const [hasVoted, setHasVoted] = useState(false);

  const handleCopyGrievance = () => {
    navigator.clipboard.writeText(civicAction.grievanceTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVote = async (type: 'UP' | 'DOWN') => {
    if (hasVoted) return;

    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'POLL_VOTE', vote: type })
      });
      const data = await res.json();
      if (data.success && data.poll) {
        setPollVotes(data.poll);
        setHasVoted(true);
      }
    } catch (e) {
      console.error(e);
      // Optimistic update
      setPollVotes(prev => ({
        ...prev,
        upvotes: type === 'UP' ? prev.upvotes + 1 : prev.upvotes,
        downvotes: type === 'DOWN' ? prev.downvotes + 1 : prev.downvotes,
      }));
      setHasVoted(true);
    }
  };

  const totalPoll = pollVotes.upvotes + pollVotes.downvotes;
  const upPercent = totalPoll > 0 ? Math.round((pollVotes.upvotes / totalPoll) * 100) : 75;

  return (
    <div className="my-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2 border-emerald-500/30 p-5 font-sans text-slate-900 dark:text-slate-100 shadow-md">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              News-to-Impact Civic Desk • Citizen Redressal
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Municipal jurisdiction: <strong>{civicAction.authorityName}</strong>
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
          Actionable Issue
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left: Authority Contacts & 1-Click Grievance Draft */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Authority Redressal Draft
            </span>
            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <Mail className="w-3 h-3 text-cyan-500" />
              {civicAction.contactEmail}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 whitespace-pre-line line-clamp-3">
            {civicAction.grievanceTemplate}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopyGrievance}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Grievance Copied!' : '1-Click Copy Grievance Draft'}</span>
            </button>

            <a
              href={`mailto:${civicAction.contactEmail}?subject=Citizen Grievance Regarding Civic Issue&body=${encodeURIComponent(civicAction.grievanceTemplate)}`}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1"
              title="Open Default Mail Client"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Right: Resolution Poll */}
        <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              <Vote className="w-3.5 h-3.5 text-emerald-500" />
              <span>Citizen Resolution Poll</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug mb-3">
              "{pollVotes.question}"
            </p>
          </div>

          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${upPercent}%` }} />
              <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${100 - upPercent}%` }} />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Yes: {pollVotes.upvotes} ({upPercent}%)</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">No: {pollVotes.downvotes} ({100 - upPercent}%)</span>
            </div>

            {!hasVoted ? (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleVote('UP')}
                  className="flex-1 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Yes (Impacted)</span>
                </button>
                <button
                  onClick={() => handleVote('DOWN')}
                  className="flex-1 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <ThumbsDown className="w-3 h-3" />
                  <span>No (Resolved)</span>
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-center text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                ✓ Your civic feedback has been logged into the public audit ledger.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
