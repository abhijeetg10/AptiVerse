import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';
import { Logo } from '../components/ui/Logo';
import { Bug } from 'lucide-react';
import ReportBugModal from '../components/ui/ReportBugModal';
import BetaNoticeModal from '../components/ui/BetaNoticeModal';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBugModalOpen, setIsBugModalOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'My Progress', path: '/progress' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="group cursor-pointer flex items-center gap-3">
            <Logo size={40} className="hover:opacity-90 transition-opacity" />
            <span className="hidden sm:flex items-center px-2.5 py-0.5 rounded-md bg-indigo-50/80 border border-indigo-100/50 text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest shadow-sm">
              Beta
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  isActive 
                    ? "text-primary-600" 
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-600 rounded-t-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 text-sm w-48">
            <Search size={16} />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="hidden sm:inline-block text-[10px] font-sans px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-neutral-400">⌘K</kbd>
          </div>
          
          <button 
            onClick={() => setIsBugModalOpen(true)}
            className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors relative"
            title="Report a Bug / Contact Us"
          >
            <Bug size={20} />
          </button>

          <div className="hidden sm:block h-8 w-px bg-neutral-200 mx-1"></div>

          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 p-1 pl-2 pr-1 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm font-medium shadow-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-sm font-medium text-neutral-700 hidden sm:block">
              {user?.name || 'Sign In'}
            </span>
            <ChevronDown size={16} className="text-neutral-400 hidden sm:block" />
          </button>

          <button 
            className="md:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  isActive 
                    ? "text-primary-600 bg-primary-50" 
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}

      <ReportBugModal 
        isOpen={isBugModalOpen}
        onClose={() => setIsBugModalOpen(false)}
        onSubmit={() => setIsBugModalOpen(false)}
      />
      
      <BetaNoticeModal onReportClick={() => setIsBugModalOpen(true)} />
    </nav>
  );
};

export default Navbar;
