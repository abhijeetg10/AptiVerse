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
    timeMins: 0,
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
          timeMins: Math.floor((data.total_time || 0) / 60),
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
              <Trophy size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{stats.games}</div>
              <div className="text-sm text-neutral-500 font-medium">Games Played</div>
            </div>
          </div>
          <div className="card p-5 flex flex-col items-start gap-3 bg-white">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">{Math.floor(stats.timeMins / 60)}h {stats.timeMins % 60}m</div>
              <div className="text-sm text-neutral-500 font-medium">Practice Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Skill Analysis */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-neutral-900">Skill Analysis</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Brain size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Strongest</div>
                <div className="font-bold text-neutral-900">Spatial Reasoning</div>
                <div className="text-sm text-emerald-600 font-medium">+12% vs avg</div>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-4 border-amber-200 bg-amber-50/30">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Needs Work</div>
                <div className="font-bold text-neutral-900">Data Interpretation</div>
                <div className="text-sm text-amber-600 font-medium">Try Tab Based DI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-neutral-900">Recommended for You</h3>
          <Link to="/games/tab-di" className="card p-5 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-md transition-all group bg-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                 <div className="flex items-end gap-1 w-6 h-6">
                   <div className="w-1.5 h-3 bg-blue-300 rounded-sm"></div>
                   <div className="w-1.5 h-5 bg-blue-500 rounded-sm"></div>
                   <div className="w-1.5 h-4 bg-blue-400 rounded-sm"></div>
                 </div>
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">Tab Based DI</h4>
                <div className="text-sm text-neutral-500">Practice weak skill</div>
              </div>
            </div>
            <Button variant="secondary" className="w-full">Play Now</Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
