import React, { useState, useEffect } from 'react';
import { Trophy, Search, ChevronDown, Settings2, Users, Landmark, Target, Gamepad2, Clock, ArrowUp, Crown, BarChart2, Medal } from 'lucide-react';
import { cn } from '../utils/cn';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const normalizeCollege = (name: string | null | undefined) => {
  if (!name) return '-';
  const lower = name.trim().toLowerCase();
  if (lower === 'cit' || lower === 'chennai institute of technology') {
    return 'Chennai Institute of Technology';
  }
  return name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all-time');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('global_leaderboard')
        .select('*')
        .order('total_score', { ascending: false });

      if (data && !error) {
        const normalizedData = data.map(u => ({
          ...u,
          college: normalizeCollege(u.college)
        }));
        setLeaderboard(normalizedData);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, [activeTab]);

  // Adjust rankings for podium (Rank 2, 1, 3 for visual display order)
  const topUsers = leaderboard.slice(0, 3);
  const podium = [
    topUsers[1] ? { rank: 2, name: topUsers[1].name, college: topUsers[1].college, score: topUsers[1].total_score, accuracy: topUsers[1].avg_accuracy + '%', games: topUsers[1].total_games } : null,
    topUsers[0] ? { rank: 1, name: topUsers[0].name, college: topUsers[0].college, score: topUsers[0].total_score, accuracy: topUsers[0].avg_accuracy + '%', games: topUsers[0].total_games } : null,
    topUsers[2] ? { rank: 3, name: topUsers[2].name, college: topUsers[2].college, score: topUsers[2].total_score, accuracy: topUsers[2].avg_accuracy + '%', games: topUsers[2].total_games } : null
  ];

  const tableData = leaderboard.slice(3, 10).map((u, i) => ({
    id: u.user_id,
    rank: i + 4,
    name: u.name,
    college: u.college,
    score: u.total_score,
    accuracy: (u.avg_accuracy || 0) + '%',
    games: u.total_games,
    time: Math.floor((u.total_time || 0) / 60) + ':' + ((u.total_time || 0) % 60).toString().padStart(2, '0'),
  }));

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const userRankIndex = leaderboard.findIndex(u => u.user_id === user?.id);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : '-';
  const userStats = userRankIndex >= 0 ? leaderboard[userRankIndex] : { total_score: 0, avg_accuracy: 0, total_games: 0, total_time: 0 };
  
  const formatTime = (seconds: number) => Math.floor((seconds || 0) / 60) + ':' + ((seconds || 0) % 60).toString().padStart(2, '0');

  const collegeMap = new Map<string, number>();
  leaderboard.forEach(u => {
    if (!u.college) return;
    const current = collegeMap.get(u.college) || 0;
    collegeMap.set(u.college, current + (u.total_score || 0));
  });
  const topColleges = Array.from(collegeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((c, i) => ({ rank: i + 1, name: c[0], score: c[1] }));

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] font-sans pb-20">
      
      {/* Edge-to-Edge Hero Banner */}
      <div className="w-full bg-gradient-to-r from-[#17133f] via-[#212368] to-[#1a1c4b] relative overflow-hidden py-8 lg:py-14 border-b-4 border-primary-500">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-40 right-40 w-96 h-96 bg-primary-500/30 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-[20%] w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="flex flex-col items-start w-full lg:w-1/2">
             <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-amber-300 tracking-wider uppercase mb-6 backdrop-blur-sm">
                <Trophy size={14} /> COMPETE & IMPROVE
             </div>
             
             <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight">
               Leader<span className="text-primary-400">board</span>
             </h1>
             
             <p className="text-base lg:text-lg text-primary-100 max-w-md leading-relaxed opacity-90">
               See how you rank among other players and challenge your friends. Keep practicing, climb the ranks, and get placement ready!
             </p>
          </div>
          
          <div className="hidden lg:flex relative w-1/2 h-[200px] items-center justify-end">
             {/* Large 3D Trophy mock */}
             <div className="absolute right-[180px] z-20 top-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full shadow-[0_0_60px_rgba(245,158,11,0.4)] flex items-center justify-center animate-pulse">
                <Trophy size={96} className="text-white drop-shadow-xl" strokeWidth={1.5} />
             </div>
             
             {/* Floating cards */}
             <div className="absolute right-[350px] top-4 z-30 bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-64 shadow-2xl rotate-[-6deg]">
               <p className="text-sm font-medium text-white leading-relaxed">Top performers solve faster, think smarter, and practice consistently.</p>
             </div>
             
             <div className="absolute right-0 bottom-4 z-10 bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl w-48 shadow-2xl rotate-[4deg] flex flex-col items-center text-center">
               <BarChart2 size={32} className="text-primary-300 mb-3" />
               <p className="text-xs font-bold text-white uppercase tracking-wider leading-relaxed text-primary-200">Improve<br/>Climb Ranks<br/>Get Noticed</p>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full -mt-6 relative z-20">
        
        {/* Filters Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
           <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-neutral-100">
             <button 
               onClick={() => setActiveTab('all-time')}
               className={cn("px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all", activeTab === 'all-time' ? "bg-primary-600 text-white shadow-md" : "text-neutral-500 hover:bg-neutral-50")}
             >
               <Trophy size={16} /> All Time
             </button>
             <button 
               onClick={() => setActiveTab('this-week')}
               className={cn("px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all", activeTab === 'this-week' ? "bg-primary-600 text-white shadow-md" : "text-neutral-500 hover:bg-neutral-50")}
             >
               <Target size={16} /> This Week
             </button>
             <button 
               onClick={() => setActiveTab('college')}
               className={cn("px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all", activeTab === 'college' ? "bg-primary-600 text-white shadow-md" : "text-neutral-500 hover:bg-neutral-50")}
             >
               <Landmark size={16} /> College
             </button>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" placeholder="Search players..." className="pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary-500 w-64 shadow-sm" />
             </div>
             
             <button className="flex items-center gap-6 bg-white border border-neutral-200 px-4 py-2.5 rounded-xl text-sm font-bold text-neutral-700 shadow-sm hover:bg-neutral-50">
               <span className="flex items-center gap-2"><Gamepad2 size={16} className="text-neutral-400"/> All Games</span>
               <ChevronDown size={16} className="text-neutral-400"/>
             </button>
             
             <button className="bg-white border border-neutral-200 p-2.5 rounded-xl shadow-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700">
               <Settings2 size={18} />
             </button>
           </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left Column (Podium + Table) */}
           <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Podium */}
              <div className="flex items-end justify-center gap-4 md:gap-6 pt-10 pb-6">
                 
                 {/* Rank 2 */}
                 {podium[0] && (
                 <div className="w-[30%] bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex flex-col items-center text-center relative h-[230px]">
                    <div className="w-10 h-10 rounded-full bg-slate-200 absolute -top-5 flex items-center justify-center border-4 border-white shadow-sm">
                       <Medal size={20} className="text-slate-400" />
                    </div>
                    <div className="w-16 h-16 rounded-full border-2 border-slate-200 mt-3 mb-3 bg-slate-100 flex items-center justify-center shadow-sm">
                       <span className="text-2xl font-bold text-slate-500">{getInitial(podium[0].name)}</span>
                    </div>
                    <h3 className="font-bold text-neutral-900 text-sm">{podium[0].name}</h3>
                    <p className="text-[10px] text-neutral-500 font-medium mb-4">{podium[0].college}</p>
                    
                    <div className="w-full grid grid-cols-3 gap-1 mt-auto pt-4 border-t border-neutral-100">
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm">{podium[0].score}</span><span className="text-[9px] text-neutral-400 uppercase">Score</span></div>
                       <div className="flex flex-col border-l border-r border-neutral-100"><span className="font-bold text-neutral-900 text-sm">{podium[0].accuracy}</span><span className="text-[9px] text-neutral-400 uppercase">Accuracy</span></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm">{podium[0].games}</span><span className="text-[9px] text-neutral-400 uppercase">Games</span></div>
                    </div>
                 </div>
                 )}

                 {/* Rank 1 */}
                 {podium[1] && (
                 <div className="w-[35%] bg-gradient-to-b from-[#fffbeb] to-white rounded-2xl border border-amber-200 shadow-md p-6 flex flex-col items-center text-center relative h-[270px] z-10">
                    <div className="absolute -top-8 text-amber-500">
                       <Crown size={40} className="drop-shadow-sm fill-amber-500" />
                    </div>
                    <div className="w-20 h-20 rounded-full border-4 border-amber-200 mt-3 mb-4 shadow-sm bg-amber-50 flex items-center justify-center">
                       <span className="text-3xl font-extrabold text-amber-500">{getInitial(podium[1].name)}</span>
                    </div>
                    <h3 className="font-bold text-neutral-900 text-base">{podium[1].name}</h3>
                    <p className="text-xs text-neutral-500 font-medium mb-5">{podium[1].college}</p>
                    
                    <div className="w-full grid grid-cols-3 gap-1 mt-auto pt-5 border-t border-amber-100">
                       <div className="flex flex-col"><span className="font-extrabold text-neutral-900 text-base">{podium[1].score}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Score</span></div>
                       <div className="flex flex-col border-l border-r border-amber-100"><span className="font-extrabold text-neutral-900 text-base">{podium[1].accuracy}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Accuracy</span></div>
                       <div className="flex flex-col"><span className="font-extrabold text-neutral-900 text-base">{podium[1].games}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Games</span></div>
                    </div>
                 </div>
                 )}

                 {/* Rank 3 */}
                 {podium[2] && (
                 <div className="w-[30%] bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex flex-col items-center text-center relative h-[230px]">
                    <div className="w-10 h-10 rounded-full bg-orange-100 absolute -top-5 flex items-center justify-center border-4 border-white shadow-sm">
                       <Medal size={20} className="text-orange-500" />
                    </div>
                    <div className="w-16 h-16 rounded-full border-2 border-orange-200 mt-3 mb-3 bg-orange-50 flex items-center justify-center shadow-sm">
                       <span className="text-2xl font-bold text-orange-500">{getInitial(podium[2].name)}</span>
                    </div>
                    <h3 className="font-bold text-neutral-900 text-sm">{podium[2].name}</h3>
                    <p className="text-[10px] text-neutral-500 font-medium mb-4">{podium[2].college}</p>
                    
                    <div className="w-full grid grid-cols-3 gap-1 mt-auto pt-4 border-t border-neutral-100">
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm">{podium[2].score}</span><span className="text-[9px] text-neutral-400 uppercase">Score</span></div>
                       <div className="flex flex-col border-l border-r border-neutral-100"><span className="font-bold text-neutral-900 text-sm">{podium[2].accuracy}</span><span className="text-[9px] text-neutral-400 uppercase">Accuracy</span></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm">{podium[2].games}</span><span className="text-[9px] text-neutral-400 uppercase">Games</span></div>
                    </div>
                 </div>
                 )}

              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col">
                 
                 {/* Header */}
                 <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                    <div className="col-span-1 text-xs font-bold text-neutral-400 uppercase tracking-wider">#</div>
                    <div className="col-span-3 text-xs font-bold text-neutral-400 uppercase tracking-wider">Player</div>
                    <div className="col-span-3 text-xs font-bold text-neutral-400 uppercase tracking-wider">College</div>
                    <div className="col-span-2 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Total Score</div>
                    <div className="col-span-1 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Accuracy</div>
                    <div className="col-span-1 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right text-center">Games</div>
                    <div className="col-span-1 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Time</div>
                 </div>

                 {loading ? (
                   <div className="p-8 text-center text-neutral-500">Loading Leaderboard...</div>
                 ) : (
                   <div className="flex flex-col">
                      {tableData.map((row, i) => (
                         <div key={row.rank} className={cn("grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-50 items-center hover:bg-neutral-50 transition-colors", row.id === user?.id ? "bg-primary-50" : "")}>
                            <div className="col-span-1 text-sm font-semibold text-neutral-400">{row.rank}</div>
                            <div className="col-span-3 flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm shrink-0">{getInitial(row.name)}</div>
                               <span className={cn("font-bold text-sm", row.id === user?.id ? "text-primary-700" : "text-neutral-900")}>{row.name} {row.id === user?.id && '(You)'}</span>
                            </div>
                            <div className={cn("col-span-3 text-sm font-medium", row.id === user?.id ? "text-primary-600" : "text-neutral-500")}>{row.college}</div>
                            <div className={cn("col-span-2 text-sm font-bold text-right", row.id === user?.id ? "text-primary-700" : "text-neutral-900")}>{row.score}</div>
                            <div className="col-span-1 text-sm font-bold text-emerald-500 text-right">{row.accuracy}</div>
                            <div className={cn("col-span-1 text-sm font-medium text-center", row.id === user?.id ? "text-primary-600" : "text-neutral-500")}>{row.games}</div>
                            <div className={cn("col-span-1 text-sm font-medium text-right", row.id === user?.id ? "text-primary-600" : "text-neutral-500")}>{row.time}</div>
                         </div>
                      ))}
                      
                      {/* Only show fixed user row if they are not in the top visible rows */}
                      {user && !leaderboard.some(u => u.user_id === user.id) && (
                      <div className="grid grid-cols-12 gap-4 px-6 py-5 bg-primary-50 items-center border-t border-primary-100 relative">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                         <div className="col-span-1 text-sm font-bold text-primary-600">-</div>
                         <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">{user.name.charAt(0).toUpperCase()}</div>
                            <span className="font-bold text-primary-700 text-sm">{user.name} (You)</span>
                         </div>
                         <div className="col-span-3 text-sm font-semibold text-primary-600">{user.college}</div>
                         <div className="col-span-2 text-sm font-bold text-primary-700 text-right">0</div>
                         <div className="col-span-1 text-sm font-bold text-primary-600 text-right">0%</div>
                         <div className="col-span-1 text-sm font-bold text-primary-600 text-center">0</div>
                         <div className="col-span-1 text-sm font-bold text-primary-600 text-right">00:00</div>
                      </div>
                      )}
                   </div>
                 )}
              </div>
           </div>

           {/* Right Column (Sidebar) */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Your Rank Card */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-2xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 text-primary-600 font-bold text-sm tracking-wider uppercase">
                       <Target size={16} /> Your Rank
                    </div>
                    <button className="text-primary-500 text-xs font-bold flex items-center gap-1 hover:text-primary-600">
                      View Profile &rarr;
                    </button>
                 </div>
                 
                 <div className="flex items-end justify-between mb-2">
                    <div className="flex items-end gap-3">
                       <span className="text-5xl font-extrabold text-[#121629]">#{userRank}</span>
                       {userRankIndex >= 0 && (
                       <div className="flex items-center gap-1 bg-emerald-100 text-emerald-600 px-2 py-1 rounded font-bold text-xs mb-1">
                          <ArrowUp size={12} strokeWidth={3} />
                       </div>
                       )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                       {getInitial(user?.name || '')}
                    </div>
                 </div>
                 <p className="text-sm text-neutral-500 font-medium mb-6">You're doing great! Keep practicing to climb higher.</p>
                 
                 <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-50 rounded-xl p-3 flex items-center gap-3 border border-neutral-100">
                       <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0"><Trophy size={14}/></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm leading-tight">{userStats.total_score}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Total Score</span></div>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3 flex items-center gap-3 border border-neutral-100">
                       <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Target size={14}/></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm leading-tight">{userStats.avg_accuracy || 0}%</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Accuracy</span></div>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3 flex items-center gap-3 border border-neutral-100">
                       <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Gamepad2 size={14}/></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm leading-tight">{userStats.total_games}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Games Played</span></div>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3 flex items-center gap-3 border border-neutral-100">
                       <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0"><Clock size={14}/></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm leading-tight">{formatTime(userStats.total_time)}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Avg. Time</span></div>
                    </div>
                 </div>
              </div>

              {/* Top Colleges Card */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 text-[#121629] font-bold text-sm tracking-wider uppercase">
                       <Landmark size={16} className="text-primary-600" /> Top Colleges
                    </div>
                    <button className="text-primary-500 text-xs font-bold flex items-center gap-1 hover:text-primary-600">
                      View All &rarr;
                    </button>
                 </div>
                 
                 <div className="flex flex-col gap-4">
                    {topColleges.length === 0 && <span className="text-sm text-neutral-500">No college data yet.</span>}
                    {topColleges.map((col) => (
                       <div key={col.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0", col.rank === 1 ? "bg-amber-100 text-amber-600" : col.rank === 2 ? "bg-slate-100 text-slate-500" : col.rank === 3 ? "bg-orange-100 text-orange-600" : "text-neutral-400")}>
                               {col.rank}
                             </div>
                             <span className="font-semibold text-neutral-700 text-sm break-all">{col.name}</span>
                          </div>
                          <span className="font-bold text-neutral-900 text-sm ml-2">{col.score}</span>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
