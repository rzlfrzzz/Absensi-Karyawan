import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { payrollService } from '../../services/payrollService';
import { adminService } from '../../services/adminService';
import { showNotification } from '../../utils/helpers';
export const CreatePayrollForm = ({ onSuccess, onCancel, }) => {
    const [karyawan, setKaryawan] = useState([]);
    const [selectedKaryawanId, setSelectedKaryawanId] = useState('');
    const [periode, setPeriode] = useState('');
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [calculation, setCalculation] = useState(null);
    const [customDeductions, setCustomDeductions] = useState([]);
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
        }
        catch (error) {
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
            const calc = await payrollService.calculatePayroll(employee, startDate, endDate, customDeductions);
            setCalculation(calc);
        }
        catch (error) {
            console.error('Failed to calculate payroll:', error);
            showNotification('error', 'Error', 'Gagal calculate payroll');
            setCalculation(null);
        }
        finally {
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
    const handleRemoveDeduction = (index) => {
        setCustomDeductions(customDeductions.filter((_, i) => i !== index));
    };
    const handleSubmit = async () => {
        if (!selectedKaryawanId || !periode || !calculation) {
            showNotification('error', 'Required', 'Silakan isi semua field');
            return;
        }
        if (!confirm('Create payroll untuk employee ini?'))
            return;
        try {
            setLoading(true);
            const employee = karyawan.find((k) => k.id === selectedKaryawanId);
            if (!employee)
                return;
            const [year, month] = periode.split('-');
            const startDate = `${year}-${month}-01`;
            const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
            const endDate = `${year}-${month}-${lastDay}`;
            const payrollRecord = {
                karyawan_id: selectedKaryawanId,
                periode_start: startDate,
                periode_end: endDate,
                frequency_type: 'monthly',
                gaji_pokok: calculation.gaji_pokok,
                bonus_on_time: calculation.bonus_on_time,
                bonus_early_checkout: calculation.bonus_early_checkout,
                bonus_other: calculation.bonus_other,
                total_deductions: calculation.total_deductions,
                tax_pph21: calculation.tax_pph21,
                custom_deductions: calculation.deduction_custom,
                total_gaji: calculation.net_salary,
                status: 'draft',
            };
            const { success } = await payrollService.createPayroll(payrollRecord, calculation.details);
            if (success) {
                showNotification('success', 'Sukses', 'Payroll berhasil dibuat. Status: DRAFT');
                onSuccess();
            }
        }
        catch (error) {
            showNotification('error', 'Error', String(error));
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
    const selectedEmployee = karyawan.find((k) => k.id === selectedKaryawanId);
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-3xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto", children: [_jsx("h2", { className: "text-2xl font-black mb-6", children: "Create New Payroll" }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Select Employee" }), _jsxs("select", { value: selectedKaryawanId, onChange: (e) => setSelectedKaryawanId(e.target.value), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200", children: [_jsx("option", { value: "", children: "-- Pilih Employee --" }), karyawan.map((k) => (_jsxs("option", { value: k.id, children: [k.nama, " (", k.jabatan, ")"] }, k.id)))] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Periode (Month)" }), _jsx("input", { type: "month", value: periode, onChange: (e) => setPeriode(e.target.value), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200" })] }), calculation && selectedEmployee && (_jsxs("div", { className: "mb-6 bg-slate-50 p-4 rounded-2xl", children: [_jsx("h3", { className: "font-black text-slate-900 mb-4", children: "Calculation Preview" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-600", children: "Gaji Pokok:" }), _jsx("span", { className: "font-bold", children: formatCurrency(calculation.gaji_pokok) })] }), calculation.bonus_on_time > 0 && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-emerald-600", children: "+ Bonus On-Time:" }), _jsx("span", { className: "font-bold text-emerald-600", children: formatCurrency(calculation.bonus_on_time) })] })), calculation.bonus_early_checkout > 0 && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-emerald-600", children: "+ Bonus Early Checkout:" }), _jsx("span", { className: "font-bold text-emerald-600", children: formatCurrency(calculation.bonus_early_checkout) })] })), _jsx("div", { className: "border-t border-slate-200 pt-2 mt-2", children: _jsxs("div", { className: "flex justify-between font-bold", children: [_jsx("span", { children: "Gross Salary:" }), _jsx("span", { children: formatCurrency(calculation.gross_salary) })] }) }), calculation.deduction_late > 0 && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-red-600", children: "- Deduction (Late):" }), _jsxs("span", { className: "font-bold text-red-600", children: ["-", formatCurrency(calculation.deduction_late)] })] })), calculation.deduction_absent > 0 && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-red-600", children: "- Deduction (Absent):" }), _jsxs("span", { className: "font-bold text-red-600", children: ["-", formatCurrency(calculation.deduction_absent)] })] })), calculation.tax_pph21 > 0 && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-red-600", children: "- Tax PPh21:" }), _jsxs("span", { className: "font-bold text-red-600", children: ["-", formatCurrency(calculation.tax_pph21)] })] })), _jsx("div", { className: "border-t border-slate-200 pt-2 mt-2", children: _jsxs("div", { className: "flex justify-between font-black text-lg", children: [_jsx("span", { children: "Total Gaji (NET):" }), _jsx("span", { className: "text-emerald-600", children: formatCurrency(calculation.net_salary) })] }) })] }), customDeductions.length > 0 && (_jsxs("div", { className: "mt-4 pt-4 border-t border-slate-200", children: [_jsx("h4", { className: "font-bold text-slate-900 mb-2", children: "Custom Deductions" }), _jsx("div", { className: "space-y-1 text-sm", children: customDeductions.map((d, idx) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-slate-600", children: [d.description, ":"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "font-bold text-red-600", children: ["-", formatCurrency(d.amount)] }), _jsx("button", { onClick: () => handleRemoveDeduction(idx), className: "text-red-500 hover:text-red-700 text-xs", children: "\u2715" })] })] }, idx))) })] }))] })), selectedKaryawanId && periode && (_jsxs("div", { className: "mb-6 p-4 bg-blue-50 rounded-2xl", children: [_jsx("h4", { className: "font-black text-slate-900 mb-3", children: "Add Custom Deduction (Optional)" }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx("input", { type: "text", placeholder: "Description", value: newDeduction.description, onChange: (e) => setNewDeduction({ ...newDeduction, description: e.target.value }), className: "flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200" }), _jsx("input", { type: "number", placeholder: "Amount", value: newDeduction.amount || '', onChange: (e) => setNewDeduction({ ...newDeduction, amount: parseInt(e.target.value) || 0 }), className: "w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200" }), _jsx("button", { onClick: handleAddDeduction, className: "px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all", children: "Add" })] })] })), calculating && (_jsx("div", { className: "text-center py-4 text-slate-500", children: "Calculating payroll..." })), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onCancel, className: "flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50", disabled: loading, children: "Cancel" }), _jsx("button", { onClick: handleSubmit, disabled: loading || !calculation || calculating, className: "flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Creating...' : 'Create Payroll' })] })] }) }));
};
