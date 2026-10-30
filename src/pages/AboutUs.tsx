import React from 'react';
import { 
  Target, Users, Sparkles, GraduationCap, Building2, MapPin, 
  Mail, Award, CheckCircle2, ArrowRight, Brain, Gamepad2, Shield, Heart, Code2, Globe 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white font-sans pb-24 relative overflow-hidden">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-50/60 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute top-[40%] left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/3"></div>

      {/* Hero Section */}
      <section className="pt-12 pb-16 lg:pt-16 lg:pb-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto relative">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles size={14} className="text-primary-600" />
            Our Mission & Story
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.15] mb-6">
            Empowering Students to <br />
            <span className="text-primary-600">Think Faster & Get Hired.</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mb-8">
            AptiVerse is an interactive, gamified cognitive training platform engineered to bridge the gap between traditional classroom preparation and modern tech hiring assessments.
          </p>

          {/* Hand-drawn annotation */}
          <div className="hidden sm:flex items-center gap-2 text-primary-500 font-caveat text-lg -mt-2 mb-6 rotate-[-2deg]">
            <span>Cognitive puzzles</span>
            <span>•</span>
            <span>Real company blueprints</span>
            <span>•</span>
            <span>100% Free for students</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/games"
              className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-primary-600/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <Gamepad2 size={18} /> Explore Games
            </Link>
            <a 
              href="#team"
              className="px-8 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm rounded-2xl transition-colors"
            >
              Meet the Team
            </a>
          </div>

        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-neutral-100 bg-neutral-50/50 py-10 mb-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-600">7+</div>
            <div className="text-xs sm:text-sm font-semibold text-neutral-800 mt-1">Cognitive Games</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Spatial, Logic, Memory & Speed</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-600">700+</div>
            <div className="text-xs sm:text-sm font-semibold text-neutral-800 mt-1">Active Campus Players</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Practicing across engineering colleges</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-600">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-neutral-800 mt-1">Free & Accessible</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">No paywalls or premium locks</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary-600">Enterprise</div>
            <div className="text-xs sm:text-sm font-semibold text-neutral-800 mt-1">Placement Focused</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Infosys, TCS, Capgemini & more</div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 space-y-16">

        {/* The Shift in Recruitment (Problem vs Solution) */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">The Recruitment Evolution</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Why Traditional Aptitude Books Are No Longer Enough
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* The Old Way */}
            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200/80">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm mb-4">
                ✕
              </div>
              <h4 className="text-lg font-bold text-neutral-900 mb-2">The Traditional Problem</h4>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                For years, campus preparation meant memorizing rote math shortcuts from thick textbooks. However, top IT and product companies discovered that formulas alone do not measure how well an engineer reacts under real-time constraints.
              </p>
              <ul className="space-y-2 text-xs text-neutral-500">
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Rote formula memorization with zero interactive feedback
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  No simulation of mental endurance or spatial reasoning
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Disconnected from modern game-based screening rounds
                </li>
              </ul>
            </div>

            {/* The AptiVerse Solution */}
            <div className="bg-primary-50/50 rounded-3xl p-8 border border-primary-200/80 relative shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-sm mb-4 shadow-md shadow-primary-600/30">
                ✓
              </div>
              <h4 className="text-lg font-bold text-neutral-900 mb-2">The AptiVerse Breakthrough</h4>
              <p className="text-sm text-neutral-700 leading-relaxed mb-4">
                We transform cognitive skills training into fast, interactive micro-challenges: grid memory, visual shape sudoku, motion puzzle pathfinding, and multi-tab data verification.
              </p>
              <ul className="space-y-2 text-xs text-neutral-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary-600 shrink-0" />
                  Real-time cognitive conditioning under competitive timers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary-600 shrink-0" />
                  Targeted company hiring tests (Infosys, TCS NQT, Capgemini)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary-600 shrink-0" />
                  AI Recruiter mock interviews with live webcam simulation
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Core Pillars */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">Our Architecture</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Three Pillars of Placement Excellence
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
                <Brain size={24} />
              </div>
              <h4 className="font-bold text-neutral-900 text-base mb-2">1. Cognitive Games</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Train executive cognitive functions: working memory, spatial orientation, inductive pattern inference, and verbal logic.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                <Building2 size={24} />
              </div>
              <h4 className="font-bold text-neutral-900 text-base mb-2">2. Company Hubs</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Dedicated recruitment guides, exact exam blueprints (Format A & B), topic syllabus, and 34+ question practice mocks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <Users size={24} />
              </div>
              <h4 className="font-bold text-neutral-900 text-base mb-2">3. AI Mock Interviews</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Live webcam feed simulation with AI recruiter voice narration, timing constraints, and verified technical/HR question rubrics.
              </p>
            </div>
          </div>
        </section>

        {/* Platform Creator & Institutional Roots */}
        <section id="team" className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-primary-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Code2 size={16} /> Engineering & Governance
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-6 tracking-tight">
            Designed & Engineered for Engineers
          </h2>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-200/70">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-700 text-white font-extrabold text-3xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-600/30">
              AG
            </div>
            
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-extrabold text-neutral-900">Abhijeet Ravindra Gaikwad</h3>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    Creator & Lead Full-Stack Architect • Department of Information Technology
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-100 text-primary-800">
                  RIT Alum / Scholar
                </span>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-1">
                Engineered with modern cloud standards: React 19, TypeScript, Supabase PostgreSQL, Cloudflare Edge Security, and Tailwind CSS. Built to empower peers across campus placements with authentic, zero-paywall cognitive training.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-neutral-600 border-t border-neutral-200/70">
                <span className="flex items-center gap-1.5 font-semibold text-neutral-800">
                  <Building2 size={14} className="text-primary-600" /> Rajarambapu Institute of Technology
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-rose-500" /> Sangli, Maharashtra, India
                </span>
                <a 
                  href="mailto:argaikwad24@gmail.com"
                  className="flex items-center gap-1.5 text-primary-600 font-bold hover:underline"
                >
                  <Mail size={14} /> argaikwad24@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Campus & Placement Cell Callout */}
        <section className="bg-gradient-to-r from-neutral-900 via-primary-950 to-neutral-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
          <div className="max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500/20 text-primary-300 border border-primary-500/30 uppercase tracking-wider">
              College & Training Collaboration
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mt-3 mb-2 tracking-tight">
              Looking to deploy AptiVerse for your college campus?
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              We collaborate freely with college Training & Placement Cells (T&P) and student coding clubs to host campus-wide cognitive aptitude challenges and track batch analytics.
            </p>
          </div>

          <a
            href="mailto:argaikwad24@gmail.com?subject=AptiVerse%20Campus%20Inquiry"
            className="px-8 py-4 bg-white text-neutral-950 font-bold rounded-2xl text-sm shadow hover:bg-neutral-100 transition-all shrink-0 flex items-center gap-2 active:scale-95"
          >
            <Mail size={16} /> Partner with AptiVerse
          </a>
        </section>

      </div>

    </div>
  );
};

export default AboutUs;
