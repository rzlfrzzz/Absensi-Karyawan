import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const LogoutButton: React.FC = () => {
  const { logout, getSessionInfo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const sessionInfo = getSessionInfo();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="relative group">
      {/* Logout Button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase transition-all"
        title={`${sessionInfo?.remaining_minutes || 0}m tersisa`}
      >
        <span className="text-lg">🚪</span>
        <span>Logout</span>
        {sessionInfo && (
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg">
            {sessionInfo.remaining_minutes}m
          </span>
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm mx-4">
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Logout Confirm
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              Apakah Anda yakin ingin logout? Session Anda akan berakhir.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm uppercase transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm uppercase transition-all disabled:bg-red-400"
              >
                {isLoading ? 'Logging out...' : 'Ya, Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
