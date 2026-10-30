import React, { useState } from 'react';
import { 
  Building2, BookOpen, Award, Sparkles, Video, Clock, CheckCircle2, 
  MapPin, GraduationCap, ChevronRight, AlertCircle, FileText, ChevronDown, 
  ExternalLink, Search, Brain, Zap, HelpCircle 
} from 'lucide-react';
import { 
  INFOSYS_COMPANY_OVERVIEW, INFOSYS_SELECTION_ROUNDS, 
  INFOSYS_ASSESSMENT_FORMATS, INFOSYS_SYLLABUS, 
  INTERVIEW_QUESTIONS 
} from '../../data/infosysPrepData';
import { InteractiveMockTest } from '../../components/company/InteractiveMockTest';
import { AIMockInterviewRoom } from '../../components/company/AIMockInterviewRoom';
import { AdBanner } from '../../components/ui/AdBanner';

export const InfosysPrep: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'mock-full' | 'mock-diag' | 'interview' | 'qbank'>('guide');
  const [syllabusSearch, setSyllabusSearch] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(INFOSYS_SYLLABUS[0].section);
  const [selectedInterviewCategory, setSelectedInterviewCategory] = useState<string>('All');

  const filteredInterviewQuestions = selectedInterviewCategory === 'All'
    ? INTERVIEW_QUESTIONS
    : INTERVIEW_QUESTIONS.filter(q => q.category === selectedInterviewCategory);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white pt-10 pb-16 px-6 border-b border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-2xl -z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronRight size={12} />
            <a href="/games" className="hover:text-white transition-colors">Placement Prep</a>
            <ChevronRight size={12} />
            <span className="text-primary-400 font-semibold">Infosys Systems Engineer</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30 flex items-center gap-1.5">
                  <Building2 size={13} /> Infosys Campus Drive 2025–2027
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Target Role: Systems Engineer (Trainee)
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                Infosys Placement Prep & <span className="text-primary-400">AI Mock Interview</span>
              </h1>

              <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-6">
                Master the full Infosys recruitment pipeline: research-backed exam patterns, topic-wise syllabus, timed practice tests, and an interactive webcam AI mock interview room.
              </p>

              {/* Quick Info Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <div className="text-slate-400 font-medium">Reference Package</div>
                  <div className="font-bold text-white text-sm mt-0.5">{INFOSYS_COMPANY_OVERVIEW.referencePackage}</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <div className="text-slate-400 font-medium">Training Center</div>
                  <div className="font-bold text-white text-sm mt-0.5">GEC Mysuru (19-23 wks)</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <div className="text-slate-400 font-medium">Online Assessment</div>
                  <div className="font-bold text-white text-sm mt-0.5">54–60 Qs • 100–120 min</div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <div className="text-slate-400 font-medium">Selection Rounds</div>
                  <div className="font-bold text-white text-sm mt-0.5">Assessment + Tech + HR</div>
                </div>
              </div>

            </div>

            {/* Quick Action CTA Card */}
            <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col gap-3 w-full lg:w-[320px] shrink-0">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> Quick Start
              </div>
              <div className="text-sm font-bold text-white">Ready to test your readiness?</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Take the comprehensive mock test or practice live in the webcam AI interview room with recruiter voice.
              </p>
              
              <button
                onClick={() => setActiveTab('interview')}
                className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Video size={16} /> Launch AI Mock Interview
              </button>

              <button
                onClick={() => setActiveTab('mock-full')}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Clock size={16} /> Take Full Mock Test (34 Qs)
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-neutral-200/90 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 overflow-x-auto py-3">
          
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'guide'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <BookOpen size={15} /> Recruitment Guide & Syllabus
          </button>

          <button
            onClick={() => setActiveTab('mock-full')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'mock-full'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Clock size={15} /> Mock Test 1 (Full 34 Qs)
          </button>

          <button
            onClick={() => setActiveTab('mock-diag')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'mock-diag'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Zap size={15} /> Mock Test 2 (Diagnostic 15 Qs)
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'interview'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Video size={15} /> AI Recruiter Mock Interview
          </button>

          <button
            onClick={() => setActiveTab('qbank')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'qbank'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <FileText size={15} /> Interview Question Bank ({INTERVIEW_QUESTIONS.length})
          </button>

        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-6 pt-8 w-full">
        
        {/* TAB 1: RECRUITMENT GUIDE & BLOG */}
        {activeTab === 'guide' && (
          <div className="space-y-10 animate-fadeIn">
            
            {/* Overview Section */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Building2 size={16} /> Company & Role Overview
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-900 mb-4">
                Infosys Systems Engineer: What Candidates Need to Know
              </h2>
              
              <div className="prose prose-slate max-w-none text-neutral-600 text-sm leading-relaxed space-y-4">
                <p>
                  <strong>Infosys Limited</strong> is one of India's premier global information technology consulting and services corporations, headquartered in Bengaluru. Each recruitment season, Infosys hires thousands of engineering (B.Tech / B.E. / M.Tech) and computer applications (MCA / M.Sc) graduates for its flagship <strong>Systems Engineer (SE)</strong> track.
                </p>
                <p>
                  The Systems Engineer role involves end-to-end software development, enterprise application maintenance, cloud modernization, data engineering, APIs, and transactional software services across global client domains including banking, healthcare, retail, and manufacturing.
                </p>
              </div>

              {/* Compensation & Related Tracks Grid */}
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-900 mb-3">Infosys Fresh Graduate Hiring Tracks</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {INFOSYS_COMPANY_OVERVIEW.relatedRoles.map(role => (
                    <div key={role.title} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                      <div className="font-bold text-neutral-900 text-sm">{role.title}</div>
                      <div className="text-primary-600 font-extrabold text-sm mt-1">{role.package}</div>
                      <div className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{role.desc}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  * Note: Package figures are based on recent campus placement communications (e.g. INR 3.6 LPA for 2026-2027 batch campus drives). Compensation and eligibility rules are finalized per hiring notification.
                </p>
              </div>

              {/* Training at GEC Mysuru */}
              <div className="mt-6 p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                <div className="font-bold text-sm text-blue-950 mb-1 flex items-center gap-1.5">
                  <GraduationCap size={16} className="text-blue-600" />
                  World-Famous Foundation Program at GEC Mysuru
                </div>
                {INFOSYS_COMPANY_OVERVIEW.trainingInfo} Selected candidates learn Java full-stack, enterprise databases, cloud platforms, automated testing, and agile methodologies before project deployment.
              </div>
            </div>

            {/* Selection Process Roadmap */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Clock size={16} /> Selection Pipeline
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-900 mb-6">
                Round-by-Round Recruitment Journey
              </h2>

              <div className="grid md:grid-cols-4 gap-6">
                {INFOSYS_SELECTION_ROUNDS.map(round => (
                  <div key={round.roundNumber} className="relative bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-8 h-8 rounded-full bg-primary-600 text-white font-extrabold text-xs flex items-center justify-center">
                          R{round.roundNumber}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary-100 text-primary-800">
                          {round.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-neutral-900 mb-1">{round.title}</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed">{round.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-200 text-[11px] text-neutral-400 font-mono">
                      ⏱ Duration: {round.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Pattern Comparison */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm">
              <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-2">
                <FileText size={16} /> Online Assessment Blueprint
              </div>
              <h2 className="text-2xl font-extrabold text-neutral-900 mb-4">
                Round 1 Online Screening Test Patterns
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                Infosys employs automated proctored assessments. Historically and in official sample papers, a 5-section format is widely circulated; several recent 2025 drives have also reported a 7-part pattern that includes an English Writing segment.
              </p>

              <div className="grid lg:grid-cols-2 gap-6">
                {INFOSYS_ASSESSMENT_FORMATS.map(fmt => (
                  <div key={fmt.name} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                    <div className="font-bold text-neutral-900 text-sm mb-1">{fmt.name}</div>
                    <div className="text-xs text-primary-600 font-semibold mb-4">
                      {fmt.totalQuestions} Questions • {fmt.totalTimeMinutes} Minutes
                    </div>

                    <div className="space-y-2">
                      {fmt.sections.map(sec => (
                        <div key={sec.name} className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-neutral-200 text-xs">
                          <span className="font-medium text-neutral-800">{sec.name}</span>
                          <span className="text-neutral-500 font-mono">
                            {sec.questions} Qs / {sec.timeMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Searchable Syllabus Accordion */}
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
                    <BookOpen size={16} /> Topic-Wise Breakdown
                  </div>
                  <h2 className="text-2xl font-extrabold text-neutral-900">
                    Comprehensive Examination Syllabus
                  </h2>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    value={syllabusSearch}
                    onChange={(e) => setSyllabusSearch(e.target.value)}
                    placeholder="Search topics (e.g. Time, Loops)..."
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {INFOSYS_SYLLABUS.map(sec => {
                  const isExpanded = expandedSection === sec.section;
                  const filteredTopics = sec.topics.filter(t => 
                    t.toLowerCase().includes(syllabusSearch.toLowerCase())
                  );

                  if (syllabusSearch && filteredTopics.length === 0) return null;

                  return (
                    <div key={sec.section} className="border border-neutral-200 rounded-2xl overflow-hidden transition-all">
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
                          {filteredTopics.map((topic, tIdx) => (
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

              {/* Call to action for tests */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base">Ready to test these topics against real timers?</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Attempt our 34-question full practice test with step-by-step explanations.</p>
                </div>
                <button
                  onClick={() => setActiveTab('mock-full')}
                  className="px-6 py-2.5 bg-white text-primary-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow transition-all active:scale-95 shrink-0"
                >
                  Start Practice Test
                </button>
              </div>

            </div>

            {/* Disclaimer Box */}
            <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-500 text-center">
              {INFOSYS_COMPANY_OVERVIEW.disclaimer}
            </div>

          </div>
        )}

        {/* TAB 2: FULL MOCK TEST (34 QUESTIONS) */}
        {activeTab === 'mock-full' && (
          <div className="animate-fadeIn">
            <InteractiveMockTest testMode="full" />
          </div>
        )}

        {/* TAB 3: DIAGNOSTIC MOCK TEST (15 QUESTIONS) */}
        {activeTab === 'mock-diag' && (
          <div className="animate-fadeIn">
            <InteractiveMockTest testMode="diagnostic" />
          </div>
        )}

        {/* TAB 4: AI RECRUITER MOCK INTERVIEW ROOM */}
        {activeTab === 'interview' && (
          <div className="animate-fadeIn">
            <AIMockInterviewRoom onClose={() => setActiveTab('guide')} />
          </div>
        )}

        {/* TAB 5: INTERVIEW QUESTION BANK EXPLORER */}
        {activeTab === 'qbank' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
                    <FileText size={16} /> Technical & HR Question Bank
                  </div>
                  <h2 className="text-2xl font-extrabold text-neutral-900">
                    Infosys Systems Engineer Interview Questions
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Candidate-reported prompts from recent campus & off-campus hiring drives with model answer points.
                  </p>
                </div>

                {/* Launch interview room shortcut */}
                <button
                  onClick={() => setActiveTab('interview')}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-primary-600/20 shrink-0"
                >
                  <Video size={14} /> Practice in AI Room
                </button>
              </div>

              {/* Category Filters */}
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
                  <div key={q.id} className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 hover:border-neutral-300 transition-all">
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

    </div>
  );
};

export default InfosysPrep;

