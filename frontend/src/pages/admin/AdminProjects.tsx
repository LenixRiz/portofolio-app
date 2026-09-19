import { useEffect, useState } from 'react';
import { projectService } from '../../services/api';
import CreateProjectModal from '../../components/CreateProjectModal';
import EditProjectModal from '../../components/EditProjectModal';
import type { Project } from '../../types';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk melacak proyek mana yang sedang diedit
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    projectService.getAll()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleProjectUpdated = (updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus proyek "${title}"?`)) return;

    try {
      await projectService.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus proyek');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Content Hub</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Fullstack CMS Headless terintegrasi .NET 9, EF Core, & PostgreSQL
        </p>
      </header>

      <CreateProjectModal onSuccess={handleProjectCreated} />

      {loading && <p className="text-neutral-400">Memuat data dari backend...</p>}
      {error && <p className="text-red-400 bg-red-950/40 p-4 rounded border border-red-800">Error: {error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="text-neutral-500 italic">Belum ada proyek terdaftar.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map((item) => (
    <article
      key={item.id}
      className="flex flex-col justify-between overflow-hidden rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors"
    >
      <div>
        {/* Kontainer Gambar Thumbnail dengan Aspect Ratio & Fallback */}
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-950 border-b border-neutral-800">
          <img
            src={item.thumbnailUrl || 'https://placehold.co/600x400/171717/737373?text=No+Image'}
            alt={item.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.onerror = null; // Putus loop render jika fallback gagal
              img.src = 'https://placehold.co/600x400/171717/ef4444?text=Invalid+Image+URL';
            }}
          />
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-lg font-semibold text-neutral-100 line-clamp-1">{item.title}</h2>
            <div className="flex items-center gap-1.5 flex-wrap shrink-0 justify-end">
              {item.isFeatured && (
                <span className="text-[10px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">
                  Featured
                </span>
              )}
              {item.isOnGoing && (
                <span className="text-[10px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                  On Going
                </span>
              )}
              {item.isFinished && (
                <span className="text-[10px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase">
                  Finished
                </span>
              )}
            </div>
          </div>
          <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{item.summary}</p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {item.tags
              .filter((tag) => tag && tag.trim().length > 0)
              .map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-neutral-800/80 text-neutral-300 px-2.5 py-0.5 rounded-md font-mono"
                >
                  #{tag.replace(/^#+/, '')}
                </span>
              ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEditingProject(item)}
              className="text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id, item.title)}
              className="text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 px-2.5 py-1 rounded transition-colors cursor-pointer"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </article>
  ))}
</div>

      {/* Render modal hanya saat editingProject tidak null, dan pasang key unik */}
      {editingProject && (
        <EditProjectModal
          key={editingProject.id}
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={handleProjectUpdated}
        />
      )}
    </div>
  );
}