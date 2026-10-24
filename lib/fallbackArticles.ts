import { ArticleItem } from '@/components/NewsCard';

export const FALLBACK_ARTICLES: ArticleItem[] = [
  // 1. POLITICS - NATIONAL (DELHI)
  {
    _id: 'art-delhi-election-transparency',
    title: 'Parliament Clears Historic Digital Public Infrastructure & Electoral Transparency Bill',
    summary: 'Both houses of Parliament have passed the comprehensive Digital Public Infrastructure and Electoral Transparency Act. The landmark legislation mandates algorithmic traceability for official poll databases and institutes real-time expenditure verification across all national and state assembly constituencies.',
    bullets: [
      'Unanimous passage achieved across treasury and opposition benches.',
      'Real-time spending dashboards to be linked directly with public treasury registers.',
      'Phased deployment scheduled ahead of upcoming state legislative assembly cycles.'
    ],
    content: 'New Delhi: In a momentous legislative milestone, Parliament on Thursday enacted the Digital Public Infrastructure and Electoral Transparency Bill. The law establishes an immutable digital registry for statutory disclosures, reinforcing public oversight and curbing dark-money funding channels across national campaigns.',
    category: 'Politics',
    region: 'National',
    state: 'Delhi',
    city: 'New Delhi',
    location: { regionType: 'NATIONAL', state: 'Delhi', city: 'New Delhi' },
    upvotes: 24,
    downvotes: 1,
    isVerified: true,
    trustScore: 96,
    isPinned: true,
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200',
    mediaType: 'VIDEO_LOOP',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4',
    author: 'TruthPulse National Bureau',
    contentHash: 'hash-delhi-election-transparency-2026',
    sources: [
      {
        name: 'Press Trust of India / Official Parliamentary Gazette',
        url: 'https://ptinews.com/verified-dispatch-2026',
        stance: 'CORROBORATING',
        reliability: 98
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    greenVoters: ['user-1', 'user-2', 'user-3'],
    redVoters: []
  },

  // 2. POLITICS - STATE (CHHATTISGARH)
  {
    _id: 'art-chhattisgarh-solar-subsidies',
    title: 'Chhattisgarh Cabinet Approves Decentralized Solar Irrigation Subsidies for 1.8 Lakh Farmers',
    summary: 'The Chhattisgarh State Cabinet has ratified a ₹1,420 crore decentralized solar microgrid scheme aimed at tribal and marginal agricultural zones across Bastar, Bilaspur, and Raigarh. Under the initiative, eligible cultivators will receive 90 percent capital subsidies for solar-powered submersible pumps.',
    bullets: [
      '₹1,420 crore scheme sanctioned for rural and tribal agro-belts.',
      'Up to 90 percent capital subsidy for 3HP and 5HP solar submersible sets.',
      'Special nodal deployment centers set up across Raigarh and Bastar collectorates.'
    ],
    content: 'Raipur: Chaired by the Chief Minister, the state cabinet on Wednesday finalized an expansive agro-clean energy transition roadmap. The blueprint aims to immunize smallholder paddy cultivators against erratic monsoon spells and peak-hour agricultural tariff stress.',
    category: 'Politics',
    region: 'National',
    state: 'Chhattisgarh',
    city: 'Raipur',
    location: { regionType: 'STATE', state: 'Chhattisgarh', city: 'Raipur' },
    upvotes: 18,
    downvotes: 0,
    isVerified: true,
    trustScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200',
    mediaType: 'VIDEO_LOOP',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-solar-panels-in-a-field-42517-large.mp4',
    author: 'Central India Correspondent',
    contentHash: 'hash-cg-solar-subsidies-2026',
    sources: [
      {
        name: 'CREDA State Notification & Information Dept',
        url: 'https://creda.cg.gov.in/solar-announcement',
        stance: 'CORROBORATING',
        reliability: 95
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    greenVoters: ['user-4', 'user-5'],
    redVoters: []
  },

  // 3. POLITICS - STATE (MAHARASHTRA)
  {
    _id: 'art-maharashtra-coastal-floods',
    title: 'Maharashtra Assembly Passes Comprehensive Coastal Urban Flood Resilience Infrastructure Bill',
    summary: 'The Maharashtra Legislative Assembly has enacted statutory urban drainage upgrades and storm-water barrier mandates across Mumbai, Thane, and Navi Mumbai. The statutory authority will possess overriding powers to halt unauthorized mangrove reclamation.',
    bullets: [
      'High-velocity storm tunnels approved connecting central Mumbai to Arabian Sea.',
      'Zero-tolerance mangrove clearance penalties codified into state environmental law.',
      'Joint audit squad established with Brihanmumbai Municipal Corporation.'
    ],
    content: 'Mumbai: Facing recurrent monsoon inundation challenges, lawmakers in Vidhan Bhavan approved the Coastal Urban Flood Resilience Bill today with bipartisan support. The statutory framework allocates dedicated bond tranches for subterranean discharge culverts.',
    category: 'Politics',
    region: 'National',
    state: 'Maharashtra',
    city: 'Mumbai',
    location: { regionType: 'STATE', state: 'Maharashtra', city: 'Mumbai' },
    upvotes: 15,
    downvotes: 2,
    isVerified: true,
    trustScore: 91,
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200',
    author: 'Mumbai Bureau',
    contentHash: 'hash-mh-urban-flood-2026',
    sources: [
      {
        name: 'Maharashtra Legislative Assembly Bulletins',
        url: 'https://mls.org.in/bulletins',
        stance: 'CORROBORATING',
        reliability: 93
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    greenVoters: ['user-6'],
    redVoters: []
  },

  // 4. BUSINESS - NATIONAL (MAHARASHTRA)
  {
    _id: 'art-sensex-manufacturing-pmi',
    title: 'Sensex Surges 780 Points as Indian Manufacturing PMI Hits 16-Year High of 59.4',
    summary: 'Benchmark equity indices witnessed intense buying momentum as the domestic manufacturing Purchasing Managers Index climbed to a historic 16-year high of 59.4. Capital goods, electronics exports, and domestic automotive production drove broad-based gains.',
    bullets: [
      'Manufacturing PMI registers record reading on robust global and rural demand.',
      'Sensex scales past milestone levels propelled by engineering and bank majors.',
      'FII net inflows touch ₹4,800 crore in single trading session.'
    ],
    content: 'Mumbai: Dalal Street experienced a vibrant rally on Thursday following official release of industrial performance metrics indicating buoyant order books and heightened corporate capital expenditure across core economic corridors.',
    category: 'Business',
    region: 'National',
    state: 'Maharashtra',
    city: 'Mumbai',
    location: { regionType: 'STATE', state: 'Maharashtra', city: 'Mumbai' },
    upvotes: 31,
    downvotes: 1,
    isVerified: true,
    trustScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200',
    mediaType: 'LOTTIE_ANIMATION',
    author: 'Financial Markets Desk',
    contentHash: 'hash-sensex-pmi-2026',
    sources: [
      {
        name: 'Reserve Bank of India & S&P Global India PMI',
        url: 'https://rbi.org.in/economic-indicators',
        stance: 'CORROBORATING',
        reliability: 97
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    greenVoters: ['user-7', 'user-8'],
    redVoters: []
  },

  // 5. BUSINESS - NATIONAL (KARNATAKA)
  {
    _id: 'art-bengaluru-deeptech-capital',
    title: 'Bengaluru DeepTech Ecosystem Secures $4.2 Billion in Sovereign AI & Quantum Compute Capital',
    summary: 'Karnataka IT ministry reported record venture allocations into domestic semiconductor design, neural silicon chips, and quantum cryptography startups based in Bengaluru. The capital influx follows state partnerships with global research consortia.',
    bullets: [
      '$4.2 billion deployed across 84 domestic deeptech enterprise ventures.',
      'State-backed supercomputing cluster opened for university and startup researchers.',
      'New silicon testing laboratory to be commissioned in Whitefield corridor.'
    ],
    content: 'Bengaluru: The Silicon Valley of India marked another watershed milestone today as high-tech enterprise investments outpaced regional peer hubs across the Asia-Pacific basin.',
    category: 'Business',
    region: 'National',
    state: 'Karnataka',
    city: 'Bengaluru',
    location: { regionType: 'STATE', state: 'Karnataka', city: 'Bengaluru' },
    upvotes: 27,
    downvotes: 0,
    isVerified: true,
    trustScore: 97,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
    author: 'Tech & Venture Desk',
    contentHash: 'hash-blr-deeptech-2026',
    sources: [
      {
        name: 'Karnataka Innovation & Technology Society (KITS)',
        url: 'https://itbt.karnataka.gov.in',
        stance: 'CORROBORATING',
        reliability: 96
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    greenVoters: ['user-9'],
    redVoters: []
  },

  // 6. BUSINESS - INTERNATIONAL
  {
    _id: 'art-geneva-green-bonds',
    title: 'Global Sovereign Green Bond Framework Accord Sealed by 42 Nations in Geneva',
    summary: 'Finance ministers and multilateral central bankers concluding high-level deliberations in Geneva have established a standardized disclosure framework for sovereign green bonds. The protocol mandates immutable cross-border registry tracking for green transition projects.',
    bullets: [
      'Universal standards established for sovereign environmental bond issuances.',
      'Mandatory public satellite auditing required for renewable allocations.',
      'World Bank commits $15 billion secondary liquidity support guarantee.'
    ],
    content: 'Geneva: International fiscal architects completed the charter for global climate bonds at the Palais des Nations, paving the way for seamless transnational capital flows into verified decarbonization infrastructure.',
    category: 'Business',
    region: 'International',
    location: { regionType: 'INTERNATIONAL', state: 'Switzerland', city: 'Geneva' },
    upvotes: 21,
    downvotes: 1,
    isVerified: true,
    trustScore: 96,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
    author: 'Global Economics Correspondent',
    contentHash: 'hash-geneva-green-bonds-2026',
    sources: [
      {
        name: 'UNCTAD & World Bank Sustainable Finance Group',
        url: 'https://unctad.org/sustainable-finance',
        stance: 'CORROBORATING',
        reliability: 96
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    greenVoters: ['user-10'],
    redVoters: []
  },

  // 7. SPORTS - NATIONAL (MAHARASHTRA)
  {
    _id: 'art-wankhede-champions-trophy',
    title: 'Champions Trophy 2026: Team India Commences High-Altitude Endurance Camp in Wankhede',
    summary: 'The Board of Control for Cricket in India has initiated an intensive 10-day physical and tactical conditioning camp for the national squad ahead of the marquee ICC Champions Trophy. Head coach emphasized athletic workload optimization.',
    bullets: [
      '15-member main squad and 4 travelling reserves assemble in Mumbai.',
      'Biomechanics and GPS athletic trackers integrated into live net practices.',
      'Warm-up fixture schedule against state development XI announced.'
    ],
    content: 'Mumbai: Wankhede Stadium buzzed with electrified energy this morning as Indian cricket stars reported for initial fitness screenings and tactical war-room sessions ahead of the global trophy defense campaign.',
    category: 'Sports',
    region: 'National',
    state: 'Maharashtra',
    city: 'Mumbai',
    location: { regionType: 'STATE', state: 'Maharashtra', city: 'Mumbai' },
    upvotes: 45,
    downvotes: 2,
    isVerified: true,
    trustScore: 93,
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200',
    author: 'TruthPulse Sports Bureau',
    contentHash: 'hash-wankhede-trophy-2026',
    sources: [
      {
        name: 'BCCI Official Press Release',
        url: 'https://bcci.tv/news',
        stance: 'CORROBORATING',
        reliability: 94
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    greenVoters: ['user-11', 'user-12'],
    redVoters: []
  },

  // 8. SPORTS - NATIONAL (GUJARAT)
  {
    _id: 'art-national-games-ahmedabad',
    title: 'National Games 2026: Over 8,000 Athletes Assemble in Ahmedabad for Record 38 Sports',
    summary: 'The 38th National Games kicked off today with a dazzling cultural and athletic inaugural ceremony at the Narendra Modi Stadium complex. Featuring premier Olympians and emerging state prodigies, the games will host high-stakes competitions.',
    bullets: [
      'Record participation of 8,200 athletes from 28 states and union territories.',
      'Automated photo-finish and high-speed electronic scoring deployed across tracks.',
      'Medal winners guaranteed direct national camp induction and sports scholarships.'
    ],
    content: 'Ahmedabad: Spectators packed the grandstands as state contingents marched proudly under tricolor banners, inaugurating India’s grandest domestic sporting festival.',
    category: 'Sports',
    region: 'National',
    state: 'Gujarat',
    city: 'Ahmedabad',
    location: { regionType: 'STATE', state: 'Gujarat', city: 'Ahmedabad' },
    upvotes: 33,
    downvotes: 1,
    isVerified: true,
    trustScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200',
    author: 'Sports Correspondent',
    contentHash: 'hash-national-games-2026',
    sources: [
      {
        name: 'Indian Olympic Association & Sports Ministry',
        url: 'https://olympic.ind.in/national-games',
        stance: 'CORROBORATING',
        reliability: 95
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 460).toISOString(),
    greenVoters: ['user-13'],
    redVoters: []
  },

  // 9. WEATHER - NATIONAL (DELHI)
  {
    _id: 'art-delhi-aqi-respite',
    title: 'Western Disturbance Brings Respite to North India: Delhi AQI Improves to Moderate (128)',
    summary: 'Unseasonal pre-monsoon showers accompanied by gusty westerly winds cleared lingering particulate haze across the National Capital Region. Delhi recorded an average Air Quality Index of 128, marking the cleanest atmospheric reading in three months.',
    bullets: [
      'Widespread light rain flushes particulate pollutants across Delhi, Noida, and Gurugram.',
      'Average AQI drops sharply from 265 (Poor) to 128 (Moderate).',
      'Pleasant maximum temperatures hovering around 28°C expected over next 48 hours.'
    ],
    content: 'New Delhi: Residents woke to clean skies and brisk easterly breezes on Thursday morning as weather systems over Punjab and Haryana pushed moist air currents across the capital plains.',
    category: 'Weather',
    region: 'National',
    state: 'Delhi',
    city: 'New Delhi',
    location: { regionType: 'NATIONAL', state: 'Delhi', city: 'New Delhi' },
    upvotes: 29,
    downvotes: 1,
    isVerified: true,
    trustScore: 92,
    imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200',
    mediaType: 'LOTTIE_ANIMATION',
    author: 'Meteorological & Environment Desk',
    contentHash: 'hash-delhi-aqi-2026',
    sources: [
      {
        name: 'Central Pollution Control Board (CPCB) & IMD',
        url: 'https://cpcb.nic.in/air-quality-index',
        stance: 'CORROBORATING',
        reliability: 94
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    greenVoters: ['user-14'],
    redVoters: []
  },

  // 10. WEATHER - STATE (CHHATTISGARH - RAIGARH)
  {
    _id: 'art-raigarh-lightning-storm',
    title: 'Meteorological Centre Issues Lightning & Rain Alert for Raigarh and Bilaspur Belts',
    summary: 'The Raipur Meteorological Centre has issued a yellow-grade convective storm warning for Raigarh, Bilaspur, and Janjgir-Champa districts. Severe cloud-to-ground lightning strikes and localized squalls reaching 45 km/h are expected across open agricultural fields.',
    bullets: [
      'Convective thunderstorm advisory active for next 36 hours across central belt.',
      'Emergency control helplines activated across Raigarh and Bilaspur tehsils.',
      'Farmers advised to tether livestock and shelter under masonry structures.'
    ],
    content: 'Raigarh (Chhattisgarh): District authorities convened an emergency disaster coordination briefing following satellite alerts indicating rapid convective cloud development along the Odisha border hills.',
    category: 'Weather',
    region: 'National',
    state: 'Chhattisgarh',
    city: 'Raigarh',
    location: { regionType: 'CITY', state: 'Chhattisgarh', city: 'Raigarh' },
    upvotes: 22,
    downvotes: 0,
    isVerified: true,
    trustScore: 95,
    imageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1200',
    author: 'Raigarh Weather Watch',
    contentHash: 'hash-raigarh-storm-2026',
    sources: [
      {
        name: 'IMD Raipur Regional Meteorological Centre',
        url: 'https://mausam.imd.gov.in/raipur',
        stance: 'CORROBORATING',
        reliability: 95
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
    greenVoters: ['user-15'],
    redVoters: []
  },

  // 11. ENTERTAINMENT - NATIONAL (MAHARASHTRA)
  {
    _id: 'art-national-film-awards',
    title: '71st National Film Awards: Independent Regional Cinema Sweeps Premier Honors in New Delhi',
    summary: 'The prestigious 71st National Film Awards jury unveiled this year’s laureates, with regional cinematic masterworks claiming top accolades. Celebrated Marathi and Malayalam independent features clinched Best Feature Film and Best Direction honors.',
    bullets: [
      'Regional Indian features dominate premier artistic and technical award categories.',
      'Dadasaheb Phalke lifetime achievement honor bestowed upon veteran auteur.',
      'Special jury citation awards dedicated to emerging indie storytellers.'
    ],
    content: 'Mumbai / New Delhi: The Directorate of Film Festivals held a glittering announcement ceremony today, spotlighting the extraordinary diversity, narrative grit, and creative brilliance of contemporary Indian storytelling.',
    category: 'Entertainment',
    region: 'National',
    state: 'Maharashtra',
    city: 'Mumbai',
    location: { regionType: 'STATE', state: 'Maharashtra', city: 'Mumbai' },
    upvotes: 38,
    downvotes: 1,
    isVerified: true,
    trustScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200',
    author: 'Culture & Cinema Bureau',
    contentHash: 'hash-film-awards-2026',
    sources: [
      {
        name: 'Ministry of Information and Broadcasting (MIB)',
        url: 'https://mib.gov.in/national-film-awards',
        stance: 'CORROBORATING',
        reliability: 96
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    greenVoters: ['user-16'],
    redVoters: []
  },

  // 12. ENTERTAINMENT - INTERNATIONAL
  {
    _id: 'art-cannes-classics',
    title: 'Cannes Film Festival 2026: Three Indian Restored Classics Selected for Official Premiere',
    summary: 'In an unprecedented tribute to Indian cinematic heritage, the Cannes Film Festival has selected three meticulously restored 4K prints of classic masterworks from Satyajit Ray, Mrinal Sen, and Ritwik Ghatak for the Cannes Classics official roster.',
    bullets: [
      'Three historic Indian celluloid gems restored from archival camera negatives.',
      'Official red-carpet gala premiere scheduled at Palais des Festivals.',
      'International distribution agreements inked across European art-house circuits.'
    ],
    content: 'Cannes / Paris: Global cinephiles and curators enthusiastically hailed the official announcement as French festival organizers reaffirmed their deep appreciation for South Asian celluloid legacy.',
    category: 'Entertainment',
    region: 'International',
    location: { regionType: 'INTERNATIONAL', state: 'France', city: 'Cannes' },
    upvotes: 41,
    downvotes: 0,
    isVerified: true,
    trustScore: 97,
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200',
    author: 'International Arts Bureau',
    contentHash: 'hash-cannes-classics-2026',
    sources: [
      {
        name: 'Festival de Cannes Official Selection Communiqué',
        url: 'https://festival-cannes.com/classics-2026',
        stance: 'CORROBORATING',
        reliability: 97
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 650).toISOString(),
    greenVoters: ['user-17'],
    redVoters: []
  },

  // 13. HEALTH - NATIONAL (DELHI)
  {
    _id: 'art-genomic-biobank-delhi',
    title: 'Union Health Ministry Expands National Genomic Biobank to 500 Tertiary Medical Centers',
    summary: 'Under the ambitious National Precision Medicine Mission, the Union Ministry of Health has scaled clinical genomic sequencing across 500 AIIMS institutions and state government medical colleges. The project aims to map localized genetic disease markers.',
    bullets: [
      '500 tertiary medical teaching hospitals onboarded onto central genomics grid.',
      'Targeted immunotherapy drug costs projected to decline by up to 60 percent.',
      'Strict statutory data privacy protocols codified to safeguard patient genetic data.'
    ],
    content: 'New Delhi: Health experts and clinical researchers hailed the expansion during a symposium at AIIMS New Delhi today, terming it a revolutionary leap toward personalized public healthcare access for all socio-economic strata.',
    category: 'Health',
    region: 'National',
    state: 'Delhi',
    city: 'New Delhi',
    location: { regionType: 'NATIONAL', state: 'Delhi', city: 'New Delhi' },
    upvotes: 36,
    downvotes: 1,
    isVerified: true,
    trustScore: 98,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200',
    author: 'Health & Science Bureau',
    contentHash: 'hash-genomic-biobank-2026',
    sources: [
      {
        name: 'Ministry of Health & Family Welfare Press Information Bureau',
        url: 'https://pib.gov.in/genomic-mission-2026',
        stance: 'CORROBORATING',
        reliability: 98
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    greenVoters: ['user-18'],
    redVoters: []
  },

  // 14. HEALTH - STATE (CHHATTISGARH - RAIGARH)
  {
    _id: 'art-raigarh-tele-icu',
    title: 'Raigarh District Hospital Operationalizes 24x7 High-Precision Tele-ICU Network for Rural Centers',
    summary: 'To bridge specialized intensive care access across remote rural blocks, the Raigarh District Administration and Chief Medical Health Office have launched a hub-and-spoke Tele-ICU command center. Critical cardiac and respiratory patients will receive continuous real-time monitoring.',
    bullets: [
      'Hub-and-spoke Tele-ICU links 14 remote community health posts to district hospital.',
      'Real-time automated biometric telemetry alerts critical care doctors to patient distress.',
      'Over 60 percent reduction in emergency referral transport mortality projected.'
    ],
    content: 'Raigarh (Chhattisgarh): The District Collectorate inaugurated the centralized tele-medicine hub at the Civil Hospital premises on Wednesday, introducing high-definition audio-visual diagnostic feeds for rural clinics.',
    category: 'Health',
    region: 'National',
    state: 'Chhattisgarh',
    city: 'Raigarh',
    location: { regionType: 'CITY', state: 'Chhattisgarh', city: 'Raigarh' },
    upvotes: 28,
    downvotes: 0,
    isVerified: true,
    trustScore: 96,
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200',
    author: 'Raigarh Civic Health Desk',
    contentHash: 'hash-raigarh-tele-icu-2026',
    sources: [
      {
        name: 'Raigarh Collectorate & CMHO Bulletin',
        url: 'https://raigarh.gov.in/health-directives',
        stance: 'CORROBORATING',
        reliability: 96
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 750).toISOString(),
    greenVoters: ['user-19'],
    redVoters: []
  },

  // 15. FLAGGED VIRAL RUMOR SAMPLE (FOR RED THUMB DISPUTED BADGE)
  {
    _id: 'art-mineral-water-rumor-debunked',
    title: 'Unverified Viral Message Claims Complete Mineral Water Ban Across Northern Districts',
    summary: 'Circulating social media forwards alleging an imminent blanket prohibition on bottled drinking water across northern states have been officially debunked by statutory consumer authorities. The Food Safety and Standards Authority clarified that routine quality testing is underway.',
    bullets: [
      'Food Safety Authority issues formal advisory refuting fabricated circular.',
      'Fact-checking desks traced original false claims to manipulated video snippet.',
      'Public advised not to amplify unverified messaging from unauthorized handles.'
    ],
    content: 'New Delhi / Lucknow: Multiple statutory bodies moved swiftly on Thursday to refute fabricated social media notices causing consumer panic regarding packaged drinking water supplies.',
    category: 'Health',
    region: 'National',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    location: { regionType: 'STATE', state: 'Uttar Pradesh', city: 'Lucknow' },
    upvotes: 2,
    downvotes: 6,
    isVerified: false,
    trustScore: 32,
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200',
    author: 'TruthPulse Fact-Check Desk',
    contentHash: 'hash-water-rumor-2026',
    sources: [
      {
        name: 'FSSAI Statutory Clarification Advisory',
        url: 'https://fssai.gov.in/advisories/packaged-water-clarification',
        stance: 'REFUTING',
        reliability: 98
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString(),
    greenVoters: [],
    redVoters: ['user-20', 'user-21', 'user-22', 'user-23', 'user-24', 'user-25']
  }
];

export interface ArticleFilterParams {
  edition?: string | null;
  category?: string | null;
  state?: string | null;
  city?: string | null;
  metro?: string | null;
  search?: string | null;
  status?: string | null;
}

export const METRO_CLUSTERS_MAP: Record<string, { state: string; matchTerms: string[] }> = {
  'delhi-ncr': { state: 'Delhi', matchTerms: ['delhi', 'new delhi', 'noida', 'gurugram', 'faridabad', 'ghaziabad'] },
  'mumbai-mmr': { state: 'Maharashtra', matchTerms: ['mumbai', 'thane', 'navi mumbai'] },
  'bengaluru-urban': { state: 'Karnataka', matchTerms: ['bengaluru', 'bangalore', 'whitefield', 'karnataka'] },
  'hyderabad-ghmc': { state: 'Telangana', matchTerms: ['hyderabad', 'secunderabad', 'cyberabad', 'telangana'] },
  'kolkata-metro': { state: 'West Bengal', matchTerms: ['kolkata', 'howrah', 'salt lake', 'bengal'] },
  'chennai-metro': { state: 'Tamil Nadu', matchTerms: ['chennai', 'tambaram', 'avadi', 'tamil nadu'] },
  'pune-metro': { state: 'Maharashtra', matchTerms: ['pune', 'pimpri', 'chinchwad'] },
  'ahmedabad-gandhinagar': { state: 'Gujarat', matchTerms: ['ahmedabad', 'gandhinagar', 'gujarat'] },
};

export function filterFallbackArticles(params: ArticleFilterParams): ArticleItem[] {
  let list = [...FALLBACK_ARTICLES];

  // Metro Cluster filter
  if (params.metro && params.metro !== 'ALL') {
    const metroKey = params.metro.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const matchedCluster = Object.entries(METRO_CLUSTERS_MAP).find(
      ([key]) => key === metroKey || params.metro?.toLowerCase().includes(key.split('-')[0])
    );

    if (matchedCluster) {
      const terms = matchedCluster[1].matchTerms;
      const filtered = list.filter(a => {
        const fullText = `${a.city || ''} ${a.state || ''} ${a.title || ''}`.toLowerCase();
        return terms.some(term => fullText.includes(term));
      });
      if (filtered.length > 0) return filtered;
    }
  }

  // Edition filter
  if (params.edition && params.edition !== 'ALL') {
    if (params.edition.toLowerCase().includes('international')) {
      list = list.filter(a => a.region === 'International' || a.location?.regionType === 'INTERNATIONAL');
    } else if (params.edition.toLowerCase().includes('national')) {
      list = list.filter(a => a.region === 'National' || a.location?.regionType !== 'INTERNATIONAL');
    }
  }

  // Category filter
  if (params.category && params.category !== 'ALL' && params.category !== 'Home') {
    const catLower = params.category.trim().toLowerCase();
    list = list.filter(a => a.category?.toLowerCase() === catLower);
  }

  // State filter
  if (params.state && params.state !== 'ALL' && params.state.trim() !== '' && params.state !== 'All India') {
    const stateLower = params.state.trim().toLowerCase();
    list = list.filter(a => 
      a.state?.toLowerCase().includes(stateLower) || 
      a.location?.state?.toLowerCase().includes(stateLower)
    );
  }

  // City filter
  if (params.city && params.city !== 'ALL' && params.city.trim() !== '') {
    const cityLower = params.city.trim().toLowerCase();
    list = list.filter(a => 
      a.city?.toLowerCase().includes(cityLower) || 
      a.location?.city?.toLowerCase().includes(cityLower)
    );
  }

  // Search filter
  if (params.search && params.search.trim() !== '') {
    const q = params.search.trim().toLowerCase();
    list = list.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.summary?.toLowerCase().includes(q) ||
      a.content?.toLowerCase().includes(q) ||
      a.state?.toLowerCase().includes(q) ||
      a.city?.toLowerCase().includes(q)
    );
  }

  return list;
}
