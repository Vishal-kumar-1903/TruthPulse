'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  List, 
  X, 
  Share2, 
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Sparkles,
  Download,
  Bookmark,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { FALLBACK_ARTICLES } from '@/lib/fallbackArticles';
import { ArticleItem } from './NewsCard';

export interface MagazinePage {
  pageNumber: number;
  section: string;
  headline: string;
  kicker: string;
  leadArticle: ArticleItem;
  sidebarStory?: ArticleItem;
  editorialPullQuote?: string;
  factAuditBox?: {
    claim: string;
    verdict: string;
    source: string;
  };
}

export interface MagazineEdition {
  id: string;
  title: string;
  subtitle: string;
  issueVolume: string;
  date: string;
  coverImage: string;
  leadStoryTitle: string;
  pages: MagazinePage[];
}

export const MAGAZINE_EDITIONS: MagazineEdition[] = [
  {
    id: 'national-digest',
    title: 'TruthPulse National Digest',
    subtitle: 'The Weekly Verifiable Journal of Governance, Law & Civil Liberties',
    issueVolume: 'Vol. 14 • Issue 42',
    date: 'Week of October 24, 2026',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1600&q=80',
    leadStoryTitle: 'Parliament Clears Historic Digital Public Infrastructure & Electoral Transparency Bill',
    pages: [
      {
        pageNumber: 1,
        section: 'COVER STORY • DEMOCRACY & LAW',
        headline: 'Parliament Mandates Real-Time Algorithmic Disclosures For All State Polls',
        kicker: 'LANDMARK LEGISLATIVE MILESTONE',
        leadArticle: FALLBACK_ARTICLES[0],
        sidebarStory: FALLBACK_ARTICLES[2],
        editorialPullQuote: '“Electoral confidence is no longer sustained by proclamations; it demands continuous algorithmic verification anchored to public treasury records.”',
        factAuditBox: {
          claim: 'Are all state assembly constituency registers subject to real-time treasury auditing?',
          verdict: 'STATUTORY CONFIRMED (Section 4(2) of DPI Act, 2026)',
          source: 'The Gazette of India Extraordinary Part II'
        }
      },
      {
        pageNumber: 2,
        section: 'BUSINESS & SOVEREIGN FINANCE',
        headline: 'Sensex Scaled 780 Points as Manufacturing PMI Reaches 16-Year Apex of 59.4',
        kicker: 'INDUSTRIAL PULSE',
        leadArticle: FALLBACK_ARTICLES[3],
        sidebarStory: FALLBACK_ARTICLES[4],
        editorialPullQuote: '“The velocity of domestic capital expenditure reflects unprecedented technological absorption across industrial corridors.”',
        factAuditBox: {
          claim: 'Has foreign institutional net inflow exceeded ₹4,800 crore in single session?',
          verdict: 'VERIFIED ON RBI SETTLEMENT LEDGER',
          source: 'Reserve Bank of India Monetary Bulletin'
        }
      },
      {
        pageNumber: 3,
        section: 'SPECIAL INVESTIGATION • VIRAL DEBUNKS',
        headline: 'Anatomy of a Disinformation Campaign: The Mineral Water Prohibition Myth',
        kicker: 'TRUTHPULSE FORENSIC AUDIT',
        leadArticle: FALLBACK_ARTICLES[14],
        sidebarStory: FALLBACK_ARTICLES[12],
        editorialPullQuote: '“Rumors spread at 6x the velocity of truth on instant messaging; algorithmic deterrence is our civic antidote.”',
        factAuditBox: {
          claim: 'Did statutory food safety regulators order a bottled water packaging embargo?',
          verdict: 'FABRICATED SOCIAL FORWARD REFUTED',
          source: 'Food Safety and Standards Authority of India (FSSAI)'
        }
      }
    ]
  },
  {
    id: 'chhattisgarh-special',
    title: 'Chhattisgarh & Central India Special',
    subtitle: 'Ground Investigations from Bastar to Raigarh Industrial Corridors',
    issueVolume: 'Vol. 08 • State Edition',
    date: 'Special Edition 2026',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
    leadStoryTitle: 'Chhattisgarh Cabinet Approves ₹1,420 Cr Agro-Solar Electrification for 1.8 Lakh Farmers',
    pages: [
      {
        pageNumber: 1,
        section: 'AGRARIAN TRANSITION • RAIPUR / RAIGARH',
        headline: '90% Capital Grants Sanctioned For Solar Irrigation Across Tribal Belts',
        kicker: 'ENERGY INDEPENDENCE',
        leadArticle: FALLBACK_ARTICLES[1],
        sidebarStory: FALLBACK_ARTICLES[9],
        editorialPullQuote: '“Decentralized solar sets immunize marginal cultivators against peak tariff shocks while recharging local water tables.”',
        factAuditBox: {
          claim: 'Are smallholder farmers in Raigarh eligible for 90% capital pump subsidies?',
          verdict: 'CONFIRMED BY CREDA DIRECTIVE',
          source: 'Chhattisgarh Renewable Energy Development Agency'
        }
      },
      {
        pageNumber: 2,
        section: 'CIVIC HEALTH COMMAND • DISTRICT RAIGARH',
        headline: 'Raigarh District Hospital Pioneers 24x7 High-Precision Tele-ICU Spoke Network',
        kicker: 'RURAL LIFE-SAVING TECH',
        leadArticle: FALLBACK_ARTICLES[13],
        editorialPullQuote: '“Zero rural patients should succumb to emergency triage delays due to geographic isolation.”',
        factAuditBox: {
          claim: 'How many primary health centers are linked to Raigarh Civil Hospital Tele-ICU?',
          verdict: '14 COMMUNITY HEALTH CENTERS ACTIVE',
          source: 'Raigarh Collectorate & CMHO Telemetry Registry'
        }
      }
    ]
  },
  {
    id: 'deeptech-markets',
    title: 'Tech, Sovereign AI & Markets',
    subtitle: 'Bengaluru Silicon, Quantum Compute & Central Bank Digital Rupee',
    issueVolume: 'Vol. 03 • DeepTech Focus',
    date: 'Q4 2026 Special',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80',
    leadStoryTitle: 'Bengaluru DeepTech Secures $4.2B Sovereign AI & Quantum Compute Capital',
    pages: [
      {
        pageNumber: 1,
        section: 'FRONTIER TECH • BENGALURU SILICON',
        headline: '$4.2 Billion Venture Influx Accelerates India’s Quantum Chip Supremacy',
        kicker: 'SOVEREIGN HARDWARE',
        leadArticle: FALLBACK_ARTICLES[4],
        sidebarStory: FALLBACK_ARTICLES[5],
        editorialPullQuote: '“Owning the neural semiconductor stack is as vital to national sovereignty as defending territorial borders.”',
        factAuditBox: {
          claim: 'Are university researchers granted free compute access on Karnataka supercomputer?',
          verdict: 'OFFICIAL KITS DIRECTIVE ACTIVE',
          source: 'Karnataka Innovation & Technology Society'
        }
      }
    ]
  }
];

export default function MagazineViewer() {
  const [selectedEditionId, setSelectedEditionId] = useState('national-digest');
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // 0 = Cover, 1+ = Pages
  const [zoomLevel, setZoomLevel] = useState<100 | 115 | 130>(100);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isPageFlipping, setIsPageFlipping] = useState(false);

  const currentEdition = MAGAZINE_EDITIONS.find(e => e.id === selectedEditionId) || MAGAZINE_EDITIONS[0];
  const totalPages = currentEdition.pages.length; // excluding cover

  // Keyboard Navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        flipPrev();
      } else if (e.key === 'Escape') {
        setIsTocOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, totalPages]);

  const flipNext = () => {
    if (currentPageIndex < totalPages) {
      triggerFlipAnimation();
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const flipPrev = () => {
    if (currentPageIndex > 0) {
      triggerFlipAnimation();
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const triggerFlipAnimation = () => {
    setIsPageFlipping(true);
    setTimeout(() => setIsPageFlipping(false), 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-serif selection:bg-amber-600 selection:text-white">
      
      {/* 1. TOP EDITORIAL TOOLBAR */}
      <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 px-4 py-3 flex items-center justify-between text-xs font-sans">
        
        {/* Left: Back to Live Feed + Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition active:scale-95 text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Live Feed</span>
          </Link>

          <div className="h-4 w-px bg-stone-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="font-bold text-white tracking-wide">TruthPulse E-Paper</span>
            <span className="hidden md:inline text-[11px] font-mono text-stone-400">
              • Digital Magazine Flipbook
            </span>
          </div>
        </div>

        {/* Center: Edition Switcher Pills */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl">
          {MAGAZINE_EDITIONS.map((ed) => (
            <button
              key={ed.id}
              onClick={() => {
                setSelectedEditionId(ed.id);
                setCurrentPageIndex(0);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedEditionId === ed.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              {ed.title.replace('TruthPulse ', '')}
            </button>
          ))}
        </div>

        {/* Right: Tools (TOC, Zoom, Print, Page counter) */}
        <div className="flex items-center gap-2">
          {/* Mobile Edition selector */}
          <select
            value={selectedEditionId}
            onChange={(e) => {
              setSelectedEditionId(e.target.value);
              setCurrentPageIndex(0);
            }}
            className="lg:hidden bg-stone-800 border border-stone-700 text-stone-200 rounded-lg px-2 py-1 text-xs"
          >
            {MAGAZINE_EDITIONS.map(ed => (
              <option key={ed.id} value={ed.id}>
                {ed.title.replace('TruthPulse ', '')}
              </option>
            ))}
          </select>

          {/* Table of Contents Button */}
          <button
            onClick={() => setIsTocOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition"
            title="Table of Contents"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Index</span>
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700">
            <button
              onClick={() => setZoomLevel(prev => prev === 130 ? 115 : (prev === 115 ? 100 : 100))}
              disabled={zoomLevel === 100}
              className="p-1 text-stone-400 hover:text-white disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-stone-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => prev === 100 ? 115 : (prev === 115 ? 130 : 130))}
              disabled={zoomLevel === 130}
              className="p-1 text-stone-400 hover:text-white disabled:opacity-30"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Print / Download Button */}
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>

      </header>

      {/* 2. TABLE OF CONTENTS DRAWER */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-stone-900 border-l border-stone-800 p-6 flex flex-col justify-between font-sans">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-white text-base">Table of Contents</h3>
                </div>
                <button
                  onClick={() => setIsTocOpen(false)}
                  className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setCurrentPageIndex(0);
                    setIsTocOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between ${
                    currentPageIndex === 0
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-stone-800/60 hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  <span className="text-xs">Front Cover & Editorial Masthead</span>
                  <span className="text-[10px] font-mono opacity-70">Cover</span>
                </button>

                {currentEdition.pages.map((p, idx) => (
                  <button
                    key={p.pageNumber}
                    onClick={() => {
                      setCurrentPageIndex(idx + 1);
                      setIsTocOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 ${
                      currentPageIndex === idx + 1
                        ? 'bg-red-600 text-white'
                        : 'bg-stone-800/60 hover:bg-stone-800 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-red-400 opacity-90 uppercase">
                      <span>{p.section}</span>
                      <span>Page {p.pageNumber}</span>
                    </div>
                    <span className="text-xs font-bold line-clamp-2">{p.headline}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-500 font-mono">
              Use ← / → keys or buttons to flip pages.
            </div>
          </div>
        </div>
      )}

      {/* 3. FLIPBOOK READING ARENA */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto">
        <div 
          className="w-full max-w-5xl transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* MAGAZINE SPREAD CONTAINER (With Paper Texture & Soft Elevation Shadows) */}
          <div 
            className={`relative bg-[#fdfbf7] text-stone-900 rounded-2xl shadow-2xl overflow-hidden border border-stone-200 transition-all duration-400 min-h-[640px] sm:min-h-[720px] flex flex-col ${
              isPageFlipping ? 'opacity-85 scale-[0.99] rotate-y-3' : 'opacity-100 scale-100'
            }`}
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(0, 0, 0, 0.03)'
            }}
          >
            {/* Page Crease spine effect in center on desktop */}
            <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 pointer-events-none hidden md:block bg-gradient-to-r from-black/5 via-black/15 to-transparent blur-[1px]" />

            {/* A. FRONT COVER VIEW (When currentPageIndex === 0) */}
            {currentPageIndex === 0 ? (
              <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative overflow-hidden bg-gradient-to-b from-[#1a1816] via-[#24211e] to-[#0f0e0d] text-white">
                {/* Background Artwork */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity filter blur-[1px]"
                  style={{ backgroundImage: `url(${currentEdition.coverImage})` }}
                />

                {/* Cover Top Header / Masthead */}
                <div className="relative z-10 border-b-2 border-red-600 pb-4">
                  <div className="flex items-center justify-between text-xs font-sans tracking-widest uppercase text-stone-400 mb-2">
                    <span>{currentEdition.issueVolume}</span>
                    <span>{currentEdition.date}</span>
                    <span>₹25 • Digital Issue</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-white font-serif">
                    Truth<span className="text-red-500">Pulse</span>
                  </h1>
                  <p className="text-xs sm:text-sm font-sans uppercase tracking-widest text-stone-300 mt-1">
                    {currentEdition.subtitle}
                  </p>
                </div>

                {/* Cover Center Headline */}
                <div className="relative z-10 my-10 sm:my-14 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-sans text-xs uppercase tracking-wider font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Special Investigative Cover Report</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-serif drop-shadow-md">
                    {currentEdition.leadStoryTitle}
                  </h2>

                  <p className="text-sm sm:text-base text-stone-300 font-sans leading-relaxed line-clamp-3">
                    Exclusive statutory breakdown: How newly enacted democratic registries link real-time polling data directly with sovereign treasury logs across 28 states.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={flipNext}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-sans font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition active:scale-95"
                    >
                      <span>Open Issue (Page 1)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Cover Footer & Barcode Seal */}
                <div className="relative z-10 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-sans text-stone-400">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="font-bold text-stone-200">Cryptographically Sealed Editorial Edition</div>
                      <div className="text-[10px] font-mono">SHA-256: 7f8b91a2c3... verified via Gazette RAG</div>
                    </div>
                  </div>

                  <div className="hidden sm:block text-right font-mono text-[11px]">
                    <div>PRINT ISSN 2940-1928</div>
                    <div className="tracking-widest">||| | |||| || ||| |||||</div>
                  </div>
                </div>
              </div>
            ) : (
              /* B. EDITORIAL INNER PAGES VIEW */
              (() => {
                const page = currentEdition.pages[currentPageIndex - 1];
                if (!page) return null;

                return (
                  <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 font-serif text-stone-900">
                    
                    {/* Page Header */}
                    <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900 text-xs font-sans uppercase tracking-wider">
                      <span className="font-bold text-red-700">{page.section}</span>
                      <span className="font-mono text-stone-500">
                        TruthPulse • {currentEdition.date}
                      </span>
                      <span className="font-mono font-bold">Page {page.pageNumber} of {totalPages}</span>
                    </div>

                    {/* Headline Banner */}
                    <div className="my-6 space-y-2">
                      <span className="text-[11px] font-sans uppercase tracking-widest font-black text-red-600 block">
                        {page.kicker}
                      </span>
                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-950 leading-tight">
                        {page.headline}
                      </h2>
                      <div className="text-xs font-sans text-stone-500 flex items-center gap-3 pt-1">
                        <span>By <strong>{page.leadArticle.author || 'TruthPulse Bureau'}</strong></span>
                        <span>•</span>
                        <span>Location: <strong>{page.leadArticle.state || 'National'}, India</strong></span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Trust Score: {page.leadArticle.trustScore}%
                        </span>
                      </div>
                    </div>

                    {/* 2-Column Editorial Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto items-start">
                      
                      {/* Left Column (Main Article Text) */}
                      <div className="md:col-span-7 space-y-4 text-sm sm:text-base leading-relaxed text-stone-800 text-justify">
                        <p className="first-letter:float-left first-letter:text-5xl first-letter:font-black first-letter:font-serif first-letter:mr-3 first-letter:leading-none first-letter:text-red-700">
                          {page.leadArticle.summary}
                        </p>

                        {page.leadArticle.content && (
                          <p className="leading-relaxed">
                            {page.leadArticle.content}
                          </p>
                        )}

                        {page.leadArticle.bullets && page.leadArticle.bullets.length > 0 && (
                          <div className="p-4 bg-stone-100 rounded-xl border-l-4 border-red-600 font-sans text-xs space-y-2 my-4">
                            <strong className="text-stone-950 uppercase tracking-wider block text-[11px]">
                              Statutory Core Takeaways:
                            </strong>
                            <ul className="list-disc pl-4 space-y-1 text-stone-700">
                              {page.leadArticle.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Right Column (Pull-Quote + Fact Audit Box + Media) */}
                      <div className="md:col-span-5 space-y-6">
                        {/* Pull-Quote */}
                        {page.editorialPullQuote && (
                          <blockquote className="p-5 bg-amber-50/80 border-y-2 border-amber-600/40 text-stone-900 font-serif italic text-base sm:text-lg leading-snug">
                            {page.editorialPullQuote}
                          </blockquote>
                        )}

                        {/* High-Res Featured Image */}
                        {page.leadArticle.imageUrl && (
                          <div className="rounded-xl overflow-hidden border border-stone-200 shadow-md">
                            <img
                              src={page.leadArticle.imageUrl}
                              alt={page.leadArticle.title}
                              className="w-full h-44 sm:h-52 object-cover"
                            />
                            <div className="p-2 bg-stone-100 font-sans text-[10px] text-stone-500 text-center">
                              Official Press Telephoto • Cryptographically Verified Camera Sensor
                            </div>
                          </div>
                        )}

                        {/* Statutory Fact-Check Box */}
                        {page.factAuditBox && (
                          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl font-sans text-xs space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-800 uppercase tracking-wide text-[10px]">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>TruthPulse Fact Verification</span>
                            </div>
                            <div className="text-stone-800 font-medium">
                              {page.factAuditBox.claim}
                            </div>
                            <div className="font-bold text-emerald-700 text-xs">
                              {page.factAuditBox.verdict}
                            </div>
                            <div className="text-[10px] text-stone-500 font-mono">
                              Citation: {page.factAuditBox.source}
                            </div>
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Page Footer */}
                    <div className="pt-4 mt-6 border-t border-stone-200 flex items-center justify-between text-xs font-sans text-stone-500">
                      <span>TruthPulse Editorial Board • Verified Journalism</span>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/?search=${encodeURIComponent(page.leadArticle.title.slice(0, 20))}`}
                          className="text-red-700 hover:underline font-bold text-xs"
                        >
                          View Full Discussion on Portal →
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })()
            )}

          </div>

          {/* 4. FLIP NAVIGATION BAR (Bottom Page Swapper) */}
          <div className="mt-4 flex items-center justify-between px-2 font-sans text-xs">
            <button
              onClick={flipPrev}
              disabled={currentPageIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold disabled:opacity-30 disabled:pointer-events-none transition active:scale-95 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-stone-400">
                {currentPageIndex === 0 ? 'Cover' : `Page ${currentPageIndex} / ${totalPages}`}
              </span>

              {/* Dot indicators */}
              <div className="flex items-center gap-1 ml-3">
                <span
                  onClick={() => setCurrentPageIndex(0)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition ${
                    currentPageIndex === 0 ? 'bg-red-500 w-4' : 'bg-stone-700 hover:bg-stone-500'
                  }`}
                  title="Cover"
                />
                {currentEdition.pages.map((_, idx) => (
                  <span
                    key={idx}
                    onClick={() => setCurrentPageIndex(idx + 1)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition ${
                      currentPageIndex === idx + 1 ? 'bg-red-500 w-4' : 'bg-stone-700 hover:bg-stone-500'
                    }`}
                    title={`Page ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={flipNext}
              disabled={currentPageIndex >= totalPages}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold disabled:opacity-30 disabled:pointer-events-none transition active:scale-95 shadow-md shadow-red-600/20"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}
