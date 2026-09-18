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
        {filteredItems.map((art) => (
          <div
            key={art.id}
            onClick={() => setPreviewItem(art)}
            className="group relative cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all"
          >
            <div className="aspect-4/5 w-full overflow-hidden bg-neutral-950">
              <img
                src={art.thumbnailUrl || art.imageUrl}
                alt={art.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <h3 className="font-bold text-white text-base">{art.title}</h3>
              {art.description && <p className="text-neutral-300 text-xs mt-1 line-clamp-2">{art.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Zoom Modal */}
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
            <div className="mt-4 text-center">
              <h2 className="text-lg font-bold text-white">{previewItem.title}</h2>
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