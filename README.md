# 🔴 TruthPulse (SatyaNews)
> **Autonomous Multi-Agent Verified News Portal & Civic Editorial Ecosystem**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

TruthPulse is a modern, full-stack Indian news channel web application designed to counter digital misinformation through cryptographic SHA-256 content seals, authenticated citizen credibility voting, multi-agent AI fact-checking, hyper-local geo-routing (28 Indian states), and an immersive TikTok/Instagram-style vertical swipe Reels engine.

---

## 🌟 Key Features

### 1. 📱 TruthReels Engine (Full-Screen Vertical Swipe Shorts)
* **Vertical Swipe Snap:** 100vh viewport snap scrolling on mobile and desktop (`scroll-snap-type: y mandatory`).
* **Interactive Story Bar:** 5-6 second Instagram/WhatsApp story-style segmented progress bar with customizable speed (5s / 8s / 3s).
* **Press-and-Hold to Freeze:** Holding anywhere on the screen immediately freezes timer and voiceover to read comfortably.
* **Right Floating Action Bar:**
  * 🟢 **Green Thumb (Sahi News):** Role-gated credibility voting.
  * 🔴 **Red Thumb (Fake News / Dispute):** Misleading news flagging.
  * 💬 **Community Comments Bottom Sheet:** Ground proofs, gazette URLs, and citizen verification ledger.
  * 🔊 **AI TTS Voiceover:** 1-click text-to-speech audio synthesis readout.
  * 🔗 **Native Share:** Web Share API and 1-click clipboard link copy.

### 2. 📰 Reader Portal & News Feed Layout
* **Indian Channel UI:** Standard breaking news marquee ticker, AQI & weather widgets, live stream broadcast player.
* **Geo-Routing & State Desks:**
  * Global Foreign Edition (`International`).
  * National Edition (`India`) with expandable accordion & pill filters for all 28 Indian States (Chhattisgarh, Maharashtra, Delhi, UP, etc.).
* **Dual-Audience View Switcher:**
  * **Observer Mode:** Clean, distraction-free 60-80 word summary + 3 bullet takeaways.
  * **Investigator Mode:** Scanned evidence provenance, trust score breakdown, and source URL citations.
* **Tamper-Proof Cryptographic Seal:** Immutable SHA-256 cryptographic digest badge on every published article.
* **Native Sponsored Partner Cards:** In-feed, non-intrusive enterprise cards immune to standard ad-blockers.

### 3. 🛡️ Role-Gated Credibility & TruthCredits Economy
* **Anti-Astroturfing & Sybil Defense:** Role-gated single-vote credibility mechanism preventing duplicate voting.
* **3-Strike Misleading Alert:** 3 or more community dispute flags trigger an automated `⚠️ Questionable / Flagged News` warning badge.
* **TruthCredits Economy:** Readers and contributors earn credits for verified reporting and evidence submission.

### 4. 🎛️ Editorial Admin Desk
* **Autonomous 3-Agent Fact-Checking Pipeline:**
  1. *Crawler Agent:* Cross-searches official wires, statutory portals, and press bureaus.
  2. *Cross-Examiner Agent:* Computes semantic divergence and flags numerical discrepancies (death tolls, budget sums).
  3. *Adjudicator Agent:* Issues final verdict, calculates Trust Score, and mints SHA-256 seal.
* **GPS & Geo Ingestion:** Automatic geolocation tagging for hyper-local city/state distribution.

---

## 🚀 Tech Stack

* **Framework:** Next.js 15 (App Router, Server Actions, API Routes)
* **Frontend:** React 19, Tailwind CSS, Lucide React
* **Database:** MongoDB & Mongoose (with MongoDB In-Memory Server fallback for zero-config instant dev)
* **Audio Synthesis:** Web Speech API (en-IN neural speech synthesis)
* **Security:** SHA-256 Cryptographic Hashing via Node crypto

---

## 🛠️ Getting Started

### Prerequisites
* Node.js 18.x or higher
* npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/truthpulse.git
cd truthpulse

# Install dependencies
npm install

# Run the development server
npm run dev

# Or build for production
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
truthpulse/
├── app/
│   ├── layout.tsx             # Root layout with responsive viewport & dark theme
│   ├── page.tsx               # Homepage with NewsFeed & full Reels integration
│   ├── globals.css            # Tailwind & global snap-scroll styles
│   ├── shorts/page.tsx        # Dedicated /shorts full-screen vertical swipe route
│   ├── reels/page.tsx         # Re-export route for /reels
│   ├── admin/page.tsx         # Editorial Admin Desk & TruthCredits console
│   └── api/                   # REST API routes (articles, voting, auth, pipeline)
├── components/
│   ├── Navbar.tsx             # Responsive header with LIVE TV, REELS pill, & categories
│   ├── SidebarDrawer.tsx      # Sliding off-canvas drawer with 28 Indian States
│   ├── NewsFeed.tsx           # Breaking ticker, hero story, and 3-column dispatches
│   ├── NewsCard.tsx           # Sahi/Fake voting, Observer/Investigator modes
│   ├── BreakingShorts.tsx     # 5s auto-transition shorts & mobile story rings
│   ├── ReelsViewer.tsx        # 100vh vertical snap reel engine with touch gestures
│   ├── ReelActionSidebar.tsx  # Floating actions (Sahi, Fake, Comments, Share, TTS)
│   ├── ReelCommentDrawer.tsx  # Mobile slide-up bottom sheet for ground evidence
│   ├── AuthModal.tsx          # 1-click fast demo sign-in & custom auth
│   ├── CryptoSealBadge.tsx    # SHA-256 tamper-proof inspector
│   └── LiveStreamModal.tsx    # Live studio broadcast simulation modal
├── models/
│   ├── Article.ts             # Mongoose schema for dispatches, votes, and sources
│   └── User.ts                # User schema with TruthCredits & roles
└── lib/
    ├── db.ts                  # Resilient MongoDB / In-Memory connection manager
    └── factCheckAgents.ts     # Multi-Agent Fact-Checking simulation engine
```

---

## 📄 License
This project is licensed under the MIT License.
