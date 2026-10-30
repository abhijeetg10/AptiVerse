import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl">
        <div className="flex items-center gap-3 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-3">
          <Shield size={16} /> Legal & Privacy
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Last updated: October 31, 2026 • Effective Date: October 31, 2026
        </p>

        <div className="space-y-8 text-slate-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Lock size={18} className="text-indigo-600" /> 1. Introduction
            </h2>
            <p>
              Welcome to <strong>AptiVerse</strong> ("we", "our", or "platform"). We respect your privacy and are committed to protecting the personal data of students, candidates, and visitors. This Privacy Policy describes how we collect, use, and safeguard your information when you access our gamified aptitude training platform at <code>https://www.aptiverse.in</code>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Eye size={18} className="text-indigo-600" /> 2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Authentication Data:</strong> When you sign in using Google OAuth, we receive your verified email address, full name, and avatar URL provided by Google.
              </li>
              <li>
                <strong>Academic Profile Information:</strong> During registration, you select your institution (college) and academic department to enable institutional rankings.
              </li>
              <li>
                <strong>Gameplay & Performance Metrics:</strong> We record puzzle attempt timestamps, completion times, accuracy rates, and game scores to generate leaderboards and personalized progress analytics.
              </li>
              <li>
                <strong>Device & Network Diagnostics:</strong> Standard technical information such as browser type, IP address, device viewport, and operating system collected for security and fraud prevention.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" /> 3. Third-Party Advertising & Cookies (Google AdSense)
            </h2>
            <p className="mb-2">
              AptiVerse may partner with third-party advertising networks, including <strong>Google AdSense</strong>, to serve relevant advertisements:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Google, as a third-party vendor, uses cookies (including advertising and measurement cookies) to serve ads on AptiVerse based on previous visits to this and other websites across the internet.
              </li>
              <li>
                Google's use of advertising cookies enables it and its partners to serve ads based on your visit to AptiVerse and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold">Ads Settings</a> or by visiting <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold">www.aboutads.info</a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. How We Use Your Information</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Calibrate game difficulty & progress metrics</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Compile cumulative campus leaderboards</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Prevent automated script abuse & cheating</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>Maintain platform security and compliance</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Data Protection & Security</h2>
            <p>
              Your data is stored in enterprise-grade cloud databases protected by Row-Level Security (RLS), encrypted in transit via TLS 1.3, and protected against unauthorized access. We do not sell, rent, or trade your personal email addresses to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. User Rights & Account Deletion</h2>
            <p>
              You have the right to request access to your personal data, rectify inaccuracies, or request complete account deletion. To exercise your rights, email our team at <a href="mailto:argaikwad24@gmail.com" className="text-indigo-600 font-semibold underline">argaikwad24@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

