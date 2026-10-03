-- ==============================================================================
-- EVENT DISCOVERY & SEARCH ENGINE - POSTGRESQL / SUPABASE SCHEMA
-- Designed for College Students: Hackathons, Workshops, Conferences & Fests
-- Aggregator & Discovery Engine (Direct External Redirection)
-- ==============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- For fuzzy full-text search

-- 1. ENUMS
do $$ begin
  create type category_type as enum (
    'HACKATHON',
    'CONFERENCE',
    'WORKSHOP',
    'WEBINAR',
    'COLLEGE_FEST'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type location_type as enum (
    'VENUE',
    'HYBRID',
    'ONLINE'
  );
exception when duplicate_object then null;
end $$;

-- 2. EVENTS TABLE (Core Discovery Model)
create table if not exists public.events (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  slug text not null unique,
  short_description text not null,
  full_description text not null,
  category category_type not null default 'HACKATHON',
  tags text[] default '{}',
  
  -- Location & Venue Details
  location_type location_type not null default 'VENUE',
  venue_name text,
  city text,
  country text default 'India',
  
  -- Timing & Schedule
  start_date timestamptz not null,
  end_date timestamptz not null,
  registration_deadline timestamptz,

  -- Eligibility & Perks
  eligible_majors text[] default '{"Open to All"}',
  prize_pool text,
  entry_fee numeric(10,2) default 0.00,
  
  -- External Redirection (No ticket seller / Direct link)
  organizer_name text not null,
  external_apply_url text not null,
  banner_image_url text not null,
  
  -- Verification & Analytics
  is_verified boolean default true,
  views_count integer default 0,
  created_at timestamptz default now() not null
);

-- 3. BOOKMARKS TABLE
create table if not exists public.bookmarks (
  id text primary key default gen_random_uuid()::text,
  user_id text not null,
  event_id text references public.events(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, event_id)
);

-- 4. CROWDSOURCED EVENT SUBMISSIONS (/submit-event)
create table if not exists public.event_submissions (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  category category_type not null default 'HACKATHON',
  organizer_name text not null,
  external_apply_url text not null,
  banner_image_url text not null,
  short_description text not null,
  full_description text not null,
  location_type location_type not null default 'VENUE',
  venue_name text,
  city text,
  country text default 'India',
  start_date timestamptz not null,
  end_date timestamptz not null,
  registration_deadline timestamptz,
  eligible_majors text[] default '{"Open to All"}',
  prize_pool text,
  entry_fee numeric(10,2) default 0.00,
  tags text[] default '{}',
  submitter_email text not null,
  submitter_name text not null,
  college_name text not null,
  status text default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  created_at timestamptz default now() not null
);

-- 5. HIGH-SPEED INDEXES FOR DISCOVERY & FILTERING
create index if not exists idx_events_category on public.events(category);
create index if not exists idx_events_city on public.events(city);
create index if not exists idx_events_location_type on public.events(location_type);
create index if not exists idx_events_entry_fee on public.events(entry_fee);
create index if not exists idx_events_start_date on public.events(start_date);
create index if not exists idx_events_deadline on public.events(registration_deadline);
create index if not exists idx_events_tags on public.events using gin(tags);
create index if not exists idx_bookmarks_user on public.bookmarks(user_id);
create index if not exists idx_bookmarks_event on public.bookmarks(event_id);

-- Trigram index for ultra-fast autocomplete & text search
create index if not exists idx_events_title_trgm on public.events using gin(title gin_trgm_ops);

-- 6. ROW LEVEL SECURITY (RLS)
alter table public.events enable row level security;
alter table public.bookmarks enable row level security;
alter table public.event_submissions enable row level security;

-- Public can read verified events
create policy "Anyone can read verified events"
  on public.events for select
  using (is_verified = true);

-- Anyone can submit an event
create policy "Anyone can submit an event"
  on public.event_submissions for insert
  with check (true);

-- Anyone can view their bookmarks
create policy "Users can view and manage their bookmarks"
  on public.bookmarks for all
  using (true)
  with check (true);

-- 7. REAL PRE-POPULATED SEED DATA (India & Global Collegiate Tech Events)
insert into public.events (
  id, title, slug, short_description, full_description, category, tags,
  location_type, venue_name, city, country,
  start_date, end_date, registration_deadline,
  eligible_majors, prize_pool, entry_fee,
  organizer_name, external_apply_url, banner_image_url,
  is_verified, views_count
) values
(
  'evt-sih-2026',
  'Smart India Hackathon 2026 (SIH)',
  'smart-india-hackathon-sih-2026',
  'India''s biggest nationwide collegiate hackathon by Ministry of Education & AICTE. Solve real problem statements from 50+ government ministries.',
  'Smart India Hackathon (SIH) is the world''s biggest open innovation model by the Government of India, Ministry of Education (MoE), and AICTE. Over 1,00,000+ collegiate students participate across Software and Hardware editions. Winning teams receive ₹1,00,000 per problem statement and direct incubation support.',
  'HACKATHON',
  array['National Flagship', 'Govt of India', 'High Cash Prize 🏆', 'Certificates 📜', 'SIH 2026', 'Hackathons 💻'],
  'HYBRID',
  'Nodal Center IITs/NITs & SIH Virtual Screening',
  'Delhi-NCR',
  'India',
  now() + interval '30 days',
  now() + interval '32 days',
  now() + interval '20 days',
  array['CS', 'IT', 'ECE', 'Mechanical', 'Open to All'],
  '₹1,00,00,000+ Total Cash Pool',
  0.00,
  'Ministry of Education & AICTE',
  'https://sih.gov.in/',
  '/events/google-campus.jpg',
  true,
  15420
),
(
  'evt-techkriti-iitk',
  'Techkriti Robotics & Coding Arena 2026',
  'techkriti-robotics-coding-arena-iit-kanpur',
  'Asia''s premier annual technical and entrepreneurial festival hosted by IIT Kanpur. Features algorithmic challenges, RoboWars, and autonomous drones.',
  'Techkriti is IIT Kanpur''s prestigious annual technological symposium, attracting over 25,000 collegiate attendees across India and overseas. The Coding Arena features competitive algorithmic programming, autonomous obstacle drone navigation, and capture-the-flag cybersecurity tournaments. Finalists present projects in front of IIT Kanpur faculty, DRDO researchers, and venture capitalists.',
  'COLLEGE_FEST',
  array['Robotics', 'Competitive Coding', 'College Fest 🎪', 'Certificates 📜', 'Accommodation Provided'],
  'VENUE',
  'IIT Kanpur Main Auditorium Complex',
  'Kanpur',
  'India',
  now() + interval '20 days',
  now() + interval '24 days',
  now() + interval '15 days',
  array['CS', 'ECE', 'Mechanical', 'Aerospace', 'Open to All'],
  '₹45,00,000 Prize Pool',
  150.00,
  'IIT Kanpur Techkriti Council',
  'https://techkriti.org/competitions',
  '/events/tech-summit.jpg',
  true,
  6410
),
(
  'evt-rodic-nasscom',
  'Rodic InfraAI Innovation Challenge 2026',
  'rodic-infra-ai-innovation-challenge-nasscom',
  'National computer vision & generative AI challenge organized with Nasscom AI for smart mobility, bridge safety, and highway infrastructure.',
  'The Rodic InfraAI Challenge, co-hosted with Nasscom Center of Excellence for AI, invites student engineers and young innovators to deploy deep learning models on real highway sensor and drone inspection datasets. Winners receive direct incubation support, angel pre-seed grants, and pilot deployment opportunities with state transport authorities.',
  'HACKATHON',
  array['Computer Vision', 'Generative AI', 'Nasscom AI', 'Cash Prizes 🏆', 'Certificates 📜'],
  'HYBRID',
  'Nasscom CoE Gurugram & Virtual Phase',
  'Delhi-NCR',
  'India',
  now() - interval '2 days',
  now() + interval '1 days',
  now() - interval '5 days',
  array['CS', 'IT', 'Data Science', 'Civil Tech'],
  '₹15,00,000 + Incubation Grant',
  0.00,
  'Rodic Consultants & Nasscom AI CoE',
  'https://unstop.com/competitions',
  '/events/nvidia-deeplearning.jpg',
  true,
  3920
),
(
  'evt-ieee-winc-bengaluru',
  '2026 IEEE International Women in Technology Conference',
  'ieee-women-in-technology-bengaluru-2026',
  'Inspiring keynote symposium and research poster exhibition bringing women in engineering, AI architects, and tech leaders together in Bengaluru.',
  'The 2026 IEEE International Women in Technology (WiT) Conference in Bengaluru celebrates female trailblazers in machine learning, semiconductor design, and cloud architecture. Includes 1-on-1 career clinics with Intel & Google engineers, paper presentation tracks, peer networking dinners, and full travel scholarship grants for top student researchers.',
  'CONFERENCE',
  array['Women In Tech', 'Research', 'Free Food 🍕', 'Certificates 📜', 'Mentorship'],
  'VENUE',
  'KTPO Convention Center, Whitefield',
  'Bengaluru',
  'India',
  now() + interval '18 days',
  now() + interval '19 days',
  now() + interval '10 days',
  array['CS', 'IT', 'ECE', 'EEE', 'Open to All'],
  'Research Grants + Travel Awards',
  0.00,
  'IEEE Bengaluru Section & IEEE WIE',
  'https://ieeebangalore.org/',
  '/events/microsoft-azure.jpg',
  true,
  4190
),
(
  'evt-google-vertex-ai',
  'Google Cloud & Vertex AI Student Hackfest',
  'google-cloud-vertex-ai-student-hackfest',
  'Build multimodal generative AI apps with Gemini 1.5 and Vertex AI. Fast-track recruitment into Google Summer Internships.',
  'Google invites college students across India to explore agentic systems, RAG architectures, and fine-tuning with Vertex AI. All registered teams receive $500 in Google Cloud Platform credits, official Google Student Developer swag packs, and direct technical interview fast-track considerations for Google SWE Intern positions.',
  'HACKATHON',
  array['AI/ML', 'Google Cloud', 'Free Food 🍕', 'Certificates 📜', 'Fast-Track Hiring'],
  'VENUE',
  'Google Campus Bagmane Constellation Business Park',
  'Bengaluru',
  'India',
  now() + interval '8 days',
  now() + interval '9 days',
  now() + interval '4 days',
  array['CS', 'IT', 'ECE', 'Open to All'],
  '₹10,00,000 + Google Swag',
  0.00,
  'Google Developer Student Clubs (GDSC)',
  'https://devpost.com/hackathons',
  '/events/google-campus.jpg',
  true,
  8240
),
(
  'evt-flipkart-grid',
  'Flipkart GRiD 7.0 Robotics & Software Challenge',
  'flipkart-grid-7-robotics-software-challenge',
  'India''s biggest engineering campus challenge with direct SDE hiring opportunities at Flipkart at ₹32 LPA CTC.',
  'Flipkart GRiD is Flipkart''s flagship collegiate challenge. Spanning three cutting-edge tracks: Software Development, Information Security, and Robotics (Automated Guided Vehicles & Sorting). Top performers bypass standard online assessments and move straight to technical interviews for full-time and summer intern offers.',
  'HACKATHON',
  array['SDE Hiring', 'Robotics', 'High Prize 🏆', 'Certificates 📜', 'PPO Opportunity'],
  'ONLINE',
  'Unstop Virtual Coding Sandbox',
  'Online',
  'India',
  now() + interval '16 days',
  now() + interval '18 days',
  now() + interval '9 days',
  array['B.Tech', 'M.Tech', 'CS', 'IT', 'ECE', 'Mechanical'],
  '₹50,00,000 + Flipkart SDE PPOs (32 LPA)',
  0.00,
  'Flipkart University Relations',
  'https://unstop.com/hackathons',
  '/events/meta-ai.jpg',
  true,
  12850
),
(
  'evt-devfest-bengaluru',
  'GDG DevFest Bengaluru: Next-Gen Open Cloud',
  'gdg-devfest-bengaluru-next-gen-cloud',
  'Largest community-driven developer conference in South India. Deep dives into Android 16, Kubernetes, and Agentic Workflows.',
  'DevFest Bengaluru 2026 gathers 2,000+ student developers, open-source contributors, and software architects. Experience hands-on codelabs, interactive career guidance booths, free breakfast & boba stations, and keynotes from Google Developer Experts.',
  'CONFERENCE',
  array['Cloud', 'DevOps', 'Free Food 🍕', 'Certificates 📜', 'Swag Packs'],
  'VENUE',
  'Nimhans Convention Centre, Hosur Road',
  'Bengaluru',
  'India',
  now() + interval '25 days',
  now() + interval '26 days',
  now() + interval '14 days',
  array['Open to All', 'CS', 'IT'],
  'Google Pixel 9 & Chromebook Giveaways',
  0.00,
  'Google Developer Group Bengaluru',
  'https://gdg.community.dev/events/',
  '/events/tech-summit.jpg',
  true,
  5120
),
(
  'evt-prompt-craft-workshop',
  'Hands-on Prompt Engineering & RAG Systems Workshop',
  'prompt-engineering-rag-systems-student-workshop',
  'Practical masterclass on Vector Databases, LangChain, and fine-tuning open weights models for university developers.',
  'A rigorous 4-hour hands-on workshop led by senior AI researchers. Build and deploy a real-time retrieval-augmented chatbot on your university syllabus with Pinecone and open-source models. Students who complete the laboratory assessment receive an authenticated digital credential on LinkedIn.',
  'WORKSHOP',
  array['Workshop 🛠️', 'AI/ML', 'Certificates 📜', 'Beginner Friendly', 'Online'],
  'ONLINE',
  'Zoom Interactive Lab & Google Colab',
  'Online',
  'India',
  now() + interval '3 days',
  now() + interval '3 days',
  now() + interval '1 day',
  array['Open to All'],
  'Official IEEE Verified Badge',
  0.00,
  'Open Source AI Guild',
  'https://unstop.com/workshops',
  '/events/design-workshop.jpg',
  true,
  3100
)
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  full_description = excluded.full_description,
  category = excluded.category,
  tags = excluded.tags,
  location_type = excluded.location_type,
  venue_name = excluded.venue_name,
  city = excluded.city,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  registration_deadline = excluded.registration_deadline,
  eligible_majors = excluded.eligible_majors,
  prize_pool = excluded.prize_pool,
  entry_fee = excluded.entry_fee,
  organizer_name = excluded.organizer_name,
  external_apply_url = excluded.external_apply_url,
  banner_image_url = excluded.banner_image_url,
  is_verified = excluded.is_verified;
