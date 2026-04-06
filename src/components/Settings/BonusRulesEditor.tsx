import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BonusDeductionRules } from '../../types';
import { showNotification } from '../../utils/helpers';

// Mock data
const mockBonusRules: any = {
  id: '1',
  bonus_ontime_tipe: 'per_hari',
  bonus_early_checkout_tipe: 'per_hari',
  deduction_late_tipe: 'per_hari',
  tax_pph21_tipe: 'per_bulan',
};

export const BonusRulesEditor = () => {
  const { user } = useAuth();
  const [rules, setRules] = useState<BonusDeductionRules | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<BonusDeductionRules | null>(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = () => {
    setLoading(true);
    try {
      // TODO: Replace dengan API call
      setRules(mockBonusRules);
      setFormData(mockBonusRules);
    } catch (error) {
      showNotification('error', 'Error', 'Failed to load bonus rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!formData) return;

    try {
      setRules(formData);
      showNotification('success', 'Sukses', 'Bonus rules berhasil disimpan');
    } catch (error) {
      showNotification('error', 'Error', 'Failed to save bonus rules');
    }
  };

  const handleReset = () => {
    setFormData(rules);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bonus On-time */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-4">💰 Bonus On-time</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Tipe Bonus
            </label>
            <select
              value={formData.bonus_ontime_tipe}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bonus_ontime_tipe: e.target.value as 'per_hari' | 'per_bulan',
                })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="per_hari">Per Hari</option>
              <option value="per_bulan">Per Bulan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Jumlah (Rp)
            </label>
            <input
              type="number"
              value={formData.bonus_ontime_jumlah}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bonus_ontime_jumlah: parseInt(e.target.value) || 0,
                })
              }
              min="0"
              step="10000"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <p className="text-xs text-slate-500 mt-1">
              = {formatCurrency(formData.bonus_ontime_jumlah)}
            </p>
          </div>
        </div>
      </div>

      {/* Potongan Terlambat */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-4">⏰ Potongan Terlambat</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Tipe Potongan
            </label>
            <select
              value={formData.potongan_terlambat_tipe}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  potongan_terlambat_tipe: e.target.value as any,
                })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="per_menit">Per Menit</option>
              <option value="per_15menit">Per 15 Menit</option>
              <option value="per_jam">Per Jam</option>
              <option value="flat">Flat (Regardless of Time)</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              {formData.potongan_terlambat_tipe === 'per_menit' && '✏️ Contoh: Terlambat 10 menit = 10 × jumlah'}
              {formData.potongan_terlambat_tipe === 'per_15menit' && '✏️ Contoh: Terlambat 10 menit = 1 × jumlah (≥15 menit)'}
              {formData.potongan_terlambat_tipe === 'per_jam' && '✏️ Contoh: Terlambat 30 menit = 1 × jumlah'}
              {formData.potongan_terlambat_tipe === 'flat' && '✏️ Contoh: Berapa pun terlambat = 1 × jumlah'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Jumlah (Rp)
            </label>
            <input
              type="number"
              value={formData.potongan_terlambat_jumlah}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  potongan_terlambat_jumlah: parseInt(e.target.value) || 0,
                })
              }
              min="0"
              step="5000"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <p className="text-xs text-slate-500 mt-1">
              = {formatCurrency(formData.potongan_terlambat_jumlah)}
            </p>
          </div>
        </div>
      </div>

      {/* Potongan Absent */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-4">🚫 Potongan Absent</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Tipe Potongan
            </label>
            <select
              value={formData.potongan_absent_tipe}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  potongan_absent_tipe: e.target.value as 'per_hari' | 'flat',
                })
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="per_hari">Per Hari</option>
              <option value="flat">Flat</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Jumlah (Rp)
            </label>
            <input
              type="number"
              value={formData.potongan_absent_jumlah}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  potongan_absent_jumlah: parseInt(e.target.value) || 0,
                })
              }
              min="0"
              step="10000"
              className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <p className="text-xs text-slate-500 mt-1">
              = {formatCurrency(formData.potongan_absent_jumlah)}
            </p>
          </div>
        </div>
      </div>

      {/* Early Checkout */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-4">⬆️ Early Checkout</h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.early_checkout_allowed}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  early_checkout_allowed: e.target.checked,
                })
              }
              className="w-5 h-5"
            />
            <span className="font-bold text-slate-700">Izinkan Early Checkout?</span>
          </label>

          {formData.early_checkout_allowed && (
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                Bonus Early Checkout (Rp)
              </label>
              <input
                type="number"
                value={formData.bonus_early_checkout || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bonus_early_checkout: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
                step="10000"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p className="text-xs text-slate-500 mt-1">
                = {formatCurrency(formData.bonus_early_checkout || 0)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm uppercase transition-all"
        >
          ↩️ Reset
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg"
        >
          ✅ Simpan Perubahan
        </button>
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
        <p className="text-xs text-blue-600 font-bold">
          💡 Semua pengaturan ini akan digunakan dalam kalkulasi gaji otomatis
        </p>
      </div>
    </div>
  );
};
