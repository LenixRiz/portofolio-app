import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';
import NotFoundPage from './pages/public/NotFoundPage';
import IllustrationsPage from './pages/public/IllustrationsPage';
import ProjectsPage from './pages/public/ProjectsPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import DevlogsPage from './pages/public/DevlogsPage';
import DevlogDetailPage from './pages/public/DevlogDetailPage';
import HomePage from './pages/public/Homepage';
import ContactPage from './pages/public/ContactPage';
import AboutPage from './pages/public/AboutPage';
import LoginPage from './pages/admin/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import TagExplorerPage from './pages/public/TagExplorerPage';
import SearchPage from './pages/public/SearchPage';
import Footer from './components/Footer';

function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper pemeriksa rute aktif cerdas (mendukung sub-rute slug)
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Branding */}
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          className="font-bold text-lg text-white hover:text-neutral-200 transition-colors tracking-tight flex items-center gap-1"
        >
          <span>CreatedByLenix</span>
          <span className="text-indigo-500 font-mono">.</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium">
          <Link
            to="/projects"
            className={`transition-colors ${
              isActive('/projects') ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Projects
          </Link>

          <Link
            to="/illustrations"
            className={`transition-colors ${
              isActive('/illustrations') ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Art
          </Link>

          <Link
            to="/devlogs"
            className={`transition-colors ${
              isActive('/devlogs') ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Devlogs
          </Link>

          <Link
            to="/contact"
            className={`transition-colors ${
              isActive('/contact') ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Contact
          </Link>

          <Link
            to="/about"
            className={`transition-colors ${
              isActive('/about') ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            About
          </Link>

          {/* Global Search Button */}
          <Link
            to="/search"
            aria-label="Global Search"
            title="Global Search"
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isActive('/search')
                ? 'bg-neutral-900 border-indigo-500/50 text-indigo-400'
                : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </Link>
        </div>

        {/* Mobile Actions: Search & Hamburger Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Search"
            className="p-2 text-neutral-400 hover:text-white"
          >
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white cursor-pointer rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {/* Cukup berikan onClick pada kontainer ini agar setiap klik di dalam menu otomatis menutup drawer */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden border-b border-neutral-800 bg-neutral-950/95 px-6 py-5 space-y-4 text-sm font-medium"
        >
          <Link
            to="/projects"
            className={`block py-1.5 transition-colors ${
              isActive('/projects') ? 'text-indigo-400 font-semibold' : 'text-neutral-300'
            }`}
          >
            Projects
          </Link>

          <Link
            to="/illustrations"
            className={`block py-1.5 transition-colors ${
              isActive('/illustrations') ? 'text-indigo-400 font-semibold' : 'text-neutral-300'
            }`}
          >
            Art
          </Link>

          <Link
            to="/devlogs"
            className={`block py-1.5 transition-colors ${
              isActive('/devlogs') ? 'text-indigo-400 font-semibold' : 'text-neutral-300'
            }`}
          >
            Devlogs
          </Link>

          <Link
            to="/contact"
            className={`block py-1.5 transition-colors ${
              isActive('/contact') ? 'text-indigo-400 font-semibold' : 'text-neutral-300'
            }`}
          >
            Contact
          </Link>

          <Link
            to="/about"
            className={`block py-1.5 transition-colors ${
              isActive('/about') ? 'text-indigo-400 font-semibold' : 'text-neutral-300'
            }`}
          >
            About
          </Link>
        </div>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      {/* Wrapper Layout Bersih dengan Flexbox */}
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
        <div>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage key={window.location.pathname} />} />
              <Route path="/illustrations" element={<IllustrationsPage />} />
              <Route path="/devlogs" element={<DevlogsPage />} />
              <Route path="/devlogs/:slug" element={<DevlogDetailPage key={window.location.pathname} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/tags/:slug" element={<TagExplorerPage key={window.location.pathname} />} />
              
              {/* Rute CMS Admin */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Rute wildcard 404 di urutan paling akhir */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}