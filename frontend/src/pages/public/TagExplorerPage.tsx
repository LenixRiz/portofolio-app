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
    return (
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-20 text-left">
        <p className="text-neutral-500 text-sm font-mono">Exploring content for #{slug}...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 text-left">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-4 shadow-xl">
          <h2 className="text-2xl font-bold text-red-400">Tag #{slug} Not Found</h2>
          <p className="text-neutral-400 text-sm">
            No projects, devlog articles, or artworks are currently associated with this tag.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition-colors cursor-pointer border border-neutral-700/60"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = data.projects.length + data.devlogs.length + data.illustrations.length;

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12 sm:space-y-16 text-left">
      {/* Header */}
      <header className="space-y-6 border-b border-neutral-800/80 pb-8">
        <div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-indigo-400 transition-colors mb-4"
          >
            <span>←</span>
            <span>Back to Catalog</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-4xl sm:text-5xl font-black text-indigo-400 font-mono tracking-tight">
            #{data.name}
          </h1>
          <span className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 px-3.5 py-1 rounded-full font-mono">
            {totalItems} total {totalItems === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <p className="text-neutral-400 text-base max-w-2xl font-normal leading-relaxed">
          Aggregated view of all software projects, technical devlogs, and visual artworks categorized under this topic.
        </p>
      </header>

      {/* Software Projects */}
      {data.projects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Software Projects</h2>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {data.projects.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((p) => (
              <article
                key={p.id}
                className="rounded-3xl bg-neutral-900/40 border border-neutral-800/80 p-6 sm:p-7 flex flex-col justify-between shadow-lg space-y-4 hover:border-neutral-700 transition-all hover:-translate-y-0.5"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base hover:text-indigo-400 transition-colors">
                    <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 font-normal">
                    {p.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between gap-3">
                  <Link
                    to={`/projects/${p.slug}`}
                    className="text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
                  >
                    View Details →
                  </Link>

                  <div className="flex gap-2">
                    {p.repositoryUrl && (
                      <a
                        href={p.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neutral-300 hover:text-white bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-lg transition-colors font-mono"
                      >
                        Code
                      </a>
                    )}
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-300 hover:text-white bg-indigo-950/40 border border-indigo-900 px-3 py-1.5 rounded-lg transition-colors font-mono"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Devlogs */}
      {data.devlogs.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Engineering Devlogs</h2>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {data.devlogs.length}
            </span>
          </div>

          <div className="space-y-4">
            {data.devlogs.map((d) => (
              <Link
                key={d.id}
                to={`/devlogs/${d.slug}`}
                className="block p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-all hover:translate-x-1 shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-indigo-400 font-mono block mb-1">
                      {d.projectTitle || 'Architecture'}
                    </span>
                    <h3 className="font-semibold text-white text-base">{d.title}</h3>
                    <p className="text-neutral-400 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {d.content}
                    </p>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono shrink-0">
                    {new Date(d.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Art */}
      {data.illustrations.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Art</h2>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {data.illustrations.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {data.illustrations.map((art) => (
              <Link
                key={art.id}
                to="/illustrations"
                className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900/40 border border-neutral-800/80 shadow-md"
              >
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3.5 flex items-end">
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