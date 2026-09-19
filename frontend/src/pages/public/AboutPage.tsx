import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cvService } from '../../services/api';

export default function AboutPage() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  useEffect(() => {
    cvService.getStatus()
      .then((data) => setCvUrl(data.url))
      .catch(() => setCvUrl(null));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-24 sm:space-y-32 text-left">
      
      {/* 1. HERO / BIO INTRO SECTION */}
      <section className="space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Software Engineer & Digital Artist
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl">
          Architecting resilient systems, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            breathing life into visual imagination.
          </span>
        </h1>

        <div className="space-y-4 max-w-3xl text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
          <p>
            Hello! I am <strong className="text-white font-medium">Lenix (Rizky)</strong>, a software engineer and digital illustrator driven by the intersection of computational structure and creative expression.
          </p>
          <p className="text-neutral-400 text-sm sm:text-base">
            My engineering practice centers on backend systems leveraging <strong>.NET 9 (C#, ASP.NET Core)</strong>, Clean Architecture, and PostgreSQL, complemented by interactive 2D gameplay programming in <strong>Unity</strong>. In tandem, I operate as an independent digital artist producing original character designs, concept artwork, and worldbuilding visuals.
          </p>
        </div>

        {/* Action Buttons: CV Access & Contact */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {cvUrl ? (
            <>
              {/* Primary Action: Native PDF Modal */}
              <button
                onClick={() => setShowPdfModal(true)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-950/60 hover:shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
              >
                Preview Resume (PDF)
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              {/* Secondary Action: Direct File Download */}
              <a
                href={cvUrl}
                download="CV_Resume.pdf"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 font-medium text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Download CV
                <svg className="w-4 h-4 ml-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </>
          ) : (
            <span className="text-xs text-neutral-500 font-mono py-2">
              (Resume document is currently being updated)
            </span>
          )}

          {/* Tertiary Action: Direct Contact */}
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-neutral-900/40 hover:bg-neutral-800/80 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 font-medium text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* 2. CORE SKILLS & TOOLKIT (Domain-Driven 2-Card Layout) */}
      <section className="space-y-8">
        <div className="border-b border-neutral-800 pb-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block mb-3">
            Core Competencies
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Technical & Creative Stack
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Production frameworks, engineering architectures, and visual creation tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Software & Game Engineering */}
          <div className="rounded-3xl bg-neutral-900/40 border border-neutral-800/80 p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono text-sm mb-4">
                &lt;/&gt;
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Software & Game Engineering
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Building resilient backend services, maintainable Clean Architecture, interactive 2D gameplay systems in Unity, and containerized cloud deployments.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-800/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Languages, Engine & Infrastructure
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  '.NET 9',
                  'ASP.NET Core',
                  'C#',
                  'PostgreSQL',
                  'EF Core',
                  'Clean Architecture',
                  'Unity 2D',
                  'Gameplay Systems',
                  'Docker',
                  'Linux VPS',
                  'Git',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono text-neutral-300 bg-neutral-950 border border-neutral-800/90 px-3 py-1.5 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Digital Art & Visual Design */}
          <div className="rounded-3xl bg-neutral-900/40 border border-neutral-800/80 p-8 sm:p-10 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-sm mb-4">
                ✦
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Digital Art & Visual Design
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Crafting evocative character designs, narrative concept art, and high-fidelity digital illustrations for interactive media and commercial commissions.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-800/60">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Creative Disciplines & Tools
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Character Design',
                  'Concept Art',
                  'Digital Painting',
                  'Visual Storytelling',
                  'Clip Studio Paint',
                  'Asset Production',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-mono text-neutral-300 bg-neutral-950 border border-neutral-800/90 px-3 py-1.5 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EDUCATION & MILESTONES SECTION */}
      <section className="space-y-8">
        <div className="border-b border-neutral-800 pb-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block mb-3">
            Academic Background
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Education & Milestones
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Institutional credentials, competitive initiatives, and organizational leadership.
          </p>
        </div>

        <div className="rounded-3xl bg-neutral-900/40 border border-neutral-800/80 p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-neutral-800/60 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-white">
                  STMIK PPKIA Pradnya Paramita
                </h3>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  GPA 3.91 / 4.00
                </span>
              </div>
              <p className="text-indigo-300 text-sm font-medium">
                Bachelor of Technology (BTech) in Information Technology
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800 shrink-0 self-start">
              Sep 2022 – Aug 2026
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Key Achievements & Leadership
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                <div className="text-xs text-neutral-300 leading-relaxed">
                  <strong className="text-white">Gameseed 2025:</strong> National Game Development & Incubation Participant.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                <div className="text-xs text-neutral-300 leading-relaxed">
                  <strong className="text-white">3× Winner — Indis Got Talent:</strong> Design Category winner for creative visual execution.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                <div className="text-xs text-neutral-300 leading-relaxed">
                  <strong className="text-white">President, STIMATA English Club (2022–2023):</strong> Directed institutional communications & workshops.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                <div className="text-xs text-neutral-300 leading-relaxed">
                  <strong className="text-white">Student Representative Assembly:</strong> Aspirations Commission Officer & 15+ committee lead roles.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION / INQUIRY */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800/90 p-10 sm:p-14 space-y-6 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-xl">
          <span className="text-[11px] font-mono tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
            Let's Connect
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
            Have a project or commission in mind?
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            I am always open to exploring technical backend contracts, gameplay engineering roles, and custom visual art inquiries.
          </p>
        </div>
        <div className="relative z-10 pt-1">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-950/60 hover:shadow-indigo-500/20 hover:-translate-y-0.5 cursor-pointer"
          >
            Start a Conversation →
          </Link>
        </div>
      </section>

      {/* 5. NATIVE PDF READER MODAL */}
      {showPdfModal && cvUrl && (
        <div
          onClick={() => setShowPdfModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden cursor-default"
          >
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-sm">Curriculum Vitae Preview</span>
                <a
                  href={cvUrl}
                  download="CV_Resume.pdf"
                  className="text-xs text-indigo-400 hover:underline font-mono"
                >
                  Download PDF
                </a>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-neutral-400 hover:text-white text-base cursor-pointer p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 w-full bg-neutral-950">
              <iframe
                src={`${cvUrl}#toolbar=1&navpanes=0`}
                title="CV PDF Viewer"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}