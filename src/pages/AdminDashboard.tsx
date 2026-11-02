import React, { useEffect, useState, useCallback } from 'react';
import { 
  Shield, Trash2, Users, Gamepad2, Search, AlertTriangle, MessageSquare, 
  Star, Bug, Landmark, Mail, Edit3, BellRing, 
  Copy, Check, AlertCircle, ChevronLeft, ChevronRight, RefreshCw,
  FileCheck2, CheckCircle2, XCircle, Flame
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { isValidCollegeName } from '../constants/institutions';

const SQL_CLEANUP_QUERY = `-- ====================================================================
-- APTIVERSE MASTER DATABASE AUDIT & SECURITY MIGRATION
-- Run this in Supabase Dashboard -> SQL Editor (with postgres / admin role)
-- ====================================================================

-- 1. Helper function to check if caller has 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role(u_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_is_blocked(u_id UUID)
RETURNS BOOLEAN AS $$
  SELECT is_blocked FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_warning_message(u_id UUID)
RETURNS TEXT AS $$
  SELECT warning_message FROM public.profiles WHERE id = u_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. PROFILE SECURITY: Prevent ordinary users from altering role, is_blocked, or warnings
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id )
  WITH CHECK (
    auth.uid() = id
    AND (
      (role IS NOT DISTINCT FROM public.get_user_role(auth.uid()))
      OR public.is_admin()
    )
    AND (
      (is_blocked IS NOT DISTINCT FROM public.get_user_is_blocked(auth.uid()))
      OR public.is_admin()
    )
    AND (
      (warning_message IS NOT DISTINCT FROM public.get_user_warning_message(auth.uid()))
      OR public.is_admin()
    )
  );

DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING ( is_admin() )
  WITH CHECK ( is_admin() );

-- 3. GAME SESSIONS SCHEMA ENHANCEMENTS
DO $$
BEGIN
  ALTER TABLE public.game_sessions ALTER COLUMN score TYPE NUMERIC(4,2) USING score::numeric(4,2);
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.game_sessions ADD COLUMN IF NOT EXISTS attempt_id UUID;
CREATE UNIQUE INDEX IF NOT EXISTS idx_game_sessions_attempt_id ON public.game_sessions(attempt_id) WHERE attempt_id IS NOT NULL;

-- Ensure authenticated users can record game sessions
GRANT INSERT, SELECT ON public.game_sessions TO authenticated;
DROP POLICY IF EXISTS "Users can insert their own game sessions." ON public.game_sessions;
CREATE POLICY "Users can insert their own game sessions."
  ON public.game_sessions FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Game sessions are viewable by everyone." ON public.game_sessions;
CREATE POLICY "Game sessions are viewable by everyone."
  ON public.game_sessions FOR SELECT
  USING ( true );

-- Ensure foreign key constraint between game_sessions and profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_game_sessions_profiles'
  ) THEN
    ALTER TABLE public.game_sessions 
    ADD CONSTRAINT fk_game_sessions_profiles 
    FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 4. Global Leaderboard View: Pure cumulative scoring
DROP VIEW IF EXISTS global_leaderboard CASCADE;
CREATE VIEW global_leaderboard AS
SELECT 
  p.id AS user_id,
  p.name,
  p.college,
  p.avatar_url,
  COALESCE(SUM(s.score), 0)::numeric(10,2) AS total_score,
  COALESCE(ROUND(AVG(s.accuracy)), 0) AS avg_accuracy,
  COUNT(s.id) AS total_games,
  COALESCE(SUM(s.time_spent), 0) AS total_time
FROM profiles p
JOIN game_sessions s ON p.id = s.user_id
WHERE (p.is_blocked IS NOT TRUE)
GROUP BY p.id, p.name, p.college, p.avatar_url;

-- 5. COMPANY MOCK TEST SCORES & CANDIDATE FEEDBACK
CREATE TABLE IF NOT EXISTS public.company_mock_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  candidate_name TEXT,
  company TEXT NOT NULL DEFAULT 'infosys',
  test_id TEXT NOT NULL,
  test_title TEXT,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  percentage NUMERIC(5,2),
  sectional_scores JSONB,
  cleared BOOLEAN DEFAULT false,
  feedback_rating INT,
  feedback_comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS candidate_name TEXT;
ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS test_title TEXT;
ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS percentage NUMERIC(5,2);
ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS feedback_rating INT;
ALTER TABLE public.company_mock_scores ADD COLUMN IF NOT EXISTS feedback_comment TEXT;

ALTER TABLE public.company_mock_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow mock test submissions" ON public.company_mock_scores;
CREATE POLICY "Allow mock test submissions" ON public.company_mock_scores FOR INSERT TO public WITH CHECK (true);
DROP POLICY IF EXISTS "Users can view own mock scores" ON public.company_mock_scores;
CREATE POLICY "Users can view own mock scores" ON public.company_mock_scores FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins have full access to mock scores" ON public.company_mock_scores;
CREATE POLICY "Admins have full access to mock scores" ON public.company_mock_scores FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. DAILY HARD PROBLEM CHALLENGE SOLVERS & STREAK
CREATE TABLE IF NOT EXISTS public.daily_challenge_solvers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  candidate_name TEXT NOT NULL,
  college TEXT,
  challenge_id TEXT NOT NULL,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_taken_seconds NUMERIC(6,2) NOT NULL,
  streak INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_solvers_date_speed ON public.daily_challenge_solvers(challenge_date, time_taken_seconds ASC);
ALTER TABLE public.daily_challenge_solvers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view daily challenge solvers" ON public.daily_challenge_solvers;
CREATE POLICY "Public can view daily challenge solvers" ON public.daily_challenge_solvers FOR SELECT TO public USING (true);
DROP POLICY IF EXISTS "Allow daily challenge solver submissions" ON public.daily_challenge_solvers;
CREATE POLICY "Allow daily challenge solver submissions" ON public.daily_challenge_solvers FOR INSERT TO public WITH CHECK (true);

-- 7. PRODUCTION GLOBAL DAILY CHALLENGE SYSTEM (20261102)
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL UNIQUE,
  game_type TEXT NOT NULL,
  game_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Hard',
  challenge_seed BIGINT NOT NULL,
  challenge_config JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON public.daily_challenges(challenge_date DESC);
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view daily challenges" ON public.daily_challenges;
CREATE POLICY "Public can view daily challenges" ON public.daily_challenges FOR SELECT TO public USING (true);

CREATE TABLE IF NOT EXISTS public.daily_challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL,
  college TEXT,
  avatar_url TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  completion_time_ms BIGINT,
  score NUMERIC(5,2),
  accuracy NUMERIC(5,2),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'in_progress',
  attempt_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_daily_challenge_user UNIQUE (daily_challenge_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_daily_attempts_challenge_user ON public.daily_challenge_attempts(daily_challenge_id, user_id);
ALTER TABLE public.daily_challenge_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own daily attempts" ON public.daily_challenge_attempts;
CREATE POLICY "Users can read own daily attempts" ON public.daily_challenge_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id OR is_completed = true);

-- Clean any dummy/test solver records
DELETE FROM public.daily_challenge_solvers 
WHERE candidate_name IN ('Ananya Deshmukh', 'Rahul Kulkarni', 'Siddharth Roy', 'Sample Candidate', 'Test Candidate')
   OR candidate_name ILIKE '%test%';

NOTIFY pgrst, 'reload schema';`;

const normalizeCollege = (name: string | null | undefined) => {
  if (!name || name.trim() === '') return '-';
  const lower = name.trim().toLowerCase();
  if (lower === 'cit' || lower === 'chennai institute of technology') {
    return 'Chennai Institute of Technology';
  }
  return name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const PAGE_SIZE = 25;

export const AdminDashboard = () => {
  // Global Overview KPI Counts
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);
  const [totalSessionsCount, setTotalSessionsCount] = useState<number | null>(null);
  const [totalTestsCount, setTotalTestsCount] = useState<number | null>(null);
  const [totalDailySolversCount, setTotalDailySolversCount] = useState<number | null>(null);
  const [todayDailySolversCount, setTodayDailySolversCount] = useState<number | null>(null);
  const [activeUsersCount, setActiveUsersCount] = useState<number | null>(null);
  const [totalCollegesCount, setTotalCollegesCount] = useState<number | null>(null);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [kpiError, setKpiError] = useState<string | null>(null);

  // Active Tab & Pagination
  const [activeTab, setActiveTab] = useState<'users' | 'sessions' | 'tests' | 'reviews' | 'leaderboard' | 'bugs' | 'colleges' | 'daily'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalTabCount, setTotalTabCount] = useState(0);
  const [tabLoading, setTabLoading] = useState(true);
  const [tabError, setTabError] = useState<string | null>(null);

  // Tab Data Buffers
  const [users, setUsers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [testScores, setTestScores] = useState<any[]>([]);
  const [dailySolvers, setDailySolvers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [bugReports, setBugReports] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncingEmails, setSyncingEmails] = useState(false);
  const [syncResult, setSyncResult] = useState<{ text: string; success: boolean } | null>(null);

  const handleSyncEmails = async () => {
    setSyncingEmails(true);
    setSyncResult(null);
    try {
      const { data, error } = await supabase.rpc('sync_all_profile_emails');
      if (error) {
        setSyncResult({
          text: 'Notice: Run migration 20261031_sync_registered_emails.sql in Supabase SQL editor to backfill all emails from auth.users.',
          success: false
        });
      } else {
        setSyncResult({
          text: `Success! Synced ${data ?? 0} user email(s) from auth.users into profiles table.`,
          success: true
        });
        fetchTabData();
      }
    } catch (err: any) {
      setSyncResult({
        text: 'Run 20261031_sync_registered_emails.sql in Supabase SQL editor to sync emails.',
        success: false
      });
    } finally {
      setSyncingEmails(false);
    }
  };

  // 1. Fetch exact KPI metrics from DB
  const fetchOverviewMetrics = useCallback(async () => {
    setKpiLoading(true);
    setKpiError(null);
    try {
      // Exact Users Count
      const { count: usersCount, error: usersErr } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      if (usersErr) throw usersErr;
      setTotalUsersCount(usersCount ?? 0);

      // Exact Sessions Count
      const { count: sessionsCount, error: sessionsErr } = await supabase
        .from('game_sessions')
        .select('id', { count: 'exact', head: true });
      if (sessionsErr) throw sessionsErr;
      setTotalSessionsCount(sessionsCount ?? 0);

      // Exact Mock Tests Count
      try {
        const { count: testsCount } = await supabase
          .from('company_mock_scores')
          .select('id', { count: 'exact', head: true });
        setTotalTestsCount(testsCount ?? 0);
      } catch {
        setTotalTestsCount(0);
      }

      // Exact Daily Challenge Solvers (Total and Today with full fallback)
      try {
        let totalCount = 0;
        let todayCount = 0;
        const todayKey = new Date().toISOString().split('T')[0];

        // 1. Try daily_challenge_solvers
        const { count: cSolvers, error: errSolvers } = await supabase
          .from('daily_challenge_solvers')
          .select('id', { count: 'exact', head: true });

        if (!errSolvers && cSolvers !== null) {
          totalCount = cSolvers;
          const { count: cToday } = await supabase
            .from('daily_challenge_solvers')
            .select('id', { count: 'exact', head: true })
            .eq('challenge_date', todayKey);
          todayCount = cToday ?? 0;
        } else {
          // 2. Try daily_challenge_attempts
          const { count: cAttempts, error: errAttempts } = await supabase
            .from('daily_challenge_attempts')
            .select('id', { count: 'exact', head: true })
            .eq('is_completed', true);

          if (!errAttempts && cAttempts !== null) {
            totalCount = cAttempts;
            const startOfDayISO = new Date(`${todayKey}T00:00:00+05:30`).toISOString();
            const { count: cAttemptsToday } = await supabase
              .from('daily_challenge_attempts')
              .select('id', { count: 'exact', head: true })
              .eq('is_completed', true)
              .gte('created_at', startOfDayISO);
            todayCount = cAttemptsToday ?? 0;
          } else {
            // 3. Fallback to game_sessions
            const { count: cSessions } = await supabase
              .from('game_sessions')
              .select('id', { count: 'exact', head: true })
              .eq('game_id', 'daily_challenge');
            totalCount = cSessions ?? 0;
            const startOfDayISO = new Date(`${todayKey}T00:00:00+05:30`).toISOString();
            const { count: cSessionsToday } = await supabase
              .from('game_sessions')
              .select('id', { count: 'exact', head: true })
              .eq('game_id', 'daily_challenge')
              .gte('created_at', startOfDayISO);
            todayCount = cSessionsToday ?? 0;
          }
        }
        setTotalDailySolversCount(totalCount);
        setTodayDailySolversCount(todayCount);
      } catch {
        setTotalDailySolversCount(0);
        setTodayDailySolversCount(0);
      }

      // Exact Active Players (on global leaderboard)
      const { count: activeCount, error: activeErr } = await supabase
        .from('global_leaderboard')
        .select('user_id', { count: 'exact', head: true });
      if (!activeErr && activeCount !== null) {
        setActiveUsersCount(activeCount);
      } else {
        setActiveUsersCount(usersCount ? Math.min(usersCount, 100) : 0);
      }

      // Exact Colleges Count (distinct registered institutions)
      try {
        const { data: profColleges } = await supabase
          .from('profiles')
          .select('college')
          .not('college', 'is', null);

        if (profColleges && profColleges.length > 0) {
          const distinctColleges = new Set(
            profColleges
              .map(p => normalizeCollege(p.college))
              .filter(c => c && c !== '-')
          );
          setTotalCollegesCount(distinctColleges.size);
        } else {
          setTotalCollegesCount(0);
        }
      } catch {
        setTotalCollegesCount(0);
      }
    } catch (err: any) {
      console.error('Error fetching admin KPI metrics:', err);
      setKpiError(err.message || 'Failed to load metrics');
    } finally {
      setKpiLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewMetrics();
  }, [fetchOverviewMetrics]);

  // Reset page when tab or search changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, searchTerm]);

  // 2. Fetch specific tab data on-demand with server-side pagination & search
  const fetchTabData = useCallback(async () => {
    setTabLoading(true);
    setTabError(null);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      if (activeTab === 'users') {
        let query = supabase
          .from('profiles')
          .select('id, name, email, college, department, role, is_blocked, avatar_url, updated_at', { count: 'exact' });

        if (searchTerm.trim()) {
          query = query.or(`name.ilike.%${searchTerm.trim()}%,email.ilike.%${searchTerm.trim()}%,college.ilike.%${searchTerm.trim()}%`);
        }

        const { data, count, error } = await query
          .order('updated_at', { ascending: false })
          .range(from, to);

        if (error) throw error;
        setUsers(data ? data.map(u => ({ ...u, raw_college: u.college, college: normalizeCollege(u.college) })) : []);
        setTotalTabCount(count ?? 0);
      } 
      else if (activeTab === 'sessions') {
        let baseQuery = supabase
          .from('game_sessions')
          .select('id, user_id, game_id, level, score, accuracy, time_spent, created_at', { count: 'exact' });

        if (searchTerm.trim()) {
          baseQuery = baseQuery.ilike('game_id', `%${searchTerm.trim()}%`);
        }

        const { data: rawSessions, count, error: sessErr } = await baseQuery
          .order('created_at', { ascending: false })
          .range(from, to);

        if (sessErr) throw sessErr;

        if (rawSessions && rawSessions.length > 0) {
          const userIds = Array.from(new Set(rawSessions.map((s: any) => s.user_id).filter(Boolean)));
          const profileMap = new Map<string, { name?: string; email?: string }>();
          if (userIds.length > 0) {
            try {
              const { data: profs } = await supabase
                .from('profiles')
                .select('id, name, email')
                .in('id', userIds);
              if (profs) {
                profs.forEach((p: any) => profileMap.set(p.id, p));
              }
            } catch (pErr) {
              console.warn('Could not load profiles for sessions:', pErr);
            }
          }
          const enriched = rawSessions.map((s: any) => ({
            ...s,
            profiles: profileMap.get(s.user_id) || null
          }));
          setSessions(enriched);
        } else {
          setSessions([]);
        }
        setTotalTabCount(count ?? 0);
      }
      else if (activeTab === 'tests') {
        let baseQuery = supabase
          .from('company_mock_scores')
          .select(`
            id, user_id, candidate_name, company, test_id, test_title,
            score, total_questions, percentage, sectional_scores, cleared,
            feedback_rating, feedback_comment, created_at
          `, { count: 'exact' });

        if (searchTerm.trim()) {
          baseQuery = baseQuery.or(`candidate_name.ilike.%${searchTerm.trim()}%,test_title.ilike.%${searchTerm.trim()}%,feedback_comment.ilike.%${searchTerm.trim()}%`);
        }

        const { data: rawScores, count, error: testErr } = await baseQuery
          .order('created_at', { ascending: false })
          .range(from, to);

        if (testErr) throw testErr;

        if (rawScores && rawScores.length > 0) {
          const userIds = Array.from(new Set(rawScores.map((t: any) => t.user_id).filter(Boolean)));
          const profileMap = new Map<string, { name?: string; email?: string; college?: string }>();
          if (userIds.length > 0) {
            try {
              const { data: profs } = await supabase
                .from('profiles')
                .select('id, name, email, college')
                .in('id', userIds);
              if (profs) {
                profs.forEach((p: any) => profileMap.set(p.id, p));
              }
            } catch (pErr) {
              console.warn('Could not load profiles for mock tests:', pErr);
            }
          }
          const enriched = rawScores.map((t: any) => ({
            ...t,
            profiles: profileMap.get(t.user_id) || null
          }));
          setTestScores(enriched);
        } else {
          setTestScores([]);
        }
        setTotalTabCount(count ?? 0);
      }
      else if (activeTab === 'reviews') {
        let baseQuery = supabase
          .from('feedback')
          .select('id, rating, tag, comment, created_at, user_id', { count: 'exact' });

        if (searchTerm.trim()) {
          baseQuery = baseQuery.or(`tag.ilike.%${searchTerm.trim()}%,comment.ilike.%${searchTerm.trim()}%`);
        }

        const { data: rawReviews, count, error: revErr } = await baseQuery
          .order('created_at', { ascending: false })
          .range(from, to);

        if (revErr) throw revErr;

        if (rawReviews && rawReviews.length > 0) {
          const userIds = Array.from(new Set(rawReviews.map((r: any) => r.user_id).filter(Boolean)));
          const profileMap = new Map<string, { name?: string; email?: string }>();
          if (userIds.length > 0) {
            try {
              const { data: profs } = await supabase
                .from('profiles')
                .select('id, name, email')
                .in('id', userIds);
              if (profs) {
                profs.forEach((p: any) => profileMap.set(p.id, p));
              }
            } catch (pErr) {
              console.warn('Could not load profiles for reviews:', pErr);
            }
          }
          const enriched = rawReviews.map((r: any) => ({
            ...r,
            profiles: profileMap.get(r.user_id) || null
          }));
          setReviews(enriched);
        } else {
          setReviews([]);
        }
        setTotalTabCount(count ?? 0);
      }
      else if (activeTab === 'leaderboard') {
        let query = supabase
          .from('profiles')
          .select('id, name, college, avatar_url, is_blocked, game_sessions(score, accuracy, time_spent, created_at)')
          .eq('is_blocked', false);

        if (searchTerm.trim()) {
          query = query.or(`name.ilike.%${searchTerm.trim()}%,college.ilike.%${searchTerm.trim()}%`);
        }

        const { data: profileData, error } = await query;

        if (error) throw error;

        const list: any[] = [];
        (profileData || []).forEach((p: any) => {
          const sessions = p.game_sessions || [];
          if (sessions.length === 0) return;

          let total_score = 0;
          let accuracy_sum = 0;
          let total_time = 0;
          sessions.forEach((s: any) => {
            total_score += Number(s.score) || 0;
            accuracy_sum += Number(s.accuracy) || 0;
            total_time += Number(s.time_spent) || 0;
          });

          list.push({
            user_id: p.id,
            name: p.name || 'Unknown',
            college: normalizeCollege(p.college),
            avatar_url: p.avatar_url,
            total_score,
            avg_accuracy: sessions.length > 0 ? Math.round(accuracy_sum / sessions.length) : 0,
            total_games: sessions.length,
            total_time,
          });
        });

        // Sort descending by total_score, avg_accuracy, and ascending by total_time
        list.sort((a, b) => {
          if (b.total_score !== a.total_score) return b.total_score - a.total_score;
          if (b.avg_accuracy !== a.avg_accuracy) return b.avg_accuracy - a.avg_accuracy;
          return (a.total_time || 0) - (b.total_time || 0);
        });

        setTotalTabCount(list.length);
        setLeaderboard(list.slice(from, to + 1));
      }
      else if (activeTab === 'bugs') {
        let query = supabase
          .from('bug_reports')
          .select(`
            id, title, description, created_at,
            profiles:user_id (name, email)
          `, { count: 'exact' });

        if (searchTerm.trim()) {
          query = query.or(`title.ilike.%${searchTerm.trim()}%,description.ilike.%${searchTerm.trim()}%`);
        }

        const { data, count, error } = await query
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;
        setBugReports(data || []);
        setTotalTabCount(count ?? 0);
      }
      else if (activeTab === 'colleges') {
        const { data: profColleges, error } = await supabase
          .from('profiles')
          .select('college')
          .not('college', 'is', null);

        if (error) throw error;

        const map = new Map<string, number>();
        (profColleges || []).forEach(u => {
          const normalized = normalizeCollege(u.college);
          if (normalized === '-') return;
          map.set(normalized, (map.get(normalized) || 0) + 1);
        });

        let list = Array.from(map.entries())
          .map(([name, count]) => ({ college: name, student_count: count }))
          .sort((a, b) => b.student_count - a.student_count);

        if (searchTerm.trim()) {
          const term = searchTerm.trim().toLowerCase();
          list = list.filter(c => c.college.toLowerCase().includes(term));
        }

        setColleges(list.slice(from, to + 1));
        setTotalTabCount(list.length);
      }
      else if (activeTab === 'daily') {
        let loaded = false;

        // Tier 1: Try daily_challenge_solvers table
        try {
          let query = supabase
            .from('daily_challenge_solvers')
            .select('id, user_id, candidate_name, college, challenge_id, challenge_date, time_taken_seconds, streak, created_at', { count: 'exact' });

          if (searchTerm.trim()) {
            query = query.or(`candidate_name.ilike.%${searchTerm.trim()}%,college.ilike.%${searchTerm.trim()}%,challenge_id.ilike.%${searchTerm.trim()}%`);
          }

          const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

          if (!error && data) {
            setDailySolvers(data);
            setTotalTabCount(count ?? data.length);
            loaded = true;
          }
        } catch {
          // Fall through to next tier
        }

        // Tier 2: Try daily_challenge_attempts table
        if (!loaded) {
          try {
            let query = supabase
              .from('daily_challenge_attempts')
              .select('id, user_id, candidate_name, college, daily_challenge_id, completion_time_ms, score, accuracy, is_completed, submitted_at, created_at, attempt_metadata', { count: 'exact' })
              .eq('is_completed', true);

            if (searchTerm.trim()) {
              query = query.or(`candidate_name.ilike.%${searchTerm.trim()}%,college.ilike.%${searchTerm.trim()}%,daily_challenge_id.ilike.%${searchTerm.trim()}%`);
            }

            const { data, count, error } = await query
              .order('created_at', { ascending: false })
              .range(from, to);

            if (!error && data) {
              const mapped = data.map((d: any) => ({
                id: d.id,
                user_id: d.user_id,
                candidate_name: d.candidate_name || 'AptiVerse Scholar',
                college: d.college || '—',
                challenge_id: d.daily_challenge_id || 'daily_challenge',
                challenge_date: (d.submitted_at || d.created_at || '').split('T')[0] || new Date().toISOString().split('T')[0],
                time_taken_seconds: Number(((d.completion_time_ms || 15000) / 1000).toFixed(1)),
                streak: d.attempt_metadata?.streak || 1,
                created_at: d.submitted_at || d.created_at || new Date().toISOString()
              }));
              setDailySolvers(mapped);
              setTotalTabCount(count ?? mapped.length);
              loaded = true;
            }
          } catch {
            // Fall through to Tier 3
          }
        }

        // Tier 3: Fallback to game_sessions table
        if (!loaded) {
          let query = supabase
            .from('game_sessions')
            .select('id, user_id, score, accuracy, time_spent, created_at, attempt_id', { count: 'exact' })
            .eq('game_id', 'daily_challenge');

          const { data, count, error } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

          if (error) throw error;

          const rawSessions = data || [];
          const userIds = Array.from(new Set(rawSessions.map((s: any) => s.user_id).filter(Boolean)));
          const profileMap = new Map<string, { name?: string; college?: string }>();

          if (userIds.length > 0) {
            try {
              const { data: profs } = await supabase
                .from('profiles')
                .select('id, name, college')
                .in('id', userIds);
              (profs || []).forEach((p: any) => profileMap.set(p.id, p));
            } catch {}
          }

          const mapped = rawSessions.map((s: any) => {
            const prof = profileMap.get(s.user_id);
            return {
              id: s.id,
              user_id: s.user_id,
              candidate_name: prof?.name || 'AptiVerse Scholar',
              college: prof?.college || '—',
              challenge_id: 'daily_challenge',
              challenge_date: (s.created_at || '').split('T')[0],
              time_taken_seconds: s.time_spent || 1,
              streak: 1,
              created_at: s.created_at
            };
          });

          setDailySolvers(mapped);
          setTotalTabCount(count ?? mapped.length);
        }
      }
    } catch (err: any) {
      console.error(`Error loading tab data for ${activeTab}:`, err);
      setTabError(err.message || 'Failed to load table rows');
    } finally {
      setTabLoading(false);
    }
  }, [activeTab, page, searchTerm]);

  useEffect(() => {
    fetchTabData();
  }, [fetchTabData]);

  // Actions
  const deleteSession = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this game session? This affects the leaderboard.')) return;
    try {
      const { error } = await supabase.from('game_sessions').delete().eq('id', id);
      if (error) throw error;
      setSessions(prev => prev.filter(s => s.id !== id));
      fetchOverviewMetrics();
    } catch (err: any) {
      alert(`Error deleting session: ${err?.message || 'Unknown error'}`);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user? ALL their game data will be lost.')) return;
    try {
      await supabase.from('game_sessions').delete().eq('user_id', id);
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== id));
      fetchOverviewMetrics();
    } catch (err: any) {
      alert(`Error deleting user: ${err?.message || 'Unknown error'}`);
    }
  };

  const editUserCollege = async (id: string, currentCollege: string) => {
    const newCollege = window.prompt("Enter new college name:", currentCollege);
    if (newCollege === null || newCollege.trim() === currentCollege) return;
    try {
      const { error } = await supabase.from('profiles').update({ college: newCollege.trim() }).eq('id', id);
      if (error) throw error;
      setUsers(prev => prev.map(u => u.id === id ? { ...u, college: normalizeCollege(newCollege.trim()) } : u));
    } catch (err: any) {
      alert(`Error updating college: ${err?.message || 'Unknown error'}`);
    }
  };

  const toggleBlockUser = async (id: string, isBlocked: boolean) => {
    if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`)) return;
    try {
      const { error } = await supabase.from('profiles').update({ is_blocked: !isBlocked }).eq('id', id);
      if (error) throw error;
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_blocked: !isBlocked } : u));
    } catch (err: any) {
      alert(`Error updating status: ${err?.message || 'Unknown error'}`);
    }
  };

  const sendInAppWarning = async (userId: string, userName: string) => {
    const defaultMsg = `⚠️ Fair Play Violation Notice:\n\nIrregular activity was detected on your account. Please adhere to honest gameplay.\n\nContinued violations will result in permanent score removal.`;
    const msg = window.prompt(`Enter warning message to display on ${userName}'s screen:`, defaultMsg);
    if (!msg || msg.trim() === '') return;
    try {
      const { error } = await supabase.from('profiles').update({ warning_message: msg.trim() }).eq('id', userId);
      if (error) throw error;
      alert(`Warning sent to ${userName}!`);
    } catch (err: any) {
      alert(`Error sending warning: ${err?.message || 'Unknown error'}`);
    }
  };

  const deleteBugReport = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bug report?')) return;
    try {
      const { error } = await supabase.from('bug_reports').delete().eq('id', id);
      if (error) throw error;
      setBugReports(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(`Error deleting bug report: ${err?.message || 'Unknown error'}`);
    }
  };

  const deleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const { error } = await supabase.from('feedback').delete().eq('id', id);
      if (error) throw error;
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(`Error deleting review: ${err?.message || 'Unknown error'}`);
    }
  };

  const deleteTestScore = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this test submission record?')) return;
    try {
      const { error } = await supabase.from('company_mock_scores').delete().eq('id', id);
      if (error) throw error;
      setTestScores(prev => prev.filter(t => t.id !== id));
      setTotalTabCount(prev => Math.max(0, prev - 1));
      setTotalTestsCount(prev => (prev !== null ? Math.max(0, prev - 1) : null));
    } catch (err: any) {
      alert(`Error deleting test record: ${err?.message || 'Unknown error'}`);
    }
  };

  const copySqlCleanup = () => {
    navigator.clipboard.writeText(SQL_CLEANUP_QUERY);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    alert('Master SQL Migration copied to clipboard!\n\nYou can run it in Supabase Dashboard -> SQL Editor.');
  };

  const totalPages = Math.max(1, Math.ceil(totalTabCount / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-6xl mx-auto w-full">
      {/* Header & Exact Counts */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-primary-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary-200 text-sm font-bold tracking-wider uppercase mb-2">
            <Shield size={16} /> Admin Portal
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Management</h1>
          <p className="text-primary-100/80 max-w-xl">
            Real-time platform insights, exact database counts, and fair play administration.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-wrap gap-4 mt-4 md:mt-0">
          {/* Total Users Metric */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px] border border-white/10">
            {kpiLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin my-1" />
            ) : kpiError && totalUsersCount === null ? (
              <span className="text-xs font-bold text-rose-300">Error</span>
            ) : (
              <span className="text-3xl font-bold">{totalUsersCount?.toLocaleString() ?? '—'}</span>
            )}
            <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Total Users</span>
          </div>

          {/* Active Users Metric */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px] border border-white/10">
            {kpiLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin my-1" />
            ) : (
              <span className="text-3xl font-bold">{activeUsersCount?.toLocaleString() ?? '—'}</span>
            )}
            <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Active Players</span>
          </div>

          {/* Colleges Metric */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px] border border-white/10">
            {kpiLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin my-1" />
            ) : (
              <span className="text-3xl font-bold">{totalCollegesCount?.toLocaleString() ?? '—'}</span>
            )}
            <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Colleges</span>
          </div>

          {/* Total Games / Sessions Metric */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px] border border-white/10">
            {kpiLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin my-1" />
            ) : kpiError && totalSessionsCount === null ? (
              <span className="text-xs font-bold text-rose-300">Error</span>
            ) : (
              <span className="text-3xl font-bold">{totalSessionsCount?.toLocaleString() ?? '—'}</span>
            )}
            <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Total Sessions</span>
          </div>

          {/* Mock Tests Taken Metric */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px] border border-white/10">
            {kpiLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin my-1" />
            ) : (
              <span className="text-3xl font-bold">{totalTestsCount?.toLocaleString() ?? '—'}</span>
            )}
            <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Tests Taken</span>
          </div>

          {/* Daily Challenge Solvers Metric */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[110px] border border-white/10">
            {kpiLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin my-1" />
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold">{todayDailySolversCount ?? 0}</span>
                <span className="text-[10px] text-amber-300 font-mono">({totalDailySolversCount ?? 0} Total)</span>
              </div>
            )}
            <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Daily Solvers</span>
          </div>

          {/* Retry KPI button if error */}
          {kpiError && (
            <button 
              onClick={fetchOverviewMetrics}
              className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg text-xs flex items-center gap-1 self-center"
              title="Retry loading KPI counts"
            >
              <RefreshCw size={14} /> Retry
            </button>
          )}
        </div>
      </div>

      {/* Tabs and Search Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-2 rounded-xl shadow-sm border border-neutral-100">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Users size={16} /> Users
          </button>
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'sessions' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Gamepad2 size={16} /> Sessions
          </button>
          <button 
            onClick={() => setActiveTab('tests')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'tests' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <FileCheck2 size={16} /> Tests
          </button>
          <button 
            onClick={() => setActiveTab('daily')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'daily' ? 'bg-orange-50 text-orange-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Flame size={16} className="text-orange-600" /> Daily Challenges
          </button>
          <button 
            onClick={() => setActiveTab('colleges')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'colleges' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Landmark size={16} /> Colleges
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'reviews' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <MessageSquare size={16} /> Reviews
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'leaderboard' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Star size={16} /> Leaderboard
          </button>
          <button 
            onClick={() => setActiveTab('bugs')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'bugs' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Bug size={16} /> Bugs/Contact
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {activeTab === 'users' && (
            <button
              onClick={handleSyncEmails}
              disabled={syncingEmails}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold transition-colors border border-primary-200 disabled:opacity-50 shrink-0"
              title="Synchronize registered student emails from auth into profiles table"
            >
              <RefreshCw size={13} className={syncingEmails ? 'animate-spin' : ''} />
              {syncingEmails ? 'Syncing...' : 'Sync Registered Emails'}
            </button>
          )}

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search database..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" 
            />
          </div>
        </div>
      </div>

      {/* Sync result notification banner */}
      {syncResult && (
        <div className={`p-3 rounded-xl text-xs font-medium flex items-center justify-between ${syncResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
          <span>{syncResult.text}</span>
          <button onClick={() => setSyncResult(null)} className="text-xs font-bold underline ml-2">Dismiss</button>
        </div>
      )}

      {/* Content Table Container */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col justify-between">
        {tabLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-3">
             <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
             <p className="text-xs text-neutral-400 font-medium">Loading {activeTab} from database...</p>
          </div>
        ) : tabError ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4 p-8 text-center">
            <AlertCircle size={40} className="text-rose-500" />
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Failed to load {activeTab}</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md">{tabError}</p>
            </div>
            <Button onClick={fetchTabData} className="flex items-center gap-2">
              <RefreshCw size={14} /> Retry Query
            </Button>
          </div>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-16">#</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-neutral-500">No users found.</td></tr>
                ) : (
                  users.map((user, i) => (
                    <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-neutral-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="p-4 font-bold text-neutral-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs overflow-hidden shrink-0">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name?.charAt(0).toUpperCase() || 'U'
                          )}
                        </div>
                        {user.name || 'Unknown'}
                      </td>
                      <td className="p-4 text-sm text-neutral-600">{user.email || '-'}</td>
                      <td className="p-4 text-sm text-neutral-600">
                        <span className="font-medium text-slate-800">{user.college || '-'}</span>
                      </td>
                      <td className="p-4 text-sm text-neutral-600">
                        {user.department ? (
                          <span className="font-semibold text-slate-700 text-xs">{user.department}</span>
                        ) : (
                          <span className="text-neutral-400 italic text-xs">Missing</span>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {user.role !== 'admin' && (
                          <div className="flex items-center justify-end gap-1">
                            {user.email && (
                              <a
                                href={`mailto:${user.email}?subject=${encodeURIComponent('Official Notice: Fair Play Violation Notice')}&body=${encodeURIComponent(`Dear ${user.name || 'Student'},\n\nPlease adhere to honest gameplay.\n\nRegards,\nAptiverse Administration\nargaikwad24@gmail.com`)}`}
                                className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors inline-flex"
                                title="Send Email"
                              >
                                <Mail size={16} />
                              </a>
                            )}
                            <button
                              onClick={() => sendInAppWarning(user.id, user.name || 'Student')}
                              className="p-2 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Send In-App Warning"
                            >
                              <BellRing size={16} />
                            </button>
                            <button 
                              onClick={() => editUserCollege(user.id, user.college || '')}
                              className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit College"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => toggleBlockUser(user.id, user.is_blocked)}
                              className={`p-2 rounded-lg transition-colors ${user.is_blocked ? 'text-red-600 bg-red-100 hover:bg-red-200' : 'text-neutral-400 hover:text-red-600 hover:bg-red-50'}`}
                              title={user.is_blocked ? "Unblock User" : "Block User"}
                            >
                              <AlertTriangle size={16} />
                            </button>
                            <button 
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'sessions' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">#</th>
                  <th className="p-4">Player</th>
                  <th className="p-4">Game</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Score (Acc)</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sessions.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-neutral-500">No sessions found.</td></tr>
                ) : (
                  sessions.map((session, i) => (
                    <tr key={session.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-neutral-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="p-4 font-bold text-neutral-900 text-sm">{session.profiles?.name || 'Unknown'}</td>
                      <td className="p-4 text-sm font-medium text-primary-700 capitalize">{session.game_id.replace('-', ' ')}</td>
                      <td className="p-4 text-sm text-neutral-600">{session.level}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-emerald-600">{session.score} pts</span>
                          <span className="text-[10px] font-bold text-neutral-400">{session.accuracy}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-neutral-600">{session.time_spent}s</td>
                      <td className="p-4 text-sm text-neutral-500">
                        {new Date(session.created_at).toLocaleDateString()} {new Date(session.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => deleteSession(session.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'tests' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-16">#</th>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Test Given</th>
                  <th className="p-4">Score & Cutoffs</th>
                  <th className="p-4">Candidate Feedback</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {testScores.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-neutral-500">
                      <FileCheck2 size={36} className="mx-auto mb-2 text-neutral-300" />
                      <p className="font-semibold text-slate-700">No mock test submissions recorded yet.</p>
                      <p className="text-xs text-neutral-400 mt-1">Candidate mock test attempts and written feedback will appear here in real-time.</p>
                    </td>
                  </tr>
                ) : (
                  testScores.map((item, i) => {
                    const studentName = item.candidate_name || item.profiles?.name || 'Candidate';
                    const studentEmail = item.profiles?.email || null;
                    const studentCollege = item.profiles?.college ? normalizeCollege(item.profiles.college) : null;
                    const pct = item.percentage ?? (item.total_questions > 0 ? Math.round((item.score / item.total_questions) * 100) : 0);

                    return (
                      <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-neutral-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                        
                        {/* Candidate */}
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {studentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-neutral-900 text-sm flex items-center gap-1.5">
                                <span>{studentName}</span>
                                {!item.user_id && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold border border-slate-200">
                                    Guest
                                  </span>
                                )}
                              </div>
                              {studentEmail && (
                                <div className="text-xs text-neutral-500">{studentEmail}</div>
                              )}
                              {studentCollege && studentCollege !== '-' && (
                                <div className="text-[11px] text-slate-500 font-medium">{studentCollege}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Test Given */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-slate-800 text-sm">
                              {item.test_title || item.test_id || 'Infosys Mock Assessment'}
                            </span>
                            <span className="inline-flex items-center gap-1 w-fit text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              {item.company}
                            </span>
                          </div>
                        </td>

                        {/* Score & Cutoffs */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-900">
                                {item.score} / {item.total_questions}
                              </span>
                              <span className="text-xs font-bold text-neutral-500">
                                ({pct}%)
                              </span>
                            </div>

                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded w-fit ${
                              item.cleared 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {item.cleared ? (
                                <><CheckCircle2 size={11} /> Cutoff Cleared</>
                              ) : (
                                <><XCircle size={11} /> Below Cutoff</>
                              )}
                            </span>

                            {item.sectional_scores && Object.keys(item.sectional_scores).length > 0 && (
                              <div className="text-[10px] text-neutral-500 flex flex-wrap gap-1 mt-0.5">
                                {Object.entries(item.sectional_scores).map(([sec, s]) => (
                                  <span key={sec} className="bg-neutral-100 px-1.5 py-0.2 rounded font-mono">
                                    {sec.split(' ')[0]}: {String(s)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Candidate Feedback */}
                        <td className="p-4 max-w-xs">
                          {item.feedback_rating || item.feedback_comment ? (
                            <div className="flex flex-col gap-1">
                              {item.feedback_rating && (
                                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                  {Array.from({ length: 5 }).map((_, starI) => (
                                    <Star 
                                      key={starI} 
                                      size={12} 
                                      className={starI < item.feedback_rating! ? "fill-amber-400 text-amber-400" : "text-neutral-200"} 
                                    />
                                  ))}
                                  <span className="text-slate-600 font-semibold ml-1">({item.feedback_rating}/5)</span>
                                </div>
                              )}
                              {item.feedback_comment ? (
                                <p className="text-xs text-slate-700 leading-snug line-clamp-3 bg-neutral-50 p-2 rounded-lg border border-neutral-100 italic">
                                  "{item.feedback_comment}"
                                </p>
                              ) : (
                                <span className="text-xs text-neutral-400 italic">Rating only</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400 italic">No written feedback</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="p-4 text-xs text-neutral-500 whitespace-nowrap">
                          {new Date(item.created_at).toLocaleDateString()}
                          <div className="text-[10px] text-neutral-400">
                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => deleteTestScore(item.id)}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Mock Test Submission"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'reviews' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-16">#</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Tag</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {reviews.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-neutral-500">No reviews found.</td></tr>
                ) : (
                  reviews.map((review, i) => (
                    <tr key={review.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-neutral-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="p-4 font-bold text-neutral-900 text-sm">
                        {review.profiles?.name || 'Anonymous'}
                        <div className="text-xs text-neutral-500 font-normal">{review.profiles?.email || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: review.rating }).map((_, rIdx) => <Star key={rIdx} size={14} className="fill-amber-500" />)}
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {review.tag ? (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium capitalize">
                            {review.tag.replace('-', ' ')}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-sm text-neutral-700 max-w-xs break-words">
                        {review.comment || '-'}
                      </td>
                      <td className="p-4 text-sm text-neutral-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Feedback"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'leaderboard' ? (
          <div>
            <div className="p-4 bg-slate-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                PostgreSQL Aggregated Leaderboard
              </span>
              <button
                onClick={copySqlCleanup}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                title="Copy master SQL migration script"
              >
                {copiedSql ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Migration Suite'}</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">Rank</th>
                    <th className="p-4">Player</th>
                    <th className="p-4">College</th>
                    <th className="p-4">Total Score</th>
                    <th className="p-4">Accuracy</th>
                    <th className="p-4">Games Played</th>
                    <th className="p-4 text-right pr-6">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {leaderboard.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-neutral-500">No leaderboard entries found.</td></tr>
                  ) : (
                    leaderboard.map((user, i) => (
                      <tr key={user.user_id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-neutral-900">{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="p-4 font-bold text-neutral-900 text-sm">{user.name || 'Unknown'}</td>
                        <td className="p-4 text-sm text-neutral-600">{user.college || '-'}</td>
                        <td className="p-4 font-bold text-emerald-600">{user.total_score}</td>
                        <td className="p-4 text-sm text-neutral-600">{user.avg_accuracy}%</td>
                        <td className="p-4 text-sm text-neutral-600">{user.total_games}</td>
                        <td className="p-4 pr-6 text-right text-xs text-neutral-500">{user.total_time}s</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'bugs' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-16">#</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bugReports.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-neutral-500">No reports found.</td></tr>
                ) : (
                  bugReports.map((report, i) => (
                    <tr key={report.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-neutral-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="p-4 font-bold text-neutral-900 text-sm">
                        {report.profiles?.name || 'Anonymous'}
                        <div className="text-xs text-neutral-500 font-normal">{report.profiles?.email || '-'}</div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-800">{report.title}</td>
                      <td className="p-4 text-sm text-neutral-700 max-w-xs break-words">{report.description}</td>
                      <td className="p-4 text-sm text-neutral-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => deleteBugReport(report.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'colleges' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Rank</th>
                  <th className="p-4">College Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Number of Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {colleges.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-neutral-500">No colleges found.</td></tr>
                ) : (
                  colleges.map((col, i) => {
                    const colName = col.college || col.name;
                    const isValid = isValidCollegeName(colName).valid;
                    return (
                      <tr key={colName} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-neutral-900">{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="p-4 font-bold text-neutral-900 text-sm">{colName}</td>
                        <td className="p-4 text-xs font-semibold">
                          {isValid ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check size={12} /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertCircle size={12} /> Unverified
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-emerald-600 font-bold">{col.student_count ?? col.students ?? col.studentCount ?? 0} Students</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'daily' ? (
          <div className="overflow-x-auto">
            {/* Summary Bar */}
            <div className="p-4 bg-orange-50/60 border-b border-orange-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-600 fill-orange-500" />
                <span className="font-extrabold text-neutral-900">Daily Hard Problem Challenges</span>
                <span className="text-neutral-500">• All student attempts and speeds recorded in database</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="bg-white px-3 py-1.5 rounded-lg border border-orange-200 text-orange-800 shadow-sm">
                  Today's Solvers: <strong>{todayDailySolversCount ?? 0}</strong>
                </span>
                <span className="bg-white px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 shadow-sm">
                  Total Solvers: <strong>{totalDailySolversCount ?? 0}</strong>
                </span>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">#</th>
                  <th className="p-4">Candidate Name</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Challenge ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Solve Speed</th>
                  <th className="p-4">Streak</th>
                  <th className="p-4 text-right pr-6">Solved At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {dailySolvers.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-neutral-500">No daily challenge attempts recorded yet.</td></tr>
                ) : (
                  dailySolvers.map((s, i) => (
                    <tr key={s.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-neutral-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td className="p-4 font-bold text-neutral-900 text-sm">{s.candidate_name || 'Anonymous'}</td>
                      <td className="p-4 text-sm text-neutral-600">{s.college || '—'}</td>
                      <td className="p-4">
                        <span className="text-xs font-mono font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                          {s.challenge_id}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-neutral-700">{s.challenge_date}</td>
                      <td className="p-4 font-mono font-bold text-emerald-600 text-sm">{s.time_taken_seconds}s</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                          <Flame size={12} className="fill-orange-600" /> {s.streak || 1}d
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right text-xs text-neutral-400 font-mono">
                        {new Date(s.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Server Pagination Bar */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <div>
            Showing <span className="font-bold text-neutral-800">{totalTabCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}</span> to{' '}
            <span className="font-bold text-neutral-800">{Math.min(page * PAGE_SIZE, totalTabCount)}</span> of{' '}
            <span className="font-bold text-neutral-800">{totalTabCount.toLocaleString()}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || tabLoading}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-2 font-medium">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || tabLoading}
              className="p-1.5 rounded-lg border border-neutral-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
