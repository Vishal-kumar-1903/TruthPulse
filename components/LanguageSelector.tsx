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
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 px-2 mb-2 text-slate-400">
          <Globe className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
            Language / भाषा
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition ${
                  isSelected
                    ? 'bg-red-600/20 text-red-400 border border-red-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono flex items-center justify-center text-slate-300 shrink-0">
                    {lang.shortCode}
                  </span>
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
    <div className="relative shrink-0 font-sans z-50">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-bold transition shadow-sm border ${
          isOpen
            ? 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-700 text-slate-900 dark:text-slate-100'
            : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200'
        }`}
        title="Change Language / भाषा बदलें"
      >
        <Globe className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
        <span className="hidden sm:inline font-bold tracking-wide">
          {activeOption.nativeName}
        </span>
        <span className="sm:hidden font-mono text-[10px] font-bold uppercase">
          {activeOption.shortCode}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop to catch clicks outside and close */}
          <div 
            className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[1px]" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 shadow-2xl z-[100] text-xs space-y-1 animate-fadeIn">
            <div className="px-2.5 py-1.5 text-[10px] font-mono text-slate-400 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider">Select Language</span>
              <span className="text-red-500 font-sans">भाषा</span>
            </div>

            <div className="py-1 max-h-64 overflow-y-auto scrollbar-none space-y-0.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs font-semibold transition ${
                      isSelected
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-bold border border-red-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-bold flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                        {lang.shortCode}
                      </span>
                      <span>
                        <span className="block text-slate-900 dark:text-white font-bold leading-tight">
                          {lang.nativeName}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {lang.name}
                        </span>
                      </span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-red-500 shrink-0" />}
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
