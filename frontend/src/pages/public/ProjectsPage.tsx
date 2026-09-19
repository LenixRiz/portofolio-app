import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/api';
import type { Project } from '../../types';

function formatCompletedDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONGOING' | 'FINISHED'>('ALL');

  useEffect(() => {
    projectService.getAll()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const allTags = [
    'All',
    ...Array.from(new Set(projects.flatMap((p) => p.tags.filter((t) => t && t.trim().length > 0)))),
  ];

  const filteredProjects = projects.filter((item) => {
    const matchesTag = selectedTag === 'All' || item.tags.includes(selectedTag);
    const matchesFeatured = !featuredOnly || item.isFeatured;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ONGOING' && item.isOnGoing) ||
      (statusFilter === 'FINISHED' && item.isFinished);
    return matchesTag && matchesFeatured && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12 sm:space-y-16 text-left">
      
      {/* 1. HEADER & FILTER CONTROLS */}
      <header className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Systems, Backend & Game Engineering
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Projects
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-normal">
          A catalog of backend architectures built with .NET 9 and PostgreSQL, interactive 2D gameplay systems in Unity, and production-ready applications.
        </p>

        {/* Filter Controls Row */}
        <div className="space-y-4 pt-4 border-t border-neutral-800/80">
          {/* Tag Filter Pills */}
          <div className="flex gap-2 flex-wrap items-center">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-950/50'
                    : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
                }`}
              >
                {tag === 'All' ? 'All Tech' : `#${tag.replace(/^#+/, '')}`}
              </button>
            ))}
          </div>

          {/* Status & Featured Toggle Buttons */}
          <div className="flex gap-2.5 flex-wrap items-center pt-1">
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                featuredOnly
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${featuredOnly ? 'bg-amber-400' : 'bg-neutral-600'}`} />
              Featured
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'ONGOING' ? 'ALL' : 'ONGOING')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                statusFilter === 'ONGOING'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'ONGOING' ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
              In Progress
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === 'FINISHED' ? 'ALL' : 'FINISHED')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                statusFilter === 'FINISHED'
                  ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'FINISHED' ? 'bg-indigo-400' : 'bg-neutral-600'}`} />
              Completed
            </button>
          </div>
        </div>
      </header>

      {/* 2. LOADING & ERROR STATES */}
      {loading && (
        <div className="py-12 text-sm text-neutral-500 font-mono">
          Loading project catalog...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-2xl text-red-400 text-xs sm:text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span>Error loading projects: {error}</span>
        </div>
      )}

      {!loading && !error && filteredProjects.length === 0 && (
        <div className="py-16 px-8 rounded-3xl bg-neutral-900/30 border border-neutral-800/80 space-y-2 text-left">
          <h3 className="text-lg font-semibold text-neutral-200">No matching projects found</h3>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
            No projects matched the selected filters. Try resetting the filters to view the complete catalog.
          </p>
          <button
            onClick={() => { setSelectedTag('All'); setFeaturedOnly(false); setStatusFilter('ALL'); }}
            className="pt-2 text-xs font-mono text-indigo-400 hover:underline cursor-pointer block"
          >
            Reset all filters →
          </button>
        </div>
      )}

      {/* 3. PROJECT GRID (Spacious 2-Column Card Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredProjects.map((item) => {
          const completedDateStr = formatCompletedDate(item.completedAt);
          return (
            <article
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-all hover:-translate-y-1 shadow-xl"
            >
              <div>
                {/* Thumbnail Preview Container */}
                <Link to={`/projects/${item.slug}`} className="block relative aspect-video w-full overflow-hidden bg-neutral-950 border-b border-neutral-800/80">
                  {item.thumbnailUrl && item.thumbnailUrl.trim().length > 0 ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}

                  {(!item.thumbnailUrl || item.thumbnailUrl.trim().length === 0) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-neutral-900/60 to-neutral-950 text-neutral-400 select-none">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        In Development
                      </div>
                      <span className="text-[11px] text-neutral-600 font-mono">Visual Preview Coming Soon</span>
                    </div>
                  )}
                </Link>

                {/* Content Section */}
                <div className="p-6 sm:p-8 space-y-3">
                  <h2 className="text-2xl font-bold text-neutral-100 group-hover:text-indigo-400 transition-colors leading-tight">
                    <Link to={`/projects/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h2>

                  {/* Status Badges & Completion Date */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {item.isFeatured && (
                      <span className="text-[10px] font-semibold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase">
                        Featured
                      </span>
                    )}
                    {item.isOnGoing && (
                      <span className="text-[10px] font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                        In Progress
                      </span>
                    )}
                    {item.isFinished && (
                      <span className="text-[10px] font-semibold tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-0.5 rounded-full uppercase">
                        Completed
                      </span>
                    )}
                    {completedDateStr && (
                      <span className="text-[11px] font-mono text-neutral-400 bg-neutral-950 px-2.5 py-0.5 rounded-md border border-neutral-800">
                        {completedDateStr}
                      </span>
                    )}
                  </div>

                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 pt-1">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer: Tags & Action Buttons */}
              <div className="p-6 sm:p-8 pt-0">
                <div className="pt-5 border-t border-neutral-800/80 space-y-5">
                  <div className="flex gap-1.5 flex-wrap">
                    {item.tags
                      .filter((tag) => tag && tag.trim().length > 0)
                      .map((tag) => (
                        <Link
                          key={tag}
                          to={`/tags/${tag.toLowerCase().replace(/^#+/, '')}`}
                          className="text-xs bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-indigo-400 border border-neutral-800/80 px-2.5 py-1 rounded-lg font-mono transition-colors"
                        >
                          #{tag.replace(/^#+/, '')}
                        </Link>
                      ))}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      to={`/projects/${item.slug}`}
                      className="flex-1 text-center text-xs font-semibold py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700/60"
                    >
                      View Details →
                    </Link>

                    {item.repositoryUrl && (
                      <a
                        href={item.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-center text-xs font-medium py-3 px-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors shrink-0"
                      >
                        Code
                      </a>
                    )}

                    {item.demoUrl && item.demoUrl.trim().length > 0 && (
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-center text-xs font-semibold py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0 shadow-md shadow-indigo-950/60"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
}