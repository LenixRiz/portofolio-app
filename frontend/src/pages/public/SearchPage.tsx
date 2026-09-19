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
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Form Input Pencarian Terpusat */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-black text-white tracking-tight">Global Explorer</h1>
        <p className="text-neutral-400 text-xs">
          Cari berdasarkan nama fitur, judul proyek, teknologi, isi devlog, atau karya seni.
        </p>
        <form onSubmit={handleSubmit} className="relative mt-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari 'PostgreSQL', 'Unity', 'Shader', 'Bot'..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-3.5 pr-28 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-indigo-500 shadow-xl"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            {loading ? '...' : 'Cari'}
          </button>
        </form>
      </div>

      {/* Ringkasan Hasil */}
      {results && (
        <div className="text-xs text-neutral-400 border-b border-neutral-800 pb-3 font-mono">
          Menemukan <strong>{results.totalResults}</strong> hasil untuk &ldquo;{results.query}&rdquo;
        </div>
      )}

      {/* Hasil Proyek */}
      {results && results.projects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">Software Projects ({results.projects.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {results.projects.map((p) => (
              <div key={p.id} className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <h3 className="font-bold text-white text-sm">{p.title}</h3>
                <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{p.summary}</p>
                <div className="flex gap-1 mt-3 flex-wrap">
                  {p.tags.slice(0, 3).map((t) => (
                    <Link
                      key={t}
                      to={`/tags/${t.toLowerCase().replace(/^#+/, '')}`}
                      className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-mono hover:text-indigo-400"
                    >
                      #{t.replace(/^#+/, '')}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hasil Devlog */}
      {results && results.devlogs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">Engineering Devlogs ({results.devlogs.length})</h2>
          <div className="space-y-3">
            {results.devlogs.map((d) => (
              <Link
                key={d.id}
                to={`/devlogs/${d.slug}`}
                className="block p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-colors"
              >
                <div className="text-xs text-indigo-400 font-mono">{d.projectTitle || 'General'}</div>
                <h3 className="font-semibold text-white text-sm mt-0.5">{d.title}</h3>
                <p className="text-neutral-400 text-xs mt-1 line-clamp-1">{d.content}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Hasil Artwork */}
      {results && results.illustrations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">Art & Illustrations ({results.illustrations.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {results.illustrations.map((art) => (
              <Link
                key={art.id}
                to="/illustrations"
                className="aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 relative group"
              >
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                  <span className="text-[11px] text-white line-clamp-1">{art.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results && results.totalResults === 0 && (
        <div className="text-center py-16 bg-neutral-900/20 border border-neutral-800 rounded-2xl text-neutral-500">
          Tidak ada data yang cocok dengan kueri &ldquo;{results.query}&rdquo;. Coba gunakan kata kunci lain.
        </div>
      )}
    </div>
  );
}