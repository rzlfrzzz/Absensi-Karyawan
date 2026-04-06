import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CompanySettings } from '../../types';
import { showNotification } from '../../utils/helpers';

// Mock data
const mockCompanySettings: any = {
  id: '1',
  nama_perusahaan: 'BuyMoreWorkers',
  alamat: 'Jl. Contoh No. 123',
  phone: '021-1234567',
  email: 'info@buymoreworkers.com',
  currency: 'IDR',
  fiscal_year_start: '01-01',
  updated_at: new Date().toISOString(),
};

export const CompanySettingsForm = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CompanySettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setLoading(true);
    try {
      // TODO: Replace dengan API call
      setSettings(mockCompanySettings);
      setFormData(mockCompanySettings);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load company settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!formData) return;

    if (
      !formData.nama_perusahaan ||
      !formData.alamat ||
      !formData.phone ||
      !formData.email
    ) {
      showNotification('error', 'Error', 'Semua field harus diisi');
      return;
    }

    try {
      showNotification('success', 'Sukses', 'Company settings berhasil disimpan');
      setIsEditing(false);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to save company settings');
    }
  };

  const handleCancel = () => {
    setFormData(settings);
    setIsEditing(false);
  };

  if (loading || !settings || !formData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg"
        >
          ✏️ Edit Settings
        </button>
      )}

      {/* Display Mode */}
      {!isEditing && (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">
                Nama Perusahaan
              </p>
              <p className="text-2xl font-black text-slate-900">
                {settings.nama_perusahaan}
              </p>
            </div>

            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">
                Alamat
              </p>
              <p className="text-lg text-slate-700">{settings.alamat}</p>
            </div>

            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">
                Phone
              </p>
              <p className="text-lg text-slate-700">{settings.phone}</p>
            </div>

            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">
                Email
              </p>
              <p className="text-lg text-slate-700">{settings.email}</p>
            </div>

            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">
                Currency
              </p>
              <p className="text-lg text-slate-700 font-bold">{settings.currency}</p>
            </div>

            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">
                Fiscal Year Start
              </p>
              <p className="text-lg text-slate-700 font-bold">
                {new Date(2024, settings.fiscal_year_start - 1).toLocaleDateString('id-ID', {
                  month: 'long',
                })}
              </p>
            </div>

            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">
                Max Terlambat Per Bulan
              </p>
              <p className="text-lg text-slate-700 font-bold">
                {settings.max_terlambat_per_bulan || '-'} hari
              </p>
            </div>

            <div>
              <p className="text-xs font-black text-slate-400 uppercase mb-1">
                Max Absent Per Bulan
              </p>
              <p className="text-lg text-slate-700 font-bold">
                {settings.max_absent_per_bulan || '-'} hari
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-400">
              Last updated: {new Date(settings.updated_at).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="bg-white rounded-2xl p-8 border-2 border-indigo-100 space-y-6">
          <h3 className="text-lg font-black text-slate-900">Edit Company Settings</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Nama Perusahaan
              </label>
              <input
                type="text"
                value={formData.nama_perusahaan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nama_perusahaan: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Alamat
              </label>
              <textarea
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alamat: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="IDR">IDR (Indonesia)</option>
                  <option value="USD">USD (Dollar)</option>
                  <option value="SGD">SGD (Singapore)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Fiscal Year Start Month
                </label>
                <select
                  value={formData.fiscal_year_start}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fiscal_year_start: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {[
                    'Januari',
                    'Februari',
                    'Maret',
                    'April',
                    'Mei',
                    'Juni',
                    'Juli',
                    'Agustus',
                    'September',
                    'Oktober',
                    'November',
                    'Desember',
                  ].map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Max Terlambat Per Bulan
                </label>
                <input
                  type="number"
                  value={formData.max_terlambat_per_bulan || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_terlambat_per_bulan: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Max Absent Per Bulan
                </label>
                <input
                  type="number"
                  value={formData.max_absent_per_bulan || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_absent_per_bulan: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg"
            >
              ✅ Simpan
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm uppercase transition-all"
            >
              ❌ Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
