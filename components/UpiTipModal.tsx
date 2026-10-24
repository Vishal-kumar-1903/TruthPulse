'use client';

import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  CheckCircle2, 
  QrCode, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  Heart,
  ArrowRight
} from 'lucide-react';
import { PRESET_TIP_TIERS, generateUpiIntentUrl } from '@/lib/tipping';
import { AuthUser } from './AuthModal';

interface UpiTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName: string;
  articleTitle: string;
  currentUser: AuthUser | null;
}

export default function UpiTipModal({
  isOpen,
  onClose,
  authorName,
  articleTitle,
  currentUser
}: UpiTipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const upiVpa = 'truthpulse.bureau@okhdfcbank';
  const upiUrl = generateUpiIntentUrl({
    vpa: upiVpa,
    payeeName: authorName,
    amount: selectedAmount,
    transactionNote: `Tip: ${articleTitle.slice(0, 20)}`
  });

  const handleSimulatePayment = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-5 font-sans animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 text-slate-100 rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-black text-white">Thank You for Supporting Ground Truth!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Your UPI contribution of <strong className="text-emerald-400">₹{selectedAmount}</strong> directly funds ground investigative reporting by <strong>{authorName}</strong>.
            </p>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-center gap-1.5 font-mono">
              <Coins className="w-4 h-4" />
              <span>+15 TruthCredits Credited to Your Reputation Score</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Return to News Portal
            </button>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-emerald-400">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>Micro-Tip Ground Reporter</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Direct UPI
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  100% of proceeds go directly to uncorrupted field reporting
                </p>
              </div>
            </div>

            {/* Author Target Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 mb-5 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Recipient Reporter / Bureau:</span>
                <strong className="text-white text-sm">{authorName}</strong>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                ✓ Verified Ground Badge
              </span>
            </div>

            {/* Amount Tier Buttons */}
            <div className="mb-5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Choose Tip Amount (₹ INR):
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_TIP_TIERS.map((tier) => (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => setSelectedAmount(tier.amount)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      selectedAmount === tier.amount
                        ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold ring-2 ring-emerald-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-base font-black">₹{tier.amount}</span>
                      <span className="text-base">{tier.icon}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans">{tier.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated UPI QR Code */}
            <div className="p-4 rounded-2xl bg-white text-slate-900 mb-5 text-center flex flex-col items-center justify-center">
              <div className="w-36 h-36 bg-slate-950 rounded-xl p-2.5 flex items-center justify-center mb-2 shadow-inner">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                  <rect x="5" y="5" width="30" height="30" rx="4" fill="#10b981" />
                  <rect x="12" y="12" width="16" height="16" fill="#000" />
                  <rect x="65" y="5" width="30" height="30" rx="4" fill="#10b981" />
                  <rect x="72" y="12" width="16" height="16" fill="#000" />
                  <rect x="5" y="65" width="30" height="30" rx="4" fill="#10b981" />
                  <rect x="12" y="72" width="16" height="16" fill="#000" />
                  <circle cx="50" cy="50" r="10" fill="#3b82f6" />
                  <rect x="42" y="20" width="8" height="15" fill="#fff" />
                  <rect x="70" y="50" width="15" height="8" fill="#fff" />
                  <rect x="50" y="70" width="12" height="12" fill="#fff" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-slate-800">
                Scan with GPay, PhonePe, Paytm, or BHIM
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                UPI ID: {upiVpa}
              </span>
            </div>

            {/* Direct Pay Buttons */}
            <div className="space-y-2">
              <a
                href={upiUrl}
                onClick={handleSimulatePayment}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Pay ₹{selectedAmount} with Installed UPI App</span>
              </a>

              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={submitting}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition"
              >
                {submitting ? 'Confirming payment...' : 'Simulate Successful UPI Payment'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
