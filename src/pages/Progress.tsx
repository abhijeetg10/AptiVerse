import React, { useState, useEffect } from 'react';
import { Trophy, Target, Gamepad2, Flame, Clock, Brain, LayoutGrid, RotateCcw, PieChart, BookOpen, Boxes } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Progress = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalScore: 0,
    accuracy: 0,
    gamesPlayed: 0
  });
  
  const [recentGames, setRecentGames] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const fetchProgress = async () => {
      // Fetch high level KPIs
      const { data: kpiData } = await supabase
        .from('global_leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (kpiData) {
        setStats({
          totalScore: kpiData.total_score || 0,
          accuracy: kpiData.avg_accuracy || 0,
          gamesPlayed: kpiData.total_games || 0
        });
      }

      // Fetch recent history
      const { data: history } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (history) {
        setRecentGames(history);
      }
    };
    
    fetchProgress();
  }, [user]);

  const getGameIcon = (gameId: string) => {
    switch (gameId) {
      case 'motion': return <Boxes size={18} className="text-blue-500" />;
      case 'di': return <PieChart size={18} className="text-pink-500" />;
      case 'rc': return <BookOpen size={18} className="text-violet-500" />;
      default: return <Gamepad2 size={18} className="text-slate-500" />;
    }
  };

  const getGameName = (gameId: string) => {
    switch (gameId) {
      case 'motion': return "Motion Challenge";
      case 'di': return "Data Interpretation";
      case 'rc': return "Reading Comprehension";
      default: return "Unknown Game";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] font-sans pb-20">
      
      {/* Hero Banner */}
      <div className="w-full bg-[#f4f7ff] relative overflow-hidden py-10 lg:py-16">
        <div className="absolute bottom-0 left-0 w-full h-[150px] opacity-40 pointer-events-none">
           <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
             <path fill="#e0e7ff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
           </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
             <div className="text-primary-600 font-bold text-xs tracking-widest uppercase mb-3">
                MY PROGRESS
             </div>
             <h1 className="text-4xl lg:text-[44px] font-extrabold text-[#121629] mb-4 tracking-tight leading-tight">
               Keep Improving, <span className="text-primary-600">{user?.name?.split(' ')[0] || 'Player'}</span>
             </h1>
             <p className="text-base lg:text-lg text-neutral-600 max-w-xl leading-relaxed">
               Track your essential progress and focus on what matters.
             </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full -mt-5 relative z-20 flex flex-col gap-6">
        
        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           
           <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                 <Trophy size={24} />
              </div>
              <div className="flex flex-col">
                 <span className="text-2xl font-extrabold text-[#121629]">{stats.totalScore}</span>
                 <span className="text-sm font-medium text-neutral-500">Total Score</span>
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                 <Target size={24} />
              </div>
              <div className="flex flex-col">
                 <span className="text-2xl font-extrabold text-[#121629]">{stats.accuracy}%</span>
                 <span className="text-sm font-medium text-neutral-500">Avg Accuracy</span>
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                 <Gamepad2 size={24} />
              </div>
              <div className="flex flex-col">
                 <span className="text-2xl font-extrabold text-[#121629]">{stats.gamesPlayed}</span>
                 <span className="text-sm font-medium text-neutral-500">Games Played</span>
              </div>
           </div>

        </div>

        {/* Recent Activity (Simplified) */}
        <div className="w-full bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col mt-4">
            <div className="p-6 border-b border-neutral-50 flex items-start gap-3">
                <Clock size={24} className="text-primary-600 shrink-0" />
                <div className="flex flex-col">
                   <h2 className="text-[17px] font-bold text-[#121629]">Recent Activity</h2>
                   <p className="text-xs font-medium text-neutral-500 mt-0.5">Your latest game sessions.</p>
                </div>
            </div>
            
            <div className="flex flex-col">
               {recentGames.length === 0 ? (
                 <div className="p-8 text-center text-neutral-500 text-sm">No games played yet. Play a game to see your history!</div>
               ) : (
                 recentGames.map((game, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                             {getGameIcon(game.game_id)}
                          </div>
                          <div className="flex flex-col">
                             <span className="font-bold text-neutral-900 text-sm">{getGameName(game.game_id)}</span>
                             <span className="text-xs text-neutral-500 font-medium">Level {game.level} • {new Date(game.created_at).toLocaleDateString()}</span>
                          </div>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="font-bold text-emerald-600 text-sm">+{game.score} pts</span>
                          <span className="text-xs font-bold text-neutral-400">{game.accuracy}% acc</span>
                       </div>
                    </div>
                 ))
               )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Progress;
