import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchService } from '../../services/api';
import type { SearchResults } from '../../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  // Inisialisasi state form dari parameter URL
  const [keyword, setKeyword] = useState(queryParam);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  // Efek hanya bertugas mengambil data dari API saat queryParam di URL berubah
  useEffect(() => {
    const trimmedQuery = queryParam.trim();
    if (!trimmedQuery) {
      return;
    }

    let ignore = false;

    searchService.search(trimmedQuery)
      .then((data) => {
        if (!ignore) {
          setResults(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [queryParam]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanTerm = keyword.trim();
    if (cleanTerm) {
      setLoading(true);
      // Mengubah URL memicu queryParam berubah, yang kemudian otomatis menjalankan useEffect
      setSearchParams({ q: cleanTerm });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12 sm:space-y-16 text-left">
      {/* Header & Search Bar */}
      <header className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Global Portfolio Search
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Search Explorer
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-normal">
          Search across software engineering projects, technical devlogs, architecture notes, and visual artworks.
        </p>

        <form onSubmit={handleSubmit} className="relative pt-2 max-w-2xl">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by topic: .NET 9, Unity, Clean Architecture, Shaders, Character..."
            className="w-full bg-neutral-900/60 border border-neutral-800 rounded-2xl px-5 py-4 pr-32 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-xl"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-4 bottom-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </header>

      {/* Results Summary */}
      {results && (
        <div className="text-xs text-neutral-400 border-b border-neutral-800/80 pb-4 font-mono flex items-center gap-2">
          <span>Found</span>
          <strong className="text-indigo-400">{results.totalResults}</strong>
          <span>results matching &ldquo;{results.query}&rdquo;</span>
        </div>
      )}

      {/* Software Projects Results */}
      {results && results.projects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Software Projects</h2>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {results.projects.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.projects.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col justify-between p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-all hover:-translate-y-0.5 shadow-lg space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                    <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3 font-normal">
                    {p.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between gap-2">
                  <div className="flex gap-1.5 flex-wrap">
                    {p.tags.slice(0, 2).map((t) => (
                      <Link
                        key={t}
                        to={`/tags/${t.toLowerCase().replace(/^#+/, '')}`}
                        className="text-[10px] bg-neutral-950 text-neutral-400 hover:text-indigo-400 border border-neutral-800/80 px-2 py-0.5 rounded-md font-mono transition-colors"
                      >
                        #{t.replace(/^#+/, '')}
                      </Link>
                    ))}
                  </div>
                  <Link
                    to={`/projects/${p.slug}`}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
                  >
                    View →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Engineering Devlogs Results */}
      {results && results.devlogs.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Engineering Devlogs</h2>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {results.devlogs.length}
            </span>
          </div>

          <div className="space-y-4">
            {results.devlogs.map((d) => (
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
                    <p className="text-neutral-400 text-xs mt-1 line-clamp-1 leading-relaxed">
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

      {/* Art Results */}
      {results && results.illustrations.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-800/60 pb-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Art</h2>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {results.illustrations.length}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {results.illustrations.map((art) => (
              <Link
                key={art.id}
                to="/illustrations"
                className="aspect-square rounded-2xl overflow-hidden bg-neutral-900/40 border border-neutral-800/80 relative group shadow-md"
              >
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-neutral-950/80 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
                  <span className="text-xs text-white line-clamp-1 font-medium">{art.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {results && results.totalResults === 0 && (
        <div className="py-16 px-8 rounded-3xl bg-neutral-900/30 border border-neutral-800/80 space-y-2 text-left">
          <h3 className="text-lg font-semibold text-neutral-200">No matching entries found</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
            No software projects, devlogs, or artworks matched &ldquo;{results.query}&rdquo;. Try using broader technical terms or exploring by tags.
          </p>
          <Link
            to="/projects"
            className="pt-2 text-xs font-mono text-indigo-400 hover:underline cursor-pointer block"
          >
            Explore all projects →
          </Link>
        </div>
      )}
    </div>
  );
}