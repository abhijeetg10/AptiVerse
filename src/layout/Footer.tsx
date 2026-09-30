import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { MapPin, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-indigo-100 bg-gradient-to-b from-white to-slate-50 pt-16 pb-8">
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

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-slate-400">
            © {new Date().getFullYear()} AptiVerse. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
