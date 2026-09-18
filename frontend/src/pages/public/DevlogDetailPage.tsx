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
    return <div className="max-w-4xl mx-auto p-8 text-neutral-400">Memuat artikel devlog...</div>;
  }

  if (error || !devlog) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h2 className="text-xl font-bold text-red-400">Devlog Tidak Ditemukan</h2>
          <p className="text-neutral-400 text-sm">
            Artikel dengan slug &ldquo;{slug}&rdquo; tidak tersedia atau belum dipublikasikan.
          </p>
          <Link
            to="/devlogs"
            className="inline-block px-4 py-2 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            ← Kembali ke Semua Devlog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-8">
      <Link
        to="/devlogs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-indigo-400 transition-colors mb-6 cursor-pointer"
      >
        ← Kembali ke Semua Devlog
      </Link>

      <header className="pb-6 border-b border-neutral-800 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {devlog.projectTitle && (
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded font-mono">
              📁 {devlog.projectTitle}
            </span>
          )}
          <span className="text-xs text-neutral-500 font-mono">
            {new Date(devlog.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {devlog.title}
        </h1>

        <div className="flex gap-2 flex-wrap pt-2">
          {devlog.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 px-2.5 py-0.5 rounded font-mono"
            >
              #{tag.replace(/^#+/, '')}
            </span>
          ))}
        </div>
      </header>

      {/* Konten Markdown Terformat dengan Syntax Highlighting */}
      <div className="mt-8 text-neutral-300 leading-relaxed font-sans text-sm space-y-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-neutral-800 pb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold text-neutral-100 mt-5 mb-2">{children}</h3>,
            p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-3 pl-2 text-neutral-300">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-3 pl-2 text-neutral-300">{children}</ol>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-500 bg-neutral-900/60 px-4 py-3 my-4 italic text-neutral-400 rounded-r-lg">
                {children}
              </blockquote>
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              return isInline ? (
                <code className="bg-neutral-900 text-indigo-300 font-mono text-xs px-1.5 py-0.5 rounded border border-neutral-800" {...props}>
                  {children}
                </code>
              ) : (
                <code className={`${className} font-mono text-xs leading-relaxed`} {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="overflow-x-auto rounded-xl bg-neutral-950 border border-neutral-800 p-4 my-5 text-xs shadow-inner">
                {children}
              </pre>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="w-full text-left border-collapse border border-neutral-800 text-xs">{children}</table>
              </div>
            ),
            th: ({ children }) => <th className="border border-neutral-800 bg-neutral-900 p-2.5 font-semibold text-neutral-200">{children}</th>,
            td: ({ children }) => <td className="border border-neutral-800 p-2.5 text-neutral-400">{children}</td>,
          }}
        >
          {devlog.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}