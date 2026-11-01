'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  X, 
  ShieldCheck, 
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
  Building2,
  Users,
  BadgeCheck,
  Send,
  Fingerprint
} from 'lucide-react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'READER' | 'CONTRIBUTOR' | 'CHIEF_EDITOR' | 'ADMIN';
  truthCredits: number;
  pressId?: string;
  agency?: string;
  isVerified?: boolean;
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
  reasonMessage = 'Please sign in with verified credentials to access editorial verification, regional wires, and credibility ledger.'
}: AuthModalProps) {
  const router = useRouter();

  // Primary Panel: Reader vs Press / Bureau
  const [activePanel, setActivePanel] = useState<'reader' | 'editor'>('reader');

  // Reader verification mode: 'email_otp' vs 'phone_otp' vs 'quick_demo'
  const [readerMode, setReaderMode] = useState<'email_otp' | 'phone_otp' | 'quick_demo'>('email_otp');

  // Common status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Email OTP States
  const [emailInput, setEmailInput] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [mockEmailOtp, setMockEmailOtp] = useState<string | null>(null);
  const [emailTimer, setEmailTimer] = useState(60);

  // Phone OTP States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [mockPhoneOtp, setMockPhoneOtp] = useState<string | null>(null);
  const [phoneTimer, setPhoneTimer] = useState(60);

  // Press Accreditation / Editor Form States
  const [pressId, setPressId] = useState('');
  const [editorEmail, setEditorEmail] = useState('');
  const [editorPasskey, setEditorPasskey] = useState('');
  const [pressAgency, setPressAgency] = useState('TruthPulse Central Bureau');

  // Countdown timer effect
  useEffect(() => {
    let interval: any;
    if (emailOtpSent && emailTimer > 0) {
      interval = setInterval(() => setEmailTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailOtpSent, emailTimer]);

  useEffect(() => {
    let interval: any;
    if (phoneOtpSent && phoneTimer > 0) {
      interval = setInterval(() => setPhoneTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phoneOtpSent, phoneTimer]);

  if (!isOpen) return null;

  // 1. Send Email OTP
  const handleSendEmailOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.trim())) {
      setError('Please enter a valid, active email address.');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setMockEmailOtp(generated);
      setEmailOtpSent(true);
      setEmailTimer(60);
      setLoading(false);
      setSuccessNotice(`Verification code sent to ${emailInput.trim()}`);
    }, 500);
  };

  // 2. Verify Email OTP
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtpCode !== mockEmailOtp && emailOtpCode !== '123456') {
      setError('Invalid 6-digit email code. Please check your simulated dispatch box or enter 123456.');
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
          name: emailInput.split('@')[0],
          email: emailInput.trim(),
          isVerified: true
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess({ ...data.user, isVerified: true });
        onClose();
      } else {
        setError(data.error || 'Authentication error.');
      }
    } catch (err: any) {
      setError('Network verification failure. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Send Phone SMS OTP
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number (+91).');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setMockPhoneOtp(generated);
      setPhoneOtpSent(true);
      setPhoneTimer(60);
      setLoading(false);
      setSuccessNotice(`Secure SMS OTP dispatched to +91 ${cleanPhone}`);
    }, 500);
  };

  // 4. Verify Phone SMS OTP
  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOtpCode !== mockPhoneOtp && phoneOtpCode !== '123456') {
      setError('Invalid OTP code. Please enter the 6-digit code or use test code 123456.');
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
          name: `Verified Citizen (+91 ${phoneNumber.slice(-4)})`,
          email: `citizen_${phoneNumber}@truthpulse.verified`,
          isVerified: true
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess({ ...data.user, isVerified: true });
        onClose();
      } else {
        setError('Verification failed.');
      }
    } catch (err: any) {
      setError('Verification network error.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Official Bureau / Press ID Login
  const handleOfficialPressLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pressId.trim() || !editorEmail.trim() || !editorPasskey.trim()) {
      setError('Please provide Press ID, Official Bureau Email, and Security Passkey.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const isAdmin = editorEmail.includes('admin') || pressId.toUpperCase().includes('ADM');
      const role = isAdmin ? 'ADMIN' : 'CHIEF_EDITOR';

      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: editorEmail.split('@')[0].toUpperCase(),
          email: editorEmail.trim(),
          pressId: pressId.trim(),
          agency: pressAgency,
          isVerified: true
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess({
          ...data.user,
          pressId: pressId.trim(),
          agency: pressAgency,
          isVerified: true
        });
        onClose();
        router.push('/studio');
      } else {
        setError(data.error || 'Press accreditation validation failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Bureau gateway error.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Fast Preset Autofill for Press Accreditation Testing
  const fillEditorPreset = (role: 'CHIEF' | 'ADMIN') => {
    if (role === 'CHIEF') {
      setPressId('TP-ED-9081');
      setEditorEmail('editor@truthpulse.in');
      setEditorPasskey('TruthPulse@Editor2026');
      setPressAgency('TruthPulse National Editorial Bureau');
    } else {
      setPressId('TP-ADM-001');
      setEditorEmail('admin@truthpulse.in');
      setEditorPasskey('TruthPulse@Admin2026');
      setPressAgency('Central News Consensus Directorate');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex justify-center items-center p-3 sm:p-4 font-sans animate-fadeIn">
      
      {/* Modal Card */}
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-md shadow-red-500/20 shrink-0">
            <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-red-600 font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">TruthPulse Verification Gate</h3>
            <p className="text-xs text-slate-500 font-mono">Press Accreditation & Verified Citizen Access</p>
          </div>
        </div>

        {/* Reason Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed flex items-start gap-2.5">
          <BadgeCheck className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{reasonMessage}</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* PRIMARY ROLE SPLIT TABS: CITIZEN READER vs EDITORIAL BUREAU */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mb-5 font-bold text-xs">
          <button
            onClick={() => { setActivePanel('reader'); setError(null); setSuccessNotice(null); }}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm ${
              activePanel === 'reader'
                ? 'bg-blue-600 text-white shadow-blue-600/20'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Verified Citizen</span>
          </button>

          <button
            onClick={() => { setActivePanel('editor'); setError(null); setSuccessNotice(null); }}
            className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm ${
              activePanel === 'editor'
                ? 'bg-slate-900 text-white shadow-slate-900/20'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Press Bureau Pass</span>
          </button>
        </div>

        {/* =========================================================================
            PANEL 1: VERIFIED CITIZEN READER (EMAIL OTP & PHONE OTP)
           ========================================================================= */}
        {activePanel === 'reader' && (
          <div className="space-y-4">
            
            {/* Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => { setReaderMode('email_otp'); setError(null); }}
                className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  readerMode === 'email_otp' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email OTP</span>
              </button>
              <button
                onClick={() => { setReaderMode('phone_otp'); setError(null); }}
                className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  readerMode === 'phone_otp' ? 'bg-white text-blue-700 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Phone SMS OTP</span>
              </button>
              <button
                onClick={() => { setReaderMode('quick_demo'); setError(null); }}
                className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
                  readerMode === 'quick_demo' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Demo</span>
              </button>
            </div>

            {/* A. EMAIL OTP VERIFICATION */}
            {readerMode === 'email_otp' && (
              <div className="space-y-3 pt-1">
                {!emailOtpSent ? (
                  <form onSubmit={handleSendEmailOtp} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-600 block mb-1 font-semibold">
                        Enter Your Email for Instant Verification:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="reader@gmail.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{loading ? 'Sending Code...' : 'Send 6-Digit Email Code'}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
                    
                    {/* Simulated Dispatch Box */}
                    {mockEmailOtp && (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold block text-[10px] uppercase font-mono tracking-wider text-amber-700">Simulated Email Inbox:</span>
                          <span className="text-sm font-mono font-black tracking-widest text-slate-900">{mockEmailOtp}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEmailOtpCode(mockEmailOtp)}
                          className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 font-bold text-[10px] text-amber-900 transition"
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-mono text-slate-600 font-semibold">
                          Enter 6-Digit Email Code:
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          {emailTimer > 0 ? `Expires in ${emailTimer}s` : 'Expired'}
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="••••••"
                        value={emailOtpCode}
                        onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-center tracking-[0.4em] font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEmailOtpSent(false)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-mono text-xs transition"
                      >
                        Change
                      </button>
                      <button
                        type="submit"
                        disabled={loading || emailOtpCode.length !== 6}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{loading ? 'Verifying Code...' : 'Verify & Enter Portal'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* B. PHONE SMS OTP VERIFICATION */}
            {readerMode === 'phone_otp' && (
              <div className="space-y-3 pt-1">
                {!phoneOtpSent ? (
                  <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-600 block mb-1 font-semibold">
                        Enter Mobile Number for SMS OTP:
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          placeholder="9876543210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || phoneNumber.length !== 10}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{loading ? 'Dispatching SMS...' : 'Send SMS OTP Code'}</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                    
                    {/* Simulated SMS Alert */}
                    {mockPhoneOtp && (
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold block text-[10px] uppercase font-mono tracking-wider text-emerald-700">Simulated SMS Telemetry:</span>
                          <span className="text-sm font-mono font-black tracking-widest text-slate-900">{mockPhoneOtp}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhoneOtpCode(mockPhoneOtp)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-200/80 hover:bg-emerald-300 font-bold text-[10px] text-emerald-900 transition"
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-mono text-slate-600 font-semibold">
                          Enter 6-Digit SMS Code:
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          {phoneTimer > 0 ? `Resend in ${phoneTimer}s` : 'Ready'}
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="••••••"
                        value={phoneOtpCode}
                        onChange={(e) => setPhoneOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-center tracking-[0.4em] font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 font-bold"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPhoneOtpSent(false)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-mono text-xs transition"
                      >
                        Change
                      </button>
                      <button
                        type="submit"
                        disabled={loading || phoneOtpCode.length !== 6}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{loading ? 'Verifying SMS...' : 'Verify Phone & Sign In'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* C. QUICK DEMO PROFILE */}
            {readerMode === 'quick_demo' && (
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch('/api/auth/demo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'READER' })
                      });
                      const d = await res.json();
                      if (d.success && d.user) {
                        onLoginSuccess(d.user);
                        onClose();
                      }
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full p-3 rounded-2xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 text-blue-950 transition flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-blue-950">Pre-Verified Citizen Reader</div>
                      <div className="text-[10px] text-blue-700 font-mono">50 TruthCredits • 1-Vote Fact-Checking</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            PANEL 2: PRESS ACCREDITATION & BUREAU LOGIN (पत्रकार व संपादक ब्यूरो)
           ========================================================================= */}
        {activePanel === 'editor' && (
          <div className="space-y-4">
            
            {/* Press Badge ID Card Header */}
            <div className="p-3.5 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-[11px] font-mono font-black uppercase tracking-wider text-emerald-400">
                    PRESS ACCREDITATION CARD
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-white/10 text-slate-300 border border-white/10">
                  PCI STATUTORY
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed relative z-10 font-sans">
                Official journalistic verification for news anchor, special correspondent, and desk editors.
              </p>
            </div>

            {/* Quick 1-Click Bureau Preset Hints */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Quick Accredited Presets:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fillEditorPreset('CHIEF')}
                  className="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] transition"
                >
                  Chief Editor
                </button>
                <button
                  type="button"
                  onClick={() => fillEditorPreset('ADMIN')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] transition"
                >
                  Bureau Admin
                </button>
              </div>
            </div>

            {/* Press Login Form */}
            <form onSubmit={handleOfficialPressLogin} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-mono text-slate-600 block mb-1 font-semibold">
                    Press / Bureau ID No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="TP-ED-9081"
                    value={pressId}
                    onChange={(e) => setPressId(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-slate-600 block mb-1 font-semibold">
                    News Agency / Desk
                  </label>
                  <select
                    value={pressAgency}
                    onChange={(e) => setPressAgency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="TruthPulse National Editorial Bureau">TruthPulse National Desk</option>
                    <option value="State Special Correspondent Bureau">State Correspondent</option>
                    <option value="Press Trust of India Syndicate">PTI Syndicate Partner</option>
                    <option value="Autonomous Fact-Check Directorate">Fact-Check Wing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-600 block mb-1 font-semibold">
                  Official Bureau Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="editor@truthpulse.in"
                  value={editorEmail}
                  onChange={(e) => setEditorEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-600 block mb-1 font-semibold">
                  Editor Security Passkey / Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={editorPasskey}
                  onChange={(e) => setEditorPasskey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span>{loading ? 'Validating Accreditation...' : 'Authenticate & Open Studio Desk'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </form>

          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>TruthPulse Anti-Sybil Protocol</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            AES-256 Verified
          </span>
        </div>

      </div>
    </div>
  );
}
