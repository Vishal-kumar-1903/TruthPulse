export interface MetropolitanHub {
  id: string;
  name: string;
  shortLabel: string;
  state: string;
  primaryCity: string;
  districts: string[];
  tagline: string;
  badgeColor: string;
}

export const METROPOLITAN_HUBS: MetropolitanHub[] = [
  {
    id: 'delhi-ncr',
    name: 'Delhi NCR',
    shortLabel: 'Delhi NCR',
    state: 'Delhi',
    primaryCity: 'New Delhi',
    districts: ['New Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad'],
    tagline: 'Capital Central & Northern Industrial Corridor',
    badgeColor: 'bg-red-600 text-white'
  },
  {
    id: 'mumbai-mmr',
    name: 'Mumbai MMR',
    shortLabel: 'Mumbai MMR',
    state: 'Maharashtra',
    primaryCity: 'Mumbai',
    districts: ['Mumbai', 'Thane', 'Navi Mumbai', 'Kalyan', 'Mira-Bhayandar'],
    tagline: 'Financial Capital & Coastal Economic Belt',
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    id: 'bengaluru-urban',
    name: 'Bengaluru Urban',
    shortLabel: 'Bengaluru',
    state: 'Karnataka',
    primaryCity: 'Bengaluru',
    districts: ['Bengaluru', 'Whitefield', 'Electronic City', 'Yelahanka'],
    tagline: 'Silicon Valley of India & Sovereign DeepTech',
    badgeColor: 'bg-emerald-600 text-white'
  },
  {
    id: 'hyderabad-ghmc',
    name: 'Hyderabad (GHMC)',
    shortLabel: 'Hyderabad',
    state: 'Telangana',
    primaryCity: 'Hyderabad',
    districts: ['Hyderabad', 'Secunderabad', 'Cyberabad', 'HITEC City'],
    tagline: 'Deccan Tech Hub & Pharma Capital',
    badgeColor: 'bg-cyan-600 text-white'
  },
  {
    id: 'kolkata-metro',
    name: 'Kolkata Metro',
    shortLabel: 'Kolkata',
    state: 'West Bengal',
    primaryCity: 'Kolkata',
    districts: ['Kolkata', 'Howrah', 'Salt Lake', 'New Town'],
    tagline: 'Cultural & Eastern Commercial Epicenter',
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    id: 'chennai-metro',
    name: 'Chennai Metro',
    shortLabel: 'Chennai',
    state: 'Tamil Nadu',
    primaryCity: 'Chennai',
    districts: ['Chennai', 'Tambaram', 'Avadi', 'OMR Corridor'],
    tagline: 'Automotive & Deepwater Logistics Hub',
    badgeColor: 'bg-purple-600 text-white'
  },
  {
    id: 'pune-metro',
    name: 'Pune Metro',
    shortLabel: 'Pune',
    state: 'Maharashtra',
    primaryCity: 'Pune',
    districts: ['Pune', 'Pimpri-Chinchwad', 'Hinjawadi'],
    tagline: 'Engineering, Auto & Higher Education Capital',
    badgeColor: 'bg-indigo-600 text-white'
  },
  {
    id: 'ahmedabad-gandhinagar',
    name: 'Ahmedabad-Gandhinagar',
    shortLabel: 'Ahmedabad',
    state: 'Gujarat',
    primaryCity: 'Ahmedabad',
    districts: ['Ahmedabad', 'Gandhinagar', 'GIFT City', 'Sanand'],
    tagline: 'GIFT Financial City & Manufacturing Corridor',
    badgeColor: 'bg-rose-600 text-white'
  }
];

export function findMetroByCityOrState(city?: string, state?: string): MetropolitanHub | undefined {
  if (!city && !state) return undefined;
  const cLower = (city || '').toLowerCase();
  const sLower = (state || '').toLowerCase();

  return METROPOLITAN_HUBS.find(hub => {
    if (cLower && hub.districts.some(d => d.toLowerCase().includes(cLower) || cLower.includes(d.toLowerCase()))) {
      return true;
    }
    if (sLower === 'delhi' && hub.id === 'delhi-ncr') return true;
    return false;
  });
}
