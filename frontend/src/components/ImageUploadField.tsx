import { useState, type ChangeEvent } from 'react';
import { uploadService } from '../services/api';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploadField({ value, onChange, label = 'Image URL / Upload' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);
    setError(null);

    try {
      const result = await uploadService.uploadImage(file);
      onChange(result.url); // Masukkan URL hasil upload ke form state utama
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal upload');
    } finally {
      setUploading(false);
      // Reset input file agar bisa memilih file yang sama jika diperlukan
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-300">{label} *</label>
      
      <div className="flex gap-2 items-center">
        <input
          type="url"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
          placeholder="https://... atau unggah file di samping"
        />

        <label className={`px-4 py-2 rounded text-xs font-medium cursor-pointer transition-colors shrink-0 ${
          uploading 
            ? 'bg-neutral-800 text-neutral-500 cursor-wait' 
            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
        }`}>
          {uploading ? 'Mengunggah...' : 'Pilih Berkas 📁'}
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      
      {value && (
        <div className="relative aspect-video w-32 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 mt-2">
          <img
            src={value}
            alt="Preview"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/200x120/171717/ef4444?text=Preview+Error';
            }}
          />
        </div>
      )}
    </div>
  );
}