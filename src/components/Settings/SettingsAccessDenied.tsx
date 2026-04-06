import React from 'react';
import { Link } from 'react-router-dom';

export const SettingsAccessDenied = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Access Denied</h1>
        <p className="text-slate-600 text-sm mb-6">
          Hanya admin yang dapat mengakses halaman settings management.
        </p>
        <div className="space-y-3">
          <Link
            to="/backoffice"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
