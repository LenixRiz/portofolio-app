import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { devlogService } from '../../services/api';
import type { Devlog } from '../../types';

export default function DevlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [devlog, setDevlog] = useState<Devlog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let ignore = false;
    devlogService.getBySlug(slug)
      .then((data) => {
        if (!ignore) {
          setDevlog(data);
          setLoading(false);
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
        <p className="text-neutral-500 text-sm font-mono">Loading devlog article...</p>
      </div>
    );
  }

  if (error || !devlog) {
    return (
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 text-left">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 space-y-4 shadow-xl">
          <h2 className="text-2xl font-bold text-red-400">Devlog Not Found</h2>
          <p className="text-neutral-400 text-sm">
            The article with identifier &ldquo;{slug}&rdquo; does not exist or has not been published.
          </p>
          <div className="pt-2">
            <Link
              to="/devlogs"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl transition-colors cursor-pointer border border-neutral-700/60"
            >
              ← Back to All Devlogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12 text-left">
      
      {/* Back Link */}
      <div>
        <Link
          to="/devlogs"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>Back to All Devlogs</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-6 pb-8 border-b border-neutral-800/80">
        <div className="flex items-center gap-3 flex-wrap">
          {devlog.projectTitle && (
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-mono">
              {devlog.projectTitle}
            </span>
          )}
          <span className="text-xs text-neutral-500 font-mono">
            {new Date(devlog.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {devlog.title}
        </h1>

        {/* Clickable Tags */}
        <div className="flex gap-2 flex-wrap pt-2">
          {devlog.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag.toLowerCase().replace(/^#+/, '')}`}
              className="text-xs bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-indigo-400 px-3 py-1 rounded-lg font-mono transition-colors"
            >
              #{tag.replace(/^#+/, '')}
            </Link>
          ))}
        </div>
      </header>

      {/* Formatted Markdown Content with Syntax Highlighting */}
      <div className="text-neutral-300 leading-relaxed font-sans text-base space-y-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-10 mb-4 border-b border-neutral-800 pb-3">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-neutral-100 mt-6 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-neutral-300 font-normal">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-outside space-y-1.5 my-4 pl-6 text-neutral-300">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-outside space-y-1.5 my-4 pl-6 text-neutral-300">
                {children}
              </ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-500 bg-neutral-900/50 px-5 py-4 my-6 italic text-neutral-400 rounded-r-2xl border-y border-r border-neutral-800/40">
                {children}
              </blockquote>
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code className="bg-neutral-900 text-indigo-300 font-mono text-xs px-2 py-0.5 rounded-md border border-neutral-800" {...props}>
                  {children}
                </code>
              ) : (
                <code className={`${className} font-mono text-xs leading-relaxed`} {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="overflow-x-auto rounded-2xl bg-neutral-950 border border-neutral-800/90 p-5 my-6 text-xs shadow-xl">
                {children}
              </pre>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6 rounded-2xl border border-neutral-800">
                <table className="w-full text-left border-collapse text-xs">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border-b border-neutral-800 bg-neutral-900/80 p-3 font-semibold text-neutral-200">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-b border-neutral-800/60 p-3 text-neutral-400">
                {children}
              </td>
            ),
          }}
        >
          {devlog.content}
        </ReactMarkdown>
      </div>

      {/* Bottom Navigation */}
      <div className="pt-10 border-t border-neutral-800/80 flex items-center justify-between">
        <Link
          to="/devlogs"
          className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 hover:underline cursor-pointer"
        >
          <span>←</span>
          <span>Back to All Devlogs</span>
        </Link>
        <Link
          to="/contact"
          className="text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          Discuss this topic →
        </Link>
      </div>

    </article>
  );
}