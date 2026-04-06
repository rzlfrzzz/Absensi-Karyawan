import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { GajiSettingPerJabatan } from '../../types';
import { showNotification } from '../../utils/helpers';

// Mock data
const mockGajiSettings: GajiSettingPerJabatan[] = [
  { id: '1', jabatan: 'Manager', gaji_pokok: 5000000, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', jabatan: 'Staff', gaji_pokok: 3000000, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const GajiSettingsTable = () => {
  const { user } = useAuth();
  const [gajiList, setGajiList] = useState<GajiSettingPerJabatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jabatan: '',
    gaji_pokok: 0,
  });

  useEffect(() => {
    loadGaji();
  }, []);

  const loadGaji = () => {
    setLoading(true);
    try {
      // TODO: Replace dengan API call
      setGajiList(mockGajiSettings);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load gaji settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({
      jabatan: '',
      gaji_pokok: 0,
    });
  };

  const handleEdit = (gaji: GajiSettingPerJabatan) => {
    setEditingId(gaji.id);
    setFormData({
      jabatan: gaji.jabatan,
      gaji_pokok: gaji.gaji_pokok,
    });
  };

  const handleSave = () => {
    if (!formData.jabatan || formData.gaji_pokok <= 0) {
      showNotification('error', 'Error', 'Jabatan dan gaji harus diisi dengan benar');
      return;
    }

    try {
      if (editingId === 'new') {
        showNotification('success', 'Sukses', 'Gaji berhasil ditambahkan');
      } else if (editingId) {
        showNotification('success', 'Sukses', 'Gaji berhasil diupdate');
      }

      setEditingId(null);
    } catch (error) {
      showNotification('error', 'Error', error instanceof Error ? error.message : 'Failed to save');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jabatan ini?')) {
      try {
        showNotification('success', 'Sukses', 'Gaji berhasil dihapus');
      } catch (error) {
        showNotification('error', 'Error', 'Failed to delete gaji');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      jabatan: '',
      gaji_pokok: 0,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div className="flex justify-end">
        {editingId === null && (
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg"
          >
            + Tambah Jabatan
          </button>
        )}
      </div>

      {/* Edit Form */}
      {editingId !== null && (
        <div className="bg-white rounded-2xl p-6 border-2 border-indigo-100">
          <h3 className="text-lg font-black text-slate-900 mb-4">
            {editingId === 'new' ? 'Tambah Jabatan Baru' : 'Edit Gaji'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Jabatan
              </label>
              <input
                type="text"
                value={formData.jabatan}
                onChange={(e) =>
                  setFormData({ ...formData, jabatan: e.target.value })
                }
                placeholder="Penjahit, Admin, HRD, dll"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Gaji Pokok (Rp)
              </label>
              <input
                type="number"
                value={formData.gaji_pokok}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gaji_pokok: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="2000000"
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p className="text-xs text-slate-500 mt-1">
                = {formatCurrency(formData.gaji_pokok)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm uppercase transition-all"
            >
              ✅ Simpan
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm uppercase transition-all"
            >
              ❌ Batal
            </button>
          </div>
        </div>
      )}

      {/* Gaji Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Jabatan
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Gaji Pokok
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Last Updated
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {gajiList.map((gaji) => (
              <tr key={gaji.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{gaji.jabatan}</td>
                <td className="p-4 text-slate-600 font-bold">{formatCurrency(gaji.gaji_pokok)}</td>
                <td className="p-4 text-xs text-slate-400">
                  {new Date(gaji.updated_at).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => handleEdit(gaji)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gaji.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-sm"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {gajiList.length === 0 && editingId === null && (
        <div className="text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-bold">
            Belum ada jabatan. Klik "Tambah Jabatan" untuk membuat.
          </p>
        </div>
      )}

      {/* Note */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
        <p className="text-xs text-blue-600 font-bold">
          💡 Note: Karyawan dapat memiliki gaji override per-individu. Gaji yang ditampilkan di sini adalah default per jabatan.
        </p>
      </div>
    </div>
  );
};
