'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminHUD from '@/components/AdminHUD';
import AutoDraftQueue from '@/components/AutoDraftQueue';
import EditorModal from '@/components/EditorModal';
import CryptoSealBadge from '@/components/CryptoSealBadge';
import { 
  ArrowLeft, 
  FilePlus2, 
  Rss, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Pin, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'AUTO_DRAFTS' | 'MANAGE_ARTICLES'>('AUTO_DRAFTS');
  const [userProfile, setUserProfile] = useState<any>({
    name: 'Vikramaditya Sen',
    email: 'editor@truthpulse.in',
    role: 'CHIEF_EDITOR',
    truthCredits: 185,
    accuracyRate: 98,
    strikes: 0,
    history: []
  });

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorInitialData, setEditorInitialData] = useState<any | null>(null);
  const [selectedSealArticle, setSelectedSealArticle] = useState<any | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Fetch Admin Profile & TruthCredits
  const fetchAdminProfile = async () => {
    try {
      const res = await fetch('/api/admin/truthcredits');
      const data = await res.json();
      if (data.success && data.user) {
        setUserProfile(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch admin profile:', err);
    }
  };

  // 2. Fetch Articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles?status=ALL');
      const data = await res.json();
      if (data.success) {
        setArticles(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
    fetchArticles();
  }, []);

  // 3. Handle Spend Action from HUD
  const handlePerformSpendAction = async (action: 'PIN_STORY' | 'PUSH_ALERT', articleId?: string) => {
    try {
      const res = await fetch('/api/admin/truthcredits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, articleId })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminProfile();
        fetchArticles();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Action failed' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  // 4. Open Editor with pre-populated draft
  const handleAdoptDraftToEditor = (draftData: any) => {
    setEditorInitialData(draftData);
    setIsEditorOpen(true);
  };

  // 5. Open clean Editor for new story
  const handleCreateNewStory = () => {
    setEditorInitialData(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Reader</span>
            </Link>

            <div className="h-4 w-px bg-slate-800"></div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Editorial Control Desk
              </span>
            </div>
          </div>

          <button
            onClick={handleCreateNewStory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-500/20"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Create Gated Story</span>
          </button>

        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. ADMIN HUD (TruthCredits Wallet, Rank, Strikes, Actions) */}
        <AdminHUD
          user={userProfile}
          onPerformAction={handlePerformSpendAction}
          articles={articles}
        />

        {/* 2. ADMIN NAVIGATION TABS */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            
            <button
              onClick={() => setActiveTab('AUTO_DRAFTS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
                activeTab === 'AUTO_DRAFTS'
                  ? 'bg-slate-900 text-amber-400 border border-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Rss className="w-4 h-4 text-amber-400" />
              <span>Auto-Scout RSS Drafts Queue</span>
            </button>

            <button
              onClick={() => setActiveTab('MANAGE_ARTICLES')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
                activeTab === 'MANAGE_ARTICLES'
                  ? 'bg-slate-900 text-cyan-400 border border-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Published & Audited Registry ({articles.length})</span>
            </button>

          </div>

          <button
            onClick={() => {
              fetchAdminProfile();
              fetchArticles();
            }}
            title="Reload Database"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* 3. TAB CONTENT */}
        {activeTab === 'AUTO_DRAFTS' ? (
          <AutoDraftQueue onAdoptToEditor={handleAdoptDraftToEditor} />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span>Articles currently in the immutable MongoDB cryptographic ledger</span>
              <span>Total Stories: {articles.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Title & Region</th>
                    <th className="pb-3 font-semibold">Trust Score</th>
                    <th className="pb-3 font-semibold">Sources</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Content Hash</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {articles.map((art) => (
                    <tr key={art._id} className="hover:bg-slate-950/40 transition">
                      
                      {/* Title & Location */}
                      <td className="py-4 pr-4">
                        <div className="font-bold text-slate-100 line-clamp-1">
                          {art.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                          <span className="text-cyan-400">
                            {art.location?.city || art.location?.regionType}
                          </span>
                          {art.isPinned && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              <Pin className="w-2.5 h-2.5" /> PINNED 24H
                            </span>
                          )}
                          {art.civicAction?.isCivicIssue && (
                            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                              CIVIC DESK ACTIVE
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Trust Score */}
                      <td className="py-4 pr-4 font-mono">
                        <span className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
                          art.trustScore >= 80 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {art.trustScore}%
                        </span>
                      </td>

                      {/* Sources */}
                      <td className="py-4 pr-4 font-mono text-slate-300">
                        {art.sources?.length || 0} Primary
                      </td>

                      {/* Status */}
                      <td className="py-4 pr-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {art.status}
                        </span>
                      </td>

                      {/* Hash */}
                      <td className="py-4 pr-4 font-mono text-[10px] text-cyan-400/80">
                        {art.contentHash ? art.contentHash.slice(0, 14) + '...' : 'Pending'}
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <button
                          onClick={() => setSelectedSealArticle(art)}
                          className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition"
                        >
                          Verify Hash
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </main>

      {/* 4. GATED EDITOR MODAL */}
      {isEditorOpen && (
        <EditorModal
          initialData={editorInitialData}
          onClose={() => setIsEditorOpen(false)}
          onArticlePublished={() => {
            fetchAdminProfile();
            fetchArticles();
          }}
        />
      )}

      {/* 5. CRYPTOGRAPHIC SEAL INSPECTOR */}
      {selectedSealArticle && (
        <CryptoSealBadge
          article={selectedSealArticle}
          onClose={() => setSelectedSealArticle(null)}
        />
      )}

    </div>
  );
}
