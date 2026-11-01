import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { MapPin, Mail, Code2, GraduationCap, Building2, Sparkles } from 'lucide-react';
import { RatingBadge } from '../components/ui/RatingBadge';

const Footer = () => {
  return (
    <footer className="mt-20 sm:mt-24 border-t border-indigo-100/80 bg-gradient-to-b from-white via-slate-50/60 to-indigo-50/30 pb-12 relative">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Developer Attribution Card - Compact, Professional & Refined */}
        <div className="-mt-8 sm:-mt-10 mb-10 relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md border border-indigo-100 shadow-lg shadow-indigo-500/5 hover:border-indigo-200 transition-all duration-300 p-4 sm:p-5 sm:px-6 z-20">
          {/* Subtle Decorative Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/25 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
            {/* Developer Info Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              {/* Compact Avatar Badge */}
              <div className="relative group shrink-0">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 ring-2 ring-white">
                  <Code2 size={24} className="stroke-[2.2] text-indigo-100 group-hover:scale-105 transition-transform duration-200" />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" title="Active Developer">
                    <Sparkles size={8} className="text-white fill-white" />
                  </span>
                </div>
              </div>

              {/* Text & Institutional Details */}
              <div className="flex flex-col items-center sm:items-start gap-1.5">
                {/* Developer Role Pill & Name */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-[10px] font-black uppercase tracking-wider">
                    <Sparkles size={10} className="text-indigo-600 fill-indigo-400" />
                    Developer
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                    Developed by <span className="bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">Abhijeet Ravindra Gaikwad</span>
                  </h3>
                </div>

                {/* Structured Institutional Highlights - Compact & Professional */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                  {/* Department Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-xs">
                    <GraduationCap size={13} className="text-indigo-600" />
                    <span>Department of Information Technology</span>
                  </div>

                  {/* College & Location Badge */}
                  <div className="inline-flex flex-wrap items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-xs">
                    <Building2 size={13} className="text-purple-600" />
                    <span>Rajarambapu Institute of Technology</span>
                    <span className="text-slate-300 font-normal hidden sm:inline">•</span>
                    <div className="inline-flex items-center gap-1 text-slate-500 text-[11px] font-medium">
                      <MapPin size={11} className="text-rose-500 shrink-0" />
                      <span>Sangli, Maharashtra, India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Connect Actions - Sleek Button */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="mailto:argaikwad24@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm hover:shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Mail size={13} />
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
            <Link to="/games" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors w-fit font-medium">Practice</Link>
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
