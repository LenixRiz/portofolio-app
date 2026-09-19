import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService, devlogService } from '../../services/api';
import type { Project, Devlog } from '../../types';

function formatCompletedDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', {
    dateStyle: 'long',
  });
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let ignore = false;
    projectService.getBySlug(slug)
      .then((data) => {
        if (!ignore) {
          setProject(data);
          setLoading(false);
          devlogService.getAll(data.id).then((logs) => {
            if (!ignore) {
              setDevlogs(logs.filter((l) => l.isPublished));
            }
          });
        }
      })
      .catch((err: Error) => {
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 text-left">
        <p className="text-neutral-500 text-sm font-mono">Loading project specifications...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 text-left">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-4 shadow-xl">
          <h2 className="text-2xl font-bold text-red-400">Project Not Found</h2>
          <p className="text-neutral-400 text-sm">
            The project identifier &ldquo;{slug}&rdquo; is not registered or may have been archived.
          </p>
          <div className="pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition-colors cursor-pointer border border-neutral-700/60"
            >
              ← Back to All Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedFullDate = formatCompletedDate(project.completedAt);

  return (
    <article className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12 text-left">
      
      {/* Back Link */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Project Header */}
      <header className="space-y-6 border-b border-neutral-800/80 pb-8">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {project.title}
        </h1>

        {/* Status Badges & Creation/Completion Dates */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {project.isFeatured && (
            <span className="text-xs font-semibold tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full uppercase">
              Featured Project
            </span>
          )}
          {project.isOnGoing && (
            <span className="text-xs font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
              In Progress
            </span>
          )}
          {project.isFinished && (
            <span className="text-xs font-semibold tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full uppercase">
              Production Completed
            </span>
          )}
          {completedFullDate && (
            <span className="text-xs font-mono text-neutral-300 bg-neutral-950 border border-neutral-800 px-3 py-1 rounded-full">
              Completed: {completedFullDate}
            </span>
          )}
          <span className="text-xs text-neutral-500 font-mono ml-1">
            Created: {new Date(project.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
          </span>
        </div>

        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal pt-2">
          {project.summary}
        </p>

        {/* Action Row: Demo & GitHub Repository */}
        <div className="flex items-center gap-4 pt-3 flex-wrap">
          {project.demoUrl && project.demoUrl.trim().length > 0 && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-950/60 hover:shadow-indigo-500/20"
            >
              Live Demo →
            </a>
          )}
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 font-medium text-xs sm:text-sm transition-colors"
            >
              View GitHub Repository
            </a>
          )}
        </div>
      </header>

      {/* Full-Resolution Thumbnail Visual */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-neutral-800/80 bg-neutral-950 shadow-2xl">
        {project.thumbnailUrl && project.thumbnailUrl.trim().length > 0 ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}

        {(!project.thumbnailUrl || project.thumbnailUrl.trim().length === 0) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-neutral-900 to-neutral-950 text-center p-6 select-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              In Development
            </div>
            <p className="text-neutral-500 text-xs font-mono max-w-sm">
              Visual preview for this engineering project is being prepared.
            </p>
          </div>
        )}
      </div>

      {/* Project Description & Architecture Details */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          System Architecture & Overview
        </h2>
        <div className="text-neutral-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans bg-neutral-900/40 p-6 sm:p-8 rounded-3xl border border-neutral-800/80 shadow-lg">
          {project.description}
        </div>
      </section>

      {/* Associated Tech Tags */}
      <section className="space-y-4 pt-4 border-t border-neutral-800/80">
        <h3 className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
          Technologies & Tools
        </h3>
        <div className="flex gap-2 flex-wrap">
          {project.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag.toLowerCase().replace(/^#+/, '')}`}
              className="text-xs bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/50 text-neutral-300 hover:text-indigo-400 px-3.5 py-1.5 rounded-xl font-mono transition-colors"
            >
              #{tag.replace(/^#+/, '')}
            </Link>
          ))}
        </div>
      </section>

      {/* Associated Engineering Devlogs */}
      {devlogs.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-neutral-800/80">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Associated Engineering Devlogs
            </h2>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {devlogs.length}
            </span>
          </div>

          <div className="space-y-3">
            {devlogs.map((log) => (
              <Link
                key={log.id}
                to={`/devlogs/${log.slug}`}
                className="block p-5 sm:p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all hover:translate-x-1 shadow-md"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-100 text-sm sm:text-base">{log.title}</h3>
                    <p className="text-neutral-400 text-xs sm:text-sm mt-1 line-clamp-1 leading-relaxed">{log.content}</p>
                  </div>
                  <span className="text-xs text-neutral-500 font-mono shrink-0">
                    {new Date(log.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Navigation */}
      <div className="pt-8 border-t border-neutral-800/80 flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 hover:underline cursor-pointer"
        >
          <span>←</span>
          <span>Back to All Projects</span>
        </Link>
        <Link
          to="/contact"
          className="text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          Inquire about this build →
        </Link>
      </div>

    </article>
  );
}