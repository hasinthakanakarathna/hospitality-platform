/**
 * ProtectedRoute — ensures user is authenticated and has required role access.
 * Redirects to /login if unauthenticated, or to / if unauthorized for that route.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasAccess } from '../../utils/roles';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredModule }) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="text-sm font-medium text-text-secondary">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredModule && !hasAccess(userProfile.role, requiredModule)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
