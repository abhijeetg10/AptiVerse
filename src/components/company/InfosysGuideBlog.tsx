import React, { useState } from 'react';
import { 
  Building2, BookOpen, Clock, CheckCircle2, MapPin, 
  GraduationCap, FileText, ChevronDown, ChevronUp, Search, 
  ShieldCheck, ArrowRight, Play, AlertCircle, Sparkles, 
  Award, Briefcase, HelpCircle, Check, XCircle
} from 'lucide-react';
import { 
  INFOSYS_COMPANY_OVERVIEW, 
  INFOSYS_SECTIONS_CONFIG, 
  INFOSYS_SYLLABUS 
} from '../../data/infosysPrepData';

interface InfosysGuideBlogProps {
  onStartMockTest: () => void;
}

export const InfosysGuideBlog: React.FC<InfosysGuideBlogProps> = ({ onStartMockTest }) => {
  const [syllabusSearch, setSyllabusSearch] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(INFOSYS_SYLLABUS[0].section);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const FAQS = [
    {
      q: 'Does the Infosys Online Assessment have negative marking?',
      a: 'No. Infosys does not deduct marks for incorrect answers. Since there is zero negative marking, candidates should never leave any question unattempted before the section timer expires.'
    },
    {
      q: 'Can I switch between sections or revisit previous questions during the test?',
      a: 'No. The Infosys test platform enforces strict sequential section navigation. Once you submit a section (or its timer runs out), you cannot return to it. Within the active section, however, you can navigate between questions.'
    },
    {
      q: 'Is hands-on programming / coding required for the Systems Engineer (3.6 LPA) role?',
      a: 'No full coding simulator is tested for the 3.6 LPA Systems Engineer role. Instead, Section 4 tests Pseudocode tracing (debugging logic, bitwise operations, recursion, and loops). Coding questions are only tested for DSE (6.25 LPA) and SP (9.5 LPA) roles.'
    },
    {
      q: 'What is the sectional cutoff percentage required to clear Round 1?',
      a: 'Infosys enforces independent sectional cutoffs (typically between 60% and 70% in each section). Scoring exceptionally high in Reasoning will not compensate for scoring below the cutoff in Mathematical Ability or Pseudocode.'
    },
    {
      q: 'Are non-computer science branches (Mechanical, Civil, EEE) eligible to apply?',
      a: 'Yes! Infosys hires graduates from all engineering branches (B.E. / B.Tech / M.E. / M.Tech in any discipline) as well as MCA and M.Sc Computer Science, provided they meet the minimum 60% / 6.0 CGPA criteria.'
    },
    {
      q: 'What is the cooling period if a candidate does not clear the Infosys drive?',
      a: 'Infosys typically mandates a 3-month (90 days) cooling period before a candidate can re-attempt an on-campus or off-campus recruitment drive.'
    }
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* Top Banner: Quick Jump to Live Mock Test */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl border border-indigo-900/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-600/30">
            <Play size={22} className="fill-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-500/20 text-primary-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-1 border border-primary-500/30">
              <Sparkles size={11} /> 2025–2026 Campus Drive Blueprint
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Complete Infosys Practice Test, PYQ & Mock Interview Guide
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Read the comprehensive syllabus, sectional cutoff rules, and interview questions below or jump directly into the full timed Infosys mock practice test.
            </p>
          </div>
        </div>

        <button
          onClick={onStartMockTest}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-primary-600/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <span>Take Infosys Practice Test (PYQs)</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Interactive Table of Contents (Pill Bar) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
          Quick Navigation / Table of Contents
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { label: 'Role & Hierarchy', id: 'role-overview' },
            { label: 'Eligibility Criteria', id: 'eligibility' },
            { label: 'Salary Packages', id: 'packages' },
            { label: 'Hiring Process', id: 'hiring-rounds' },
            { label: 'Exam Pattern & Cutoffs', id: 'exam-pattern' },
            { label: 'Detailed Syllabus', id: 'syllabus' },
            { label: 'GEC Mysuru Training', id: 'training' },
            { label: '4-Week Prep Strategy', id: 'prep-strategy' },
            { label: 'Proctoring & Rules', id: 'test-rules' },
            { label: 'FAQs', id: 'faqs' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-primary-50 hover:text-primary-700 text-slate-700 font-semibold border border-slate-200/80 transition-all cursor-pointer text-xs"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: ROLE & COMPANY OVERVIEW */}
      <section id="role-overview" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <Building2 size={16} /> Section 1: Company & Role Overview
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Infosys Systems Engineer (SE) Recruitment Blueprint
        </h2>
        
        <p className="text-neutral-600 text-sm leading-relaxed">
          <strong>Infosys Limited</strong> (NYSE: INFY) is a global leader in next-generation digital services and consulting, operating in over 56 countries with over 315,000 employees. For engineering graduates and post-graduates, the entry-level career gateway is the <strong>Systems Engineer (Trainee)</strong> role.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Designation</span>
            <span className="text-base font-extrabold text-blue-950 block mt-0.5">Systems Engineer Trainee</span>
            <span className="text-xs text-blue-800/80 mt-1 block">Level 3 (Software Engineering stream)</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Standard Campus CTC</span>
            <span className="text-base font-extrabold text-emerald-950 block mt-0.5">₹3.60 Lakhs Per Annum</span>
            <span className="text-xs text-emerald-800/80 mt-1 block">In-hand: ₹24,000 – ₹26,000 / month</span>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Primary Work Locations</span>
            <span className="text-base font-extrabold text-purple-950 block mt-0.5">Pan-India DCs</span>
            <span className="text-xs text-purple-800/80 mt-1 block">Bengaluru, Pune, Hyderabad, Chennai, Mysuru</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: ELIGIBILITY CRITERIA & POLICIES */}
      <section id="eligibility" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <GraduationCap size={16} /> Section 2: Eligibility Criteria & Academic Policies
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Who Can Apply for Infosys Campus Recruitment?
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed">
          Infosys adheres to strict academic cutoffs across high school, diploma, and undergraduate degrees. Verification is performed during onboarding and failure to meet the requirements leads to offer revocation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Eligible Degrees & Branches</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
              <li><strong>B.E. / B.Tech</strong>: All branches (CS, IT, ECE, EEE, Mechanical, Civil, Chemical, etc.)</li>
              <li><strong>M.E. / M.Tech</strong>: All disciplines with matching UG criteria</li>
              <li><strong>MCA / M.Sc</strong>: Computer Science, IT, Mathematics, or Electronics</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Academic Percentage Threshold</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
              <li><strong>Class 10th (SSC)</strong>: Minimum 60% or 6.0 CGPA</li>
              <li><strong>Class 12th (HSC) / Diploma</strong>: Minimum 60% or 6.0 CGPA</li>
              <li><strong>Graduation (B.Tech / MCA)</strong>: Minimum 60% or 6.0 CGPA (aggregate till current sem)</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <AlertCircle size={16} className="text-amber-600" />
              <span>Backlog & Arrears Policy</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
              <li><strong>Active Backlogs</strong>: 0 active / standing backlogs allowed at the time of joining.</li>
              <li>Past cleared backlogs are acceptable provided overall aggregate remains ≥ 60%.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Clock size={16} className="text-indigo-600" />
              <span>Education Gap & Re-attempt</span>
            </div>
            <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1">
              <li><strong>Education Gap</strong>: Maximum 2 years permitted with genuine documentation.</li>
              <li><strong>Cooling Period</strong>: 3 months (90 days) before re-attempting Infosys test.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: SALARY PACKAGES & CAREER TRACKS */}
      <section id="packages" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <Briefcase size={16} /> Section 3: Salary Packages & Role Hierarchy
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Infosys Fresher Hiring Tiers (SE vs DSE vs SP)
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed">
          Infosys provides three distinct hiring tiers for fresh college graduates depending on coding proficiency and performance in competitive assessment challenges:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Tier 1: Systems Engineer */}
          <div className="rounded-2xl border-2 border-slate-200 p-5 bg-white flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">Tier 1 • Standard</span>
                <span className="text-base font-black text-slate-900">₹3.60 LPA</span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-1">Systems Engineer (SE)</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Standard on-campus recruitment test focusing on cognitive aptitude, mental math, and pseudocode logic.
              </p>
              <div className="text-xs text-slate-700 space-y-1.5 pt-3 border-t border-slate-100">
                <div>• <strong>Monthly Take-Home</strong>: ~₹24,500</div>
                <div>• <strong>Selection Mode</strong>: Online Assessment + Interview</div>
                <div>• <strong>Coding Level</strong>: Pseudocode tracing only</div>
              </div>
            </div>
            <button
              onClick={onStartMockTest}
              className="mt-5 w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-primary-600 transition-colors"
            >
              Practice SE Test
            </button>
          </div>

          {/* Tier 2: Digital Specialist Engineer */}
          <div className="rounded-2xl border-2 border-indigo-200 p-5 bg-indigo-50/30 flex flex-col justify-between shadow-sm relative">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-xs">
              Popular Upgrade
            </span>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Tier 2 • Advanced</span>
                <span className="text-base font-black text-indigo-950">₹6.25 LPA</span>
              </div>
              <h3 className="font-extrabold text-lg text-indigo-950 mb-1">Digital Specialist (DSE)</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Offered through InfyTQ certification or HackWithInfy with medium-level data structures & algorithm challenges.
              </p>
              <div className="text-xs text-slate-700 space-y-1.5 pt-3 border-t border-indigo-100">
                <div>• <strong>Monthly Take-Home</strong>: ~₹42,000</div>
                <div>• <strong>Selection Mode</strong>: InfyTQ / Coding qualifier</div>
                <div>• <strong>Coding Level</strong>: DSA (Trees, Arrays, Sorting)</div>
              </div>
            </div>
            <div className="mt-5 text-[11px] text-indigo-700 font-semibold text-center py-2 bg-indigo-100/60 rounded-xl">
              Available via InfyTQ & HackWithInfy
            </div>
          </div>

          {/* Tier 3: Specialist Programmer */}
          <div className="rounded-2xl border-2 border-purple-200 p-5 bg-purple-50/30 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">Tier 3 • Elite</span>
                <span className="text-base font-black text-purple-950">₹9.50 LPA</span>
              </div>
              <h3 className="font-extrabold text-lg text-purple-950 mb-1">Specialist Programmer (SP)</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Elite competitive coding track for high-performing coders. Heavy focus on dynamic programming, graphs, and system design.
              </p>
              <div className="text-xs text-slate-700 space-y-1.5 pt-3 border-t border-purple-100">
                <div>• <strong>Monthly Take-Home</strong>: ~₹65,000</div>
                <div>• <strong>Selection Mode</strong>: HackWithInfy top ranks</div>
                <div>• <strong>Coding Level</strong>: Advanced (DP, Graphs, Trie)</div>
              </div>
            </div>
            <div className="mt-5 text-[11px] text-purple-700 font-semibold text-center py-2 bg-purple-100/60 rounded-xl">
              National Coding Hackathon Track
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: 3-ROUND HIRING PROCESS FLOW */}
      <section id="hiring-rounds" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <Award size={16} /> Section 4: Selection Process & Round-by-Round Flow
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Step-by-Step 3-Stage Recruitment Pipeline
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed">
          The Infosys hiring process consists of 1 screening assessment and 2 interview rounds. All rounds are elimination rounds.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Round 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Round 1: Online Assessment</h3>
              <div className="text-xs font-mono font-bold text-primary-700 mb-3">54 Questions • 100 Minutes</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conducted on Infosys assessment platform (proctored via webcam & audio). Features 5 timed sections with independent cutoffs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
              Elimination Rate: ~65–70%
            </div>
          </div>

          {/* Round 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Round 2: Technical Interview</h3>
              <div className="text-xs font-mono font-bold text-blue-700 mb-3">25 – 35 Minutes • Live Panel</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                One-on-one technical discussion evaluating OOPs, DBMS, SQL queries, resume projects, and fundamental problem-solving concepts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
              Focus: Resume Projects & Core CS
            </div>
          </div>

          {/* Round 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">Round 3: HR Discussion</h3>
              <div className="text-xs font-mono font-bold text-emerald-700 mb-3">15 – 20 Minutes • Culture Fit</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verification of willingness to relocate to any Infosys Development Center, shift flexibility, communication skills, and background check.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
              Result: Official Letter of Intent (LOI)
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: EXAM PATTERN & SECTIONAL CUTOFFS TABLE */}
      <section id="exam-pattern" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <FileText size={16} /> Section 5: Round 1 Exam Pattern & Sectional Cutoffs
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Exact Section Timers & Cutoff Targets
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed">
          The table below reflects the official Format A pattern used in the current recruitment season. Candidates must cross the cutoff in <strong>every single section</strong> to be shortlisted for the interview.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-3.5">Section Name</th>
                <th className="p-3.5">Questions</th>
                <th className="p-3.5">Time Allotted</th>
                <th className="p-3.5">Estimated Cutoff</th>
                <th className="p-3.5">Min Safe Score</th>
                <th className="p-3.5">Negative Marking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {INFOSYS_SECTIONS_CONFIG.map(sec => (
                <tr key={sec.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{sec.name}</td>
                  <td className="p-3.5 font-mono">{sec.questionCount} Qs</td>
                  <td className="p-3.5 font-mono text-indigo-700 font-bold">{sec.timeMinutes} Mins</td>
                  <td className="p-3.5 text-slate-700 font-semibold">{sec.cutoffPercentage}%</td>
                  <td className="p-3.5 font-bold text-emerald-700 font-mono">≥ {sec.minCorrectRequired} Qs</td>
                  <td className="p-3.5 text-slate-500 font-medium">None (0)</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-extrabold text-slate-900 border-t-2 border-slate-300">
                <td className="p-3.5">Total Benchmark</td>
                <td className="p-3.5 font-mono">54 Questions</td>
                <td className="p-3.5 font-mono text-indigo-700">100 Minutes</td>
                <td className="p-3.5 text-emerald-700">All Cutoffs Must Pass</td>
                <td className="p-3.5 text-emerald-800 font-mono">≥ 36 / 54 Qs</td>
                <td className="p-3.5 text-slate-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mid-Guide Direct Redirect Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-primary-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-extrabold text-slate-900 text-sm block">Want to test yourself against this exact 54-question pattern?</span>
            <span className="text-slate-600">Simulate official section switching, strict timers, and sectional cutoff diagnostics now.</span>
          </div>
          <button
            onClick={onStartMockTest}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95"
          >
            <Play size={13} className="fill-white" />
            <span>Start Pattern Mock Test</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* SECTION 6: COMPLETE TOPIC-WISE SYLLABUS */}
      <section id="syllabus" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">
              <BookOpen size={16} /> Section 6: In-Depth Topic Syllabus
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900">
              High-Yield Topics Covered in AptiVerse
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Filter by concept or expand sections to review essential formulas and problem types.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={syllabusSearch}
              onChange={(e) => setSyllabusSearch(e.target.value)}
              placeholder="Search topics (e.g. Loops, Seating)..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-none focus:border-primary-500 font-medium"
            />
          </div>
        </div>

        <div className="space-y-4">
          {INFOSYS_SYLLABUS.map((sec) => {
            const isExpanded = expandedSection === sec.section;
            const filteredTopics = sec.topics.filter((t: string) => 
              t.toLowerCase().includes(syllabusSearch.toLowerCase())
            );

            if (syllabusSearch && filteredTopics.length === 0) return null;

            return (
              <div key={sec.section} className="border border-neutral-200 rounded-2xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : sec.section)}
                  className="w-full p-4 bg-neutral-50/80 hover:bg-neutral-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {sec.section.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-neutral-900">{sec.section}</span>
                      <span className="text-xs text-neutral-500 ml-2">({filteredTopics.length} core topics)</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-neutral-500" /> : <ChevronDown size={16} className="text-neutral-500" />}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 border-t border-neutral-100 animate-fadeIn">
                    {filteredTopics.map((topic: string) => (
                      <div key={topic} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 text-xs text-neutral-700">
                        <Check size={13} className="text-emerald-600 shrink-0" />
                        <span className="font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: TRAINING AT INFOSYS GEC MYSURU */}
      <section id="training" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <MapPin size={16} /> Section 7: Life & Training at Infosys GEC Mysuru Campus
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          What Happens After You Clear the Interview?
        </h2>
        <p className="text-neutral-600 text-sm leading-relaxed">
          Every selected Systems Engineer undergoes the world-renowned <strong>Foundation Training Program</strong> at the <strong>Global Education Center (GEC)</strong> in Mysuru, Karnataka.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
            <h4 className="font-extrabold text-sm text-blue-950 flex items-center gap-2">
              <GraduationCap size={16} className="text-blue-600" />
              <span>Generic Training (Phase 1 • 8–10 Weeks)</span>
            </h4>
            <p className="text-blue-900/80 leading-relaxed">
              Focuses on core programming logic, algorithms, Object-Oriented Analysis & Design (OOAD), relational database management (SQL / PostgreSQL), and Unix/Linux shell essentials. All candidates take the <strong>Comprehensive Assessment (CA)</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
            <h4 className="font-extrabold text-sm text-indigo-950 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600" />
              <span>Stream Training (Phase 2 • 10–13 Weeks)</span>
            </h4>
            <p className="text-indigo-900/80 leading-relaxed">
              Allocation to modern technology streams based on business requirements: Java Full Stack, .NET Core, Cloud Engineering (AWS/Azure), Data Analytics, Cyber Security, or Mainframe. Culminates in Focus Area (FA) project assignments.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1.5">
          <div className="font-bold text-slate-900">Campus Amenities & Perks:</div>
          <div>• 337-acre residential campus with multiplex movie theatre, bowling alley, cricket grounds, and world-class gyms.</div>
          <div>• Candidates receive their full salary during training, along with subsidized hostel accommodation and food courts.</div>
        </div>
      </section>

      {/* SECTION 8: 4-WEEK STRATEGIC PREPARATION ROADMAP */}
      <section id="prep-strategy" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <Clock size={16} /> Section 8: 4-Week Strategic Preparation Roadmap
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          How to Clear the Infosys Drive in 30 Days
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
            <span className="font-mono font-extrabold text-amber-700 text-[10px] uppercase block">Week 1</span>
            <div className="font-extrabold text-slate-900 text-sm">Arithmetic & Mental Speed</div>
            <p className="text-slate-600 leading-relaxed">
              Focus on Percentages, Profit & Loss, Speed Distance Time, and Mixtures. Solve under timed pressure without a calculator.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <span className="font-mono font-extrabold text-emerald-700 text-[10px] uppercase block">Week 2</span>
            <div className="font-extrabold text-slate-900 text-sm">Reasoning & Cryptarithmetic</div>
            <p className="text-slate-600 leading-relaxed">
              Master Data Sufficiency, Linear/Circular Seating, Syllogisms, and Cryptarithmetic digit-letter equations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
            <span className="font-mono font-extrabold text-blue-700 text-[10px] uppercase block">Week 3</span>
            <div className="font-extrabold text-slate-900 text-sm">Pseudocode & Verbal Grammar</div>
            <p className="text-slate-600 leading-relaxed">
              Practice dry-running C/C++/Java loops, bitwise operators (&amp;, |, ^, shift ops), and reading comprehension passages.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
            <span className="font-mono font-extrabold text-purple-700 text-[10px] uppercase block">Week 4</span>
            <div className="font-extrabold text-slate-900 text-sm">Full Mocks & AI Interview</div>
            <p className="text-slate-600 leading-relaxed">
              Take full 100-minute timed mock tests on AptiVerse and practice behavioral questions in the AI interview room.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: ONLINE TEST DO'S AND DON'TS */}
      <section id="test-rules" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck size={16} /> Section 9: Online Test Rules & Proctoring Protocol
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Essential Do's & Don'ts for the Online Screening Round
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Mandatory Do's</span>
            </div>
            <ul className="space-y-1.5 text-emerald-950/80">
              <li>✓ Keep a working webcam and microphone active throughout the entire 100 minutes.</li>
              <li>✓ Maintain proper front-facing lighting with your face clearly visible.</li>
              <li>✓ Keep blank physical sheets and a pen for rough math and pseudocode traces.</li>
              <li>✓ Attempt every question (0 negative marking means no penalty for guessing).</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
              <XCircle size={16} className="text-rose-600" />
              <span>Strict Don'ts</span>
            </div>
            <ul className="space-y-1.5 text-rose-950/80">
              <li>✗ Do NOT switch browser tabs or minimize the test window (triggers auto-disqualification).</li>
              <li>✗ Do NOT use multiple monitors, screen-sharing apps, or virtual machines.</li>
              <li>✗ Do NOT let any other person enter the camera frame or speak in the room.</li>
              <li>✗ Do NOT spend more than 2 minutes stuck on any single math problem.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 10: FREQUENTLY ASKED QUESTIONS */}
      <section id="faqs" className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider">
          <HelpCircle size={16} /> Section 10: Frequently Asked Questions (FAQ)
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
          Frequently Asked Questions About Infosys Placement
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                >
                  <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-slate-500 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Sticky-style Final Launch Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl border border-slate-800">
        <div>
          <span className="text-[10px] font-mono font-bold text-primary-400 uppercase tracking-wider block">
            Official Simulation Ready
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            Ready to Begin Your Infosys Systems Engineer Mock Test?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Test your performance across all 5 sections, get instant sectional cutoff analysis, and practice technical and HR interviews with AI feedback.
          </p>
        </div>

        <button
          onClick={onStartMockTest}
          className="px-7 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-primary-600/30 transition-all flex items-center gap-2 shrink-0 cursor-pointer hover:scale-105 active:scale-95"
        >
          <span>Start Round 1 Assessment</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Educational Disclaimer */}
      <div className="p-4 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-500 text-center">
        {INFOSYS_COMPANY_OVERVIEW.disclaimer}
      </div>

    </div>
  );
};
