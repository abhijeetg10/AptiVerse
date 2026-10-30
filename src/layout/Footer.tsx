import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { MapPin, Mail, Code2, GraduationCap, Building2, Sparkles } from 'lucide-react';
import { RatingBadge } from '../components/ui/RatingBadge';

const Footer = () => {
  return (
    <footer className="mt-20 sm:mt-24 border-t border-indigo-100/80 bg-gradient-to-b from-white via-slate-50/60 to-indigo-50/30 pb-12 relative">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Developer Attribution Card - Elevated showcase card */}
        <div className="-mt-14 sm:-mt-16 mb-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/90 to-indigo-50/40 backdrop-blur-xl border border-indigo-200/70 shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 p-6 sm:p-9 z-20 ring-1 ring-white/80">
          {/* Subtle Decorative Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-300/20 via-purple-300/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-300/15 via-indigo-200/15 to-transparent rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
          <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8 text-center xl:text-left">
            {/* Developer Info Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
              {/* Premium Avatar Badge */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 ring-4 ring-white">
                  <Code2 size={40} className="stroke-[2.2] text-indigo-100 group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" title="Active Developer">
                    <Sparkles size={12} className="text-white fill-white" />
                  </span>
                </div>
              </div>

              {/* Text & Institutional Details */}
              <div className="flex flex-col items-center sm:items-start gap-2.5 max-w-3xl">
                {/* Developer Role Pill & Name */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 text-indigo-700 text-[11px] font-black uppercase tracking-wider shadow-2xs">
                    <Sparkles size={12} className="text-indigo-600 fill-indigo-400" />
                    Developer
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Developed by <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 bg-clip-text text-transparent">Abhijeet Ravindra Gaikwad</span>
                  </h3>
                </div>

                {/* Structured Institutional Highlights */}
                <div className="flex flex-col sm:flex-row flex-wrap items-center sm:items-start gap-2.5 mt-1.5 w-full">
                  {/* Department Badge */}
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/90 border border-indigo-100/90 shadow-sm text-slate-800 font-extrabold text-sm sm:text-base hover:border-indigo-300 hover:bg-indigo-50/50 transition-all">
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <GraduationCap size={18} className="stroke-[2.4]" />
                    </div>
                    <span>Department of Information Technology</span>
                  </div>

                  {/* College & Location Badge */}
                  <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2 px-4 py-2 rounded-xl bg-white/90 border border-purple-100/90 shadow-sm text-slate-800 font-extrabold text-sm sm:text-base hover:border-purple-300 hover:bg-purple-50/50 transition-all">
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                      <Building2 size={18} className="stroke-[2.4]" />
                    </div>
                    <span>Rajarambapu Institute of Technology</span>
                    <span className="text-slate-300 font-normal hidden sm:inline">•</span>
                    <div className="inline-flex items-center gap-1 text-slate-600 text-xs sm:text-sm font-semibold">
                      <MapPin size={14} className="text-rose-500 shrink-0" />
                      <span>Sangli, Maharashtra, India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Connect Actions - Professional Email */}
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="mailto:argaikwad24@gmail.com"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold shadow-md shadow-slate-900/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Mail size={16} />
                <span>Email Developer</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <Link to="/" className="inline-block w-fit">
              <Logo size={36} className="hover:opacity-90 transition-opacity drop-shadow-sm" />
            </Link>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mt-2">
              Elevate your placement preparation with Gamified Aptitude Practice. Practice smarter, solve faster, and get placement ready.
            </p>
            <div className="mt-1 w-fit">
              <RatingBadge variant="pill" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-slate-900 mb-2 tracking-tight">Platform</h3>
            <Link to="/about" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors w-fit font-medium">About Us</Link>
            <Link to="/games" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors w-fit font-medium">Games</Link>
            <Link to="/progress" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors w-fit font-medium">Progress Tracking</Link>
            <Link to="/leaderboard" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors w-fit font-medium">Leaderboard</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-slate-900 mb-1 tracking-tight">Contact Us</h3>
            
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-indigo-500 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-600 font-medium leading-relaxed">
                Headquarters<br/>
                <span className="text-slate-500 font-normal">Pune, Maharashtra, India</span>
              </span>
            </div>

            <a href="mailto:argaikwad24@gmail.com" className="flex items-center gap-3 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-100/80 group-hover:border-indigo-200 transition-colors">
                <Mail size={16} className="text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Official Support</span>
                <span className="text-sm text-slate-700 font-bold group-hover:text-indigo-600 transition-colors">argaikwad24@gmail.com</span>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="font-medium text-slate-500">
            © {new Date().getFullYear()} AptiVerse. All rights reserved.
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-400">
            <Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
