import React, { useState, useEffect } from 'react';
import { payrollService, PayrollRecord } from '../../services/payrollService';
import { adminService } from '../../services/adminService';
import { Karyawan } from '../../types';
import { showNotification } from '../../utils/helpers';

interface PaymentTrackingFormProps {
  payroll: PayrollRecord;
  onSuccess: () => void;
  onCancel: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
}

export const PaymentTrackingForm: React.FC<PaymentTrackingFormProps> = ({
  payroll,
  onSuccess,
  onCancel,
}) => {
  const [employee, setEmployee] = useState<Karyawan | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [amount, setAmount] = useState(payroll.total_gaji.toString());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch employee
      if (payroll.karyawan_id) {
        const allKaryawan = await adminService.getAllKaryawan();
        const emp = allKaryawan.find((k) => k.id === payroll.karyawan_id);
        if (emp) setEmployee(emp);
      }

      // Fetch payment methods from database
      // For now, use mock data
      const mockMethods: PaymentMethod[] = [
        { id: '1', name: 'Bank Transfer BCA', type: 'bank_transfer' },
        { id: '2', name: 'Bank Transfer Mandiri', type: 'bank_transfer' },
        { id: '3', name: 'Bank Transfer BRI', type: 'bank_transfer' },
        { id: '4', name: 'Cash Payment', type: 'cash' },
        { id: '5', name: 'Check Payment', type: 'check' },
      ];
      setPaymentMethods(mockMethods);
      setSelectedPaymentMethod(mockMethods[0].id);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showNotification('error', 'Error', 'Gagal load data');
    }
  };

  const validateForm = (): boolean => {
    if (!selectedPaymentMethod) {
      showNotification('error', 'Validation', 'Pilih payment method');
      return false;
    }

    if (!paymentDate) {
      showNotification('error', 'Validation', 'Pilih payment date');
      return false;
    }

    if (!amount || parseInt(amount) <= 0) {
      showNotification('error', 'Validation', 'Amount harus lebih dari 0');
      return false;
    }

    // For bank transfers, reference number is required
    const method = paymentMethods.find((m) => m.id === selectedPaymentMethod);
    if (method?.type === 'bank_transfer' && !referenceNumber.trim()) {
      showNotification('error', 'Validation', 'Transfer reference/no rekening harus diisi');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!confirm('Confirm payment untuk employee ini?')) return;

    try {
      setLoading(true);

      // Mark payroll as paid
      const success = await payrollService.markPayrollAsPaid(
        payroll.id!,
        '', // paid_by - akan di-set dari auth context
        selectedPaymentMethod
      );

      if (!success) {
        throw new Error('Failed to mark payroll as paid');
      }

      showNotification(
        'success',
        'Sukses',
        `Payroll berhasil di-mark as PAID. Reference: ${referenceNumber || paymentDate}`
      );
      onSuccess();
    } catch (error) {
      showNotification('error', 'Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseInt(value) || 0;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const selectedMethod = paymentMethods.find((m) => m.id === selectedPaymentMethod);
  const isBankTransfer = selectedMethod?.type === 'bank_transfer';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-black mb-2">💳 Payment Tracking</h2>
        <p className="text-slate-500 text-sm mb-6">
          Record pembayaran payroll untuk employee
        </p>

        <div className="space-y-4">
          {/* Employee Info */}
          {employee && (
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Employee</p>
                  <p className="text-lg font-black text-slate-900">{employee.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Position</p>
                  <p className="text-lg font-black text-slate-900">{employee.jabatan}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Period</p>
                  <p className="text-lg font-black text-slate-900">
                    {payroll.periode_start} to {payroll.periode_end}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Amount</p>
                  <p className="text-lg font-black text-emerald-600">
                    {formatCurrency(payroll.total_gaji.toString())}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">-- Select Method --</option>
              {paymentMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <div className="absolute right-3 top-3 text-slate-500 text-sm font-bold">
                {formatCurrency(amount)}
              </div>
            </div>
          </div>

          {/* Bank Transfer Details */}
          {isBankTransfer && (
            <div className="bg-blue-50 p-4 rounded-xl space-y-4 border-2 border-blue-200">
              <h3 className="font-black text-slate-900">🏦 Bank Transfer Details</h3>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Reference Number / Transfer ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g., TRF123456789 or recipient account number"
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div className="text-xs text-blue-700 bg-blue-100 p-3 rounded-lg">
                <p className="font-bold mb-1">💡 Reference Number bisa berisi:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Transfer reference number dari bank</li>
                  <li>Recipient account number</li>
                  <li>Receipt number / slip number</li>
                </ul>
              </div>
            </div>
          )}

          {/* Cash/Check Details */}
          {(selectedMethod?.type === 'cash' || selectedMethod?.type === 'check') && (
            <div className="bg-amber-50 p-4 rounded-xl space-y-4 border-2 border-amber-200">
              <h3 className="font-black text-slate-900">
                {selectedMethod?.type === 'cash' ? '💵 Cash Payment' : '🧾 Check Payment'}
              </h3>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2">
                  Reference Number (Receipt/Check No) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder={selectedMethod?.type === 'cash' ? 'Receipt number' : 'Check number'}
                  className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Payment confirmation, remarks, etc."
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
            />
          </div>

          {/* Summary */}
          <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
            <h3 className="font-black text-slate-900 mb-3">✅ Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Amount:</span>
                <span className="font-black text-emerald-600">
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Method:</span>
                <span className="font-bold">{selectedMethod?.name || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="font-bold">{paymentDate}</span>
              </div>
              <div className="border-t border-emerald-200 pt-2 mt-2 flex justify-between font-black">
                <span>Status:</span>
                <span className="text-emerald-600">✓ PAID</span>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : '💳 Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};
