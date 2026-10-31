import React from 'react';
import {
  Building2, Sparkles, Clock, Lock, MapPin
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import gecMysoreImg from '../../assets/gec-mysore.jpg';

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

      {/* Cards Grid - Exact same structure, size, and layout as Game Cards on Home Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {/* 1. INFOSYS - LOCKED / LAUNCHING 5TH SEPT */}
        <div className="group bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
          {/* Visual Header matching GameCard h-40 */}
          <div className="h-40 flex items-center justify-center relative overflow-hidden bg-slate-900">
            {/* Mysore Training Center Photo */}
            <img 
              src={gecMysoreImg} 
              alt="Infosys GEC Mysuru Campus" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Launching 5th Sept Indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm">
              <Clock size={11} className="text-white" />
              LAUNCHING 5TH SEPT
            </div>

            {/* Package Tag */}
            <div className="absolute top-3 right-3 text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/20 font-mono shadow-sm">
              3.6 LPA
            </div>

            {/* Training Center Caption */}
            <div className="absolute bottom-2.5 left-3 text-white text-xs font-bold drop-shadow flex items-center gap-1.5">
              <MapPin size={12} className="text-amber-400" />
              <span>GEC Mysuru Campus</span>
            </div>
          </div>

          {/* White Card Body matching GameCard */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-neutral-900 mb-0.5 group-hover:text-amber-600 transition-colors">
              Infosys Systems Engineer
            </h3>
            <span className="text-[11px] font-semibold text-amber-600 block mb-2">
              On-Campus & Off-Campus 2025–2026
            </span>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
              Official pattern 54 questions screening test across 5 timed sections, followed by live camera AI Technical and HR interview panels.
            </p>

            {/* Badges Strip */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 font-bold bg-amber-50 text-amber-700 border border-amber-200">
                54 Qs • 100m
              </Badge>
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500" /> 4 Mock Packs + AI
              </Badge>
            </div>

            {/* Bottom Action Row - Locked, Zero Links */}
            <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-neutral-400">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                <Lock size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. TCS NQT - UPCOMING */}
        <div className="group bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
          {/* Visual Header matching GameCard h-40 */}
          <div className="h-40 flex items-center justify-center relative overflow-hidden bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" 
              alt="TCS Campus" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold shadow-sm">
              <Clock size={10} /> UPCOMING
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/20 font-mono shadow-sm">
              3.36 - 7 LPA
            </div>

            <div className="absolute bottom-2.5 left-3 text-white text-xs font-bold drop-shadow">
              Tata Consultancy Services
            </div>
          </div>

          {/* White Card Body matching GameCard */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-neutral-900 mb-0.5">
              TCS NQT Preparation
            </h3>
            <span className="text-[11px] font-semibold text-neutral-400 block mb-2">
              Ninja & Digital Track • TCS BPS
            </span>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
              Numerical, Verbal & Reasoning cognitive modules with Ninja and Digital track coding challenges and interview rubrics.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600">
                Ninja & Digital
              </Badge>
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600">
                Cognitive + Code
              </Badge>
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-neutral-400">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                <Lock size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. CAPGEMINI - UPCOMING */}
        <div className="group bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
          {/* Visual Header matching GameCard h-40 */}
          <div className="h-40 flex items-center justify-center relative overflow-hidden bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" 
              alt="Capgemini Campus" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold shadow-sm">
              <Clock size={10} /> UPCOMING
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/20 font-mono shadow-sm">
              4.25 LPA
            </div>

            <div className="absolute bottom-2.5 left-3 text-white text-xs font-bold drop-shadow">
              Capgemini India
            </div>
          </div>

          {/* White Card Body matching GameCard */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-neutral-900 mb-0.5">
              Capgemini Excellence
            </h3>
            <span className="text-[11px] font-semibold text-neutral-400 block mb-2">
              Analyst & Senior Analyst Track
            </span>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
              Game-based aptitude, pseudocode tracing, English communication and technical interview simulation.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600">
                Game Aptitude
              </Badge>
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600">
                Pseudocode
              </Badge>
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-neutral-400">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                <Lock size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* 4. ACCENTURE - UPCOMING */}
        <div className="group bg-white rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
          {/* Visual Header matching GameCard h-40 */}
          <div className="h-40 flex items-center justify-center relative overflow-hidden bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop" 
              alt="Accenture Campus" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[10px] font-bold shadow-sm">
              <Clock size={10} /> UPCOMING
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/20 font-mono shadow-sm">
              4.5 - 6.5 LPA
            </div>

            <div className="absolute bottom-2.5 left-3 text-white text-xs font-bold drop-shadow">
              Accenture Technology
            </div>
          </div>

          {/* White Card Body matching GameCard */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-neutral-900 mb-0.5">
              Accenture Assessment
            </h3>
            <span className="text-[11px] font-semibold text-neutral-400 block mb-2">
              Associate Software Engineer (ASE)
            </span>
            <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
              Cognitive reasoning, technical MCQ (Cloud, Network, Security), and communication round practice.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600">
                Cognitive + MCQ
              </Badge>
              <Badge variant="neutral" className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600">
                Cloud & Security
              </Badge>
            </div>

            <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-neutral-400">
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center shrink-0">
                <Lock size={13} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};