import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { MapPin, Mail, MessageCircle, Code2, GraduationCap, Building2 } from 'lucide-react';
import { RatingBadge } from '../components/ui/RatingBadge';

const Footer = () => {
  return (
    <footer className="border-t border-indigo-100/80 bg-gradient-to-b from-white via-slate-50/60 to-indigo-50/30 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6">
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
              <Mail size={18} className="text-indigo-500 shrink-0 group-hover:text-indigo-600 transition-colors" />
              <span className="text-sm text-slate-600 font-medium group-hover:text-indigo-600 transition-colors">argaikwad24@gmail.com</span>
            </a>

            <a href="https://wa.me/917745877951" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group w-fit">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
                <MessageCircle size={12} className="text-emerald-700" />
              </div>
              <span className="text-sm text-slate-600 font-medium group-hover:text-emerald-700 transition-colors">WhatsApp Us</span>
            </a>
          </div>
        </div>

        {/* Developer Attribution Card */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/90 border border-indigo-100/90 shadow-xs hover:shadow-md transition-all duration-300 p-5 sm:p-6">
          {/* Subtle Decorative Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/25 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
            {/* Developer Info */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0 ring-4 ring-white/90">
                <Code2 size={24} className="stroke-[2.2]" />
              </div>

              <div className="flex flex-col items-center sm:items-start gap-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-bold tracking-wider text-indigo-700 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-200/60 uppercase">
                    Developer
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Developed by Abhijeet Ravindra Gaikwad
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-900 font-semibold text-xs sm:text-sm shadow-2xs">
                    <GraduationCap size={15} className="text-indigo-600 shrink-0" />
                    Department of Information Technology
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 border border-purple-200/80 text-purple-900 font-semibold text-xs sm:text-sm shadow-2xs">
                    <Building2 size={15} className="text-purple-600 shrink-0" />
                    Rajarambapu Institute of Technology
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions / Connect */}
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="mailto:argaikwad24@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-xs transition-all"
              >
                <Mail size={14} className="text-indigo-600" />
                <span>Contact Us</span>
              </a>
              <a
                href="https://wa.me/917745877951"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="font-medium text-slate-500">
            © {new Date().getFullYear()} AptiVerse. All rights reserved.
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-400">
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
