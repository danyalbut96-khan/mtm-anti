# 🏥 Smart Doctor Connect AI

Welcome to **Smart Doctor Connect AI**, a complete end-to-end medical tele-health and intelligent appointment booking application. This platform integrates automated clinical flows, dynamic doctor matching via Claude AI, secure Supabase storage, and Resend notification triggers for seamless health networking.

---

## 🚀 Key Application Features

### 🤖 AI Infrastructure
- **Claude Matching System**: Dynamically extracts symptoms from raw language user queries into definitive doctor specializations via the Anthropic Claude `messages` API endpoint.
- **Automated AI Chat Triage**: Built-in intelligent responder acting as Dr's front-desk. If a doctor switches to `Offline` status in their dashboard, Claude directly interfaces with patients inside chat to structure clinical descriptions.

### 👨‍⚕️ Clinical Dashboards & Engine
- **Full Profile Discovery Engine**: Fast indexed search for medical professionals by speciality, city, or consultation mode preference.
- **Appointment Orchestrator**: Step-wizard booking architecture backed by a server-side conflict-resolution listener to prevent overlapping appointment schedules.
- **Status Controls**: Real-time Availability toggles for practitioner portals allowing instant traffic manipulation for AI fallback routing.

### 🔔 Automated Communications
- Immediate **Resend.email** webhook triggers transmitting transactional receipts to doctors instantly on patient confirmed checkout.

---

## 🛠️ Technology Stack

| Domain | Solution |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router architecture) |
| **Database** | PostgreSQL on Supabase |
| **Authentication** | Supabase Auth hooks |
| **LLM Driver** | `@anthropic-ai/sdk` (Claude 3.5 Sonnet) |
| **Styling** | Global utility CSS custom property system (Inter Typography) |
| **Notifications** | Resend Email API |

---

## ⚙️ Getting Started & Installation

### 1. Clone the Setup & Install
Navigate to the codebase and run the dependency initializer:

```bash
cd smart-doctor-connect-app
npm install
```

### 2. Environment Configuration
Ensure the following variables exist in a `.env.local` root file:
(Reference template inside `.env.local.example` file):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
ANTHROPIC_API_KEY=sk-ant-xxxxxx
RESEND_API_KEY=re_xxxxxxx
```

### 3. Database Hydration
Execute the included robust [supabase-schema.sql](./supabase-schema.sql) directly inside your Supabase **SQL Editor** window to instantiate the complete data relation tree including:
- Doctors, Patients, Messages schemas
- Relational Appointment foreign-key bindings
- Base Row-Level Security (RLS) scaffolding

### 4. Launch the Runtime
Start up the fast-development node server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to preview live iteration.

---

## 📂 Solution Directory Tree

```txt
src/
├── app/
│   ├── api/              # Secure serverless endpoint layer (AI / Booking / Chat)
│   ├── auth/             # Dynamic entry gateway for patient & doctor auth
│   ├── booking/          # Context-aware scheduling step-wizard
│   ├── dashboard/        # Role-separated Patient and Provider hub zones
│   ├── doctor/           # Dynamic SSR medical detail rendering
│   ├── search/           # Client-side hydration filtering engine
│   ├── layout.tsx        # Unified global shell & navigation router
│   └── page.tsx          # Premium impact landing experience
├── lib/
│   └── supabase.ts       # Modular clients (SSR cookies, Browser, & Admin bypass)
└── middleware.ts         # Active session router guarding /dashboard paths
```

---

Developed with high standards for performance, modular separation of concerns, and clean AI pipelines. Enjoy using **SmartDoc AI**! 🌟
