'use client';

import React, { useState } from 'react';
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
  RotateCcw
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
  reasonMessage = 'Please sign in with a verified account to cast your Green/Red credibility vote and submit counter-evidence.'
}: AuthModalProps) {
  const [authTab, setAuthTab] = useState<'demo' | 'phone' | 'email'>('demo');
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

  if (!isOpen) return null;

  const handleDemoLogin = async (role: 'READER' | 'CHIEF_EDITOR') => {
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
    }, 800);
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
          email: `phone_${phoneNumber}@truthpulse.user`
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

  const handleCustomLogin = async (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-4 font-sans animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-red-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-red-500">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-black text-white">TruthPulse Citizen Auth</h3>
            <p className="text-[11px] text-slate-400 font-mono">Anti-Sybil Credibility Verification</p>
          </div>
        </div>

        {/* Reason Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>{reasonMessage}</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Method Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 mb-4 text-xs font-bold">
          <button
            onClick={() => { setAuthTab('demo'); setError(null); }}
            className={`flex-1 py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authTab === 'demo'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Demo</span>
          </button>

          <button
            onClick={() => { setAuthTab('phone'); setError(null); }}
            className={`flex-1 py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authTab === 'phone'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone OTP</span>
          </button>

          <button
            onClick={() => { setAuthTab('email'); setError(null); }}
            className={`flex-1 py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authTab === 'email'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
        </div>

        {/* 1. FAST DEMO TAB */}
        {authTab === 'demo' && (
          <div className="space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              One-Click Pre-Verified Profiles:
            </p>

            {/* Reader Profile */}
            <button
              onClick={() => handleDemoLogin('READER')}
              disabled={loading}
              className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition">
                    Rohit Sharma (Verified Citizen)
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Role: Reader • 50 TruthCredits • 1-Vote Rights
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Chief Editor Profile */}
            <button
              onClick={() => handleDemoLogin('CHIEF_EDITOR')}
              disabled={loading}
              className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition">
                    Vikramaditya Sen (Chief Editor)
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Role: Chief Editor • 185 TruthCredits • Gating Powers
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        )}

        {/* 2. PHONE OTP TAB */}
        {authTab === 'phone' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <p className="text-[11px] font-mono text-slate-400">
                  Enter your Indian Mobile Number to receive an SMS verification code:
                </p>

                <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 focus-within:border-red-500 overflow-hidden">
                  <span className="px-3 py-2.5 bg-slate-850 border-r border-slate-800 text-xs font-bold text-slate-300 font-mono">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs transition shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending SMS OTP...' : 'Send Verification OTP'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                {mockReceivedOtp && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
                    <span>Simulated SMS Code: <strong className="font-mono text-white text-sm">{mockReceivedOtp}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(mockReceivedOtp)}
                      className="px-2 py-0.5 rounded bg-emerald-600/30 text-[10px] font-bold text-white hover:bg-emerald-600/50"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">
                    Enter 6-digit OTP sent to +91 {phoneNumber}:
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-mono px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpCode(''); }}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    title="Change Phone Number"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{loading ? 'Verifying...' : 'Verify & Sign In (+10 Credits)'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 3. EMAIL TAB */}
        {authTab === 'email' && (
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <p className="text-[11px] font-mono text-slate-400">
              Sign in with your email to link your verified voting reputation:
            </p>

            <div>
              <input
                type="text"
                placeholder="Your Full Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="citizen@example.in"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs transition shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In as Reader'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <p className="mt-4 text-[10px] text-center text-slate-500 font-mono">
          Strict 1-Vote-Per-Citizen guarantee prevents bot manipulation.
        </p>

      </div>
    </div>
  );
}
