'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  Sparkles, 
  ShieldCheck,
  Scale,
  Activity
} from 'lucide-react';
import { CommunityNote } from '@/lib/bridgingAlgorithm';
import { AuthUser } from './AuthModal';

interface CommunityNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  articleId: string;
  articleTitle: string;
  currentUser: AuthUser | null;
  onRequireAuth: (reason?: string) => void;
}

export default function CommunityNotesDrawer({
  isOpen,
  onClose,
  articleId,
  articleTitle,
  currentUser,
  onRequireAuth
}: CommunityNotesDrawerProps) {
  const [notes, setNotes] = useState<CommunityNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSummary, setNewSummary] = useState('');
  const [newEvidenceUrl, setNewEvidenceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`/api/community-notes?articleId=${encodeURIComponent(articleId)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.notes) {
            setNotes(data.notes);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, articleId]);

  if (!isOpen) return null;

  const handleProposeNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireAuth('Sign in with a verified account to propose a Community Note.');
      return;
    }
    if (!newSummary.trim() || !newEvidenceUrl.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/community-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          articleId,
          summary: newSummary.trim(),
          evidenceUrl: newEvidenceUrl.trim(),
          userId: currentUser.id,
          userName: currentUser.name
        })
      });
      const data = await res.json();
      if (data.success && data.note) {
        setNotes([data.note, ...notes]);
        setNewSummary('');
        setNewEvidenceUrl('');
      }
    } catch (e) {
      // Ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleRateNote = async (noteId: string, helpful: boolean) => {
    if (!currentUser) {
      onRequireAuth('Please sign in to rate Community Notes.');
      return;
    }

    try {
      const res = await fetch('/api/community-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RATE',
          articleId,
          noteId,
          userId: currentUser.id,
          userName: currentUser.name,
          helpful
        })
      });
      const data = await res.json();
      if (data.success && data.note) {
        setNotes(notes.map(n => (n.id === noteId ? data.note : n)));
      }
    } catch (e) {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-slate-950 border-l border-slate-800 text-slate-100 shadow-2xl flex flex-col justify-between z-50">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>Community Notes (Bridging Algorithm)</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Depolarization & Cross-Perspective Consensus
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Algorithm Explanation Card */}
        <div className="p-3 mx-4 mt-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] leading-relaxed flex items-start gap-2.5">
          <Scale className="w-4 h-4 shrink-0 mt-0.5 text-purple-400" />
          <span>
            <strong>How it works:</strong> A note is marked <strong>Helpful</strong> only if readers who <em>normally disagree with each other</em> both rate it as well-sourced and neutral. Partisan mob voting cannot game this algorithm.
          </span>
        </div>

        {/* Article Headline Preview */}
        <div className="px-4 py-2 text-xs font-semibold text-slate-300 truncate">
          Story: <span className="text-white font-bold">{articleTitle}</span>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-slate-400">
              Evaluating Matrix Factorization Consensus...
            </div>
          ) : notes.length === 0 ? (
            <div className="py-12 text-center space-y-2 text-slate-400 text-xs">
              <Users className="w-8 h-8 mx-auto text-slate-500" />
              <p>No Community Notes proposed for this story yet.</p>
              <p className="text-[11px] text-slate-500">Be the first to provide context or primary evidence.</p>
            </div>
          ) : (
            notes.map((note) => {
              const isConsensus = note.status === 'HELPFUL';
              const isPartisan = note.status === 'NOT_HELPFUL_PARTISAN';
              return (
                <div 
                  key={note.id} 
                  className={`p-4 rounded-2xl border text-xs space-y-3 ${
                    isConsensus 
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : isPartisan
                      ? 'bg-red-500/5 border-red-500/30'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isConsensus
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isPartisan
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {note.status.replace(/_/g, ' ')}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      Diversity: {Math.round(note.perspectiveDiversityScore * 100)}%
                    </span>
                  </div>

                  <p className="text-slate-100 font-sans leading-relaxed text-xs">
                    "{note.summary}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate max-w-[200px]">By {note.authorName}</span>
                    <a
                      href={note.evidenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline flex items-center gap-1 font-mono text-[10px]"
                    >
                      <span>Primary Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Rating Actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Is this note helpful?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRateNote(note.id, true)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[11px] flex items-center gap-1 transition"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Yes</span>
                      </button>
                      <button
                        onClick={() => handleRateNote(note.id, false)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[11px] flex items-center gap-1 transition"
                      >
                        <ThumbsDown className="w-3 h-3" />
                        <span>No</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Propose Note Form */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <form onSubmit={handleProposeNote} className="space-y-2 text-xs">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Propose a Fact-Check Note:
            </span>
            <textarea
              placeholder="Cite specific nuance, context, or missing facts..."
              rows={2}
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 resize-none font-sans"
            />
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Evidence URL (Gazette, PTI, Gov Portal)..."
                value={newEvidenceUrl}
                onChange={(e) => setNewEvidenceUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono text-[11px]"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1 shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>{submitting ? 'Submitting...' : 'Post Note'}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
