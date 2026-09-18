import { useEffect, useState } from 'react';
import { illustrationService } from '../../services/api';
import type { Illustration } from '../../types';

export default function IllustrationsPage() {
  const [items, setItems] = useState<Illustration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [previewItem, setPreviewItem] = useState<Illustration | null>(null);

  useEffect(() => {
    illustrationService.getAll().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  // Kumpulkan semua tag unik untuk filter bar
  const allTags = ['All', ...Array.from(new Set(items.flatMap((i) => i.tags)))];

  const filteredItems = selectedTag === 'All'
    ? items
    : items.filter((i) => i.tags.includes(selectedTag));

  // Helper pemformat tanggal yang aman dari nilai null
  function formatCompletedDate(dateStr?: string | null): string | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    return date.toLocaleDateString('id-ID', {
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Art & Illustrations</h1>
        <p className="text-neutral-400 text-sm mt-1">Koleksi ilustrasi digital, desain karakter, dan eksplorasi visual.</p>

        {/* Filter Tag Bar */}
        <div className="flex gap-2 mt-6 flex-wrap">
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
              {tag === 'All' ? 'All Works' : `#${tag}`}
            </button>
          ))}
        </div>
      </header>

      {loading && <p className="text-neutral-400">Memuat galeri...</p>}

      {/* Grid Galeri Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {filteredItems.map((art) => {
    const formattedDate = formatCompletedDate(art.completedAt);

    return (
      <div
        key={art.id}
        onClick={() => setPreviewItem(art)}
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all"
      >
        {/* Wadah Gambar */}
        <div className="aspect-4/5 w-full overflow-hidden bg-neutral-950 relative">
          <img
            src={art.thumbnailUrl || art.imageUrl}
            alt={art.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* 1. FLOATING BADGE (Selalu tampak di sudut kanan atas) */}
          {formattedDate && (
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-neutral-200 bg-neutral-950/70 backdrop-blur-md border border-white/10 shadow-lg">
                {formattedDate}
              </span>
            </div>
          )}
        </div>

        {/* 2. HOVER GRADIENT OVERLAY (Informasi saat kursor diarahkan) */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-20">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base leading-snug">{art.title}</h3>
            {art.description && (
              <p className="text-neutral-300 text-xs line-clamp-2 leading-relaxed">
                {art.description}
              </p>
            )}

            {/* Tag Pills di Overlay */}
            <div className="flex gap-1.5 pt-2 flex-wrap">
              {art.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-neutral-900/80 text-neutral-300 px-2 py-0.5 rounded font-mono border border-neutral-700/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>

      {/* 3. LIGHTBOX / ZOOM MODAL */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[90vh] flex flex-col items-center cursor-default"
          >
            <img
              src={previewItem.imageUrl}
              alt={previewItem.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-lg font-bold text-white">{previewItem.title}</h2>
                {previewItem.completedAt && (
                  <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {formatCompletedDate(previewItem.completedAt)}
                  </span>
                )}
              </div>
              {previewItem.description && (
                <p className="text-neutral-400 text-sm max-w-xl mt-1">{previewItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}