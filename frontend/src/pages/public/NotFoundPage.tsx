import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-24 sm:py-36 text-left">
      <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-6 shadow-xl">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          404: Route Not Found
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Lost in Digital Space.
        </h1>

        {/* Description */}
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
          The page or resource you are searching for does not exist, has been archived, or was moved to another architectural boundary.
        </p>

        {/* Recovery Action */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-all shadow-lg shadow-indigo-950/60 hover:shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
          >
            ← Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}