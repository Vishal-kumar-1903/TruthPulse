'use client';

import React from 'react';
import { ExternalLink, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';

export interface SponsoredPartner {
  id: string;
  tag: string;
  partnerName: string;
  badge: string;
  title: string;
  description: string;
  actionText: string;
  actionUrl: string;
  metric: string;
  metricLabel: string;
}

export const DEFAULT_PARTNER_CARDS: SponsoredPartner[] = [
  {
    id: 'partner-1',
    tag: 'SUSTAINABILITY & CLEAN TECH',
    partnerName: 'Chhattisgarh Renewable Power Corp',
    badge: 'State Certified Partner',
    title: 'Rooftop Solar Subsidy & Microgrid Onboarding 2026',
    description: 'Hyper-local clean energy transition fund: Up to 60% grant for residential and industrial solar installations across Raigarh, Raipur, and Bilaspur industrial belts.',
    actionText: 'Check Subsidy Eligibility',
    actionUrl: 'https://creda.cg.gov.in',
    metric: '₹78,000',
    metricLabel: 'Avg Annual Savings'
  },
  {
    id: 'partner-2',
    tag: 'CIVIC TRANSPARENCY',
    partnerName: 'Open Civic Data Alliance',
    badge: 'Non-Profit Partner',
    title: 'Public Infrastructure Budget Tracker for Municipal Wards',
    description: 'Inspect real-time fund allocations, contractor completion timelines, and road audit scores for municipal corporations across Maharashtra and Chhattisgarh.',
    actionText: 'Audit Ward Expenditures',
    actionUrl: 'https://data.gov.in',
    metric: '99.8%',
    metricLabel: 'Audited Accuracy'
  }
];

interface NativeSponsoredCardProps {
  partner?: SponsoredPartner;
}

export default function NativeSponsoredCard({ partner = DEFAULT_PARTNER_CARDS[0] }: NativeSponsoredCardProps) {
  return (
    <div className="my-6 relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-900/10 via-slate-900/40 to-slate-900/80 p-6 sm:p-7 shadow-sm font-sans backdrop-blur-sm transition-all hover:border-blue-500/50">
      
      {/* Subtle background glow */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>{partner.tag}</span>
          </span>
          <span className="text-xs font-semibold text-slate-400">
            by <strong className="text-slate-200">{partner.partnerName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>{partner.badge}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-3 space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
            {partner.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {partner.description}
          </p>
        </div>

        {/* Metric & CTA button */}
        <div className="flex md:flex-col items-center justify-between md:justify-center p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50 text-center gap-2">
          <div>
            <div className="text-lg font-black text-cyan-400 font-mono tracking-tight">
              {partner.metric}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {partner.metricLabel}
            </div>
          </div>

          <a
            href={partner.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20"
          >
            <span>{partner.actionText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
        <span>Non-tracking native card • Verified civic/enterprise partner • Ad-blocker immune</span>
        <span>ID: {partner.id}</span>
      </div>

    </div>
  );
}
