import React, { useEffect, useState } from 'react';
import { Shield, Trash2, Users, Gamepad2, Search, AlertTriangle, MessageSquare, Star, Bug, Landmark, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';

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
      setUsers(usersData ? usersData.map(u => ({ ...u, college: normalizeCollege(u.college) })) : []);

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

  const collegesMap = new Map<string, number>();
  users.forEach(u => {
    if (!u.college || u.college === '-') return;
    collegesMap.set(u.college, (collegesMap.get(u.college) || 0) + 1);
  });
  const collegesList = Array.from(collegesMap.entries())
    .map(([name, count]) => ({ name, studentCount: count }))
    .sort((a, b) => b.studentCount - a.studentCount);
  
  const filteredColleges = collegesList.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">College</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-neutral-500">No users found.</td></tr>
                )}
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      {user.name || 'Unknown'}
                    </td>
                    <td className="p-4 text-sm text-neutral-600">{user.email || '-'}</td>
                    <td className="p-4 text-sm text-neutral-600">{user.college || '-'}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {user.role !== 'admin' && (
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
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
                  <th className="p-4 pl-6">User</th>
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
                {filteredReviews.map(review => (
                  <tr key={review.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900 text-sm">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {leaderboard.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-neutral-500">No leaderboard data found.</td></tr>
                )}
                {leaderboard.map((user, i) => (
                  <tr key={user.user_id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900">{i + 1}</td>
                    <td className="p-4 font-bold text-neutral-900 text-sm">{user.name || 'Unknown'}</td>
                    <td className="p-4 text-sm text-neutral-600">{user.college || '-'}</td>
                    <td className="p-4 font-bold text-emerald-600">{user.total_score}</td>
                    <td className="p-4 text-sm text-neutral-600">{user.avg_accuracy}%</td>
                    <td className="p-4 text-sm text-neutral-600">{user.total_games}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'bugs' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bugReports.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-neutral-500">No reports found.</td></tr>
                )}
                {bugReports.map(report => (
                  <tr key={report.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900 text-sm">
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-neutral-100 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Rank</th>
                  <th className="p-4">College Name</th>
                  <th className="p-4">Number of Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredColleges.length === 0 && (
                  <tr><td colSpan={3} className="p-8 text-center text-neutral-500">No colleges found.</td></tr>
                )}
                {filteredColleges.map((college, i) => (
                  <tr key={college.name} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 pl-6 font-bold text-neutral-900">{i + 1}</td>
                    <td className="p-4 font-bold text-neutral-900 text-sm">{college.name}</td>
                    <td className="p-4 text-sm text-emerald-600 font-bold">{college.studentCount} Students</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

    </div>
  );
};
