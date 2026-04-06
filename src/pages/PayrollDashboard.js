import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { payrollService } from '../services/payrollService';
import { adminService } from '../services/adminService';
import { userManagementService } from '../services/userManagementService';
import { CreatePayrollForm } from '../components/Payroll/CreatePayrollForm';
import { PaymentTrackingForm } from '../components/Payroll/PaymentTrackingForm';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { showNotification } from '../utils/helpers';
export const PayrollDashboard = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [payrolls, setPayrolls] = useState([]);
    const [karyawan, setKaryawan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState(null);
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
        }
        catch (error) {
            showNotification('error', 'Error', 'Gagal load data');
        }
        finally {
            setLoading(false);
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    if (loading) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("p", { children: "Loading..." }) });
    }
    return (_jsx("div", { className: "min-h-screen bg-[#F8FAFC] p-6 md:p-12", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-12", children: [_jsx("h1", { className: "text-4xl font-black text-slate-900", children: "\uD83D\uDCB0 Payroll Dashboard" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(LanguageSwitcher, {}), _jsx("button", { onClick: () => navigate('/backoffice'), className: "px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all", children: "\u2190 Kembali" }), _jsx("button", { onClick: () => setShowCreateForm(true), className: "px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all", children: "\u2795 Create" })] })] }), _jsx("div", { className: "bg-white rounded-3xl shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-slate-50 font-black uppercase text-[9px]", children: _jsxs("tr", { children: [_jsx("th", { className: "p-6", children: "#" }), _jsx("th", { className: "p-6", children: "Employee" }), _jsx("th", { className: "p-6", children: "Period" }), _jsx("th", { className: "p-6 text-right", children: "Salary" }), _jsx("th", { className: "p-6", children: "Status" }), _jsx("th", { className: "p-6", children: "Action" })] }) }), _jsx("tbody", { className: "divide-y", children: payrolls.map((p, idx) => {
                                    const emp = karyawan.find((k) => k.id === p.karyawan_id);
                                    return (_jsxs("tr", { className: "hover:bg-slate-50 group", children: [_jsx("td", { className: "p-6 font-black text-slate-300", children: idx + 1 }), _jsx("td", { className: "p-6 font-bold", children: emp?.nama }), _jsx("td", { className: "p-6", children: p.periode_start }), _jsx("td", { className: "p-6 text-right font-bold", children: formatCurrency(p.total_gaji) }), _jsx("td", { className: "p-6", children: _jsx("span", { className: "px-2 py-1 rounded text-[8px] font-black bg-emerald-100 text-emerald-700", children: p.status }) }), _jsxs("td", { className: "p-6 opacity-0 group-hover:opacity-100", children: [_jsx("button", { onClick: () => setSelectedPayroll(p), className: "mr-2", children: "\uD83D\uDC41\uFE0F" }), p.status === 'approved' && (_jsx("button", { onClick: () => { setSelectedPayroll(p); setShowPaymentForm(true); }, children: "\uD83D\uDCB0" }))] })] }, p.id));
                                }) })] }) }), showCreateForm && _jsx(CreatePayrollForm, { onSuccess: () => { setShowCreateForm(false); fetchData(); }, onCancel: () => setShowCreateForm(false) }), showPaymentForm && selectedPayroll && _jsx(PaymentTrackingForm, { payroll: selectedPayroll, onSuccess: () => { setShowPaymentForm(false); setSelectedPayroll(null); fetchData(); }, onCancel: () => { setShowPaymentForm(false); setSelectedPayroll(null); } }), selectedPayroll && !showPaymentForm && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-3xl p-8 max-w-md w-full", children: [_jsx("h2", { className: "text-2xl font-black mb-6", children: "Details" }), _jsx("div", { className: "space-y-2 text-sm mb-6", children: _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Total:" }), _jsx("span", { className: "font-black text-emerald-600", children: formatCurrency(selectedPayroll.total_gaji) })] }) }), _jsx("button", { onClick: () => setSelectedPayroll(null), className: "w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold", children: "Close" })] }) }))] }) }));
};
