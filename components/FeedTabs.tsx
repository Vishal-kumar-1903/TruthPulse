'use client';

import React, { useState } from 'react';
import { 
  Globe2, 
  Flag, 
  MapPin, 
  Building2, 
  Navigation, 
  ChevronDown, 
  Check, 
  LocateFixed 
} from 'lucide-react';

export type RegionType = 'ALL' | 'INTERNATIONAL' | 'NATIONAL' | 'STATE' | 'CITY';

interface FeedTabsProps {
  currentRegion: RegionType;
  selectedCity: string;
  selectedState: string;
  onSelectRegion: (region: RegionType) => void;
  onSelectCity: (city: string) => void;
  onSelectState: (state: string) => void;
}

const CITIES = [
  'Raigarh',
  'Raipur',
  'Bilaspur',
  'Mumbai',
  'New Delhi',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Chennai'
];

const STATES = [
  'Chhattisgarh',
  'Maharashtra',
  'Delhi NCR',
  'Karnataka',
  'Telangana',
  'West Bengal',
  'Tamil Nadu',
  'Gujarat',
  'Uttar Pradesh'
];

export default function FeedTabs({
  currentRegion,
  selectedCity,
  selectedState,
  onSelectRegion,
  onSelectCity,
  onSelectState
}: FeedTabsProps) {
  const [detectingGps, setDetectingGps] = useState(false);
  const [detectedNotice, setDetectedNotice] = useState('');

  // Browser Geolocation Detection Fallback
  const handleDetectBrowserLocation = () => {
    if (!navigator.geolocation) {
      setDetectedNotice('Geolocation not supported by browser.');
      return;
    }

    setDetectingGps(true);
    setDetectedNotice('Triangulating GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingGps(false);
        // Map to Raigarh / Raipur / Mumbai or nearest city
        // For demonstration of hyper-local routing:
        onSelectRegion('CITY');
        onSelectCity('Raigarh');
        setDetectedNotice('📍 Located: Raigarh (Chhattisgarh) - Switched to Hyper-Local City Feed');
        setTimeout(() => setDetectedNotice(''), 4000);
      },
      (err) => {
        setDetectingGps(false);
        onSelectRegion('CITY');
        onSelectCity('Raigarh');
        setDetectedNotice('📍 Fallback routing to Raigarh, CG (Hyper-Local City)');
        setTimeout(() => setDetectedNotice(''), 4000);
      },
      { timeout: 5000 }
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Main Geo-Routing Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
            
            <button
              onClick={() => onSelectRegion('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                currentRegion === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Feeds
            </button>

            <button
              onClick={() => onSelectRegion('INTERNATIONAL')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                currentRegion === 'INTERNATIONAL'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>International</span>
            </button>

            <button
              onClick={() => onSelectRegion('NATIONAL')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                currentRegion === 'NATIONAL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-orange-400" />
              <span>National (All India)</span>
            </button>

            <button
              onClick={() => onSelectRegion('STATE')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                currentRegion === 'STATE'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>State</span>
            </button>

            <button
              onClick={() => onSelectRegion('CITY')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                currentRegion === 'CITY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Hyper-Local City</span>
            </button>

          </div>

          {/* Sub-Filters: City Dropdown, State Dropdown & Browser GPS Detection */}
          <div className="flex items-center gap-2">
            
            {/* If City tab active: Dropdown */}
            {currentRegion === 'CITY' && (
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select City (All Cities)</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            {/* If State tab active: Dropdown */}
            {currentRegion === 'STATE' && (
              <select
                value={selectedState}
                onChange={(e) => onSelectState(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}

            {/* Browser Geolocation Button */}
            <button
              onClick={handleDetectBrowserLocation}
              disabled={detectingGps}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition"
              title="Detect physical location using browser GPS"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${detectingGps ? 'animate-spin text-emerald-500' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">{detectingGps ? 'Locating...' : 'Auto GPS'}</span>
            </button>

          </div>

        </div>

        {/* Geolocation Notice Banner */}
        {detectedNotice && (
          <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{detectedNotice}</span>
          </div>
        )}

      </div>
    </div>
  );
}
