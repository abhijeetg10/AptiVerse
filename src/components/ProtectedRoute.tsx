import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, User, Mail, Key, School } from 'lucide-react';
import { cn } from '../utils/cn';
import { supabase } from '../lib/supabase';

const ProtectedRoute = () => {
  const { user, authUser, isLoading, signIn, signInWithGoogle, signUp, updateProfile, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<'signin' | 'signup' | 'profile'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [existingColleges, setExistingColleges] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    const fetchColleges = async () => {
      const { data } = await supabase.from('profiles').select('college');
      if (data) {
        const unique = [...new Set(data.map(d => d.college).filter(c => c && c !== '-'))];
        setExistingColleges(unique.sort());
      }
    };
    fetchColleges();
  }, []);

  // Pre-fill name if available from Google/OAuth
  React.useEffect(() => {
    if (authUser && !name) {
      const authName = authUser.user_metadata?.full_name || user?.name || '';
      if (authName) setName(authName);
    }
  }, [authUser, user, name]);

  // If loading, just show a blank or spinner
  if (isLoading) return <div className="fixed inset-0 bg-[#121629] z-[9999]" />;

  const isBlocked = user?.is_blocked;

  // If profile is complete and not blocked, render the nested routes (the actual games)
  if (authUser && isProfileComplete && !isBlocked) {
    return <Outlet />;
  }

  // Determine actual mode based on state
  let currentMode = mode;
  if (authUser && (!isProfileComplete || isBlocked)) {
    currentMode = 'profile';
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    
    if (currentMode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) setErrorMsg(error.message);
    } else if (currentMode === 'signup') {
      const { error } = await signUp(email, password, name);
      if (error) setErrorMsg(error.message);
      else if (name && college) {
        const { error: profileError } = await updateProfile(name, college);
        if (profileError) setErrorMsg(profileError.message);
      }
    } else if (currentMode === 'profile') {
      const { error } = await updateProfile(name, college);
      if (error) setErrorMsg(error.message);
    }
    
    setIsSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    const { error } = await signInWithGoogle();
    if (error) setErrorMsg(error.message);
  };

  // If profile is NOT complete, render a blocking full-screen sign-in modal overlay
  return (
    <div className="fixed inset-0 z-[9999] bg-[#121629] overflow-hidden flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-primary-600/30 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-64 h-64 bg-accent-600/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      {/* Sign-in Card */}
      <div className="relative z-10 bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-500">
         <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm mx-auto border border-primary-100 rotate-[-5deg]">
            <Lock size={32} />
         </div>
         
         <h2 className="text-3xl font-extrabold text-center text-[#121629] mb-3 tracking-tight">
           {currentMode === 'signin' ? 'Welcome Back' : currentMode === 'signup' ? 'Create Account' : 'Complete Profile'}
         </h2>
         <p className="text-center text-neutral-500 text-sm mb-6 leading-relaxed px-4">
           {currentMode === 'profile' ? (isBlocked ? 'Your account has been restricted. Please update your college name with the correct full name to continue playing.' : 'Just a few more details before you start playing.') : 'Verify your identity to play games, save progress, and prevent fake accounts.'}
         </p>

         {errorMsg && (
           <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 text-center font-medium border border-red-100">
             {errorMsg}
           </div>
         )}

         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {(currentMode === 'signin' || currentMode === 'signup') && (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
              </>
            )}

            {(currentMode === 'signup' || currentMode === 'profile') && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="College Name" 
                    required 
                    value={college} 
                    onChange={e => {
                      setCollege(e.target.value);
                      setShowDropdown(true);
                    }} 
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors" 
                  />
                  {showDropdown && existingColleges.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {existingColleges
                        .filter(c => c.toLowerCase().includes(college.toLowerCase()))
                        .map(c => (
                          <div 
                            key={c} 
                            className="px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 cursor-pointer"
                            onClick={() => {
                              setCollege(c);
                              setShowDropdown(false);
                            }}
                          >
                            {c}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-4 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-600/20 hover:bg-primary-700 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? 'Processing...' : (currentMode === 'signin' ? 'Sign In' : 'Continue')} <ArrowRight size={16} />
            </button>
         </form>
         
         {currentMode !== 'profile' && (
           <>
             <div className="mt-4 flex flex-col gap-3">
               <div className="relative flex items-center py-2">
                 <div className="flex-grow border-t border-neutral-200"></div>
                 <span className="flex-shrink-0 mx-4 text-neutral-400 text-xs uppercase font-bold">Or</span>
                 <div className="flex-grow border-t border-neutral-200"></div>
               </div>
               <button 
                 type="button"
                 onClick={handleGoogleSignIn}
                 className="w-full py-3 px-4 bg-white border border-neutral-200 text-[#121629] rounded-xl text-sm font-bold shadow-sm hover:bg-neutral-50 transition-all flex justify-center items-center gap-2"
               >
                 <svg className="w-5 h-5" viewBox="0 0 24 24">
                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                 </svg>
                 Continue with Google
               </button>
             </div>

             <div className="mt-6 text-center text-sm font-medium text-neutral-500">
               {currentMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
               <button onClick={() => setMode(currentMode === 'signin' ? 'signup' : 'signin')} className="text-primary-600 font-bold hover:underline">
                 {currentMode === 'signin' ? 'Sign Up' : 'Sign In'}
               </button>
             </div>
           </>
         )}
         
         <button 
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 text-xs font-bold text-neutral-400 hover:text-neutral-700 text-center w-full py-2 transition-colors"
         >
            Go back to Home
         </button>
      </div>
    </div>
  );
};

export default ProtectedRoute;
