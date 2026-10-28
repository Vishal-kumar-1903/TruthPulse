# Strapi Open-Source Headless CMS for TruthPulse

Ye guide explain karti hai ki TruthPulse me **Strapi Headless CMS** ko article writing, draft management, media assets, aur live publishing ke liye kaise use karein.

---

## 1. Quickstart (2 Ways to Run Strapi)

### Option A: 1-Command Docker Compose (Recommended)
Agar aapke system me Docker installed hai:
```bash
cd strapi
docker compose up -d
```
Strapi Admin panel open karein: `http://localhost:1337/admin`

### Option B: Native Node.js CLI (Quick Setup)
```bash
npx create-strapi-app@latest truthpulse-cms --quickstart
```
Isse local SQLite database ke saath Strapi ready ho jayega!

---

## 2. Article Content-Type Setup

1. Strapi Admin me login karein (`http://localhost:1337/admin`).
2. **Content-Type Builder** me jayein -> Create New Collection Type -> Display Name: `Article`.
3. Ya directly `strapi/schema/article.json` file ko copy karke `src/api/article/content-types/article/schema.json` me replace kar dein.

### Fields included:
- **title** (Short Text, Required)
- **slug** (UID, generated from Title)
- **summary** (Long Text, 60-80 words summary)
- **content** (Rich Text / Markdown / Blocks)
- **bullets** (JSON array: 3 Key takeaways)
- **category** (Enum: Business, Politics, Sports, Weather, Entertainment, Health, General)
- **region** (Enum: National, International)
- **state** (Text: Chhattisgarh, Maharashtra, Delhi, etc.)
- **city** (Text: Raigarh, Mumbai, etc.)
- **author** (Text: Editor Name)
- **trustScore** (Number: 0-100)
- **sources** (JSON: Verified URLs and News wires)
- **imageUrl** (Text / Media)
- **isPinned** (Boolean: Pin to #1 on front page)
- **Draft & Publish** (Native Strapi feature enabled)

---

## 3. Connect Strapi with TruthPulse

Apne `.env.local` me ye variables set karein:
```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_full_access_token_here
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_WEBHOOK_SECRET=truthpulse_strapi_secret_key
```

### Strapi me API Token generate karne ke liye:
1. Strapi Admin -> **Settings** -> **API Tokens** -> **Create new API Token**.
2. Name: `TruthPulse NextJS Client`.
3. Token type: `Full access`.
4. Copy token and paste into `STRAPI_API_TOKEN` in `.env.local`.

---

## 4. Automated Webhook (Publish in Strapi -> Live in TruthPulse)

Jab editor Strapi me article likhkar **Publish** click karega, Strapi Next.js ko notify karega:
1. Strapi Admin -> **Settings** -> **Webhooks** -> **Create new Webhook**.
2. Name: `TruthPulse Auto-Sync`.
3. URL: `http://localhost:3000/api/webhooks/strapi` (ya live production domain: `https://truth-pulse-coral.vercel.app/api/webhooks/strapi`).
4. Headers:
   - `Authorization`: `Bearer truthpulse_strapi_secret_key`
5. Events:
   - Check `Entry` -> `publish`, `unpublish`, `update`, `create`, `delete`.
6. Click **Save**.

Ab jab bhi Strapi me naya article publish hoga:
- TruthPulse MongoDB me automatically sync ho jayega.
- Cryptographic Merkle seal generate hogi.
- Live Real-Time SSE stream par breaking wire alert chala jayega!

---

## 5. Dual-Direction Publishing from TruthPulse Studio

- TruthPulse ke Editor Studio (`/studio`) se publish karne par:
  - Story live front page par pin hoti hai.
  - Automatically Strapi CMS me `/api/articles` par POST hokar create ho jaati hai!
