'use client';

import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Send, 
  CheckCheck, 
  Share2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { queryGazetteRag } from '@/lib/ragEngine';

interface WhatsAppFactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppFactCheckModal({ isOpen, onClose }: WhatsAppFactCheckModalProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'bot';
    text: string;
    verdict?: string;
    citation?: string;
    shareText?: string;
    time: string;
  }>>([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 TruthPulse WhatsApp Fact-Check Tipline par aapka swagat hai.\n\nAapke family ya friends group me jo bhi viral news/rumor aayi ho, use yahan paste karein. Hamara multi-agent AI aur Gazette RAG engine turant fact-check karke certified verdict dega.',
      time: 'Just now'
    }
  ]);
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setChecking(true);

    setTimeout(() => {
      const rag = queryGazetteRag(textToSend);
      const isFact = rag.verdict === 'STATUTORY_FACT_CONFIRMED';

      const responseText = isFact
        ? `✅ VERIFIED STATUTORY FACT\n\n"${rag.queryClaim}"\n\n📌 Statutory Basis: ${rag.officialStatuteCitation}\n\n🔍 Summary: ${rag.legalImplication}`
        : `🚨 DEBUNKED / FABRICATED RUMOR\n\n"${rag.queryClaim}"\n\n❌ Official Verdict: ${rag.legalImplication}\n\n📌 Statutory Reference: ${rag.officialStatuteCitation}\n\n⚠️ Kripya is rumor ko WhatsApp groups me aage forward na karein!`;

      const shareText = encodeURIComponent(
        `[TruthPulse Fact-Check Alert]\n\n${responseText}\n\nRead Full Gazette Proof: https://truth-pulse-coral.vercel.app/`
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: responseText,
          verdict: rag.verdict,
          citation: rag.officialStatuteCitation,
          shareText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setChecking(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-5 font-sans animate-fadeIn">
      <div className="bg-[#0b141a] border border-emerald-900/40 text-slate-100 rounded-3xl max-w-lg w-full flex flex-col h-[600px] max-h-[90vh] shadow-2xl relative overflow-hidden">
        
        {/* WhatsApp Styled Header */}
        <div className="p-3.5 bg-[#202c33] border-b border-[#222d34] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/30">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>TruthPulse WhatsApp Tipline</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </h3>
              <p className="text-[11px] text-emerald-400/90 font-mono">
                Official Citizen Fact-Check Bot (Always Online)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#2a3942] text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0b141a]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-[#005c4b] text-white rounded-tr-none'
                    : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-[#2a3942]'
                }`}
              >
                <p>{msg.text}</p>

                {msg.shareText && (
                  <div className="mt-3 pt-2.5 border-t border-[#374248] flex items-center justify-between gap-2">
                    <span className="text-[10px] text-emerald-400 font-mono">
                      ✓ Gazette Attested
                    </span>
                    <a
                      href={`https://api.whatsapp.com/send?text=${msg.shareText}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Forward on WhatsApp</span>
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400 font-mono">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                </div>
              </div>
            </div>
          ))}

          {checking && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#202c33] max-w-[220px] text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Scanning Gazette & PIB archives...</span>
            </div>
          )}
        </div>

        {/* Preset Quick Chips */}
        <div className="px-3 py-1.5 bg-[#111b21] border-t border-[#222d34] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-500 text-[10px] font-mono shrink-0">Try viral:</span>
          <button
            onClick={() => handleSendMessage(undefined, 'Packaged mineral water banned across northern states by FSSAI')}
            className="px-2 py-0.5 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-slate-300 whitespace-nowrap"
          >
            🥤 Water Ban Rumor
          </button>
          <button
            onClick={() => handleSendMessage(undefined, 'Chhattisgarh launches 90% capital grant for 1.8 Lakh agricultural solar pumps')}
            className="px-2 py-0.5 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-slate-300 whitespace-nowrap"
          >
            ☀️ Solar Subsidy Fact
          </button>
          <button
            onClick={() => handleSendMessage(undefined, 'Parliament enacts Digital Public Infrastructure Act in New Delhi')}
            className="px-2 py-0.5 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-slate-300 whitespace-nowrap"
          >
            🏛️ Electoral Bill Fact
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#202c33] border-t border-[#222d34] flex items-center gap-2">
          <input
            type="text"
            placeholder="Paste forwarded WhatsApp news or message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#2a3942] text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
          />
          <button
            type="submit"
            disabled={checking || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition disabled:opacity-50"
            title="Send Claim to Fact-Check Tipline"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
