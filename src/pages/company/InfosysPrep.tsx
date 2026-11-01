import React, { useState } from 'react';
import { 
  Building2, BookOpen, Video, Clock, CheckCircle2, 
  MapPin, GraduationCap, ChevronRight, FileText, ChevronDown, 
  Search, ShieldCheck, ArrowRight, UserCheck, Play, Lock, LogIn, Target,
  Code2, Trophy, Flame, Sparkles
} from 'lucide-react';
import { 
  TECHNICAL_INTERVIEW_PROMPTS, 
  HR_INTERVIEW_PROMPTS,
  type InterviewPrompt 
} from '../../data/infosysPrepData';
import { ALL_INFOSYS_MOCK_TESTS, type MockTestBundle } from '../../data/infosysMockTests';
import { useAuth } from '../../context/AuthContext';
import { InteractiveMockTest } from '../../components/company/InteractiveMockTest';
import { AIMockInterviewRoom } from '../../components/company/AIMockInterviewRoom';
import { InfosysGuideBlog } from '../../components/company/InfosysGuideBlog';
import { AdBanner } from '../../components/ui/AdBanner';
import { DailyChallengeModal } from '../../components/daily/DailyChallengeModal';
import { SEOHead } from '../../components/seo/SEOHead';
import infosysLogo from '../../assets/infosys-logo.jpg';
import gecMysoreImg from '../../assets/gec-mysore.jpg';

export const InfosysPrep: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [selectedMockBundle, setSelectedMockBundle] = useState<MockTestBundle | null>(null);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);

  // Primary view: 'guide' (Recruitment Guide Blog first!), 'timeline-test' (Mock Tests), or 'qbank'
  const [activeTab, setActiveTab] = useState<'guide' | 'timeline-test' | 'qbank'>('guide');
  
  // Hiring Journey Timeline Step (1: Round 1 Online Test, 2: Round 2 Tech Interview, 3: Round 3 HR Interview)
  const [activeRoundStep, setActiveRoundStep] = useState<1 | 2 | 3>(1);

  const [selectedInterviewCategory, setSelectedInterviewCategory] = useState<string>('All');

  const allInterviewQuestions: InterviewPrompt[] = [
    ...TECHNICAL_INTERVIEW_PROMPTS,
    ...HR_INTERVIEW_PROMPTS
  ];

  const filteredInterviewQuestions = selectedInterviewCategory === 'All'
    ? allInterviewQuestions
    : allInterviewQuestions.filter(q => q.category === selectedInterviewCategory);

  const infosysSEOSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "name": "Infosys Mock Interview, Practice Tests & PYQ Placement Track",
        "description": "Comprehensive Infosys Systems Engineer online preparation track. Includes 54-question full-length timed mock tests, previous year questions (PYQs), and real-time AI mock interview simulation.",
        "provider": {
          "@type": "Organization",
          "name": "AptiVerse",
          "sameAs": "https://www.aptiverse.in"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.aptiverse.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Practice",
            "item": "https://www.aptiverse.in/games"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Infosys Mock Interview & PYQ Practice Test",
            "item": "https://www.aptiverse.in/company/infosys"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Does the Infosys Online Assessment have negative marking?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Infosys does not deduct marks for incorrect answers. Since there is zero negative marking, candidates should never leave any question unattempted before the section timer expires."
            }
          },
          {
            "@type": "Question",
            "name": "What is the pattern of the Infosys Practice Test and Round 1 Online Test?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The test has 54 questions across 5 sections to be completed in 100 minutes: Reasoning Ability (15 Qs, 25 min), Technical Mathematical Ability (10 Qs, 35 min), Verbal Ability (20 Qs, 20 min), Pseudocode (5 Qs, 10 min), and Numerical Puzzle Solving (4 Qs, 10 min)."
            }
          },
          {
            "@type": "Question",
            "name": "How does the Infosys AI Mock Interview work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The AI mock interview simulates an authentic Infosys Technical and HR interview panel. It asks real Infosys interview questions using natural speech synthesis, captures your responses via camera and microphone, and evaluates your answers against what Infosys interviewers look for."
            }
          },
          {
            "@type": "Question",
            "name": "Where can I find authentic Infosys PYQs (Previous Year Questions)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AptiVerse provides full-length Infosys mock tests curated from actual previous year recruitment patterns, covering reasoning puzzles, cryptarithmetic, pseudocode debugging, and quantitative aptitude."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-24">
      <SEOHead
        title="Infosys Mock Interview, Practice Tests & PYQ Placement Prep | AptiVerse"
        description="Ace your Infosys Systems Engineer recruitment with free online practice tests (54 Qs • 100 Min), authentic Infosys PYQs with solutions, and real-time AI mock interview simulation."
        keywords="infosys mock interview, infosys pyq, infosys practice test, infosys previous year questions, infosys placement papers 2026, infosys systems engineer test, infosys reasoning pyq, infosys mathematical ability pyq, infosys pseudocode test, infosys verbal ability pyq, infosys ai mock interview, infosys placement drive"
        canonicalUrl="https://www.aptiverse.in/company/infosys"
        schema={infosysSEOSchema}
      />
      
      {/* Recruitment Guide & Prep Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-primary-700 text-white px-4 py-2 text-xs text-center font-medium shadow-sm flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded bg-white/20 text-white font-bold uppercase text-[10px] tracking-wider">
          Placement Track
        </span>
        <span>
          Complete recruitment blueprint: Start with the <strong>Syllabus & Pattern Guide</strong>, then take the <strong>Full Mock Test</strong>.
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-8 pb-12 px-6 border-b border-slate-800 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl -z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={12} />
            <a href="/games" className="hover:text-white transition-colors">Practice</a>
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
                Infosys Mock Interview, <span className="text-primary-400 block sm:inline">PYQs & Practice Tests</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Experience authentic recruitment screening: full-length <strong>Infosys practice tests (54 Questions • 100 Minutes)</strong> curated from actual <strong>Infosys PYQs</strong> with sectional cutoffs, followed by live camera <strong>AI Technical &amp; HR mock interview</strong> simulations.
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

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveTab('guide');
                    const el = document.getElementById('company-tab-nav');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'guide'
                      ? 'bg-white text-slate-900 shadow-md scale-102'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <BookOpen size={14} className="text-primary-500" />
                  <span>1. Read Recruitment Guide</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('timeline-test');
                    const el = document.getElementById('company-tab-nav');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'timeline-test'
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                      : 'bg-primary-600/90 text-white hover:bg-primary-600 shadow-sm'
                  }`}
                >
                  <Play size={14} className="fill-white" />
                  <span>2. Take Mock Test & AI Interview</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Right: Training Center Showcase Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/70 backdrop-blur-md rounded-3xl border border-slate-700/80 p-4 shadow-2xl hover:border-slate-600 transition-all duration-300">
                {/* Mysore Campus Image - Increased height by 25-30% */}
                <div className="relative rounded-2xl overflow-hidden h-60 sm:h-64 lg:h-72 w-full group shadow-inner">
                  <img 
                    src={gecMysoreImg} 
                    alt="Infosys Global Education Center (GEC) Mysuru" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 flex items-center gap-1.5 shadow-md">
                    <MapPin size={12} className="text-rose-400" />
                    <span>Mysuru, Karnataka</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-[10px] font-black uppercase tracking-wider text-primary-300 mb-0.5">
                      Your Training Destination
                    </div>
                    <div className="text-base font-extrabold line-clamp-1">
                      Infosys Global Education Center (GEC)
                    </div>
                  </div>
                </div>

                {/* Training Details Below Image */}
                <div className="pt-3.5 px-1 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-200">
                      <GraduationCap size={15} className="text-primary-400" />
                      Foundation Training Program
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
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

      {/* Top Navigation Bar: Guide First, then Mock Test, then Question Bank */}
      <div id="company-tab-nav" className="sticky top-0 z-30 bg-white border-b border-neutral-200/90 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-2.5">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <BookOpen size={14} /> 1. Syllabus & Recruitment Guide
            </button>

            <button
              onClick={() => setActiveTab('timeline-test')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'timeline-test'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Play size={14} className="fill-current" /> 2. Infosys Practice Test & AI Mock Interview
            </button>

            <button
              onClick={() => setActiveTab('qbank')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'qbank'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <FileText size={14} /> 3. Infosys Interview PYQs ({allInterviewQuestions.length})
            </button>
          </div>

          <button
            onClick={() => setIsDailyChallengeOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-2"
          >
            <Flame size={14} className="fill-white" />
            <span className="hidden sm:inline">Today's</span> Daily Challenge
          </button>

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

                {/* 4 Cards Grid - Styled referencing Image 1 & Image 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {ALL_INFOSYS_MOCK_TESTS.map((bundle) => {
                    let savedScore: any = null;
                    try {
                      const userKey = user ? user.id : 'guest';
                      const raw = localStorage.getItem(`aptiverse_infosys_score_${userKey}_${bundle.id}`) ||
                                  localStorage.getItem(`aptiverse_infosys_score_guest_${bundle.id}`);
                      if (raw) savedScore = JSON.parse(raw);
                    } catch {}

                    // Pack Theme Config matching design reference
                    const packThemes = {
                      'Official Sample': {
                        headerBg: 'bg-gradient-to-b from-blue-100 via-blue-50/80 to-blue-50/20',
                        topPill: 'bg-blue-500 text-white',
                        topLabel: 'SAMPLE PATTERN',
                        circleBg: 'bg-blue-600 text-white',
                        btnBg: 'bg-blue-600 hover:bg-blue-700',
                        borderHover: 'hover:border-blue-300 hover:shadow-blue-500/10',
                        titleHover: 'group-hover:text-blue-600',
                        visual: (
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-blue-100 flex items-center justify-center relative">
                            <FileText size={26} className="text-blue-500" />
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow">
                              ✓
                            </span>
                          </div>
                        )
                      },
                      'Easy': {
                        headerBg: 'bg-gradient-to-b from-emerald-100 via-emerald-50/80 to-emerald-50/20',
                        topPill: 'bg-emerald-600 text-white',
                        topLabel: 'EASY PACK',
                        circleBg: 'bg-emerald-600 text-white',
                        btnBg: 'bg-emerald-600 hover:bg-emerald-700',
                        borderHover: 'hover:border-emerald-300 hover:shadow-emerald-500/10',
                        titleHover: 'group-hover:text-emerald-600',
                        visual: (
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center relative">
                            <Target size={28} className="text-emerald-500" />
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping opacity-60" />
                          </div>
                        )
                      },
                      'Moderate': {
                        headerBg: 'bg-gradient-to-b from-purple-100 via-purple-50/80 to-purple-50/20',
                        topPill: 'bg-purple-600 text-white',
                        topLabel: 'MODERATE PACK',
                        circleBg: 'bg-purple-600 text-white',
                        btnBg: 'bg-purple-600 hover:bg-purple-700',
                        borderHover: 'hover:border-purple-300 hover:shadow-purple-500/10',
                        titleHover: 'group-hover:text-purple-600',
                        visual: (
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-purple-100 flex items-center justify-center relative">
                            <Code2 size={26} className="text-purple-600" />
                            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md bg-purple-600 text-white font-mono text-[9px] font-black shadow">
                              &lt;/&gt;
                            </span>
                          </div>
                        )
                      },
                      'Hard': {
                        headerBg: 'bg-gradient-to-b from-amber-100 via-amber-50/80 to-amber-50/20',
                        topPill: 'bg-amber-600 text-white',
                        topLabel: 'HARD PACK',
                        circleBg: 'bg-amber-600 text-white',
                        btnBg: 'bg-amber-600 hover:bg-amber-700',
                        borderHover: 'hover:border-amber-300 hover:shadow-amber-500/10',
                        titleHover: 'group-hover:text-amber-600',
                        visual: (
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-amber-100 flex items-center justify-center relative">
                            <Trophy size={26} className="text-amber-500" />
                            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold shadow">
                              ★
                            </span>
                          </div>
                        )
                      }
                    }[bundle.tag] || {
                      headerBg: 'bg-gradient-to-b from-slate-100 to-slate-50',
                      topPill: 'bg-slate-700 text-white',
                      topLabel: bundle.tag,
                      circleBg: 'bg-slate-700 text-white',
                      btnBg: 'bg-primary-600 hover:bg-primary-700',
                      borderHover: 'hover:border-slate-300',
                      titleHover: 'group-hover:text-primary-600',
                      visual: <FileText size={26} className="text-slate-600" />
                    };

                    return (
                      <div 
                        key={bundle.id}
                        className={`bg-white rounded-3xl border border-slate-200/90 ${packThemes.borderHover} shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1`}
                      >
                        <div>
                          {/* Top Pastel Header Area */}
                          <div className={`h-36 ${packThemes.headerBg} p-3.5 flex flex-col justify-between relative`}>
                            {/* Header Top Pills */}
                            <div className="flex items-center justify-between">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${packThemes.topPill} shadow-sm`}>
                                {packThemes.topLabel}
                              </span>
                              <span className="text-[10px] font-bold text-slate-700 bg-white/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-slate-200/60 font-mono shadow-xs">
                                Pack 0{bundle.testNumber}
                              </span>
                            </div>

                            {/* Centered Illustrative Icon */}
                            <div className="flex justify-center items-center pb-2">
                              {packThemes.visual}
                            </div>
                          </div>

                          {/* Overlapping Central Number Badge */}
                          <div className="-mt-5 mx-auto w-11 h-11 rounded-full bg-white p-1 shadow-md border border-slate-100 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300">
                            <div className={`w-full h-full rounded-full ${packThemes.circleBg} flex items-center justify-center text-white font-black text-sm shadow-inner`}>
                              0{bundle.testNumber}
                            </div>
                          </div>

                          {/* Title & Track Details */}
                          <div className="px-5 pt-2 text-center">
                            <h4 className={`text-base font-black text-slate-900 ${packThemes.titleHover} transition-colors line-clamp-1`}>
                              {bundle.title}
                            </h4>
                            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                              {bundle.subtitle}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed mt-2 line-clamp-2 px-1">
                              {bundle.description}
                            </p>
                          </div>

                          {/* Stats Row (3 Columns: Questions, Duration, Pipeline) */}
                          <div className="mx-4 mt-3 py-2.5 px-1 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-3 text-center">
                            <div>
                              <span className="text-xs font-black text-slate-800 block">{bundle.totalQuestions} Qs</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Aptitude</span>
                            </div>
                            <div className="border-x border-slate-200">
                              <span className="text-xs font-black text-slate-800 block">{bundle.totalTimeMinutes}m</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Time</span>
                            </div>
                            <div>
                              <span className="text-xs font-black text-emerald-600 block">3 Rounds</span>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Pipeline</span>
                            </div>
                          </div>

                          {/* 3-Stage Pipeline Progression Indicators */}
                          <div className="mx-4 mt-3 pt-2.5 border-t border-slate-100">
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span>Hiring Pipeline</span>
                              <span className="text-blue-600 font-bold">Standard Flow</span>
                            </div>
                            <div className="space-y-1.5 text-[11px] text-slate-600">
                              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/80 border border-slate-100">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                  <span className="font-semibold text-slate-700">R1: Online Aptitude</span>
                                </div>
                                {/* Clearly showing 5 Sections instead of 5s / 5 Sec */}
                                <span className="text-[10px] text-slate-600 font-bold font-mono">5 Sections</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/80 border border-slate-100">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                  <span className="font-semibold text-slate-700">R2: Technical Panel</span>
                                </div>
                                <span className="text-[10px] text-blue-600 font-mono font-bold">{bundle.technicalPrompts.length} Qs</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50/80 border border-slate-100">
                                <div className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="font-semibold text-slate-700">R3: HR & Managerial</span>
                                </div>
                                <span className="text-[10px] text-emerald-600 font-mono font-bold">{bundle.hrPrompts.length} Qs</span>
                              </div>
                            </div>
                          </div>

                          {/* Best Score Badge if candidate attempted before */}
                          {savedScore && (
                            <div className="mx-4 mt-3 p-2 rounded-xl bg-slate-900 text-white text-[11px] flex items-center justify-between">
                              <div>
                                <span className="text-slate-400 text-[9px] block">Your Best Score</span>
                                <span className="font-bold text-emerald-400">{savedScore.score} / {savedScore.total_questions}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                                savedScore.cleared ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}>
                                {savedScore.cleared ? 'Cleared Cutoff' : 'Recorded'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action CTA Button */}
                        <div className="p-4 pt-3">
                          <button
                            onClick={() => {
                              setSelectedMockBundle(bundle);
                              setActiveRoundStep(1);
                            }}
                            className={`w-full py-3 ${packThemes.btnBg} text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-98`}
                          >
                            <Play size={13} className="fill-white" />
                            Start Complete Drive 0{bundle.testNumber}
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
            TAB 1: RECRUITMENT GUIDE & SYLLABUS BLOG (FIRST VIEW)
           ======================================================= */}
        {activeTab === 'guide' && (
          <InfosysGuideBlog
            onStartMockTest={() => {
              setActiveTab('timeline-test');
              setActiveRoundStep(1);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
          />
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
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all mb-2.5 active:scale-98"
            >
              <LogIn size={18} /> Sign In with Google
            </button>
            <button
              onClick={() => setShowSignInModal(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all mb-3"
            >
              <UserCheck size={16} className="text-emerald-400" /> Continue as Guest (Practice Mode)
            </button>
            <button
              onClick={() => setShowSignInModal(false)}
              className="text-xs text-slate-400 hover:text-white transition-colors py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Daily Hard Challenge Modal */}
      <DailyChallengeModal
        isOpen={isDailyChallengeOpen}
        onClose={() => setIsDailyChallengeOpen(false)}
      />

    </div>
  );
};

export default InfosysPrep;

