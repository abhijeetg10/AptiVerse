import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit3, Trophy, Target, Gamepad2, Flame, LogOut, AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '../utils/cn';
import { supabase } from '../lib/supabase';
import { CollegeDepartmentSelect } from '../components/auth/CollegeDepartmentSelect';
import { isValidCollegeName } from '../constants/institutions';

const Profile = () => {
  const { user, authUser, signInWithGoogle, updateProfile, isProfileComplete, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || authUser?.user_metadata?.full_name || '');
  const [college, setCollege] = useState(
    user?.college && isValidCollegeName(user.college).valid ? user.college : ''
  );
  const [department, setDepartment] = useState(user?.department || '');
  
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [stats, setStats] = useState({
    totalScore: 0,
    gamesPlayed: 0,
    accuracy: 0,
    streak: 0
  });

  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.college && isValidCollegeName(user.college).valid && !college) {
        setCollege(user.college);
      } else if (user.college && !isValidCollegeName(user.college).valid) {
        setCollege('');
      }
      if (user.department && !department) setDepartment(user.department);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      // 1. Fetch user sessions directly for 100% accurate, immediate stats
      const { data: userSessions } = await supabase
        .from('game_sessions')
        .select('game_id, level, score, accuracy, created_at')
        .eq('user_id', user.id);

      if (userSessions && userSessions.length > 0) {
        let totalScore = 0;
        let accuracySum = 0;
        userSessions.forEach(s => {
          totalScore += Number(s.score) || 0;
          accuracySum += Number(s.accuracy) || 0;
        });

        setStats({
          totalScore: Math.round(totalScore * 100) / 100,
          gamesPlayed: userSessions.length,
          accuracy: Math.round(accuracySum / userSessions.length),
          streak: 1
        });
        return;
      }

      // 2. Fallback to global_leaderboard view
      const { data } = await supabase
        .from('global_leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (data && Number(data.total_games) > 0) {
        setStats({
          totalScore: Number(data.total_score) || 0,
          gamesPlayed: Number(data.total_games) || 0,
          accuracy: Number(data.avg_accuracy) || 0,
          streak: 1
        });
      }
    };
    fetchStats();
  }, [user]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message || 'Google sign in failed');
      setIsLoggingIn(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (name.trim() && college.trim() && department.trim()) {
      const { error } = await updateProfile(name.trim(), college.trim(), department.trim());
      if (error) {
        setErrorMsg(error.message || 'Failed to save changes.');
        return;
      }
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
      
      if (!isProfileComplete) {
        navigate('/');
      }
    } else {
      setErrorMsg('Please select your college and department.');
    }
  };

  const getInitial = (n: string) => {
    return n ? n.charAt(0).toUpperCase() : 'U';
  };

  // If not logged in, render Google Auth Card
  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 py-12">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Sign In with Google
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Compulsory Google Sign-In ensures secure, genuine student accounts and accurate campus leaderboard rankings.
          </p>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 font-semibold border border-red-100">
              {errorMsg}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-400 text-slate-800 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex justify-center items-center gap-3 cursor-pointer disabled:opacity-60"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>{isLoggingIn ? 'Connecting...' : 'Continue with Google'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#f8f9fa] font-sans pb-20">
      <div className="max-w-6xl mx-auto px-6 w-full pt-10">
        
        {/* Header */}
        <div className="mb-10">
          <div className="text-primary-600 font-bold text-xs tracking-widest uppercase mb-2">
            PROFILE
          </div>
          <h1 className="text-4xl lg:text-[40px] font-extrabold text-[#121629] mb-3 tracking-tight">
            Your Profile
          </h1>
          <p className="text-base text-neutral-500 max-w-lg leading-relaxed">
            Manage your verified student information. This calibrates your campus rankings and personal progress.
          </p>
          
          {!isProfileComplete && (
            <div className="mt-4 inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-xl text-sm font-bold border border-orange-200">
              ⚠️ Please select your college and department to complete your profile.
            </div>
          )}

          {user?.is_blocked && (
            <div className="mt-4 bg-red-50 text-red-700 px-5 py-3 rounded-xl text-sm font-bold border border-red-200 flex items-center gap-3">
              <AlertTriangle size={20} className="shrink-0" />
              Your account has been restricted because your college name was invalid. Please select your official college below to continue playing.
            </div>
          )}

          {user?.warning_message && (
            <div className="mt-4 bg-gradient-to-r from-red-50 via-amber-50 to-red-50 text-red-900 p-5 rounded-2xl border-2 border-red-300 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-start gap-3.5">
                <ShieldAlert size={26} className="text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <div className="font-extrabold text-xs uppercase tracking-wider text-red-700 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-200/80 rounded-md font-black">Official Penalty</span>
                    <span>Fair Play Violation & Active Probation</span>
                  </div>
                  <p className="text-sm text-red-900 whitespace-pre-line leading-relaxed font-semibold">
                    {user.warning_message}
                  </p>
                  <p className="text-xs text-red-600 pt-1 font-medium">
                    Automated activity monitoring is active on this account. Play verified levels legitimately to rebuild your standing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Read-Only Info & Stats */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Identity Card */}
            <div className="bg-gradient-to-br from-[#f4f7ff] to-white rounded-2xl border border-indigo-100/70 p-7 flex items-center gap-6 relative overflow-hidden shadow-sm">
              
              {/* Abstract decorative background */}
              <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 pointer-events-none">
                 <svg viewBox="0 0 400 200" className="absolute right-0 h-full transform translate-x-1/4 scale-150" preserveAspectRatio="none">
                    <path d="M0,100 C100,200 200,0 400,100 L400,200 L0,200 Z" fill="#e0e7ff" opacity="0.5"></path>
                    <path d="M0,150 C150,50 250,250 400,150 L400,200 L0,200 Z" fill="#c7d2fe" opacity="0.3"></path>
                 </svg>
              </div>

              {/* Status Pill */}
              <div className="absolute top-6 right-6 bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm z-10">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active
              </div>

              {authUser.user_metadata?.avatar_url ? (
                <img
                  src={authUser.user_metadata.avatar_url}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover z-10 shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#634ff1] text-white flex items-center justify-center text-4xl font-bold shadow-lg z-10 shrink-0 border-4 border-white">
                  {getInitial(user?.name || authUser.email || 'User')}
                </div>
              )}

              <div className="flex flex-col z-10">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-[#121629] leading-tight">
                    {user?.name || authUser.user_metadata?.full_name || 'Verified Student'}
                  </h2>
                  <span title="Google Verified" className="text-emerald-600">
                    <CheckCircle2 size={16} />
                  </span>
                </div>
                
                <p className="text-xs text-slate-500 font-medium mb-1">
                  {authUser.email}
                </p>

                <p className="text-sm font-bold text-indigo-900 leading-snug">
                  {user?.college || 'No college selected'}
                </p>

                {user?.department && (
                  <span className="mt-1 inline-block text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-lg w-fit">
                    {user.department}
                  </span>
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
               <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                     <Trophy size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-bold text-[#121629] leading-none mb-1">{stats.totalScore.toLocaleString()}</span>
                     <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Total Score</span>
                  </div>
               </div>

               <div className="flex items-center gap-3 px-2 sm:px-4 pt-3 sm:pt-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                     <Gamepad2 size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-bold text-[#121629] leading-none mb-1">{stats.gamesPlayed}</span>
                     <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Games Played</span>
                  </div>
               </div>

               <div className="flex items-center gap-3 px-2 sm:px-4 pt-3 sm:pt-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                     <Target size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-bold text-[#121629] leading-none mb-1">{stats.accuracy}%</span>
                     <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Average Accuracy</span>
                  </div>
               </div>

               <div className="flex items-center gap-3 px-2 sm:px-4 pt-3 sm:pt-0">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                     <Flame size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-bold text-[#121629] leading-none mb-1">{stats.streak} Days</span>
                     <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Current Streak</span>
                  </div>
               </div>
            </div>

          </div>

          {/* Right Column: Edit Profile */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-7 sm:p-8">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                      <Edit3 size={16} />
                   </div>
                   <h2 className="text-xl font-bold text-[#121629]">Edit Student Profile</h2>
                </div>
                <button
                  type="button"
                  onClick={async () => { await signOut(); navigate('/'); }}
                  className="px-3.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 font-semibold border border-red-100">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="name"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    required
                  />
                </div>

                {/* Standardized College Dropdown & Department Dropdown */}
                <CollegeDepartmentSelect
                  college={college}
                  setCollege={setCollege}
                  department={department}
                  setDepartment={setDepartment}
                  setErrorMsg={setErrorMsg}
                />

                <button 
                  type="submit"
                  disabled={!name.trim() || !college.trim() || !department.trim()}
                  className={cn(
                    "mt-3 w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center cursor-pointer",
                    name.trim() && college.trim() && department.trim()
                      ? "bg-[#4d4ff0] hover:bg-[#3f41c9] active:scale-[0.98]"
                      : "bg-neutral-300 cursor-not-allowed"
                  )}
                >
                  {isSaved ? "Saved Successfully!" : "Save Changes"}
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
