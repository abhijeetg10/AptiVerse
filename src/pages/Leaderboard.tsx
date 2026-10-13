import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Trophy, Search, ChevronDown, Settings2, Landmark, Target, 
  Gamepad2, ArrowUp, Crown, BarChart2, Medal, X, Check,
  Boxes, Brain, LayoutGrid, RotateCcw, Eye, PieChart, BookOpen, Star
} from 'lucide-react';
import { cn } from '../utils/cn';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { RatingBadge } from '../components/ui/RatingBadge';
import FeedbackModal from '../components/ui/FeedbackModal';

const GAME_OPTIONS = [
  { id: 'all', label: 'All Games', icon: Gamepad2, matchIds: [] },
  { id: 'motion', label: 'Motion Challenge', icon: Boxes, matchIds: ['motion'] },
  { id: 'sudoku', label: 'Geo Sudoku', icon: Brain, matchIds: ['sudoku', 'geo_sudoku'] },
  { id: 'grid', label: 'Grid Challenge', icon: LayoutGrid, matchIds: ['grid'] },
  { id: 'switch', label: 'Switch Challenge', icon: RotateCcw, matchIds: ['switch'] },
  { id: 'inductive', label: 'Inductive Challenge', icon: Eye, matchIds: ['inductive'] },
  { id: 'di', label: 'Tab Based DI', icon: PieChart, matchIds: ['di'] },
  { id: 'rc', label: 'Reading Comprehension', icon: BookOpen, matchIds: ['rc'] },
];

const normalizeCollege = (name: string | null | undefined) => {
  if (!name) return '-';
  const lower = name.trim().toLowerCase();
  if (lower === 'cit' || lower === 'chennai institute of technology') {
    return 'Chennai Institute of Technology';
  }
  return name.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

export const sortLeaderboardEntries = (a: any, b: any) => {
  if ((b.total_score || 0) !== (a.total_score || 0)) {
    return (b.total_score || 0) - (a.total_score || 0);
  }
  if ((b.avg_accuracy || 0) !== (a.avg_accuracy || 0)) {
    return (b.avg_accuracy || 0) - (a.avg_accuracy || 0);
  }
  if ((a.total_time || 0) !== (b.total_time || 0)) {
    return (a.total_time || 0) - (b.total_time || 0);
  }
  return (a.user_id || '').localeCompare(b.user_id || '');
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all-time' | 'this-week' | 'college'>('all-time');
  const [selectedGame, setSelectedGame] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'accuracy' | 'games'>('score');
  
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(25);

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const gameDropdownRef = useRef<HTMLDivElement>(null);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (gameDropdownRef.current && !gameDropdownRef.current.contains(e.target as Node)) {
        setIsGameDropdownOpen(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch leaderboard data based on tab & selected game
  useEffect(() => {
    let isCancelled = false;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setFetchError(null);

      const activeGameOption = GAME_OPTIONS.find(g => g.id === selectedGame);
      const isSpecificGame = selectedGame !== 'all';
      const isWeekly = activeTab === 'this-week';

      try {
        // Fetch blocked user IDs to ensure 100% parity with Admin Dashboard
        const { data: blockedUsers } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_blocked', true);
        const blockedSet = new Set(blockedUsers?.map(b => b.id) || []);

        if (!isSpecificGame && !isWeekly) {
          // All-time all games: fast global_leaderboard view
          const { data, error } = await supabase
            .from('global_leaderboard')
            .select('*')
            .order('total_score', { ascending: false })
            .order('avg_accuracy', { ascending: false })
            .order('total_time', { ascending: true })
            .limit(1000);

          if (error) throw error;

          if (data && !isCancelled) {
            const normalizedData = data
              .filter(u => !blockedSet.has(u.user_id))
              .map(u => ({
                ...u,
                college: normalizeCollege(u.college),
              }))
              .sort(sortLeaderboardEntries);

            setLeaderboard(normalizedData);
          }
        } else if (isWeekly && !isSpecificGame) {
          // Weekly all games view
          try {
            const { data: weekData, error: weekErr } = await supabase
              .from('weekly_leaderboard')
              .select('*')
              .order('total_score', { ascending: false })
              .limit(1000);

            if (!weekErr && weekData && weekData.length > 0 && !isCancelled) {
              setLeaderboard(
                weekData
                  .filter(u => !blockedSet.has(u.user_id))
                  .map(u => ({ ...u, college: normalizeCollege(u.college) }))
                  .sort(sortLeaderboardEntries)
              );
              return;
            }
          } catch {}

          // Fallback to time-windowed game_sessions aggregation
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
          const { data, error } = await supabase
            .from('game_sessions')
            .select('user_id, score, accuracy, created_at, profiles:user_id(id, name, college, avatar_url, is_blocked)')
            .gte('created_at', sevenDaysAgo)
            .order('created_at', { ascending: false })
            .limit(5000);

          if (error) throw error;
          if (data && !isCancelled) {
            const userMap = new Map<string, any>();
            data.forEach((row: any) => {
              if (!row.profiles || row.profiles.is_blocked) return;
              const uid = row.user_id;
              const existing = userMap.get(uid) || {
                user_id: uid,
                name: row.profiles.name || 'Anonymous',
                college: normalizeCollege(row.profiles.college),
                avatar_url: row.profiles.avatar_url,
                total_score: 0,
                accuracy_sum: 0,
                total_games: 0,
                total_time: 0,
              };
              existing.total_score += (row.score || 0);
              existing.accuracy_sum += (row.accuracy || 0);
              existing.total_games += 1;
              userMap.set(uid, existing);
            });

            const aggregated = Array.from(userMap.values())
              .filter(u => !blockedSet.has(u.user_id))
              .map(u => ({
                ...u,
                avg_accuracy: Math.round(u.accuracy_sum / u.total_games),
              }))
              .sort(sortLeaderboardEntries);

            setLeaderboard(aggregated);
          }
        } else {
          // Specific game
          let loadedFromView = false;
          if (isSpecificGame && !isWeekly && activeGameOption?.matchIds?.length) {
            try {
              const { data: viewData, error: viewError } = await supabase
                .from('game_leaderboard')
                .select('*')
                .in('game_id', activeGameOption.matchIds)
                .order('total_score', { ascending: false });

              if (viewData && !viewError && !isCancelled && viewData.length > 0) {
                const normalizedData = viewData
                  .filter(u => !blockedSet.has(u.user_id))
                  .map(u => ({
                    ...u,
                    college: normalizeCollege(u.college),
                  }))
                  .sort(sortLeaderboardEntries);

                setLeaderboard(normalizedData);
                loadedFromView = true;
              }
            } catch {}
          }

          if (!loadedFromView) {
            let query = supabase
              .from('game_sessions')
              .select('user_id, score, accuracy, created_at, profiles:user_id(id, name, college, avatar_url, is_blocked)');

            if (isSpecificGame && activeGameOption?.matchIds?.length) {
              query = query.in('game_id', activeGameOption.matchIds);
            }
            if (isWeekly) {
              const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
              query = query.gte('created_at', sevenDaysAgo);
            }

            const { data, error } = await query
              .order('created_at', { ascending: false })
              .limit(5000);

            if (error) throw error;
            if (data && !isCancelled) {
              const userMap = new Map<string, any>();
              data.forEach((row: any) => {
                if (!row.profiles || row.profiles.is_blocked) return;
                const uid = row.user_id;
                const existing = userMap.get(uid) || {
                  user_id: uid,
                  name: row.profiles.name || 'Anonymous',
                  college: normalizeCollege(row.profiles.college),
                  avatar_url: row.profiles.avatar_url,
                  total_score: 0,
                  accuracy_sum: 0,
                  total_games: 0,
                  total_time: 0,
                };
                existing.total_score += (row.score || 0);
                existing.accuracy_sum += (row.accuracy || 0);
                existing.total_games += 1;
                userMap.set(uid, existing);
              });

              const aggregated = Array.from(userMap.values())
                .filter(u => !blockedSet.has(u.user_id))
                .map(u => ({
                  ...u,
                  avg_accuracy: Math.round(u.accuracy_sum / u.total_games),
                }))
                .sort(sortLeaderboardEntries);

              setLeaderboard(aggregated);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        if (!isCancelled) {
          setFetchError(err.message || 'Unable to connect to rankings service');
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      isCancelled = true;
    };
  }, [activeTab, selectedGame]);

  // Apply sorting
  const sortedLeaderboard = useMemo(() => {
    const list = [...leaderboard];
    if (sortBy === 'accuracy') {
      return list.sort((a, b) => (b.avg_accuracy || 0) - (a.avg_accuracy || 0));
    }
    if (sortBy === 'games') {
      return list.sort((a, b) => (b.total_games || 0) - (a.total_games || 0));
    }
    return list.sort(sortLeaderboardEntries);
  }, [leaderboard, sortBy]);

  // College Aggregation
  const collegeLeaderboard = useMemo(() => {
    const map = new Map<string, { name: string; score: number; studentCount: Set<string>; accuracySum: number; gamesCount: number }>();

    leaderboard.forEach(u => {
      if (!u.college || u.college === '-') return;
      const existing = map.get(u.college) || {
        name: u.college,
        score: 0,
        studentCount: new Set<string>(),
        accuracySum: 0,
        gamesCount: 0,
      };

      existing.score += (u.total_score || 0);
      existing.studentCount.add(u.user_id);
      existing.accuracySum += (u.avg_accuracy || 0);
      existing.gamesCount += 1;
      map.set(u.college, existing);
    });

    return Array.from(map.values())
      .map(c => ({
        name: c.name,
        score: c.score,
        students: c.studentCount.size,
        avgAccuracy: Math.round(c.accuracySum / c.gamesCount),
      }))
      .sort((a, b) => b.score - a.score);
  }, [leaderboard]);

  // Top 100 players for the public leaderboard
  const top100Users = useMemo(() => {
    return sortedLeaderboard.slice(0, 100);
  }, [sortedLeaderboard]);

  // Search Filtering within the Top 100
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return top100Users;

    return top100Users.filter(u => 
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.college && u.college.toLowerCase().includes(query))
    );
  }, [top100Users, searchQuery]);

  const filteredColleges = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return collegeLeaderboard;

    return collegeLeaderboard.filter(c => 
      c.name.toLowerCase().includes(query)
    );
  }, [collegeLeaderboard, searchQuery]);

  // Podium for top 3 (only when not searching and on player views)
  const isSearching = searchQuery.trim().length > 0;
  const isCollegeView = activeTab === 'college';

  const topUsers = filteredUsers.slice(0, 3);
  const podium = [
    topUsers[1] ? { rank: 2, name: topUsers[1].name, college: topUsers[1].college, avatar: topUsers[1].avatar_url, score: topUsers[1].total_score, accuracy: (topUsers[1].avg_accuracy || 0) + '%', games: topUsers[1].total_games } : null,
    topUsers[0] ? { rank: 1, name: topUsers[0].name, college: topUsers[0].college, avatar: topUsers[0].avatar_url, score: topUsers[0].total_score, accuracy: (topUsers[0].avg_accuracy || 0) + '%', games: topUsers[0].total_games } : null,
    topUsers[2] ? { rank: 3, name: topUsers[2].name, college: topUsers[2].college, avatar: topUsers[2].avatar_url, score: topUsers[2].total_score, accuracy: (topUsers[2].avg_accuracy || 0) + '%', games: topUsers[2].total_games } : null
  ];

  // Table slice: when searching, show from index 0; when not searching, show from index 3 (after podium)
  const tableData = useMemo(() => {
    if (isCollegeView) {
      return filteredColleges.slice(0, visibleCount).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        students: c.students,
        score: c.score,
        accuracy: c.avgAccuracy + '%',
      }));
    }

    const startIdx = isSearching ? 0 : 3;
    return filteredUsers.slice(startIdx, visibleCount).map((u, i) => ({
      id: u.user_id,
      rank: isSearching ? (sortedLeaderboard.findIndex(x => x.user_id === u.user_id) + 1) : (i + 4),
      name: u.name,
      college: u.college,
      score: u.total_score,
      avatar: u.avatar_url,
      accuracy: (u.avg_accuracy || 0) + '%',
      games: u.total_games,
    }));
  }, [isCollegeView, isSearching, filteredColleges, filteredUsers, visibleCount, sortedLeaderboard]);

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const userRankIndex = sortedLeaderboard.findIndex(u => u.user_id === user?.id);
  const userRank = userRankIndex >= 0 ? userRankIndex + 1 : '-';
  const userStats = userRankIndex >= 0 ? sortedLeaderboard[userRankIndex] : { total_score: 0, avg_accuracy: 0, total_games: 0 };

  const topColleges = useMemo(() => {
    return collegeLeaderboard.slice(0, 5).map((c, i) => ({ rank: i + 1, name: c.name, score: c.score }));
  }, [collegeLeaderboard]);

  const activeGame = GAME_OPTIONS.find(g => g.id === selectedGame) || GAME_OPTIONS[0];
  const ActiveGameIcon = activeGame.icon;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] font-sans pb-20">
      
      {/* Edge-to-Edge Hero Banner */}
      <div className="w-full bg-gradient-to-r from-[#17133f] via-[#212368] to-[#1a1c4b] relative overflow-hidden py-8 lg:py-14 border-b-4 border-primary-500">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute -top-40 right-40 w-96 h-96 bg-primary-500/30 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-[20%] w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-start w-full lg:w-1/2">
             <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-amber-300 tracking-wider uppercase backdrop-blur-sm">
                   <Trophy size={14} /> COMPETE & IMPROVE
                </div>
                <RatingBadge variant="pill" onFeedbackClick={() => setIsFeedbackOpen(true)} className="bg-white/10 border-white/20 text-white" />
             </div>
             
             <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight">
               Leader<span className="text-primary-400">board</span>
             </h1>
             
             <p className="text-base lg:text-lg text-primary-100 max-w-md leading-relaxed opacity-90">
               See how you rank among other players and challenge your friends. Keep practicing, climb the ranks, and get placement ready!
             </p>
          </div>
          
          <div className="hidden lg:flex relative w-1/2 h-[200px] items-center justify-end">
             {/* Large 3D Trophy */}
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
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
           {/* Tab Buttons */}
           <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-neutral-100 shrink-0">
             <button 
               onClick={() => { setActiveTab('all-time'); setVisibleCount(25); }}
               className={cn("px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer", activeTab === 'all-time' ? "bg-primary-600 text-white shadow-md" : "text-neutral-500 hover:bg-neutral-50")}
             >
               <Trophy size={16} /> All Time
             </button>
             <button 
               onClick={() => { setActiveTab('this-week'); setVisibleCount(25); }}
               className={cn("px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer", activeTab === 'this-week' ? "bg-primary-600 text-white shadow-md" : "text-neutral-500 hover:bg-neutral-50")}
             >
               <Target size={16} /> This Week
             </button>
             <button 
               onClick={() => { setActiveTab('college'); setVisibleCount(25); }}
               className={cn("px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all cursor-pointer", activeTab === 'college' ? "bg-primary-600 text-white shadow-md" : "text-neutral-500 hover:bg-neutral-50")}
             >
               <Landmark size={16} /> College Standings
             </button>
           </div>
           
           {/* Controls: Search, Game Filter, Sort Settings */}
           <div className="flex flex-wrap items-center gap-3">
             {/* Search Bar */}
             <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isCollegeView ? "Search colleges..." : "Search players or colleges..."}
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary-500 shadow-sm transition-all placeholder:text-neutral-400" 
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
             </div>
             
             {/* Game Filter Dropdown */}
             <div className="relative" ref={gameDropdownRef}>
               <button 
                 onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                 className={cn(
                   "flex items-center gap-2.5 bg-white border px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer",
                   selectedGame !== 'all' ? "border-primary-300 text-primary-700 bg-primary-50/50" : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                 )}
               >
                 <ActiveGameIcon size={16} className={selectedGame !== 'all' ? "text-primary-600" : "text-neutral-500"} />
                 <span>{activeGame.label}</span>
                 <ChevronDown size={15} className={cn("text-neutral-400 transition-transform duration-200", isGameDropdownOpen && "rotate-180")} />
               </button>

               {isGameDropdownOpen && (
                 <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                   <div className="px-3.5 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                     Filter by Game Challenge
                   </div>
                   {GAME_OPTIONS.map((g) => {
                     const Icon = g.icon;
                     const isSelected = selectedGame === g.id;
                     return (
                       <button
                         key={g.id}
                         onClick={() => {
                           setSelectedGame(g.id);
                           setIsGameDropdownOpen(false);
                         }}
                         className={cn(
                           "w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-left transition-colors cursor-pointer",
                           isSelected ? "bg-primary-50 text-primary-700 font-bold" : "text-neutral-700 hover:bg-neutral-50"
                         )}
                       >
                         <span className="flex items-center gap-2.5">
                           <Icon size={15} className={isSelected ? "text-primary-600" : "text-neutral-400"} />
                           {g.label}
                         </span>
                         {isSelected && <Check size={14} className="text-primary-600" />}
                       </button>
                     );
                   })}
                 </div>
               )}
             </div>
             
             {/* Sort Settings Menu */}
             <div className="relative" ref={settingsDropdownRef}>
               <button 
                 onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                 className={cn(
                   "border p-2.5 rounded-xl shadow-sm transition-all cursor-pointer",
                   sortBy !== 'score' ? "bg-primary-50 border-primary-300 text-primary-600" : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                 )}
                 title="Sort settings"
               >
                 <Settings2 size={18} />
               </button>

               {isSettingsOpen && (
                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                   <div className="px-3.5 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                     Sort Rankings By
                   </div>
                   <button
                     onClick={() => { setSortBy('score'); setIsSettingsOpen(false); }}
                     className={cn("w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer", sortBy === 'score' ? "bg-primary-50 text-primary-700 font-bold" : "text-neutral-700 hover:bg-neutral-50")}
                   >
                     <span>Total Score (High to Low)</span>
                     {sortBy === 'score' && <Check size={14} className="text-primary-600" />}
                   </button>
                   <button
                     onClick={() => { setSortBy('accuracy'); setIsSettingsOpen(false); }}
                     className={cn("w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer", sortBy === 'accuracy' ? "bg-primary-50 text-primary-700 font-bold" : "text-neutral-700 hover:bg-neutral-50")}
                   >
                     <span>Accuracy (High to Low)</span>
                     {sortBy === 'accuracy' && <Check size={14} className="text-primary-600" />}
                   </button>
                   <button
                     onClick={() => { setSortBy('games'); setIsSettingsOpen(false); }}
                     className={cn("w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors cursor-pointer", sortBy === 'games' ? "bg-primary-50 text-primary-700 font-bold" : "text-neutral-700 hover:bg-neutral-50")}
                   >
                     <span>Games Played (Most to Least)</span>
                     {sortBy === 'games' && <Check size={14} className="text-primary-600" />}
                   </button>
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(selectedGame !== 'all' || isSearching || sortBy !== 'score') && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-neutral-600 bg-white p-3 rounded-xl border border-neutral-200/80 shadow-2xs">
            <span className="font-semibold text-neutral-500">Active Filters:</span>
            {selectedGame !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 font-semibold border border-primary-200/60">
                Game: {activeGame.label}
                <button onClick={() => setSelectedGame('all')} className="hover:text-primary-900 cursor-pointer"><X size={12} /></button>
              </span>
            )}
            {isSearching && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200/60">
                Query: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-amber-900 cursor-pointer"><X size={12} /></button>
              </span>
            )}
            {sortBy !== 'score' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">
                Sort: {sortBy === 'accuracy' ? 'Accuracy' : 'Games'}
                <button onClick={() => setSortBy('score')} className="hover:text-indigo-900 cursor-pointer"><X size={12} /></button>
              </span>
            )}
            <span className="text-neutral-400 ml-auto">
              {isCollegeView ? `${filteredColleges.length} colleges found` : `${filteredUsers.length} players found`}
            </span>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left Column (Podium + Table) */}
           <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Podium: Only display on player view when search is not active and not college tab */}
              {!isCollegeView && !isSearching && podium.some(p => p !== null) && (
              <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-6 pt-10 pb-6">
                 
                 {/* Rank 2 */}
                 {podium[0] && (
                 <div className="w-full md:w-[30%] bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex flex-col items-center text-center relative h-auto md:h-[230px] order-2 md:order-1 mt-6 md:mt-0">
                    <div className="w-10 h-10 rounded-full bg-slate-200 absolute -top-5 flex items-center justify-center border-4 border-white shadow-sm">
                       <Medal size={20} className="text-slate-400" />
                    </div>
                    <div className="w-16 h-16 rounded-full border-2 border-slate-200 mt-3 mb-3 bg-slate-100 flex items-center justify-center shadow-sm overflow-hidden">
                       {podium[0].avatar ? (
                         <img src={podium[0].avatar} alt={podium[0].name} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-2xl font-bold text-slate-500">{getInitial(podium[0].name)}</span>
                       )}
                    </div>
                    <h3 className="font-bold text-neutral-900 text-sm truncate w-full px-2">{podium[0].name}</h3>
                    <p className="text-[10px] text-neutral-500 font-medium mb-4 truncate w-full px-2">{podium[0].college}</p>
                    
                    <div className="w-full grid grid-cols-3 gap-1 mt-auto pt-4 border-t border-neutral-100">
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm">{podium[0].score}</span><span className="text-[9px] text-neutral-400 uppercase">Score</span></div>
                       <div className="flex flex-col border-l border-r border-neutral-100"><span className="font-bold text-neutral-900 text-sm">{podium[0].accuracy}</span><span className="text-[9px] text-neutral-400 uppercase">Accuracy</span></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm">{podium[0].games}</span><span className="text-[9px] text-neutral-400 uppercase">Games</span></div>
                    </div>
                 </div>
                 )}

                 {/* Rank 1 */}
                 {podium[1] && (
                 <div className="w-full md:w-[35%] bg-gradient-to-b from-[#fffbeb] to-white rounded-2xl border border-amber-200 shadow-md p-6 flex flex-col items-center text-center relative h-auto md:h-[270px] z-10 order-1 md:order-2 mt-6 md:mt-0">
                    <div className="absolute -top-8 text-amber-500">
                       <Crown size={40} className="drop-shadow-sm fill-amber-500" />
                    </div>
                    <div className="w-20 h-20 rounded-full border-4 border-amber-200 mt-3 mb-4 shadow-sm bg-amber-50 flex items-center justify-center overflow-hidden">
                       {podium[1].avatar ? (
                         <img src={podium[1].avatar} alt={podium[1].name} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-3xl font-extrabold text-amber-500">{getInitial(podium[1].name)}</span>
                       )}
                    </div>
                    <h3 className="font-bold text-neutral-900 text-base truncate w-full px-2">{podium[1].name}</h3>
                    <p className="text-xs text-neutral-500 font-medium mb-5 truncate w-full px-2">{podium[1].college}</p>
                    
                    <div className="w-full grid grid-cols-3 gap-1 mt-auto pt-5 border-t border-amber-100">
                       <div className="flex flex-col"><span className="font-extrabold text-neutral-900 text-base">{podium[1].score}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Score</span></div>
                       <div className="flex flex-col border-l border-r border-amber-100"><span className="font-extrabold text-neutral-900 text-base">{podium[1].accuracy}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Accuracy</span></div>
                       <div className="flex flex-col"><span className="font-extrabold text-neutral-900 text-base">{podium[1].games}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Games</span></div>
                    </div>
                 </div>
                 )}

                 {/* Rank 3 */}
                 {podium[2] && (
                 <div className="w-full md:w-[30%] bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex flex-col items-center text-center relative h-auto md:h-[230px] order-3 mt-6 md:mt-0">
                    <div className="w-10 h-10 rounded-full bg-orange-100 absolute -top-5 flex items-center justify-center border-4 border-white shadow-sm">
                       <Medal size={20} className="text-orange-500" />
                    </div>
                    <div className="w-16 h-16 rounded-full border-2 border-orange-200 mt-3 mb-3 bg-orange-50 flex items-center justify-center shadow-sm overflow-hidden">
                       {podium[2].avatar ? (
                         <img src={podium[2].avatar} alt={podium[2].name} className="w-full h-full object-cover" />
                       ) : (
                         <span className="text-2xl font-bold text-orange-500">{getInitial(podium[2].name)}</span>
                       )}
                    </div>
                    <h3 className="font-bold text-neutral-900 text-sm truncate w-full px-2">{podium[2].name}</h3>
                    <p className="text-[10px] text-neutral-500 font-medium mb-4 truncate w-full px-2">{podium[2].college}</p>
                    
                    <div className="w-full grid grid-cols-3 gap-1 mt-auto pt-4 border-t border-neutral-100">
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm">{podium[2].score}</span><span className="text-[9px] text-neutral-400 uppercase">Score</span></div>
                       <div className="flex flex-col border-l border-r border-neutral-100"><span className="font-bold text-neutral-900 text-sm">{podium[2].accuracy}</span><span className="text-[9px] text-neutral-400 uppercase">Accuracy</span></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm">{podium[2].games}</span><span className="text-[9px] text-neutral-400 uppercase">Games</span></div>
                    </div>
                 </div>
                 )}

              </div>
              )}

              {/* Table */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                 <div className="min-w-[800px]">
                 
                 {/* Table Header */}
                 {isCollegeView ? (
                   <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                      <div className="col-span-1 text-xs font-bold text-neutral-400 uppercase tracking-wider">#</div>
                      <div className="col-span-5 text-xs font-bold text-neutral-400 uppercase tracking-wider">College Name</div>
                      <div className="col-span-2 text-xs font-bold text-neutral-400 uppercase tracking-wider text-center">Students</div>
                      <div className="col-span-2 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Total Score</div>
                      <div className="col-span-2 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Avg Accuracy</div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                      <div className="col-span-1 text-xs font-bold text-neutral-400 uppercase tracking-wider">#</div>
                      <div className="col-span-3 text-xs font-bold text-neutral-400 uppercase tracking-wider">Player</div>
                      <div className="col-span-3 text-xs font-bold text-neutral-400 uppercase tracking-wider">College</div>
                      <div className="col-span-2 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Total Score</div>
                      <div className="col-span-2 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Accuracy</div>
                      <div className="col-span-1 text-xs font-bold text-neutral-400 uppercase tracking-wider text-center">Games</div>
                   </div>
                 )}

                 {loading ? (
                   <div className="p-12 text-center text-neutral-500 font-medium">Loading Leaderboard data...</div>
                 ) : fetchError ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center gap-3">
                      <p className="font-bold text-rose-600 text-base">Unable to load rankings</p>
                      <p className="text-neutral-500 text-xs max-w-sm">{fetchError}</p>
                    </div>
                  ) : tableData.length === 0 ? (
                   <div className="p-12 flex flex-col items-center justify-center text-center gap-3">
                     <Search size={32} className="text-neutral-300" />
                     <p className="font-bold text-neutral-700 text-base">No results found</p>
                     <p className="text-neutral-500 text-xs max-w-sm">
                       {isSearching ? `No matches found for "${searchQuery}". Try a different keyword.` : "No activity recorded for this period or game."}
                     </p>
                     {isSearching && (
                       <button
                         onClick={() => setSearchQuery('')}
                         className="mt-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-semibold hover:bg-primary-100 transition-colors cursor-pointer"
                       >
                         Clear Search
                       </button>
                     )}
                   </div>
                 ) : isCollegeView ? (
                   <div className="flex flex-col">
                      {tableData.map((row: any) => (
                         <div key={row.name} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-50 items-center hover:bg-neutral-50 transition-colors">
                            <div className="col-span-1 text-sm font-semibold text-neutral-400">
                              <span className={cn(
                                "w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold",
                                row.rank === 1 ? "bg-amber-100 text-amber-700" : row.rank === 2 ? "bg-slate-100 text-slate-700" : row.rank === 3 ? "bg-orange-100 text-orange-700" : "text-neutral-500"
                              )}>
                                {row.rank}
                              </span>
                            </div>
                            <div className="col-span-5 flex items-center gap-2.5">
                               <Landmark size={16} className="text-primary-500 shrink-0" />
                               <span className="font-bold text-sm text-neutral-900">{row.name}</span>
                            </div>
                            <div className="col-span-2 text-sm font-medium text-neutral-600 text-center">{row.students} students</div>
                            <div className="col-span-2 text-sm font-bold text-neutral-900 text-right">{row.score}</div>
                            <div className="col-span-2 text-sm font-bold text-emerald-600 text-right">{row.accuracy}</div>
                         </div>
                      ))}
                   </div>
                 ) : (
                   <div className="flex flex-col">
                      {tableData.map((row: any) => (
                         <div key={`${row.id}-${row.rank}`} className={cn("grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-50 items-center hover:bg-neutral-50 transition-colors", row.id === user?.id ? "bg-primary-50" : "")}>
                            <div className="col-span-1 text-sm font-semibold text-neutral-400">
                              <span className={cn(
                                "w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold",
                                row.rank === 1 ? "bg-amber-100 text-amber-700" : row.rank === 2 ? "bg-slate-100 text-slate-700" : row.rank === 3 ? "bg-orange-100 text-orange-700" : "text-neutral-500"
                              )}>
                                {row.rank}
                              </span>
                            </div>
                            <div className="col-span-3 flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm shrink-0 overflow-hidden">
                                 {row.avatar ? <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" /> : getInitial(row.name)}
                               </div>
                               <span className={cn("font-bold text-sm truncate", row.id === user?.id ? "text-primary-700" : "text-neutral-900")}>
                                 {row.name} {row.id === user?.id && '(You)'}
                               </span>
                            </div>
                            <div className={cn("col-span-3 text-sm font-medium truncate", row.id === user?.id ? "text-primary-600" : "text-neutral-500")}>{row.college}</div>
                            <div className={cn("col-span-2 text-sm font-bold text-right", row.id === user?.id ? "text-primary-700" : "text-neutral-900")}>{row.score}</div>
                            <div className="col-span-2 text-sm font-bold text-emerald-500 text-right">{row.accuracy}</div>
                            <div className={cn("col-span-1 text-sm font-medium text-center", row.id === user?.id ? "text-primary-600" : "text-neutral-500")}>{row.games}</div>
                         </div>
                      ))}
                      
                      {/* Only show fixed user row if they are not in the top visible rows */}
                      {user && !isCollegeView && !tableData.some((u: any) => u.id === user.id) && (
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-primary-50 items-center border-t border-primary-100 relative">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                         <div className="col-span-1 text-xs font-bold text-primary-700">
                           {userRankIndex >= 0 ? `#${userRank}` : 'Unranked'}
                         </div>
                         <div className="col-span-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">{getInitial(user.name)}</div>
                            <span className="font-bold text-primary-700 text-sm truncate">{user.name} (You)</span>
                         </div>
                         <div className="col-span-3 text-sm font-semibold text-primary-600 truncate">{user.college || '-'}</div>
                         {userRankIndex >= 0 ? (
                           <>
                             <div className="col-span-2 text-sm font-bold text-primary-700 text-right">{userStats.total_score || 0}</div>
                             <div className="col-span-2 text-sm font-bold text-primary-600 text-right">{userStats.avg_accuracy || 0}%</div>
                             <div className="col-span-1 text-sm font-bold text-primary-600 text-center">{userStats.total_games || 0}</div>
                           </>
                         ) : (
                           <div className="col-span-5 flex items-center justify-end gap-3">
                             <span className="text-xs text-primary-600 font-medium">
                               {activeTab === 'this-week' ? 'No games played this week yet' : 'Play games to get ranked'}
                             </span>
                             <Link
                               to="/games"
                               className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-lg shadow-sm"
                             >
                               Play Now →
                             </Link>
                           </div>
                         )}
                      </div>
                      )}
                   </div>
                 )}
                 </div>
                </div>

                {/* Load More Button */}
                {!loading && (isCollegeView ? filteredColleges.length : filteredUsers.length) > visibleCount && (
                  <div className="p-4 border-t border-neutral-100 flex justify-center bg-neutral-50/30">
                    <button
                      onClick={() => setVisibleCount(prev => Math.min(100, prev + 25))}
                      className="px-6 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 shadow-2xs transition-all cursor-pointer"
                    >
                      Show More Rankings ({Math.min(visibleCount, isCollegeView ? filteredColleges.length : filteredUsers.length)} of {isCollegeView ? filteredColleges.length : filteredUsers.length})
                    </button>
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
                    <Link to="/profile" className="text-primary-500 text-xs font-bold flex items-center gap-1 hover:text-primary-600">
                      View Profile &rarr;
                    </Link>
                 </div>
                 
                 <div className="flex items-end justify-between mb-2">
                    <div className="flex items-end gap-3">
                       {userRankIndex >= 0 ? (
                         <>
                           <span className="text-5xl font-extrabold text-[#121629]">#{userRank}</span>
                           <div className="flex items-center gap-1 bg-emerald-100 text-emerald-600 px-2 py-1 rounded font-bold text-xs mb-1">
                              <ArrowUp size={12} strokeWidth={3} />
                           </div>
                         </>
                       ) : (
                         <div className="flex flex-col">
                           <span className="text-2xl font-extrabold text-neutral-600">Unranked</span>
                           <span className="text-[11px] font-semibold text-primary-600 mt-0.5">
                             {activeTab === 'this-week' ? 'No games played this week' : 'No games played yet'}
                           </span>
                         </div>
                       )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                       {getInitial(user?.name || '')}
                    </div>
                 </div>
                 <p className="text-sm text-neutral-500 font-medium mb-6">
                   {userRankIndex >= 0 
                     ? "You're doing great! Keep practicing to climb higher." 
                     : (activeTab === 'this-week' 
                         ? "Play any level this week to get your weekly placement!" 
                         : "Play games to climb the rankings and get placement ready.")}
                 </p>
                 
                 <div className="grid grid-cols-3 gap-3">
                    <div className="bg-neutral-50 rounded-xl p-3 flex flex-col items-center gap-2 border border-neutral-100 text-center">
                       <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0"><Trophy size={14}/></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm leading-tight">{userStats.total_score || 0}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Total Score</span></div>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3 flex flex-col items-center gap-2 border border-neutral-100 text-center">
                       <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Target size={14}/></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm leading-tight">{userStats.avg_accuracy || 0}%</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Accuracy</span></div>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3 flex flex-col items-center gap-2 border border-neutral-100 text-center">
                       <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><Gamepad2 size={14}/></div>
                       <div className="flex flex-col"><span className="font-bold text-neutral-900 text-sm leading-tight">{userStats.total_games || 0}</span><span className="text-[10px] text-neutral-500 uppercase font-medium">Games</span></div>
                    </div>
                 </div>

                 {userRankIndex < 0 && (
                   <Link
                     to="/games"
                     className="mt-4 w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-2 shadow-sm transition-all"
                   >
                     <Gamepad2 size={15} /> Play a Game to Get Ranked
                   </Link>
                 )}
              </div>

              {/* Top Colleges Card */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                 <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 text-[#121629] font-bold text-sm tracking-wider uppercase">
                       <Landmark size={16} className="text-primary-600" /> Top Colleges
                    </div>
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

              {/* Platform Community Rating Card */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                 <div className="flex items-center gap-2 text-slate-800 font-bold text-xs tracking-wider uppercase mb-3">
                    <Star size={14} className="text-amber-500 fill-amber-500" /> Community Feedback
                 </div>
                 <RatingBadge variant="card" onFeedbackClick={() => setIsFeedbackOpen(true)} />
              </div>

           </div>
        </div>

      </div>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};

export default Leaderboard;
