import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Sparkles, ArrowRight, Clock, Video, CheckCircle2, 
  Lock, BookOpen, FileText, Award, Compass 
} from 'lucide-react';
import { Badge } from '../ui/Badge';

export const CompanyCardsSection: React.FC = () => {
  return (
    <section className="pt-16 pb-20 max-w-7xl mx-auto px-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-14">
        <div className="flex items-center gap-3 text-primary-600 font-bold text-xs tracking-wider uppercase mb-3">
          <div className="w-10 h-[2px] bg-primary-200"></div>
          <span className="flex items-center gap-1.5">
            <Building2 size={14} /> TARGET RECRUITMENT DRIVES
          </span>
          <div className="w-10 h-[2px] bg-primary-200"></div>
        </div>
        
        <h2 className="text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight mb-3">
          Company Mock Tests & <span className="text-primary-600">AI Interviews</span>
        </h2>
        
        <p className="text-neutral-500 max-w-2xl text-sm lg:text-base leading-relaxed">
          Master company-specific hiring blueprints, pattern-accurate screening mocks, and simulated AI recruiter interviews tailored to top campus tech employers.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* 1. INFOSYS - ACTIVE */}
        <Link 
          to="/company/infosys"
          className="group bg-white rounded-2xl shadow-sm border border-neutral-200/80 hover:shadow-xl hover:border-primary-300 transition-all duration-300 flex flex-col overflow-hidden h-full"
        >
          {/* Visual Header */}
          <div className="h-40 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent"></div>
            
            {/* Live Indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              ACTIVE DRIVE
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-bold text-blue-200 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
              3.6 LPA Ref.
            </div>

            {/* Visual Icon / Monogram */}
            <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-white text-blue-950 font-black text-2xl flex items-center justify-center shadow-xl">
                Infy
              </div>
              <span className="text-white/80 font-semibold text-xs mt-2 tracking-wide">Systems Engineer</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
              Infosys SE Preparation
            </h3>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
              54–60 Qs blueprint, 34 practice MCQs with step solutions, and webcam AI recruiter mock interview.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-primary-50 text-primary-700 border border-primary-100 font-bold">
                Pattern A & B
              </Badge>
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Video size={10} /> AI Interview
              </Badge>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">Start Prep</span>
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-600/30 group-hover:bg-primary-700 transition-colors shrink-0">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Link>

        {/* 2. TCS NQT - UPCOMING */}
        <div className="bg-neutral-50/70 rounded-2xl shadow-sm border border-neutral-200/80 flex flex-col overflow-hidden h-full opacity-90 hover:opacity-100 transition-opacity">
          <div className="h-40 bg-neutral-800 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold shadow-sm">
              <Clock size={10} /> UPCOMING
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-neutral-700 text-white font-black text-xl flex items-center justify-center border border-neutral-600">
                TCS
              </div>
              <span className="text-neutral-300 font-semibold text-xs mt-2">National Qualifier Test</span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-neutral-800 mb-1">TCS NQT Preparation</h3>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
              Numerical, Verbal & Reasoning cognitive modules with Ninja and Digital track coding challenges.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-200/60 text-neutral-600">
                Ninja & Digital
              </Badge>
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-200/60 text-neutral-600">
                Cognitive + Code
              </Badge>
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5 text-[11px]"><Lock size={12} /> In Progress</span>
              <span className="text-[10px] bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-bold">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* 3. CAPGEMINI - UPCOMING */}
        <div className="bg-neutral-50/70 rounded-2xl shadow-sm border border-neutral-200/80 flex flex-col overflow-hidden h-full opacity-90 hover:opacity-100 transition-opacity">
          <div className="h-40 bg-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold shadow-sm">
              <Clock size={10} /> UPCOMING
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-800 text-white font-black text-xl flex items-center justify-center border border-blue-700">
                CAP
              </div>
              <span className="text-blue-100 font-semibold text-xs mt-2">Excellence Assessment</span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-neutral-800 mb-1">Capgemini Excellence</h3>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
              Game-based aptitude, pseudocode tracing, English communication and technical interview rounds.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-200/60 text-neutral-600">
                Game Aptitude
              </Badge>
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-200/60 text-neutral-600">
                Pseudocode
              </Badge>
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5 text-[11px]"><Lock size={12} /> In Progress</span>
              <span className="text-[10px] bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-bold">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* 4. ACCENTURE - UPCOMING */}
        <div className="bg-neutral-50/70 rounded-2xl shadow-sm border border-neutral-200/80 flex flex-col overflow-hidden h-full opacity-90 hover:opacity-100 transition-opacity">
          <div className="h-40 bg-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold shadow-sm">
              <Clock size={10} /> UPCOMING
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-900 text-white font-black text-2xl flex items-center justify-center border border-purple-800">
                &gt;
              </div>
              <span className="text-purple-200 font-semibold text-xs mt-2">ASE / FSE Track</span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-neutral-800 mb-1">Accenture Assessment</h3>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
              Cognitive reasoning, technical assessment (Cloud, Security, MS Office) & coding problems.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-200/60 text-neutral-600">
                Cognitive
              </Badge>
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-200/60 text-neutral-600">
                Technical MCQ
              </Badge>
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5 text-[11px]"><Lock size={12} /> In Progress</span>
              <span className="text-[10px] bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-bold">Coming Soon</span>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
