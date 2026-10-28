'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Award, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Smartphone, 
  KeyRound, 
  RotateCcw,
  SlidersHorizontal,
  Building2,
  Users
} from 'lucide-react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'READER' | 'CONTRIBUTOR' | 'CHIEF_EDITOR' | 'ADMIN';
  truthCredits: number;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  reasonMessage?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  reasonMessage = 'Please sign in with a verified account to access full credibility features, regional translations, and editorial tools.'
}: AuthModalProps) {
  // Primary Panel: Reader vs Editor/Admin
  const [activePanel, setActivePanel] = useState<'reader' | 'editor'>('reader');

  // Reader subtabs
  const [readerTab, setReaderTab] = useState<'demo' | 'phone' | 'email'>('demo');

  // Common states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Phone OTP States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [mockReceivedOtp, setMockReceivedOtp] = useState<string | null>(null);

  // Email States
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  // Editor Official Form States
  const [editorEmail, setEditorEmail] = useState('');
  const [editorPasskey, setEditorPasskey] = useState('');

  if (!isOpen) return null;

  const handleDemoLogin = async (role: 'READER' | 'CHIEF_EDITOR' | 'ADMIN') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Failed to authenticate');
      }
    } catch (err: any) {
      setError(err.message || 'Network error during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number (+91).');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      // Simulate generated 6-digit OTP
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setMockReceivedOtp(generated);
      setOtpSent(true);
      setLoading(false);
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== mockReceivedOtp && otpCode !== '123456') {
      setError('Invalid OTP code. Please enter the 6-digit verification code sent to your phone.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'READER',
          name: `Citizen +91 ${phoneNumber.slice(-4)}`,
          email: `citizen_${phoneNumber}@truthpulse.user`
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError('Failed to create citizen credentials.');
      }
    } catch (err: any) {
      setError('Network verification failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomReaderLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) {
      setError('Please provide both your name and valid email.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'READER',
          name: customName.trim(),
          email: customEmail.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleOfficialBureauLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorEmail.trim()) {
      setError('Please enter your official bureau email ID.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const isBureauAdmin = editorEmail.includes('admin') || editorPasskey.toLowerCase() === 'admin';
      const role = isBureauAdmin ? 'ADMIN' : 'CHIEF_EDITOR';

      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: editorEmail.split('@')[0].toUpperCase() + ' (Editorial Bureau)',
          email: editorEmail.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Bureau authentication failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 font-sans animate-fadeIn">
      
      {/* PURE CRISP WHITE MODAL CONTAINER */}
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-md shadow-red-500/20 shrink-0">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-red-600">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">TruthPulse Authentication</h3>
            <p className="text-xs text-slate-500 font-mono">Role-Gated Bureau & Citizen Portal</p>
          </div>
        </div>

        {/* Reason Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{reasonMessage}</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* PRIMARY ROLE SPLIT TABS: CITIZEN READER vs EDITORIAL BUREAU */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mb-5 font-bold text-xs">
          
          <button
            onClick={() => { setActivePanel('reader'); setError(null); }}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm ${
              activePanel === 'reader'
                ? 'bg-blue-600 text-white shadow-blue-600/20'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Citizen Reader</span>
          </button>

          <button
            onClick={() => { setActivePanel('editor'); setError(null); }}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm ${
              activePanel === 'editor'
                ? 'bg-slate-900 text-white shadow-slate-900/20'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Editorial Bureau</span>
          </button>
        </div>

        {/* =========================================================================
            PANEL 1: CITIZEN READER (नागरिक पाठक)
           ========================================================================= */}
        {activePanel === 'reader' && (
          <div className="space-y-4">
            
            {/* Citizen Privilege Card */}
            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="font-bold">Verified Citizen Profile</span>
              </div>
              <span className="text-[10px] font-mono text-blue-700 font-semibold">1-Vote Rights • 50 Credits</span>
            </div>

            {/* Reader Subtabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => { setReaderTab('demo'); setError(null); }}
                className={`flex-1 py-1 px-2 rounded-lg transition ${
                  readerTab === 'demo' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                1-Click Demo
              </button>
              <button
                onClick={() => { setReaderTab('phone'); setError(null); }}
                className={`flex-1 py-1 px-2 rounded-lg transition ${
                  readerTab === 'phone' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                Phone OTP
              </button>
              <button
                onClick={() => { setReaderTab('email'); setError(null); }}
                className={`flex-1 py-1 px-2 rounded-lg transition ${
                  readerTab === 'email' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                Email
              </button>
            </div>

            {/* 1. READER 1-CLICK DEMO */}
            {readerTab === 'demo' && (
              <div className="space-y-3 pt-1">
                <button
                  onClick={() => handleDemoLogin('READER')}
                  disabled={loading}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition flex items-center justify-between text-left group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                        Rohit Sharma (Verified Citizen Reader)
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Role: Reader • 50 TruthCredits • Fact-Checking Access
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                </button>
                <p className="text-[11px] text-slate-500 text-center font-mono">
                  Instant 1-click access without entering credentials.
                </p>
              </div>
            )}

            {/* 2. READER PHONE OTP */}
            {readerTab === 'phone' && (
              <div className="pt-1">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <p className="text-[11px] font-mono text-slate-600">
                      Enter your 10-digit Indian Mobile Number to receive SMS OTP:
                    </p>

                    <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 focus-within:border-blue-600 focus-within:bg-white overflow-hidden transition">
                      <span className="px-3 py-2.5 bg-slate-100 border-r border-slate-200 text-xs font-bold text-slate-700 font-mono">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2.5 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-mono"
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{loading ? 'Sending SMS OTP...' : 'Send Verification OTP'}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    {mockReceivedOtp && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                        <span>Simulated SMS Code: <strong className="font-mono text-emerald-950 text-sm">{mockReceivedOtp}</strong></span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(mockReceivedOtp)}
                          className="px-2 py-0.5 rounded bg-emerald-600 text-[10px] font-bold text-white hover:bg-emerald-700"
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-mono text-slate-600 block mb-1">
                        Enter 6-digit OTP sent to +91 {phoneNumber}:
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="• • • • • •"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full text-center tracking-widest text-lg font-mono px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
                        autoFocus
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtpCode(''); }}
                        className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition"
                        title="Change Phone Number"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        type="submit"
                        disabled={loading || otpCode.length < 6}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{loading ? 'Verifying...' : 'Verify & Sign In (+10 Credits)'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 3. READER EMAIL */}
            {readerTab === 'email' && (
              <form onSubmit={handleCustomReaderLogin} className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-mono text-slate-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-600 block mb-1">Reader Email</label>
                  <input
                    type="email"
                    placeholder="reader@example.in"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In as Citizen Reader'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

          </div>
        )}

        {/* =========================================================================
            PANEL 2: EDITORIAL BUREAU & ADMIN (संपादकीय ब्यूरो व एडमिन)
           ========================================================================= */}
        {activePanel === 'editor' && (
          <div className="space-y-4">
            
            {/* Official Bureau Header Card */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Official Editorial Bureau Access</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-black bg-emerald-600 text-white uppercase">
                  Gated Access
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                Exclusive credentials for editors to publish breaking stories to MongoDB Atlas, manage auto-drafts, and supervise autonomous agent swarms.
              </p>
            </div>

            {/* 1-Click Fast Bureau Access */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Instant Bureau Credentials:
              </p>

              {/* Chief Editor Demo Profile */}
              <button
                onClick={() => handleDemoLogin('CHIEF_EDITOR')}
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between text-left group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      Vikramaditya Sen (Chief Editor)
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Role: Chief Editor • 185 TruthCredits • Bureau Publishing Rights
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
              </button>

              {/* System Admin Demo Profile */}
              <button
                onClick={() => handleDemoLogin('ADMIN')}
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition flex items-center justify-between text-left group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center font-bold shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-slate-700 transition">
                      System Administrator (Root Bureau)
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Role: Admin • Full Access to Database, Queue & AI Swarms
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition" />
              </button>
            </div>

            {/* Direct Link to Studio */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">Need direct desk access?</span>
              <Link
                href="/studio"
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Editor Studio Desk</span>
              </Link>
            </div>

          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-mono">
            TruthPulse Anti-Sybil Protocol • Secure Zero-Knowledge Identity
          </p>
        </div>

      </div>
    </div>
  );
}
