import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy, ArrowRight, Lock, Sparkles, Layers, Share2
} from 'lucide-react';
import { 
  InfosysBrandLogo, 
  TcsNqtBrandLogo, 
  CognizantBrandLogo, 
  CapgeminiBrandLogo, 
  AccentureBrandLogo, 
  WiproBrandLogo 
} from './CompanyLogos';
import { ShareInfosysModal } from './ShareInfosysModal';

interface CompanyTrack {
  id: string;
  name: string;
  brandCategory: 'all' | 'infosys' | 'tcs' | 'cognizant' | 'capgemini' | 'others';
  logoComponent: React.ReactNode;
  bgGradient: string;
  badgeStatus: 'active' | 'upcoming';
  packageText: string;
  title: string;
  subtitle: string;
  desc: string;
  difficulty: 'Easy-Medium' | 'Medium' | 'Medium-Hard' | 'Hard';
  domainTag: string;
  linkTo?: string;
}

const COMPANY_TRACKS: CompanyTrack[] = [
  {
    id: 'infosys',
    name: 'Infosys',
    brandCategory: 'infosys',
    logoComponent: <InfosysBrandLogo className="h-10" />,
    bgGradient: 'from-slate-50/80 via-white to-white',
    badgeStatus: 'active',
    packageText: '3.6 - 9.5 LPA',
    title: 'Infosys Mock Test & AI Interview',
    subtitle: 'PYQ Practice & Screening Tests',
    desc: 'Authentic 54-question practice tests, Infosys PYQs, sectional cutoff analysis, and real-time AI mock interview room.',
    difficulty: 'Easy-Medium',
    domainTag: 'Aptitude + Technical',
    linkTo: '/company/infosys'
  },
  {
    id: 'tcs',
    name: 'TCS NQT',
    brandCategory: 'tcs',
    logoComponent: <TcsNqtBrandLogo className="h-11" />,
    bgGradient: 'from-slate-50/80 via-white to-white',
    badgeStatus: 'upcoming',
    packageText: '3.36 - 7 LPA',
    title: 'TCS NQT Prep Series',
    subtitle: 'Ninja & Digital Track',
    desc: 'Full mock simulation of National Qualifier Test including cognitive, verbal & programming.',
    difficulty: 'Medium',
    domainTag: 'Full Mock Test'
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    brandCategory: 'cognizant',
    logoComponent: <CognizantBrandLogo className="h-8" />,
    bgGradient: 'from-slate-50/80 via-white to-white',
    badgeStatus: 'upcoming',
    packageText: '4 - 6.75 LPA',
    title: 'Cognizant GenC & Elevate',
    subtitle: 'GenC, GenC Next & Elevate',
    desc: 'Practise AMCAT-pattern aptitude, Automata coding and technical MCQ rounds.',
    difficulty: 'Medium-Hard',
    domainTag: 'Aptitude + Coding'
  },
  {
    id: 'capgemini',
    name: 'Capgemini',
    brandCategory: 'capgemini',
    logoComponent: <CapgeminiBrandLogo className="h-9" />,
    bgGradient: 'from-slate-50/80 via-white to-white',
    badgeStatus: 'upcoming',
    packageText: '4.25 LPA',
    title: 'Capgemini Exceller Test',
    subtitle: 'Analyst & Senior Analyst',
    desc: 'Covers game-based aptitude, behavioral profiling, and pseudocode challenges.',
    difficulty: 'Medium',
    domainTag: 'Game Aptitude + Pseudocode'
  },
  {
    id: 'accenture',
    name: 'Accenture',
    brandCategory: 'others',
    logoComponent: <AccentureBrandLogo className="h-8" />,
    bgGradient: 'from-slate-50/80 via-white to-white',
    badgeStatus: 'upcoming',
    packageText: '4.5 - 6.5 LPA',
    title: 'Accenture Assessment Series',
    subtitle: 'Associate Software Engineer',
    desc: 'Cognitive reasoning, technical MCQ (Cloud & Network), and coding assessment modules.',
    difficulty: 'Medium-Hard',
    domainTag: 'Cognitive + Technical'
  },
  {
    id: 'wipro',
    name: 'Wipro',
    brandCategory: 'others',
    logoComponent: <WiproBrandLogo className="h-11" />,
    bgGradient: 'from-slate-50/80 via-white to-white',
    badgeStatus: 'upcoming',
    packageText: '3.5 - 6.5 LPA',
    title: 'Wipro Elite NLTH Track',
    subtitle: 'Project Engineer Drive',
    desc: 'Quantitative aptitude, written communication test (WCT), and programming simulator.',
    difficulty: 'Medium',
    domainTag: 'Aptitude + WCT'
  }
];

export const CompanyCardsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'difficulty'>('popularity');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareInfosysOpen, setIsShareInfosysOpen] = useState(false);

  const filteredTracks = useMemo(() => {
    let list = COMPANY_TRACKS;
    if (activeCategory !== 'all') {
      list = list.filter(t => t.brandCategory === activeCategory);
    }
    if (sortBy === 'difficulty') {
      return [...list].sort((a, b) => a.difficulty.localeCompare(b.difficulty));
    }
    return list;
  }, [activeCategory, sortBy]);

  const showUpcomingNotice = (companyName: string) => {
    setToastMessage(`${companyName} mock test drives are launching soon! Stay tuned.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <section className="pt-16 pb-20 max-w-7xl mx-auto px-6 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-neutral-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles size={14} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Section matching user reference */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary-600 font-extrabold text-xs tracking-wider uppercase mb-2">
            <span className="w-5 h-5 rounded-md bg-primary-100 flex items-center justify-center text-primary-700">
              <Layers size={12} />
            </span>
            <span>CHOOSE A COMPANY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight mb-2">
            Recruitment <span className="text-primary-600">Practice</span>
          </h2>

          <p className="text-neutral-500 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Practice actual company-wise recruiting rounds. Access mock tests for aptitude, technical, coding, and game-based assessment Rounds.
          </p>
        </div>

        {/* Right Target Companies Pill Card */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 sm:px-5 sm:py-3.5 flex items-center gap-3.5 shadow-xs shrink-0 self-start lg:self-auto">
          <div className="w-11 h-11 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shadow-md shadow-slate-950/20 shrink-0">
            <Trophy size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-neutral-900 leading-tight">
              7 Target Companies
            </div>
            <div className="text-[11px] text-neutral-500 max-w-[210px] leading-snug mt-0.5">
              Prepare with actual exam patterns and latest previous year questions.
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-100">
        
        {/* Company Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
            }`}
          >
            <span>All Companies</span>
          </button>

          <button
            onClick={() => setActiveCategory('infosys')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'infosys'
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Infosys</span>
          </button>

          <button
            onClick={() => setActiveCategory('tcs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'tcs'
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>TCS NQT</span>
          </button>

          <button
            onClick={() => setActiveCategory('cognizant')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'cognizant'
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-600" />
            <span>Cognizant</span>
          </button>

          <button
            onClick={() => setActiveCategory('capgemini')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'capgemini'
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            <span>Capgemini</span>
          </button>

          <button
            onClick={() => setActiveCategory('others')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'others'
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                : 'bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Others</span>
          </button>
        </div>

        {/* Sort Filter */}
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span className="text-neutral-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 shadow-xs focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            <option value="popularity">Popularity</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>
      </div>

      {/* Modern Minimal Company Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTracks.map((track) => {
          const isInfosys = track.id === 'infosys';

          const CardInner = (
            <div className="group bg-white rounded-2xl shadow-sm border border-neutral-200/80 hover:shadow-xl hover:border-primary-300 transition-all duration-300 flex flex-col overflow-hidden h-full">
              
              {/* Minimalist Logo Header Container */}
              <div className={`h-40 flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-b ${track.bgGradient} border-b border-neutral-100`}>
                
                {/* Center Corporate Brand Logo */}
                <div className="transform group-hover:scale-108 transition-transform duration-300 relative z-10">
                  {track.logoComponent}
                </div>

                {/* Status Badge Overlays */}
                <div className="absolute top-3 left-3 z-20">
                  {track.badgeStatus === 'active' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      ACTIVE DRIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-sm">
                      <Lock size={10} /> UPCOMING
                    </span>
                  )}
                </div>

                {/* Package Tag */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="text-[10px] font-mono font-bold text-neutral-700 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-neutral-200 shadow-xs">
                    {track.packageText}
                  </span>
                </div>
              </div>

              {/* Clean Content Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-neutral-900 text-base mb-1 group-hover:text-primary-600 transition-colors">
                  {track.title}
                </h3>

                <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
                  {track.desc}
                </p>

                {/* Badges Strip */}
                <div className="flex items-center gap-2 mb-4 mt-auto">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold ${
                    track.difficulty === 'Easy-Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : track.difficulty === 'Medium'
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {track.difficulty}
                  </span>

                  <span className="text-[10px] px-2.5 py-0.5 rounded-md font-semibold bg-primary-50 text-primary-700 border border-primary-100 flex items-center gap-1">
                    {track.domainTag}
                  </span>
                </div>

                {/* Bottom Practice Action Button */}
                <div className="pt-4 border-t border-neutral-100 mt-auto flex items-center gap-2">
                  <div className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-xs ${
                    isInfosys
                      ? 'bg-primary-600 text-white group-hover:bg-primary-700 shadow-primary-600/20 group-hover:shadow-md'
                      : 'bg-slate-900 text-white group-hover:bg-primary-600 group-hover:shadow-md'
                  }`}>
                    <span>Practice Now</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  {isInfosys && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsShareInfosysOpen(true);
                      }}
                      className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
                      title="Share Infosys Placement Test"
                    >
                      <Share2 size={14} className="text-blue-600" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          );

          if (isInfosys && track.linkTo) {
            return (
              <Link key={track.id} to={track.linkTo} className="block h-full">
                {CardInner}
              </Link>
            );
          }

          return (
            <div 
              key={track.id} 
              onClick={() => showUpcomingNotice(track.name)}
              className="cursor-pointer h-full"
            >
              {CardInner}
            </div>
          );
        })}
      </div>

      <ShareInfosysModal 
        isOpen={isShareInfosysOpen} 
        onClose={() => setIsShareInfosysOpen(false)} 
      />

    </section>
  );
};
