import React from 'react';
import { Metadata } from 'next';
import MagazineViewer from '@/components/MagazineViewer';

export const metadata: Metadata = {
  title: 'Digital E-Paper & Magazine Flipbook | TruthPulse SatyaNews',
  description: 'Interactive Digital Magazine and E-Paper edition of TruthPulse featuring verified investigative stories across Indian states and national democracy.',
};

export default function MagazinePage() {
  return <MagazineViewer />;
}
