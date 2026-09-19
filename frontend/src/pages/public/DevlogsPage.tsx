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
        // Filter strictly for published articles
        setDevlogs(data.filter((d) => d.isPublished));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12 sm:space-y-16 text-left">
      
      {/* Header Section */}
      <header className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Technical Notes & Architecture
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Engineering Devlogs
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-normal">
          In-depth technical writeups covering backend architecture in .NET 9, gameplay mechanics in Unity, database query optimizations, and postmortems from real-world development.
        </p>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-sm text-neutral-500 font-mono">
          Loading technical notes...
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-2xl text-red-400 text-xs sm:text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span>Error loading devlogs: {error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && devlogs.length === 0 && (
        <div className="text-left py-16 px-8 rounded-3xl bg-neutral-900/30 border border-neutral-800/80 space-y-2">
          <h3 className="text-lg font-semibold text-neutral-200">No devlogs published yet</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
            Technical notes and project development logs are currently being compiled. Check back soon.
          </p>
        </div>
      )}

      {/* Devlog Feed */}
      <div className="space-y-6">
        {devlogs.map((item) => (
          <article
            key={item.id}
            className="group p-6 sm:p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-all hover:-translate-y-0.5 shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              {/* Metadata Row */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                {item.projectTitle && (
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {item.projectTitle}
                  </span>
                )}
                <span className="text-neutral-500 font-mono text-xs">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                <Link to={`/devlogs/${item.slug}`}>
                  {item.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-neutral-400 text-sm sm:text-base line-clamp-3 leading-relaxed font-normal">
                {item.content}
              </p>
            </div>

            {/* Bottom Row: Clickable Tags & Read Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-neutral-800/60">
              <div className="flex gap-1.5 flex-wrap">
                {item.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/tags/${tag.toLowerCase().replace(/^#+/, '')}`}
                    className="text-[11px] bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-indigo-400 border border-neutral-800/80 px-2.5 py-1 rounded-lg font-mono transition-colors"
                  >
                    #{tag.replace(/^#+/, '')}
                  </Link>
                ))}
              </div>

              <Link
                to={`/devlogs/${item.slug}`}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 group-hover:translate-x-0.5"
              >
                <span>Read Full Devlog</span>
                <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}