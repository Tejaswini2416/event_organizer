# Ventixe - Event Management & Collegiate MNC Platform

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
