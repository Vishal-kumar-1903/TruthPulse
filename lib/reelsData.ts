export interface BreakingShort {
  id: string;
  badge: 'BREAKING' | 'ALERT' | 'FACT-CHECK';
  headline: string;
  snippet: string; // Under 30 words
  location: string;
  source: string;
  fullArticleId?: string;
  category: string;
  imageUrl: string;
  mediaType?: 'IMAGE' | 'VIDEO_LOOP' | 'LOTTIE_ANIMATION';
  mediaUrl?: string;
  trustScore: number;
  timeAgo: string;
}

export const DEFAULT_BREAKING_SHORTS: BreakingShort[] = [
  {
    id: 'short-1',
    badge: 'BREAKING',
    headline: 'Parliament Clears Historic Electoral Transparency & Digital Infrastructure Act',
    snippet: 'Mandatory algorithmic verification and real-time treasury expenditure dashboards codified into national law across all parliamentary constituencies.',
    location: 'New Delhi',
    source: 'ANI National Wire',
    fullArticleId: 'art-delhi-election-transparency',
    category: 'Politics',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000',
    mediaType: 'VIDEO_LOOP',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
    trustScore: 96,
    timeAgo: '12m ago'
  },
  {
    id: 'short-2',
    badge: 'ALERT',
    headline: 'Raigarh Collector Enforces 48-Hour Stack Emission Telemetry Audit',
    snippet: 'Special surveillance squads dispatched along Taraimal industrial corridor to verify continuous electrostatic precipitator uptime across sponge iron rolling mills.',
    location: 'Raigarh, CG',
    source: 'CECB Statutory Desk',
    category: 'Environment',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1000',
    mediaType: 'VIDEO_LOOP',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-solar-panels-in-a-field-42517-large.mp4',
    trustScore: 95,
    timeAgo: '24m ago'
  },
  {
    id: 'short-3',
    badge: 'FACT-CHECK',
    headline: 'Debunked: Fabricated Social Circular Claims Bottled Water Suspension in North India',
    snippet: 'FSSAI confirms routine quality tests ongoing; no sales suspension or production halts have been ordered. Public urged to disregard manipulated video clips.',
    location: 'New Delhi / Lucknow',
    source: 'PIB Fact-Check Bureau',
    category: 'Health',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000',
    mediaType: 'IMAGE',
    trustScore: 98,
    timeAgo: '35m ago'
  },
  {
    id: 'short-4',
    badge: 'BREAKING',
    headline: 'Sensex Rallies 780 Points as Indian Manufacturing PMI Hits 16-Year Record of 59.4',
    snippet: 'Capital goods and electronics exports power secondary desks; foreign institutional desks record net positive buying surpassing ₹4,800 crore in single session.',
    location: 'Mumbai, MH',
    source: 'Reuters / Dalal Street',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000',
    mediaType: 'LOTTIE_ANIMATION',
    trustScore: 94,
    timeAgo: '42m ago'
  },
  {
    id: 'short-5',
    badge: 'ALERT',
    headline: 'Convective Lightning & Squall Advisory Issued for Central Chhattisgarh',
    snippet: 'Raigarh, Bilaspur, and Janjgir placed on alert for 45 km/h gusts and localized cloud-to-ground strikes. Farmers advised to shelter in masonry dwellings.',
    location: 'Bilaspur & Raigarh, CG',
    source: 'IMD Raipur Radar',
    category: 'Weather',
    imageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1000',
    mediaType: 'LOTTIE_ANIMATION',
    trustScore: 93,
    timeAgo: '50m ago'
  },
  {
    id: 'short-6',
    badge: 'BREAKING',
    headline: 'Geneva Climate Accord Ratified: 42 Sovereign Nations Back $15B Transition Fund',
    snippet: 'United Nations delegates approve binding satellite registry standards for sovereign green issuances, guaranteeing emergency resilience grants for coastal corridors.',
    location: 'Geneva, Switzerland',
    source: 'UN Palais Wire',
    category: 'International',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000',
    trustScore: 97,
    timeAgo: '1h ago'
  }
];
