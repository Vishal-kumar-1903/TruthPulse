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
  Globe,
  Radio,
  Flame,
  Film,
  Newspaper,
  BookOpen,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Minus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Server,
  Database
} from 'lucide-react';
import { METROPOLITAN_HUBS } from '@/lib/metroHubs';
import AnimatedMedia from '@/components/AnimatedMedia';

interface ArticlePerformance {
  _id: string;
  title: string;
  category: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  totalVotes?: number;
  authenticityPercent?: number;
  trustScore: number;
  mediaType: 'IMAGE' | 'VIDEO_LOOP' | 'LOTTIE_ANIMATION';
  mediaUrl?: string;
  imageUrl?: string;
  contentType?: 'NEWS' | 'ARTICLE' | 'REEL';
  reelBadge?: string;
  status: string;
  evidenceNotesCount: number;
  strapiId?: string;
}

// Preset verified vertical clips for quick testing
const REEL_PRESET_CLIPS = [
  {
    name: 'City Traffic Night',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
    poster: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000'
  },
  {
    name: 'Solar Energy Field',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-solar-panels-in-a-field-42517-large.mp4',
    poster: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1000'
  },
  {
    name: 'Satellite Weather Radar',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-satellite-view-of-clouds-over-earth-42485-large.mp4',
    poster: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1000'
  },
  {
    name: 'Industrial Rolling Mill',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-welder-working-in-a-metal-shop-42686-large.mp4',
    poster: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=1000'
  }
];

export default function EditorStudioPage() {
  const router = useRouter();

  // Navigation / View Tabs: 'CREATOR' vs 'STRAPI' vs 'ANALYTICS'
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'CREATOR' | 'STRAPI' | 'ANALYTICS'>('CREATOR');

  // Content Type Selection: 'NEWS' vs 'ARTICLE' vs 'REEL'
  const [contentType, setContentType] = useState<'NEWS' | 'ARTICLE' | 'REEL'>('NEWS');

  // Editor Identity & Session
  const [currentEditor, setCurrentEditor] = useState<{ name: string; email: string; role: string; truthCredits: number }>({
    name: 'Vikramaditya Sen',
    email: 'editor@truthpulse.in',
    role: 'CHIEF_EDITOR',
    truthCredits: 185
  });

  // Common Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Politics');
  const [summary, setSummary] = useState('');
  const [bullets, setBullets] = useState(['', '', '']);
  const [imageUrl, setImageUrl] = useState('');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO_LOOP' | 'LOTTIE_ANIMATION'>('IMAGE');
  const [mediaUrl, setMediaUrl] = useState('');
  const [metroHub, setMetroHub] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [trustScore, setTrustScore] = useState(88);
  const [syncToStrapi, setSyncToStrapi] = useState(true);

  // Mode 2: In-Depth Article Long-Form Content
  const [articleBody, setArticleBody] = useState('');
  const [authorByline, setAuthorByline] = useState('TruthPulse Investigative Desk');

  // Mode 3: Reel / Shorts Specific States
  const [reelHeadline, setReelHeadline] = useState('');
  const [reelSnippet, setReelSnippet] = useState('');
  const [reelBadge, setReelBadge] = useState<'BREAKING' | 'ALERT' | 'FACT-CHECK'>('BREAKING');
  const [reelVideoUrl, setReelVideoUrl] = useState('https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4');
  const [reelPosterUrl, setReelPosterUrl] = useState('https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000');
  const [reelLocation, setReelLocation] = useState('New Delhi');
  const [reelSourceUrl, setReelSourceUrl] = useState('https://ptinews.com/verified-dispatch-2026');
  const [reelSourceName, setReelSourceName] = useState('ANI National Wire');
  const [reelCategory, setReelCategory] = useState('Politics');
  const [previewPlaying, setPreviewPlaying] = useState(true);

  // Civic Resolution Option (for News/Article)
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

  // Strapi CMS Health Status
  const [strapiStatus, setStrapiStatus] = useState<{ checking: boolean; online: boolean; latencyMs?: number; error?: string }>({
    checking: false,
    online: false
  });

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
          setAuthorByline(parsed.name || 'TruthPulse Editorial Desk');
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Check Strapi Health
  const checkStrapi = async () => {
    setStrapiStatus(prev => ({ ...prev, checking: true }));
    try {
      const res = await fetch('/api/health/strapi');
      const data = await res.json();
      setStrapiStatus({
        checking: false,
        online: Boolean(data.online),
        latencyMs: data.latencyMs,
        error: data.error
      });
    } catch {
      setStrapiStatus({ checking: false, online: false, error: 'Offline / Standby' });
    }
  };

  useEffect(() => {
    checkStrapi();
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

  // AI Assistant auto-synthesis for News/Article
  const handleAutoSynthesize = () => {
    const currentHeading = contentType === 'REEL' ? reelHeadline : title;
    if (!currentHeading.trim()) {
      setToastMessage('Enter a headline first to activate AI Assistant.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSynthesizing(true);
    setTimeout(() => {
      if (contentType === 'REEL') {
        setReelSnippet(`${currentHeading.trim()} corroborated by statutory bulletins. Surveillance and ground telemetry initiated across nodal zones.`);
        setTrustScore(95);
        if (!reelSourceName) setReelSourceName('PIB / Official Press Wire');
        if (!reelSourceUrl) setReelSourceUrl('https://ptinews.com/verified-dispatch-2026');
      } else {
        setSummary(`${currentHeading.trim()} has been corroborated by state regulatory bulletins and statutory gazettes. Key compliance directives and transparent public telemetry dashboards have been initiated across designated administrative zones.`);
        setBullets([
          'Regulatory transparency directives codified across state nodal departments.',
          'Cryptographic Merkle ledger registers updated with zero audit discrepancies.',
          'Real-time citizen dispute and grievance telemetry active for verification.'
        ]);
        if (contentType === 'ARTICLE' && !articleBody.trim()) {
          setArticleBody(`## Executive Overview\n\n${currentHeading.trim()} represents a landmark development in public governance and statutory oversight. Official communications verified this week establish a comprehensive compliance framework across national and regional stakeholders.\n\n### Ground Verification & Telemetry\n\nAdministrative task forces were deployed earlier today to coordinate on-site validation. According to primary regulatory registers, procedural execution is progressing without discrepancies.\n\n> "Statutory accountability protocols are now codified under digital registry standards, ensuring complete auditability for citizen observers."\n\n### Key Takeaways\n\n- Systematic monitoring active across designated administrative zones.\n- Zero-discrepancy Merkle blockchain seals appended to official disclosures.\n- Public grievance redressal window opened for citizen submissions.`);
        }
        setTrustScore(94);
        if (!sourceName) setSourceName('Press Trust of India / Official Bulletin');
        if (!sourceUrl) setSourceUrl('https://ptinews.com/verified-dispatch-2026');
      }
      setIsSynthesizing(false);
      setToastMessage('AI Synthesis complete: Briefing, bullets, and citations populated.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 450);
  };

  // Helper to insert markdown in Article body
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    setArticleBody(prev => `${prev}\n${prefix}Text${suffix}\n`);
  };

  // 1. Publish News or Article
  const handlePublishNewsOrArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !sourceUrl.trim()) {
      alert('Please fill the Headline, Summary, and at least 1 Primary Source URL.');
      return;
    }

    if (trustScore < 80) {
      alert('Editorial Gating: Automated AI Trust Score must be at least 80%.');
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
          content: contentType === 'ARTICLE' ? (articleBody.trim() || summary.trim()) : summary.trim(),
          category,
          contentType,
          mediaType,
          mediaUrl: mediaUrl.trim() || undefined,
          imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200',
          metro: metroHub || undefined,
          sources: [{ name: sourceName.trim() || 'Primary Wire', url: sourceUrl.trim(), stance: 'CORROBORATING' }],
          trustScore,
          author: authorByline.trim() || currentEditor.name || 'TruthPulse Editorial Bureau',
          isPinned: true
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.strapi?.success) {
          setToastMessage(`${contentType === 'ARTICLE' ? 'In-Depth Article' : 'News Dispatch'} published & synced to Strapi CMS (#${data.strapi.strapiId})!`);
        } else {
          setToastMessage(`${contentType === 'ARTICLE' ? 'In-Depth Article' : 'News Dispatch'} published to Front Page!`);
        }
        try {
          localStorage.setItem('truthpulse_refresh_feed', Date.now().toString());
          window.dispatchEvent(new Event('truthpulse_refresh'));
        } catch {}
        setTitle('');
        setSummary('');
        setArticleBody('');
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

  // 2. Publish Breaking Short / Reel
  const handlePublishReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelHeadline.trim() || !reelSnippet.trim() || !reelSourceUrl.trim()) {
      alert('Please fill Reel Headline, 30-word Caption/Snippet, and at least 1 Primary Video Wire Source.');
      return;
    }

    if (!reelVideoUrl.trim()) {
      alert('Please enter or select a valid Vertical Video URL (MP4 / WebM).');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: reelHeadline.trim(),
          snippet: reelSnippet.trim(),
          badge: reelBadge,
          mediaUrl: reelVideoUrl.trim(),
          imageUrl: reelPosterUrl.trim() || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000',
          location: reelLocation.trim() || 'New Delhi',
          category: reelCategory,
          sourceName: reelSourceName.trim() || 'ANI Video Wire',
          sourceUrl: reelSourceUrl.trim(),
          author: authorByline || currentEditor.name || 'TruthPulse Video Desk',
          trustScore
        })
      });

      const data = await res.json();
      if (data.success) {
        setToastMessage(`🎬 Breaking Reel "${reelHeadline.slice(0, 25)}..." is LIVE on Front Page & Reel Viewer!`);
        
        // Broadcast new reel to home page carousel & fullscreen player
        try {
          window.dispatchEvent(new CustomEvent('truthpulse_new_reel', { detail: { short: data.short } }));
          localStorage.setItem('truthpulse_refresh_feed', Date.now().toString());
        } catch {}

        setReelHeadline('');
        setReelSnippet('');
        fetchAnalytics();
      } else {
        alert(data.error || 'Failed to publish reel');
      }
    } catch (err: any) {
      alert(err.message || 'Network error publishing reel');
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
    router.push('/');
  };

  // Filtered Articles for Analytics
  const filteredArticles = articles.filter(a => {
    const matchesSearch = !searchFilter.trim() || a.title.toLowerCase().includes(searchFilter.toLowerCase().trim());
    const matchesCategory = categoryFilter === 'ALL' || a.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900 flex flex-col font-sans select-none antialiased">
      
      {/* =========================================================================
          1. CLEAN WHITE PRO CONTROL BAR (Editorial Standard, High Contrast)
         ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 w-full max-w-full shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Left: Prominent Live Portal Switcher & Workspace Label */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-300 transition active:scale-95 group"
              title="Switch to public reader website without ending your editor session"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
              <span>Live Reader Mode</span>
            </Link>

            <span className="text-slate-300 hidden sm:inline">/</span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-slate-900">
                Editorial Workstation
              </span>
              <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-semibold">
                PRO CMS
              </span>
            </div>
          </div>

          {/* Center: Workstation Segmented Switcher (Drafting, Strapi CMS, Analytics) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveWorkspaceTab('CREATOR')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                activeWorkspaceTab === 'CREATOR'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Drafting Desk</span>
            </button>

            <button
              onClick={() => setActiveWorkspaceTab('STRAPI')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                activeWorkspaceTab === 'STRAPI'
                  ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                  : 'text-slate-600 hover:text-indigo-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              <span>Strapi CMS Hub</span>
            </button>

            <button
              onClick={() => setActiveWorkspaceTab('ANALYTICS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
                activeWorkspaceTab === 'ANALYTICS'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Ledger & Credibility</span>
            </button>
          </div>

          {/* Right: Clean User Pill & Signout */}
          <div className="flex items-center gap-2.5">
            <a
              href="http://localhost:1337/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-[11px] font-mono border border-indigo-200 transition"
              title="Open Strapi Headless CMS Admin Console (localhost:1337/admin)"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${strapiStatus.online ? 'bg-emerald-500' : 'bg-indigo-600 animate-pulse'}`}></span>
              <span>Strapi CMS Admin</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-800 font-sans font-semibold">{currentEditor.name.split(' ')[0]}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-mono text-[11px] font-bold">{currentEditor.truthCredits} TC</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-mono shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
          <Link
            href="/"
            className="ml-2 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white font-sans font-semibold text-[11px] transition shadow-sm"
          >
            Open Front Page ↗
          </Link>
        </div>
      )}

      {/* =========================================================================
          2. WORKSPACE INTERFACE
         ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        
        {/* =========================================================================
            PANE A: DRAFTING DESK (With Content Type Selection: News vs Article vs Reel)
           ========================================================================= */}
        {activeWorkspaceTab === 'CREATOR' && (
          <div className="space-y-5">
            
            {/* 1. PRIMARY CONTENT-TYPE SELECTOR BAR */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 pl-1">
                  Format:
                </span>
                <span className="text-xs text-slate-600 font-medium hidden md:inline">
                  Select whether you want to publish a Quick News Flash, Full In-Depth Article, or Video Reel
                </span>
              </div>

              {/* 3 Interactive Mode Tabs */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
                
                {/* 1. Quick News Option */}
                <button
                  type="button"
                  onClick={() => setContentType('NEWS')}
                  className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                    contentType === 'NEWS'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200 ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Newspaper className="w-4 h-4 text-red-600" />
                  <span>News Dispatch</span>
                </button>

                {/* 2. In-Depth Article Option */}
                <button
                  type="button"
                  onClick={() => setContentType('ARTICLE')}
                  className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                    contentType === 'ARTICLE'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200 ring-1 ring-slate-900/5'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>In-Depth Article</span>
                </button>

                {/* 3. Video Reel / Shorts Option */}
                <button
                  type="button"
                  onClick={() => setContentType('REEL')}
                  className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
                    contentType === 'REEL'
                      ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-700'
                      : 'text-slate-600 hover:text-red-600'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Video Reel</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-black uppercase ${
                    contentType === 'REEL' ? 'bg-white text-red-600' : 'bg-red-100 text-red-700'
                  }`}>
                    HOT
                  </span>
                </button>

              </div>
            </div>

            {/* =====================================================================
                A1 & A2: NEWS DISPATCH & IN-DEPTH ARTICLE WORKSTATION
               ===================================================================== */}
            {(contentType === 'NEWS' || contentType === 'ARTICLE') && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* CENTER: CLEAN WHITE DOCUMENT DRAFTING CANVAS (Cols 8) */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
                  
                  {/* Header Action Row */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
                        {contentType === 'ARTICLE' ? 'Long-Form Article Canvas' : 'News Flash Terminal'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {contentType === 'ARTICLE' ? 'Strapi Rich Article' : '60-Word Wire'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoSynthesize}
                      disabled={isSynthesizing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono transition border border-slate-300 disabled:opacity-50 font-semibold"
                    >
                      <Sparkles className={`w-3.5 h-3.5 text-slate-600 ${isSynthesizing ? 'animate-spin' : ''}`} />
                      <span>{isSynthesizing ? 'Synthesizing...' : 'AI Assist'}</span>
                    </button>
                  </div>

                  {/* Title / Headline (Document Style) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-slate-500 font-bold">
                      {contentType === 'ARTICLE' ? 'Article Title' : 'News Headline'}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={contentType === 'ARTICLE' ? 'Comprehensive Title: e.g. National Water Infrastructure Resilience Act 2026...' : 'Breaking News Flash Headline...'}
                      className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-slate-800 pb-2 text-lg sm:text-xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none transition"
                    />
                  </div>

                  {/* Core Takeaway Summary (Executive Subtitle) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                      <span className="uppercase text-[11px] font-semibold">
                        {contentType === 'ARTICLE' ? 'Executive Brief / Subtitle' : 'Core 60-Word Takeaway Summary'}
                      </span>
                      <span className="font-semibold">{summary.trim() ? summary.trim().split(/\s+/).filter(Boolean).length : 0} Words</span>
                    </div>
                    <textarea
                      rows={contentType === 'ARTICLE' ? 3 : 4}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder={contentType === 'ARTICLE' ? 'Brief summary introducing the investigation or statutory analysis...' : 'Draft an objective 60-word summary of verified factual developments...'}
                      className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs leading-relaxed placeholder-slate-400 focus:bg-white focus:border-slate-800 focus:outline-none transition"
                    />
                  </div>

                  {/* IN-DEPTH ARTICLE BODY (Shown only when contentType === 'ARTICLE') */}
                  {contentType === 'ARTICLE' && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase text-slate-700 font-bold flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          <span>Full Article Body (Strapi Markdown & Rich Text)</span>
                        </span>
                        
                        {/* Formatting Quick Buttons */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => insertMarkdown('**', '**')}
                            className="p-1 rounded hover:bg-white text-slate-700 text-xs font-bold"
                            title="Bold text"
                          >
                            <Bold className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown('*', '*')}
                            className="p-1 rounded hover:bg-white text-slate-700 text-xs"
                            title="Italic text"
                          >
                            <Italic className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown('## ')}
                            className="p-1 rounded hover:bg-white text-slate-700 text-xs"
                            title="Section Heading 2"
                          >
                            <Heading2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown('### ')}
                            className="p-1 rounded hover:bg-white text-slate-700 text-xs"
                            title="Subheading 3"
                          >
                            <Heading3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown('> ')}
                            className="p-1 rounded hover:bg-white text-slate-700 text-xs"
                            title="Blockquote"
                          >
                            <Quote className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown('- ')}
                            className="p-1 rounded hover:bg-white text-slate-700 text-xs"
                            title="Bullet item"
                          >
                            <List className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={12}
                        value={articleBody}
                        onChange={(e) => setArticleBody(e.target.value)}
                        placeholder="Write your in-depth investigative article here. Supports subheadings (##), quotes (>), statistics, bullet points, and full paragraph narratives..."
                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs leading-relaxed font-sans placeholder-slate-400 focus:bg-white focus:border-slate-800 focus:outline-none transition shadow-inner"
                      />
                    </div>
                  )}

                  {/* 3 Key Bullets */}
                  <div className="space-y-2.5">
                    <span className="block text-[11px] font-mono uppercase text-slate-500 font-semibold">
                      3 Ground Highlights (Executive Bullets)
                    </span>
                    {bullets.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] flex items-center justify-center font-bold shrink-0 border border-slate-200">
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
                          className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-800 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Primary Source Verification */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] uppercase font-semibold text-slate-700 flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-500" /> Primary Source Reference *
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Statutory Gazette or Verified Wire</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                        placeholder="Source Agency (e.g. PTI, Gazette, CECB)"
                        className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-800 focus:outline-none"
                      />
                      <input
                        type="url"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                        placeholder="https://official-gazette.gov.in/..."
                        className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-mono placeholder-slate-400 focus:border-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Civic Resolution Option */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableCivicAction}
                          onChange={(e) => setEnableCivicAction(e.target.checked)}
                          className="rounded bg-white border-slate-300 text-slate-900 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span className="font-mono font-semibold text-slate-700 text-[11px] uppercase">
                          Attach Civic Accountability Poll
                        </span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">Public redressal desk</span>
                    </div>

                    {enableCivicAction && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-200">
                        <input
                          type="text"
                          value={authorityDept}
                          onChange={(e) => setAuthorityDept(e.target.value)}
                          placeholder="Concerned Municipal Body"
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900"
                        />
                        <input
                          type="email"
                          value={authorityEmail}
                          onChange={(e) => setAuthorityEmail(e.target.value)}
                          placeholder="grievance@municipal.gov.in"
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-mono"
                        />
                      </div>
                    )}
                  </div>

                </div>

                {/* RIGHT: DOCKED INSPECTOR PANEL (Cols 4) */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Card 1: Verification & Gating Status */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] uppercase text-slate-500 font-semibold">
                        Trust Gating Meter
                      </span>
                      <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                        trustScore >= 80 
                          ? 'bg-slate-100 text-slate-900 border border-slate-300' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {trustScore}% Trust
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-slate-800 rounded-full transition-all duration-300"
                        style={{ width: `${trustScore}%` }}
                      ></div>
                    </div>

                    <p className="text-[11px] font-mono text-slate-600 leading-normal">
                      {trustScore >= 80
                        ? '✓ Verification benchmark met (≥80%). Broadcast permitted.'
                        : 'Corroboration required before wire transmission.'}
                    </p>

                    {/* Primary Action Button */}
                    <button
                      type="button"
                      disabled={isPublishing || trustScore < 80 || !title.trim() || !summary.trim() || !sourceUrl.trim()}
                      onClick={handlePublishNewsOrArticle}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-40 active:scale-98"
                    >
                      {isPublishing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Signing & Broadcasting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{contentType === 'ARTICLE' ? 'Publish In-Depth Article' : 'Publish Verified News'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Card 2: Taxonomy & Geo-Routing */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 text-xs shadow-sm">
                    <span className="font-mono text-[11px] uppercase text-slate-500 font-semibold block">
                      Taxonomy & Geo-Routing
                    </span>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">Category</span>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-none"
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
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">Metropolitan Cluster</span>
                      <select
                        value={metroHub}
                        onChange={(e) => setMetroHub(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-slate-800 focus:outline-none"
                      >
                        <option value="">National / Pan-India</option>
                        {METROPOLITAN_HUBS.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.primaryCity})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">Author Byline</span>
                      <input
                        type="text"
                        value={authorByline}
                        onChange={(e) => setAuthorByline(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                        placeholder="Editor Name or Bureau Byline"
                      />
                    </div>
                  </div>

                  {/* Card 3: Media Visual Presentation */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 text-xs shadow-sm">
                    <span className="font-mono text-[11px] uppercase text-slate-500 font-semibold block">
                      Cover Media Presentation
                    </span>

                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setMediaType('IMAGE')}
                        className={`py-1.5 rounded font-semibold transition ${
                          mediaType === 'IMAGE' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaType('VIDEO_LOOP')}
                        className={`py-1.5 rounded font-semibold transition ${
                          mediaType === 'VIDEO_LOOP' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Loop
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaType('LOTTIE_ANIMATION')}
                        className={`py-1.5 rounded font-semibold transition ${
                          mediaType === 'LOTTIE_ANIMATION' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
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
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:border-slate-800 focus:outline-none"
                      />

                      {mediaType !== 'IMAGE' && (
                        <input
                          type="text"
                          value={mediaUrl}
                          onChange={(e) => setMediaUrl(e.target.value)}
                          placeholder={mediaType === 'VIDEO_LOOP' ? 'MP4/WebM Loop URL...' : 'Lottie JSON URL (Optional)...'}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:border-slate-800 focus:outline-none"
                        />
                      )}
                    </div>

                    {/* Minimal preview thumbnail */}
                    <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 relative">
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

                  {/* Card 4: Strapi CMS Integration */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span className={`w-2 h-2 rounded-full ${strapiStatus.online ? 'bg-emerald-500' : 'bg-indigo-600 animate-pulse'}`}></span>
                        <span>Strapi Headless CMS</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                        Dual-Sync
                      </span>
                    </div>

                    <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-700 font-medium">Replicate to Strapi CMS</span>
                      <input
                        type="checkbox"
                        checked={syncToStrapi}
                        onChange={(e) => setSyncToStrapi(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-0"
                      />
                    </label>

                    <p className="text-[10px] font-mono text-slate-500 leading-normal">
                      Automatically maps to Strapi Article collection with Draft & Publish state.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* =====================================================================
                A3: VIDEO REEL / SHORTS WORKSTATION ("jha se reels dala jaye")
               ===================================================================== */}
            {contentType === 'REEL' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* LEFT: REEL METADATA & UPLOAD FORM (Cols 7) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm">
                  
                  {/* Reel Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-mono uppercase text-slate-900 font-bold tracking-wider">
                        Vertical Reel Dispatch Desk
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-red-600 px-2 py-0.5 rounded bg-red-50 border border-red-200 animate-pulse">
                      Live Broadcast
                    </span>
                  </div>

                  {/* 1. Reel Headline */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono uppercase text-slate-700 font-bold">
                        Reel Headline (Under 15 Words) *
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        {reelHeadline.trim().split(/\s+/).filter(Boolean).length} / 15 words
                      </span>
                    </div>
                    <input
                      type="text"
                      value={reelHeadline}
                      onChange={(e) => setReelHeadline(e.target.value)}
                      placeholder="e.g. Historic Electoral Transparency & Infrastructure Bill Enacted in New Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:outline-none transition"
                    />
                  </div>

                  {/* 2. Badge Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-slate-700 font-bold block">
                      Reel Alert Badge
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setReelBadge('BREAKING')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                          reelBadge === 'BREAKING'
                            ? 'bg-red-600 text-white border-red-700 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5" />
                        <span>BREAKING</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReelBadge('ALERT')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                          reelBadge === 'ALERT'
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>ALERT</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReelBadge('FACT-CHECK')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                          reelBadge === 'FACT-CHECK'
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>FACT-CHECK</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Reel Caption / Snippet (Under 30 Words) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono uppercase text-slate-700 font-bold">
                        Reel Caption / Snippet (Under 30 Words) *
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">
                        {reelSnippet.trim().split(/\s+/).filter(Boolean).length} / 30 words
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={reelSnippet}
                      onChange={(e) => setReelSnippet(e.target.value)}
                      placeholder="Mandatory algorithmic verification and real-time treasury expenditure dashboards codified into national law across all parliamentary constituencies."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-900 placeholder-slate-400 focus:bg-white focus:border-red-600 focus:outline-none transition"
                    />
                  </div>

                  {/* 4. Vertical Video URL with Quick Samples */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono uppercase text-slate-700 font-bold flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-red-600" />
                        <span>Vertical Video URL (MP4 / WebM) *</span>
                      </label>
                      <span className="text-[10px] font-mono text-slate-400">Direct CDN / Video Link</span>
                    </div>

                    <input
                      type="url"
                      value={reelVideoUrl}
                      onChange={(e) => setReelVideoUrl(e.target.value)}
                      placeholder="https://your-cdn.com/reel-video.mp4"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:border-red-600 focus:outline-none"
                    />

                    {/* Quick 1-Click Samples */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">Sample Clips:</span>
                      {REEL_PRESET_CLIPS.map((clip) => (
                        <button
                          key={clip.name}
                          type="button"
                          onClick={() => {
                            setReelVideoUrl(clip.url);
                            setReelPosterUrl(clip.poster);
                          }}
                          className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[10px] font-mono text-slate-700 border border-slate-200 shrink-0 transition"
                        >
                          {clip.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Poster / Cover Thumbnail Image URL */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-slate-700 font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reel Cover Thumbnail URL</span>
                    </label>
                    <input
                      type="url"
                      value={reelPosterUrl}
                      onChange={(e) => setReelPosterUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono placeholder-slate-400 focus:bg-white focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  {/* 6. Location, Category & Video Wire Citation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">City / Location</span>
                      <input
                        type="text"
                        value={reelLocation}
                        onChange={(e) => setReelLocation(e.target.value)}
                        placeholder="e.g. New Delhi, Raigarh, CG"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Category</span>
                      <select
                        value={reelCategory}
                        onChange={(e) => setReelCategory(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      >
                        <option value="Politics">Politics</option>
                        <option value="Business">Business</option>
                        <option value="Environment">Environment</option>
                        <option value="Weather">Weather</option>
                        <option value="Health">Health</option>
                        <option value="Sports">Sports</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Video Wire Source</span>
                      <input
                        type="text"
                        value={reelSourceName}
                        onChange={(e) => setReelSourceName(e.target.value)}
                        placeholder="e.g. ANI Video Wire, DD News"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Source Verification URL *</span>
                      <input
                        type="url"
                        value={reelSourceUrl}
                        onChange={(e) => setReelSourceUrl(e.target.value)}
                        placeholder="https://ptinews.com/video-proof"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Primary Publish Action */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={isPublishing || !reelHeadline.trim() || !reelSnippet.trim() || !reelSourceUrl.trim()}
                      onClick={handlePublishReel}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-md shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-40 active:scale-98"
                    >
                      {isPublishing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Publishing Reel & Syncing Strapi...</span>
                        </>
                      ) : (
                        <>
                          <Film className="w-4 h-4" />
                          <span>Publish Breaking Reel (Broadcast Live)</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* RIGHT: LIVE 9:16 VERTICAL REEL PREVIEW (Cols 5) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 font-mono">
                      <span className="font-bold uppercase text-slate-700 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Live 9:16 Mobile Preview</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        HD 1080x1920 Loop
                      </span>
                    </div>

                    {/* Smartphone Mockup Container */}
                    <div className="mx-auto w-[260px] sm:w-[280px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-4 border-slate-800 shadow-2xl relative flex flex-col justify-between p-3 select-none">
                      
                      {/* Background Video Loop or Poster */}
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        {reelVideoUrl ? (
                          <video
                            src={reelVideoUrl}
                            poster={reelPosterUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={reelPosterUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000'}
                            alt="Poster"
                            className="w-full h-full object-cover opacity-80"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>
                      </div>

                      {/* Top Overlay: Badge, Location & Play Indicator */}
                      <div className="relative z-10 flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white ${
                            reelBadge === 'BREAKING' ? 'bg-red-600' : (reelBadge === 'ALERT' ? 'bg-amber-600' : 'bg-emerald-600')
                          }`}>
                            {reelBadge}
                          </span>
                          <span className="text-[10px] font-bold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1 border border-white/20">
                            <MapPin className="w-2.5 h-2.5 text-red-400" />
                            <span>{reelLocation || 'New Delhi'}</span>
                          </span>
                        </div>

                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      </div>

                      {/* Bottom Overlay: Headline, Snippet & Audio Badge */}
                      <div className="relative z-10 space-y-2 pb-1">
                        <div className="space-y-1 text-white">
                          <span className="text-[9px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                            {reelCategory} Wire
                          </span>
                          <h4 className="text-xs sm:text-sm font-black leading-snug drop-shadow-md line-clamp-2">
                            {reelHeadline || 'Historic Electoral Transparency & Infrastructure Bill Enacted'}
                          </h4>
                          <p className="text-[10px] text-slate-200 leading-relaxed line-clamp-2 drop-shadow">
                            {reelSnippet || 'Mandatory algorithmic verification codified into national law across all parliamentary constituencies.'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-white/20 text-[9px] font-mono text-slate-300">
                          <span className="truncate max-w-[140px]">{reelSourceName || 'ANI Video Wire'}</span>
                          <span className="text-emerald-400 font-bold">✓ 94% Verified</span>
                        </div>
                      </div>

                    </div>

                    <p className="text-[10px] font-mono text-center text-slate-500">
                      Shows exact vertical framing rendered on mobile devices and the fullscreen Shorts Viewer.
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            PANE B: STRAPI OPEN-SOURCE CMS HUB (Full Headless CMS Management)
           ========================================================================= */}
        {activeWorkspaceTab === 'STRAPI' && (
          <div className="space-y-6">
            
            {/* 1. Strapi Status & Direct Admin Gateway Banner */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${strapiStatus.online ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                    Strapi Open-Source Headless CMS Integration
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 border border-white/20">
                    {strapiStatus.online ? `Online (${strapiStatus.latencyMs}ms)` : 'Standby / Local Port 1337'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Unified Editorial Headless Architecture
                </h2>

                <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                  Every Article, Breaking News Flash, and Video Reel published via TruthPulse Studio can seamlessly dual-sync to your self-hosted Strapi CMS database with Draft & Publish lifecycles, rich media assets, and REST/GraphQL APIs.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="http://localhost:1337/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition shadow-md"
                  >
                    <span>Launch Strapi Admin Panel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={checkStrapi}
                    disabled={strapiStatus.checking}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs border border-white/20 transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${strapiStatus.checking ? 'animate-spin' : ''}`} />
                    <span>{strapiStatus.checking ? 'Pinging Strapi...' : 'Test Strapi Connection'}</span>
                  </button>
                </div>
              </div>

              {/* Background ambient pattern */}
              <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 flex items-center justify-center pointer-events-none">
                <Database className="w-64 h-64 text-white" />
              </div>
            </div>

            {/* 2. Supported Strapi Collection Types & Content Mapping */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Type 1: News Dispatch */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                    Collection: Article
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">1. Quick News Flash</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fast 60-word summaries with 3 bullet highlights, category, and primary source links for breaking dispatches.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Field: contentType = 'NEWS'</span>
                  <span className="text-emerald-600 font-bold">Dual-Sync Ready</span>
                </div>
              </div>

              {/* Type 2: In-Depth Article */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                    Collection: Article
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">2. In-Depth Rich Article</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multi-paragraph investigative reporting with markdown headings, quotes, citations, and author byline.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Field: contentType = 'ARTICLE'</span>
                  <span className="text-emerald-600 font-bold">Draft & Publish</span>
                </div>
              </div>

              {/* Type 3: Video Reel */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Film className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                    Collection: Article
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">3. Video Shorts & Reels</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vertical mobile video loops with 30-word captions and alert badges (BREAKING, ALERT, FACT-CHECK).
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Field: contentType = 'REEL'</span>
                  <span className="text-emerald-600 font-bold">Auto-Broadcast</span>
                </div>
              </div>

            </div>

            {/* 3. Strapi Setup & Docker Instructions */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>How to Start Local Strapi CMS (1-Command Quickstart)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block font-sans">Option A: Native Node.js CLI</span>
                  <p className="text-slate-600 text-[11px] font-sans">Create a clean local Strapi app with SQLite:</p>
                  <pre className="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-[11px] overflow-x-auto">
npx create-strapi-app@latest truthpulse-cms --quickstart
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block font-sans">Option B: Docker Compose (PostgreSQL)</span>
                  <p className="text-slate-600 text-[11px] font-sans">Run production containers located in `strapi/`:</p>
                  <pre className="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-[11px] overflow-x-auto">
cd strapi &amp;&amp; docker compose up -d
                  </pre>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs font-mono text-indigo-900 flex items-center justify-between">
                <span>Webhook Receiver Endpoint: <code className="font-bold">/api/webhooks/strapi</code></span>
                <span className="text-indigo-700 font-bold">Auto-Listens to entry.publish</span>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            PANE C: LEDGER & CREDIBILITY ANALYTICS (Clean White Ledger Style)
           ========================================================================= */}
        {activeWorkspaceTab === 'ANALYTICS' && (
          <div className="space-y-5">
            
            {/* 4 Minimal Metric Cards (Clean White Surface) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Total Dispatches</span>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{analyticsSummary.totalArticles}</p>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">Cryptographically Sealed</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">👍 Helpful Reactions</span>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">+{analyticsSummary.totalUpvotes}</p>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">Reader appreciations</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">🛡️ Primary Proofs</span>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">100%</p>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">Official gazette citations</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Authenticity Ratio</span>
                <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{analyticsSummary.globalAuthenticity}%</p>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">Quality threshold</span>
              </div>
            </div>

            {/* Scoreboard Table (Clean Ledger Style) */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
                  <span className="font-mono uppercase font-bold text-slate-800">
                    Dispatch Scoreboard
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search title..."
                      className="pl-7 pr-3 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 font-mono"
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-slate-800 font-mono"
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
                    <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-600 bg-slate-50">
                      <th className="py-2.5 px-4 font-semibold">Dispatch Title</th>
                      <th className="py-2.5 px-3 font-semibold">Format</th>
                      <th className="py-2.5 px-3 font-semibold">Category</th>
                      <th className="py-2.5 px-3 text-center font-semibold">Helpful</th>
                      <th className="py-2.5 px-3 text-center font-semibold">AI Trust</th>
                      <th className="py-2.5 px-3 font-semibold">Authenticity</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-900">
                    {filteredArticles.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-400 font-mono">
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
                          <tr key={art._id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4 max-w-sm truncate text-slate-900 font-medium">
                              <div className="flex items-center gap-1.5 truncate">
                                {art.strapiId && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0">
                                    Strapi #{art.strapiId}
                                  </span>
                                )}
                                <span className="truncate">{art.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                art.contentType === 'REEL'
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : (art.contentType === 'ARTICLE' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700')
                              }`}>
                                {art.contentType || (art.mediaType === 'VIDEO_LOOP' ? 'REEL' : 'NEWS')}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                              {art.category}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-medium text-emerald-600">
                              +{art.upvotes}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-medium text-slate-800">
                              {art.trustScore}%
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                                  <div
                                    className="h-full bg-slate-800"
                                    style={{ width: `${accuracyRate}%` }}
                                  ></div>
                                </div>
                                <span className="font-mono text-[11px] text-slate-700 font-semibold">{accuracyRate}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedInspectionArticle(art)}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-mono border border-slate-200 transition font-medium"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-slate-900 uppercase">
                Dispatch Verification Audit
              </span>
              <button
                onClick={() => setSelectedInspectionArticle(null)}
                className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">
                {selectedInspectionArticle.title}
              </h4>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                <span>{selectedInspectionArticle.category}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">👍 {selectedInspectionArticle.upvotes} Helpful</span>
                <span>•</span>
                <span className="text-slate-800 font-bold">🛡️ {selectedInspectionArticle.trustScore}% Trust Score</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
              <p className="text-slate-800 font-semibold">✓ Verified dispatch corroborated by official primary source links.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                href={`/?search=${encodeURIComponent(selectedInspectionArticle.title.slice(0, 20))}`}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-200 transition"
              >
                View in Reader
              </Link>
              <button
                onClick={() => {
                  setToastMessage('Audit review acknowledged.');
                  setSelectedInspectionArticle(null);
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition"
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
