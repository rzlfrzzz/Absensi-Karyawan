import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Holiday } from '../../types';
import { showNotification } from '../../utils/helpers';

// Mock data
const mockHolidays: Holiday[] = [
  { id: '1', tanggal: '2026-01-01', nama: 'Tahun Baru', jenis: 'nasional', is_paid_leave: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', tanggal: '2026-02-10', nama: 'Isra dan Mi\'raj', jenis: 'nasional', is_paid_leave: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export const HolidayCalendar = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tanggal: '',
    nama: '',
    jenis: 'custom' as 'nasional' | 'perusahaan' | 'custom',
    is_paid_leave: true,
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadHolidays();
  }, [selectedYear]);

  const loadHolidays = () => {
    setLoading(true);
    try {
      // TODO: Replace dengan API call
      setHolidays(mockHolidays);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId('new');
    setFormData({
      tanggal: '',
      nama: '',
      jenis: 'custom',
      is_paid_leave: true,
    });
  };

  const handleEdit = (holiday: Holiday) => {
    setEditingId(holiday.id);
    setFormData({
      tanggal: holiday.tanggal,
      nama: holiday.nama,
      jenis: holiday.jenis,
      is_paid_leave: holiday.is_paid_leave,
    });
  };

  const handleSave = () => {
    if (!formData.tanggal || !formData.nama) {
      showNotification('error', 'Error', 'Tanggal dan nama harus diisi');
      return;
    }

    try {
      if (editingId === 'new') {
        showNotification('success', 'Sukses', 'Holiday berhasil ditambahkan');
      } else if (editingId) {
        showNotification('success', 'Sukses', 'Holiday berhasil diupdate');
      }

      setEditingId(null);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to save holiday');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus holiday ini?')) {
      try {
        showNotification('success', 'Sukses', 'Holiday berhasil dihapus');
      } catch (error) {
        showNotification('error', 'Error', 'Failed to delete holiday');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
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
      {/* Header with Year Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-sm"
          >
            ← Tahun Lalu
          </button>
          <span className="text-xl font-black text-slate-900">{selectedYear}</span>
          <button
            onClick={() => setSelectedYear(selectedYear + 1)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-sm"
          >
            Tahun Depan →
          </button>
        </div>

        {editingId === null && (
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg"
          >
            + Tambah Holiday
          </button>
        )}
      </div>

      {/* Edit Form */}
      {editingId !== null && (
        <div className="bg-white rounded-2xl p-6 border-2 border-indigo-100">
          <h3 className="text-lg font-black text-slate-900 mb-4">
            {editingId === 'new' ? 'Tambah Holiday' : 'Edit Holiday'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Tanggal
              </label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) =>
                  setFormData({ ...formData, tanggal: e.target.value })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Nama Holiday
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                placeholder="Natal, Lebaran, dll"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Jenis
              </label>
              <select
                value={formData.jenis}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jenis: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="nasional">Nasional</option>
                <option value="perusahaan">Perusahaan</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer mt-6">
                <input
                  type="checkbox"
                  checked={formData.is_paid_leave}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_paid_leave: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
                <span className="font-bold text-slate-700">Paid Leave?</span>
              </label>
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

      {/* Holidays List */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Tanggal
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Nama
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Jenis
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Paid Leave
              </th>
              <th className="text-left p-4 text-xs font-black text-slate-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday) => (
              <tr key={holiday.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">
                  {new Date(holiday.tanggal).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4 text-slate-600">{holiday.nama}</td>
                <td className="p-4">
                  <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-600 rounded-lg uppercase">
                    {holiday.jenis}
                  </span>
                </td>
                <td className="p-4">
                  {holiday.is_paid_leave ? (
                    <span className="text-green-600 font-bold">✅ Ya</span>
                  ) : (
                    <span className="text-red-600 font-bold">❌ Tidak</span>
                  )}
                </td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => handleEdit(holiday)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(holiday.id)}
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

      {holidays.length === 0 && editingId === null && (
        <div className="text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-bold">
            Belum ada holiday untuk tahun {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
};
