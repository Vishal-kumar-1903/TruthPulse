'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  X, 
  Check, 
  ChevronRight, 
  Building2, 
  Sparkles,
  RefreshCw,
  LocateFixed
} from 'lucide-react';
import { METROPOLITAN_HUBS, findMetroByCityOrState } from '@/lib/metroHubs';

export interface IndianStateData {
  state: string;
  capital: string;
  tierCities: string[];
}

export const INDIAN_STATES_DIRECTORY: IndianStateData[] = [
  { state: 'Chhattisgarh', capital: 'Raipur', tierCities: ['Raigarh', 'Raipur', 'Bilaspur', 'Bastar', 'Durg', 'Bhilai', 'Korba'] },
  { state: 'Maharashtra', capital: 'Mumbai', tierCities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur'] },
  { state: 'Delhi NCR', capital: 'New Delhi', tierCities: ['New Delhi', 'North Delhi', 'South Delhi', 'Dwarka', 'Rohini'] },
  { state: 'Karnataka', capital: 'Bengaluru', tierCities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi'] },
  { state: 'Gujarat', capital: 'Gandhinagar', tierCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'] },
  { state: 'Uttar Pradesh', capital: 'Lucknow', tierCities: ['Lucknow', 'Varanasi', 'Kanpur', 'Noida', 'Prayagraj', 'Agra', 'Meerut'] },
  { state: 'Andhra Pradesh', capital: 'Amaravati', tierCities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati'] },
  { state: 'Arunachal Pradesh', capital: 'Itanagar', tierCities: ['Itanagar', 'Naharlagun', 'Pasighat'] },
  { state: 'Assam', capital: 'Dispur', tierCities: ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat'] },
  { state: 'Bihar', capital: 'Patna', tierCities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'] },
  { state: 'Goa', capital: 'Panaji', tierCities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'] },
  { state: 'Haryana', capital: 'Chandigarh', tierCities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Hisar'] },
  { state: 'Himachal Pradesh', capital: 'Shimla', tierCities: ['Shimla', 'Dharamshala', 'Mandi', 'Solan'] },
  { state: 'Jharkhand', capital: 'Ranchi', tierCities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'] },
  { state: 'Kerala', capital: 'Thiruvananthapuram', tierCities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'] },
  { state: 'Madhya Pradesh', capital: 'Bhopal', tierCities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'] },
  { state: 'Manipur', capital: 'Imphal', tierCities: ['Imphal', 'Churachandpur', 'Thoubal'] },
  { state: 'Meghalaya', capital: 'Shillong', tierCities: ['Shillong', 'Tura', 'Jowai'] },
  { state: 'Mizoram', capital: 'Aizawl', tierCities: ['Aizawl', 'Lunglei', 'Champhai'] },
  { state: 'Nagaland', capital: 'Kohima', tierCities: ['Kohima', 'Dimapur', 'Mokokchung'] },
  { state: 'Odisha', capital: 'Bhubaneswar', tierCities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur'] },
  { state: 'Punjab', capital: 'Chandigarh', tierCities: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Bathinda'] },
  { state: 'Rajasthan', capital: 'Jaipur', tierCities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'] },
  { state: 'Sikkim', capital: 'Gangtok', tierCities: ['Gangtok', 'Namchi', 'Geyzing'] },
  { state: 'Tamil Nadu', capital: 'Chennai', tierCities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'] },
  { state: 'Telangana', capital: 'Hyderabad', tierCities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'] },
  { state: 'Tripura', capital: 'Agartala', tierCities: ['Agartala', 'Udaipur', 'Dharmanagar'] },
  { state: 'Uttarakhand', capital: 'Dehradun', tierCities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Nainital'] },
  { state: 'West Bengal', capital: 'Kolkata', tierCities: ['Kolkata', 'Siliguri', 'Asansol', 'Durgapur', 'Howrah'] },
  { state: 'Jammu & Kashmir', capital: 'Srinagar / Jammu', tierCities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla'] },
  { state: 'Ladakh', capital: 'Leh', tierCities: ['Leh', 'Kargil'] },
  { state: 'Chandigarh (UT)', capital: 'Chandigarh', tierCities: ['Chandigarh Sector 1-60'] },
  { state: 'Puducherry (UT)', capital: 'Puducherry', tierCities: ['Puducherry', 'Karaikal', 'Mahe'] }
];

interface GeoDetectorProps {
  currentState: string;
  currentCity?: string;
  currentMetro?: string;
  onLocationChange: (state: string, city?: string, metro?: string) => void;
  onClearLocation: () => void;
}

export default function GeoDetector({
  currentState,
  currentCity,
  currentMetro,
  onLocationChange,
  onClearLocation
}: GeoDetectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedState, setDetectedState] = useState<string | null>(null);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [detectedMetro, setDetectedMetro] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedGeo = localStorage.getItem('truthpulse_geo');
      if (savedGeo) {
        const parsed = JSON.parse(savedGeo);
        if (parsed.state) {
          setDetectedState(parsed.state);
          setDetectedCity(parsed.city || null);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const detectUserGpsLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse geocoding via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const address = data.address || {};

          let state = address.state || '';
          let city = address.city || address.town || address.county || address.state_district || '';

          // Normalize State if needed
          if (state.toLowerCase().includes('delhi')) state = 'Delhi';
          else if (state.toLowerCase().includes('chhattisgarh')) state = 'Chhattisgarh';
          else if (state.toLowerCase().includes('maharashtra')) state = 'Maharashtra';

          if (!state) {
            // Coordinate heuristic fallback for India if geocoder throttled
            if (latitude >= 21.0 && latitude <= 23.5 && longitude >= 81.0 && longitude <= 84.0) {
              state = 'Chhattisgarh';
              city = 'Raigarh';
            } else if (latitude >= 18.5 && latitude <= 20.0 && longitude >= 72.5 && longitude <= 73.5) {
              state = 'Maharashtra';
              city = 'Mumbai';
            } else if (latitude >= 28.3 && latitude <= 28.9 && longitude >= 76.8 && longitude <= 77.4) {
              state = 'Delhi';
              city = 'New Delhi';
            } else {
              state = 'All India';
            }
          }

          const matchedMetro = findMetroByCityOrState(city, state);
          setDetectedState(state);
          setDetectedCity(city || null);
          setDetectedMetro(matchedMetro?.id || null);
          onLocationChange(state, city || undefined, matchedMetro?.id);

          try {
            localStorage.setItem('truthpulse_geo', JSON.stringify({ state, city, metro: matchedMetro?.id, latitude, longitude }));
          } catch {
            // Ignore
          }
          setIsModalOpen(false);
        } catch {
          // Graceful fallback to default Raigarh, Chhattisgarh test hub
          const fallbackState = 'Chhattisgarh';
          const fallbackCity = 'Raigarh';
          setDetectedState(fallbackState);
          setDetectedCity(fallbackCity);
          onLocationChange(fallbackState, fallbackCity);
        } finally {
          setIsDetecting(false);
        }
      },
      () => {
        setIsDetecting(false);
        setErrorMsg('Location permission denied. Please pick your state or city manually below.');
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleSelectStateOrCity = (state: string, city?: string, metro?: string) => {
    setDetectedState(state);
    setDetectedCity(city || null);
    setDetectedMetro(metro || null);
    onLocationChange(state, city, metro);
    try {
      localStorage.setItem('truthpulse_geo', JSON.stringify({ state, city, metro }));
    } catch {
      // Ignore
    }
    setIsModalOpen(false);
  };

  const filteredStates = INDIAN_STATES_DIRECTORY.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.state.toLowerCase().includes(q) ||
      item.capital.toLowerCase().includes(q) ||
      item.tierCities.some(c => c.toLowerCase().includes(q))
    );
  });

  const activeMetro = currentMetro 
    ? METROPOLITAN_HUBS.find(h => h.id === currentMetro)
    : (detectedMetro ? METROPOLITAN_HUBS.find(h => h.id === detectedMetro) : null);

  const isLocationActive = (currentState && currentState !== 'All India') || !!currentCity || !!detectedState || !!activeMetro;

  return (
    <>
      {/* 1. COMPACT ACTIVE GEO-BANNER ON HOMEPAGE */}
      <div className="mb-4 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600/10 via-rose-500/10 to-amber-500/10 dark:from-red-950/40 dark:via-slate-900 dark:to-slate-950 border border-red-500/20 text-xs shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-xl bg-red-600 text-white shadow-sm shrink-0">
              <LocateFixed className="w-3.5 h-3.5 animate-pulse" />
            </span>
            <div className="truncate">
              {activeMetro ? (
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  Showing verified dispatches for Metro Hub:{' '}
                  <strong className="text-red-600 dark:text-red-400 font-bold">
                    {activeMetro.name}
                  </strong>{' '}
                  <span className="hidden md:inline px-1.5 py-0.5 rounded-md bg-red-600/10 text-red-600 dark:text-red-300 text-[10px] font-bold">
                    {activeMetro.districts.slice(0, 3).join(', ')}...
                  </span>
                  <span className="hidden sm:inline text-slate-500 text-[11px] ml-1.5 font-mono">
                    (Metro Feed → State → National)
                  </span>
                </span>
              ) : isLocationActive ? (
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  Showing verified dispatches for{' '}
                  <strong className="text-red-600 dark:text-red-400 font-bold">
                    {currentCity ? `${currentCity}, ` : ''}{currentState !== 'All India' ? currentState : (detectedState || 'National')}
                  </strong>
                  <span className="hidden sm:inline text-slate-500 text-[11px] ml-1.5 font-mono">
                    (Hyper-local priority: City → State → National)
                  </span>
                </span>
              ) : (
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="text-red-600 dark:text-red-400 font-bold">Hyper-Local News:</strong> Detect your location to route instant Raigarh, Raipur, Delhi NCR, or State investigative briefs.
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={detectUserGpsLocation}
              disabled={isDetecting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isDetecting ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3 h-3" />
                  <span>{isLocationActive ? 'Re-Detect' : 'Detect My Location'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-[11px] transition-all"
            >
              <span>Directory</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            {isLocationActive && (
              <button
                onClick={() => {
                  setDetectedState(null);
                  setDetectedCity(null);
                  try {
                    localStorage.removeItem('truthpulse_geo');
                  } catch {
                    // Ignore
                  }
                  onClearLocation();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition"
                title="Reset to All India"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ALL 28 INDIAN STATES & DISTRICTS DIRECTORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden font-sans">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-600 text-white shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Indian States & Cities Directory
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select your exact home district or state for hyper-local citizen reporting
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS One-Tap Bar inside modal */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-red-50/60 dark:bg-red-950/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-red-500 shrink-0" />
                <span>Auto-detect GPS to show Raigarh, Raipur, Mumbai, or your home tehsil.</span>
              </div>
              <button
                onClick={detectUserGpsLocation}
                disabled={isDetecting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shrink-0 shadow-sm transition active:scale-95"
              >
                {isDetecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                <span>Auto GPS</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Indian State, Capital, or City (e.g. Raigarh, Pune, Raipur, Lucknow)..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  autoFocus
                />
              </div>
              {errorMsg && (
                <p className="mt-2 text-[11px] text-amber-500 font-medium">{errorMsg}</p>
              )}
            </div>

            {/* Metropolitan Mega Clusters Quick Row */}
            <div className="p-3 bg-slate-50/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-500 uppercase mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Tier-1 Metropolitan Mega Clusters</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {METROPOLITAN_HUBS.map((hub) => {
                  const isSelected = currentMetro === hub.id;
                  return (
                    <button
                      key={hub.id}
                      onClick={() => handleSelectStateOrCity(hub.state, hub.primaryCity, hub.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500'
                      }`}
                    >
                      <span>{hub.shortLabel}</span>
                      <span className="text-[10px] opacity-70 font-normal">({hub.state})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* States & Tier-2/3 Cities Grid */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredStates.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No state or district matching &quot;{searchQuery}&quot; found.
                </div>
              ) : (
                filteredStates.map((item) => {
                  const isStateActive = currentState.toLowerCase() === item.state.toLowerCase();
                  return (
                    <div key={item.state} className="pt-3 first:pt-0">
                      <div className="flex items-center justify-between pb-1.5">
                        <button
                          onClick={() => handleSelectStateOrCity(item.state)}
                          className="flex items-center gap-2 group text-left"
                        >
                          <Building2 className={`w-4 h-4 ${isStateActive ? 'text-red-500' : 'text-slate-400 group-hover:text-red-500'} transition`} />
                          <span className={`text-sm font-bold ${isStateActive ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200 group-hover:text-red-600'} transition`}>
                            {item.state}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            (Capital: {item.capital})
                          </span>
                        </button>

                        <button
                          onClick={() => handleSelectStateOrCity(item.state)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition ${
                            isStateActive
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-red-500'
                          }`}
                        >
                          {isStateActive ? 'Selected State' : 'View All State'}
                        </button>
                      </div>

                      {/* City Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pl-6 pt-1">
                        {item.tierCities.map((city) => {
                          const isCityActive = currentCity?.toLowerCase() === city.toLowerCase();
                          return (
                            <button
                              key={city}
                              onClick={() => handleSelectStateOrCity(item.state, city)}
                              className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition ${
                                isCityActive
                                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-red-500 hover:text-red-500'
                              }`}
                            >
                              📍 {city}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                TruthPulse 28 States & 8 UTs Geo-Index
              </span>
              <button
                onClick={() => {
                  onClearLocation();
                  setIsModalOpen(false);
                }}
                className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 text-[11px] font-bold transition"
              >
                Reset to All India
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
