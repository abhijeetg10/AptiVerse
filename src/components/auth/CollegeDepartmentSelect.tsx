import React, { useState, useMemo, useRef, useEffect } from 'react';
import { School, GraduationCap, Search, Check, ChevronDown, AlertCircle } from 'lucide-react';
import { POPULAR_COLLEGES, DEPARTMENTS, isValidCollegeName } from '../../constants/institutions';
import { supabase } from '../../lib/supabase';

interface CollegeDepartmentSelectProps {
  college: string;
  setCollege: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  errorMsg?: string;
  setErrorMsg?: (val: string) => void;
}

export const CollegeDepartmentSelect: React.FC<CollegeDepartmentSelectProps> = ({
  college,
  setCollege,
  department,
  setDepartment,
  setErrorMsg,
}) => {
  const [collegesList, setCollegesList] = useState<string[]>(Array.from(POPULAR_COLLEGES));
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [customCollege, setCustomCollege] = useState('');
  const [customError, setCustomError] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch unique colleges from profiles to enrich the list with existing verified colleges
  useEffect(() => {
    const fetchColleges = async () => {
      const { data } = await supabase.from('profiles').select('college');
      if (data) {
        const existing = data
          .map((d: any) => d.college?.trim())
          .filter((c: any) => c && c !== '-' && c.length >= 6 && !['abc', 'xyz', '...', 'test'].includes(c.toLowerCase()));
        
        const merged = Array.from(new Set([...POPULAR_COLLEGES, ...existing])).sort();
        setCollegesList(merged);
      }
    };
    fetchColleges();
  }, []);

  // Initialize custom college if current college is not in predefined list
  useEffect(() => {
    if (college) {
      const isKnown = collegesList.some(c => c.toLowerCase() === college.toLowerCase());
      if (!isKnown && college !== 'Other (Not Listed)') {
        setIsOtherSelected(true);
        setCustomCollege(college);
      }
    }
  }, [college, collegesList]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCollegeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredColleges = useMemo(() => {
    if (!searchQuery.trim()) return collegesList;
    const q = searchQuery.toLowerCase();
    return collegesList.filter(c => c.toLowerCase().includes(q));
  }, [collegesList, searchQuery]);

  const handleSelectCollege = (col: string) => {
    if (col === 'OTHER') {
      setIsOtherSelected(true);
      setCollege('');
      setIsCollegeDropdownOpen(false);
    } else {
      setIsOtherSelected(false);
      setCustomCollege('');
      setCustomError('');
      setCollege(col);
      setIsCollegeDropdownOpen(false);
      if (setErrorMsg) setErrorMsg('');
    }
  };

  const handleCustomCollegeChange = (val: string) => {
    setCustomCollege(val);
    const { valid, reason } = isValidCollegeName(val);
    if (!valid && reason) {
      setCustomError(reason);
      setCollege('');
    } else {
      setCustomError('');
      setCollege(val.trim());
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full text-left">
      {/* College Dropdown Selection */}
      <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <School size={14} className="text-indigo-600" />
            College / Institute <span className="text-red-500">*</span>
          </span>
          <span className="text-[11px] font-normal text-slate-400 lowercase">select from verified list</span>
        </label>

        <button
          type="button"
          onClick={() => setIsCollegeDropdownOpen(prev => !prev)}
          className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 hover:border-indigo-300 rounded-xl text-sm font-medium flex items-center justify-between text-left transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <span className={college || isOtherSelected ? 'text-slate-900 font-semibold truncate pr-2' : 'text-neutral-400 truncate pr-2'}>
            {isOtherSelected
              ? (customCollege ? `Other: ${customCollege}` : 'Other (Enter custom college)')
              : (college || 'Select your college from dropdown')}
          </span>
          <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isCollegeDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isCollegeDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Box */}
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/70">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search college name or city..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 p-1">
              {filteredColleges.length > 0 ? (
                filteredColleges.map(c => {
                  const isSelected = !isOtherSelected && college === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleSelectCollege(c)}
                      className={`w-full px-3.5 py-2.5 text-xs text-left flex items-center justify-between rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-indigo-50 text-indigo-900 font-bold' 
                          : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                      }`}
                    >
                      <span className="truncate pr-2">{c}</span>
                      {isSelected && <Check size={14} className="text-indigo-600 shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  No matching colleges found. Choose &quot;Other&quot; below.
                </div>
              )}

              {/* Other Option */}
              <button
                type="button"
                onClick={() => handleSelectCollege('OTHER')}
                className={`w-full px-3.5 py-2.5 text-xs text-left flex items-center justify-between rounded-lg border-t border-slate-100 transition-colors ${
                  isOtherSelected 
                    ? 'bg-indigo-50 text-indigo-900 font-bold' 
                    : 'text-indigo-600 hover:bg-indigo-50/50 font-bold'
                }`}
              >
                <span>+ Other (Enter College Name)</span>
                {isOtherSelected && <Check size={14} className="text-indigo-600 shrink-0" />}
              </button>
            </div>
          </div>
        )}

        {/* Custom College Input if 'Other' selected */}
        {isOtherSelected && (
          <div className="mt-2 flex flex-col gap-1.5 animate-in fade-in duration-200">
            <input
              type="text"
              placeholder="Enter your full official college name"
              value={customCollege}
              onChange={e => handleCustomCollegeChange(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-indigo-200 focus:border-indigo-500 rounded-xl text-sm font-medium focus:outline-none transition-colors"
            />
            {customError ? (
              <p className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> {customError}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Please enter full name (no abbreviations like &quot;ABC&quot; or &quot;CIT&quot;).
              </p>
            )}
          </div>
        )}
      </div>

      {/* Department Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <GraduationCap size={15} className="text-purple-600" />
            Department <span className="text-red-500">*</span>
          </span>
          <span className="text-[11px] font-normal text-slate-400 lowercase">select branch</span>
        </label>

        <div className="relative">
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 hover:border-purple-300 rounded-xl text-sm font-semibold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
          >
            <option value="" disabled>Select your department</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
