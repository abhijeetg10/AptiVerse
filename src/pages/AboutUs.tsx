import React from 'react';
import { Target, Users, Sparkles, GraduationCap, Building2, MapPin, Mail, Award, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} /> Our Mission
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            About <span className="text-indigo-600">AptiVerse</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
            AptiVerse is an innovative, gamified aptitude practice platform engineered to bridge the gap between traditional placement preparation and modern cognitive recruitment evaluations.
          </p>
        </div>

        {/* Why AptiVerse Section */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">The Problem We Solve</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Leading multinational tech recruiters have moved away from conventional rote-memorized formulas toward interactive, timed game assessments evaluating spatial reasoning, working memory, and rapid pattern logic.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-5">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Gamified Cognitive Mastery</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Through seven interactive puzzle mechanics—including Motion Challenge, Geo Sudoku, and Grid Memory—we train candidates to think under time pressure, boost accuracy, and conquer technical recruitment hurdles.
            </p>
          </div>
        </div>

        {/* Institutional & Developer Profile */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users size={22} className="text-indigo-600" /> Platform Architecture & Team
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
              AG
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Abhijeet Ravindra Gaikwad</h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Lead Full-Stack Developer • Department of Information Technology
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold">
                  <Building2 size={14} className="text-indigo-600" /> Rajarambapu Institute of Technology
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-rose-500" /> Sangli, Maharashtra, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Transparency */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold mb-1">Follow & Connect on LinkedIn</h3>
            <p className="text-indigo-200 text-xs sm:text-sm">Join the AptiVerse community for placement prep updates, game algorithms, and announcements.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://www.linkedin.com/company/aptiversein"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold rounded-xl text-sm shadow hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>Follow on LinkedIn</span>
            </a>
            <a
              href="mailto:argaikwad24@gmail.com"
              className="px-5 py-3.5 bg-white text-slate-950 font-bold rounded-xl text-sm shadow hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              <Mail size={16} /> Contact Team
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;

