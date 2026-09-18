import { useState, useEffect, type FormEvent } from 'react';
import { devlogService, projectService } from '../services/api';
import type { Devlog, Project } from '../types';

interface Props {
  devlog: Devlog;
  onClose: () => void;
  onSuccess: (updated: Devlog) => void;
}

export default function EditDevlogModal({ devlog, onClose, onSuccess }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: devlog.title,
    projectId: devlog.projectId,
    content: devlog.content,
    isPublished: devlog.isPublished,
    tagsInput: devlog.tags.join(', '),
  });

  useEffect(() => {
    projectService.getAll().then(setProjects);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const tagNames = form.tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#+/, '').trim())
      .filter((t) => t.length > 0);

    try {
      const updated = await devlogService.update(devlog.id, {
        title: form.title.trim(),
        projectId: form.projectId,
        content: form.content.trim(),
        isPublished: form.isPublished,
        tagNames,
      });

      onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memperbarui devlog');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-100">Edit Devlog</h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-white text-lg cursor-pointer">✕</button>
        </div>

        {error && <div className="text-sm text-red-400 bg-red-950/40 p-3 rounded border border-red-900">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Judul Devlog *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Proyek Induk *</label>
            <select
              required
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
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

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Konten Catatan *</label>
          <textarea
            required
            rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="editDevlogPublished"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            className="rounded bg-neutral-950 border-neutral-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="editDevlogPublished" className="text-sm text-neutral-300 cursor-pointer">
            Terbitkan ke Publik (Published)
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
          <button type="button" onClick={onClose} className="px-4 py-2 text-neutral-400 hover:text-neutral-200 cursor-pointer">Batal</button>
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
  );
}