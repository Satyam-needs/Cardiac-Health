import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-4 shadow-xl shadow-cyan-950/50">
          <HeartPulse className="w-8 h-8 animate-heartbeat text-cyan-400" />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Verifying secure session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated visitor to login while preserving target route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
