import { useState, type FormEvent } from 'react';
import { projectService } from '../services/api';
import ImageUploadField from './ImageUploadField';
import type { Project } from '../types';

interface Props {
  onSuccess: (newProject: Project) => void;
}

export default function CreateProjectModal({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    description: '',
    thumbnailUrl: '',
    repositoryUrl: '',
    demoUrl: '',
    completedAt: '',
    isFeatured: false,
    isOnGoing: false,
    isFinished: false,
    tagsInput: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const tagNames = form.tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#+/, '').trim())
      .filter((t) => t.length > 0);

    try {
      const created = await projectService.create({
        title: form.title.trim(),
        summary: form.summary.trim(),
        description: form.description.trim(),
        thumbnailUrl: form.thumbnailUrl.trim(),
        repositoryUrl: form.repositoryUrl.trim() || null,
        demoUrl: form.demoUrl.trim() || null,
        completedAt: form.completedAt ? new Date(form.completedAt).toISOString() : null,
        isFeatured: form.isFeatured,
        isOnGoing: form.isOnGoing,
        isFinished: form.isFinished,
        tagNames,
      });

      onSuccess(created);
      setIsOpen(false);
      setForm({
        title: '',
        summary: '',
        description: '',
        thumbnailUrl: '',
        repositoryUrl: '',
        demoUrl: '',
        completedAt: '',
        isFeatured: false,
        isOnGoing: false,
        isFinished: false,
        tagsInput: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan proyek');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          + Tambah Proyek Baru
        </button>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-neutral-100">Tambah Proyek Baru</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && <div className="text-sm text-red-400 bg-red-950/40 p-3 rounded border border-red-900">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Judul Proyek *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Contoh: Herb Project (Shop Simulation)"
              />
            </div>

            {/* Thumbnail Menggunakan ImageUploadField untuk upload lokal */}
            <ImageUploadField
              label="Thumbnail Proyek (Upload / URL)"
              value={form.thumbnailUrl}
              onChange={(url) => setForm({ ...form, thumbnailUrl: url })}
            />

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Ringkasan Singkat *</label>
              <input
                type="text"
                required
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Penjelasan 1 kalimat tentang proyek ini"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Deskripsi Lengkap *</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500 text-sm"
                placeholder="Detail fitur, arsitektur teknis, atau alur mekanik game..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Repository URL (GitHub)</label>
                <input
                  type="url"
                  value={form.repositoryUrl}
                  onChange={(e) => setForm({ ...form, repositoryUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={form.demoUrl}
                  onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="https://game.itch.io/... atau demo web"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Tanggal Selesai Proyek</label>
                <input
                  type="date"
                  value={form.completedAt}
                  onChange={(e) => setForm({ ...form, completedAt: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Tags (pisahkan koma)</label>
                <input
                  type="text"
                  value={form.tagsInput}
                  onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Unity, C#, Shader"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-800 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-sm text-neutral-300 cursor-pointer">
                  Tandai sebagai Proyek Utama (Featured)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOnGoing"
                  checked={form.isOnGoing}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isOnGoing: e.target.checked,
                      isFinished: e.target.checked ? false : form.isFinished,
                    })
                  }
                  className="rounded bg-neutral-950 border-neutral-800 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="isOnGoing" className="text-sm text-neutral-300 cursor-pointer">
                  Tandai sebagai Proyek Berjalan (On Going)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFinished"
                  checked={form.isFinished}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isFinished: e.target.checked,
                      isOnGoing: e.target.checked ? false : form.isOnGoing,
                    })
                  }
                  className="rounded bg-neutral-950 border-neutral-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isFinished" className="text-sm text-neutral-300 cursor-pointer">
                  Tandai sebagai Proyek Selesai (Finished)
                </label>
              </div>
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
                {submitting ? 'Menyimpan...' : 'Simpan Proyek'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}