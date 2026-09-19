import { useState, type FormEvent } from 'react';
import { messageService } from '../../services/api';

export default function ContactPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'General',
    budget: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await messageService.send({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        category: form.category,
        budget: form.budget.trim() || null,
        message: form.message.trim(),
      });
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', category: 'General', budget: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-16 sm:py-24 space-y-12 sm:space-y-16 text-left">
      
      {/* 1. HEADER SECTION (Left-Aligned with Availability Badge) */}
      <header className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Open for Work & Commissions
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Let's build something <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            exceptional together.
          </span>
        </h1>

        <p className="text-neutral-400 text-base sm:text-lg leading-relaxed font-normal">
          Whether you have an inquiry regarding backend architecture with .NET 9, 2D game mechanics in Unity, or a custom digital illustration commission, feel free to send a message below.
        </p>
      </header>

      {/* 2. MAIN CONTENT GRID (Sidebar Channels + Inquiry Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Kolom Kiri: Direct Information & Platform Alternatives */}
        <aside className="lg:col-span-1 space-y-6">
          
          {/* Card: Response Time & Direct Email */}
          <div className="rounded-3xl bg-neutral-900/40 border border-neutral-800/80 p-6 sm:p-8 space-y-5 shadow-xl">
            <h2 className="text-sm font-mono uppercase tracking-wider text-indigo-400 font-semibold">
              Direct Contact
            </h2>
            
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-neutral-500 block mb-1">Direct Inquiries</span>
                <a 
                  href="mailto:contact@createdbylenix.my.id" 
                  className="text-neutral-200 hover:text-indigo-400 font-medium transition-colors font-mono text-xs"
                >
                  contact@createdbylenix.my.id
                </a>
              </div>

              <div>
                <span className="text-neutral-500 block mb-1">Location & Timezone</span>
                <span className="text-neutral-300">Indonesia (UTC+7 / WIB)</span>
              </div>

              <div>
                <span className="text-neutral-500 block mb-1">Expected Response Time</span>
                <span className="text-neutral-300">Within 24 to 48 hours</span>
              </div>
            </div>
          </div>

          {/* Card: Art Commission Escrow (VGen) */}
          <div className="rounded-3xl bg-neutral-900/40 border border-neutral-800/80 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono uppercase tracking-wider text-indigo-400 font-semibold">
                Art Commissions
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Verified
              </span>
            </div>
            
            <p className="text-neutral-400 text-xs leading-relaxed">
              For illustration work requiring protected milestone payments, commercial terms of service, and queue tracking:
            </p>

            <a
              href="https://vgen.co/rizlenix_"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white text-xs font-medium transition-colors group"
            >
              <span>Order via VGen Portal</span>
              <span className="text-neutral-500 group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>

        </aside>

        {/* Kolom Kanan: Structured Inquiry Form */}
        <div className="lg:col-span-2">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
            
            <div className="border-b border-neutral-800/80 pb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Send an Inquiry</h2>
              <p className="text-neutral-400 text-xs mt-1">Fill out the form and I will get back to you promptly.</p>
            </div>

            {/* Success Alert Banner */}
            {success && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl text-emerald-300 text-xs sm:text-sm flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Message sent successfully! Thank you, I will respond via email shortly.</span>
                </div>
                <button 
                  onClick={() => setSuccess(false)} 
                  className="text-emerald-400 hover:text-white text-xs font-mono p-0.5 cursor-pointer"
                  aria-label="Dismiss alert"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Error Alert Banner */}
            {error && (
              <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-2xl text-red-400 text-xs sm:text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                    Your Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-neutral-600"
                    placeholder="e.g. Alex Morgan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                    Email Address <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-neutral-600"
                    placeholder="alex@organization.com"
                  />
                </div>
              </div>

              {/* Row 2: Category & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                    Inquiry Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Project Collaboration">Software & Game Collaboration</option>
                    <option value="Art Commission">Art & Character Commission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                    Estimated Budget <span className="text-neutral-500 lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-neutral-600"
                    placeholder="e.g. $250 USD or Negotiable"
                  />
                </div>
              </div>

              {/* Row 3: Subject */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Subject Line <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-neutral-600"
                  placeholder="Summary of your proposal or request"
                />
              </div>

              {/* Row 4: Detailed Message */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-2">
                  Message Details <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-neutral-600 leading-relaxed font-sans"
                  placeholder="Outline project objectives, estimated deadlines, technical scope, or concept references..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-950/60 hover:shadow-indigo-500/20 active:scale-[0.99] cursor-pointer"
                >
                  {loading ? 'Sending Message...' : 'Send Inquiry Message →'}
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}