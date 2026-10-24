'use client';

import { useState, useCallback } from 'react';
import { ArticleItem } from '@/components/NewsCard';
import { MediaForensicReport } from '@/lib/forensics';
import { GazetteRagResult } from '@/lib/ragEngine';

export interface TipTarget {
  author: string;
  title: string;
}

export interface CommunityNotesTarget {
  id: string;
  title: string;
}

export function usePortalModals() {
  // Navigation / Drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Auth modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState('Please sign in to verify or dispute this story.');

  // Media / Stream modals
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [isReelsOpen, setIsReelsOpen] = useState(false);
  const [reelsInitialIndex, setReelsInitialIndex] = useState(0);

  // Inspector & Fact-Check Modals
  const [sealArticle, setSealArticle] = useState<ArticleItem | null>(null);
  const [forensicReport, setForensicReport] = useState<MediaForensicReport | null>(null);
  const [gazetteResult, setGazetteResult] = useState<GazetteRagResult | null>(null);
  const [communityNotesArticle, setCommunityNotesArticle] = useState<CommunityNotesTarget | null>(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [tipTarget, setTipTarget] = useState<TipTarget | null>(null);

  // Handlers
  const openAuth = useCallback((reason?: string) => {
    if (reason) setAuthReason(reason);
    setIsAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  const openReels = useCallback((initialIndex = 0) => {
    setReelsInitialIndex(initialIndex);
    setIsReelsOpen(true);
  }, []);

  const closeReels = useCallback(() => setIsReelsOpen(false), []);

  const openForensics = useCallback((report: MediaForensicReport) => {
    setForensicReport(report);
  }, []);

  const closeForensics = useCallback(() => setForensicReport(null), []);

  const openGazette = useCallback((result: GazetteRagResult) => {
    setGazetteResult(result);
  }, []);

  const closeGazette = useCallback(() => setGazetteResult(null), []);

  const openCommunityNotes = useCallback((id: string, title: string) => {
    setCommunityNotesArticle({ id, title });
  }, []);

  const closeCommunityNotes = useCallback(() => setCommunityNotesArticle(null), []);

  const openTip = useCallback((author: string, title: string) => {
    setTipTarget({ author, title });
  }, []);

  const closeTip = useCallback(() => setTipTarget(null), []);

  return {
    sidebar: {
      isOpen: isSidebarOpen,
      setIsOpen: setIsSidebarOpen,
      toggle: () => setIsSidebarOpen(prev => !prev),
      close: () => setIsSidebarOpen(false),
      open: () => setIsSidebarOpen(true),
    },
    auth: {
      isOpen: isAuthOpen,
      reason: authReason,
      open: openAuth,
      close: closeAuth,
    },
    liveStream: {
      isOpen: isLiveStreamOpen,
      open: () => setIsLiveStreamOpen(true),
      close: () => setIsLiveStreamOpen(false),
    },
    reels: {
      isOpen: isReelsOpen,
      initialIndex: reelsInitialIndex,
      open: openReels,
      close: closeReels,
    },
    cryptoSeal: {
      article: sealArticle,
      open: (article: ArticleItem) => setSealArticle(article),
      close: () => setSealArticle(null),
    },
    forensics: {
      report: forensicReport,
      open: openForensics,
      close: closeForensics,
    },
    gazette: {
      result: gazetteResult,
      open: openGazette,
      close: closeGazette,
    },
    communityNotes: {
      target: communityNotesArticle,
      open: openCommunityNotes,
      close: closeCommunityNotes,
    },
    whatsApp: {
      isOpen: isWhatsAppOpen,
      open: () => setIsWhatsAppOpen(true),
      close: () => setIsWhatsAppOpen(false),
    },
    tip: {
      target: tipTarget,
      open: openTip,
      close: closeTip,
    },
  };
}
