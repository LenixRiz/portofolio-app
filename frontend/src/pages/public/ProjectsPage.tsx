import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/api';
import type { Project } from '../../types';

function formatCompletedDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleDateString('id-ID', {
    month: 'short',
    year: 'numeric',
  });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONGOING' | 'FINISHED'>('ALL');

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

  const allTags = [
    'All',
    ...Array.from(new Set(projects.flatMap((p) => p.tags.filter((t) => t && t.trim().length > 0)))),
  ];

  const filteredProjects = projects.filter((item) => {
    const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
    const matchesFeatured = !featuredOnly || item.isFeatured;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ONGOING' && item.isOnGoing) ||
      (statusFilter === 'FINISHED' && item.isFinished);

    return matchesTag && matchesFeatured && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Software & Game Projects</h1>
        <p className="text-neutral-400 text-sm mt-1 max-w-2xl">
          Katalog rekayasa sistem backend berbasis .NET, simulasi interaktif Unity, dan arsitektur kode berskala produksi.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-neutral-800/80">
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

          <div className="flex gap-2 flex-wrap items-center shrink-0">
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                featuredOnly
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${featuredOnly ? 'bg-amber-400' : 'bg-neutral-600'}`} />
              Featured
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'ONGOING' ? 'ALL' : 'ONGOING')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                statusFilter === 'ONGOING'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'ONGOING' ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
              On Going
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'FINISHED' ? 'ALL' : 'FINISHED')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                statusFilter === 'FINISHED'
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'FINISHED' ? 'bg-indigo-400' : 'bg-neutral-600'}`} />
              Finished
            </button>
          </div>
        </div>
      </header>

      {loading && <p className="text-neutral-400">Memuat katalog proyek...</p>}
      {error && <p className="text-red-400 bg-red-950/40 p-4 rounded border border-red-800">Error: {error}</p>}

      {!loading && !error && filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-neutral-900/30 rounded-2xl border border-neutral-800">
          <p className="text-neutral-400">Tidak ada proyek yang sesuai dengan kriteria filter.</p>
          <button
            onClick={() => { setSelectedTag('All'); setFeaturedOnly(false); setStatusFilter('ALL'); }}
            className="mt-3 text-xs text-indigo-400 hover:underline cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Grid Proyek 2 Kolom yang Lebih Besar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredProjects.map((item) => {
          const completedDateStr = formatCompletedDate(item.completedAt);

          return (
            <article
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all hover:-translate-y-1 shadow-xl"
            >
              <div>
                <Link to={`/projects/${item.slug}`} className="block relative aspect-video w-full overflow-hidden bg-neutral-950 border-b border-neutral-800">
                  {item.thumbnailUrl && item.thumbnailUrl.trim().length > 0 ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // Jika URL gambar rusak atau gagal dimuat, sembunyikan gambar agar fallback di belakangnya terlihat
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {/* Native Placeholder "In Development" (Tampil jika thumbnailUrl kosong atau rusak) */}
                  {(!item.thumbnailUrl || item.thumbnailUrl.trim().length === 0) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-neutral-900/60 to-neutral-950 text-neutral-400 select-none">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        In Development
                      </div>
                      <span className="text-[11px] text-neutral-600 font-mono">Visual Preview Coming Soon</span>
                    </div>
                  )}
                </Link>

                <div className="p-6">
                  {/* Judul Proyek */}
                  <h2 className="text-2xl font-bold text-neutral-100 hover:text-indigo-400 transition-colors leading-tight">
                    <Link to={`/projects/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h2>

                  {/* Status Badges + Tanggal Selesai Berada Tepat di Bawah Judul */}
                  <div className="flex items-center gap-2 flex-wrap mt-2.5">
                    {item.isFeatured && (
                      <span className="text-[10px] font-semibold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase">
                        ★ Featured
                      </span>
                    )}
                    {item.isOnGoing && (
                      <span className="text-[10px] font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                        ● In Progress
                      </span>
                    )}
                    {item.isFinished && (
                      <span className="text-[10px] font-semibold tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase">
                        ✓ Completed
                      </span>
                    )}
                    {completedDateStr && (
                      <span className="text-[11px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        🗓️ {completedDateStr}
                      </span>
                    )}
                  </div>

                  <p className="text-neutral-400 text-sm mt-4 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-neutral-800/80 space-y-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {item.tags
                      .filter((tag) => tag && tag.trim().length > 0)
                      .map((tag) => (
                        <Link
                          key={tag}
                          to={`/tags/${tag.toLowerCase().replace(/^#+/, '')}`}
                          className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-indigo-400 px-2.5 py-1 rounded font-mono transition-colors"
                        >
                          #{tag.replace(/^#+/, '')}
                        </Link>
                      ))}
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <Link
                      to={`/projects/${item.slug}`}
                      className="flex-1 text-center text-xs font-semibold py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                    >
                      Detail Proyek →
                    </Link>

                    {item.repositoryUrl && (
                      <a
                        href={item.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-center text-xs font-medium py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-colors shrink-0"
                      >
                        Code ↗
                      </a>
                    )}

                    {/* Tombol Demo HANYA MUNCUL jika demoUrl diisi pada form */}
                    {item.demoUrl && item.demoUrl.trim().length > 0 && (
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-center text-xs font-semibold py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0 shadow-md shadow-indigo-950/60"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}