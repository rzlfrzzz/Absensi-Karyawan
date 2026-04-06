import React, { useState, useEffect } from 'react';
import { Karyawan } from '../../types';
import { payrollService, PayrollCalculation } from '../../services/payrollService';
import { adminService } from '../../services/adminService';
import { showNotification } from '../../utils/helpers';

interface CreatePayrollFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const CreatePayrollForm: React.FC<CreatePayrollFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [selectedKaryawanId, setSelectedKaryawanId] = useState('');
  const [periode, setPeriode] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);
  const [customDeductions, setCustomDeductions] = useState<
    Array<{ description: string; amount: number }>
  >([]);
  const [newDeduction, setNewDeduction] = useState({ description: '', amount: 0 });

  // Fetch karyawan
  useEffect(() => {
    fetchKaryawan();
  }, []);

  const fetchKaryawan = async () => {
    try {
      const data = await adminService.getAllKaryawan();
      // Filter active karyawan (jika ada active field)
      setKaryawan(data);
    } catch (error) {
      console.error('Failed to fetch karyawan:', error);
      showNotification('error', 'Error', 'Gagal load employee data');
    }
  };

  // Auto-calculate payroll saat employee atau periode berubah
  useEffect(() => {
    if (selectedKaryawanId && periode) {
      calculatePayroll();
    }
  }, [selectedKaryawanId, periode, customDeductions]);

  const calculatePayroll = async () => {
    try {
      setCalculating(true);

      const employee = karyawan.find((k) => k.id === selectedKaryawanId);
      if (!employee || !periode) {
        setCalculation(null);
        return;
      }

      // Parse periode (YYYY-MM)
      const [year, month] = periode.split('-');
      const startDate = `${year}-${month}-01`;

      // Get last day of month
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const endDate = `${year}-${month}-${lastDay}`;

      const calc = await payrollService.calculatePayroll(
        employee,
        startDate,
        endDate,
        customDeductions
      );

      setCalculation(calc);
    } catch (error) {
      console.error('Failed to calculate payroll:', error);
      showNotification('error', 'Error', 'Gagal calculate payroll');
      setCalculation(null);
    } finally {
      setCalculating(false);
    }
  };

  const handleAddDeduction = () => {
    if (!newDeduction.description || newDeduction.amount <= 0) {
      showNotification('error', 'Invalid', 'Deduction harus memiliki deskripsi dan amount');
      return;
    }

    setCustomDeductions([...customDeductions, newDeduction]);
    setNewDeduction({ description: '', amount: 0 });
  };

  const handleRemoveDeduction = (index: number) => {
    setCustomDeductions(customDeductions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedKaryawanId || !periode || !calculation) {
      showNotification('error', 'Required', 'Silakan isi semua field');
      return;
    }

    if (!confirm('Create payroll untuk employee ini?')) return;

    try {
      setLoading(true);

      const employee = karyawan.find((k) => k.id === selectedKaryawanId);
      if (!employee) return;

      const [year, month] = periode.split('-');
      const startDate = `${year}-${month}-01`;
      const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
      const endDate = `${year}-${month}-${lastDay}`;

      const payrollRecord = {
        karyawan_id: selectedKaryawanId,
        periode_start: startDate,
        periode_end: endDate,
        frequency_type: 'monthly' as const,
        gaji_pokok: calculation.gaji_pokok,
        bonus_on_time: calculation.bonus_on_time,
        bonus_early_checkout: calculation.bonus_early_checkout,
        bonus_other: calculation.bonus_other,
        total_deductions: calculation.total_deductions,
        tax_pph21: calculation.tax_pph21,
        custom_deductions: calculation.deduction_custom,
        total_gaji: calculation.net_salary,
        status: 'draft' as const,
      };

      const { success } = await payrollService.createPayroll(
        payrollRecord,
        calculation.details
      );

      if (success) {
        showNotification(
          'success',
          'Sukses',
          'Payroll berhasil dibuat. Status: DRAFT'
        );
        onSuccess();
      }
    } catch (error) {
      showNotification('error', 'Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const selectedEmployee = karyawan.find((k) => k.id === selectedKaryawanId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-black mb-6">Create New Payroll</h2>

        {/* Employee Selection */}
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-600 uppercase mb-2">
            Select Employee
          </label>
          <select
            value={selectedKaryawanId}
            onChange={(e) => setSelectedKaryawanId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">-- Pilih Employee --</option>
            {karyawan.map((k: Karyawan) => (
              <option key={k.id} value={k.id}>
                {k.nama} ({k.jabatan})
              </option>
            ))}
          </select>
        </div>

        {/* Period Selection */}
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-600 uppercase mb-2">
            Periode (Month)
          </label>
          <input
            type="month"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Calculation Preview */}
        {calculation && selectedEmployee && (
          <div className="mb-6 bg-slate-50 p-4 rounded-2xl">
            <h3 className="font-black text-slate-900 mb-4">Calculation Preview</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Gaji Pokok:</span>
                <span className="font-bold">{formatCurrency(calculation.gaji_pokok)}</span>
              </div>

              {calculation.bonus_on_time > 0 && (
                <div className="flex justify-between">
                  <span className="text-emerald-600">+ Bonus On-Time:</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(calculation.bonus_on_time)}
                  </span>
                </div>
              )}

              {calculation.bonus_early_checkout > 0 && (
                <div className="flex justify-between">
                  <span className="text-emerald-600">+ Bonus Early Checkout:</span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrency(calculation.bonus_early_checkout)}
                  </span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Gross Salary:</span>
                  <span>{formatCurrency(calculation.gross_salary)}</span>
                </div>
              </div>

              {calculation.deduction_late > 0 && (
                <div className="flex justify-between">
                  <span className="text-red-600">- Deduction (Late):</span>
                  <span className="font-bold text-red-600">
                    -{formatCurrency(calculation.deduction_late)}
                  </span>
                </div>
              )}

              {calculation.deduction_absent > 0 && (
                <div className="flex justify-between">
                  <span className="text-red-600">- Deduction (Absent):</span>
                  <span className="font-bold text-red-600">
                    -{formatCurrency(calculation.deduction_absent)}
                  </span>
                </div>
              )}

              {calculation.tax_pph21 > 0 && (
                <div className="flex justify-between">
                  <span className="text-red-600">- Tax PPh21:</span>
                  <span className="font-bold text-red-600">
                    -{formatCurrency(calculation.tax_pph21)}
                  </span>
                </div>
              )}

              <div className="border-t border-slate-200 pt-2 mt-2">
                <div className="flex justify-between font-black text-lg">
                  <span>Total Gaji (NET):</span>
                  <span className="text-emerald-600">
                    {formatCurrency(calculation.net_salary)}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom Deductions */}
            {customDeductions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Custom Deductions</h4>
                <div className="space-y-1 text-sm">
                  {customDeductions.map((d, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-slate-600">{d.description}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-600">
                          -{formatCurrency(d.amount)}
                        </span>
                        <button
                          onClick={() => handleRemoveDeduction(idx)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Deductions Input */}
        {selectedKaryawanId && periode && (
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
            <h4 className="font-black text-slate-900 mb-3">Add Custom Deduction (Optional)</h4>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Description"
                value={newDeduction.description}
                onChange={(e) =>
                  setNewDeduction({ ...newDeduction, description: e.target.value })
                }
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newDeduction.amount || ''}
                onChange={(e) =>
                  setNewDeduction({ ...newDeduction, amount: parseInt(e.target.value) || 0 })
                }
                className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                onClick={handleAddDeduction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {calculating && (
          <div className="text-center py-4 text-slate-500">
            Calculating payroll...
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !calculation || calculating}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Payroll'}
          </button>
        </div>
      </div>
    </div>
  );
};
