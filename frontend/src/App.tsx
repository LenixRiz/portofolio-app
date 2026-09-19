import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import IllustrationsPage from './pages/public/IllustrationsPage';
import ProjectsPage from './pages/public/ProjectsPage';
import DevlogsPage from './pages/public/DevlogsPage';
import DevlogDetailPage from './pages/public/DevlogDetailPage';
import HomePage from './pages/public/Homepage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/admin/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer'; // 1. Impor Footer

function Navbar() {
  const location = useLocation();

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-neutral-100 hover:text-white">
          Portfolio<span className="text-indigo-500">.</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link
            to="/projects"
            className={`${location.pathname === '/projects' ? 'text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Projects
          </Link>
          <Link
            to="/illustrations"
            className={`${location.pathname === '/illustrations' ? 'text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Art & Illustrations
          </Link>
          <Link
            to="/devlogs"
            className={`${location.pathname === '/devlogs' ? 'text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Devlogs
          </Link>
          <Link
            to="/contact"
            className={`${location.pathname === '/contact' ? 'text-white font-medium' : 'text-neutral-400 hover:text-neutral-200'}`}
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Layout Pembungkus dengan Flexbox agar Footer selalu rapi di bawah */}
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between">
        <div>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/illustrations" element={<IllustrationsPage />} />
              <Route path="/devlogs" element={<DevlogsPage />} />
              <Route path="/devlogs/:slug" element={<DevlogDetailPage key={window.location.pathname} />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Rute CMS Admin */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
        </div>

        {/* 2. Pasang Footer di sini */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}