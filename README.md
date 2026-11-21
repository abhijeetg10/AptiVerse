# AptiVerse 🚀
### Gamified Cognitive Aptitude & Corporate Assessment Platform

AptiVerse is an interactive, gamified assessment and placement training platform designed to sharpen cognitive aptitude, spatial reasoning, logical deduction, and verbal comprehension. Built for scale, it serves thousands of students across premier institutions preparing for top-tier hiring assessments (Infosys, TCS NQT, Cognizant, Wipro, Accenture).

---

## 🎮 Game Suite (8 Cognitive Challenges)

Each challenge targets specific cognitive competencies measured by top technology recruiters:

| Game | Domain | Description |
|---|---|---|
| **Motion Challenge** | Spatial & Planning | Navigate obstacles using minimal moves with shortest-path pathfinding mechanics. |
| **GeoSudoku** | Deductive Logic | Geometric symbol-based Sudoku with constraint satisfaction algorithms. |
| **Grid Challenge** | Working Memory | Multi-phase spatial recall combined with rapid visual symmetry checks. |
| **Switch Challenge** | Abstract Transformation | Identify the functional operator routing input sequences to target outputs. |
| **Inductive Challenge** | Pattern Recognition | Extrapolate progressive matrix rules and select matching geometric configurations. |
| **Data Interpretation (DI)** | Quantitative Analysis | High-velocity numerical queries with charts, tables, and data sufficiency logic. |
| **Reading Comprehension (RC)** | Verbal Reasoning | Timed technical and analytical passages testing inference and contextual recall. |
| **Queens Puzzle** | Constraint Satisfaction | Color-region non-attacking Queens problem inspired by LinkedIn Queens. |

---

## 🌟 Key Platform Features

- **Company-Specific Mock Tests**: Realistic timed simulations (e.g., Infosys Systems Engineer test with 5 comprehensive rounds, sectional cutoffs, and detailed answer keys).
- **Daily Hard Challenge**: Global daily cognitive puzzles with dedicated streak counters, solver tracking, and date-partitioned leaderboards.
- **Enterprise-Grade Leaderboards**:
  - Global Individual Leaderboards (Live percentile tracking, rating badges).
  - Inter-College Championship (Dynamic college-level point aggregation, AISHE standardization).
  - Filtered by department, institution, and performance tier.
- **Robust Anti-Cheat Engine**:
  - Monotonic timestamp validation and move sequence HMAC verification.
  - Rate-limited submission endpoints and replay-attack defenses.
  - Server-side RPC security definers ensuring score integrity.
- **Institutional Normalization**: Integrates official directory of 38,000+ Indian higher education institutions with real-time alias resolution (e.g., JECRC, VSB, CIT).

---

## 🏗️ Project Architecture

```
AptiGame/
├── public/                       # Static web assets & SEO
│   ├── data/colleges.json        # 38,000+ AISHE colleges directory
│   ├── ads.txt                   # Verified ad network configuration
│   ├── manifest.json             # PWA web manifest
│   ├── robots.txt & sitemap.xml  # Search engine indexing directives
│   └── sw.js                     # Ad network & caching service worker
├── scripts/                      # Generation, audit & integrity tooling
│   ├── verify_integrity.cjs      # Component & route integrity auditor
│   ├── verify_pre_deployment.cjs # Pre-deployment sanity checks
│   ├── verify_deployed_db.cjs    # Production database & view auditor
│   └── generate_levels.cjs       # Dynamic puzzle level generator
├── src/
│   ├── assets/                   # Brand icons, partner logos, visuals
│   ├── components/
│   │   ├── auth/                 # Protected routes & institution selector
│   │   ├── company/              # Mock interview room & test suites
│   │   ├── daily/                # Daily challenge boards & streak modals
│   │   ├── seo/                  # Dynamic meta headers & OG tags
│   │   └── ui/                   # Reusable atomic UI components
│   ├── constants/                # Curated college aliases & departments
│   ├── context/                  # React AuthContext & session state
│   ├── data/                     # Daily puzzles & mock exam questions
│   ├── games/                    # Self-contained game modules
│   │   ├── di/                   # Data Interpretation engine & levels
│   │   ├── grid/                 # Grid challenge generator & board
│   │   ├── inductive/            # Inductive logic matrix engine
│   │   ├── motion/               # Motion planning engine & solvers
│   │   ├── queens/               # Queens puzzle engine & solver
│   │   ├── rc/                   # Reading Comprehension passages
│   │   ├── sudoku/               # GeoSudoku generator & board
│   │   ├── switch/               # Switch challenge engine & levels
│   │   └── index.ts              # Unified game suite exports
│   ├── hooks/                    # Session, ratings, auto-advance hooks
│   ├── layout/                   # Navbar, Footer, and responsive wrappers
│   ├── lib/                      # Supabase client singleton
│   ├── pages/                    # Code-split page routes
│   └── utils/                    # College normalization & HMAC security
├── supabase/
│   ├── anticheat.sql             # Anti-cheat SQL policies & security functions
│   ├── schema.sql                # Base database schema & table definitions
│   └── migrations/               # Immutable version-controlled SQL migrations
├── tests/                        # Vitest automated test suites
├── index.html                    # Single-page application entry point
├── package.json                  # NPM scripts & dependencies
├── tailwind.config.js            # Tailwind styling design tokens
├── tsconfig.json                 # TypeScript compiler configurations
├── vercel.json                   # Edge routing & caching rules
└── vite.config.ts                # Vite build & manual code-splitting config
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Animation & UI**: Framer Motion, Lucide React, Canvas Confetti
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, Edge RPCs)
- **Search & Fuzzy Matching**: Fuse.js
- **Testing**: Vitest, Node Test Runner
- **Deployment**: Vercel (Edge CDN, automatic HTTPS, SPA fallbacks)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (Node 24 recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/AptiGame.git
cd AptiGame

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

### Local Development

```bash
# Start Vite development server
npm run dev

# Run Vitest test suite
npm run test

# Run code linter
npm run lint

# Build for production
npm run build
```

---

## 🛡️ Quality & Verification

AptiVerse maintains automated verification scripts to ensure production readiness before every deployment:

```bash
# Run full suite integrity audit
node scripts/verify_integrity.cjs

# Run pre-deployment sanity checks
node scripts/verify_pre_deployment.cjs

# Verify live database connectivity & view performance
node --env-file=.env scripts/verify_deployed_db.cjs
```

---

## 📄 License

Proprietary © AptiVerse Platform. All rights reserved.
