import { useState } from 'react';
import AdminProjects from './AdminProjects';
import AdminIllustrations from './AdminIllustrations';
import AdminDevlogs from './AdminDevlogs';
import AdminMessages from './AdminMessages'; // Impor modul pesan
import AdminCvManager from '../../components/AdminCvManager';
import { authService } from '../../services/api';

type Tab = 'projects' | 'devlogs' | 'illustrations' | 'messages';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CMS Management Console</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Panel administrasi headless terpusat untuk portofolio dan devlog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded-xl flex-wrap">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'projects' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('devlogs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'devlogs' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Devlogs
            </button>
            <button
              onClick={() => setActiveTab('illustrations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'illustrations' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Illustrations
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'messages' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Inquiries ✉️
            </button>
          </div>

          <button
            onClick={() => authService.logout()}
            className="px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 bg-red-950/20 hover:bg-red-950/50 border border-red-900/40 transition-colors cursor-pointer"
          >
            Keluar
          </button>
        </div>
      </header>

      <AdminCvManager />
      <main>
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'devlogs' && <AdminDevlogs />}
        {activeTab === 'illustrations' && <AdminIllustrations />}
        {activeTab === 'messages' && <AdminMessages />}
      </main>
    </div>
  );
}