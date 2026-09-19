import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService, devlogService } from '../../services/api';
import type { Project, Devlog } from '../../types';

function formatCompletedDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleDateString('id-ID', {
    dateStyle: 'long',
  });
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let ignore = false;

    projectService.getBySlug(slug)
      .then((data) => {
        if (!ignore) {
          setProject(data);
          setLoading(false);
          devlogService.getAll(data.id).then((logs) => {
            if (!ignore) {
              setDevlogs(logs.filter((l) => l.isPublished));
            }
          });
        }
      })
      .catch((err: Error) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-neutral-400">Memuat detail proyek...</div>;
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h2 className="text-xl font-bold text-red-400">Proyek Tidak Ditemukan</h2>
          <p className="text-neutral-400 text-sm">Proyek dengan alamat &ldquo;{slug}&rdquo; tidak terdaftar di sistem.</p>
          <Link
            to="/projects"
            className="inline-block px-4 py-2 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            ← Kembali ke Katalog Proyek
          </Link>
        </div>
      </div>
    );
  }

  const completedFullDate = formatCompletedDate(project.completedAt);

  return (
    <article className="max-w-4xl mx-auto p-8 space-y-10">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-indigo-400 transition-colors cursor-pointer"
      >
        ← Kembali ke Katalog Proyek
      </Link>

      <header className="space-y-4 border-b border-neutral-800 pb-8">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {project.title}
        </h1>

        {/* Status Badges & Tanggal Selesai */}
        <div className="flex items-center gap-2 flex-wrap">
          {project.isFeatured && (
            <span className="text-xs font-semibold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
              ★ Featured Project
            </span>
          )}
          {project.isOnGoing && (
            <span className="text-xs font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
              ● Ongoing Development
            </span>
          )}
          {project.isFinished && (
            <span className="text-xs font-semibold tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full uppercase">
              ✓ Production Completed
            </span>
          )}
          {completedFullDate && (
            <span className="text-xs font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full">
              Selesai: {completedFullDate}
            </span>
          )}
          <span className="text-xs text-neutral-500 font-mono ml-1">
            Dibuat: {new Date(project.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
          </span>
        </div>

        <p className="text-lg text-neutral-300 leading-relaxed font-medium pt-2">
          {project.summary}
        </p>

        <div className="flex items-center gap-3 pt-4">
          {/* Tombol Demo di Detail Halaman */}
          {project.demoUrl && project.demoUrl.trim().length > 0 && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-950/60"
            >
              Buka Live Demo ↗
            </a>
          )}
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-medium text-xs transition-colors"
            >
              Lihat Source Code di GitHub ↗
            </a>
          )}
        </div>
      </header>

      {/* Banner / Gambar Thumbnail Proyek Resolusi Penuh */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
        {project.thumbnailUrl && project.thumbnailUrl.trim().length > 0 ? (
            <img
            src={project.thumbnailUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
            onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
            }}
            />
        ) : null}

        {/* Native Placeholder di Halaman Detail */}
        {(!project.thumbnailUrl || project.thumbnailUrl.trim().length === 0) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-neutral-900 to-neutral-950 text-center p-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                In Development
            </div>
            <p className="text-neutral-500 text-xs font-mono max-w-sm">
                Dokumentasi visual proyek ini sedang disiapkan.
            </p>
            </div>
        )}
        </div>

      {/* Konten Deskripsi Lengkap yang Diisi di Form */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Tentang Proyek & Arsitektur</h2>
        <div className="text-neutral-300 text-base leading-relaxed whitespace-pre-wrap font-sans bg-neutral-900/40 p-6 sm:p-8 rounded-2xl border border-neutral-800/80">
          {project.description}
        </div>
      </section>

      {/* Tags */}
      <section className="space-y-3 pt-4 border-t border-neutral-800/80">
        <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">Teknologi Terkait</h3>
        <div className="flex gap-2 flex-wrap">
          {project.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag.toLowerCase().replace(/^#+/, '')}`}
              className="text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/50 text-neutral-300 hover:text-indigo-400 px-3 py-1.5 rounded-lg font-mono transition-colors"
            >
              #{tag.replace(/^#+/, '')}
            </Link>
          ))}
        </div>
      </section>

      {/* Devlogs Terkait Proyek Ini */}
      {devlogs.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-neutral-800">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Engineering Devlogs Terkait</span>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded-full">
              {devlogs.length}
            </span>
          </h2>
          <div className="space-y-3">
            {devlogs.map((log) => (
              <Link
                key={log.id}
                to={`/devlogs/${log.slug}`}
                className="block p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all hover:translate-x-1"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-100 text-sm">{log.title}</h3>
                    <p className="text-neutral-400 text-xs mt-1 line-clamp-1">{log.content}</p>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono shrink-0">
                    {new Date(log.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}