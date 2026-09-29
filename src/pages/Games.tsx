import React from 'react';
import { Trophy, Gamepad2, Brain, Eye, Compass, Hash, BookOpen, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import { GameCard } from '../components/ui/GameCard';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';

const Games = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans pb-20">
      {/* Background shape */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 w-full pt-6 lg:pt-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 text-primary-600 font-bold text-xs tracking-wider uppercase mb-3">
               <Gamepad2 size={16} />
               CHOOSE A GAME
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight">
              Aptitude <span className="text-primary-600">Games</span>
            </h1>
            <p className="text-neutral-500 max-w-xl text-base leading-relaxed">
              Practice different cognitive skills through interactive challenges and improve your speed, accuracy, and problem-solving skills.
            </p>
          </div>
          
          <div className="relative shrink-0">
             <div className="bg-white/60 backdrop-blur-md border border-neutral-200/60 rounded-2xl p-4 pr-10 flex items-center gap-4 shadow-sm w-[380px]">
                <div className="w-12 h-12 rounded-full bg-[#0f172a] flex items-center justify-center shrink-0 shadow-lg">
                   <Trophy size={20} className="text-amber-500" />
                </div>
                <div className="flex flex-col">
                   <span className="font-bold text-neutral-900 text-sm">7 Interactive Games</span>
                   <span className="text-xs text-neutral-500 leading-tight mt-1">Each game is designed to train a specific cognitive skill used in real hiring assessments.</span>
                </div>
             </div>
             
             {/* Hand drawn arrow text */}
             <div className="absolute -right-24 top-0 text-primary-500 font-medium text-sm rotate-[10deg] font-caveat flex flex-col items-center z-20">
                <span>Same skills.</span>
                <span>Higher chances.</span>
                <span>Get Placement Ready.</span>
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" className="mt-1 transform -scale-y-100 rotate-[-120deg] translate-y-4">
                   <path d="M10,90 Q50,10 90,50" stroke="currentColor" strokeWidth="2" fill="none"/>
                   <polygon points="90,50 80,45 85,55" fill="currentColor"/>
                </svg>
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow-sm flex items-center gap-2 transition-transform active:scale-95">
              <Gamepad2 size={16} /> All Games
            </button>
            <button className="px-5 py-2 rounded-xl bg-white text-neutral-600 text-sm font-semibold border border-neutral-200 hover:bg-neutral-50 flex items-center gap-2 transition-all">
              <Brain size={16} className="text-pink-500" /> Logic
            </button>
            <button className="px-5 py-2 rounded-xl bg-white text-neutral-600 text-sm font-semibold border border-neutral-200 hover:bg-neutral-50 flex items-center gap-2 transition-all">
              <Brain size={16} className="text-purple-500" /> Memory
            </button>
            <button className="px-5 py-2 rounded-xl bg-white text-neutral-600 text-sm font-semibold border border-neutral-200 hover:bg-neutral-50 flex items-center gap-2 transition-all">
              <Compass size={16} className="text-emerald-500" /> Spatial
            </button>
            <button className="px-5 py-2 rounded-xl bg-white text-neutral-600 text-sm font-semibold border border-neutral-200 hover:bg-neutral-50 flex items-center gap-2 transition-all">
              <Hash size={16} className="text-amber-500" /> Data
            </button>
            <button className="px-5 py-2 rounded-xl bg-white text-neutral-600 text-sm font-semibold border border-neutral-200 hover:bg-neutral-50 flex items-center gap-2 transition-all">
              <BookOpen size={16} className="text-pink-500" /> Reading
            </button>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50">
             <span className="text-neutral-400 text-sm">⇊ Sort by</span>
             <span className="text-neutral-900 text-sm font-semibold flex items-center gap-1">Recommended <span>v</span></span>
          </div>
        </div>

        {/* Games Grid (4 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
          
          {/* Row 1 */}
          <GameCard 
            to="/games/motion"
            bgClass="bg-blue-50/50"
            title="Motion Challenge"
            desc="Slide obstacles to clear a path and guide the ball into the target hole."
            difficulty="Medium"
            category={{ label: "Spatial Reasoning", icon: <Compass size={12}/> }}
            score="920"
            played="32"
            visual={
              <div className="w-[140px] h-[80px] bg-white rounded-lg border border-blue-100 shadow-sm p-1.5 grid grid-cols-4 grid-rows-3 gap-1 relative">
                <div className="col-start-2 row-start-1 row-span-2 bg-primary-400 rounded-sm shadow-sm"></div>
                <div className="col-start-3 row-start-2 row-span-2 bg-primary-400 rounded-sm shadow-sm"></div>
                <div className="col-start-1 row-start-3 w-4 h-4 bg-red-400 rounded-full shadow-sm place-self-center"></div>
                <div className="col-start-4 row-start-1 w-4 h-4 bg-black rounded-full place-self-center"></div>
                <div className="col-start-2 row-start-3 col-span-2 bg-amber-400 rounded-sm shadow-sm" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)' }}></div>
              </div>
            }
          />

          <GameCard 
            to="/games/sudoku"
            bgClass="bg-amber-50/50"
            title="Geo Sudoku"
            desc="Find the missing shape using Sudoku-style row and column logic."
            difficulty="Hard"
            category={{ label: "Pattern Logic", icon: <Brain size={12}/> }}
            score="780"
            played="28"
            visual={
              <div className="w-[100px] h-[100px] bg-white rounded-lg border border-amber-100 shadow-sm p-2 grid grid-cols-3 gap-1.5">
                <div className="flex justify-center items-center text-primary-500">★</div>
                <div className="flex justify-center items-center text-amber-500">●</div>
                <div className="flex justify-center items-center text-red-400">■</div>
                
                <div className="flex justify-center items-center text-emerald-500">▲</div>
                <div className="flex justify-center items-center bg-amber-50 text-amber-500 font-bold rounded">?</div>
                <div className="flex justify-center items-center text-emerald-500">●</div>
                
                <div className="flex justify-center items-center text-amber-500">●</div>
                <div className="flex justify-center items-center text-amber-500">?</div>
                <div className="flex justify-center items-center text-primary-500">●</div>
              </div>
            }
          />

          <GameCard 
            to="/games/inductive"
            bgClass="bg-accent-50/50"
            title="Inductive Challenge"
            desc="Identify hidden rules in a sequence of shapes and predict the next step."
            difficulty="Medium"
            category={{ label: "Pattern Recognition", icon: <Eye size={12}/> }}
            score="860"
            played="25"
            visual={
              <div className="flex items-center gap-1.5">
                <div className="bg-white p-2 rounded shadow-sm flex gap-1"><div className="w-3 h-3 bg-primary-500"></div><div className="w-3 h-3 bg-primary-500"></div></div>
                <div className="bg-white p-2 rounded shadow-sm flex gap-1"><div className="w-3 h-3 bg-emerald-500"></div><div className="w-3 h-3 bg-emerald-500"></div><div className="w-3 h-3 bg-emerald-500"></div></div>
                <span className="text-neutral-300">→</span>
                <div className="bg-white p-2 rounded border border-dashed border-accent-300 text-accent-500 font-bold">?</div>
              </div>
            }
          />

          <GameCard 
            to="/games/grid"
            bgClass="bg-[#0f172a]"
            title="Grid Challenge"
            desc="Memorize the location of dots and reproduce them after a distraction task."
            difficulty="Hard"
            category={{ label: "Memory + Spatial", icon: <Brain size={12}/> }}
            score="810"
            played="19"
            visual={
              <div className="grid grid-cols-6 gap-1.5 relative">
                {/* Fake tooltip */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-0.5 rounded text-[8px] text-white whitespace-nowrap">Memorize<br/><span className="text-lg font-bold">3s</span></div>
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className={cn("w-2 h-2 rounded-full", [3,8,13,16,19,22].includes(i) ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : [10,14].includes(i) ? "bg-primary-400" : "bg-neutral-800")}></div>
                ))}
              </div>
            }
          />

          {/* Row 2 */}
          <GameCard 
            to="/games/switch"
            bgClass="bg-emerald-50/50"
            title="Switch Challenge"
            desc="Follow transformation rules and determine how inputs map to outputs."
            difficulty="Hard"
            category={{ label: "Logical Mapping", icon: <Brain size={12}/> }}
            score="790"
            played="22"
            visual={
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full"></div>
                  <div className="w-5 h-5 bg-amber-500 clip-triangle"></div>
                  <div className="w-5 h-5 bg-primary-500 rounded-sm"></div>
                </div>
                <div className="flex items-center gap-2 w-full px-4">
                  <div className="flex-1 h-px bg-emerald-200"></div>
                  <div className="bg-emerald-400 text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-sm">SWITCH</div>
                  <div className="flex-1 h-px bg-emerald-200"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 bg-primary-500 rounded-sm"></div>
                  <div className="w-5 h-5 bg-emerald-500 rounded-full"></div>
                  <div className="w-5 h-5 bg-amber-500 clip-triangle"></div>
                </div>
              </div>
            }
          />

          <GameCard 
            to="/games/di"
            bgClass="bg-blue-50/50"
            title="Tab Based DI"
            desc="Analyze tables and charts across multiple tabs and verify complex statements."
            difficulty="Hard"
            category={{ label: "Data Interpretation", icon: <Hash size={12}/> }}
            score="840"
            played="18"
            visual={
              <div className="w-[160px] bg-white rounded-lg border border-blue-100 shadow-sm overflow-hidden flex flex-col">
                <div className="flex bg-primary-500 text-[6px] text-white font-bold">
                  <div className="px-2 py-1 bg-white text-primary-500 border-r border-blue-100">Overview</div>
                  <div className="px-2 py-1 border-r border-primary-400">Sales</div>
                  <div className="px-2 py-1 border-r border-primary-400">Regions</div>
                  <div className="px-2 py-1 border-r border-primary-400">Products</div>
                </div>
                <div className="p-2 flex gap-2">
                  <div className="flex items-end gap-1 flex-1 h-12">
                     <div className="w-full bg-primary-400 h-[40%] rounded-t shadow-sm"></div>
                     <div className="w-full bg-primary-400 h-[80%] rounded-t shadow-sm"></div>
                     <div className="w-full bg-primary-400 h-[60%] rounded-t shadow-sm"></div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-[6px] border-emerald-400 border-r-accent-400 shadow-sm self-center"></div>
                </div>
              </div>
            }
          />

          <GameCard 
            to="/games/rc"
            bgClass="bg-slate-50"
            title="Tab Based RC"
            desc="Navigate between multiple document tabs, combine information and answer questions."
            difficulty="Medium"
            category={{ label: "Reading Comprehension", icon: <BookOpen size={12}/> }}
            score="800"
            played="21"
            visual={
              <div className="w-[160px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex bg-primary-500 text-[6px] text-white font-bold">
                  <div className="px-2 py-1 bg-white text-primary-500 border-r border-slate-200">Document A</div>
                  <div className="px-2 py-1 border-r border-primary-400">Document B</div>
                  <div className="px-2 py-1 border-r border-primary-400">Memo</div>
                  <div className="px-2 py-1 border-r border-primary-400">Report</div>
                </div>
                <div className="p-3 flex flex-col gap-1.5">
                  <div className="h-1 bg-slate-200 rounded w-full"></div>
                  <div className="h-1 bg-slate-200 rounded w-[80%]"></div>
                  <div className="h-1 bg-slate-200 rounded w-[90%] mt-1"></div>
                  <div className="h-1 bg-slate-200 rounded w-[60%]"></div>
                </div>
              </div>
            }
          />

          {/* Promo Card: Improve Your Skills */}
          <Link to="/progress" className="group bg-[#eff3ff] rounded-2xl p-6 border border-primary-100 flex flex-col items-center justify-center text-center relative overflow-hidden transition-shadow hover:shadow-xl">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-50"></div>
             
             <div className="relative z-10 w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-primary-200 rounded-full blur-xl opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="relative w-full h-full bg-primary-500 rounded-3xl rotate-45 flex items-center justify-center shadow-lg shadow-primary-500/30">
                   <div className="-rotate-45">
                      <Star size={40} className="text-amber-300 fill-amber-300" />
                   </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-white w-6 h-6 rounded-lg rotate-12 shadow-sm flex items-center justify-center"><ShieldCheck size={12} className="text-amber-500"/></div>
                <div className="absolute bottom-0 -left-2 bg-white w-6 h-6 rounded-lg -rotate-12 shadow-sm flex items-center justify-center"><ShieldCheck size={12} className="text-accent-500"/></div>
             </div>

             <h3 className="text-xl font-bold text-neutral-900 mb-2 relative z-10">Improve Your Skills</h3>
             <p className="text-sm text-neutral-600 mb-6 leading-relaxed relative z-10">
               Track your progress, beat your best scores, and get ready for top companies.
             </p>

             <button className="relative z-10 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-600/20 flex items-center justify-center gap-2 transition-colors">
                View My Progress <ArrowRight size={16} />
             </button>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Games;
