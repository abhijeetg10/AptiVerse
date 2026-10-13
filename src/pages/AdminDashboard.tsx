import React, { useEffect, useState, useCallback } from 'react';
import { 
  Shield, Trash2, Users, Gamepad2, Search, AlertTriangle, MessageSquare, 
  Star, Bug, Landmark, Mail, Edit3, BellRing, 
  Copy, Check, AlertCircle, ChevronLeft, ChevronRight, RefreshCw 
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

-- 4. Global Leaderboard View: Unified sudoku + geo_sudoku, fair-play scoring
DROP VIEW IF EXISTS global_leaderboard CASCADE;
CREATE VIEW global_leaderboard AS
WITH normalized_sessions AS (
  SELECT 
    id,
    user_id,
    CASE WHEN game_id = 'geo_sudoku' THEN 'sudoku' ELSE game_id END AS game_id,
    level,
    score,
    accuracy,
    time_spent,
    created_at
  FROM game_sessions
),
distinct_level_scores AS (
  SELECT 
    user_id,
    game_id,
    level,
    MAX(score) AS best_score,
    ROUND(AVG(accuracy)) AS level_acc,
    MIN(time_spent) AS best_time
  FROM normalized_sessions
  GROUP BY user_id, game_id, level
)
SELECT 
  p.id AS user_id,
  p.name,
  p.college,
  p.avatar_url,
  COALESCE(SUM(dls.best_score), 0)::numeric(10,2) AS total_score,
  COALESCE(ROUND(AVG(dls.level_acc)), 0) AS avg_accuracy,
  COUNT(dls.level) AS total_games,
  COALESCE(SUM(dls.best_time), 0) AS total_time
FROM profiles p
JOIN distinct_level_scores dls ON p.id = dls.user_id
WHERE (p.is_blocked IS NOT TRUE)
GROUP BY p.id, p.name, p.college, p.avatar_url;

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
  const [activeUsersCount, setActiveUsersCount] = useState<number | null>(null);
  const [totalCollegesCount, setTotalCollegesCount] = useState<number | null>(null);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [kpiError, setKpiError] = useState<string | null>(null);

  // Active Tab & Pagination
  const [activeTab, setActiveTab] = useState<'users' | 'sessions' | 'reviews' | 'leaderboard' | 'bugs' | 'colleges'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalTabCount, setTotalTabCount] = useState(0);
  const [tabLoading, setTabLoading] = useState(true);
  const [tabError, setTabError] = useState<string | null>(null);

  // Tab Data Buffers
  const [users, setUsers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [bugReports, setBugReports] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [copiedSql, setCopiedSql] = useState(false);

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

      // Exact Active Players (on global leaderboard)
      const { count: activeCount, error: activeErr } = await supabase
        .from('global_leaderboard')
        .select('user_id', { count: 'exact', head: true });
      if (!activeErr && activeCount !== null) {
        setActiveUsersCount(activeCount);
      } else {
        setActiveUsersCount(usersCount ? Math.min(usersCount, 100) : 0);
      }

      // College count query
      const { count: collegeCount } = await supabase
        .from('college_leaderboard')
        .select('college', { count: 'exact', head: true });
      if (collegeCount !== null) {
        setTotalCollegesCount(collegeCount);
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
        let query = supabase
          .from('game_sessions')
          .select(`
            id, user_id, game_id, level, score, accuracy, time_spent, created_at,
            profiles:user_id (name, email)
          `, { count: 'exact' });

        if (searchTerm.trim()) {
          query = query.ilike('game_id', `%${searchTerm.trim()}%`);
        }

        const { data, count, error } = await query
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;
        setSessions(data || []);
        setTotalTabCount(count ?? 0);
      }
      else if (activeTab === 'reviews') {
        let query = supabase
          .from('feedback')
          .select(`
            id, rating, tag, comment, created_at,
            profiles:user_id (name, email)
          `, { count: 'exact' });

        if (searchTerm.trim()) {
          query = query.or(`tag.ilike.%${searchTerm.trim()}%,comment.ilike.%${searchTerm.trim()}%`);
        }

        const { data, count, error } = await query
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;
        setReviews(data || []);
        setTotalTabCount(count ?? 0);
      }
      else if (activeTab === 'leaderboard') {
        let query = supabase
          .from('global_leaderboard')
          .select('*', { count: 'exact' });

        if (searchTerm.trim()) {
          query = query.or(`name.ilike.%${searchTerm.trim()}%,college.ilike.%${searchTerm.trim()}%`);
        }

        const { data, count, error } = await query
          .order('total_score', { ascending: false })
          .order('avg_accuracy', { ascending: false })
          .order('total_time', { ascending: true })
          .range(from, to);

        if (error) throw error;
        setLeaderboard(data ? data.map(u => ({ ...u, college: normalizeCollege(u.college) })) : []);
        setTotalTabCount(count ?? 0);
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
        // Query college statistics via college_leaderboard view or fallback
        const { data: colData, count, error } = await supabase
          .from('college_leaderboard')
          .select('*', { count: 'exact' })
          .order('student_count', { ascending: false })
          .range(from, to);

        if (!error && colData) {
          setColleges(colData);
          setTotalTabCount(count ?? colData.length);
        } else {
          // Fallback to querying colleges directly from profiles
          const { data: profColleges } = await supabase
            .from('profiles')
            .select('college')
            .not('college', 'is', null);

          const map = new Map<string, number>();
          (profColleges || []).forEach(u => {
            const normalized = normalizeCollege(u.college);
            if (normalized === '-') return;
            map.set(normalized, (map.get(normalized) || 0) + 1);
          });
          const list = Array.from(map.entries())
            .map(([name, count]) => ({ college: name, student_count: count }))
            .sort((a, b) => b.student_count - a.student_count);
          setColleges(list.slice(from, to + 1));
          setTotalTabCount(list.length);
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
                        <td className="p-4 text-sm text-emerald-600 font-bold">{col.student_count || col.studentCount || 0} Students</td>
                      </tr>
                    );
                  })
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
