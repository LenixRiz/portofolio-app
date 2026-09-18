import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import IllustrationsPage from './pages/public/IllustrationsPage';
import ProjectsPage from './pages/public/ProjectsPage';
import DevlogsPage from './pages/public/DevlogsPage';
import DevlogDetailPage from './pages/public/DevlogDetailPage';

function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-neutral-100 hover:text-white">
          Portfolio<span className="text-indigo-500">.</span>
        </Link>
        <div className="flex gap-6 text-sm">
          <Link
            to="/projects"
            className={`${location.pathname === '/projects' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Projects
          </Link>
          <Link
            to="/illustrations"
            className={`${location.pathname === '/illustrations' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Art & Illustrations
          </Link>
          <Link
            to="/devlogs"
            className={`${location.pathname === '/devlogs' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Devlogs
          </Link>
          <Link
            to="/admin"
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              isAdmin
                ? 'bg-indigo-600 text-white'
                : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-700'
            }`}
          >
            CMS Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-neutral-100">
      <h1 className="text-4xl font-extrabold tracking-tight mt-12 mb-4">
        Selamat Datang di Portofolio
      </h1>
      <p className="text-neutral-400 max-w-2xl text-lg">
        Menampilkan rekayasa perangkat lunak, arsitektur backend, simulasi game, dan karya ilustrasi digital.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/illustrations" element={<IllustrationsPage />} />
          
          {/* Rute Katalog Devlog Publik */}
          <Route path="/devlogs" element={<DevlogsPage />} />
          {/* Rute Unik Tiap Artikel berdasarkan Slug */}
          <Route path="/devlogs/:slug" element={<DevlogDetailPage />} />

          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}