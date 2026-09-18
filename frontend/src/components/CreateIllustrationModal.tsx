import { useState, type FormEvent } from 'react';
import { illustrationService } from '../services/api';
import type { Illustration } from '../types';

interface Props {
  onSuccess: (newArt: Illustration) => void;
}

export default function CreateIllustrationModal({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    thumbnailUrl: '',
    completedAt: '',
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
      const created = await illustrationService.create({
        title: form.title.trim(),
        description: form.description.trim() || null,
        imageUrl: form.imageUrl.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || form.imageUrl.trim(),
        completedAt: form.completedAt ? new Date(form.completedAt).toISOString() : null,
        tagNames,
      });

      onSuccess(created);
      setIsOpen(false);
      setForm({ title: '', description: '', imageUrl: '', thumbnailUrl: '', completedAt: '', tagsInput: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan karya');
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
          + Tambah Ilustrasi
        </button>
      ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 max-w-xl w-full">
            <h2 className="text-xl font-bold text-neutral-100">Tambah Ilustrasi Baru</h2>
            {error && <div className="text-sm text-red-400 bg-red-950/40 p-3 rounded border border-red-900">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Judul Karya *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Contoh: Concept Art - Cyberpunk Alley"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Direct Image URL (Full-Res) *</label>
              <input
                type="url"
                required
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Thumbnail URL (Opsional)</label>
                <input
                  type="url"
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Gunakan URL yang sama jika kosong"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Tanggal Selesai</label>
                <input
                  type="date"
                  value={form.completedAt}
                  onChange={(e) => setForm({ ...form, completedAt: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Tags (pisahkan koma)</label>
              <input
                type="text"
                value={form.tagsInput}
                onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Digital Art, Clip Studio Paint, Character"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Catatan / Deskripsi</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                placeholder="Software yang digunakan, waktu pengerjaan, lore..."
              />
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
                {submitting ? 'Menyimpan...' : 'Simpan Karya'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}