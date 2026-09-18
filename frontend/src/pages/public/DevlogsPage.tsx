import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { devlogService } from '../../services/api';
import type { Devlog } from '../../types';

export default function DevlogsPage() {
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    devlogService.getAll()
      .then((data) => {
        // Hanya tampilkan artikel yang berstatus published
        setDevlogs(data.filter((d) => d.isPublished));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Engineering Devlogs</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Dokumentasi teknis seputar arsitektur software, game development, dan catatan eksperimen kode.
        </p>
      </header>

      {loading && <p className="text-neutral-400">Memuat devlogs...</p>}
      {error && <p className="text-red-400 bg-red-950/40 p-4 rounded border border-red-800">Error: {error}</p>}

      {!loading && !error && devlogs.length === 0 && (
        <p className="text-neutral-500 italic">Belum ada devlog yang dipublikasikan.</p>
      )}

      {/* Feed Daftar Artikel Devlog */}
      <div className="space-y-6">
        {devlogs.map((item) => (
          <article
            key={item.id}
            className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs">
                {item.projectTitle && (
                  <span className="text-indigo-400 font-mono">
                    📁 {item.projectTitle}
                  </span>
                )}
                <span className="text-neutral-500 font-mono">
                  {new Date(item.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white hover:text-indigo-400 transition-colors">
                <Link to={`/devlogs/${item.slug}`}>
                  {item.title}
                </Link>
              </h2>

              <p className="text-neutral-400 text-sm text-justify line-clamp-3 leading-relaxed">
                {item.content}
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800/80">
              <div className="flex gap-1.5 flex-wrap">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded font-mono"
                  >
                    #{tag.replace(/^#+/, '')}
                  </span>
                ))}
              </div>

              <Link
                to={`/devlogs/${item.slug}`}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
              >
                Baca Selengkapnya →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}