import React, { useEffect, useState } from 'react';
import { Play, Flame, Target, Trophy, Clock, Brain, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    accuracy: 0,
    games: 0,
    score: 0,
  });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('global_leaderboard')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (data && !error) {
        setStats({
          accuracy: data.avg_accuracy || 0,
          games: data.total_games || 0,
          score: data.total_score || 0,
        });
      }
    };
    
    fetchStats();
  }, [user]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">{greeting()}, {user?.name?.split(' ')[0] || 'Player'}</h1>
        <p className="text-neutral-500 text-lg">Ready for another round?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Action - Continue Practicing */}
        <div className="lg:col-span-2 card bg-gradient-to-br from-primary-900 to-accent-900 text-white p-8 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded">RESUME</span>
              <span className="text-primary-100 text-sm">Last played: Today</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Motion Challenge</h2>
            <div className="text-primary-200 font-medium">Level {Math.max(1, Math.floor(stats.games / 3) + 1)}</div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-8">
            <div className="flex-1 max-w-sm">
              <div className="flex justify-between text-sm mb-2 text-primary-100">
                <span>Progress</span>
                <span className="font-bold text-white">{(stats.games % 15) || 1} / 15</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: `${Math.max(10, ((stats.games % 15) || 1) / 15 * 100)}%` }}></div>
              </div>
            </div>
            
            <Link to="/games/motion">
              <Button className="w-full sm:w-auto bg-white text-primary-900 hover:bg-neutral-100 px-8 h-12 text-base rounded-xl gap-2 font-bold shadow-lg">
                <Play size={18} fill="currentColor" /> Continue
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5 flex flex-col items-start gap-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Flame size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{stats.games > 0 ? 1 : 0} Days</div>
              <div className="text-sm text-neutral-500 font-medium">Current Streak</div>
            </div>
          </div>
          <div className="card p-5 flex flex-col items-start gap-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{stats.accuracy}%</div>
              <div className="text-sm text-neutral-500 font-medium">Avg. Accuracy</div>
            </div>
          </div>
          <div className="card p-5 flex flex-col items-start gap-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{stats.games}</div>
              <div className="text-sm text-neutral-500 font-medium">Games Played</div>
            </div>
          </div>
          <div className="card p-5 flex flex-col items-start gap-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{stats.score}</div>
              <div className="text-sm text-neutral-500 font-medium">Total Score</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
