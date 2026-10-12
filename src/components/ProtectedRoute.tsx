import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, User, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { CollegeDepartmentSelect } from './auth/CollegeDepartmentSelect';

const ProtectedRoute = () => {
  const { user, authUser, isLoading, signInWithGoogle, updateProfile, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initial values from auth user metadata or existing profile
  useEffect(() => {
    if (authUser) {
      const authName = authUser.user_metadata?.full_name || user?.name || '';
      if (authName && !name) setName(authName);
      
      const userCol = user?.college || authUser.user_metadata?.college || '';
      if (userCol && !college) setCollege(userCol);

      const userDept = user?.department || authUser.user_metadata?.department || '';
      if (userDept && !department) setDepartment(userDept);
    }
  }, [authUser, user]);

  // If loading, show dark backdrop
  if (isLoading) return <div className="fixed inset-0 bg-[#121629] z-[9999]" />;

  const isBlocked = user?.is_blocked;

  // If authenticated, profile is complete, and not blocked -> render game route
  if (authUser && isProfileComplete && !isBlocked) {
    return <Outlet />;
  }

  // Google Sign-In Trigger
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message || 'Failed to sign in with Google');
      setIsSubmitting(false);
    }
  };

  // Profile / Registration Submission (After Google sign-in)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!college.trim()) {
      setErrorMsg('Please select your college from the dropdown.');
      return;
    }
    if (!department.trim()) {
      setErrorMsg('Please select your department.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await updateProfile(name.trim(), college.trim(), department.trim());
    if (error) {
      setErrorMsg(error.message || 'Failed to complete registration. Please try again.');
    }
    setIsSubmitting(false);
  };

  const isProfileStep = !!authUser;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0c1024] overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Decorative ambient lighting */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-7 sm:p-9 max-w-lg w-full border border-slate-100 my-auto animate-in fade-in zoom-in-95 duration-300">
        
        {!isProfileStep ? (
          /* STEP 1: Mandatory Google Sign In */
          <div className="flex flex-col items-center text-center">
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-5 shadow-sm">
              <ShieldCheck size={32} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              Instant Authentication
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Sign In with Google
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              Sign in with your Google account to unlock aptitude games, save your progress, and get ranked on the leaderboard.
            </p>

            {errorMsg && (
              <div className="w-full bg-red-50 text-red-600 text-xs sm:text-sm p-3 rounded-xl mb-5 font-semibold border border-red-100">
                {errorMsg}
              </div>
            )}

            {/* Compulsory Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-400 text-slate-800 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex justify-center items-center gap-3 active:scale-[0.98] disabled:opacity-70 group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>{isSubmitting ? 'Signing in...' : 'Continue with Google'}</span>
            </button>

            {/* Why Google Auth Info */}
            <div className="mt-6 w-full p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2 text-left text-xs text-slate-500">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                Zero passwords to remember or reset
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                Guaranteed genuine student identities
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                Instant cloud progress & leaderboard sync
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: Student Registration Form (College Dropdown & Department) */
          <div className="flex flex-col">
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Step 2 of 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2 mb-1">
                Student Registration
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                {isBlocked 
                  ? 'Your account was restricted due to an invalid college name. Please select your official college below.' 
                  : 'Select your college and department from the verified lists to calibrate your rank.'}
              </p>
            </div>

            {/* Google Verified Account Badge */}
            <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                {authUser?.user_metadata?.avatar_url ? (
                  <img 
                    src={authUser.user_metadata.avatar_url} 
                    alt="Avatar" 
                    className="w-9 h-9 rounded-full ring-2 ring-indigo-500/30 object-cover shrink-0" 
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex flex-col text-left truncate">
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {authUser?.email}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Google Verified
                  </span>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="w-full bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 font-semibold border border-red-100 text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User size={14} className="text-indigo-600" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* College Dropdown & Department Dropdown */}
              <CollegeDepartmentSelect
                college={college}
                setCollege={setCollege}
                department={department}
                setDepartment={setDepartment}
                setErrorMsg={setErrorMsg}
              />

              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !college.trim() || !department.trim()}
                className="w-full mt-3 py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl text-sm font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{isSubmitting ? 'Saving Profile...' : 'Complete & Start Playing'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Back to Home Link */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-5 text-xs font-bold text-slate-400 hover:text-slate-700 text-center w-full py-1.5 transition-colors"
        >
          ← Back to AptiVerse Home
        </button>
      </div>
    </div>
  );
};

export default ProtectedRoute;
