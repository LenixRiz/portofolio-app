import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { devlogService } from '../../services/api';
import type { Devlog } from '../../types';

export default function DevlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [devlog, setDevlog] = useState<Devlog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    // Flag proteksi race condition jika user berpindah halaman dengan cepat
    let ignore = false;

    devlogService.getBySlug(slug)
      .then((data) => {
        if (!ignore) {
          setDevlog(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      // Batalkan pembaruan state jika komponen di-unmount sebelum fetch selesai
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-neutral-400">
        Memuat artikel devlog...
      </div>
    );
  }

  if (error || !devlog) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h2 className="text-xl font-bold text-red-400">Devlog Tidak Ditemukan</h2>
          <p className="text-neutral-400 text-sm">
            Artikel dengan slug &ldquo;{slug}&rdquo; tidak tersedia atau belum dipublikasikan.
          </p>
          <Link
            to="/devlogs"
            className="inline-block px-4 py-2 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            ← Kembali ke Semua Devlog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-8">
      <Link
        to="/devlogs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-indigo-400 transition-colors mb-6 cursor-pointer"
      >
        ← Kembali ke Semua Devlog
      </Link>

      <header className="pb-6 border-b border-neutral-800 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {devlog.projectTitle && (
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded font-mono">
              📁 {devlog.projectTitle}
            </span>
          )}
          <span className="text-xs text-neutral-500 font-mono">
            {new Date(devlog.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {devlog.title}
        </h1>

        <div className="flex gap-2 flex-wrap pt-2">
          {devlog.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 px-2.5 py-0.5 rounded font-mono"
            >
              #{tag.replace(/^#+/, '')}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-8 text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans text-base">
        {devlog.content}
      </div>
    </article>
  );
}