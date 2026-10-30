import React from 'react';
import { Scale, CheckCircle2, AlertOctagon, ShieldAlert } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl">
        <div className="flex items-center gap-3 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-3">
          <Scale size={16} /> User Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Last updated: October 31, 2026 • Effective Date: October 31, 2026
        </p>

        <div className="space-y-8 text-slate-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using <strong>AptiVerse</strong> (<code>https://www.aptiverse.in</code>), you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" /> 2. Eligibility & Educational Purpose
            </h2>
            <p>
              AptiVerse is designed as an interactive educational training platform to assist students in preparing for cognitive and analytical campus hiring assessments. All challenges and practice patterns are provided strictly for skills development and training purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-600" /> 3. Fair Play & Anti-Cheat Policy
            </h2>
            <p className="mb-2">
              To maintain the integrity of our cumulative leaderboards and institutional rankings, users must adhere to honest gameplay:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>No Automated Bots or Scripts:</strong> Using automated browser scripts, macros, or API fuzzers to simulate game completions is strictly prohibited.
              </li>
              <li>
                <strong>Accurate Institutional Representation:</strong> Users must select their genuine educational institution. Falsifying institutional affiliations will result in score forfeiture.
              </li>
              <li>
                <strong>Penalties for Violations:</strong> Accounts identified engaging in abusive or fraudulent activity may have their scores reset or face permanent suspension.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertOctagon size={18} className="text-rose-600" /> 4. Intellectual Property & Brand Disclaimer
            </h2>
            <p>
              AptiVerse is an independent educational training initiative. Any references to third-party companies, recruitment assessments (e.g., TCS, Cognizant, Capgemini, Infosys), or test formats are used solely for referential and educational preparation purposes. AptiVerse is not affiliated with, endorsed by, or sponsored by any mentioned corporate entities. All trademarks belong to their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Disclaimer of Warranties & Limitation of Liability</h2>
            <p>
              The platform is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive to ensure maximum uptime, accurate analytics, and rigorous security, we make no guarantees regarding uninterrupted availability or specific placement outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact Information</h2>
            <p>
              For legal inquiries or questions regarding these terms, contact us at: <a href="mailto:argaikwad24@gmail.com" className="text-indigo-600 font-semibold underline">argaikwad24@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

