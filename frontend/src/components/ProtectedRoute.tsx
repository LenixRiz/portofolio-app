import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/api';

export default function ProtectedRoute() {
  const isAuth = authService.isAuthenticated();

  // Jika tidak memiliki token, arahkan paksa ke halaman login
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}