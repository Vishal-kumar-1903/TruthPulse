'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ReelsViewer from '@/components/ReelsViewer';
import { DEFAULT_BREAKING_SHORTS } from '@/components/BreakingShorts';
import AuthModal, { AuthUser } from '@/components/AuthModal';
import { Cpu } from 'lucide-react';

function ShortsPageContent() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authReason, setAuthReason] = useState('Sign in to verify or dispute this reel.');
  const [shortsList, setShortsList] = useState(DEFAULT_BREAKING_SHORTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('truthpulse_user');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch (e) {
      // Ignore
    }

    // Load latest dynamic reels
    fetch('/api/reels')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.shorts) && data.shorts.length > 0) {
          setShortsList(data.shorts);
        }
      })
      .catch(() => {});
  }, []);

  const handleRequireAuth = (reason?: string) => {
    if (reason) setAuthReason(reason);
    setIsAuthModalOpen(true);
  };

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black">
      <ReelsViewer
        shorts={shortsList}
        initialIndex={0}
        isOpen={true}
        onClose={handleClose}
        currentUser={currentUser}
        onRequireAuth={handleRequireAuth}
        onOpenFullArticle={(short) => {
          router.push(`/?search=${encodeURIComponent(short.headline.slice(0, 20))}`);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => {
          setCurrentUser(u);
          try {
            localStorage.setItem('truthpulse_user', JSON.stringify(u));
          } catch (e) {}
        }}
        reasonMessage={authReason}
      />
    </div>
  );
}

export default function ShortsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-xs">
        <Cpu className="w-6 h-6 animate-spin text-red-500 mr-2" />
        <span>Loading TruthReels...</span>
      </div>
    }>
      <ShortsPageContent />
    </Suspense>
  );
}
