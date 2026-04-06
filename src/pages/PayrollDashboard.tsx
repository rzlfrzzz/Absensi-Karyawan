import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { payrollService, PayrollRecord } from '../services/payrollService';
import { adminService } from '../services/adminService';
import { userManagementService } from '../services/userManagementService';
import { CreatePayrollForm } from '../components/Payroll/CreatePayrollForm';
import { PaymentTrackingForm } from '../components/Payroll/PaymentTrackingForm';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Karyawan } from '../types';
import { showNotification } from '../utils/helpers';

export const PayrollDashboard = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (!currentUser || !userManagementService.canCreatePayroll(currentUser.role)) {
      showNotification('error', 'Akses Ditolak', 'Hanya HR Admin yang bisa');
      navigate('/backoffice', { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [payrollData, karyawanData] = await Promise.all([
        payrollService.getAllPayrolls(),
        adminService.getAllKaryawan(),
      ]);
      setPayrolls(payrollData);
      setKaryawan(karyawanData);
    } catch (error) {
      showNotification('error', 'Error', 'Gagal load data');
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-slate-900">💰 Payroll Dashboard</h1>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => navigate('/backoffice')}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
            >
              ← Kembali
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all"
            >
              ➕ Create
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 font-black uppercase text-[9px]">
              <tr>
                <th className="p-6">#</th>
                <th className="p-6">Employee</th>
                <th className="p-6">Period</th>
                <th className="p-6 text-right">Salary</th>
                <th className="p-6">Status</th>
                <th className="p-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payrolls.map((p, idx) => {
                const emp = karyawan.find((k) => k.id === p.karyawan_id);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 group">
                    <td className="p-6 font-black text-slate-300">{idx + 1}</td>
                    <td className="p-6 font-bold">{emp?.nama}</td>
                    <td className="p-6">{p.periode_start}</td>
                    <td className="p-6 text-right font-bold">{formatCurrency(p.total_gaji)}</td>
                    <td className="p-6"><span className="px-2 py-1 rounded text-[8px] font-black bg-emerald-100 text-emerald-700">{p.status}</span></td>
                    <td className="p-6 opacity-0 group-hover:opacity-100">
                      <button onClick={() => setSelectedPayroll(p)} className="mr-2">👁️</button>
                      {p.status === 'approved' && (
                        <button onClick={() => { setSelectedPayroll(p); setShowPaymentForm(true); }}>💰</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showCreateForm && <CreatePayrollForm onSuccess={() => { setShowCreateForm(false); fetchData(); }} onCancel={() => setShowCreateForm(false)} />}
        {showPaymentForm && selectedPayroll && <PaymentTrackingForm payroll={selectedPayroll} onSuccess={() => { setShowPaymentForm(false); setSelectedPayroll(null); fetchData(); }} onCancel={() => { setShowPaymentForm(false); setSelectedPayroll(null); }} />}
        {selectedPayroll && !showPaymentForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-black mb-6">Details</h2>
              <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between"><span>Total:</span><span className="font-black text-emerald-600">{formatCurrency(selectedPayroll.total_gaji)}</span></div>
              </div>
              <button onClick={() => setSelectedPayroll(null)} className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
