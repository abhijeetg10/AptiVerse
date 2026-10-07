---
title: "AptiVerse Project Presentation & Documentation"
author: "Project Team"
date: "October 2026"
geometry: margin=2cm
---

# 🚀 AptiVerse: The Ultimate Gamified Aptitude Platform

## 📌 1. Project Overview & Pitch Script

**Slide 1: Introduction**
* **Visual:** AptiVerse Logo with a sleek, animated background (using Framer Motion).
* **Speaker Script:** "Hello everyone. Welcome to our presentation on AptiVerse. Traditional aptitude preparation can be monotonous and dry. We built AptiVerse to bridge the gap between learning and gaming. AptiVerse is a comprehensive, gamified platform designed to help students prepare for placements and competitive exams through engaging, interactive challenges."

**Slide 2: The Problem & Our Solution**
* **Visual:** Split screen showing a boring textbook vs. an interactive, animated UI.
* **Speaker Script:** "Students often lose focus when practicing traditional quantitative and logical reasoning questions. Our solution introduces game mechanics—like levels, leaderboards, and instant feedback—into aptitude tests. By combining modern web technologies with cognitive psychology, we keep users engaged for longer periods, significantly improving their retention and problem-solving speed."

**Slide 3: Core Features**
* **Visual:** Bullet points with Lucide icons (User, Trophy, Gamepad, Chart).
* **Speaker Script:** "AptiVerse includes several core features: 
  1. **Diverse Game Modules:** Ranging from logic puzzles like Motion Challenge to Data Interpretation.
  2. **Real-time Leaderboards:** Fostering healthy competition.
  3. **Progress Tracking:** Detailed analytics on student performance.
  4. **Seamless Authentication:** Google OAuth and secure email logins.
  5. **Admin Dashboard:** For educators to monitor progress and manage content."

---

## 🛠️ 2. Technology Stack

AptiVerse is built on a modern, high-performance web stack ensuring scalability, responsive design, and smooth animations.

### Frontend
* **Core Framework:** **React 19** with **TypeScript** for robust, type-safe UI components.
* **Build Tool:** **Vite**, providing lightning-fast HMR and optimized production builds.
* **Routing:** **React Router v7** for seamless client-side navigation.
* **Styling & UI:** **Tailwind CSS v4** for utility-first styling.
* **Animations:** **Framer Motion** to deliver premium micro-interactions, page transitions, and smooth game mechanics.
* **Icons & Utils:** **Lucide React** for crisp vector icons; `clsx` and `tailwind-merge` for dynamic class merging.

### Backend & Database (BaaS)
* **Platform:** **Supabase** (Open-source Firebase alternative).
* **Database:** PostgreSQL (managed by Supabase).
* **Authentication:** Supabase Auth (Email/Password, Google OAuth).
* **Storage & API:** Supabase Auto-generated REST APIs and Row Level Security (RLS) for data protection.

---

## 🗄️ 3. Database Architecture & Schema (Supabase PostgreSQL)

AptiVerse uses **Supabase**, which provides a fully managed PostgreSQL database. Connection is established via the `@supabase/supabase-js` client using a singleton pattern.

### Database Connection (`src/lib/supabase.ts`)
The connection is initialized once using environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`). This client is imported across the app to perform data operations.
```typescript
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Core Database Schemas

1. **`auth.users` (Managed by Supabase):**
   - Handles secure credential storage, OAuth linking, password hashing, and session management.

2. **`public.profiles` (Custom Table):**
   - **`id` (UUID):** Primary Key. Foreign Key referencing `auth.users(id)`. Ensures a 1-to-1 relationship.
   - **`name` (String):** Full name of the user.
   - **`college` (String):** Educational institution name. Used for demographics and filtering.
   - **`avatar_url` (String):** URL to the user's profile picture.
   - **`role` (String):** Determines access level (e.g., `'user'` vs `'admin'`). Defaults to `'user'`.
   - **`updated_at` (Timestamp):** Tracks when the profile was last modified.

3. **`public.game_sessions` (Custom Table for Analytics):**
   - **`id` (UUID):** Primary Key. Auto-generated.
   - **`user_id` (UUID):** Foreign Key referencing `auth.users(id)`.
   - **`game_id` (String):** Identifier for the game module (e.g., `'motion'`, `'sudoku'`, `'di'`).
   - **`level` (Int):** The difficulty or level number completed.
   - **`score` (Int):** Points achieved during the session.
   - **`accuracy` (Float):** Percentage of correct moves/answers.
   - **`time_spent` (Int):** Time taken in seconds to complete the level.
   - **`passed_distraction` (Boolean):** Specific to aptitude modules where cognitive load/distractions are tested.
   - **`created_at` (Timestamp):** When the session was recorded.

---

## 🌐 4. APIs & Data Fetching Flow

Because AptiVerse relies on Supabase (BaaS), we do not maintain a traditional Node.js Express server. Instead, we interact directly with Supabase's auto-generated REST APIs and GraphQL equivalents via the Supabase Client.

### 1. Authentication APIs
Handled via `supabase.auth` inside `src/context/AuthContext.tsx`.
- **Sign In / Sign Up:** `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`.
- **OAuth (Google):** `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- **Session Management:** `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()` to listen for token refreshes and login/logout events dynamically.

### 2. Database APIs (CRUD Operations)
The frontend executes SQL-like queries using the Supabase SDK. 
- **Inserting Game Data (`useGameSession.ts`):** 
  ```typescript
  const { error } = await supabase.from('game_sessions').insert({
    user_id: authUser.id,
    game_id: gameId,
    level,
    score,
    accuracy,
    time_spent: timeSpent
  });
  ```
- **Fetching Leaderboards:** Queries join the `game_sessions` and `profiles` tables to aggregate scores based on `game_id` and order them descendingly.

### Row Level Security (RLS)
To protect data since queries are made from the client, PostgreSQL **Row Level Security (RLS)** is enforced at the database level:
- Users can only `INSERT` into `game_sessions` if the `user_id` matches their authenticated token.
- Users can only `UPDATE` their own row in the `profiles` table.
- Admins (where `role = 'admin'`) can `SELECT` all user analytics.

---

## 🛡️ 5. Backend Middleware & Route Guards

Even though there is no traditional backend middleware (like Express middleware), AptiVerse enforces rigorous access control on the frontend using React Router wrappers (Route Guards).

### 1. `ProtectedRoute.tsx` (Authentication Middleware)
This component wraps all game routes to ensure the user is logged in and their profile is fully complete.
- **Logic:** Checks `useAuth()`. If `!authUser`, it renders a full-screen, un-dismissible Sign-In Modal over the route.
- **Profile Completion Check:** If the user is authenticated but `name` or `college` are missing, it shifts the modal to "Complete Profile" mode. It blocks access to the games (`<Outlet />`) until these are filled, forcing a write to the `profiles` table.

### 2. `AdminRoute.tsx` (Authorization Middleware)
This component protects the `/admin` path (Admin Dashboard).
- **Logic:** It fetches the user's `role` from the `profiles` table.
- If `role !== 'admin'`, the user is instantly redirected to the homepage (`<Navigate to="/" replace />`).

### 3. Level Generation Scripts (Build-time "Middleware")
AptiVerse uses node scripts to pre-generate complex levels at build-time to save client-side processing power.
- **`scripts/pregen_motion.ts`**: Solves and generates static level arrays for the Motion Challenge.
- **`scripts/generate_rc.cjs`**: Parses and structures Reading Comprehension passages and questions.

AptiVerse consists of multiple distinct mini-games designed to test different cognitive abilities.

1. **Motion Challenge (`/games/motion`)**:
   - A sliding block puzzle (similar to Unblock Me). Tests spatial reasoning.
   - **Logic Highlights:** Uses complex coordinate-based state management to detect collisions and valid moves.
2. **GeoSudoku (`/games/sudoku`)**:
   - A geometric twist on classic Sudoku. Tests logical deduction.
3. **Grid Challenge (`/games/grid`)**:
   - Memory and pattern recognition game based on grid interactions.
4. **Data Interpretation (`/games/di`) & Reading Comprehension (`/games/rc`)**:
   - Traditional aptitude formats enhanced with interactive UIs.
5. **Inductive Reasoning (`/games/inductive`) & Switch Logic (`/games/switch`)**:
   - Pattern completion and circuit-based logic puzzles.

---

## 💻 7. Important Code Snippets

### A. Supabase Authentication Context (`src/context/AuthContext.tsx`)
This snippet shows how we securely manage user sessions and synchronize them with our custom `profiles` table using React Context and Supabase hooks.

```tsx
// Fetch user profile from Supabase
const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
    
  if (data && !error) {
    setUser({
      id: data.id,
      name: data.name || '',
      college: data.college || '',
      email: data.email,
      avatar_url: data.avatar_url,
      role: data.role || 'user',
    });
  }
};

// Listen for Auth State Changes
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    }
  );
  return () => subscription.unsubscribe();
}, []);
```

### B. Motion Challenge Level Logic (`src/games/motion/levels.ts`)
This demonstrates how we handle level randomization and collision logic to ensure a unique yet fair experience every time a user plays.

```typescript
import { staticLevels } from './staticLevels';

// Shuffle indices once per session for unique progression
const shuffledIndices = Array.from({ length: staticLevels.length }, (_, i) => i)
  .sort(() => Math.random() - 0.5);

/** Returns true if a block occupies the given cell (Collision Detection) */
const blockCoversCell = (block: PuzzleDefinition['blocks'][number], row: number, col: number): boolean => {
  if (block.orientation === 'horizontal') {
    return block.row === row && col >= block.col && col < block.col + block.length;
  } else {
    return block.col === col && row >= block.row && row < block.row + block.length;
  }
};

export const getLevel = (i: number): PuzzleDefinition => {
  const index = shuffledIndices[i % staticLevels.length];
  // Deep copy to prevent state mutation
  const levelData: PuzzleDefinition = JSON.parse(JSON.stringify(staticLevels[index]));

  // Ensure target hole is never blocked initially
  levelData.blocks = levelData.blocks.filter(
    block => !blockCoversCell(block, levelData.target.row, levelData.target.col)
  );

  return levelData;
};
```

### C. Application Routing Structure (`src/App.tsx`)
We use React Router to segregate public pages, protected game routes, and admin panels.

```tsx
<Routes>
  {/* Public Pages with Navbar */}
  <Route element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="leaderboard" element={<Leaderboard />} />
    
    {/* Admin Route Wrapper */}
    <Route path="admin" element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    } />
  </Route>

  {/* Protected Game Routes (full screen, immersive) */}
  <Route element={<ProtectedRoute />}>
    <Route path="/games/motion" element={<MotionChallenge />} />
    <Route path="/games/di" element={<DIChallenge />} />
  </Route>
</Routes>
```

---

## 🏁 8. Conclusion & Future Scope

**Slide: Conclusion & Q&A**
* **Speaker Script:** "To conclude, AptiVerse redefines aptitude training by blending modern web technologies with engaging game mechanics. With our robust Supabase backend, Row Level Security, and smooth Framer Motion frontend, we ensure a scalable, secure, and delightful user experience. In the future, we plan to implement AI-driven difficulty scaling and multiplayer real-time challenges. Thank you for your time, we are now open to questions."

---
*Generated by Antigravity AI*
