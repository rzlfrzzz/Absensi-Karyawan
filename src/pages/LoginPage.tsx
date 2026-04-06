import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    try {
      await login(email, password);
      navigate('/backoffice', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50 p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 italic uppercase mb-2">
            Digital<span className="text-indigo-600">Absensi</span>
          </h1>
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">
            Backoffice Admin Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <h2 className="text-2xl font-black text-slate-900 mb-1">Login</h2>
          <p className="text-slate-400 text-sm font-bold mb-6">
            Masukkan kredensial untuk akses backoffice
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 font-bold text-sm">❌ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                autoFocus
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e as any)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all"
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 mt-6 transition-all active:scale-95 disabled:cursor-not-allowed"
            >
              {isLoading ? '🔄 Memproses...' : '🔐 Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-xs font-black text-blue-600 uppercase mb-3">
              📝 Demo Credentials:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Admin:</span>
                <span className="text-slate-900 font-mono font-bold">
                  admin / admin123
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Manager:</span>
                <span className="text-slate-900 font-mono font-bold">
                  manager / manager123
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Staff:</span>
                <span className="text-slate-900 font-mono font-bold">
                  staff / staff123
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400 font-bold">
            Session timeout: 1 jam • Plain password (demo only)
          </p>
        </div>
      </div>
    </div>
  );
};
