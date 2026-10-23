'use client';

import React, { useState } from 'react';
import { 
  Rss, 
  Bot, 
  Cpu, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  RefreshCw,
  ExternalLink,
  Layers,
  AlertCircle
} from 'lucide-react';

export interface WireItem {
  id: string;
  source: 'ANI' | 'PTI' | 'Reuters' | 'BBC' | 'PIB';
  headline: string;
  rawSnippet: string;
  url: string;
  timestamp: string;
  suggestedRegion: string;
}

const SAMPLE_WIRE_FEED: WireItem[] = [
  {
    id: 'wire-101',
    source: 'PTI',
    headline: 'Chhattisgarh Industrial Air Monitoring Grid Activated Across Raigarh and Korba Belts',
    rawSnippet: 'The State Pollution Control Board has deployed 18 IoT continuous particulate matter monitors along industrial corridors in Raigarh and Korba. Real-time AQI feeds will be published directly to public portals.',
    url: 'https://ptinews.com/wire/raigarh-air-grid-2026',
    timestamp: '12 mins ago',
    suggestedRegion: 'Raigarh, Chhattisgarh'
  },
  {
    id: 'wire-102',
    source: 'ANI',
    headline: 'Raipur AI Innovation Hub Inks Sovereign Compute Partnership for Smart Agriculture',
    rawSnippet: 'Raipur tech summit concluded today with a signed MoU between the state government and open-source compute consortiums. The project will provide precision meteorological advisory to 3.2 lakh farmers across Central India.',
    url: 'https://aninews.in/news/national/raipur-tech-summit-2026',
    timestamp: '28 mins ago',
    suggestedRegion: 'Raipur, Chhattisgarh'
  },
  {
    id: 'wire-103',
    source: 'Reuters',
    headline: 'International Climate Adaptation Pact Finalized in Geneva with Fast-Track Urban Fund',
    rawSnippet: 'Representatives from 64 nations ratified the multilateral climate resilience charter at the United Nations complex in Geneva. A dedicated 12 billion dollar rapid response fund has been allocated for vulnerable municipal coastal corridors.',
    url: 'https://reuters.com/sustainability/geneva-climate-pact-2026',
    timestamp: '45 mins ago',
    suggestedRegion: 'Geneva, Switzerland (International)'
  },
  {
    id: 'wire-104',
    source: 'BBC',
    headline: 'Indian Railways Inaugurates High-Speed Freight Corridor Linking Delhi and Mumbai',
    rawSnippet: 'The Western Dedicated Freight Corridor entered full commercial operation this morning. Cargo transit durations between Mumbai port terminals and National Capital Region logistics hubs have been reduced from 52 hours to 19 hours.',
    url: 'https://bbc.com/news/world-asia-india-freight-corridor-2026',
    timestamp: '1 hour ago',
    suggestedRegion: 'Delhi - Mumbai (National)'
  }
];

interface AutoDraftQueueProps {
  onAdoptToEditor: (synthesizedDraft: any) => void;
}

export default function AutoDraftQueue({ onAdoptToEditor }: AutoDraftQueueProps) {
  const [wireFeeds, setWireFeeds] = useState<WireItem[]>(SAMPLE_WIRE_FEED);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [pipelineResult, setPipelineResult] = useState<{ [id: string]: any }>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleRunAgentPipeline = async (item: WireItem) => {
    setProcessingId(item.id);
    setStatusMessage(`Multi-Agent Pipeline triggered for: "${item.headline.slice(0, 45)}..."`);

    try {
      const res = await fetch('/api/agents/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: item.headline,
          rawText: item.rawSnippet,
          sourceUrl: item.url,
          sourceName: item.source
        })
      });

      const data = await res.json();
      if (data.success) {
        setPipelineResult((prev) => ({
          ...prev,
          [item.id]: data.agentPipeline
        }));
        setStatusMessage(`✅ Pipeline completed for ${item.source} wire! Trust score: ${data.agentPipeline.bot4VerificationAuditor.trustScore}%`);
      } else {
        setStatusMessage(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMessage(`❌ Execution failed: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleTransferToEditor = (item: WireItem) => {
    const pipe = pipelineResult[item.id];
    if (pipe) {
      onAdoptToEditor({
        title: pipe.bot1AutoScout?.primaryHeadline || item.headline,
        summary: pipe.bot3NeuralSynthesizer?.summary || item.rawSnippet,
        bullets: pipe.bot3NeuralSynthesizer?.bullets || [
          item.rawSnippet.slice(0, 60),
          'Verified by multi-agent ingestion workflow.',
          `Primary wire attribution: ${item.source}`
        ],
        content: `${item.rawSnippet}\n\n[Synthesized via Autonomous Pipeline from ${item.source}]`,
        location: pipe.bot2GeoTagger?.location || { regionType: 'STATE', state: 'Chhattisgarh', city: 'Raigarh' },
        sources: pipe.bot1AutoScout?.sourcesExtracted || [{ name: item.source, url: item.url, stance: 'CORROBORATING' }],
        trustScore: pipe.bot4VerificationAuditor?.trustScore || 85,
        category: 'Development & Policy'
      });
    } else {
      // Basic transfer without pipeline pre-run
      onAdoptToEditor({
        title: item.headline,
        summary: item.rawSnippet,
        bullets: [item.rawSnippet.slice(0, 80), 'Wire source pending verification.'],
        content: item.rawSnippet,
        location: { regionType: 'STATE', state: 'Chhattisgarh', city: 'Raigarh' },
        sources: [{ name: item.source, url: item.url, stance: 'CORROBORATING' }],
        trustScore: 82,
        category: 'General'
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl font-sans text-white">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Rss className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Bot 1 (Auto-Scout) Wire Feeds & Auto-Draft Queue
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              LIVE INGESTION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulated high-frequency wires (ANI, PTI, Reuters, BBC). Run autonomous pipeline (Bots 1-4) to cluster, geo-tag, synthesize 60-80w summaries, and calculate Trust Score.
          </p>
        </div>

        <button
          onClick={() => {
            setStatusMessage('Re-polling RSS wire sources...');
            setTimeout(() => setStatusMessage('4 incoming wires synchronized.'), 800);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Influx</span>
        </button>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className="mb-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2 animate-fadeIn">
          <Cpu className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Wire List */}
      <div className="space-y-4">
        {wireFeeds.map((item) => {
          const isProcessing = processingId === item.id;
          const pipe = pipelineResult[item.id];

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
            >
              
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                    {item.source}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" /> {item.suggestedRegion}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">• {item.timestamp}</span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                >
                  <span>Wire Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <h4 className="text-sm font-bold text-slate-100 mb-2">
                {item.headline}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {item.rawSnippet}
              </p>

              {/* Pipeline Output Preview if computed */}
              {pipe && (
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 mb-4 text-xs space-y-2">
                  <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px] font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Pipeline Analysis Ready
                    </span>
                    <span className="text-emerald-400">
                      Trust Score: {pipe.bot4VerificationAuditor?.trustScore}%
                    </span>
                  </div>

                  <div className="text-slate-300">
                    <strong className="text-slate-200">Synthesized ({pipe.bot3NeuralSynthesizer?.wordCount} words):</strong> {pipe.bot3NeuralSynthesizer?.summary}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      Region: {pipe.bot2GeoTagger?.assignedRegionType} ({pipe.bot2GeoTagger?.matchedCity || pipe.bot2GeoTagger?.matchedState})
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                      Hash: {pipe.bot4VerificationAuditor?.contentHash?.slice(0, 12)}...
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-900">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Pipeline:</span>
                  <span className="text-slate-500">Auto-Scout → Geo-Tagger → Synthesizer → Bias Auditor</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunAgentPipeline(item)}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
                  >
                    <Cpu className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>{isProcessing ? 'Agents Working...' : 'Run 4-Agent Pipeline'}</span>
                  </button>

                  <button
                    onClick={() => handleTransferToEditor(item)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>Adopt to Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
