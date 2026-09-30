import React, { useState } from 'react';
import { ArrowRight, BarChart2, Gamepad2, Users, Trophy, Briefcase, Zap, Target, Brain, LineChart, ChevronRight, Star, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GameCard } from '../components/ui/GameCard';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';
import FeedbackModal from '../components/ui/FeedbackModal';

const Home = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="flex flex-col font-sans bg-white">
      {/* Hero Section */}
      <section className="relative pt-6 pb-16 lg:pt-8 lg:pb-24 overflow-hidden">
        {/* Subtle background gradient shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-50/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left: Content */}
          <div className="flex flex-col items-start gap-6 relative z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary-100 text-primary-600 text-xs font-semibold shadow-sm">
              <Gamepad2 size={14} />
              Gamified Aptitude Practice Platform
            </div>
            
            <h1 className="text-5xl lg:text-[64px] leading-[1.1] font-extrabold tracking-tight text-neutral-900">
              Practice Smarter.<br />
              <span className="text-primary-600">Get Placement Ready.</span>
            </h1>
            
            <p className="text-lg text-neutral-500 max-w-lg leading-relaxed">
              Improve your speed, accuracy, and problem-solving skills through interactive games inspired by real hiring assessments at top tech companies.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link to="/games">
                <Button size="lg" className="gap-2 text-sm px-8 h-12 rounded-xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/20">
                  Start Playing <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/progress">
                <Button variant="secondary" size="lg" className="gap-2 text-sm px-8 h-12 rounded-xl bg-white border-0 shadow-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 font-semibold">
                  <BarChart2 size={16} className="text-primary-600" /> View My Progress
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Visual Showcase (The Floating Cards) */}
          <div className="relative w-full h-[500px] flex items-center justify-center">
             {/* Hand drawn arrow text */}
             <div className="absolute top-0 right-[10%] z-30 text-primary-500 font-medium text-sm rotate-[15deg] font-caveat flex flex-col items-center">
                <span>Play</span>
                <span>Solve</span>
                <span>Improve</span>
                <span>Get Hired</span>
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" className="mt-1 transform -scale-y-100 -rotate-45">
                   <path d="M10,90 Q50,10 90,50" stroke="currentColor" strokeWidth="2" fill="none"/>
                   <polygon points="90,50 80,45 85,55" fill="currentColor"/>
                </svg>
             </div>

            {/* Central Dark Card - Motion Challenge */}
            <div className="absolute z-20 w-[280px] bg-[#0f172a] rounded-[24px] p-4 shadow-2xl border border-neutral-700/50 transform rotate-[-2deg]">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white">A</div>
                  <span className="text-white font-medium text-xs">Motion Challenge</span>
                </div>
                <div className="text-neutral-400 text-[10px] flex items-center gap-1">
                   ⏱ 00:45
                </div>
              </div>
              <div className="bg-[#1e293b] rounded-xl p-2 grid grid-cols-4 grid-rows-5 gap-1 aspect-[4/5] relative">
                 {/* Blocks */}
                 <div className="absolute top-[10%] left-[10%] w-[45%] h-[18%] bg-primary-500 rounded shadow border border-primary-400/50"></div>
                 <div className="absolute top-[32%] left-[10%] w-[45%] h-[18%] bg-primary-500 rounded shadow border border-primary-400/50"></div>
                 <div className="absolute bottom-[10%] right-[10%] w-[45%] h-[38%] bg-amber-500 rounded shadow border border-amber-400/50" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)' }}></div>
                 <div className="absolute bottom-[15%] left-[15%] w-[20%] h-[16%] bg-red-500 rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3)]"></div>
                 <div className="absolute top-[35%] right-[15%] w-[20%] h-[16%] bg-black rounded-full border-2 border-neutral-800"></div>
              </div>
            </div>

            {/* Geo Sudoku */}
            <div className="absolute z-10 w-[200px] bg-white rounded-2xl p-3 shadow-xl border border-neutral-100 -left-4 top-[10%] transform rotate-[-8deg]">
               <div className="text-neutral-800 font-semibold text-[10px] mb-2">Geo Sudoku</div>
               <div className="grid grid-cols-3 gap-1 aspect-square bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                 <div className="bg-white rounded flex items-center justify-center shadow-sm"><div className="w-4 h-4 bg-primary-500 clip-star">★</div></div>
                 <div className="bg-white rounded flex items-center justify-center shadow-sm"><div className="w-4 h-4 rounded-full bg-amber-500"></div></div>
                 <div className="bg-white rounded flex items-center justify-center shadow-sm"><div className="w-4 h-4 bg-red-500">■</div></div>
                 
                 <div className="bg-white rounded flex items-center justify-center shadow-sm"><div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-transparent border-b-accent-500"></div></div>
                 <div className="bg-amber-100 rounded flex items-center justify-center shadow-inner"><span className="text-amber-500 font-bold">?</span></div>
                 <div className="bg-white rounded flex items-center justify-center shadow-sm"><div className="w-4 h-4 bg-emerald-500 rounded-full"></div></div>
                 
                 <div className="bg-white rounded flex items-center justify-center shadow-sm"><div className="w-4 h-4 bg-red-500 rounded-full"></div></div>
                 <div className="bg-white rounded flex items-center justify-center shadow-sm"><div className="w-4 h-4 bg-emerald-500">■</div></div>
                 <div className="bg-white rounded flex items-center justify-center shadow-sm"><div className="w-4 h-4 bg-primary-500 rounded-full"></div></div>
               </div>
            </div>

            {/* Grid Challenge */}
            <div className="absolute z-10 w-[200px] bg-[#1e1b4b] rounded-2xl p-3 shadow-xl border border-indigo-900/50 -right-8 top-[15%] transform rotate-[6deg]">
               <div className="text-white font-semibold text-[10px] mb-2">Grid Challenge</div>
               <div className="grid grid-cols-5 gap-1.5 aspect-[5/3]">
                 {Array.from({ length: 15 }).map((_, i) => (
                   <div key={i} className="flex items-center justify-center">
                     <div className={cn("w-2 h-2 rounded-full", [2,5,9,12,14].includes(i) ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : [3,8].includes(i) ? "bg-primary-400" : "bg-indigo-900/50")}></div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Inductive Challenge */}
            <div className="absolute z-10 w-[200px] bg-white rounded-2xl p-3 shadow-xl border border-neutral-100 -left-8 bottom-[10%] transform rotate-[4deg]">
               <div className="text-neutral-800 font-semibold text-[10px] mb-2">Inductive</div>
               <div className="flex gap-2 items-center bg-accent-50/50 p-2 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded shadow-sm flex items-center justify-center text-primary-500 text-xs font-bold">■</div>
                  <div className="w-8 h-8 bg-white rounded shadow-sm flex items-center justify-center text-primary-500 text-xs font-bold">▲</div>
                  <div className="w-8 h-8 bg-white rounded shadow-sm flex items-center justify-center text-primary-500 text-xs font-bold">●</div>
               </div>
            </div>

            {/* Tab Based DI */}
            <div className="absolute z-10 w-[220px] bg-white rounded-2xl p-3 shadow-xl border border-neutral-100 -right-4 bottom-[5%] transform rotate-[-5deg]">
               <div className="text-neutral-800 font-semibold text-[10px] mb-2">Tab Based DI</div>
               <div className="bg-blue-50/50 p-2 rounded-lg flex flex-col gap-2">
                  <div className="flex gap-1">
                     <div className="h-1 bg-primary-400 w-4 rounded"></div>
                     <div className="h-1 bg-neutral-200 w-4 rounded"></div>
                  </div>
                  <div className="flex items-end gap-1 h-10 mt-1">
                     <div className="w-3 bg-primary-400 h-[60%] rounded-t"></div>
                     <div className="w-3 bg-primary-400 h-[80%] rounded-t"></div>
                     <div className="w-3 bg-primary-400 h-[40%] rounded-t"></div>
                     <div className="w-6 h-6 rounded-full border-4 border-amber-400 border-r-primary-500 ml-auto mr-1"></div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="bg-white border-y border-neutral-100 py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
               <Gamepad2 size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 text-base">7 Interactive Games</span>
              <span className="text-sm text-neutral-500">All key aptitude types</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
               <Users size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 text-base">700+ Active Players</span>
              <span className="text-sm text-neutral-500">Practice together</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
               <LineChart size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 text-base">Track & Improve</span>
              <span className="text-sm text-neutral-500">Detailed analytics</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
               <Trophy size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 text-base">Placement Focused</span>
              <span className="text-sm text-neutral-500">Inspired by top companies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-4 text-primary-600 font-bold text-sm tracking-wider uppercase mb-4">
             <div className="w-12 h-[2px] bg-primary-200"></div>
             CHOOSE A GAME
             <div className="w-12 h-[2px] bg-primary-200"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 mb-6 tracking-tight">Aptitude Games</h2>
          <p className="text-neutral-500 max-w-2xl text-base lg:text-lg leading-relaxed">
            Practice different cognitive skills through interactive challenges and improve your speed, accuracy, and problem-solving skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          <GameCard 
            to="/games/motion"
            bgClass="bg-blue-50/50"
            title="Motion Challenge"
            desc="Slide obstacles to clear a path and guide the ball into the target hole."
            difficulty="Medium"
            category={{ label: "Spatial Reasoning", icon: <Gamepad2 size={12}/> }}
            score="10"
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
            category={{ label: "Pattern Logic", icon: <Gamepad2 size={12}/> }}
            score="9"
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
            category={{ label: "Pattern Recognition", icon: <Gamepad2 size={12}/> }}
            score="10"
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
            desc="Memorize the location of dots and reproduce them after a distraction."
            difficulty="Hard"
            category={{ label: "Memory + Spatial", icon: <Gamepad2 size={12}/> }}
            score="8"
            visual={
              <div className="grid grid-cols-6 gap-1.5">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className={cn("w-2 h-2 rounded-full", [3,8,13,16,19,22].includes(i) ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : [10,14].includes(i) ? "bg-primary-400" : "bg-neutral-800")}></div>
                ))}
              </div>
            }
          />

          <GameCard 
            to="/games/switch"
            bgClass="bg-emerald-50/50"
            title="Switch Challenge"
            desc="Follow transformation rules and determine how inputs map to outputs."
            difficulty="Hard"
            category={{ label: "Logical Mapping", icon: <Gamepad2 size={12}/> }}
            score="9"
            visual={
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full"></div>
                  <div className="w-5 h-5 bg-amber-500 clip-triangle"></div>
                  <div className="w-5 h-5 bg-primary-500 rounded-sm"></div>
                </div>
                <div className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded">SWITCH</div>
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
            category={{ label: "Data Interpretation", icon: <Gamepad2 size={12}/> }}
            score="10"
            visual={
              <div className="w-[160px] bg-white rounded-lg border border-blue-100 shadow-sm overflow-hidden flex flex-col">
                <div className="flex bg-blue-50 border-b border-blue-100 text-[6px] text-blue-500 font-bold">
                  <div className="px-2 py-1 bg-white border-r border-blue-100">Sales</div>
                  <div className="px-2 py-1 border-r border-blue-100">Regions</div>
                  <div className="px-2 py-1 border-r border-blue-100">Products</div>
                </div>
                <div className="p-2 flex gap-2">
                  <div className="flex items-end gap-1 flex-1 h-12">
                     <div className="w-full bg-primary-400 h-[40%] rounded-t"></div>
                     <div className="w-full bg-primary-400 h-[80%] rounded-t"></div>
                     <div className="w-full bg-primary-400 h-[60%] rounded-t"></div>
                  </div>
                  <div className="w-10 h-10 rounded-full border-[6px] border-emerald-400 border-r-primary-500 self-center"></div>
                </div>
              </div>
            }
          />

          <GameCard 
            to="/games/rc"
            bgClass="bg-slate-50"
            title="Tab Based RC"
            desc="Navigate between multiple document tabs, combine information and answer comprehension questions."
            difficulty="Medium"
            category={{ label: "Reading Comprehension", icon: <Gamepad2 size={12}/> }}
            score="9"
            visual={
              <div className="w-[160px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex bg-slate-50 border-b border-slate-200 text-[6px] text-slate-500 font-bold">
                  <div className="px-2 py-1 bg-white border-r border-slate-200">Document A</div>
                  <div className="px-2 py-1 border-r border-slate-200">Document B</div>
                </div>
                <div className="p-2 flex flex-col gap-1.5">
                  <div className="h-1 bg-slate-200 rounded w-full"></div>
                  <div className="h-1 bg-slate-200 rounded w-[80%]"></div>
                  <div className="h-1 bg-slate-200 rounded w-[90%] mt-1"></div>
                  <div className="h-1 bg-slate-200 rounded w-[60%]"></div>
                </div>
              </div>
            }
          />
          
        </div>
      </section>

      {/* Why Aptiverse */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-t border-neutral-100">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex items-center gap-4 text-primary-600 font-bold text-sm tracking-wider uppercase mb-4">
               <div className="w-12 h-[2px] bg-primary-200"></div>
               WHY APTIVERSE
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 mb-6 tracking-tight">More Than Just Practice.</h2>
            <p className="text-neutral-500 text-base lg:text-lg leading-relaxed">
              Build the cognitive skills that actually matter in modern hiring assessments through interactive and engaging games.
            </p>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-2 gap-8 lg:gap-12 mt-4 lg:mt-0">
            <div className="flex flex-col">
               <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-5">
                 <Zap className="text-amber-500" size={32} />
               </div>
               <h4 className="font-bold text-neutral-900 mb-2 text-xl">Think Faster</h4>
               <p className="text-sm lg:text-base text-neutral-500 leading-relaxed">Improve decision speed under time pressure with reflex-driven mechanics.</p>
            </div>
            <div className="flex flex-col">
               <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                 <Target className="text-red-500" size={32} />
               </div>
               <h4 className="font-bold text-neutral-900 mb-2 text-xl">Be More Accurate</h4>
               <p className="text-sm lg:text-base text-neutral-500 leading-relaxed">Train for higher accuracy by focusing on realistic, complex logic challenges.</p>
            </div>
            <div className="flex flex-col">
               <div className="w-14 h-14 rounded-2xl bg-accent-50 flex items-center justify-center mb-5">
                 <Brain className="text-accent-500" size={32} />
               </div>
               <h4 className="font-bold text-neutral-900 mb-2 text-xl">Sharpen Logic</h4>
               <p className="text-sm lg:text-base text-neutral-500 leading-relaxed">Strengthen logical and analytical thinking with multi-stage puzzles.</p>
            </div>
            <div className="flex flex-col">
               <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                 <LineChart className="text-blue-500" size={32} />
               </div>
               <h4 className="font-bold text-neutral-900 mb-2 text-xl">Get Placement Ready</h4>
               <p className="text-sm lg:text-base text-neutral-500 leading-relaxed">Practice with patterns directly inspired by real company-style assessments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 w-full max-w-[1316px] mx-auto px-6 lg:px-8">
        <div className="bg-[#121629] rounded-[2rem] p-10 lg:px-16 lg:py-14 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-2xl w-full">
          
          {/* Complex Background Glows */}
          <div className="absolute -bottom-20 left-[10%] w-[350px] h-[350px] bg-primary-600/30 rounded-full blur-[90px] pointer-events-none"></div>
          <div className="absolute -top-20 right-[10%] w-[250px] h-[250px] bg-accent-600/20 rounded-full blur-[70px] pointer-events-none"></div>
          
          <div className="relative z-10 w-full md:w-[55%] flex flex-col items-start">
            <div className="flex items-center gap-3 text-primary-300 font-bold text-[10px] tracking-widest uppercase mb-5">
               <svg width="26" height="12" viewBox="0 0 24 12" fill="none" className="text-primary-400 shrink-0">
                  <path d="M6 1 L1 6 L6 11 M1 6 L24 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
               YOUR NEXT OPPORTUNITY
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[48px] font-extrabold text-white mb-5 leading-[1.1] tracking-tight">
              Ready to test your limits?
            </h2>
            
            <p className="text-base lg:text-lg text-neutral-300 mb-8 leading-relaxed max-w-md">
              Join hundreds of candidates practicing daily for their upcoming placement assessments. Don't wait until the interview.
            </p>
            
            <Link to="/games">
               <Button className="px-7 py-3.5 h-auto text-base font-bold rounded-xl bg-white text-[#121629] hover:bg-neutral-100 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all flex items-center gap-3">
                 Start Your First Challenge <ArrowRight size={18} />
               </Button>
            </Link>
          </div>
          
          <div className="relative z-10 mt-12 md:mt-0 w-full md:w-[45%] flex justify-center md:justify-end h-[260px]">
             
             {/* Stacked Company Cards */}
             <div className="relative w-[320px] h-full flex flex-col items-center">
                {/* Capgemini (Top) */}
                <div className="absolute top-0 z-10 bg-gradient-to-br from-[#1e2746] to-[#161d36] border border-white/5 w-[230px] h-[72px] rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.4)] transform hover:-translate-y-2 transition-transform duration-300">
                   <span className="text-white font-bold text-xl flex items-center gap-2">Capgemini <span className="text-white/80">♠</span></span>
                </div>
                
                {/* Cognizant (Middle) */}
                <div className="absolute top-[60px] z-20 bg-gradient-to-br from-[#232d52] to-[#1a2240] border border-white/5 w-[270px] h-[78px] rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 transition-transform duration-300">
                   <span className="text-white font-bold text-[22px] flex items-center gap-2">
                     <div className="w-5 h-5 bg-blue-500 rounded-sm clip-triangle -rotate-90 relative top-0.5"></div> Cognizant
                   </span>
                </div>
                
                {/* TCS (Bottom) */}
                <div className="absolute top-[128px] z-30 bg-gradient-to-br from-[#293562] to-[#1e2749] border border-white/5 w-[310px] h-[90px] rounded-2xl flex flex-col items-center justify-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] transform hover:-translate-y-2 transition-transform duration-300">
                   <span className="text-white font-bold text-3xl tracking-widest leading-none mb-1">tcs</span>
                   <span className="text-[7.5px] text-primary-200 uppercase tracking-widest font-medium">Tata Consultancy Services</span>
                </div>
             </div>

             {/* Hand drawn arrow */}
             <div className="absolute top-0 right-2 text-primary-300 font-caveat text-sm flex flex-col items-end opacity-90 w-36">
                <span>Practice with</span>
                <span>real-world patterns</span>
                <svg width="32" height="32" viewBox="0 0 100 100" fill="none" className="mt-1 transform rotate-90">
                   <path d="M10,90 Q50,10 90,50" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                   <polygon points="90,50 80,45 85,55" fill="currentColor"/>
                </svg>
             </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold">
            <Star size={13} className="fill-indigo-500" />
            Share Your Experience
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            How are we doing?<br />
            <span className="text-indigo-600">Your feedback shapes AptiVerse.</span>
          </h2>
          <p className="text-base text-slate-500 max-w-lg leading-relaxed">
            Every rating, every suggestion, every bug report helps us build a better platform for you and thousands of students preparing for placements.
          </p>

          {/* Decorative star row */}
          <div className="flex items-center gap-1.5 my-2">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={32} className="text-amber-400 fill-amber-400 drop-shadow-sm" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:-translate-y-0.5 hover:shadow-indigo-600/40 transition-all active:scale-[0.98]"
            >
              <MessageSquare size={18} />
              Give Feedback & Rate Us
            </button>
            <Link
              to="/leaderboard"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-all"
            >
              <Trophy size={17} className="text-amber-500" />
              View Leaderboard
            </Link>
          </div>

          {/* Testimonial mini-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full">
            {[
              { quote: "Helped me crack my TCS interview! The games make practice so much more engaging.", name: "Priya S.", stars: 5 },
              { quote: "The leaderboard keeps me motivated. Love the variety of aptitude games!", name: "Rahul M.", stars: 5 },
              { quote: "Finally a platform that makes aptitude prep fun. Highly recommended!", name: "Anjali K.", stars: 4 },
            ].map((t, i) => (
              <div key={i} className="bg-white border border-indigo-50 rounded-2xl p-5 text-left shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} size={13} className="fill-amber-400 text-amber-400" />)}
                  {[...Array(5 - t.stars)].map((_, j) => <Star key={j} size={13} className="text-slate-200" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic">"{t.quote}"</p>
                <span className="text-xs font-bold text-slate-400">— {t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
};

export default Home;
