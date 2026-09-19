import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cvService } from '../../services/api';

export default function AboutPage() {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  useEffect(() => {
    cvService.getStatus()
      .then((data) => setCvUrl(data.url))
      .catch(() => setCvUrl(null));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-8 py-12 space-y-16">
      {/* Header & Profil Ringkas */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Software Engineer & Digital Artist
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Membangun arsitektur sistem yang andal dan menghidupkan imajinasi visual.
        </h1>

        <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
          Halo! Saya seorang software engineer dengan fokus mendalam pada backend berbasis <strong>.NET 9 (C#)</strong>, arsitektur Clean Architecture, PostgreSQL, dan pengembangan game 2D di <strong>Unity</strong>. Di sisi lain, saya juga beraktivitas aktif sebagai ilustrator digital yang menciptakan konsep seni dan desain karakter orisinal.
        </p>

        {/* Action Buttons: View CV, Download CV, & Hubungi */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {cvUrl ? (
            <>
              {/* Tombol Membuka PDF Reader Modal */}
              <button
                onClick={() => setShowPdfModal(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-950/60"
              >
                <span>Lihat CV (PDF) 📄</span>
              </button>

              {/* Tombol Unduh Langsung */}
              <a
                href={cvUrl}
                download="CV_Resume.pdf"
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-medium text-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <span>Unduh CV ⬇</span>
              </a>
            </>
          ) : (
            <span className="text-xs text-neutral-500 font-mono py-2">
              (CV saat ini sedang dalam proses pembaruan)
            </span>
          )}

          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 text-indigo-400 border border-indigo-500/30 text-sm font-medium transition-colors cursor-pointer"
          >
            Hubungi Saya ✉️
          </Link>
        </div>
      </section>

      {/* Bagian Keahlian & Tech Stack */}
      <section className="space-y-6 pt-6 border-t border-neutral-800/80">
        <h2 className="text-2xl font-bold text-white tracking-tight">Keahlian & Core Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-indigo-400 font-mono text-sm font-semibold uppercase tracking-wider">
              Rekayasa Perangkat Lunak
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Fokus pada performa tinggi, kebersihan arsitektur, dan pemeliharaan kode jangka panjang.
            </p>
            <div className="flex gap-2 flex-wrap pt-2">
              {['.NET 9', 'ASP.NET Core', 'C#', 'PostgreSQL', 'EF Core', 'Clean Architecture', 'Docker', 'Unity 2D'].map((skill) => (
                <span key={skill} className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <h3 className="text-indigo-400 font-mono text-sm font-semibold uppercase tracking-wider">
              Seni Digital & Visual
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Eksplorasi desain karakter, artwork promosi, dan rendering ilustrasi digital orisinal.
            </p>
            <div className="flex gap-2 flex-wrap pt-2">
              {['Character Design', 'Digital Painting', 'Concept Art', 'Clip Studio Paint', 'Visual Storytelling'].map((skill) => (
                <span key={skill} className="text-xs bg-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODAL NATIVE PDF READER (Ringan, Cepat, Tanpa Lib Luar) */}
      {showPdfModal && cvUrl && (
        <div
          onClick={() => setShowPdfModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-sm">Curriculum Vitae Preview</span>
                <a
                  href={cvUrl}
                  download="CV_Resume.pdf"
                  className="text-xs text-indigo-400 hover:underline font-mono"
                >
                  Download PDF
                </a>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="text-neutral-400 hover:text-white text-base cursor-pointer p-1"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            {/* Frame Pembaca Dokumen Bawaan Peramban */}
            <div className="flex-1 w-full bg-neutral-950">
              <iframe
                src={`${cvUrl}#toolbar=1&navpanes=0`}
                title="CV PDF Viewer"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}