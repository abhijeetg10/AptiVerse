import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Sparkles, ArrowRight, Clock, Lock
} from 'lucide-react';
import gecMysoreImg from '../../assets/gec-mysore.jpg';

export const CompanyCardsSection: React.FC = () => {
  return (
    <section className="pt-16 pb-20 max-w-7xl mx-auto px-6 font-sans">

      {/* Section Header */}
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

      {/* Cards Grid - Sized identical to Game Cards on Home Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {/* 1. INFOSYS - ACTIVE (Uses Mysore GEC Training Center Image) */}
        <Link
          to="/company/infosys"
          className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-[400px] flex flex-col justify-between p-5 border border-slate-700/30 hover:-translate-y-1.5"
        >
          {/* Mysore GEC Background Photo */}
          <img 
            src={gecMysoreImg} 
            alt="Infosys GEC Mysuru Campus" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.85]"
          />
          {/* Seamless Dark Gradient Overlay (from reference style) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-black/30 pointer-events-none" />

          {/* Top Bar Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/90 backdrop-blur-md text-white flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              ACTIVE DRIVE
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 shadow-sm font-mono">
              3.6 LPA
            </span>
          </div>

          {/* Bottom Content Area */}
          <div className="relative z-10 mt-auto">
            <h3 className="text-xl font-black text-white tracking-tight leading-snug drop-shadow-md mb-0.5 group-hover:text-primary-300 transition-colors">
              Infosys Limited
            </h3>
            <div className="text-xs text-primary-300 font-semibold mb-2">
              Systems Engineer Trainee • GEC Mysuru
            </div>
            <p className="text-xs text-slate-200/90 leading-relaxed mb-3 line-clamp-2">
              Official pattern screening tests with 5 timed sections and webcam AI Technical & HR interview panels.
            </p>

            {/* Translucent Tags Strip (from reference image) */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/15 flex items-center gap-1">
                <Sparkles size={10} className="text-amber-300" /> 4 Mock Packs
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/15">
                3-Round Pipeline
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/15">
                AI Recruiter
              </span>
            </div>

            {/* Bottom Button ('Reserve now' pill style from reference image) */}
            <div className="w-full py-3 rounded-full bg-white text-slate-900 font-black text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group-hover:shadow-white/20 active:scale-[0.98]">
              Prepare Now <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        {/* 2. TCS NQT - UPCOMING */}
        <div className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-[400px] flex flex-col justify-between p-5 border border-slate-700/30">
          {/* Corporate Campus Photo */}
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" 
            alt="TCS Campus" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-black/30 pointer-events-none" />

          {/* Top Bar Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm">
              <Clock size={11} className="text-amber-400" />
              UPCOMING
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 shadow-sm font-mono">
              3.36 - 7 LPA
            </span>
          </div>

          {/* Bottom Content Area */}
          <div className="relative z-10 mt-auto">
            <h3 className="text-xl font-black text-white tracking-tight leading-snug drop-shadow-md mb-0.5">
              TCS NQT 2026
            </h3>
            <div className="text-xs text-amber-300 font-semibold mb-2">
              Ninja & Digital Track • TCS BPS
            </div>
            <p className="text-xs text-slate-200/90 leading-relaxed mb-3 line-clamp-2">
              Cognitive aptitude (Numerical, Verbal, Reasoning) and advanced coding challenges.
            </p>

            {/* Translucent Tags Strip */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/15">
                Ninja & Digital
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/15">
                Cognitive + Code
              </span>
            </div>

            {/* Bottom Button */}
            <div className="w-full py-3 rounded-full bg-white/15 backdrop-blur-md text-slate-300 font-bold text-xs uppercase tracking-wider border border-white/20 flex items-center justify-center gap-2 cursor-not-allowed">
              <Lock size={12} className="text-slate-300" /> In Progress • Coming Soon
            </div>
          </div>
        </div>

        {/* 3. CAPGEMINI - UPCOMING */}
        <div className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-[400px] flex flex-col justify-between p-5 border border-slate-700/30">
          {/* Corporate Campus Photo */}
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" 
            alt="Capgemini Campus" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-black/30 pointer-events-none" />

          {/* Top Bar Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm">
              <Clock size={11} className="text-amber-400" />
              UPCOMING
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 shadow-sm font-mono">
              4.25 LPA
            </span>
          </div>

          {/* Bottom Content Area */}
          <div className="relative z-10 mt-auto">
            <h3 className="text-xl font-black text-white tracking-tight leading-snug drop-shadow-md mb-0.5">
              Capgemini Excellence
            </h3>
            <div className="text-xs text-blue-300 font-semibold mb-2">
              Analyst & Senior Analyst Track
            </div>
            <p className="text-xs text-slate-200/90 leading-relaxed mb-3 line-clamp-2">
              Game-based aptitude, pseudocode algorithms, English communication, and technical interview panels.
            </p>

            {/* Translucent Tags Strip */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/15">
                Game Aptitude
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/15">
                Pseudocode
              </span>
            </div>

            {/* Bottom Button */}
            <div className="w-full py-3 rounded-full bg-white/15 backdrop-blur-md text-slate-300 font-bold text-xs uppercase tracking-wider border border-white/20 flex items-center justify-center gap-2 cursor-not-allowed">
              <Lock size={12} className="text-slate-300" /> In Progress • Coming Soon
            </div>
          </div>
        </div>

        {/* 4. ACCENTURE - UPCOMING */}
        <div className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-[400px] flex flex-col justify-between p-5 border border-slate-700/30">
          {/* Corporate Campus Photo */}
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop" 
            alt="Accenture Campus" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-black/30 pointer-events-none" />

          {/* Top Bar Badges */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm">
              <Clock size={11} className="text-amber-400" />
              UPCOMING
            </span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 shadow-sm font-mono">
              4.5 - 6.5 LPA
            </span>
          </div>

          {/* Bottom Content Area */}
          <div className="relative z-10 mt-auto">
            <h3 className="text-xl font-black text-white tracking-tight leading-snug drop-shadow-md mb-0.5">
              Accenture ASE Drive
            </h3>
            <div className="text-xs text-purple-300 font-semibold mb-2">
              Associate Software Engineer Track
            </div>
            <p className="text-xs text-slate-200/90 leading-relaxed mb-3 line-clamp-2">
              Cognitive assessment, technical MCQ (Cloud, Security, Networking), and communication rounds.
            </p>

            {/* Translucent Tags Strip */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/15">
                Cognitive + MCQ
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white border border-white/15">
                Cloud & Security
              </span>
            </div>

            {/* Bottom Button */}
            <div className="w-full py-3 rounded-full bg-white/15 backdrop-blur-md text-slate-300 font-bold text-xs uppercase tracking-wider border border-white/20 flex items-center justify-center gap-2 cursor-not-allowed">
              <Lock size={12} className="text-slate-300" /> In Progress • Coming Soon
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
