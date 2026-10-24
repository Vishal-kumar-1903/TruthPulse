'use client';

import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/translations';

interface LanguageSelectorProps {
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  variant?: 'navbar' | 'drawer';
}

export default function LanguageSelector({
  currentLang,
  onSelectLang,
  variant = 'navbar'
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeOption = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const handleSelect = (lang: SupportedLanguage) => {
    onSelectLang(lang);
    setIsOpen(false);
    try {
      localStorage.setItem('truthpulse_lang', lang);
    } catch (e) {}
  };

  if (variant === 'drawer') {
    return (
      <div className="space-y-1">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 px-2">
          Language / भाषा
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition ${
                  isSelected
                    ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.nativeName}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative shrink-0 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 transition shadow-sm"
        title="Change Language / भाषा बदलें"
      >
        <span className="text-xs">{activeOption.flag}</span>
        <span className="hidden xs:inline">{activeOption.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 shadow-2xl z-50 text-xs space-y-0.5">
            <div className="px-2.5 py-1 text-[10px] font-mono text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Select Language</span>
              <span>भाषा</span>
            </div>

            <div className="py-1 max-h-56 overflow-y-auto scrollbar-none space-y-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-red-600/15 text-red-600 dark:text-red-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] font-mono text-slate-400">({lang.name})</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-red-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
