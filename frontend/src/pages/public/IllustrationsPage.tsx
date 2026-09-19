import { useEffect, useState } from 'react';
import { illustrationService } from '../../services/api';
import type { Illustration } from '../../types';

export default function IllustrationsPage() {
  const [items, setItems] = useState<Illustration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [previewItem, setPreviewItem] = useState<Illustration | null>(null);

  useEffect(() => {
    illustrationService
      .getAll()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Kumpulkan tag unik dan bersihkan karakter kosong
  const allTags = [
    'All',
    ...Array.from(
      new Set(
        items.flatMap((i) =>
          i.tags
            ? i.tags.filter((t) => t && t.trim().length > 0).map((t) => t.replace(/^#+/, '').trim())
            : []
        )
      )
    ),
  ];

  const filteredItems =
    selectedTag === 'All'
      ? items
      : items.filter((i) =>
          i.tags?.map((t) => t.replace(/^#+/, '').trim()).includes(selectedTag)
        );

  // Helper pemformat tanggal standar internasional
  function formatCompletedDate(dateStr?: string | null): string | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12 sm:space-y-16 text-left">
      
      {/* 1. HEADER & FILTER SECTION */}
      <header className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Visual Artworks & Character Concepts
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Arts
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-normal">
          A curated gallery of original digital paintings, expressive character designs, and visual worldbuilding exploration.
        </p>

        {/* Filter Tag Bar */}
        <div className="flex gap-2 pt-2 flex-wrap items-center">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-950/50'
                  : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
              }`}
            >
              {tag === 'All' ? 'All Works' : `#${tag}`}
            </button>
          ))}
        </div>
      </header>

      {/* 2. LOADING & EMPTY STATES */}
      {loading && (
        <div className="py-12 text-sm text-neutral-500 font-mono">
          Loading gallery artworks...
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="py-16 px-8 rounded-3xl bg-neutral-900/30 border border-neutral-800/80 space-y-2 text-left">
          <h3 className="text-lg font-semibold text-neutral-200">No artworks found</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
            There are no pieces categorized under #{selectedTag}. Try selecting another tag or view all works.
          </p>
          <button
            onClick={() => setSelectedTag('All')}
            className="pt-2 text-xs font-mono text-indigo-400 hover:underline cursor-pointer block"
          >
            Reset filter →
          </button>
        </div>
      )}

      {/* 3. ART GALLERY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((art) => {
          const formattedDate = formatCompletedDate(art.completedAt);
          return (
            <article
              key={art.id}
              onClick={() => setPreviewItem(art)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-all hover:-translate-y-1 shadow-lg"
            >
              {/* Image Container with 4:5 Aspect Ratio */}
              <div className="aspect-4/5 w-full overflow-hidden bg-neutral-950 relative">
                <img
                  src={art.thumbnailUrl || art.imageUrl}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.onerror = null;
                    img.src = 'https://placehold.co/600x750/171717/ef4444?text=Artwork+Unavailable';
                  }}
                />

                {/* Floating Date Badge */}
                {formattedDate && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium text-neutral-200 bg-neutral-950/75 backdrop-blur-md border border-white/10 shadow-lg">
                      {formattedDate}
                    </span>
                  </div>
                )}
              </div>

              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-20">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg leading-snug">
                    {art.title}
                  </h3>

                  {art.description && (
                    <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed font-normal">
                      {art.description}
                    </p>
                  )}

                  {/* Overlay Tags */}
                  <div className="flex gap-1.5 pt-2 flex-wrap">
                    {art.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-neutral-900/90 text-neutral-300 px-2.5 py-0.5 rounded-md font-mono border border-neutral-700/60"
                      >
                        #{tag.replace(/^#+/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* 4. LIGHTBOX ZOOM MODAL */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[92vh] w-full flex flex-col items-center bg-neutral-900/95 border border-neutral-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto cursor-default space-y-4"
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 text-lg rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close image preview"
            >
              ✕
            </button>

            {/* High-Resolution Display */}
            <div className="max-h-[68vh] w-full flex items-center justify-center overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Artwork Metadata */}
            <div className="w-full text-left space-y-2 pt-2 border-t border-neutral-800/80">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {previewItem.title}
                </h2>
                {previewItem.completedAt && (
                  <span className="text-xs text-neutral-400 font-mono bg-neutral-950 px-3 py-1 rounded-lg border border-neutral-800">
                    {formatCompletedDate(previewItem.completedAt)}
                  </span>
                )}
              </div>

              {previewItem.description && (
                <p className="text-neutral-300 text-sm leading-relaxed max-w-2xl font-normal">
                  {previewItem.description}
                </p>
              )}

              <div className="flex gap-1.5 flex-wrap pt-1">
                {previewItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] bg-neutral-950 text-neutral-400 px-2.5 py-1 rounded-lg font-mono border border-neutral-800"
                  >
                    #{tag.replace(/^#+/, '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}