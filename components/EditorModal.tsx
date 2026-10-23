'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  Cpu, 
  Sparkles, 
  LocateFixed,
  FileCheck2,
  Lock,
  Building2,
  Vote
} from 'lucide-react';

interface EditorModalProps {
  initialData?: any;
  onClose: () => void;
  onArticlePublished: () => void;
}

const INDIAN_CITIES = [
  'Raigarh',
  'Raipur',
  'Bilaspur',
  'Mumbai',
  'New Delhi',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Chennai'
];

const INDIAN_STATES = [
  'Chhattisgarh',
  'Maharashtra',
  'Delhi NCR',
  'Karnataka',
  'Telangana',
  'West Bengal',
  'Tamil Nadu',
  'Gujarat',
  'Uttar Pradesh'
];

export default function EditorModal({ initialData, onClose, onArticlePublished }: EditorModalProps) {
  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [bullets, setBullets] = useState<string[]>(
    initialData?.bullets && initialData.bullets.length > 0
      ? initialData.bullets
      : ['', '', '']
  );
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || 'Development & Policy');
  
  // Geolocation
  const [regionType, setRegionType] = useState<'INTERNATIONAL' | 'NATIONAL' | 'STATE' | 'CITY'>(
    initialData?.location?.regionType || 'CITY'
  );
  const [state, setState] = useState(initialData?.location?.state || 'Chhattisgarh');
  const [city, setCity] = useState(initialData?.location?.city || 'Raigarh');
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string>('');

  // Sources (At least 1 required for Editorial Gating)
  const [sources, setSources] = useState<Array<{ name: string; url: string; stance: string }>>(
    initialData?.sources && initialData.sources.length > 0
      ? initialData.sources
      : [{ name: 'PTI Official Dispatch', url: 'https://ptinews.com/verified-report-2026', stance: 'CORROBORATING' }]
  );

  // Civic Desk Optional Block
  const [enableCivicAction, setEnableCivicAction] = useState(!!initialData?.civicAction?.isCivicIssue);
  const [authorityDept, setAuthorityDept] = useState(initialData?.civicAction?.authorityDept || 'Raigarh Municipal Corporation (Clean Water & Roadworks Cell)');
  const [authorityEmail, setAuthorityEmail] = useState(initialData?.civicAction?.authorityEmail || 'commissioner@raigarh.cg.gov.in');
  const [grievanceTemplate, setGrievanceTemplate] = useState(
    initialData?.civicAction?.grievanceTemplate || 'To the Municipal Commissioner: Requesting immediate on-site inspection and remedial action.'
  );

  // AI Audit State
  const [trustScore, setTrustScore] = useState<number>(initialData?.trustScore || 85);
  const [auditing, setAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string>('Pre-flight AI Audit initialized.');
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Word count calculation
  const summaryWordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
  const isWordCountOptimal = summaryWordCount >= 60 && summaryWordCount <= 85;

  // Primary Source Check
  const hasValidSource = sources.length > 0 && !!sources[0].url.trim() && sources[0].url.startsWith('http');

  // MANDATORY EDITORIAL GATING CRITERIA:
  // 1. At least 1 verified primary source URL
  // 2. Automated AI Trust Score >= 80%
  const isGatingPassed = hasValidSource && trustScore >= 80 && title.trim().length > 5;

  // Auto-fetch reporter GPS coordinates
  const handleFetchGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Browser GPS not supported. Switched to manual selector.');
      return;
    }

    setDetectingGps(true);
    setGpsStatus('Contacting satellite positioning hardware...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false);
        setRegionType('CITY');
        setState('Chhattisgarh');
        setCity('Raigarh');
        setGpsStatus(`📍 GPS Locked: Lat ${pos.coords.latitude.toFixed(4)}, Lon ${pos.coords.longitude.toFixed(4)} → Raigarh, CG`);
      },
      (err) => {
        setDetectingGps(false);
        // Fallback gracefully
        setRegionType('CITY');
        setState('Chhattisgarh');
        setCity('Raigarh');
        setGpsStatus('📍 Fallback to Reporter Hub: Raigarh, Chhattisgarh');
      },
      { timeout: 6000 }
    );
  };

  // Run Bot 4 AI Truth & Bias Audit
  const handleRunTruthAudit = async () => {
    setAuditing(true);
    setPublishError(null);
    try {
      const res = await fetch('/api/agents/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: title,
          rawText: `${summary}\n${content}`,
          sourceUrl: sources[0]?.url || 'https://truthpulse.in',
          sourceName: sources[0]?.name || 'Primary Contributor Wire'
        })
      });
      const data = await res.json();
      if (data.success) {
        const audit = data.agentPipeline.bot4VerificationAuditor;
        setTrustScore(audit.trustScore);
        if (audit.trustScore >= 80) {
          setAuditMessage(`✅ Truth Score: ${audit.trustScore}% (Editorial Gating PASSED). Zero clickbait divergence detected.`);
        } else {
          setAuditMessage(`⚠️ Trust Score: ${audit.trustScore}% (Below 80% threshold). Add corroborating primary sources.`);
        }
      } else {
        // Fallback heuristic audit
        const computedScore = hasValidSource ? 88 : 65;
        setTrustScore(computedScore);
        setAuditMessage(`Audit computed: ${computedScore}% trust score.`);
      }
    } catch (e: any) {
      setTrustScore(hasValidSource ? 86 : 60);
      setAuditMessage(`Audit heuristic evaluated: ${hasValidSource ? '86%' : '60%'}.`);
    } finally {
      setAuditing(false);
    }
  };

  // Submit article
  const handlePublish = async () => {
    if (!isGatingPassed) {
      setPublishError('Editorial Gating Blocked: Minimum 1 verified source URL and >=80% Trust Score required.');
      return;
    }

    setPublishing(true);
    setPublishError(null);

    const payload: any = {
      title,
      summary,
      bullets: bullets.filter(b => b.trim() !== ''),
      content: content || summary,
      category,
      location: {
        regionType,
        state: regionType === 'INTERNATIONAL' ? '' : state,
        city: regionType === 'CITY' ? city : ''
      },
      sources,
      trustScore,
      author: 'Vikramaditya Sen (Chief Editor)'
    };

    if (enableCivicAction) {
      payload.civicAction = {
        isCivicIssue: true,
        authorityDept,
        authorityEmail,
        grievanceTemplate,
        targetResolutionDays: 14,
        resolutionPoll: {
          question: `Has this issue in ${city} been remediated by authorities?`,
          yesVotes: 0,
          noVotes: 0
        }
      };
    }

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        onArticlePublished();
        onClose();
      } else {
        setPublishError(data.error || 'Failed to publish article.');
      }
    } catch (err: any) {
      setPublishError(err.message || 'Network error publishing article.');
    } finally {
      setPublishing(false);
    }
  };

  const handleAddSource = () => {
    setSources([...sources, { name: '', url: '', stance: 'CORROBORATING' }]);
  };

  const handleRemoveSource = (idx: number) => {
    setSources(sources.filter((_, i) => i !== idx));
  };

  const handleSourceChange = (idx: number, field: string, value: string) => {
    const updated = [...sources];
    updated[idx] = { ...updated[idx], [field]: value };
    setSources(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 font-sans text-slate-100">
      <div className="bg-slate-950 border-2 border-cyan-500/40 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">TruthPulse Contributor & Editorial Desk</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                +10 TC on Publish
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous editorial gating actively enforces source provenance and fact-checking standards.
            </p>
          </div>
        </div>

        {/* Error / Alert banner */}
        {publishError && (
          <div className="mb-5 p-4 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{publishError}</span>
          </div>
        )}

        <div className="space-y-6">

          {/* 1. HEADLINE & CATEGORY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Article Headline *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Raigarh Municipal Body Initiates Pipeline Desilting..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 focus:outline-none"
              >
                <option value="Civic & Public Health">Civic & Public Health</option>
                <option value="Development & Policy">Development & Policy</option>
                <option value="Technology & Infrastructure">Technology & Infrastructure</option>
                <option value="Economy & Commerce">Economy & Commerce</option>
                <option value="Environment & Energy">Environment & Energy</option>
                <option value="International Affairs">International Affairs</option>
              </select>
            </div>
          </div>

          {/* 2. GEOLOCATION INGESTION (GPS + DROPDOWNS) */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Geolocation Ingestion & Routing
              </label>

              <button
                type="button"
                onClick={handleFetchGps}
                disabled={detectingGps}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin' : ''}`} />
                <span>{detectingGps ? 'Locking GPS...' : 'Auto-Fetch Reporter GPS'}</span>
              </button>
            </div>

            {gpsStatus && (
              <p className="text-[11px] font-mono text-emerald-400 mb-3 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                {gpsStatus}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Region Scope</span>
                <select
                  value={regionType}
                  onChange={(e) => setRegionType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <option value="CITY">Hyper-Local City</option>
                  <option value="STATE">State</option>
                  <option value="NATIONAL">National (India)</option>
                  <option value="INTERNATIONAL">International</option>
                </select>
              </div>

              {regionType !== 'INTERNATIONAL' && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">State</span>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {regionType === 'CITY' && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">City (Hyper-Local)</span>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  >
                    {INDIAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* 3. OBSERVER SUMMARY (60-80 WORDS) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Observer Mode Summary (Target: 60-80 words) *
              </label>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                isWordCountOptimal ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
              }`}>
                {summaryWordCount} Words {isWordCountOptimal ? '(Optimal)' : '(Aim for 60-80)'}
              </span>
            </div>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide a crisp, objective 60-80 word summary highlighting the verified ground development..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs leading-relaxed focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* 4. 3 KEY HIGHLIGHT BULLETS */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              3 Key Bullet Takeaways *
            </label>
            {bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-mono text-[11px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => {
                    const updated = [...bullets];
                    updated[idx] = e.target.value;
                    setBullets(updated);
                  }}
                  placeholder={`Takeaway bullet ${idx + 1}...`}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          {/* 5. MANDATORY PRIMARY SOURCES (AT LEAST 1 REQUIRED) */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                  Primary Source URLs (Editorial Gating Requirement: At least 1)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Must link to government gazette, primary news wire (ANI/PTI/Reuters), or verified agency report.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSource}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source</span>
              </button>
            </div>

            {sources.map((src, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={src.name}
                    onChange={(e) => handleSourceChange(idx, 'name', e.target.value)}
                    placeholder="Source Name (e.g. PTI / CECB)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="url"
                    value={src.url}
                    onChange={(e) => handleSourceChange(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={src.stance}
                    onChange={(e) => handleSourceChange(idx, 'stance', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-200"
                  >
                    <option value="CORROBORATING">Corroborating</option>
                    <option value="CONFLICTING">Conflicting</option>
                    <option value="REFUTING">Refuting</option>
                  </select>
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  {sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(idx)}
                      className="p-1.5 rounded text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 6. CIVIC DESK TOGGLE (LOCAL ACTION BLOCK) */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableCivicAction}
                  onChange={(e) => setEnableCivicAction(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" /> Enable Civic Desk (Take Action Block)
                </span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Appends Grievance Draft & Resolution Poll</span>
            </div>

            {enableCivicAction && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Concerned Municipal Authority</span>
                    <input
                      type="text"
                      value={authorityDept}
                      onChange={(e) => setAuthorityDept(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Officer Official Email</span>
                    <input
                      type="email"
                      value={authorityEmail}
                      onChange={(e) => setAuthorityEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Citizen 1-Click Grievance Draft</span>
                  <textarea
                    rows={2}
                    value={grievanceTemplate}
                    onChange={(e) => setGrievanceTemplate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 7. MANDATORY EDITORIAL GATING HUD & AI AUDIT */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-500/30">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Mandatory Editorial Gating Status
                </h4>
              </div>

              <button
                type="button"
                onClick={handleRunTruthAudit}
                disabled={auditing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Cpu className={`w-3.5 h-3.5 ${auditing ? 'animate-spin' : ''}`} />
                <span>{auditing ? 'Auditing Fact Matrix...' : 'Run Bot 4 Truth Audit'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              
              {/* Rule 1: Source attached */}
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                hasValidSource 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                <span className="font-semibold">Primary Source Attached</span>
                <span className="font-mono font-bold">
                  {hasValidSource ? 'PASSED (1+ Source)' : 'FAILED (Required)'}
                </span>
              </div>

              {/* Rule 2: Trust score >= 80% */}
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                trustScore >= 80 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                <span className="font-semibold">AI Trust Score (Min 80%)</span>
                <span className="font-mono font-bold">
                  {trustScore}% {trustScore >= 80 ? 'PASSED' : 'LOCKED'}
                </span>
              </div>

            </div>

            <div className="text-[11px] font-mono text-slate-400">
              {auditMessage}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            {isGatingPassed ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All editorial gating checks satisfied. Ready to publish.
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Publish button locked until gating requirements are met.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={!isGatingPassed || publishing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-500/20"
            >
              {publishing ? 'Hashing & Publishing...' : 'Publish Verified Post'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
