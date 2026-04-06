import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShiftSettings } from '../../types';
import { showNotification } from '../../utils/helpers';

// Mock data untuk sementara - replace dengan API call bila diperlukan
const mockShifts: ShiftSettings[] = [
  { id: '1', nama_shift: 'Shift Pagi', jam_masuk: '08:00', jam_pulang: '16:00', tolerance_menit: 15, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', nama_shift: 'Shift Siang', jam_masuk: '13:00', jam_pulang: '21:00', tolerance_menit: 15, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const ShiftSettingsForm = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<ShiftSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama_shift: '',
    jam_masuk: '',
    jam_pulang: '',
    tolerance_menit: 15,
  });

  useEffect(() => {
    loadShifts();
  }, []);

  const loadShifts = () => {
    setLoading(true);
    try {
      // TODO: Replace dengan API call
      setShifts(mockShifts);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({
      nama_shift: '',
      jam_masuk: '',
      jam_pulang: '',
      tolerance_menit: 15,
    });
  };

  const handleEdit = (shift: ShiftSettings) => {
    setEditingId(shift.id);
    setFormData({
      nama_shift: shift.nama_shift,
      jam_masuk: shift.jam_masuk,
      jam_pulang: shift.jam_pulang,
      tolerance_menit: shift.tolerance_menit,
    });
  };

  const handleSave = async () => {
    if (!formData.nama_shift || !formData.jam_masuk || !formData.jam_pulang) {
      showNotification('error', 'Error', 'Semua field harus diisi');
      return;
    }

    try {
      if (editingId === 'new') {
        showNotification('success', 'Sukses', 'Shift berhasil ditambahkan');
      } else if (editingId) {
        showNotification('success', 'Sukses', 'Shift berhasil diupdate');
      }

      setEditingId(null);
    } catch (error) {
      showNotification('error', 'Error', error instanceof Error ? error.message : 'Failed to save');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus shift ini?')) {
      try {
        showNotification('success', 'Sukses', 'Shift berhasil dihapus');
      } catch (error) {
        showNotification('error', 'Error', 'Failed to delete shift');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      nama_shift: '',
      jam_masuk: '',
      jam_pulang: '',
      tolerance_menit: 15,
    });
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
            + Tambah Shift
          </button>
        )}
      </div>

      {/* Edit Form */}
      {editingId !== null && (
        <div className="bg-white rounded-2xl p-6 border-2 border-indigo-100">
          <h3 className="text-lg font-black text-slate-900 mb-4">
            {editingId === 'new' ? 'Tambah Shift Baru' : 'Edit Shift'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Nama Shift
              </label>
              <input
                type="text"
                value={formData.nama_shift}
                onChange={(e) =>
                  setFormData({ ...formData, nama_shift: e.target.value })
                }
                placeholder="Siang, Malam, Custom, dll"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Jam Masuk
              </label>
              <input
                type="time"
                value={formData.jam_masuk}
                onChange={(e) =>
                  setFormData({ ...formData, jam_masuk: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Jam Pulang
              </label>
              <input
                type="time"
                value={formData.jam_pulang}
                onChange={(e) =>
                  setFormData({ ...formData, jam_pulang: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Tolerance (Menit)
              </label>
              <input
                type="number"
                value={formData.tolerance_menit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tolerance_menit: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                max="120"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
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

      {/* Shifts Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Shift
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Jam Masuk
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Jam Pulang
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Tolerance
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Status
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{shift.nama_shift}</td>
                <td className="p-4 text-slate-600">{shift.jam_masuk}</td>
                <td className="p-4 text-slate-600">{shift.jam_pulang}</td>
                <td className="p-4 text-slate-600">{shift.tolerance_menit} menit</td>
                <td className="p-4">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      shift.is_active
                        ? 'bg-green-100 text-green-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {shift.is_active ? '✅ Active' : '❌ Inactive'}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => handleEdit(shift)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(shift.id)}
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

      {shifts.length === 0 && editingId === null && (
        <div className="text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-bold">Belum ada shift. Klik "Tambah Shift" untuk membuat.</p>
        </div>
      )}
    </div>
  );
};
