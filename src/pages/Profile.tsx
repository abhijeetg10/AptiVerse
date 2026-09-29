import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Edit3, Trophy, Target, Gamepad2, Flame } from 'lucide-react';
import { cn } from '../utils/cn';

const Profile = () => {
  const { user, updateProfile, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && college.trim()) {
      updateProfile(name.trim(), college.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      
      // If they just completed their profile, redirect to home
      if (!isProfileComplete) {
        navigate('/');
      }
    }
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

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
            Manage your basic information. This will be used for your leaderboard and personal progress.
          </p>
          
          {!isProfileComplete && (
            <div className="mt-4 inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-sm font-bold border border-orange-200">
              ⚠️ Please complete your profile to access games and tracking.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Read-Only Info */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Identity Card */}
            <div className="bg-gradient-to-br from-[#f4f7ff] to-white rounded-2xl border border-primary-50 p-8 flex items-center gap-6 relative overflow-hidden shadow-sm">
              
              {/* Abstract decorative wave */}
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

              <div className="w-28 h-28 rounded-full bg-[#634ff1] text-white flex items-center justify-center text-5xl font-bold shadow-lg z-10 shrink-0 border-4 border-white">
                {getInitial(user?.name || 'User')}
              </div>

              <div className="flex flex-col z-10">
                <h2 className="text-[28px] font-bold text-[#121629] leading-tight mb-1">
                  {user?.name || 'Unknown User'}
                </h2>
                <p className="text-[15px] font-medium text-neutral-500">
                  {user?.college || 'No college specified'}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 grid grid-cols-4 gap-4 divide-x divide-neutral-100">
               
               <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                     <Trophy size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-bold text-[#121629] leading-none mb-1">1,620</span>
                     <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Total Score</span>
                  </div>
               </div>

               <div className="flex items-center gap-3 px-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                     <Gamepad2 size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-bold text-[#121629] leading-none mb-1">42</span>
                     <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Games Played</span>
                  </div>
               </div>

               <div className="flex items-center gap-3 px-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                     <Target size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-bold text-[#121629] leading-none mb-1">78%</span>
                     <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Average Accuracy</span>
                  </div>
               </div>

               <div className="flex items-center gap-3 px-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                     <Flame size={18} />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-lg font-bold text-[#121629] leading-none mb-1">6 Days</span>
                     <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Current Streak</span>
                  </div>
               </div>

            </div>

          </div>

          {/* Right Column: Edit Profile */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Edit3 size={16} />
                 </div>
                 <h2 className="text-[22px] font-bold text-[#121629]">Edit Profile</h2>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-semibold text-neutral-700">Name</label>
                  <input 
                    id="name"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="college" className="text-sm font-semibold text-neutral-700">College Name</label>
                  <input 
                    id="college"
                    type="text" 
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Enter your college name"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={!name.trim() || !college.trim()}
                  className={cn(
                    "mt-2 w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center",
                    name.trim() && college.trim()
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
