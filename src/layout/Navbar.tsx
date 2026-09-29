import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'My Progress', path: '/progress' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:shadow-md transition-shadow">
              A
            </div>
            <span className="font-bold text-xl tracking-tight text-neutral-900">AptiVerse</span>
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
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 text-sm w-48">
            <Search size={16} />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="hidden sm:inline-block text-[10px] font-sans px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-neutral-400">⌘K</kbd>
          </div>
          
          <button className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
            <Sun size={20} />
          </button>
          
          <button className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-neutral-200 mx-1"></div>

          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 p-1 pl-2 pr-1 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-accent-500 text-white flex items-center justify-center text-sm font-medium shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-sm font-medium text-neutral-700 hidden sm:block">
              {user?.name || 'Sign In'}
            </span>
            <ChevronDown size={16} className="text-neutral-400" />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
