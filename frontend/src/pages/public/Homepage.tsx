import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService, illustrationService, devlogService, cvService } from '../../services/api';
import type { Project, Illustration, Devlog } from '../../types';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [recentArt, setRecentArt] = useState<Illustration[]>([]);
  const [recentDevlogs, setRecentDevlogs] = useState<Devlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State untuk CV dan PDF Preview Modal
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      projectService.getAll(),
      illustrationService.getAll(),
      devlogService.getAll(),
      cvService.getStatus().catch(() => null),
    ])
      .then(([projectsData, artData, devlogsData, cvData]) => {
        setFeaturedProjects(projectsData.filter((p) => p.isFeatured).slice(0, 3));
        setRecentArt(artData.slice(0, 4));
        setRecentDevlogs(devlogsData.filter((d) => d.isPublished).slice(0, 3));
        if (cvData?.url) {
          setCvUrl(cvData.url);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-28 sm:space-y-36 text-left">
      
      {/* 1. HERO SECTION */}
      <section className="flex flex-col items-start text-left pt-6 sm:pt-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Software Engineer & Digital Artist
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mb-8">
          Engineering robust systems, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            crafting evocative visual art.
          </span>
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg max-w-2xl font-normal leading-relaxed mb-12">
          Portfolio of <strong className="text-neutral-200 font-medium">Lenix</strong>. 
          Specializing in resilient backend architectures with .NET 9 and PostgreSQL, 
          interactive 2D gameplay systems in Unity, and expressive digital character illustrations.
        </p>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto my-8">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-950/60 hover:shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
          >
            Explore Projects
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            to="/illustrations"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 font-medium text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            Art Gallery
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-neutral-900/40 hover:bg-neutral-800/80 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 font-medium text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* 2. ABOUT THE CREATOR (Single Column, Left-Aligned Focus) */}
      <section className="rounded-3xl bg-neutral-900/40 border border-neutral-800/80 p-8 sm:p-12 shadow-xl relative overflow-hidden text-left">
        <div className="space-y-6 max-w-3xl">
          {/* Badge Topik */}
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
            About the Creator
          </span>

          {/* Judul & Deskripsi Ringkas */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Software Engineer & Visual Illustrator
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Focusing on high-performance backend systems with <strong>.NET 9 (ASP.NET Core, EF Core, PostgreSQL)</strong>, 
              robust gameplay architecture in <strong>Unity</strong>, and concept artwork with expressive character design. 
              Bridging engineering rigor with artistic intuition.
            </p>
          </div>

          {/* Core Tech Badges */}
          <div className="flex gap-2 flex-wrap pt-1">
            {['.NET 9', 'C#', 'PostgreSQL', 'Clean Architecture', 'Unity 2D', 'Clip Studio Paint'].map((badge) => (
              <span key={badge} className="text-xs font-mono text-neutral-400 bg-neutral-950 border border-neutral-800 px-3 py-1 rounded-lg">
                {badge}
              </span>
            ))}
          </div>

          {/* Tombol Aksi Mandiri Tepat di Bawah Konten */}
          <div className="pt-3">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-medium text-xs sm:text-sm border border-neutral-700/60 transition-all hover:border-neutral-500 active:scale-[0.98] cursor-pointer"
            >
              <span>Learn More About Me</span>
              <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROJECTS */}
      <section className="space-y-8 text-left">
        <div className="flex items-end justify-between border-b border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Projects</h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">Selected software architectures and game systems.</p>
          </div>
          <Link to="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-mono tracking-wide">
            View All ({featuredProjects.length}) →
          </Link>
        </div>

        {loading ? (
          <p className="text-neutral-500 text-sm font-mono">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <Link
                    to={`/projects/${item.slug}`}
                    className="block relative aspect-video w-full overflow-hidden bg-neutral-950 border-b border-neutral-800"
                  >
                    {item.thumbnailUrl && item.thumbnailUrl.trim().length > 0 ? (
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    {(!item.thumbnailUrl || item.thumbnailUrl.trim().length === 0) && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-400 select-none">
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          In Development
                        </div>
                        <span className="text-[10px] text-neutral-600 font-mono">Visual Preview Coming Soon</span>
                      </div>
                    )}
                  </Link>
                  <div className="p-6">
                    <h3 className="font-semibold text-neutral-100 text-base mb-2 hover:text-indigo-400 transition-colors">
                      <Link to={`/projects/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-neutral-400 text-xs leading-relaxed line-clamp-2">{item.summary}</p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className="flex gap-1.5 flex-wrap pt-4 border-t border-neutral-800/60">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Link
                        key={tag}
                        to={`/tags/${tag.toLowerCase().replace(/^#+/, '')}`}
                        className="text-[10px] bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-indigo-400 px-2.5 py-1 rounded-md font-mono transition-colors"
                      >
                        #{tag.replace(/^#+/, '')}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 4. RECENT VISUAL ARTWORKS */}
      <section className="space-y-8 text-left">
        <div className="flex items-end justify-between border-b border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Recent Artworks</h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">Character concepts, paintings, and digital illustrations.</p>
          </div>
          <Link to="/illustrations" className="text-xs text-indigo-400 hover:text-indigo-300 font-mono tracking-wide">
            Open Gallery →
          </Link>
        </div>

        {loading ? (
          <p className="text-neutral-500 text-sm font-mono">Loading gallery...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {recentArt.map((art) => (
              <Link
                key={art.id}
                to="/illustrations"
                className="group overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 aspect-square relative shadow-md"
              >
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-white font-medium line-clamp-1">{art.title}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 5. EDUCATION & CREDENTIALS (Trust Anchor Sebelum Inquiry) */}
      <section className="space-y-8 text-left">
        <div className="border-b border-neutral-800 pb-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block mb-3">
            Academic & Industry Background
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Education & Milestones
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Formal foundations in computer science, leadership, and competitive initiatives.
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
              Sep 2022 – May 2026
            </span>
          </div>

          {/* Curated Highlights & Leadership */}
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

      {/* SECTION: SKILLS & CAPABILITIES */}
      <section className="space-y-8 text-left">
        {/* Header Seksi */}
        <div className="border-b border-neutral-800 pb-5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block mb-3">
            Technical & Creative Stack
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Skills & Competencies
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            Core technologies, architectural patterns, and creative software powering my builds.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
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
                Building resilient backend services, maintainable Clean Architecture, 
                interactive 2D gameplay systems in Unity, and containerized cloud deployments.
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
                Crafting evocative character designs, narrative concept art, and high-fidelity digital 
                illustrations for interactive media and commercial commissions.
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

      {/* 6. CALL TO ACTION BANNER (Send an Inquiry) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/80 to-neutral-950 border border-neutral-800/90 p-10 sm:p-16 text-left space-y-6 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-xl">
          <span className="text-[11px] font-mono tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
            Available for Opportunities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight pt-2">
            Interested in collaborating or commissioning artwork?
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Open for backend engineering contracts, Unity game development collaborations, and commercial digital illustration commissions.
          </p>
        </div>
        <div className="relative z-10 pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-950/60 hover:shadow-indigo-500/20 hover:-translate-y-0.5 cursor-pointer"
          >
            Send an Inquiry →
          </Link>
        </div>
      </section>

      {/* 7. RECENT DEVLOGS (Ditempatkan di Bawah Send Inquiry) */}
      <section className="space-y-8 text-left">
        <div className="flex items-end justify-between border-b border-neutral-800 pb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Engineering Devlogs</h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">Technical postmortems, game mechanics, and architecture notes.</p>
          </div>
          <Link to="/devlogs" className="text-xs text-indigo-400 hover:text-indigo-300 font-mono tracking-wide">
            All Devlogs →
          </Link>
        </div>

        {loading ? (
          <p className="text-neutral-500 text-sm font-mono">Loading devlogs...</p>
        ) : (
          <div className="space-y-4">
            {recentDevlogs.map((log) => (
              <Link
                key={log.id}
                to={`/devlogs/${log.slug}`}
                className="block p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all hover:translate-x-1"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-indigo-400 font-mono mb-1.5">{log.projectTitle || 'General Architecture'}</div>
                    <h3 className="font-semibold text-neutral-100 text-base sm:text-lg">{log.title}</h3>
                    <p className="text-neutral-400 text-xs sm:text-sm mt-1.5 line-clamp-1 leading-relaxed">{log.content}</p>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono shrink-0">
                    {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 8. MODAL NATIVE PDF READER */}
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