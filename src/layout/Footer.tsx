import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-bold text-lg tracking-tight text-neutral-900">AptiVerse</span>
          </Link>
          <p className="text-sm text-neutral-500">Practice smarter. Get placement ready.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-medium text-neutral-600">
          <Link to="/games" className="hover:text-primary-600 transition-colors">Games</Link>
          <Link to="/progress" className="hover:text-primary-600 transition-colors">Progress</Link>
          <Link to="/leaderboard" className="hover:text-primary-600 transition-colors">Leaderboard</Link>
          <Link to="/about" className="hover:text-primary-600 transition-colors">About</Link>
          <Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-primary-600 transition-colors">Terms</Link>
        </div>

        <div className="text-sm text-neutral-400">
          © {new Date().getFullYear()} AptiVerse.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
