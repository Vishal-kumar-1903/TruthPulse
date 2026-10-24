'use client';

import React, { useState } from 'react';
import { ExternalLink, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';

export interface SponsoredAdItem {
  id: string;
  brand: string;
  title: string;
  tagline: string;
  category: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  isGovernmentOrCivic?: boolean;
}

export const SPONSORED_ADS: SponsoredAdItem[] = [
  {
    id: 'ad-pm-surya-ghar',
    brand: 'PM Surya Ghar Muft Bijli Yojana',
    title: 'Up to ₹78,000 Direct Central Subsidy for Rooftop Solar',
    tagline: 'CREDA & MNRE verified clean solar irrigation & residential transition.',
    category: 'GREEN ENERGY',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80',
    ctaText: 'Check Subsidy Eligibility',
    ctaUrl: 'https://pmsuryaghar.gov.in',
    isGovernmentOrCivic: true
  },
  {
    id: 'ad-bharat-semiconductor',
    brand: 'India Semiconductor Mission',
    title: 'Sovereign Fab Facilities & 50% Capital Support for Chip Design',
    tagline: 'Accelerating Indian neural silicon, RISC-V compute, and quantum R&D.',
    category: 'SOVEREIGN TECH',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    ctaText: 'View R&D Grants',
    ctaUrl: 'https://ism.gov.in',
    isGovernmentOrCivic: true
  },
  {
    id: 'ad-kavach-railways',
    brand: 'Kavach 4.0 Telemetry',
    title: 'Indigenous Automatic Train Collision Avoidance Grid Deployed',
    tagline: 'High-precision RFID & LTE-R braking protocol scaling across 10,000 km tracks.',
    category: 'NATIONAL INFRA',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
    ctaText: 'Explore Safety Audit',
    ctaUrl: 'https://indianrailways.gov.in',
    isGovernmentOrCivic: true
  },
  {
    id: 'ad-upi-lite-wallet',
    brand: 'NPCI UPI-Lite Offline',
    title: 'Zero-Fail Transactions: Instant Offline Micropayments up to ₹500',
    tagline: 'Supported across all scheduled commercial bank UPI rails.',
    category: 'DIGITAL RUPEE',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    ctaText: 'Enable UPI-Lite',
    ctaUrl: 'https://npci.org.in',
    isGovernmentOrCivic: true
  },
  {
    id: 'ad-fssai-organic',
    brand: 'Jaivik Bharat FSSAI',
    title: '100% Certified Organic & Chemical-Free Agro Marketplace',
    tagline: 'QR-coded batch testing verifying zero pesticide residue for farmer collectives.',
    category: 'AGRO SAFETY',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    ctaText: 'Verify QR Standard',
    ctaUrl: 'https://jaivikbharat.fssai.gov.in',
    isGovernmentOrCivic: true
  }
];

export default function AdSidebar() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate array for seamless infinite vertical translation loop
  const duplicatedAds = [...SPONSORED_ADS, ...SPONSORED_ADS];

  return (
    <aside className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 flex flex-col overflow-hidden font-sans">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Sponsored Insights
          </h3>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
          Partner Wire
        </span>
      </div>

      {/* Infinite Vertical Scroll Container (650px height) */}
      <div 
        className="relative h-[650px] overflow-hidden rounded-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Soft Fade Masking on Top and Bottom */}
        <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

        {/* Continuous Smooth Animation Track */}
        <div 
          className={`space-y-4 ${isPaused ? '' : 'animate-vertical-marquee'}`}
          style={{
            animationDuration: '32s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite'
          }}
        >
          {duplicatedAds.map((ad, idx) => (
            <div
              key={`${ad.id}-${idx}`}
              className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              {/* Media Image */}
              <div className="relative h-32 w-full rounded-lg overflow-hidden mb-2.5">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm text-[9px] font-mono font-bold text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{ad.category}</span>
                </div>
              </div>

              {/* Text Anatomy */}
              <div className="space-y-1 mb-3">
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase truncate">
                  {ad.brand}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                  {ad.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                  {ad.tagline}
                </p>
              </div>

              {/* Action Button */}
              <a
                href={ad.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-white border border-amber-500/30 font-bold text-[11px] transition-all"
              >
                <span>{ad.ctaText}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center font-mono">
        Ethical Sponsorships • Pause on hover
      </div>
    </aside>
  );
}
