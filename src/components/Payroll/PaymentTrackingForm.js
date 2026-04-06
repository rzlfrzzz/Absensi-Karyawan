import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { payrollService } from '../../services/payrollService';
import { adminService } from '../../services/adminService';
import { showNotification } from '../../utils/helpers';
export const PaymentTrackingForm = ({ payroll, onSuccess, onCancel, }) => {
    const [employee, setEmployee] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
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
                if (emp)
                    setEmployee(emp);
            }
            // Fetch payment methods from database
            // For now, use mock data
            const mockMethods = [
                { id: '1', name: 'Bank Transfer BCA', type: 'bank_transfer' },
                { id: '2', name: 'Bank Transfer Mandiri', type: 'bank_transfer' },
                { id: '3', name: 'Bank Transfer BRI', type: 'bank_transfer' },
                { id: '4', name: 'Cash Payment', type: 'cash' },
                { id: '5', name: 'Check Payment', type: 'check' },
            ];
            setPaymentMethods(mockMethods);
            setSelectedPaymentMethod(mockMethods[0].id);
        }
        catch (error) {
            console.error('Failed to fetch data:', error);
            showNotification('error', 'Error', 'Gagal load data');
        }
    };
    const validateForm = () => {
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
        if (!validateForm())
            return;
        if (!confirm('Confirm payment untuk employee ini?'))
            return;
        try {
            setLoading(true);
            // Mark payroll as paid
            const success = await payrollService.markPayrollAsPaid(payroll.id, '', // paid_by - akan di-set dari auth context
            selectedPaymentMethod);
            if (!success) {
                throw new Error('Failed to mark payroll as paid');
            }
            showNotification('success', 'Sukses', `Payroll berhasil di-mark as PAID. Reference: ${referenceNumber || paymentDate}`);
            onSuccess();
        }
        catch (error) {
            showNotification('error', 'Error', String(error));
        }
        finally {
            setLoading(false);
        }
    };
    const formatCurrency = (value) => {
        const num = parseInt(value) || 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };
    const selectedMethod = paymentMethods.find((m) => m.id === selectedPaymentMethod);
    const isBankTransfer = selectedMethod?.type === 'bank_transfer';
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsx("h2", { className: "text-2xl font-black mb-2", children: "\uD83D\uDCB3 Payment Tracking" }), _jsx("p", { className: "text-slate-500 text-sm mb-6", children: "Record pembayaran payroll untuk employee" }), _jsxs("div", { className: "space-y-4", children: [employee && (_jsx("div", { className: "bg-slate-50 p-4 rounded-xl", children: _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500 font-bold uppercase", children: "Employee" }), _jsx("p", { className: "text-lg font-black text-slate-900", children: employee.nama })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500 font-bold uppercase", children: "Position" }), _jsx("p", { className: "text-lg font-black text-slate-900", children: employee.jabatan })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500 font-bold uppercase", children: "Period" }), _jsxs("p", { className: "text-lg font-black text-slate-900", children: [payroll.periode_start, " to ", payroll.periode_end] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-500 font-bold uppercase", children: "Amount" }), _jsx("p", { className: "text-lg font-black text-emerald-600", children: formatCurrency(payroll.total_gaji.toString()) })] })] }) })), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Payment Method ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { value: selectedPaymentMethod, onChange: (e) => setSelectedPaymentMethod(e.target.value), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200", children: [_jsx("option", { value: "", children: "-- Select Method --" }), paymentMethods.map((m) => (_jsx("option", { value: m.id, children: m.name }, m.id)))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Payment Date ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "date", value: paymentDate, onChange: (e) => setPaymentDate(e.target.value), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Amount ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200" }), _jsx("div", { className: "absolute right-3 top-3 text-slate-500 text-sm font-bold", children: formatCurrency(amount) })] })] }), isBankTransfer && (_jsxs("div", { className: "bg-blue-50 p-4 rounded-xl space-y-4 border-2 border-blue-200", children: [_jsx("h3", { className: "font-black text-slate-900", children: "\uD83C\uDFE6 Bank Transfer Details" }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Reference Number / Transfer ID ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: referenceNumber, onChange: (e) => setReferenceNumber(e.target.value), placeholder: "e.g., TRF123456789 or recipient account number", className: "w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300" })] }), _jsxs("div", { className: "text-xs text-blue-700 bg-blue-100 p-3 rounded-lg", children: [_jsx("p", { className: "font-bold mb-1", children: "\uD83D\uDCA1 Reference Number bisa berisi:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Transfer reference number dari bank" }), _jsx("li", { children: "Recipient account number" }), _jsx("li", { children: "Receipt number / slip number" })] })] })] })), (selectedMethod?.type === 'cash' || selectedMethod?.type === 'check') && (_jsxs("div", { className: "bg-amber-50 p-4 rounded-xl space-y-4 border-2 border-amber-200", children: [_jsx("h3", { className: "font-black text-slate-900", children: selectedMethod?.type === 'cash' ? '💵 Cash Payment' : '🧾 Check Payment' }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: ["Reference Number (Receipt/Check No) ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { type: "text", value: referenceNumber, onChange: (e) => setReferenceNumber(e.target.value), placeholder: selectedMethod?.type === 'cash' ? 'Receipt number' : 'Check number', className: "w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300" })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Notes (Optional)" }), _jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "e.g., Payment confirmation, remarks, etc.", rows: 3, className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-200 resize-none" })] }), _jsxs("div", { className: "bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200", children: [_jsx("h3", { className: "font-black text-slate-900 mb-3", children: "\u2705 Payment Summary" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-600", children: "Amount:" }), _jsx("span", { className: "font-black text-emerald-600", children: formatCurrency(amount) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-600", children: "Method:" }), _jsx("span", { className: "font-bold", children: selectedMethod?.name || '-' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-600", children: "Date:" }), _jsx("span", { className: "font-bold", children: paymentDate })] }), _jsxs("div", { className: "border-t border-emerald-200 pt-2 mt-2 flex justify-between font-black", children: [_jsx("span", { children: "Status:" }), _jsx("span", { className: "text-emerald-600", children: "\u2713 PAID" })] })] })] })] }), _jsxs("div", { className: "flex gap-3 mt-8", children: [_jsx("button", { onClick: onCancel, className: "flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50", disabled: loading, children: "Cancel" }), _jsx("button", { onClick: handleSubmit, disabled: loading, className: "flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'Processing...' : '💳 Confirm Payment' })] })] }) }));
};
