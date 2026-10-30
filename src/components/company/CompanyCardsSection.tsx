import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Sparkles, ArrowRight, Clock, Video, CheckCircle2, Lock } from 'lucide-react';

export const CompanyCardsSection: React.FC = () => {
  return (
    <section className="pt-16 pb-16 max-w-7xl mx-auto px-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-3 text-primary-600 font-bold text-xs tracking-wider uppercase mb-3">
          <div className="w-10 h-[2px] bg-primary-200"></div>
          <span className="flex items-center gap-1.5">
            <Building2 size={14} /> TARGET RECRUITMENT DRIVES
          </span>
          <div className="w-10 h-[2px] bg-primary-200"></div>
        </div>
        
        <h2 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight mb-3">
          Company-Specific Mock Tests & <span className="text-primary-600">AI Interviews</span>
        </h2>
        
        <p className="text-neutral-500 max-w-2xl text-sm lg:text-base leading-relaxed">
          Prepare for real campus and off-campus recruitment drives with company-tailored assessment blueprints, full syllabus guides, and interactive AI recruiter interview panels.
        </p>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* 1. INFOSYS - ACTIVE */}
        <Link 
          to="/company/infosys"
          className="group relative bg-white rounded-3xl p-6 border-2 border-primary-500/80 hover:border-primary-600 shadow-lg shadow-primary-500/10 hover:shadow-xl hover:shadow-primary-600/20 transition-all flex flex-col justify-between overflow-hidden"
        >
          {/* Active Accent Gradient Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-600 via-indigo-500 to-blue-500"></div>

          <div>
            {/* Tag & Status */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE DRIVE
              </span>
              <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">
                3.6 LPA
              </span>
            </div>

            {/* Logo / Monogram */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                Infy
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-neutral-900 group-hover:text-primary-600 transition-colors">
                  Infosys
                </h3>
                <p className="text-xs text-neutral-500 font-medium">Systems Engineer (Trainee)</p>
              </div>
            </div>

            {/* Features Bullet List */}
            <div className="space-y-2 mb-6 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                <span>Pattern A (54 Qs) & Pattern B (60 Qs)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                <span>34 Practice MCQs with Step Solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                <span className="text-indigo-600 font-semibold flex items-center gap-1">
                  <Video size={12} /> AI Recruiter Mock Interview Room
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-primary-600 group-hover:text-primary-700">
            <span>Start Infosys Preparation</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 2. TCS NQT - UPCOMING */}
        <div className="relative bg-neutral-50/70 rounded-3xl p-6 border border-neutral-200/80 flex flex-col justify-between opacity-90 hover:opacity-100 transition-opacity">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Clock size={11} /> UPCOMING
              </span>
              <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                Ninja & Digital
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                TCS
              </div>
              <div>
                <h3 className="font-extrabold text-base text-neutral-800">
                  TCS NQT
                </h3>
                <p className="text-xs text-neutral-500 font-medium">National Qualifier Test</p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              Cognitive skills (Numerical, Reasoning, Verbal) and advanced programming hands-on coding tests.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-400 font-medium">
            <span className="flex items-center gap-1.5"><Lock size={12} /> In Progress</span>
            <span className="text-[11px] bg-neutral-200/80 text-neutral-600 px-2 py-0.5 rounded font-semibold">Soon</span>
          </div>
        </div>

        {/* 3. CAPGEMINI - UPCOMING */}
        <div className="relative bg-neutral-50/70 rounded-3xl p-6 border border-neutral-200/80 flex flex-col justify-between opacity-90 hover:opacity-100 transition-opacity">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Clock size={11} /> UPCOMING
              </span>
              <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                Analyst
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-700 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                CAP
              </div>
              <div>
                <h3 className="font-extrabold text-base text-neutral-800">
                  Capgemini
                </h3>
                <p className="text-xs text-neutral-500 font-medium">Excellence Assessment</p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              Game-based aptitude tests, pseudocode logic tracing, English communication and technical interview rounds.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-400 font-medium">
            <span className="flex items-center gap-1.5"><Lock size={12} /> In Progress</span>
            <span className="text-[11px] bg-neutral-200/80 text-neutral-600 px-2 py-0.5 rounded font-semibold">Soon</span>
          </div>
        </div>

        {/* 4. ACCENTURE - UPCOMING */}
        <div className="relative bg-neutral-50/70 rounded-3xl p-6 border border-neutral-200/80 flex flex-col justify-between opacity-90 hover:opacity-100 transition-opacity">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Clock size={11} /> UPCOMING
              </span>
              <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                ASE / FSE
              </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-700 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                &gt;
              </div>
              <div>
                <h3 className="font-extrabold text-base text-neutral-800">
                  Accenture
                </h3>
                <p className="text-xs text-neutral-500 font-medium">Associate Software Engineer</p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              Cognitive & Technical assessments (Cloud, MS Office, Network Security), coding questions, and communication voice assessment.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-400 font-medium">
            <span className="flex items-center gap-1.5"><Lock size={12} /> In Progress</span>
            <span className="text-[11px] bg-neutral-200/80 text-neutral-600 px-2 py-0.5 rounded font-semibold">Soon</span>
          </div>
        </div>

      </div>

    </section>
  );
};
