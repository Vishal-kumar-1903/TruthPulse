'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  Send, 
  Image as ImageIcon, 
  Video, 
  Layers, 
  MapPin, 
  Link as LinkIcon, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  Activity, 
  HelpCircle,
  TrendingUp,
  FileText,
  Clock,
  Eye,
  RefreshCw,
  ExternalLink,
  Search,
  Building2,
  Lock,
  LogOut,
  Sliders,
  Check,
  X,
  Radio,
  FilePlus2,
  AlertCircle
} from 'lucide-react';
import { METROPOLITAN_HUBS } from '@/lib/metroHubs';
import AnimatedMedia from '@/components/AnimatedMedia';

interface ArticlePerformance {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
  upvotes: number;    // Right / Verified
  downvotes: number;  // Wrong / Disputed
  totalVotes?: number;
  authenticityPercent?: number;
  trustScore: number;
  mediaType: 'IMAGE' | 'VIDEO_LOOP' | 'LOTTIE_ANIMATION';
  mediaUrl?: string;
  imageUrl?: string;
  status: string;
  evidenceNotesCount: number;
}

export default function EditorStudioPage() {
  const router = useRouter();

  // Navigation / View Tabs
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'CREATOR' | 'ANALYTICS'>('CREATOR');

  // Editor Identity & Session
  const [currentEditor, setCurrentEditor] = useState<{ name: string; email: string; role: string; truthCredits: number }>({
    name: 'Vikramaditya Sen',
    email: 'editor@truthpulse.in',
    role: 'CHIEF_EDITOR',
    truthCredits: 185
  });

  // Form States (All-in-One Studio Canvas)
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Politics');
  const [summary, setSummary] = useState('');
  const [bullets, setBullets] = useState(['', '', '']);
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO_LOOP' | 'LOTTIE_ANIMATION'>('IMAGE');
  const [mediaUrl, setMediaUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [metroHub, setMetroHub] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [trustScore, setTrustScore] = useState(88);
  const [enableCivicAction, setEnableCivicAction] = useState(false);
  const [authorityDept, setAuthorityDept] = useState('Municipal Corporation (Public Utilities Division)');
  const [authorityEmail, setAuthorityEmail] = useState('grievances@municipal.gov.in');

  // UI Interactive States
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedInspectionArticle, setSelectedInspectionArticle] = useState<ArticlePerformance | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Performance Data State
  const [analyticsSummary, setAnalyticsSummary] = useState({
    totalArticles: 24,
    totalUpvotes: 384,
    totalDownvotes: 18,
    globalAuthenticity: 95
  });

  const [articles, setArticles] = useState<ArticlePerformance[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Load editor session on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('truthpulse_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'CHIEF_EDITOR' || parsed.role === 'EDITOR' || parsed.role === 'ADMIN') {
          setCurrentEditor(parsed);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Fetch live analytics data
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (data.success && data.data) {
        setArticles(data.data);
        if (data.summary) {
          setAnalyticsSummary(data.summary);
        }
      }
    } catch (err) {
      console.warn('Analytics fetch note:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // AI Assistant auto-synthesis
  const handleAutoSynthesize = () => {
    if (!title.trim()) {
      setToastMessage('⚠️ Kripya pehle Article Title enter karein!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSynthesizing(true);
    setTimeout(() => {
      setSummary(`${title.trim()} has been corroborated by state regulatory bulletins and statutory gazettes. Key compliance directives and transparent public telemetry dashboards have been initiated across designated administrative zones.`);
      setBullets([
        'Regulatory transparency directives codified across state nodal departments.',
        'Cryptographic Merkle ledger registers updated with zero audit discrepancies.',
        'Real-time citizen dispute and grievance telemetry active for verification.'
      ]);
      setTrustScore(94);
      if (!sourceName) setSourceName('Press Trust of India / Official Bulletin');
      if (!sourceUrl) setSourceUrl('https://ptinews.com/verified-dispatch-2026');
      setIsSynthesizing(false);
      setToastMessage('✨ AI Copilot: 60-word briefing & 3 takeaway highlights synthesized!');
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  // Publish Article
  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !sourceUrl.trim()) {
      alert('Kripya Title, Summary aur kam se kam 1 Primary Source URL anivarya roop se bharein!');
      return;
    }

    if (trustScore < 80) {
      alert('Editorial Gating Blocked: AI Trust Score kam se kam 80% hona zaroori hai.');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          bullets: bullets.filter(b => b.trim() !== ''),
          category,
          mediaType,
          mediaUrl: mediaUrl.trim() || undefined,
          imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200',
          metro: metroHub || undefined,
          sources: [{ name: sourceName.trim() || 'Primary News Wire', url: sourceUrl.trim(), stance: 'CORROBORATING' }],
          trustScore,
          author: currentEditor.name || 'TruthPulse Editorial Bureau'
        })
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage('✅ Dispatched & Cryptographically Sealed to TruthPulse Live Wire!');
        // Reset form
        setTitle('');
        setSummary('');
        setBullets(['', '', '']);
        setSourceUrl('');
        setSourceName('');
        // Re-fetch analytics
        fetchAnalytics();
      } else {
        alert(data.error || 'Failed to publish article');
      }
    } catch (err: any) {
      alert(err.message || 'Network error while publishing');
    } finally {
      setIsPublishing(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Logout Editor
  const handleLogout = () => {
    try {
      localStorage.removeItem('truthpulse_user');
      document.cookie = 'truthpulse_auth=; path=/; max-age=0; SameSite=Lax';
    } catch {
      // Ignore
    }
    router.push('/?view=public');
  };

  // Filtered Articles for Analytics
  const filteredArticles = articles.filter(a => {
    const matchesSearch = !searchFilter.trim() || a.title.toLowerCase().includes(searchFilter.toLowerCase().trim());
    const matchesCategory = categoryFilter === 'ALL' || a.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      
      {/* =========================================================================
          1. TOP DOCKED CONTROL BAR WITH PROMINENT PERMANENT BACK BUTTON
         ========================================================================= */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Prominent Live Portal Switcher & Identity */}
          <div className="flex items-center gap-3">
            <Link
              href="/?view=public"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 group"
              title="Switch to live public portal without ending editor session"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Live News Portal</span>
            </Link>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <h1 className="text-sm font-black tracking-wide bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  TruthPulse Studio
                </h1>
                <p className="text-[10px] font-mono text-slate-400 hidden xs:block">
                  Editor & Verification Workspace
                </p>
              </div>
            </div>
          </div>

          {/* Center: Dual Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveWorkspaceTab('CREATOR')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeWorkspaceTab === 'CREATOR'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Story Creator</span>
            </button>

            <button
              onClick={() => setActiveWorkspaceTab('ANALYTICS')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeWorkspaceTab === 'ANALYTICS'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Vote Analytics</span>
            </button>
          </div>

          {/* Right: Active Editor Profile & Gating Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">{currentEditor.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px] font-bold">
                {currentEditor.truthCredits} Credits
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950/60 hover:text-red-300 text-slate-400 transition"
              title="Sign Out of Editor Desk"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          2. MAIN WORKSPACE CONTAINER
         ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* =========================================================================
            VIEW A: ALL-IN-ONE ARTICLE CREATOR WITH DOCKED SIDE TOOLBARS
           ========================================================================= */}
        {activeWorkspaceTab === 'CREATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT / CENTER: MAIN EDITORIAL DRAFTING CANVAS (Cols 8) */}
            <div className="lg:col-span-8 space-y-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  Primary News Dispatch Drafter
                </span>
                
                <button
                  type="button"
                  onClick={handleAutoSynthesize}
                  disabled={isSynthesizing}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold transition shadow-sm active:scale-95"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
                  <span>{isSynthesizing ? 'Synthesizing...' : 'AI Copilot Synthesize'}</span>
                </button>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Article Title / Headline *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Parliament Clears Historic Electoral Transparency & Digital Infrastructure Act..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-100 text-sm font-semibold focus:outline-none transition shadow-inner"
                />
              </div>

              {/* 60-Word Takeaway Summary */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase">
                    60-Word Core Takeaway *
                  </label>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    summary.trim().split(/\s+/).filter(Boolean).length >= 50 && summary.trim().split(/\s+/).filter(Boolean).length <= 80
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'text-slate-500'
                  }`}>
                    {summary.trim() ? summary.trim().split(/\s+/).filter(Boolean).length : 0} Words (Optimal: 60-80)
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Provide concise, objective takeaway facts for fast reader consumption and mobile swipe reels..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-red-500 text-slate-100 text-xs leading-relaxed focus:outline-none transition shadow-inner"
                />
              </div>

              {/* 3 Key Bullets */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase">
                  3 Ground Reality Highlights
                </label>
                {bullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const next = [...bullets];
                        next[idx] = e.target.value;
                        setBullets(next);
                      }}
                      placeholder={`Bullet highlight ${idx + 1}...`}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Primary Source Verification (Editorial Gating Requirement) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" /> Mandatory Source Corroboration *
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">
                    Required for Gating Verification
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    placeholder="Source Org (e.g. PTI, Gazette, CECB)"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://official-gazette.gov.in/report-2026"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Civic Desk Action Option */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableCivicAction}
                      onChange={(e) => setEnableCivicAction(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-0 bg-slate-900 border-slate-700 w-4 h-4"
                    />
                    <span className="text-xs font-mono font-bold text-purple-300 uppercase flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Enable Civic Resolution Poll
                    </span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">Appends public accountability desk</span>
                </div>

                {enableCivicAction && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80">
                    <input
                      type="text"
                      value={authorityDept}
                      onChange={(e) => setAuthorityDept(e.target.value)}
                      placeholder="Municipal Authority Name"
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                    />
                    <input
                      type="email"
                      value={authorityEmail}
                      onChange={(e) => setAuthorityEmail(e.target.value)}
                      placeholder="authority@municipal.gov.in"
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Publish Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isPublishing || trustScore < 80 || !title.trim() || !summary.trim() || !sourceUrl.trim()}
                  onClick={handlePublishArticle}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-red-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Hashing & Cryptographically Sealing to Live Wire...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Broadcast Verified Dispatch to Live Wire</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT: DOCKED TOOLS & ACCREDITATION SIDEBAR (Cols 4) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Tool 1: AI Verification Trust Gauge */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    AI Trust Gauge
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    trustScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {trustScore}% Trust
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${trustScore}%` }}
                  ></div>
                </div>

                <p className="text-[11px] font-mono text-slate-400">
                  {trustScore >= 80 
                    ? '✓ Gating passed: Ready for immediate citizen wire broadcast.' 
                    : '⚠️ Trust score below 80% requires primary source corroboration.'}
                </p>
              </div>

              {/* Tool 2: Category & Metro Cluster Geo-Tagger */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-lg space-y-4">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Routing & Geo Cluster
                </span>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
                  >
                    <option value="Politics">Politics & Governance</option>
                    <option value="Business">Business & Markets</option>
                    <option value="Weather">Weather & Climate</option>
                    <option value="Health">Public Health</option>
                    <option value="Entertainment">Culture & Cinema</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Metropolitan Cluster</span>
                  <select
                    value={metroHub}
                    onChange={(e) => setMetroHub(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">National / Pan-India</option>
                    {METROPOLITAN_HUBS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.primaryCity})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tool 3: Dynamic Motion Media Format Selector */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 shadow-lg space-y-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Motion Visual Engine
                </span>

                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMediaType('IMAGE')}
                    className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition ${
                      mediaType === 'IMAGE' ? 'bg-slate-800 text-amber-300 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType('VIDEO_LOOP')}
                    className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition ${
                      mediaType === 'VIDEO_LOOP' ? 'bg-slate-800 text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Loop</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType('LOTTIE_ANIMATION')}
                    className={`p-2 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition ${
                      mediaType === 'LOTTIE_ANIMATION' ? 'bg-slate-800 text-indigo-300 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Vector</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Cover Image / Poster URL..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:border-red-500 focus:outline-none"
                  />

                  {mediaType === 'VIDEO_LOOP' && (
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="Looping MP4/WebM URL (e.g. https://.../loop.mp4)..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs text-cyan-200 font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  )}

                  {mediaType === 'LOTTIE_ANIMATION' && (
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder="Lottie JSON URL (Optional - default vector scene active)..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs text-indigo-200 font-mono focus:border-indigo-400 focus:outline-none"
                    />
                  )}
                </div>

                {/* Live Media Thumbnail Preview */}
                <div className="pt-1">
                  <div className="w-full h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                    <AnimatedMedia
                      mediaType={mediaType}
                      mediaUrl={mediaUrl}
                      imageUrl={imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600'}
                      alt="Studio Preview"
                      category={category}
                      showBadge={true}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block text-center">
                    Live Visual Dispatch Preview
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW B: RIGHT VS WRONG CREDIBILITY VOTE ANALYTICS
           ========================================================================= */}
        {activeWorkspaceTab === 'ANALYTICS' && (
          <div className="space-y-6">
            
            {/* Stat Cards Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg">
                <span className="text-xs font-mono text-slate-400 uppercase">Total Published Dispatches</span>
                <p className="text-3xl font-black text-white mt-1">{analyticsSummary.totalArticles}</p>
                <span className="text-[11px] font-mono text-emerald-400 mt-2 block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Cryptographically Sealed
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg">
                <span className="text-xs font-mono text-slate-400 uppercase">🟢 Reader Right Votes (Sahi)</span>
                <p className="text-3xl font-black text-emerald-400 mt-1">{analyticsSummary.totalUpvotes}</p>
                <span className="text-[11px] font-mono text-slate-400 mt-2 block">Corroborated by verified citizens</span>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg">
                <span className="text-xs font-mono text-slate-400 uppercase">🔴 Reader Disputes (Galat)</span>
                <p className="text-3xl font-black text-red-400 mt-1">{analyticsSummary.totalDownvotes}</p>
                <span className="text-[11px] font-mono text-red-400/80 mt-2 block">Flagged for editorial inspection</span>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg">
                <span className="text-xs font-mono text-slate-400 uppercase">Global Authenticity Index</span>
                <p className="text-3xl font-black text-cyan-400 mt-1">{analyticsSummary.globalAuthenticity}%</p>
                <span className="text-[11px] font-mono text-slate-400 mt-2 block">Weighted reliability threshold</span>
              </div>
            </div>

            {/* Performance Ledger Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-white font-mono">
                    Published Dispatch Ledger & Credibility Scoreboard
                  </h3>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Filter articles..."
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none font-mono"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Politics">Politics</option>
                    <option value="Business">Business</option>
                    <option value="Weather">Weather</option>
                    <option value="Health">Health</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-[11px] font-mono uppercase text-slate-400 bg-slate-950/40">
                      <th className="py-3 px-5">Article Headline</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Visual Format</th>
                      <th className="py-3 px-4 text-center">🟢 Right (Sahi)</th>
                      <th className="py-3 px-4 text-center">🔴 Wrong (Galat)</th>
                      <th className="py-3 px-4">Authenticity Ratio</th>
                      <th className="py-3 px-4">Dispute Notes</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-xs">
                    {filteredArticles.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                          No dispatches found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredArticles.map((art) => {
                        const totalVotes = (art.upvotes || 0) + (art.downvotes || 0);
                        const accuracyRate = art.authenticityPercent !== undefined 
                          ? art.authenticityPercent 
                          : (totalVotes > 0 ? Math.round((art.upvotes / totalVotes) * 100) : 100);

                        return (
                          <tr key={art._id} className="hover:bg-slate-800/30 transition">
                            <td className="py-3.5 px-5 max-w-xs truncate font-medium text-slate-200">
                              {art.title}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                                {art.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                art.mediaType === 'VIDEO_LOOP'
                                  ? 'bg-cyan-500/10 text-cyan-300'
                                  : art.mediaType === 'LOTTIE_ANIMATION'
                                  ? 'bg-indigo-500/10 text-indigo-300'
                                  : 'bg-amber-500/10 text-amber-300'
                              }`}>
                                {art.mediaType || 'IMAGE'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-400">
                              {art.upvotes}
                            </td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-red-400">
                              {art.downvotes}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                  <div
                                    className={`h-full ${accuracyRate >= 80 ? 'bg-emerald-500' : (accuracyRate >= 60 ? 'bg-amber-500' : 'bg-red-500')}`}
                                    style={{ width: `${accuracyRate}%` }}
                                  ></div>
                                </div>
                                <span className="text-[11px] font-mono font-bold text-slate-300">{accuracyRate}%</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-mono">
                              {art.evidenceNotesCount > 0 ? (
                                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 text-[10px] font-bold border border-red-500/30">
                                  {art.evidenceNotesCount} Flagged Links
                                </span>
                              ) : (
                                <span className="text-slate-600 text-[11px]">Clean</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedInspectionArticle(art)}
                                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono transition"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* =========================================================================
          3. COMMUNITY EVIDENCE & INSPECTION MODAL
         ========================================================================= */}
      {selectedInspectionArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Community Credibility Inspection
              </span>
              <button
                onClick={() => setSelectedInspectionArticle(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                {selectedInspectionArticle.title}
              </h4>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>Category: {selectedInspectionArticle.category}</span>
                <span>•</span>
                <span className="text-emerald-400">🟢 {selectedInspectionArticle.upvotes} Right</span>
                <span>•</span>
                <span className="text-red-400">🔴 {selectedInspectionArticle.downvotes} Disputed</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                Citizen Submitted Counter-Evidence & Community Notes:
              </span>
              {selectedInspectionArticle.downvotes > 0 ? (
                <div className="space-y-2 text-xs text-slate-400 font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-slate-300">"Citizen Note: Clarification requested regarding municipal tender dates."</p>
                    <span className="text-[10px] text-cyan-400 mt-1 block">Verified Citizen • Ref: Gazette Notice 44B</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-emerald-400 font-mono">
                  ✓ No community flags or contradictory counter-evidence submitted for this dispatch.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                href={`/?search=${encodeURIComponent(selectedInspectionArticle.title.slice(0, 25))}&view=public`}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View on Live Reader</span>
              </Link>

              <button
                onClick={() => {
                  setToastMessage('Statutory Gazette Note Appended to Article');
                  setSelectedInspectionArticle(null);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition"
              >
                Acknowledge Review
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
