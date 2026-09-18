import { useState, type FormEvent } from 'react';
import { projectService } from '../services/api';
import type { Project } from '../types';

interface Props {
  project: Project; // Tidak perlu null karena modal hanya dirender jika data ada
  onClose: () => void;
  onSuccess: (updatedProject: Project) => void;
}

export default function EditProjectModal({ project, onClose, onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inisialisasi state langsung dari props saat komponen pertama kali di-mount
  const [form, setForm] = useState({
    title: project.title,
    summary: project.summary,
    description: project.description,
    thumbnailUrl: project.thumbnailUrl,
    repositoryUrl: project.repositoryUrl || '',
    demoUrl: project.demoUrl || '',
    isFeatured: project.isFeatured,
    tagsInput: project.tags.join(', '),
  });
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Sanitasi: buang spasi, hapus simbol '#' yang diketik, filter string kosong
    const tagNames = form.tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#+/, '').trim())
      .filter((t) => t.length > 0);

    try {
      const updated = await projectService.update(project.id, {
        title: form.title.trim(),
        summary: form.summary.trim(),
        description: form.description.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || 'https://placehold.co/600x400/png',
        repositoryUrl: form.repositoryUrl.trim() || null,
        demoUrl: form.demoUrl.trim() || null,
        isFeatured: form.isFeatured,
        tagNames,
      });

      onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui proyek');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-100">Edit Proyek</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 cursor-pointer text-lg"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-400 bg-red-950/40 p-3 rounded border border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Judul Proyek *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Ringkasan Singkat *</label>
            <input
              type="text"
              required
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Deskripsi Lengkap *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Tags (pisahkan koma)</label>
            <input
              type="text"
              value={form.tagsInput}
              onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Repository URL</label>
              <input
                type="url"
                value={form.repositoryUrl}
                onChange={(e) => setForm({ ...form, repositoryUrl: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Thumbnail URL</label>
              <input
                type="text"
                value={form.thumbnailUrl}
                onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="editFeatured"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="rounded bg-neutral-950 border-neutral-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="editFeatured" className="text-sm text-neutral-300 cursor-pointer">
              Tandai sebagai Proyek Utama (Featured)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 text-white font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}