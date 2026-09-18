import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import IllustrationsPage from './pages/public/IllustrationsPage';
import ProjectsPage from './pages/public/ProjectsPage';
import DevlogsPage from './pages/public/DevlogsPage';
import DevlogDetailPage from './pages/public/DevlogDetailPage';
import Homepage from './pages/public/Homepage';
import LoginPage from './pages/admin/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

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

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/illustrations" element={<IllustrationsPage />} />
          <Route path="/devlogs" element={<DevlogsPage />} />
          <Route path="/devlogs/:slug" element={<DevlogDetailPage key={window.location.pathname} />} />

          {/* Rute Otentikasi Admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}