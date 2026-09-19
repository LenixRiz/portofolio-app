import { useEffect, useState } from 'react';
import { messageService } from '../../services/api';
import type { ContactMessage } from '../../types';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = () => {
    messageService.getAll()
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string) => {
    try {
      const res = await messageService.toggleRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: res.isRead } : m))
      );
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage((prev) => (prev ? { ...prev, isRead: res.isRead } : null));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal memperbarui status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Hapus pesan dari "${name}"?`)) return;
    try {
      await messageService.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (activeMessage?.id === id) setActiveMessage(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Inquiries & Commission Messages</h2>
          <p className="text-neutral-400 text-sm">Kelola pesan masuk dari pengunjung, rekruter, dan pemesan komisi.</p>
        </div>
        <button
          onClick={fetchMessages}
          className="text-xs bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {loading && <p className="text-neutral-400">Memuat pesan...</p>}
      {error && <p className="text-red-400 bg-red-950/40 p-4 rounded border border-red-800">Error: {error}</p>}

      {!loading && messages.length === 0 && (
        <div className="text-center py-12 bg-neutral-900/30 rounded-2xl border border-neutral-800 text-neutral-500">
          Belum ada pesan masuk.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daftar List Pesan */}
        <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              onClick={() => setActiveMessage(m)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                activeMessage?.id === m.id
                  ? 'bg-neutral-900 border-indigo-500/60 shadow-xs'
                  : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-white text-sm truncate">{m.name}</span>
                {!m.isRead && (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" title="Belum dibaca" />
                )}
              </div>
              <p className="text-xs text-indigo-400 font-mono mb-1">{m.category}</p>
              <h4 className="text-xs text-neutral-300 font-medium line-clamp-1">{m.subject}</h4>
              <span className="text-[10px] text-neutral-500 font-mono mt-2 block">
                {new Date(m.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
              </span>
            </div>
          ))}
        </div>

        {/* Detail Pesan Terpilih */}
        <div className="lg:col-span-2">
          {activeMessage ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded font-mono">
                      {activeMessage.category}
                    </span>
                    {activeMessage.budget && (
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded font-mono">
                        Budget: {activeMessage.budget}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-2">{activeMessage.subject}</h3>
                  <div className="text-xs text-neutral-400 mt-1">
                    Dari: <strong className="text-neutral-200">{activeMessage.name}</strong> ({activeMessage.email})
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleRead(activeMessage.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer transition-colors"
                  >
                    {activeMessage.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                  </button>
                  <button
                    onClick={() => handleDelete(activeMessage.id, activeMessage.name)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-900/40 bg-red-950/30 hover:bg-red-950/60 text-red-400 cursor-pointer transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              {/* Isi Pesan */}
              <div className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-neutral-950/50 p-5 rounded-xl border border-neutral-800/80">
                {activeMessage.message}
              </div>

              {/* Action Balas Cepat via Email */}
              <div className="flex justify-end">
                <a
                  href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                >
                  Balas via Email Client ↗
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
              Pilih salah satu pesan di sebelah kiri untuk membaca detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}