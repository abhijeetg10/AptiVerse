import React, { useState } from 'react';
import { 
  Scale, CheckCircle2, ShieldAlert, AlertOctagon, Clock, 
  ChevronRight, Mail, HelpCircle, FileCheck, Shield, Users 
} from 'lucide-react';

const TermsOfService = () => {
  const [activeNav, setActiveNav] = useState('term-1');

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'term-1', label: '1. Acceptance of Terms' },
    { id: 'term-2', label: '2. Educational Purpose & Scope' },
    { id: 'term-3', label: '3. Fair Play & Anti-Cheat' },
    { id: 'term-4', label: '4. Brand & Trademark Disclaimer' },
    { id: 'term-5', label: '5. AI Interview & Media Rules' },
    { id: 'term-6', label: '6. Limitation of Liability' },
    { id: 'term-7', label: '7. Account Termination' },
    { id: 'term-8', label: '8. Governing Law & Inquiries' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-24 relative overflow-hidden">
      
      {/* Background glow shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-50/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-3xl -z-10 -translate-x-1/3"></div>

      {/* Header */}
      <div className="pt-12 pb-12 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Scale size={14} className="text-primary-600" /> User Agreement
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4">
            Terms of Service
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mb-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={14} className="text-primary-600" /> Last updated: October 31, 2026
            </span>
            <span>•</span>
            <span className="text-neutral-600 font-semibold">Effective Date: October 31, 2026</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              Standard Educational Agreement
            </span>
          </div>

          <p className="text-base text-neutral-600 leading-relaxed">
            Welcome to <strong>AptiVerse</strong>. These Terms of Service ("Terms") govern your use of the website, games, company mock exams, and AI interview simulations located at <code className="text-primary-700 font-mono text-xs bg-primary-50 px-1.5 py-0.5 rounded">https://www.aptiverse.in</code>.
          </p>

        </div>
      </div>

      {/* Student Cheat Sheet: Plain English Summary Strip */}
      <div className="border-y border-neutral-100 bg-neutral-50/70 py-6 mb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
            Plain-English Summary for Candidates
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-soft">
              <div className="text-xs font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-600" /> 1. Play Honestly
              </div>
              <p className="text-xs text-neutral-500">No automated scripts or bots. Keep scores genuine so rankings reflect true talent.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-soft">
              <div className="text-xs font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                <Users size={16} className="text-primary-600" /> 2. Accurate College Info
              </div>
              <p className="text-xs text-neutral-500">Pick your real college and department so campus placement cells can verify progress.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-soft">
              <div className="text-xs font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                <Shield size={16} className="text-amber-600" /> 3. Educational & Free
              </div>
              <p className="text-xs text-neutral-500">We are an independent training platform. Company names are referenced solely for preparation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left 4 cols: Sticky Navigation */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-20 bg-neutral-50/80 p-5 rounded-3xl border border-neutral-200/80 shadow-soft">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 px-2">
              Agreement Sections
            </div>
            <nav className="space-y-1 text-xs">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between ${
                    activeNav === item.id
                      ? 'bg-primary-600 text-white font-bold shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={14} className={activeNav === item.id ? 'text-white' : 'text-neutral-400'} />
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-5 border-t border-neutral-200/70 px-2 text-xs text-neutral-500">
              <p className="font-semibold text-neutral-700 mb-1">Legal or partnership queries?</p>
              <a href="mailto:argaikwad24@gmail.com" className="text-primary-600 font-bold hover:underline">
                argaikwad24@gmail.com
              </a>
            </div>
          </aside>

          {/* Right 8 cols: Detailed Sections */}
          <main className="lg:col-span-8 space-y-10 text-sm text-neutral-600 leading-relaxed">
            
            {/* Clause 1 */}
            <section id="term-1" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3 flex items-center gap-2">
                <FileCheck size={20} className="text-primary-600" /> 1. Acceptance of Terms
              </h2>
              <p className="mb-3">
                By visiting, registering for, or using <strong>AptiVerse</strong>, you signify that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue using the platform immediately.
              </p>
              <p>
                We reserve the right to revise these Terms periodically to reflect platform enhancements or regulatory requirements. Continued use after changes indicates acceptance of the updated terms.
              </p>
            </section>

            {/* Clause 2 */}
            <section id="term-2" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-primary-600" /> 2. Educational Purpose & Scope
              </h2>
              <p className="mb-3">
                AptiVerse is designed exclusively as an educational skills-development tool for students and fresher engineering candidates. Our cognitive games, question banks, and AI interview simulations are intended to train speed, pattern recognition, working memory, and technical communication.
              </p>
              <p className="text-xs text-neutral-500 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                Participation on AptiVerse does not guarantee employment, offer letters, or interview shortlisting by any recruitment agency or corporate employer.
              </p>
            </section>

            {/* Clause 3 */}
            <section id="term-3" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-4 flex items-center gap-2">
                <ShieldAlert size={20} className="text-amber-600" /> 3. Fair Play, Anti-Cheat & Academic Honesty
              </h2>
              <p className="mb-4">
                To guarantee genuine meritocracy and trust among student peers and placement cells, every user must adhere to strict integrity standards:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-xs text-amber-950">
                  <strong>No Automated Bots or Macros:</strong> Using headless browsers, automated solvers, timing manipulation, or reverse-engineered API payloads to simulate game completions is strictly forbidden.
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                  <strong>Genuine Institutional Affiliation:</strong> Candidates must register under their authentic college and branch. Registering fake institutions or impersonating other students is cause for immediate score forfeiture.
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                  <strong>Server-Side Verification:</strong> AptiVerse utilizes cryptographic server-side validation RPCs to detect impossible completion times or anomalous score increments.
                </div>
              </div>
            </section>

            {/* Clause 4 */}
            <section id="term-4" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3 flex items-center gap-2">
                <AlertOctagon size={20} className="text-rose-600" /> 4. Brand & Trademark Disclaimer
              </h2>
              <p className="mb-3">
                Any references on this website to commercial entities, including but not limited to <strong>Infosys Limited, Tata Consultancy Services (TCS), Capgemini, Accenture, Cognizant, or Wipro</strong>, are made solely for descriptive, informational, and educational preparation purposes.
              </p>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
                AptiVerse is an independent training resource. It is not affiliated with, sponsored by, endorsed by, or operated by any of the aforementioned companies. All trademarks, service marks, and trade names are the property of their respective owners.
              </div>
            </section>

            {/* Clause 5 */}
            <section id="term-5" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3 flex items-center gap-2">
                <Users size={20} className="text-primary-600" /> 5. AI Interview & Local Media Processing
              </h2>
              <p className="mb-3">
                The AI Recruiter Mock Interview room provides a simulated environment to practice oral communication. By activating your webcam, you acknowledge that video stream processing occurs exclusively on your local client device without server-side recording or transmission.
              </p>
              <p className="text-xs text-neutral-500">
                You agree not to use the camera simulator in public or shared environments in any manner that infringes on the privacy or dignity of third parties.
              </p>
            </section>

            {/* Clause 6 */}
            <section id="term-6" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3">
                6. Limitation of Liability & Warranty Disclaimer
              </h2>
              <p className="mb-3">
                AptiVerse is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. In no event shall AptiVerse or its developer be liable for any indirect, incidental, or consequential damages resulting from your use of or inability to use the platform.
              </p>
            </section>

            {/* Clause 7 */}
            <section id="term-7" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3">
                7. Account Suspension & Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate fair-play standards, engage in automated bot attacks, or disrupt the learning environment for other students without prior notice.
              </p>
            </section>

            {/* Clause 8 */}
            <section id="term-8" className="scroll-mt-24 bg-gradient-to-r from-neutral-900 to-primary-950 text-white p-8 rounded-3xl shadow-xl">
              <h2 className="text-xl font-extrabold mb-2 flex items-center gap-2">
                <Mail size={20} className="text-primary-400" /> 8. Governing Law & Contact Inquiries
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
                These terms are governed by the laws of India. For any questions, dispute resolutions, or institutional campus agreements, reach out to:
              </p>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs space-y-1">
                <div><strong>AptiVerse Administration</strong></div>
                <div>Contact: Abhijeet Ravindra Gaikwad</div>
                <div>Email: <a href="mailto:argaikwad24@gmail.com" className="text-primary-300 underline font-semibold">argaikwad24@gmail.com</a></div>
                <div>Location: Sangli, Maharashtra, India</div>
              </div>
            </section>

          </main>

        </div>
      </div>

    </div>
  );
};

export default TermsOfService;
