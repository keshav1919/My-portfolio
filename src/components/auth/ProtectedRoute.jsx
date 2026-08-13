import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingScreen } from '../common/LoadingScreen';
import { ShieldAlert } from 'lucide-react';

export function ProtectedRoute({ children }) {
  const { user, loading, isBlocked } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isBlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="kc-card max-w-md p-8 border-kc-danger/30 bg-kc-surface flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-kc-danger/15 text-kc-danger flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-kc-text mb-2">Account Suspended</h2>
          <p className="text-sm text-kc-muted leading-relaxed mb-6">
            Your KeshavCoder account has been restricted by an administrator. If you believe this is an error, please contact support.
          </p>
          <a href="mailto:keshav8847426788@gmail.com" className="kc-btn-secondary text-sm">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return children;
}
