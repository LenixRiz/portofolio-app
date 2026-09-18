import { useState } from 'react';
import AdminProjects from './AdminProjects';
import AdminIllustrations from './AdminIllustrations';
import AdminDevlogs from './AdminDevlogs';
import { authService } from '../../services/api';

type Tab = 'projects' | 'devlogs' | 'illustrations';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CMS Management Console</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Panel administrasi headless terpusat untuk portofolio dan devlog.
          </p>
        </div>

        {/* Tab Switcher State-based */}
        <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('devlogs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'devlogs'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Devlogs
          </button>
          <button
            onClick={() => setActiveTab('illustrations')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'illustrations'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Illustrations
          </button>

          {/* Tombol Logout */}
          <button
            onClick={() => authService.logout()}
            className="px-3 py-2 rounded-xl text-xs font-medium text-red-400 bg-red-950/20 hover:bg-red-950/50 border border-red-900/40 transition-colors cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* Konten Tab Aktif */}
      <main>
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'devlogs' && <AdminDevlogs />}
        {activeTab === 'illustrations' && <AdminIllustrations />}
      </main>
    </div>
  );
}