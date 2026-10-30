import React, { useState } from 'react';
import { 
  Building2, BookOpen, Award, Sparkles, Video, Clock, CheckCircle2, 
  MapPin, GraduationCap, ChevronRight, AlertCircle, FileText, ChevronDown, 
  Search, ShieldCheck, ArrowRight, UserCheck, Play, Lock, LogIn, Target, Zap 
} from 'lucide-react';
import { 
  INFOSYS_COMPANY_OVERVIEW, 
  INFOSYS_SECTIONS_CONFIG, 
  INFOSYS_SYLLABUS, 
  TECHNICAL_INTERVIEW_PROMPTS, 
  HR_INTERVIEW_PROMPTS,
  type InterviewPrompt 
} from '../../data/infosysPrepData';
import { ALL_INFOSYS_MOCK_TESTS, type MockTestBundle } from '../../data/infosysMockTests';
import { useAuth } from '../../context/AuthContext';
import { InteractiveMockTest } from '../../components/company/InteractiveMockTest';
import { AIMockInterviewRoom } from '../../components/company/AIMockInterviewRoom';
import { AdBanner } from '../../components/ui/AdBanner';
import infosysLogo from '../../assets/infosys-logo.jpg';
import gecMysoreImg from '../../assets/gec-mysore.jpg';

export const InfosysPrep: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [selectedMockBundle, setSelectedMockBundle] = useState<MockTestBundle | null>(null);

  // Primary view: 'timeline-test' (the mock test & hiring timeline), 'guide' (the blog/syllabus), or 'qbank'
  const [activeTab, setActiveTab] = useState<'timeline-test' | 'guide' | 'qbank'>('timeline-test');
  
  // Hiring Journey Timeline Step (1: Round 1 Online Test, 2: Round 2 Tech Interview, 3: Round 3 HR Interview)
  const [activeRoundStep, setActiveRoundStep] = useState<1 | 2 | 3>(1);

  // Guide search & accordion
  const [syllabusSearch, setSyllabusSearch] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(INFOSYS_SYLLABUS[0].section);
  const [selectedInterviewCategory, setSelectedInterviewCategory] = useState<string>('All');

  const allInterviewQuestions: InterviewPrompt[] = [
    ...TECHNICAL_INTERVIEW_PROMPTS,
    ...HR_INTERVIEW_PROMPTS
  ];

  const filteredInterviewQuestions = selectedInterviewCategory === 'All'
    ? allInterviewQuestions
    : allInterviewQuestions.filter(q => q.category === selectedInterviewCategory);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-8 pb-12 px-6 border-b border-slate-800 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl -z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={12} />
            <a href="/games" className="hover:text-white transition-colors">Aptitude Games</a>
            <ChevronRight size={12} />
            <span className="text-primary-400 font-semibold">Infosys Systems Engineer Placement Drive</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white p-1 overflow-hidden shrink-0 shadow-md flex items-center justify-center">
                  <img src={infosysLogo} alt="Infosys" className="w-full h-full object-contain" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30 flex items-center gap-1.5">
                  <Building2 size={13} /> Infosys Limited (On & Off Campus 2025–2026)
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Systems Engineer Trainee • INR 3.6 LPA
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Infosys Placement Drive <span className="text-primary-400 block sm:inline">Mock Tests & AI Interview</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Experience the authentic recruitment simulation: full-length timed screening (<strong>54 Questions • 100 Minutes</strong>) across 5 sections with strict cutoffs, followed by live camera AI Technical and HR interview panels.
              </p>

              {/* Quick Info Badges */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300">
                  <Clock size={13} className="text-primary-400" />
                  <span>5 Timed Sections</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>Section-Wise Cutoffs</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300">
                  <Video size={13} className="text-blue-400" />
                  <span>AI Recruiter Panel</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300">
                  <CheckCircle2 size={13} className="text-teal-400" />
                  <span>No Negative Marking</span>
                </div>
              </div>
            </div>

            {/* Right: Training Center Showcase Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/70 backdrop-blur-md rounded-3xl border border-slate-700/80 p-4 shadow-2xl hover:border-slate-600 transition-all duration-300">
                {/* Mysore Campus Image */}
                <div className="relative rounded-2xl overflow-hidden h-44 sm:h-48 w-full group">
                  <img 
                    src={gecMysoreImg} 
                    alt="Infosys Global Education Center (GEC) Mysuru" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/20 flex items-center gap-1.5">
                    <MapPin size={11} className="text-rose-400" />
                    <span>Mysuru, Karnataka</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[10px] font-black uppercase tracking-wider text-primary-300 mb-0.5">
                      Your Training Destination
                    </div>
                    <div className="text-sm font-extrabold line-clamp-1">
                      Infosys Global Education Center (GEC)
                    </div>
                  </div>
                </div>

                {/* Training Details Below Image */}
                <div className="pt-3 px-1 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <GraduationCap size={14} className="text-primary-400" />
                      Foundation Training Program
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      19 – 23 Weeks
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    World's largest corporate training university spread across 337 acres. Selected candidates undergo paid, residential world-class engineering and soft-skills training here.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Top Navigation Bar: Drive Flow vs Guide vs Question Bank */}
      <div className="sticky top-0 z-30 bg-white border-b border-neutral-200/90 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-2.5">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('timeline-test')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'timeline-test'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Play size={14} className="fill-current" /> Complete Recruitment Drive & Mock Test
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'guide'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <BookOpen size={14} /> Recruitment Guide & Syllabus Blog
            </button>

            <button
              onClick={() => setActiveTab('qbank')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'qbank'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <FileText size={14} /> Interview Question Bank ({allInterviewQuestions.length})
            </button>
          </div>

        </div>
      </div>

      {/* MAIN VIEW */}
      <div className="max-w-7xl mx-auto px-6 pt-6 w-full">
        
        {/* =======================================================
            TAB 1: COMPLETE RECRUITMENT DRIVES & PIPELINES
           ======================================================= */}
        {activeTab === 'timeline-test' && (
          <div className="space-y-8 animate-fadeIn">

            {/* If NO mock bundle is selected: Show the 4 Designer Cards */}
            {!selectedMockBundle ? (
              <div className="space-y-8">
                {/* Section Introduction */}
                <div className="text-center max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200/60 shadow-sm">
                    <Target size={14} className="text-blue-600" />
                    COMPLETE INFOSYS HIRING BLUEPRINTS
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Choose Your Targeted Mock Recruitment Drive
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mt-2">
                    Each pack is a complete, multi-round recruitment simulation: starting with the <strong>timed Online Aptitude Screening</strong>, flowing directly into the <strong>AI Technical Interview</strong>, and culminating in the <strong>HR & Managerial Discussion</strong> with specific questions from official fresher test blueprints.
                  </p>
                </div>

                {/* 4 Cards Grid - Styled in AptiVerse Theme */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ALL_INFOSYS_MOCK_TESTS.map((bundle) => {
                    let savedScore: any = null;
                    if (user) {
                      try {
                        const raw = localStorage.getItem(`aptiverse_infosys_score_${user.id}_${bundle.id}`);
                        if (raw) savedScore = JSON.parse(raw);
                      } catch (e) {}
                    }

                    // Card styling config per difficulty tag
                    const badgeConfig = {
                      'Official Sample': {
                        pillBg: 'bg-blue-50 text-blue-700 border-blue-200/80',
                        dotBg: 'bg-blue-500',
                        label: 'Sample Pattern',
                        borderHover: 'hover:border-blue-400',
                        btnBg: 'bg-blue-600 hover:bg-blue-700',
                      },
                      'Easy': {
                        pillBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
                        dotBg: 'bg-emerald-500',
                        label: 'Easy Difficulty',
                        borderHover: 'hover:border-emerald-400',
                        btnBg: 'bg-emerald-600 hover:bg-emerald-700',
                      },
                      'Moderate': {
                        pillBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
                        dotBg: 'bg-amber-500',
                        label: 'Moderate Difficulty',
                        borderHover: 'hover:border-amber-400',
                        btnBg: 'bg-amber-600 hover:bg-amber-700',
                      },
                      'Hard': {
                        pillBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
                        dotBg: 'bg-purple-500',
                        label: 'Hard Difficulty',
                        borderHover: 'hover:border-purple-400',
                        btnBg: 'bg-purple-600 hover:bg-purple-700',
                      },
                    }[bundle.tag] || {
                      pillBg: 'bg-slate-50 text-slate-700 border-slate-200',
                      dotBg: 'bg-slate-500',
                      label: bundle.tag,
                      borderHover: 'hover:border-slate-400',
                      btnBg: 'bg-primary-600 hover:bg-primary-700',
                    };

                    return (
                      <div 
                        key={bundle.id}
                        className={`bg-white rounded-2xl border border-neutral-200/90 ${badgeConfig.borderHover} shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group hover:-translate-y-1`}
                      >
                        <div>
                          {/* Top Header Pill Row */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 ${badgeConfig.pillBg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dotBg}`}></span>
                              {badgeConfig.label}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              MOCK 0{bundle.testNumber}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <h3 className="text-base font-extrabold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {bundle.title}
                          </h3>
                          <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                            {bundle.subtitle}
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed mt-2 mb-4 line-clamp-2">
                            {bundle.description}
                          </p>

                          {/* Stats Strip */}
                          <div className="flex items-center justify-between text-xs font-semibold text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 mb-4">
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} className="text-primary-600" />
                              {bundle.totalTimeMinutes} Mins
                            </span>
                            <span className="text-neutral-300">•</span>
                            <span className="flex items-center gap-1.5">
                              <FileText size={13} className="text-primary-600" />
                              {bundle.totalQuestions} Questions
                            </span>
                            <span className="text-neutral-300">•</span>
                            <span className="text-emerald-600 font-bold">
                              3 Rounds
                            </span>
                          </div>

                          {/* 3-Stage Pipeline Breakdown */}
                          <div className="space-y-2 mb-5 pt-3 border-t border-neutral-100">
                            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                              <span>Hiring Journey Stages</span>
                              <span className="text-primary-600 font-medium">Standard Flow</span>
                            </div>

                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50/70 border border-neutral-100">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                                  <span className="font-semibold text-neutral-800">Round 1: Online Aptitude</span>
                                </div>
                                <span className="text-[11px] text-neutral-500 font-mono">54 Qs</span>
                              </div>

                              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50/70 border border-neutral-100">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                                  <span className="font-semibold text-neutral-800">Round 2: Technical Panel</span>
                                </div>
                                <span className="text-[11px] text-indigo-600 font-bold font-mono">{bundle.technicalPrompts.length} Qs</span>
                              </div>

                              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50/70 border border-neutral-100">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                                  <span className="font-semibold text-neutral-800">Round 3: HR & Behavioral</span>
                                </div>
                                <span className="text-[11px] text-emerald-600 font-bold font-mono">{bundle.hrPrompts.length} Qs</span>
                              </div>
                            </div>
                          </div>

                          {/* Best Score Badge if candidate attempted before */}
                          {savedScore && (
                            <div className="mb-4 p-2.5 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between">
                              <div>
                                <span className="text-slate-400 text-[10px] block">Your Best Score</span>
                                <span className="font-bold text-emerald-400">{savedScore.score} / {savedScore.total_questions}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                savedScore.cleared ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}>
                                {savedScore.cleared ? 'Cleared Cutoff' : 'Recorded'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action CTA Button */}
                        <div>
                          <button
                            onClick={() => {
                              if (!user) {
                                setShowSignInModal(true);
                                return;
                              }
                              setSelectedMockBundle(bundle);
                              setActiveRoundStep(1);
                            }}
                            className={`w-full py-3 ${badgeConfig.btnBg} text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]`}
                          >
                            <Play size={13} className="fill-white" />
                            Start Mock Drive 0{bundle.testNumber}
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* DEDICATED RECRUITMENT PIPELINE FOR THE SELECTED MOCK TEST */
              <div className="space-y-6">
                
                {/* Active Drive Navigation Header */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedMockBundle(null)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ChevronRight size={14} className="rotate-180" /> Back to All 4 Drives
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-lg text-slate-900">
                          {selectedMockBundle.title}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${selectedMockBundle.cardBannerColor}`}>
                          {selectedMockBundle.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedMockBundle.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>Infosys has section-wise cutoffs, so prepare well for all sections.</span>
                  </div>
                </div>

                {/* 3-Stage Pipeline Stepper for THIS specific test */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Round 1 Stepper */}
                  <button
                    onClick={() => setActiveRoundStep(1)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                      activeRoundStep === 1
                        ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${
                        activeRoundStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        1
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Elimination Stage
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                      Round 1: Online Screening Test
                    </h3>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>• <strong>{selectedMockBundle.totalQuestions} Questions • {selectedMockBundle.totalTimeMinutes} Minutes</strong></div>
                      <div>• 5 Sections with individual countdown timers</div>
                      <div>• Section-wise evaluation applies</div>
                    </div>
                    {activeRoundStep === 1 && (
                      <div className="mt-3 pt-2 border-t border-blue-200 text-xs font-bold text-blue-700 flex items-center gap-1">
                        <span>Currently Active Round</span> <ArrowRight size={13} />
                      </div>
                    )}
                  </button>

                  {/* Round 2 Stepper */}
                  <button
                    onClick={() => setActiveRoundStep(2)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                      activeRoundStep === 2
                        ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${
                        activeRoundStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        2
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
                        <Video size={10} /> AI Video Panel
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                      Round 2: Technical Interview
                    </h3>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>• <strong>{selectedMockBundle.technicalPrompts.length} Specific Technical Prompts</strong></div>
                      <div>• Spoken aloud by Priya Sharma in fluent recruiter voice</div>
                      <div>• DSA, Architecture, Databases & Core Concepts</div>
                    </div>
                    {activeRoundStep === 2 && (
                      <div className="mt-3 pt-2 border-t border-blue-200 text-xs font-bold text-blue-700 flex items-center gap-1">
                        <span>Currently Active Round</span> <ArrowRight size={13} />
                      </div>
                    )}
                  </button>

                  {/* Round 3 Stepper */}
                  <button
                    onClick={() => setActiveRoundStep(3)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                      activeRoundStep === 3
                        ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center ${
                        activeRoundStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        3
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Final Selection
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900 mb-1">
                      Round 3: HR & Managerial
                    </h3>
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>• <strong>{selectedMockBundle.hrPrompts.length} Behavioral & Culture Scenarios</strong></div>
                      <div>• Adaptability, Teamwork, Relocation & Mindset</div>
                      <div>• Evaluated with ideal answering rubrics</div>
                    </div>
                    {activeRoundStep === 3 && (
                      <div className="mt-3 pt-2 border-t border-blue-200 text-xs font-bold text-blue-700 flex items-center gap-1">
                        <span>Currently Active Round</span> <ArrowRight size={13} />
                      </div>
                    )}
                  </button>
                </div>

                {/* ACTIVE ROUND INTERFACE FOR THIS TEST */}
                <div className="transition-all">
                  {activeRoundStep === 1 && (
                    <InteractiveMockTest 
                      bundle={selectedMockBundle}
                      onProceedToTechnicalInterview={() => setActiveRoundStep(2)}
                      onBackToMockList={() => setSelectedMockBundle(null)}
                    />
                  )}

                  {activeRoundStep === 2 && (
                    <AIMockInterviewRoom 
                      initialRound="technical"
                      technicalQuestions={selectedMockBundle.technicalPrompts}
                      hrQuestions={selectedMockBundle.hrPrompts}
                      driveTitle={selectedMockBundle.title}
                      onProceedToHR={() => setActiveRoundStep(3)}
                      onClose={() => setSelectedMockBundle(null)}
                    />
                  )}

                  {activeRoundStep === 3 && (
                    <AIMockInterviewRoom 
                      initialRound="hr"
                      technicalQuestions={selectedMockBundle.technicalPrompts}
                      hrQuestions={selectedMockBundle.hrPrompts}
                      driveTitle={selectedMockBundle.title}
                      onClose={() => setSelectedMockBundle(null)}
                    />
                  )}
                </div>

              </div>
            )}

          </div>
        )}

        {/* =======================================================
            TAB 2: RECRUITMENT GUIDE & SYLLABUS BLOG
           ======================================================= */}
        {activeTab === 'guide' && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* Overview */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Building2 size={16} /> Company & Role Overview
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-900 mb-4">
                Infosys Systems Engineer Recruitment Blueprint
              </h2>
              
              <div className="prose prose-slate max-w-none text-neutral-600 text-sm leading-relaxed space-y-4">
                <p>
                  <strong>Infosys Limited</strong> is one of India's largest multinational technology consulting firms. Fresh engineering graduates (B.Tech, B.E., M.Tech) and MCA candidates join as <strong>Systems Engineer (Trainee)</strong> at a reference compensation of <strong>INR 3.6 LPA</strong>.
                </p>
                <p>
                  The recruitment process is known for rigorous sectional filtering in Round 1: candidate performance is measured independently in each section, and failure to meet the cutoff in any one section results in elimination regardless of performance in other sections.
                </p>
              </div>

              {/* Training at GEC Mysuru */}
              <div className="mt-6 p-5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <div className="font-bold text-sm text-blue-950 mb-1 flex items-center gap-1.5">
                  <GraduationCap size={16} className="text-blue-600" />
                  Foundation Program at GEC Mysuru (19 to 23 Weeks)
                </div>
                {INFOSYS_COMPANY_OVERVIEW.trainingInfo} Selected freshers receive specialized instruction in enterprise full-stack software development, cloud infrastructure, automated testing, and agile workflows.
              </div>
            </div>

            {/* Assessment Blueprint Comparison */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
              <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-2">
                <FileText size={16} /> Format A Official Blueprint
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">
                Round 1 Sectional Breakdown & Exam Structure
              </h2>
              <p className="text-xs text-neutral-500 mb-4">
                Infosys has section-wise cutoffs, so prepare well for all sections.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                      <th className="p-3.5">Section Name</th>
                      <th className="p-3.5">Questions</th>
                      <th className="p-3.5">Time Allotted</th>
                      <th className="p-3.5">Section Evaluation</th>
                      <th className="p-3.5">Negative Marking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {INFOSYS_SECTIONS_CONFIG.map(sec => (
                      <tr key={sec.id} className="hover:bg-neutral-50">
                        <td className="p-3.5 font-bold text-neutral-900">{sec.name}</td>
                        <td className="p-3.5 font-mono">{sec.questionCount} Qs</td>
                        <td className="p-3.5 font-mono">{sec.timeMinutes} mins</td>
                        <td className="p-3.5 text-primary-700 font-medium">Individual Sectional Cutoff Applies</td>
                        <td className="p-3.5 text-neutral-500">None (0)</td>
                      </tr>
                    ))}
                    <tr className="bg-neutral-50 font-extrabold text-neutral-900">
                      <td className="p-3.5">Total</td>
                      <td className="p-3.5 font-mono">54 Questions</td>
                      <td className="p-3.5 font-mono">100 Minutes</td>
                      <td className="p-3.5 text-emerald-700">Must Clear All 5 Sections</td>
                      <td className="p-3.5 text-neutral-500">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Searchable Topic Syllabus */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
                    <BookOpen size={16} /> Complete Syllabus
                  </div>
                  <h2 className="text-2xl font-extrabold text-neutral-900">
                    Syllabus Topics Covered in AptiVerse
                  </h2>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    value={syllabusSearch}
                    onChange={(e) => setSyllabusSearch(e.target.value)}
                    placeholder="Search topics (e.g. Loops, Seating)..."
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {INFOSYS_SYLLABUS.map((sec: any) => {
                  const isExpanded = expandedSection === sec.section;
                  const filteredTopics = sec.topics.filter((t: string) => 
                    t.toLowerCase().includes(syllabusSearch.toLowerCase())
                  );

                  if (syllabusSearch && filteredTopics.length === 0) return null;

                  return (
                    <div key={sec.section} className="border border-neutral-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : sec.section)}
                        className="w-full p-4 bg-neutral-50/70 hover:bg-neutral-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs">
                            {sec.section.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-neutral-900">{sec.section}</span>
                            <span className="text-xs text-neutral-500 ml-2">({sec.topics.length} key concepts)</span>
                          </div>
                        </div>

                        <ChevronDown size={18} className={`text-neutral-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="p-5 bg-white border-t border-neutral-200 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {filteredTopics.map((topic: string, tIdx: number) => (
                            <div key={tIdx} className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-700">
                              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base">Ready to test these topics in the official 54-question format?</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Experience exact section timers and strict cutoff evaluations.</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('timeline-test');
                    setActiveRoundStep(1);
                  }}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 font-bold text-xs rounded-xl shadow transition-all active:scale-95 shrink-0"
                >
                  Start Round 1 Assessment
                </button>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-500 text-center">
              {INFOSYS_COMPANY_OVERVIEW.disclaimer}
            </div>

          </div>
        )}

        {/* =======================================================
            TAB 3: INTERVIEW QUESTION BANK EXPLORER
           ======================================================= */}
        {activeTab === 'qbank' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
                    <FileText size={16} /> Technical & HR Interview Database
                  </div>
                  <h2 className="text-2xl font-extrabold text-neutral-900">
                    Candidate-Reported Infosys Interview Prompts
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Authentic prompts asked in recent Systems Engineer campus and off-campus drives.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('timeline-test');
                    setActiveRoundStep(2);
                  }}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shrink-0"
                >
                  <Video size={14} /> Practice in AI Video Room
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 text-xs">
                {['All', 'Java & OOP', 'DBMS & SQL', 'Operating Systems & Networks', 'DSA & Problem Solving', 'Projects & Resume', 'HR & Behavioral'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedInterviewCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl font-semibold transition-colors whitespace-nowrap ${
                      selectedInterviewCategory === cat
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {filteredInterviewQuestions.map((q, idx) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900">#{idx + 1}</span>
                        <span className="text-[11px] font-semibold bg-primary-100 text-primary-800 px-2 py-0.5 rounded">
                          {q.category}
                        </span>
                        <span className="text-[11px] font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          {q.tag}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 font-medium">{q.round}</span>
                    </div>

                    <h4 className="text-base font-bold text-neutral-900 mb-3">
                      "{q.question}"
                    </h4>

                    <div className="bg-white p-4 rounded-xl border border-neutral-200 text-xs">
                      <div className="font-bold text-primary-700 mb-1.5">What Interviewers Expect:</div>
                      <ul className="list-disc list-inside space-y-1 text-neutral-600">
                        {q.expectedPoints.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                      <div className="mt-2.5 pt-2 border-t border-neutral-100 text-neutral-500 italic text-[11px]">
                        💡 Answering Strategy: {q.sampleAnswerGuide}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Ad Placement */}
      <div className="max-w-7xl mx-auto px-6 mt-12 w-full">
        <AdBanner dataAdSlot="auto" />
      </div>

      {/* Student Sign-In Compulsory Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md text-center shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-blue-500/30">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Student Sign-In Required</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Sign in with your student account to attempt the Infosys Mock Test and track your sectional cutoffs.
            </p>
            <button
              onClick={async () => {
                await signInWithGoogle();
              }}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all mb-3 active:scale-98"
            >
              <LogIn size={18} /> Sign In with Google
            </button>
            <button
              onClick={() => setShowSignInModal(false)}
              className="text-xs text-slate-400 hover:text-white transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default InfosysPrep;
