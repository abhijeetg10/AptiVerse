import React, { useState } from 'react';
import { 
  Shield, Lock, Eye, FileText, CheckCircle2, ChevronRight, 
  ExternalLink, Mail, Award, Clock, Server, UserCheck, AlertCircle 
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeNav, setActiveNav] = useState('sec-1');

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'sec-1', label: '1. Introduction & Scope' },
    { id: 'sec-2', label: '2. Data We Collect' },
    { id: 'sec-3', label: '3. Google AdSense & Cookies' },
    { id: 'sec-4', label: '4. How Data Is Used' },
    { id: 'sec-5', label: '5. Security & Row-Level RLS' },
    { id: 'sec-6', label: '6. User Rights & Deletion' },
    { id: 'sec-7', label: '7. Contact Information' }
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
            <Shield size={14} className="text-primary-600" /> Transparency & Trust
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mb-6">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={14} className="text-primary-600" /> Last updated: October 31, 2026
            </span>
            <span>•</span>
            <span className="text-neutral-600 font-semibold">Effective Date: October 31, 2026</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              GDPR & AdSense Compliant
            </span>
          </div>

          <p className="text-base text-neutral-600 leading-relaxed">
            At <strong>AptiVerse</strong> (accessible at <code className="text-primary-700 font-mono text-xs bg-primary-50 px-1.5 py-0.5 rounded">https://www.aptiverse.in</code>), we are deeply dedicated to transparency and student privacy. This Privacy Policy outlines what information we collect, how it is secured, and how you can manage your data.
          </p>

        </div>
      </div>

      {/* Privacy At-a-Glance Summary Strip */}
      <div className="border-y border-neutral-100 bg-neutral-50/70 py-6 mb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold text-primary-700 mb-1">
              <UserCheck size={16} /> Verified Google OAuth
            </div>
            <p className="text-xs text-neutral-500">Only basic identity (email & name). No passwords stored.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
              <Server size={16} /> PostgreSQL RLS Protected
            </div>
            <p className="text-xs text-neutral-500">Row Level Security guarantees complete user isolation.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
              <Shield size={16} /> Zero Data Selling
            </div>
            <p className="text-xs text-neutral-500">We never sell, rent, or trade your student records or email.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-soft">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-1">
              <Award size={16} /> Total User Control
            </div>
            <p className="text-xs text-neutral-500">Full right to access, export, or permanently delete your account.</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left 4 cols: Sticky Navigation */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-20 bg-neutral-50/80 p-5 rounded-3xl border border-neutral-200/80 shadow-soft">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4 px-2">
              Table of Contents
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
              <p className="font-semibold text-neutral-700 mb-1">Need personal assistance?</p>
              <p>Email our privacy lead directly at:</p>
              <a href="mailto:argaikwad24@gmail.com" className="text-primary-600 font-bold hover:underline">
                argaikwad24@gmail.com
              </a>
            </div>
          </aside>

          {/* Right 8 cols: Detailed Sections */}
          <main className="lg:col-span-8 space-y-12 text-sm text-neutral-600 leading-relaxed">
            
            {/* Section 1 */}
            <section id="sec-1" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3 flex items-center gap-2">
                <Lock size={20} className="text-primary-600" /> 1. Introduction & Scope
              </h2>
              <p className="mb-3">
                This Privacy Policy applies solely to information collected by <strong>AptiVerse</strong> through its online platform at <code>https://www.aptiverse.in</code>. By registering an account, completing cognitive puzzles, taking company mock tests, or utilizing the AI interview simulation, you consent to the collection and use of information in accordance with this policy.
              </p>
              <p>
                AptiVerse is structured to provide equal-opportunity cognitive training. We collect the bare minimum data required to calculate scores, generate campus rankings, and prevent automated abuse.
              </p>
            </section>

            {/* Section 2 */}
            <section id="sec-2" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-4 flex items-center gap-2">
                <Eye size={20} className="text-primary-600" /> 2. Information We Collect
              </h2>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">A. Account & Authentication Information</h3>
                  <p className="text-xs text-neutral-600">
                    When you authenticate using Google OAuth via Supabase, we receive your verified Google email address, full name, and avatar picture. We <strong>never</strong> see, request, or store your Google account password.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">B. Academic & Institutional Affiliation</h3>
                  <p className="text-xs text-neutral-600">
                    During registration, students select their college/institute and academic department. This information is used strictly to aggregate inter-college leaderboards and track institutional placement readiness.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">C. Gameplay, Score & Attempt Logs</h3>
                  <p className="text-xs text-neutral-600">
                    We record your puzzle session start timestamps, completion times, accuracy percentages, and score outcomes. These are processed via server-side database functions to prevent client manipulation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <h3 className="font-bold text-neutral-900 text-sm mb-1">D. Browser Webcam in AI Interview (Local Only)</h3>
                  <p className="text-xs text-neutral-600">
                    When practicing in the AI Recruiter Mock Interview room, your webcam video stream is processed <strong>strictly in your local browser memory</strong> for posture and eye-contact simulation. AptiVerse does not record, stream, or transmit your webcam feed to any external server.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-3" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary-600" /> 3. Third-Party Advertising & Cookies (Google AdSense)
              </h2>
              <p className="mb-4">
                To keep AptiVerse 100% free for all college candidates without charging fees, we partner with reputable third-party advertising vendors, including <strong>Google AdSense</strong>:
              </p>

              <div className="space-y-3 mb-4">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-blue-950">
                  <span className="font-bold block mb-1">Google AdSense Advertising Cookies</span>
                  Google uses cookies to serve ads based on a user's prior visits to AptiVerse or other websites on the internet. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
                  <span className="font-bold block mb-1">How Users Can Opt Out of Personalized Advertising</span>
                  You may opt out of personalized advertising by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-primary-600 font-bold underline">Ads Settings</a>. Alternatively, you can opt out of third-party vendor cookies by visiting <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-primary-600 font-bold underline">aboutads.info</a>.
                </div>
              </div>

              <p className="text-xs text-neutral-500">
                AptiVerse strictly filters advertisement categories to prohibit adult, gambling, or deceptive advertisements that could impair student focus or campus network trust.
              </p>
            </section>

            {/* Section 4 */}
            <section id="sec-4" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-primary-600" /> 4. How We Use Your Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-2.5 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Maintain user sessions and verify Google OAuth identity</span>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-2.5 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Rank players fairly on college and statewide leaderboards</span>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-2.5 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Detect and prevent automated macro scripts & cheating</span>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-start gap-2.5 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Continuously improve cognitive game difficulty and user UX</span>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section id="sec-5" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3 flex items-center gap-2">
                <Server size={20} className="text-primary-600" /> 5. Data Security & Storage Architecture
              </h2>
              <p className="mb-4">
                AptiVerse enforces a multi-tier security posture audited to top industry specifications:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-neutral-600">
                <li>
                  <strong>PostgreSQL Row Level Security (RLS):</strong> Every profile, game attempt, and score record is protected at the database engine level. Users can never view or modify another student's private records.
                </li>
                <li>
                  <strong>TLS 1.3 Encryption in Transit:</strong> All HTTP traffic is protected by automated TLS certificates with strict HTTP Strict Transport Security (HSTS).
                </li>
                <li>
                  <strong>Content Security Policy (CSP):</strong> Explicit CSP headers prevent cross-site scripting (XSS) and clickjacking attacks.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="sec-6" className="scroll-mt-24 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-soft">
              <h2 className="text-xl font-extrabold text-neutral-900 mb-3 flex items-center gap-2">
                <UserCheck size={20} className="text-primary-600" /> 6. User Rights & Data Deletion
              </h2>
              <p className="mb-3">
                Under relevant data protection standards, you have the following guaranteed rights regarding your personal information:
              </p>
              <div className="space-y-2 text-xs text-neutral-600 mb-4">
                <div>• <strong>Right to Access:</strong> View all scores and profile information stored in your account.</div>
                <div>• <strong>Right to Rectification:</strong> Update your name, institution, or academic branch.</div>
                <div>• <strong>Right to Erasure (Account Deletion):</strong> Request complete, permanent removal of your account, scores, and profile data from our databases.</div>
              </div>
              <p className="text-xs">
                To request account deletion or data export, email <a href="mailto:argaikwad24@gmail.com" className="text-primary-600 font-bold underline">argaikwad24@gmail.com</a> with the subject "Data Deletion Request". Requests are processed within 48 business hours.
              </p>
            </section>

            {/* Section 7 */}
            <section id="sec-7" className="scroll-mt-24 bg-gradient-to-r from-neutral-900 to-primary-950 text-white p-8 rounded-3xl shadow-xl">
              <h2 className="text-xl font-extrabold mb-2 flex items-center gap-2">
                <Mail size={20} className="text-primary-400" /> 7. Contacting Our Team
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
                If you have questions, concerns, or inquiries regarding this Privacy Policy or data security on AptiVerse, please contact our team:
              </p>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs space-y-1">
                <div><strong>AptiVerse Platform Team</strong></div>
                <div>Lead Developer: Abhijeet Ravindra Gaikwad</div>
                <div>Email: <a href="mailto:argaikwad24@gmail.com" className="text-primary-300 underline font-semibold">argaikwad24@gmail.com</a></div>
                <div>Institutional Partner: Rajarambapu Institute of Technology, Sangli, Maharashtra, India</div>
              </div>
            </section>

          </main>

        </div>
      </div>

    </div>
  );
};

export default PrivacyPolicy;
