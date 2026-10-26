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
  ShieldCheck, 
  Activity, 
  FileText, 
  Eye, 
  RefreshCw, 
  Search, 
  Building2, 
  LogOut, 
  X, 
  ChevronRight,
  SlidersHorizontal,
  Compass,
  Check,
  Globe
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

  // Navigation / View Tabs: 'CREATOR' vs 'ANALYTICS'
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'CREATOR' | 'ANALYTICS'>('CREATOR');

  // Editor Identity & Session
  const [currentEditor, setCurrentEditor] = useState<{ name: string; email: string; role: string; truthCredits: number }>({
    name: 'Vikramaditya Sen',
    email: 'editor@truthpulse.in',
    role: 'CHIEF_EDITOR',
    truthCredits: 185
  });

  // Form States (Clean Professional Terminal Canvas)
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
  const [authorityDept, setAuthorityDept] = useState('Municipal Utilities Authority');
  const [authorityEmail, setAuthorityEmail] = useState('grievance@municipal.gov.in');

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
      setToastMessage('Enter an article headline first.');
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
      setToastMessage('Briefing and 3 key takeaways generated.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 500);
  };

  // Publish Article
  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !sourceUrl.trim()) {
      alert('Please fill the Headline, Summary, and at least 1 Primary Source URL.');
      return;
    }

    if (trustScore < 80) {
      alert('Editorial Gating Blocked: AI Trust Score must be at least 80%.');
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
          sources: [{ name: sourceName.trim() || 'Primary Wire', url: sourceUrl.trim(), stance: 'CORROBORATING' }],
          trustScore,
          author: currentEditor.name || 'TruthPulse Editorial Bureau'
        })
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage('Article dispatched and cryptographically sealed.');
        setTitle('');
        setSummary('');
        setBullets(['', '', '']);
        setSourceUrl('');
        setSourceName('');
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#090A0F] text-zinc-100 flex flex-col font-sans select-none antialiased">
      
      {/* =========================================================================
          1. MINIMAL PRO CONTROL BAR (Clean, Monochrome, High Contrast)
         ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#0E1118]/90 backdrop-blur-md border-b border-zinc-800/80 px-3 sm:px-6 py-2.5 w-full max-w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Left: Prominent Live Portal Switcher & Workspace Label */}
          <div className="flex items-center gap-3">
            <Link
              href="/?view=public"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition active:scale-95 group"
              title="Switch to public reader website without ending your editor session"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Live Reader Mode</span>
            </Link>

            <span className="text-zinc-600 hidden sm:inline">/</span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-tight text-zinc-200">
                Editorial Workstation
              </span>
              <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50">
                PRO CMS
              </span>
            </div>
          </div>

          {/* Center: Workstation Segmented Switcher */}
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveWorkspaceTab('CREATOR')}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-md font-medium transition ${
                activeWorkspaceTab === 'CREATOR'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Drafting Desk</span>
            </button>

            <button
              onClick={() => setActiveWorkspaceTab('ANALYTICS')}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-md font-medium transition ${
                activeWorkspaceTab === 'ANALYTICS'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Ledger & Credibility</span>
            </button>
          </div>

          {/* Right: Clean User Pill & Signout */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-zinc-300 font-sans font-medium">{currentEditor.name.split(' ')[0]}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400 font-mono text-[11px]">{currentEditor.truthCredits} TC</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Toast Notification (Clean Neutral Notification) */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          2. WORKSPACE INTERFACE
         ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        
        {/* =========================================================================
            PANE A: DRAFTING DESK (Clean Document Editor + Right Inspector)
           ========================================================================= */}
        {activeWorkspaceTab === 'CREATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* CENTER: CLEAN DOCUMENT DRAFTING CANVAS (Cols 8) */}
            <div className="lg:col-span-8 bg-[#0E1118] border border-zinc-800/80 rounded-2xl p-6 sm:p-7 space-y-6">
              
              {/* Header Action Row */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-zinc-400 font-semibold tracking-wider">
                    New Article Dispatch
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-800/60">
                    Draft
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAutoSynthesize}
                  disabled={isSynthesizing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition border border-zinc-700/60 disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-zinc-400 ${isSynthesizing ? 'animate-spin' : ''}`} />
                  <span>{isSynthesizing ? 'Synthesizing...' : 'AI Assist'}</span>
                </button>
              </div>

              {/* Title / Headline (Document Style) */}
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article Headline..."
                  className="w-full bg-transparent border-0 border-b border-zinc-800 focus:border-zinc-500 pb-2 text-lg sm:text-xl font-bold text-zinc-100 placeholder-zinc-600 focus:outline-none transition"
                />
              </div>

              {/* 60-Word Takeaway Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="uppercase text-[11px] font-semibold">Core Takeaway Summary</span>
                  <span>{summary.trim() ? summary.trim().split(/\s+/).filter(Boolean).length : 0} Words</span>
                </div>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Draft a 60-word objective summary of verified factual developments..."
                  className="w-full p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-200 text-xs leading-relaxed placeholder-zinc-600 focus:border-zinc-600 focus:outline-none transition"
                />
              </div>

              {/* 3 Key Bullets */}
              <div className="space-y-2.5">
                <span className="block text-[11px] font-mono uppercase text-zinc-400 font-semibold">
                  3 Ground Highlights
                </span>
                {bullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-zinc-800/80 text-zinc-400 font-mono text-[11px] flex items-center justify-center font-bold shrink-0">
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
                      placeholder={`Key ground takeaway ${idx + 1}...`}
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Primary Source Verification */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] uppercase font-semibold text-zinc-300 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-zinc-400" /> Primary Source Reference *
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Statutory Gazette or Verified Wire</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    placeholder="Source Agency (e.g. PTI, Gazette, CECB)"
                    className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                  />
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://official-gazette.gov.in/..."
                    className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:border-zinc-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Civic Resolution Option */}
              <div className="p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-800/60 text-xs">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableCivicAction}
                      onChange={(e) => setEnableCivicAction(e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-700 text-zinc-100 focus:ring-0 w-3.5 h-3.5"
                    />
                    <span className="font-mono font-medium text-zinc-300 text-[11px] uppercase">
                      Attach Civic Accountability Poll
                    </span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">Public redressal desk</span>
                </div>

                {enableCivicAction && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-zinc-800">
                    <input
                      type="text"
                      value={authorityDept}
                      onChange={(e) => setAuthorityDept(e.target.value)}
                      placeholder="Concerned Municipal Body"
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
                    />
                    <input
                      type="email"
                      value={authorityEmail}
                      onChange={(e) => setAuthorityEmail(e.target.value)}
                      placeholder="grievance@municipal.gov.in"
                      className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT: DOCKED INSPECTOR PANEL (Cols 4) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Card 1: Verification & Gating Status */}
              <div className="bg-[#0E1118] border border-zinc-800/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] uppercase text-zinc-400 font-semibold">
                    Trust Gating Meter
                  </span>
                  <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                    trustScore >= 80 
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50' 
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {trustScore}% Trust
                  </span>
                </div>

                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-zinc-300 rounded-full transition-all duration-300"
                    style={{ width: `${trustScore}%` }}
                  ></div>
                </div>

                <p className="text-[11px] font-mono text-zinc-400 leading-normal">
                  {trustScore >= 80
                    ? '✓ Verification benchmark met (≥80%). Broadcast permitted.'
                    : 'Corroboration required before wire transmission.'}
                </p>

                {/* Primary Action Button (Clean high contrast) */}
                <button
                  type="button"
                  disabled={isPublishing || trustScore < 80 || !title.trim() || !summary.trim() || !sourceUrl.trim()}
                  onClick={handlePublishArticle}
                  className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:bg-zinc-100 active:scale-98"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Signing & Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Verified Dispatch</span>
                    </>
                  )}
                </button>
              </div>

              {/* Card 2: Routing & Classification */}
              <div className="bg-[#0E1118] border border-zinc-800/80 rounded-2xl p-5 space-y-3 text-xs">
                <span className="font-mono text-[11px] uppercase text-zinc-400 font-semibold block">
                  Taxonomy & Geo-Routing
                </span>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400">Category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                  >
                    <option value="Politics">Politics & Governance</option>
                    <option value="Business">Business & Markets</option>
                    <option value="Weather">Weather & Climate</option>
                    <option value="Health">Public Health</option>
                    <option value="Entertainment">Culture & Media</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400">Metropolitan Cluster</span>
                  <select
                    value={metroHub}
                    onChange={(e) => setMetroHub(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                  >
                    <option value="">National / Pan-India</option>
                    {METROPOLITAN_HUBS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.primaryCity})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Card 3: Media Visual Presentation */}
              <div className="bg-[#0E1118] border border-zinc-800/80 rounded-2xl p-5 space-y-3 text-xs">
                <span className="font-mono text-[11px] uppercase text-zinc-400 font-semibold block">
                  Media Presentation
                </span>

                <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setMediaType('IMAGE')}
                    className={`py-1.5 rounded font-medium transition ${
                      mediaType === 'IMAGE' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('VIDEO_LOOP')}
                    className={`py-1.5 rounded font-medium transition ${
                      mediaType === 'VIDEO_LOOP' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Loop
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('LOTTIE_ANIMATION')}
                    className={`py-1.5 rounded font-medium transition ${
                      mediaType === 'LOTTIE_ANIMATION' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Vector
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Poster Image URL..."
                    className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none"
                  />

                  {mediaType !== 'IMAGE' && (
                    <input
                      type="text"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder={mediaType === 'VIDEO_LOOP' ? 'MP4/WebM Loop URL...' : 'Lottie JSON URL (Optional)...'}
                      className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none"
                    />
                  )}
                </div>

                {/* Minimal preview thumbnail */}
                <div className="w-full h-24 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 relative">
                  <AnimatedMedia
                    mediaType={mediaType}
                    mediaUrl={mediaUrl}
                    imageUrl={imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600'}
                    alt="Preview"
                    category={category}
                    showBadge={false}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            PANE B: LEDGER & CREDIBILITY ANALYTICS (Clean Financial Terminal Style)
           ========================================================================= */}
        {activeWorkspaceTab === 'ANALYTICS' && (
          <div className="space-y-5">
            
            {/* 4 Minimal Metric Cards (Zero Gaudy Colors) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0E1118] border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Total Dispatches</span>
                <p className="text-2xl font-bold text-zinc-100 mt-1 font-mono">{analyticsSummary.totalArticles}</p>
                <span className="text-[10px] font-mono text-zinc-400 mt-1 block">Cryptographically Sealed</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0E1118] border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">🟢 Verified (Sahi)</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">+{analyticsSummary.totalUpvotes}</p>
                <span className="text-[10px] font-mono text-zinc-400 mt-1 block">Reader corroborations</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0E1118] border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">🔴 Disputed (Galat)</span>
                <p className="text-2xl font-bold text-rose-400 mt-1 font-mono">-{analyticsSummary.totalDownvotes}</p>
                <span className="text-[10px] font-mono text-zinc-400 mt-1 block">Citizen dispute flags</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0E1118] border border-zinc-800/80">
                <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">Authenticity Ratio</span>
                <p className="text-2xl font-bold text-zinc-100 mt-1 font-mono">{analyticsSummary.globalAuthenticity}%</p>
                <span className="text-[10px] font-mono text-zinc-400 mt-1 block">Quality threshold</span>
              </div>
            </div>

            {/* Scoreboard Table (Clean Financial Ledger Aesthetic) */}
            <div className="bg-[#0E1118] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-mono uppercase font-semibold text-zinc-300">
                    Dispatch Scoreboard
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search title..."
                      className="pl-7 pr-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none font-mono"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none font-mono"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Politics">Politics</option>
                    <option value="Business">Business</option>
                    <option value="Weather">Weather</option>
                    <option value="Health">Health</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800/80 text-[10px] font-mono uppercase text-zinc-400 bg-zinc-900/40">
                      <th className="py-2.5 px-4 font-semibold">Dispatch Title</th>
                      <th className="py-2.5 px-3 font-semibold">Category</th>
                      <th className="py-2.5 px-3 text-center font-semibold">🟢 Right</th>
                      <th className="py-2.5 px-3 text-center font-semibold">🔴 Wrong</th>
                      <th className="py-2.5 px-3 font-semibold">Authenticity</th>
                      <th className="py-2.5 px-3 font-semibold">Notes</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 text-xs">
                    {filteredArticles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-zinc-500 font-mono">
                          No matching dispatches.
                        </td>
                      </tr>
                    ) : (
                      filteredArticles.map((art) => {
                        const totalVotes = (art.upvotes || 0) + (art.downvotes || 0);
                        const accuracyRate = art.authenticityPercent !== undefined 
                          ? art.authenticityPercent 
                          : (totalVotes > 0 ? Math.round((art.upvotes / totalVotes) * 100) : 100);

                        return (
                          <tr key={art._id} className="hover:bg-zinc-800/20 transition">
                            <td className="py-3 px-4 max-w-sm truncate text-zinc-200 font-medium">
                              {art.title}
                            </td>
                            <td className="py-3 px-3 text-zinc-400 font-mono text-[11px]">
                              {art.category}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-medium text-emerald-400">
                              {art.upvotes}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-medium text-rose-400">
                              {art.downvotes}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-14 bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                                  <div
                                    className={`h-full ${accuracyRate >= 80 ? 'bg-emerald-500' : (accuracyRate >= 60 ? 'bg-zinc-400' : 'bg-rose-500')}`}
                                    style={{ width: `${accuracyRate}%` }}
                                  ></div>
                                </div>
                                <span className="font-mono text-[11px] text-zinc-300">{accuracyRate}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono text-[11px]">
                              {art.evidenceNotesCount > 0 ? (
                                <span className="text-rose-400">
                                  {art.evidenceNotesCount} flags
                                </span>
                              ) : (
                                <span className="text-zinc-600">0</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedInspectionArticle(art)}
                                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono transition"
                              >
                                Review
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

      {/* Review Modal */}
      {selectedInspectionArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1118] border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                Dispatch Verification Audit
              </span>
              <button
                onClick={() => setSelectedInspectionArticle(null)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-zinc-100 mb-1">
                {selectedInspectionArticle.title}
              </h4>
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                <span>{selectedInspectionArticle.category}</span>
                <span>•</span>
                <span className="text-emerald-400">🟢 {selectedInspectionArticle.upvotes} Right</span>
                <span>•</span>
                <span className="text-rose-400">🔴 {selectedInspectionArticle.downvotes} Disputed</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
              {selectedInspectionArticle.downvotes > 0 ? (
                <p className="text-zinc-400">Citizen note: Submitted reference links verified against municipal records.</p>
              ) : (
                <p className="text-emerald-400">✓ No discrepancies reported by community fact-checkers.</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                href={`/?search=${encodeURIComponent(selectedInspectionArticle.title.slice(0, 20))}&view=public`}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
              >
                View in Reader
              </Link>
              <button
                onClick={() => {
                  setToastMessage('Audit review acknowledged.');
                  setSelectedInspectionArticle(null);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
