import React, { useEffect, useState } from 'react';
import { Shield, Trash2, Users, Gamepad2, Search, AlertTriangle, MessageSquare, Star, Bug, Landmark, Mail, Edit3, ShieldAlert, BellRing, RotateCcw, Copy, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { isValidCollegeName } from '../constants/institutions';

const SQL_CLEANUP_QUERY = `-- Reset fake/abbreviated college names & require dropdown re-selection
UPDATE profiles
SET college = NULL, department = NULL
WHERE college IS NULL
   OR LENGTH(TRIM(college)) < 5
   OR LOWER(TRIM(college)) IN (
     'abc', 'xyz', 'test', 'demo', 'fake', 'none', 'na', 'n/a', 'asdf', 'qwerty',
     '...', '---', 'other', 'unknown', 'invalid', 'dummy', 'null', 'nil', 'college',
     'cit', 'tki', 'aps', 'vsb', 'iitk', 'ycce', 'gla', 'iem', 'uem', 'siom', 'sfax', 'j', 'san'
   )
   OR department IS NULL;`;

const normalizeCollege = (name: string | null | undefined) => {
  if (!name || name.trim() === '') return '-';
  const lower = name.trim().toLowerCase();
  if (lower === 'cit' || lower === 'chennai institute of technology') {
    return 'Chennai Institute of Technology';
  }
  return name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

export const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [bugReports, setBugReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'sessions' | 'reviews' | 'leaderboard' | 'bugs' | 'colleges'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData ? usersData.map(u => ({ ...u, raw_college: u.college, college: normalizeCollege(u.college) })) : []);

      // Fetch sessions with user details
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('game_sessions')
        .select(`
          *,
          profiles:user_id (name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (sessionsError) throw sessionsError;
      setSessions(sessionsData || []);

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('feedback')
        .select(`
          *,
          profiles:user_id (name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
        
      if (!reviewsError) {
        setReviews(reviewsData || []);
      }

      // Fetch leaderboard
      const { data: leaderboardData } = await supabase
        .from('global_leaderboard')
        .select('*');
      
      let normalizedLeaderboard = [];
      if (leaderboardData) {
        normalizedLeaderboard = leaderboardData.map(u => ({
          ...u,
          college: normalizeCollege(u.college),
        }));
        normalizedLeaderboard.sort((a, b) => b.total_score - a.total_score);
      }
      setLeaderboard(normalizedLeaderboard);

      // Fetch bug reports
      const { data: bugsData } = await supabase
        .from('bug_reports')
        .select(`
          *,
          profiles:user_id (name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
        
      setBugReports(bugsData || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this game session? This affects the leaderboard.')) return;
    
    try {
      const { error } = await supabase.from('game_sessions').delete().eq('id', id);
      if (error) throw error;
      setSessions(sessions.filter(s => s.id !== id));
    } catch (err) {
      alert('Error deleting session');
      console.error(err);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user? ALL their game data will be lost.')) return;
    
    try {
      // Delete game sessions first (foreign key constraint)
      await supabase.from('game_sessions').delete().eq('user_id', id);
      // Then delete profile
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
      setSessions(sessions.filter(s => s.user_id !== id));
    } catch (err) {
      alert('Error deleting user. Note: You may need to delete them from Supabase Auth dashboard directly as well.');
      console.error(err);
    }
  };

  const editUserCollege = async (id: string, currentCollege: string) => {
    const newCollege = window.prompt("Enter new college name:", currentCollege);
    if (newCollege === null || newCollege.trim() === currentCollege) return;
    
    try {
      const { error } = await supabase.from('profiles').update({ college: newCollege.trim() }).eq('id', id);
      if (error) throw error;
      setUsers(users.map(u => u.id === id ? { ...u, college: newCollege.trim() } : u));
    } catch (err) {
      alert('Error updating college');
      console.error(err);
    }
  };

  const renameCollege = async (oldCollegeName: string) => {
    const newCollege = window.prompt(`Rename all instances of "${oldCollegeName}" to:`, oldCollegeName);
    if (newCollege === null || newCollege.trim() === oldCollegeName || newCollege.trim() === '') return;
    
    if (!window.confirm(`Are you sure you want to merge/rename all users from "${oldCollegeName}" to "${newCollege.trim()}"?`)) return;

    try {
      // Find all users that currently fall under this normalized college name
      const userIdsToUpdate = users.filter(u => u.college === oldCollegeName).map(u => u.id);
      
      if (userIdsToUpdate.length === 0) return;

      // Update by ID to avoid case/formatting mismatches with the raw database string
      const { data, error } = await supabase.from('profiles').update({ college: newCollege.trim() }).in('id', userIdsToUpdate).select();
      
      if (error) throw error;

      if (!data || data.length === 0) {
        alert("Warning: The database reported 0 rows updated. This usually means Supabase Row Level Security (RLS) is blocking you from modifying other users' profiles.");
      } else {
        console.log(`Successfully updated ${data.length} profiles in Supabase.`);
      }
      
      // Update local state, passing the new name through normalizeCollege so it matches the expected format
      const normalizedNewName = normalizeCollege(newCollege.trim());
      setUsers(users.map(u => userIdsToUpdate.includes(u.id) ? { ...u, college: normalizedNewName } : u));
      setLeaderboard(leaderboard.map(u => u.college === oldCollegeName ? { ...u, college: normalizedNewName } : u));
    } catch (err) {
      alert('Error renaming college for all users');
      console.error(err);
    }
  };

  const toggleBlockUser = async (id: string, isBlocked: boolean) => {
    if (!window.confirm(`Are you sure you want to ${isBlocked ? 'unblock' : 'block'} this user?`)) return;
    
    try {
      const { error } = await supabase.from('profiles').update({ is_blocked: !isBlocked }).eq('id', id);
      if (error) throw error;
      setUsers(users.map(u => u.id === id ? { ...u, is_blocked: !isBlocked } : u));
    } catch (err) {
      alert('Error blocking/unblocking user');
      console.error(err);
    }
  };

  const copySqlCleanup = () => {
    navigator.clipboard.writeText(SQL_CLEANUP_QUERY);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    alert('SQL Cleanup Query copied to clipboard!\n\nYou can run it in Supabase Dashboard -> SQL Editor to clean all profiles at once.');
  };

  const resetUserCollegeAndDept = async (userId: string, userName: string) => {
    if (!window.confirm(`Reset college and department for "${userName}"?\n\nThis will clear their college and department so they are prompted with the official dropdown to re-select when they next enter a game.`)) return;

    try {
      const { error } = await supabase.from('profiles').update({ college: null, department: null }).eq('id', userId);
      if (error) throw error;
      alert(`Reset completed for ${userName}. They must re-select from the dropdown.`);
      await fetchData();
    } catch (err: any) {
      alert(`Error resetting profile: ${err?.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  const purgeAllFakeColleges = async () => {
    const invalidUsers = users.filter(u => {
      const col = u.raw_college || u.college;
      return !col || col === '-' || !isValidCollegeName(col).valid || !u.department;
    });

    if (invalidUsers.length === 0) {
      alert('All registered users currently have valid verified colleges and departments!');
      return;
    }

    if (!window.confirm(`RESET FAKE/INCOMPLETE COLLEGES:\n\nDetected ${invalidUsers.length} users with missing, abbreviated, or unverified college/department data.\n\nClear their college & department so they must re-select from the official dropdown before playing games?`)) {
      return;
    }

    try {
      const ids = invalidUsers.map(u => u.id);
      const { data, error } = await supabase
        .from('profiles')
        .update({ college: null, department: null })
        .in('id', ids)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        alert(`Note: The database returned 0 updated rows due to Supabase Row Level Security (RLS) on client requests.\n\nPlease copy and run the provided SQL query in Supabase Dashboard -> SQL Editor to update all ${invalidUsers.length} profiles with full admin privileges.`);
      } else {
        alert(`Successfully reset ${data.length} profiles! Affected users will now see the selection dropdown.`);
      }
      await fetchData();
    } catch (err: any) {
      alert(`Error in reset: ${err?.message || 'Unknown error'}.\n\nPlease run the SQL query directly in Supabase SQL Editor.`);
      console.error(err);
    }
  };

  const sendInAppWarning = async (userId: string, userName: string) => {
    const defaultMsg = `⚠️ Fair Play Violation Notice:\n\nIrregular activity and artificial score inflation were detected on your account.\n\nUsing automated scripts or manipulating game submissions violates Aptiverse Fair Play policies. Please adhere to honest gameplay.\n\nContinued violations will result in permanent score removal and an immediate account ban.`;
    const msg = window.prompt(`Enter warning message to display on ${userName}'s screen when they log in:`, defaultMsg);
    if (!msg || msg.trim() === '') return;

    try {
      const { error } = await supabase.from('profiles').update({ warning_message: msg.trim() }).eq('id', userId);
      if (error) {
        if (error.code === 'PGRST204' || (error.message || '').includes('warning_message')) {
          alert('Note: The "warning_message" column needs to be added to the profiles table in Supabase. Run SQL: ALTER TABLE profiles ADD COLUMN IF NOT EXISTS warning_message TEXT;');
          return;
        }
        throw error;
      }
      alert(`In-app warning successfully sent to ${userName}! It will appear on their screen upon login.`);
      setUsers(users.map(u => u.id === userId ? { ...u, warning_message: msg.trim() } : u));
    } catch (err: any) {
      alert(`Error sending in-app warning: ${err?.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  const resetFraudulentScores = async (userId: string, userName: string) => {
    if (!window.confirm(`Reset fraudulent bot scores for "${userName}"?\n\nThis will delete all sessions with Level > 50 (impossible levels created by scripts) and recalculate their leaderboard score.`)) return;

    try {
      const { error } = await supabase.from('game_sessions').delete().eq('user_id', userId).gt('level', 50);
      if (error) throw error;
      alert(`Fraudulent sessions removed for ${userName}! Refreshing leaderboard...`);
      await fetchData();
    } catch (err: any) {
      alert(`Error resetting scores: ${err?.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  const wipeUserToZero = async (userId: string, userName: string) => {
    if (!window.confirm(`STRICT ACTION: Completely wipe ALL scores of "${userName}" to 0 and apply probation warning to their profile?\n\nThis will DELETE ALL game sessions for this user so their score becomes 0, and show a strict Fair Play penalty warning on their profile.`)) return;

    try {
      // 1. Delete all game sessions for this user
      const { error: delErr } = await supabase.from('game_sessions').delete().eq('user_id', userId);
      if (delErr) throw delErr;

      // 2. Set strict warning message on profile
      const penaltyMsg = `⚠️ ACCOUNT PENALTY NOTICE:\n\nAll your leaderboard scores have been wiped to 0 due to detected automated bot scripting and fair play violations.\n\nYour account has been placed on strict administrative probation. Any further script execution or artificial data injection will result in an immediate, permanent ban.`;
      await supabase.from('profiles').update({ warning_message: penaltyMsg }).eq('id', userId);

      alert(`Scores for ${userName} wiped to 0 and probation warning applied!`);
      await fetchData();
    } catch (err: any) {
      alert(`Error wiping scores: ${err?.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  const purgeAllBotAccounts = async () => {
    const threshold = 300;
    const botUsers = leaderboard.filter(u => u.total_games >= threshold);
    if (botUsers.length === 0) {
      alert('No bot accounts found with >= 300 games.');
      return;
    }

    if (!window.confirm(`STRICT BULK PURGE: Detected ${botUsers.length} suspected bot accounts with >= ${threshold} games (e.g. ${botUsers.slice(0, 3).map(u => u.name).join(', ')}...).\n\nWipe ALL their scores to 0 and issue probation warnings on all their profiles?`)) return;

    try {
      let count = 0;
      for (const bot of botUsers) {
        await supabase.from('game_sessions').delete().eq('user_id', bot.user_id);
        await supabase.from('profiles').update({
          warning_message: `⚠️ FAIR PLAY PENALTY:\n\nAll your scores were wiped to 0 due to detected bot scripting. Continued violations will result in permanent ban.`
        }).eq('id', bot.user_id);
        count++;
      }

      alert(`Successfully wiped scores to 0 for all ${count} bot accounts! Refreshing leaderboard...`);
      await fetchData();
    } catch (err: any) {
      alert(`Error in bulk purge: ${err?.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  const deleteBugReport = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bug report?')) return;
    try {
      const { error } = await supabase.from('bug_reports').delete().eq('id', id);
      if (error) throw error;
      setBugReports(bugReports.filter(r => r.id !== id));
    } catch (err: any) {
      alert(`Error deleting report: ${err?.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  const deleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    try {
      const { error } = await supabase.from('feedback').delete().eq('id', id);
      if (error) throw error;
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err: any) {
      alert(`Error deleting feedback: ${err?.message || 'Unknown error'}`);
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredSessions = sessions.filter(s => 
    (s.profiles?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.game_id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredReviews = reviews.filter(r => 
    (r.profiles?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredLeaderboard = leaderboard.filter(u => 
    (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (u.college?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const filteredBugs = bugReports.filter(b => 
    (b.profiles?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (b.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (b.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const collegesMap = new Map<string, number>();
  users.forEach(u => {
    if (!u.college || u.college === '-') return;
    collegesMap.set(u.college, (collegesMap.get(u.college) || 0) + 1);
  });
  const collegesList = Array.from(collegesMap.entries())
    .map(([name, count]) => ({ name, studentCount: count }))
    .sort((a, b) => b.studentCount - a.studentCount);
  
  const filteredColleges = collegesList.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const invalidUsersCount = users.filter(u => {
    const col = u.raw_college || u.college;
    return !col || col === '-' || !isValidCollegeName(col).valid || !u.department;
  }).length;

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-primary-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary-200 text-sm font-bold tracking-wider uppercase mb-2">
            <Shield size={16} /> Admin Portal
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Management</h1>
          <p className="text-primary-100/80 max-w-xl">
            Monitor users, delete test data, and manage the AptiVerse platform. 
          </p>
        </div>
        
        <div className="relative z-10 flex flex-wrap gap-4 mt-4 md:mt-0">
           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] border border-white/10">
              <span className="text-3xl font-bold">{users.length}</span>
              <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Total Users</span>
           </div>
           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] border border-white/10">
              <span className="text-3xl font-bold">{new Set(sessions.map(s => s.user_id)).size}</span>
              <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Active Users</span>
           </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] border border-white/10">
              <span className="text-3xl font-bold">{new Set(users.map(u => u.college).filter(c => c && c !== '-')).size}</span>
              <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Colleges</span>
           </div>
           <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] border border-white/10">
              <span className="text-3xl font-bold">{sessions.length}</span>
              <span className="text-[10px] text-primary-200 font-medium uppercase tracking-wider text-center">Total Games</span>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center bg-white p-2 rounded-xl shadow-sm border border-neutral-100">
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Users size={16} /> Users
          </button>
          <button 
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'sessions' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Gamepad2 size={16} /> Recent Games
          </button>
          <button 
            onClick={() => setActiveTab('colleges')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'colleges' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Landmark size={16} /> Colleges
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'reviews' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <MessageSquare size={16} /> Reviews
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'leaderboard' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Star size={16} /> Leaderboard
          </button>
          <button 
            onClick={() => setActiveTab('bugs')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'bugs' ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Bug size={16} /> Bugs/Contact
          </button>
        </div>
        
        <div className="relative w-full sm:w-64">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
           <input 
             type="text" 
             placeholder="Search..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-medium focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" 
           />
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
             <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-16">Sr. No.</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-neutral-500">No users found.</td></tr>
                )}
                {filteredUsers.map((user, i) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900">{i + 1}</td>
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
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-slate-800">{user.college || '-'}</span>
                        {(!user.college || user.college === '-' || !isValidCollegeName(user.raw_college || user.college).valid) && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded w-fit">
                            <AlertCircle size={10} /> Needs Selection
                          </span>
                        )}
                      </div>
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
                              href={`mailto:${user.email}?subject=${encodeURIComponent('Official Notice: Fair Play Violation & Score Discrepancy on Aptiverse')}&body=${encodeURIComponent(`Dear ${user.name || 'Student'},\n\nOur automated security monitoring system detected irregular session submissions associated with your Aptiverse account (${user.email}).\n\nInjecting artificial scores via scripts, bots, or browser console automation violates our Fair Play policy.\n\nPlease consider this an official warning to discontinue using automation. Continued violations will result in permanent score removal and an account ban.\n\nRegards,\nAptiverse Administration\nhttps://aptiverse.in`)}`}
                              className="p-2 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors inline-flex"
                              title="Send Warning Email"
                            >
                              <ShieldAlert size={16} />
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
                            onClick={() => resetUserCollegeAndDept(user.id, user.name || 'Student')}
                            className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Reset College & Dept (Forces user to re-select from dropdown)"
                          >
                            <RotateCcw size={16} />
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
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'sessions' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Player</th>
                  <th className="p-4">Game</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Score (Acc)</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredSessions.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-neutral-500">No sessions found.</td></tr>
                )}
                {filteredSessions.map(session => (
                  <tr key={session.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900 text-sm">{session.profiles?.name || 'Unknown'}</td>
                    <td className="p-4 text-sm font-medium text-primary-700 capitalize">{session.game_id.replace('-', ' ')}</td>
                    <td className="p-4 text-sm text-neutral-600">{session.level}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-emerald-600">{session.score} pts</span>
                        <span className="text-[10px] font-bold text-neutral-400">{session.accuracy}%</span>
                      </div>
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'reviews' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-16">Sr. No.</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Tag</th>
                  <th className="p-4">Comment</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredReviews.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-neutral-500">No reviews found.</td></tr>
                )}
                {filteredReviews.map((review, i) => (
                  <tr key={review.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900">{i + 1}</td>
                    <td className="p-4 font-bold text-neutral-900 text-sm">
                      {review.profiles?.name || 'Anonymous'}
                      <div className="text-xs text-neutral-500 font-normal">{review.profiles?.email || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={14} className="fill-amber-500" />)}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      {review.tag ? (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium capitalize">
                          {review.tag.replace('-', ' ')}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-sm text-neutral-700 max-w-xs break-words whitespace-normal">
                      {review.comment || '-'}
                    </td>
                    <td className="p-4 text-sm text-neutral-500">
                      {new Date(review.created_at).toLocaleDateString()} {new Date(review.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'leaderboard' ? (
          <div>
            {/* Fair Play & Anti-Cheat Moderation Panel */}
            <div className="p-4 bg-slate-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Fair Play Integrity
                </span>
                <span className="text-xs px-2.5 py-0.5 bg-red-100 text-red-700 font-bold rounded-full">
                  {leaderboard.filter(u => u.total_games >= 300).length} Suspected Bot Accounts (&gt;= 300 games)
                </span>
              </div>
              <button
                onClick={purgeAllBotAccounts}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Wipe All Bot Accounts to 0 ({leaderboard.filter(u => u.total_games >= 300).length} Accounts)</span>
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
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredLeaderboard.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-neutral-500">No leaderboard data found.</td></tr>
                )}
                {filteredLeaderboard.map((user, i) => (
                  <tr key={user.user_id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900">{i + 1}</td>
                    <td className="p-4 font-bold text-neutral-900 text-sm">{user.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-neutral-600">{user.college || '-'}</td>
                    <td className="p-4 font-bold text-emerald-600">{user.total_score}</td>
                    <td className="p-4 text-sm text-neutral-600">{user.avg_accuracy}%</td>
                    <td className="p-4 text-sm text-neutral-600">{user.total_games}</td>
                    <td className="p-4 pr-6 text-right">
                      {(() => {
                        const userProfile = users.find(u => u.id === user.user_id);
                        const userEmail = userProfile?.email;
                        const isBlocked = !!userProfile?.is_blocked;
                        const name = user.name || 'Student';

                        // 1. Fair Play Warning Email
                        const warningSubject = `Official Notice: Fair Play Violation & Score Discrepancy on Aptiverse`;
                        const warningBody = `Dear ${name},\n\nOur automated security monitoring system detected irregular session submissions and artificial score inflation associated with your Aptiverse account (${userEmail || 'registered account'}).\n\nInjecting artificial scores via scripts, bots, or browser console automation violates our Fair Play policy and compromises competitive integrity.\n\nPlease consider this an official warning to discontinue using automation. If unnatural session activity continues:\n1. All your leaderboard scores will be permanently reset.\n2. Your account will be permanently blocked from Aptiverse.\n\nIf you believe this detection was in error, please reply directly to this email.\n\nRegards,\nAptiverse Administration\nhttps://aptiverse.in`;
                        const warningMailtoUrl = userEmail ? `mailto:${userEmail}?subject=${encodeURIComponent(warningSubject)}&body=${encodeURIComponent(warningBody)}` : null;

                        // 2. Feedback Email
                        const feedbackSubject = 'We Value Your Feedback! Help Us Improve Aptiverse';
                        const feedbackBody = `Hello ${name}!\n\nI hope you are enjoying the Aptiverse platform and finding it helpful for your aptitude preparation.\n\nWe would love to hear your valuable feedback, suggestions, and experiences with the platform.\n\nWebsite: https://aptiverse.in\n\nThank you for being a part of the Aptiverse journey!\n\nTeam Aptiverse\nargaikwad24@gmail.com`;
                        const feedbackMailtoUrl = userEmail ? `mailto:${userEmail}?subject=${encodeURIComponent(feedbackSubject)}&body=${encodeURIComponent(feedbackBody)}` : null;

                        return (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Send Official Warning Email */}
                            {warningMailtoUrl && (
                              <a
                                href={warningMailtoUrl}
                                className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors inline-flex"
                                title="Send Official Warning Email"
                              >
                                <ShieldAlert size={16} />
                              </a>
                            )}

                            {/* Send In-App Warning Popup */}
                            <button
                              onClick={() => sendInAppWarning(user.user_id, name)}
                              className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors inline-flex"
                              title="Send In-App Warning (Pops up on student screen upon login)"
                            >
                              <BellRing size={16} />
                            </button>

                            {/* Reset Bot / Scripted Scores */}
                            <button
                              onClick={() => resetFraudulentScores(user.user_id, name)}
                              className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors inline-flex"
                              title="Reset Bot Scores (Delete Level > 50 sessions)"
                            >
                              <RotateCcw size={16} />
                            </button>

                            {/* Strict Action: Wipe All Scores to 0 and Apply Warning */}
                            <button
                              onClick={() => wipeUserToZero(user.user_id, name)}
                              className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors inline-flex"
                              title="STRICT: Wipe All Scores to 0 & Issue Warning on Profile"
                            >
                              <Trash2 size={16} />
                            </button>

                            {/* Instant Block / Unblock User */}
                            <button
                              onClick={() => toggleBlockUser(user.user_id, isBlocked)}
                              className={`p-2 rounded-lg transition-colors inline-flex ${isBlocked ? 'text-red-600 bg-red-100 hover:bg-red-200' : 'text-neutral-400 hover:text-red-600 hover:bg-red-50'}`}
                              title={isBlocked ? "User is Blocked (Click to Unblock)" : "Block User"}
                            >
                              <AlertTriangle size={16} />
                            </button>

                            {/* Ask for Feedback Email */}
                            {feedbackMailtoUrl && (
                              <a
                                href={feedbackMailtoUrl}
                                className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                                title="Ask for Feedback Email"
                              >
                                <Mail size={16} />
                              </a>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        ) : activeTab === 'bugs' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-16">Sr. No.</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredBugs.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-neutral-500">No reports found.</td></tr>
                )}
                {filteredBugs.map((report, i) => (
                  <tr key={report.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900">{i + 1}</td>
                    <td className="p-4 font-bold text-neutral-900 text-sm">
                      {report.profiles?.name || 'Anonymous'}
                      <div className="text-xs text-neutral-500 font-normal">{report.profiles?.email || '-'}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-800">
                      {report.title}
                    </td>
                    <td className="p-4 text-sm text-neutral-700 max-w-xs break-words whitespace-normal">
                      {report.description}
                    </td>
                    <td className="p-4 text-sm text-neutral-500">
                      {new Date(report.created_at).toLocaleDateString()} {new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {report.profiles?.email && (() => {
                          const name = report.profiles.name || 'there';
                          const subject = `Re: Your Report on AptiVerse - Update`;
                          const body = `Hi ${name},\n\nThank you for your feedback on "${report.title}".\n\nWe have reviewed and worked on your suggestion. The platform has been updated accordingly.\n\nThank you for helping us improve AptiVerse!\n\nBest Regards,\nTeam AptiVerse`;
                          const mailtoUrl = `mailto:${report.profiles.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                          return (
                            <a
                              href={mailtoUrl}
                              className="p-2 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                              title={`Reply to ${report.profiles.email}`}
                            >
                              <Mail size={16} />
                            </a>
                          );
                        })()}
                        <button
                          onClick={() => deleteBugReport(report.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'colleges' ? (
          <div className="flex flex-col">
            {/* Top Standardization Banner */}
            <div className="p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-b border-neutral-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-sm mt-0.5 shrink-0">
                  <Landmark size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    College & Department Standardization
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Anti-Spam
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                    Clear old fake, abbreviated, or missing college & department records. When cleared, affected students must select their verified college and department from the official dropdown before entering games.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs font-bold">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">
                      {invalidUsersCount} Students need re-selection
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                      {users.length - invalidUsersCount} Verified profiles
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                <Button
                  onClick={copySqlCleanup}
                  variant="secondary"
                  className="text-xs font-bold flex items-center gap-1.5 border-amber-300 hover:bg-amber-100 text-amber-900 bg-white"
                >
                  {copiedSql ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  <span>{copiedSql ? 'Copied SQL' : 'Copy Supabase SQL'}</span>
                </Button>
                <Button
                  onClick={purgeAllFakeColleges}
                  className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw size={14} />
                  <span>Reset All Fake Records</span>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    <th className="p-4 pl-6">Rank</th>
                    <th className="p-4">College Name</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Number of Students</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredColleges.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-neutral-500">No colleges found.</td></tr>
                  )}
                  {filteredColleges.map((college, i) => {
                    const isColValid = isValidCollegeName(college.name).valid;
                    return (
                      <tr key={college.name} className="hover:bg-neutral-50/50 transition-colors group">
                        <td className="p-4 pl-6 font-bold text-neutral-900">{i + 1}</td>
                        <td className="p-4 font-bold text-neutral-900 text-sm">{college.name}</td>
                        <td className="p-4 text-xs font-semibold">
                          {isColValid ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check size={12} /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertCircle size={12} /> Abbreviation / Unverified
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-emerald-600 font-bold">{college.studentCount} Students</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => renameCollege(college.name)}
                              className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Rename / Merge College"
                            >
                              <Edit3 size={16} />
                            </button>
                            {!isColValid && (
                              <button
                                onClick={async () => {
                                  if (!window.confirm(`Wipe "${college.name}" for all ${college.studentCount} students so they must re-select from the official list?`)) return;
                                  const userIds = users.filter(u => u.college === college.name || u.raw_college === college.name).map(u => u.id);
                                  await supabase.from('profiles').update({ college: null, department: null }).in('id', userIds);
                                  await fetchData();
                                }}
                                className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Wipe this unverified college and force re-selection"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

    </div>
  );
};
