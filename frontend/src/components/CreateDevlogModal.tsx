import { useState, useEffect, type FormEvent } from 'react';
import { devlogService, projectService } from '../services/api';
import type { Devlog, Project } from '../types';

interface Props {
  onSuccess: (newDevlog: Devlog) => void;
}

export default function CreateDevlogModal({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    projectId: '',
    content: '',
    isPublished: true,
    tagsInput: '',
  });

  useEffect(() => {
    if (isOpen) {
      projectService.getAll().then((data) => {
        setProjects(data);
        if (data.length > 0 && !form.projectId) {
          setForm((prev) => ({ ...prev, projectId: data[0].id }));
        }
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.projectId) {
      setError('Pilih proyek induk terlebih dahulu');
      return;
    }

    setSubmitting(true);
    setError(null);

    const tagNames = form.tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#+/, '').trim())
      .filter((t) => t.length > 0);

    try {
      const created = await devlogService.create({
        title: form.title.trim(),
        projectId: form.projectId,
        content: form.content.trim(),
        isPublished: form.isPublished,
        tagNames,
      });

      onSuccess(created);
      setIsOpen(false);
      setForm({ title: '', projectId: projects[0]?.id || '', content: '', isPublished: true, tagsInput: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan devlog');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          + Tulis Devlog
        </button>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-neutral-100">Catatan Devlog Baru</h2>
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
                  placeholder="Contoh: Refactoring State Machine di Unity"
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
                placeholder="Architecture, CleanCode, C#"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Konten Catatan (Markdown / Teks) *</label>
              <textarea
                required
                rows={8}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Tulis tantangan teknis, solusi kode, atau evaluasi arsitektur..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="devlogPublished"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="rounded bg-neutral-950 border-neutral-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="devlogPublished" className="text-sm text-neutral-300 cursor-pointer">
                Terbitkan ke Publik (Published)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 text-white font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Devlog'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}