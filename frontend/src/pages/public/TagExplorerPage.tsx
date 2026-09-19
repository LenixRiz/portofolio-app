import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tagService } from '../../services/api';
import type { TagDetail } from '../../types';

export default function TagExplorerPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<TagDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let ignore = false;

    tagService.getBySlug(slug)
      .then((res) => {
        if (!ignore) {
          setData(res);
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
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return <div className="max-w-6xl mx-auto p-8 text-neutral-400">Menjelajahi konten #{slug}...</div>;
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h2 className="text-xl font-bold text-red-400">Tag #{slug} Belum Ditemukan</h2>
          <p className="text-neutral-400 text-sm">Belum ada karya atau catatan yang terhubung dengan tag ini.</p>
          <Link to="/" className="inline-block text-xs text-indigo-400 hover:underline">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const totalItems = data.projects.length + data.devlogs.length + data.illustrations.length;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Header Tag */}
      <header className="border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl font-black text-indigo-400 font-mono">
            #{data.name}
          </span>
          <span className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 px-3 py-1 rounded-full font-mono">
            {totalItems} total entitas
          </span>
        </div>
        <p className="text-neutral-400 text-sm mt-2">
          Seluruh proyek perangkat lunak, catatan arsitektur devlog, dan karya visual yang ditandai dengan topik ini.
        </p>
      </header>

      {/* 1. Proyek Terkait */}
      {data.projects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💻 Software Projects</span>
            <span className="text-xs text-neutral-500 font-mono font-normal">({data.projects.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((p) => (
              <article key={p.id} className="rounded-xl bg-neutral-900/60 border border-neutral-800 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-white text-base">{p.title}</h3>
                  <p className="text-neutral-400 text-xs mt-2 line-clamp-3 leading-relaxed">{p.summary}</p>
                </div>
                <div className="pt-4 border-t border-neutral-800/80 mt-4 flex gap-2">
                  {p.repositoryUrl && (
                    <a href={p.repositoryUrl} target="_blank" rel="noreferrer" className="text-xs text-neutral-300 hover:text-white bg-neutral-800 px-3 py-1.5 rounded">
                      Code ↗
                    </a>
                  )}
                  {p.demoUrl && (
                    <a href={p.demoUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-300 bg-indigo-950/40 border border-indigo-900 px-3 py-1.5 rounded">
                      Demo ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 2. Devlogs Terkait */}
      {data.devlogs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📝 Engineering Devlogs</span>
            <span className="text-xs text-neutral-500 font-mono font-normal">({data.devlogs.length})</span>
          </h2>
          <div className="space-y-3">
            {data.devlogs.map((d) => (
              <Link
                key={d.id}
                to={`/devlogs/${d.slug}`}
                className="block p-5 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-indigo-400 font-mono">📁 {d.projectTitle}</span>
                    <h3 className="font-bold text-neutral-100 text-base mt-0.5">{d.title}</h3>
                    <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{d.content}</p>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono shrink-0">
                    {new Date(d.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. Karya Visual / Artwork Terkait */}
      {data.illustrations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎨 Artworks & Illustrations</span>
            <span className="text-xs text-neutral-500 font-mono font-normal">({data.illustrations.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.illustrations.map((art) => (
              <Link
                key={art.id}
                to="/illustrations"
                className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800"
              >
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <span className="text-xs text-white font-medium line-clamp-1">{art.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}