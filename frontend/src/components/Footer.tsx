import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 text-neutral-400 py-12 px-8 mt-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Sisi Kiri: Branding Singkat & Tautan Navigasi */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-bold text-lg text-white tracking-tight">
              CreatedByLenix<span className="text-indigo-500">.</span>
            </span>
            <span className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-mono">
              v1.0
            </span>
          </div>
          <p className="text-xs text-neutral-500 max-w-sm">
            Eksplorasi rekayasa perangkat lunak, arsitektur sistem, dan seni visual digital.
          </p>
        </div>

        {/* Sisi Tengah: Ikon Media Sosial & Platform Seni */}
        <div className="flex items-center gap-5">
          {/* GitHub */}
          <a
            href="https://github.com/LenixRiz"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            className="text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-neutral-900"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/createdbylenix"
            target="_blank"
            rel="noreferrer"
            aria-label="X Profile"
            className="text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-neutral-900"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/createdbylenix/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram Profile"
            className="text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-neutral-900"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* VGen / Art Commission Portal */}
          <a
            href="https://vgen.co/rizlenix_"
            target="_blank"
            rel="noreferrer"
            aria-label="VGen Portfolio"
            title="Art & Character Commission"
            className="text-neutral-400 hover:text-indigo-400 transition-colors p-2 rounded-lg hover:bg-neutral-900 flex items-center gap-1.5"
          >
            {/* Palette / Artwork Icon */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61.42.53.37 1.3-.12 1.77-.44.43-.53 1.11-.22 1.63.38.64 1.14.99 1.87.81 2.53-.62 3.82-1.82 5.5-1.82 4.97 0 9-4.03 9-9s-4.03-9-9-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
            <span className="text-[11px] font-mono font-semibold">VGen</span>
          </a>
        </div>

        {/* Sisi Kanan: Hak Cipta & Secret Gate ke CMS */}
        <div className="text-center md:text-right space-y-1">
          <p className="text-xs text-neutral-500">
            © {currentYear} CreatedByLenix. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400">
            Made with <span className="text-red-500 animate-pulse">❤️</span> by{' '}
            {/* SECRET GATE: Kata "Lenix" dapat diklik menuju panel CMS */}
            <Link
              to="/admin"
              className="text-neutral-200 hover:text-indigo-400 font-semibold transition-colors cursor-pointer select-none group relative inline-block"
              title="Management Gate"
            >
              Lenix
              {/* Titik indikator kecil yang sangat halus saat di-hover */}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300" />
            </Link>
            {' '}using <span className="text-neutral-300 font-mono">.NET 9</span>, <span className="text-neutral-300 font-mono">React</span> & <span className="text-neutral-300 font-mono">PostgreSQL</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}