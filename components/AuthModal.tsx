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
  AlertCircle
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center items-center p-4 font-sans animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-0.5 shadow-lg shadow-red-500/20">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-red-500">
              <Lock className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white">TruthPulse Citizen Auth</h3>
            <p className="text-xs text-slate-400 font-mono">Anti-Sybil Credibility Verification</p>
          </div>
        </div>

        {/* Reason Banner */}
        <div className="mb-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>{reasonMessage}</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Fast Demo Logins */}
        <div className="space-y-3 mb-6">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Fast One-Click Demo Sign-in:
          </p>

          {/* Reader Profile */}
          <button
            onClick={() => handleDemoLogin('READER')}
            disabled={loading}
            className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
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
            className="w-full p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
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

        {/* Manual Custom Sign-in Form */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3">
            Or sign in with your email:
          </p>

          <form onSubmit={handleCustomLogin} className="space-y-3">
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
                placeholder="name@example.com"
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
        </div>

        <p className="mt-4 text-[10px] text-center text-slate-500 font-mono">
          Strict 1-Vote-Per-Citizen guarantee prevents bot manipulation.
        </p>

      </div>
    </div>
  );
}
