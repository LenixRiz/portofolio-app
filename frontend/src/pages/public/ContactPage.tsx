import { useState, type FormEvent } from 'react';
import { messageService } from '../../services/api';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General',
    budget: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await messageService.send({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        category: form.category,
        budget: form.budget.trim() || null,
        message: form.message.trim(),
      });

      setSuccess(true);
      setForm({ name: '', email: '', subject: '', category: 'General', budget: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim pesan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <header className="mb-10 text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-neutral-400 text-sm max-w-lg mx-auto">
          Tertarik dengan kolaborasi rekayasa perangkat lunak, arsitektur backend, atau pemesanan karya ilustrasi digital? Kirim pesan langsung melalui formulir ini.
        </p>
      </header>

      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
        {success && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-emerald-300 text-sm flex items-center justify-between">
            <span>✓ Pesan berhasil dikirim. Terima kasih! Saya akan segera merespons via email.</span>
            <button onClick={() => setSuccess(false)} className="text-emerald-400 hover:text-white text-xs">✕</button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="Nama Anda"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">Alamat Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="email@domain.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">Kategori Inquiry</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="General">General Inquiry</option>
                <option value="Project Collaboration">Software / Game Collaboration</option>
                <option value="Art Commission">Art & Character Commission</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">
                Estimasi Anggaran / Budget (Opsional)
              </label>
              <input
                type="text"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="Contoh: Rp 2.000.000 atau $150 USD"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">Subjek Pesan *</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="Inti perihal yang ingin disampaikan"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">Detail Pesan *</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="Ceritakan detail proyek, ekspektasi tenggat waktu, atau brief konsep..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 text-white font-medium text-sm transition-colors cursor-pointer shadow-lg shadow-indigo-950/50"
          >
            {loading ? 'Mengirimkan Pesan...' : 'Kirim Pesan Sekarang →'}
          </button>
        </form>
      </div>
    </div>
  );
}