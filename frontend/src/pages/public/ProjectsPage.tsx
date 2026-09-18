import { useEffect, useState } from 'react';
import { projectService } from '../../services/api';
import type { Project } from '../../types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State filter
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);

  useEffect(() => {
    projectService.getAll()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Ekstraksi tag unik dan valid untuk filter bar
  const allTags = [
    'All',
    ...Array.from(new Set(projects.flatMap((p) => p.tags.filter((t) => t && t.trim().length > 0)))),
  ];

  // Logika pemfilteran sisi klien (Client-Side Filtering)
  const filteredProjects = projects.filter((item) => {
    const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
    const matchesFeatured = !featuredOnly || item.isFeatured;
    return matchesTag && matchesFeatured;
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header Halaman */}
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Software & Game Projects</h1>
        <p className="text-neutral-400 text-sm mt-1 max-w-2xl">
          Katalog rekayasa perangkat lunak, arsitektur backend .NET, simulasi game Unity, dan proyek IoT.
        </p>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-neutral-800/80">
          {/* Tag Filter Chips */}
          <div className="flex gap-2 flex-wrap items-center">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {tag === 'All' ? 'All Tech' : `#${tag}`}
              </button>
            ))}
          </div>

          {/* Featured Toggle */}
          <button
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
              featuredOnly
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${featuredOnly ? 'bg-amber-400' : 'bg-neutral-600'}`} />
            Featured Only
          </button>
        </div>
      </header>

      {/* State Indicators */}
      {loading && <p className="text-neutral-400">Memuat katalog proyek...</p>}
      {error && <p className="text-red-400 bg-red-950/40 p-4 rounded border border-red-800">Error: {error}</p>}

      {!loading && !error && filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-neutral-900/30 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400">Tidak ada proyek yang sesuai dengan kriteria filter.</p>
          <button
            onClick={() => { setSelectedTag('All'); setFeaturedOnly(false); }}
            className="mt-3 text-xs text-indigo-400 hover:underline cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Grid Proyek Publik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between overflow-hidden rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all hover:-translate-y-0.5"
          >
            <div>
              {/* Gambar Thumbnail Proyek */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-950 border-b border-neutral-800">
                <img
                  src={item.thumbnailUrl || 'https://placehold.co/600x400/171717/737373?text=No+Image'}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.onerror = null;
                    img.src = 'https://placehold.co/600x400/171717/ef4444?text=Invalid+Image';
                  }}
                />
              </div>

              {/* Konten Utama */}
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-lg font-semibold text-neutral-100 line-clamp-1">{item.title}</h2>
                  {item.isFeatured && (
                    <span className="text-[10px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-neutral-400 text-sm line-clamp-3 mb-4 leading-relaxed">{item.summary}</p>
              </div>
            </div>

            {/* Footer Kartu: Tags & Tombol Aksi Eksternal */}
            <div className="p-5 pt-0">
              <div className="pt-4 border-t border-neutral-800/80 space-y-4">
                {/* Tag Pills */}
                <div className="flex gap-1.5 flex-wrap">
                  {item.tags
                    .filter((tag) => tag && tag.trim().length > 0)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-neutral-800/80 text-neutral-300 px-2 py-0.5 rounded font-mono"
                      >
                        #{tag.replace(/^#+/, '')}
                      </span>
                    ))}
                </div>

                {/* External Action Links (GitHub / Demo) */}
                <div className="flex items-center gap-2 pt-1">
                  {item.repositoryUrl && (
                    <a
                      href={item.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                    >
                      Source Code ↗
                    </a>
                  )}
                  {item.demoUrl && (
                    <a
                      href={item.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center text-xs font-medium py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}