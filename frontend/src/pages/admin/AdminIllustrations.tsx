import { useEffect, useState } from 'react';
import { illustrationService } from '../../services/api';
import CreateIllustrationModal from '../../components/CreateIllustrationModal';
import EditIllustrationModal from '../../components/EditIllustrationModal';
import type { Illustration } from '../../types';

export default function AdminIllustrations() {
  const [items, setItems] = useState<Illustration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Illustration | null>(null);

  useEffect(() => {
    illustrationService.getAll()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus ilustrasi "${title}"?`)) return;
    try {
      await illustrationService.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Manajemen Galeri Ilustrasi</h2>
          <p className="text-neutral-400 text-sm">Kelola portofolio seni digital, artwork, dan concept art.</p>
        </div>
        <CreateIllustrationModal onSuccess={(newArt) => setItems((prev) => [newArt, ...prev])} />
      </div>

      {loading && <p className="text-neutral-400">Memuat karya seni...</p>}
      {error && <p className="text-red-400 bg-red-950/40 p-4 rounded border border-red-800">Error: {error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map((art) => (
          <article
            key={art.id}
            className="group relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
          >
            <div className="aspect-square w-full overflow-hidden bg-neutral-950 relative">
              <img
                src={art.thumbnailUrl || art.imageUrl}
                alt={art.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.onerror = null;
                  img.src = 'https://placehold.co/600x600/171717/ef4444?text=Image+Error';
                }}
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-neutral-100 text-sm line-clamp-1">{art.title}</h3>
              {art.completedAt && (
                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  {new Date(art.completedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                </p>
              )}

              <div className="flex gap-1 mt-2.5 flex-wrap">
                {art.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-mono">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-neutral-800/80">
                <button
                  onClick={() => setEditingItem(art)}
                  className="text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(art.id, art.title)}
                  className="text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 px-2.5 py-1 rounded cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editingItem && (
        <EditIllustrationModal
          key={editingItem.id}
          illustration={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={(updated) => setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))}
        />
      )}
    </div>
  );
}