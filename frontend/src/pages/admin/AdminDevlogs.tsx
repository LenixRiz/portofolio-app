import { useEffect, useState } from 'react';
import { devlogService } from '../../services/api';
import CreateDevlogModal from '../../components/CreateDevlogModal';
import EditDevlogModal from '../../components/EditDevlogModal';
import type { Devlog } from '../../types';

export default function AdminDevlogs() {
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDevlog, setEditingDevlog] = useState<Devlog | null>(null);

  useEffect(() => {
    devlogService.getAll()
      .then((data) => {
        setDevlogs(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus devlog "${title}"?`)) return;
    try {
      await devlogService.delete(id);
      setDevlogs((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Manajemen Catatan Devlog</h2>
          <p className="text-neutral-400 text-sm">Dokumentasikan progres teknis, bug-fixing, dan arsitektur kode.</p>
        </div>
        <CreateDevlogModal onSuccess={(newDevlog) => setDevlogs((prev) => [newDevlog, ...prev])} />
      </div>

      {loading && <p className="text-neutral-400">Memuat devlogs...</p>}
      {error && <p className="text-red-400 bg-red-950/40 p-4 rounded border border-red-800">Error: {error}</p>}

      <div className="space-y-4">
        {devlogs.map((d) => (
          <article
            key={d.id}
            className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-neutral-100 text-base">{d.title}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase border ${
                  d.isPublished 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {d.isPublished ? 'Published' : 'Draft'}
                </span>
                {d.projectTitle && (
                  <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                    📁 {d.projectTitle}
                  </span>
                )}
              </div>
              <p className="text-neutral-400 text-xs line-clamp-2">{d.content}</p>
              <div className="flex gap-1.5 pt-1">
                {d.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-neutral-800/80 text-neutral-400 px-2 py-0.5 rounded font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => setEditingDevlog(d)}
                className="text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(d.id, d.title)}
                className="text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 px-3 py-1.5 rounded cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </article>
        ))}
      </div>

      {editingDevlog && (
        <EditDevlogModal
          key={editingDevlog.id}
          devlog={editingDevlog}
          onClose={() => setEditingDevlog(null)}
          onSuccess={(updated) => setDevlogs((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))}
        />
      )}
    </div>
  );
}