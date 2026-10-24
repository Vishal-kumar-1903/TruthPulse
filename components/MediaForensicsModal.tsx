'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Camera, 
  Cpu, 
  Eye, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  History, 
  ExternalLink,
  Search,
  Scan,
  Activity,
  FileCheck2,
  Fingerprint
} from 'lucide-react';
import { MediaForensicReport } from '@/lib/forensics';

interface MediaForensicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: MediaForensicReport;
}

export default function MediaForensicsModal({ isOpen, onClose, report }: MediaForensicsModalProps) {
  const [viewMode, setViewMode] = useState<'standard' | 'ela_heatmap'>('standard');
  const [customScanUrl, setCustomScanUrl] = useState('');
  const [activeReport, setActiveReport] = useState<MediaForensicReport>(report);
  const [scanning, setScanning] = useState(false);

  if (!isOpen || !activeReport) return null;

  const isSafe = activeReport.syntheticScore < 40;

  const handleCustomScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customScanUrl.trim()) return;
    setScanning(true);
    try {
      const res = await fetch('/api/forensics/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: customScanUrl.trim() })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setActiveReport(data.report);
      }
    } catch (e) {
      // Ignore
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-5 font-sans animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Close Forensics Inspector"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-cyan-400">
              <Scan className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>C2PA AI Media & Deepfake Forensics</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                IEEE P2807 Compliant
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Spectral Error Level Analysis (ELA) • Hardware Cryptographic Provenance
            </p>
          </div>
        </div>

        {/* Media Preview & ELA Toggle */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 mb-5 bg-slate-900 aspect-video flex items-center justify-center group">
          <img
            src={activeReport.mediaUrl}
            alt="Forensic Scan"
            className={`w-full h-full object-cover transition duration-300 ${
              viewMode === 'ela_heatmap' ? 'filter invert contrast-200 hue-rotate-180 brightness-75' : ''
            }`}
          />

          {viewMode === 'ela_heatmap' && (
            <div className="absolute inset-0 bg-red-500/10 mix-blend-color-dodge pointer-events-none flex items-center justify-center">
              <div className="p-2 rounded-xl bg-black/80 text-[11px] font-mono text-cyan-300 border border-cyan-500/40">
                Error Level Analysis Heatmap: {activeReport.elaRiskLevel}
              </div>
            </div>
          )}

          {/* Mode Switcher Overlay */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 p-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('standard')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                viewMode === 'standard' ? 'bg-cyan-500 text-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              Standard Photo
            </button>
            <button
              onClick={() => setViewMode('ela_heatmap')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                viewMode === 'ela_heatmap' ? 'bg-cyan-500 text-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>ELA Spectral</span>
            </button>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className={`p-4 rounded-2xl mb-5 border flex items-start gap-3.5 ${
          isSafe 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {isSafe ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-sm font-black uppercase tracking-wide">
                {activeReport.verdict.replace(/_/g, ' ')}
              </strong>
              <span className="text-xs font-mono font-normal opacity-80">
                ({activeReport.confidenceRate}% Accuracy Confidence)
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90 font-sans">
              {activeReport.auditSummary}
            </p>
          </div>
        </div>

        {/* 4-Stat Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Synthetic Risk</span>
            <span className={`text-base font-bold ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
              {activeReport.syntheticScore}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">ELA Splicing</span>
            <span className="text-base font-bold text-cyan-400">
              {activeReport.elaScore}/100
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Visual pHash</span>
            <span className="text-base font-bold text-amber-400 truncate block">
              {activeReport.perceptualHash}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Reverse Lookup</span>
            <span className="text-base font-bold text-slate-200">
              {activeReport.reverseLookupCorroboration.matchesFound} Wire(s)
            </span>
          </div>
        </div>

        {/* C2PA Provenance Manifest Section */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 mb-5 text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-bold text-slate-200">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Fingerprint className="w-4 h-4" />
              <span>C2PA Content Credentials Trail</span>
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
              activeReport.c2pa.signatureStatus === 'VERIFIED_HARDWARE_ATTESTATION'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {activeReport.c2pa.signatureStatus}
            </span>
          </div>

          {activeReport.c2pa.captureDevice && (
            <div className="mb-2 text-[11px] font-mono text-slate-300 space-y-0.5">
              <div>Camera: <strong className="text-white">{activeReport.c2pa.captureDevice.make} {activeReport.c2pa.captureDevice.model}</strong></div>
              <div>Lens: {activeReport.c2pa.captureDevice.lens} • Signed Firmware</div>
            </div>
          )}

          <div className="space-y-1 font-mono text-[10px] text-slate-400">
            {activeReport.c2pa.provenanceActions.map((action, idx) => (
              <div key={idx} className="flex items-center justify-between p-1 rounded bg-slate-950/40">
                <span className="text-cyan-300">• {action.action}</span>
                <span>{action.softwareAgent}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Image URL Scanner */}
        <form onSubmit={handleCustomScan} className="flex gap-2">
          <input
            type="url"
            placeholder="Scan another suspicious image URL..."
            value={customScanUrl}
            onChange={(e) => setCustomScanUrl(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <button
            type="submit"
            disabled={scanning}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs transition flex items-center gap-1.5 shrink-0"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>{scanning ? 'Scanning...' : 'Scan Photo'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
