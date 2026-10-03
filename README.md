<div align="center">

# 🎯 NexusEvents — Student Event Discovery Platform

**Discover. Register. Attend. Grow.**

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

A high-performance **Event Discovery & Aggregation Platform** built specifically for college students to search, explore, and register for hackathons, tech summits, workshops, college fests, and MNC-hosted campus events — all in one place.

[Live Demo](https://github.com/Tejaswini2416/event_organizer) · [Report Bug](https://github.com/Tejaswini2416/event_organizer/issues) · [Request Feature](https://github.com/Tejaswini2416/event_organizer/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Event Categories](#-event-categories)
- [Pages & Routes](#-pages--routes)
- [Supabase Setup](#-supabase-setup)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Routes](#-api-routes)
- [Dynamic Event Lifecycle](#-dynamic-event-lifecycle)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About the Project

**NexusEvents** is a student-first event aggregation and discovery engine. It doesn't sell tickets — it **aggregates** event listings from platforms like Unstop, Devpost, GDG, Eventbrite, and college fest portals and redirects students directly to official registration pages.

Key goals:
- 🔍 **Search & discover** upcoming hackathons, tech events, college fests, and workshops
- 🎓 **Student-centric UX** with free/paid filters, deadline alerts, and bookmark features
- ⚡ **Real-time status updates** — events auto-close when registration deadlines pass
- 🌐 **External redirection** — clicking "Register" goes straight to the official event link
- 📅 **Add to Calendar** integration (Google Calendar / Apple Calendar)

---

## ✨ Key Features

### 🔍 Discovery Engine
- Instant search with autocomplete across all events
- Multi-tag filtering: category, location type, date range, entry fee
- Grid and List view toggle
- Pagination and infinite scroll

### 🏷️ Event Status Lifecycle (Automatic)

| Status | Condition |
|--------|-----------|
| 🟢 `UPCOMING` | Registration open, event hasn't started |
| 🔴 `REGISTRATION CLOSED` | Past registration deadline, event not yet started |
| 🟡 `LIVE` | Event currently in progress |
| ⚫ `COMPLETED` | Event has ended (archived automatically) |
| 🚫 `SOLD OUT` | Ticket capacity reached |

### 🎯 Student Utilities
- **Bookmark events** for later reference (persisted in `localStorage`)
- **Add to Calendar** — Google Calendar and Apple `.ics` download
- **Deadline countdown timer** — live ticking countdown on event cards
- **Registration deadline alerts** with visual badges

### 📡 Real-time Dynamic Sync
- **Supabase Realtime** channel subscription for instant event updates
- **15-second background ticker** to auto-close expired registrations
- **Cron API route** (`/api/cron/sync-events`) for scheduled aggregation
- Events pushed to Supabase are reflected live without page refresh

### 🏢 Organizer Dashboard (`/organizer`)
- Metric cards: Upcoming Events, Total Bookings, Tickets Sold, Total Earnings
- Donut chart: Ticket availability breakdown
- Bar chart: Monthly revenue vs profit
- Popular events progress breakdown
- Interactive calendar with event agenda

### 📱 QR Gate Scanner (`/organizer/scanner`)
- Simulated webcam viewfinder with laser scanning animation
- Multi-gate selector
- Real-time duplicate entry fraud detection
- Quick simulation test buttons

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript 5.x |
| **UI Library** | React 19 |
| **Styling** | CSS Modules + Global CSS (custom design system) |
| **Database** | Supabase (PostgreSQL) |
| **Realtime** | Supabase Realtime Channels |
| **Auth** | Supabase Auth (JWKS) |
| **State** | React Context API (`AppContext`) |
| **Icons** | Lucide React |
| **QR Codes** | `qrcode.react` (SVG-based) |
| **Deployment** | Vercel (recommended) |

---

## 📁 Project Structure

```
event_organizer/
├── public/
│   └── events/                    # Event banner images
│       ├── google-campus.jpg
│       ├── microsoft-azure.jpg
│       ├── meta-ai.jpg
│       ├── nvidia-deeplearning.jpg
│       ├── tech-summit.jpg
│       └── ...
│
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── page.tsx               # Home / Discovery feed
│   │   ├── layout.tsx             # Root layout with providers
│   │   ├── globals.css            # Global design tokens & styles
│   │   ├── events/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Event detail page
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Student pass wallet
│   │   ├── organizer/
│   │   │   ├── page.tsx           # Organizer analytics dashboard
│   │   │   ├── create/
│   │   │   │   └── page.tsx       # Create new event form
│   │   │   └── scanner/
│   │   │       └── page.tsx       # QR gate scanner
│   │   ├── submit-event/
│   │   │   └── page.tsx           # Community event submission
│   │   └── api/
│   │       ├── events/
│   │       │   ├── search/        # Full-text search endpoint
│   │       │   └── sync/          # Manual sync trigger
│   │       ├── cron/
│   │       │   └── sync-events/   # Scheduled event aggregation
│   │       └── checkin/           # QR check-in validation
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Navbar.tsx             # Top navigation with category links
│   │   ├── EventCard.tsx          # Event card (grid + list variants)
│   │   ├── Footer.tsx             # Site footer
│   │   ├── TicketCheckoutModal.tsx # Registration / ticket flow
│   │   └── QRScannerModal.tsx     # QR code scanner modal
│   │
│   ├── context/
│   │   └── AppContext.tsx         # Global state: events, bookmarks, sync
│   │
│   ├── lib/
│   │   ├── mockData.ts            # Seed event data (50+ events)
│   │   ├── supabase.ts            # Supabase client initialization
│   │   ├── eventLifecycle.ts      # Status computation helpers
│   │   └── urlUtils.ts            # External URL resolution per source
│   │
│   └── types/
│       └── index.ts               # TypeScript interfaces & enums
│
├── supabase/
│   └── schema.sql                 # Full DB schema: tables, enums, RLS
│
├── .env.local                     # ⚠️ Never commit — see setup below
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗂️ Event Categories

| Category | Icon | Examples |
|----------|------|---------|
| `HACKATHON` | 💻 | Smart India Hackathon, Electrothon, HackWithInfy |
| `TECH_EVENT` | 🔬 | Google Cloud Summit, NVIDIA AI Day, AWS Bootcamp |
| `WORKSHOP` | 🛠️ | DSA Bootcamp, UI/UX Intensive, ML Paper Reading |
| `COLLEGE_FEST` | 🎓 | Techfest IIT Bombay, Kurukshetra NIT-T, Saarang IIT-M |
| `WEBINAR` | 🎙️ | Resume Reviews, FAANG Interview Prep, Open Source |
| `CONFERENCE` | 🏛️ | Grace Hopper, PyCon India, NASSCOM Student Summit |
| `INTERNSHIP_FAIR` | 💼 | LinkedIn Career Day, Goldman Sachs Campus Connect |
| `COMPETITION` | 🏆 | Codechef contests, ACM-ICPC regionals |

---

## 📄 Pages & Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home — event discovery feed with search & filters | Public |
| `/events/[id]` | Event detail page with countdown, tags, register CTA | Public |
| `/dashboard` | Student pass wallet — bookmarks & QR tickets | Student |
| `/organizer` | Analytics dashboard — metrics, charts, calendar | Organizer |
| `/organizer/create` | Create / submit a new event listing | Organizer |
| `/organizer/scanner` | QR code gate scanner for check-in | Organizer |
| `/submit-event` | Community crowdsourced event submission form | Public |

---

## 🗄️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema in your Supabase SQL editor:

```bash
# Open supabase/schema.sql and paste its contents into:
# Supabase Dashboard → SQL Editor → New Query → Run
```

3. Enable **Realtime** for the `events` table:
   - Supabase Dashboard → Database → Replication → Toggle `events` table **ON**

4. Configure your environment variables (see below)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- A Supabase project (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Tejaswini2416/event_organizer.git
cd event_organizer

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Create .env.local and add your Supabase credentials (see below)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory. **Never commit this file.**

```env
# Supabase Project URL (from: Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon/Public Key (safe for browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_anon_key

# Supabase Service Role Key (server-side only — keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your_secret_service_role_key

# JWKS URL for auth token verification
SUPABASE_JWKS_URL=https://your-project-id.supabase.co/auth/v1/.well-known/jwks.json
```

> 💡 Find your keys at: **Supabase Dashboard → Project Settings → API**

---

## 🔌 API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events/search` | `GET` | Full-text search with filters (`?q=`, `?category=`, `?city=`) |
| `/api/events/sync` | `POST` | Manually trigger event sync from external sources |
| `/api/cron/sync-events` | `GET` | Cron-triggered aggregation (call via Vercel Cron Jobs) |
| `/api/checkin` | `POST` | Validate QR ticket and mark attendance |

### Example: Search API

```bash
GET /api/events/search?q=hackathon&category=HACKATHON&city=Bangalore
```

```json
{
  "events": [...],
  "total": 12,
  "page": 1
}
```

---

## ⚡ Dynamic Event Lifecycle

Events are automatically managed by `AppContext.tsx`:

```
┌─────────────┐   deadline passes    ┌──────────────────────┐
│  UPCOMING   │ ───────────────────▶ │  REGISTRATION CLOSED │
└─────────────┘                      └──────────────────────┘
       │                                          │
  startDate                                  startDate
  reached                                    reached
       │                                          │
       ▼                                          ▼
┌─────────────┐                      ┌──────────────────────┐
│    LIVE     │ ── endDate passes ──▶ │      COMPLETED       │
└─────────────┘                      └──────────────────────┘
```

- **15-second background ticker** runs in the browser to check deadlines
- **Supabase Realtime** subscription picks up new events pushed to the DB
- Completed events are automatically archived and removed from the main feed

---

## 📊 Event Sources Aggregated

| Platform | Event Types | Link |
|----------|-------------|------|
| **Unstop** | Hackathons, Competitions, Quizzes | [unstop.com](https://unstop.com) |
| **Devpost** | Global Hackathons | [devpost.com](https://devpost.com) |
| **GDG** | Google Developer Events | [gdg.community.dev](https://gdg.community.dev) |
| **Eventbrite** | Workshops, Conferences | [eventbrite.com](https://eventbrite.com) |
| **HackerEarth** | Coding Challenges | [hackerearth.com](https://hackerearth.com) |
| **Dare2Compete** | College Fests, MNCs | [dare2compete.com](https://dare2compete.com) |
| **LinkedIn Events** | Career Fairs, Webinars | [linkedin.com/events](https://linkedin.com/events) |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Built with ❤️ for students, by students.

**[⭐ Star this repo](https://github.com/Tejaswini2416/event_organizer)** if you find it useful!

</div>


Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Supabase (PostgreSQL)**.

Ventixe has been transformed to match the modern **Figma Ventixe Admin Dashboard** aesthetic (by Peterdraw) with an ultra-clean lavender-gray palette (`#f8f9fe`), crisp white cards, signature hot magenta/pink branding (`#e11d48` / `#db2777`), and authentic collegiate events hosted by leading MNC companies.

---

## 🏢 MNC Student Events Catalog

Tailored specifically for university students to accelerate internships, claim free certification vouchers, and gain direct hiring referrals:

| MNC Host | Event Title | Format | Student Perks | Pass Type |
|---|---|---|---|---|
| **Google** | [Google Cloud & Vertex AI Campus Hackathon 2026](file:///c:/Users/Tejaswini/Desktop/event_organizer/public/events/google-campus.jpg) | Hybrid | Direct SWE 2027 Interview Fast-Track, $500 GCP Credits, Google Swag | **100% Free** |
| **Microsoft** | [Microsoft Azure Future Innovators Summit & Career Fair](file:///c:/Users/Tejaswini/Desktop/event_organizer/public/events/microsoft-azure.jpg) | Hybrid | 1-on-1 Resume Clinic with Recruiters, Free AZ-900 Exam Voucher ($99 value) | **100% Free** |
| **Meta** | [Meta Reality Labs & PyTorch Open Source AI Day](file:///c:/Users/Tejaswini/Desktop/event_organizer/public/events/meta-ai.jpg) | In-Person | $10,000 Open Source Student Fellowships, Meta Quest 3 Testing Lab | **100% Free** |
| **NVIDIA** | [NVIDIA Deep Learning Institute & CUDA Student Masterclass](file:///c:/Users/Tejaswini/Desktop/event_organizer/public/events/nvidia-deeplearning.jpg) | Hybrid | Official NVIDIA DLI Certificate of Competency, 100 Free GPU Hours on H100 | **100% Free** |
| **Amazon AWS** | Amazon AWS Next-Gen Cloud Architect & SDE Bootcamp | Hybrid | AWS Cloud Practitioner Voucher, Direct SDE Intern Online Assessment | **100% Free** |
| **Apple** | Apple Student Swift & Spatial Computing VisionOS Challenge | Hybrid | Swift Student Challenge 2026 Mentorship, Direct WWDC Invitation Track | **100% Free** |
| **Goldman Sachs**| Goldman Sachs Engineering & Quant Tech Campus Symposium | In-Person | Summer Analyst Fast-Track, Women in Tech Scholarships ($5,000 awards) | **100% Free** |
| **Tesla** | Tesla Autonomous Systems & Robotics Engineering Day | In-Person | Giga Texas Factory Tour, On-Site Technical Screening for Robotics Interns | **100% Free** |

---

## 🎨 Ventixe UI Design & Features

### 1. Ventixe Admin Dashboard (`/organizer`)
Matches the Figma screenshot layout:
* **Left Sidebar**: Ventixe origami folded ribbon logo, navigation links (`Dashboard`, `Bookings`, `MNC Events`, `Calendar`, `Invoices`, `Inbox`, `Financials`, `Feedback`).
* **Top Metric Cards**:
  * 📅 `Upcoming Events`: **345** (pink calendar icon in soft pink rounded card)
  * 🎟️ `Total Bookings`: **1,798** (magenta ticket icon in soft pink card)
  * 🎫 `Tickets Sold`: **1,250** (violet ticket icon in soft purple card)
  * 💰 `Total Earnings`: **$275,450** (green wallet icon)
* **Ticket Sales Donut Chart**:
  * Visual donut ring with center label: `Total Ticket: 2,780`
  * Breakdown: **Sold Out 45%** (1,251 - Hot Pink), **Fully Booked 30%** (834 - Violet), **Available 25%** (695 - Navy).
* **Sales Revenue Bar Chart**:
  * Gross revenue: **$348,805** with `+$98,322` indicator.
  * Monthly dual-tone gradient bars (Jan to Aug) for Revenue vs Profit.
* **Featured Upcoming Event Widget**:
  * Image banner with category badge, date, time, and pink `View Details` action.
* **Popular Events Breakdown**:
  * Progress bars for *MNC Tech & Hackathons (40%)*, *AI & Cloud (35%)*, *Career & Internships (15%)*, and *Student Competitions (10%)*.
* **Interactive Mini Calendar**:
  * Month grid with active date circle on day 14 and upcoming agenda items.

---

### 2. Student Discovery Portal (`/`)
* **MNC Quick Filters**: 1-click filter by host company (`Google`, `Microsoft`, `Meta`, `NVIDIA`, `Amazon`, `Apple`, `Goldman Sachs`, `Tesla`).
* **Student Specific Filters**:
  * `100% Free for College Students` toggle.
  * `Includes Direct Internship Fast-Track` toggle.
* **Grid and List View**: Switch between responsive card views.
* **Free Student Registration**:
  * Claim student passes with university email (.edu) and college name.
  * Instant QR code ticket generation without requiring credit card numbers.

---

### 3. Student Pass Wallet (`/dashboard`)
* View digital passes with high-resolution `QRCodeSVG` codes.
* Displays verified student credentials (`Tejaswini Sharma`, `STU-2026-8812`, `University Institute of Technology`).
* 1-Click pass print and transfer options.

---

### 4. Real-time Gate Access Scanner (`/organizer/scanner`)
* Simulated 1080p webcam viewfinder with animated glowing laser scanning beam.
* Multi-gate selector (`Gate 1 - Google Campus Concourse`, `Gate 2 - Microsoft Silicon Valley`, etc.).
* 1-Click quick simulation testing buttons for registered tickets (e.g. `VTX-8492-STU`).
* Real-time duplicate entry fraud detection.

---

## 🗄️ Supabase Configuration

Your project credentials must be configured in `.env.local` (never commit this file):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_secret_key
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json
```

The complete database schema with tables, enums, triggers, and RLS policies is available in:
📁 [`supabase/schema.sql`](file:///c:/Users/Tejaswini/Desktop/event_organizer/supabase/schema.sql)

---

## 🚀 Running Locally
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to explore!
