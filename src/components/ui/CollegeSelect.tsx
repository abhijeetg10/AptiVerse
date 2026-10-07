import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import Fuse from 'fuse.js';
import { collegeData, College } from '../../data/colleges';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface CollegeSelectProps {
  onSelect: (college: College | null) => void;
  selectedCollege?: College | null;
  placeholder?: string;
  className?: string;
}

// Initialize Fuse.js for powerful fuzzy searching
// We search both the canonical 'name' and the 'aliases' array
const fuse = new Fuse(collegeData, {
  keys: ['name', 'aliases'],
  threshold: 0.3, // 0.0 is exact match, 1.0 is very loose. 0.3 is perfect for typos
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export const CollegeSelect: React.FC<CollegeSelectProps> = ({
  onSelect,
  selectedCollege = null,
  placeholder = "Search for your college (e.g. CIT Chennai)...",
  className
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<College[]>(collegeData);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update search results whenever query changes
  useEffect(() => {
    if (query.trim() === '') {
      // Show first 5 items by default when empty
      setResults(collegeData.slice(0, 5));
      return;
    }

    // Clean up punctuation (e.g. "CIT, Chennai" -> "CIT Chennai") for better matching
    // Although Fuse handles a lot natively, a cleaner query is always better
    const cleanQuery = query.replace(/[.,-]/g, ' ').replace(/\s+/g, ' ').trim();
    
    const searchResults = fuse.search(cleanQuery);
    setResults(searchResults.map(result => result.item));
  }, [query]);

  // If user clears the input after selecting a college, reset selection
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    if (selectedCollege && e.target.value !== selectedCollege.name) {
      onSelect(null);
    }
  };

  const handleSelect = (college: College) => {
    setQuery(college.name);
    setIsOpen(false);
    onSelect(college);
  };

  return (
    <div className={cn("relative w-full max-w-lg", className)} ref={wrapperRef}>
      {/* Input Field */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          className={cn(
            "block w-full pl-10 pr-10 py-3 border rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200 shadow-sm",
            selectedCollege ? "border-indigo-300 ring-1 ring-indigo-100 bg-indigo-50/30" : "border-gray-200"
          )}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
        />
        {selectedCollege && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {results.length > 0 ? (
              <ul className="max-h-72 overflow-y-auto py-2 custom-scrollbar">
                {results.map((college) => (
                  <li
                    key={college.id}
                    onClick={() => handleSelect(college)}
                    className={cn(
                      "cursor-pointer select-none relative py-3 pl-4 pr-9 transition-colors duration-150",
                      selectedCollege?.id === college.id
                        ? "bg-indigo-50 text-indigo-900"
                        : "text-gray-900 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className={cn("block truncate font-medium", selectedCollege?.id === college.id ? "text-indigo-700" : "")}>
                        {college.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {college.city}, {college.state}
                        </span>
                        {/* Display an alias if it exists and the user is searching for it */}
                        {college.aliases.length > 0 && query.length > 2 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded-md">
                            <Building2 className="h-3 w-3" />
                            {/* We just show the first alias for aesthetics, or "aka XYZ" */}
                            aka {college.aliases[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
                <Search className="h-8 w-8 text-gray-300" />
                <p>No colleges found matching "{query}".</p>
                <p className="text-xs text-gray-400 mt-1">Try searching by abbreviation or city.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
