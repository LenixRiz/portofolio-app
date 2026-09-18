import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService, illustrationService, devlogService } from '../../services/api';
import type { Project, Illustration, Devlog } from '../../types';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [recentArt, setRecentArt] = useState<Illustration[]>([]);
  const [recentDevlogs, setRecentDevlogs] = useState<Devlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Eksekusi pemuatan data secara paralel (Optimasi Non-Blocking)
    Promise.all([
      projectService.getAll(),
      illustrationService.getAll(),
      devlogService.getAll(),
    ])
      .then(([projectsData, artData, devlogsData]) => {
        setFeaturedProjects(projectsData.filter((p) => p.isFeatured).slice(0, 3));
        setRecentArt(artData.slice(0, 4));
        setRecentDevlogs(devlogsData.filter((d) => d.isPublished).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-8 py-12 space-y-20">
      {/* Hero Section */}
      <section className="space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Fullstack .NET 9 & Digital Creator
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none max-w-3xl">
          Crafting systems, gameplay, and digital imagination.
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed">
          Kumpulan karya rekayasa perangkat lunak, arsitektur backend berbasis Clean Architecture, simulasi game Unity, dan portofolio ilustrasi karakter digital.
        </p>
        <div className="flex gap-4 pt-2">
          <Link
            to="/projects"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors cursor-pointer"
          >
            Lihat Proyek →
          </Link>
          <Link
            to="/illustrations"
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-sm font-medium transition-colors cursor-pointer"
          >
            Galeri Seni
          </Link>
        </div>
      </section>

      {/* Featured Projects Reel */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Proyek Unggulan</h2>
            <p className="text-neutral-400 text-xs mt-1">Karya pilihan rekayasa sistem dan pengembangan game.</p>
          </div>
          <Link to="/projects" className="text-xs text-indigo-400 hover:underline font-mono">
            Semua Proyek ({featuredProjects.length}) →
          </Link>
        </div>

        {loading ? (
          <p className="text-neutral-500 text-sm">Memuat proyek...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between overflow-hidden rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all hover:-translate-y-0.5"
              >
                <div>
                  <div className="aspect-video w-full overflow-hidden bg-neutral-950 border-b border-neutral-800">
                    <img
                      src={item.thumbnailUrl || 'https://placehold.co/600x400/171717/737373?text=No+Image'}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-neutral-100 text-base mb-2">{item.title}</h3>
                    <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">{item.summary}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex gap-1.5 flex-wrap pt-3 border-t border-neutral-800/60">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] bg-neutral-800/80 text-neutral-400 px-2 py-0.5 rounded font-mono">
                        #{tag.replace(/^#+/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Latest Illustrations Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Karya Visual Terbaru</h2>
            <p className="text-neutral-400 text-xs mt-1">Eksplorasi konsep seni dan ilustrasi karakter orisinal.</p>
          </div>
          <Link to="/illustrations" className="text-xs text-indigo-400 hover:underline font-mono">
            Buka Galeri →
          </Link>
        </div>

        {loading ? (
          <p className="text-neutral-500 text-sm">Memuat galeri...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentArt.map((art) => (
              <Link
                key={art.id}
                to="/illustrations"
                className="group overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 aspect-square relative"
              >
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs text-white font-medium line-clamp-1">{art.title}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Engineering Devlogs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Catatan Devlog Terkini</h2>
            <p className="text-neutral-400 text-xs mt-1">Catatan arsitektur dan pemecahan kendala teknis.</p>
          </div>
          <Link to="/devlogs" className="text-xs text-indigo-400 hover:underline font-mono">
            Semua Catatan →
          </Link>
        </div>

        {loading ? (
          <p className="text-neutral-500 text-sm">Memuat devlog...</p>
        ) : (
          <div className="space-y-3">
            {recentDevlogs.map((log) => (
              <Link
                key={log.id}
                to={`/devlogs/${log.slug}`}
                className="block p-5 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all hover:translate-x-1"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs text-indigo-400 font-mono mb-1">{log.projectTitle || 'General'}</div>
                    <h3 className="font-semibold text-neutral-100 text-base">{log.title}</h3>
                    <p className="text-neutral-400 text-xs mt-1 line-clamp-1">{log.content}</p>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono shrink-0">
                    {new Date(log.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}