import { useState, useEffect, type ChangeEvent } from 'react';
import { cvService } from '../services/api';

// Helper pemformat tanggal & waktu yang aman dari TypeError
function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';

  // toLocaleString (BUKAN toLocaleDateString) mengizinkan dateStyle + timeStyle
  return date.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function AdminCvManager() {
  const [cvData, setCvData] = useState<{ url: string; updatedAt: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCvStatus = () => {
    cvService.getStatus()
      .then(setCvData)
      .catch(() => setCvData(null));
  };

  useEffect(() => {
    fetchCvStatus();
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('Hanya berkas berformat PDF yang diperbolehkan.');
      return;
    }

    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await cvService.upload(file);
      setCvData(res);
      setMessage('CV berhasil diperbarui dan dipublikasikan!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengunggah berkas.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📄 Curriculum Vitae (CV) Management</span>
          </h2>
          <p className="text-neutral-400 text-xs mt-1">
            Unggah resume berformat PDF untuk ditampilkan pada halaman About Me.
          </p>
        </div>

        <label
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0 text-center ${
            uploading
              ? 'bg-neutral-800 text-neutral-500 cursor-wait'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/60'
          }`}
        >
          {uploading ? 'Mengunggah PDF...' : 'Unggah CV Baru (PDF) ⬆'}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {message && <p className="text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded border border-emerald-900">{message}</p>}
      {error && <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded border border-red-900">{error}</p>}

      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <div>
          Status:{' '}
          {cvData ? (
            <span className="text-emerald-400 font-medium">
              Tersedia (Terakhir diubah: {formatDateTime(cvData.updatedAt)})
            </span>
          ) : (
            <span className="text-neutral-500 italic">Belum ada CV yang diunggah</span>
          )}
        </div>

        {cvData && (
          <a
            href={cvData.url}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:underline font-mono"
          >
            Pratinjau CV Aktif ↗
          </a>
        )}
      </div>
    </div>
  );
}