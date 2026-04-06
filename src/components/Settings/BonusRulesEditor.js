import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { showNotification } from '../../utils/helpers';
// Mock data
const mockBonusRules = {
    id: '1',
    bonus_ontime_tipe: 'per_hari',
    bonus_early_checkout_tipe: 'per_hari',
    deduction_late_tipe: 'per_hari',
    tax_pph21_tipe: 'per_bulan',
};
export const BonusRulesEditor = () => {
    const { user } = useAuth();
    const [rules, setRules] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    useEffect(() => {
        loadRules();
    }, []);
    const loadRules = () => {
        setLoading(true);
        try {
            // TODO: Replace dengan API call
            setRules(mockBonusRules);
            setFormData(mockBonusRules);
        }
        catch (error) {
            showNotification('error', 'Error', 'Failed to load bonus rules');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = () => {
        if (!formData)
            return;
        try {
            setRules(formData);
            showNotification('success', 'Sukses', 'Bonus rules berhasil disimpan');
        }
        catch (error) {
            showNotification('error', 'Error', 'Failed to save bonus rules');
        }
    };
    const handleReset = () => {
        setFormData(rules);
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    if (loading || !formData) {
        return (_jsx("div", { className: "flex items-center justify-center p-8", children: _jsx("div", { className: "animate-spin text-4xl", children: "\u23F3" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-100", children: [_jsx("h3", { className: "text-lg font-black text-slate-900 mb-4", children: "\uD83D\uDCB0 Bonus On-time" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Tipe Bonus" }), _jsxs("select", { value: formData.bonus_ontime_tipe, onChange: (e) => setFormData({
                                            ...formData,
                                            bonus_ontime_tipe: e.target.value,
                                        }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100", children: [_jsx("option", { value: "per_hari", children: "Per Hari" }), _jsx("option", { value: "per_bulan", children: "Per Bulan" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Jumlah (Rp)" }), _jsx("input", { type: "number", value: formData.bonus_ontime_jumlah, onChange: (e) => setFormData({
                                            ...formData,
                                            bonus_ontime_jumlah: parseInt(e.target.value) || 0,
                                        }), min: "0", step: "10000", className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["= ", formatCurrency(formData.bonus_ontime_jumlah)] })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-100", children: [_jsx("h3", { className: "text-lg font-black text-slate-900 mb-4", children: "\u23F0 Potongan Terlambat" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Tipe Potongan" }), _jsxs("select", { value: formData.potongan_terlambat_tipe, onChange: (e) => setFormData({
                                            ...formData,
                                            potongan_terlambat_tipe: e.target.value,
                                        }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100", children: [_jsx("option", { value: "per_menit", children: "Per Menit" }), _jsx("option", { value: "per_15menit", children: "Per 15 Menit" }), _jsx("option", { value: "per_jam", children: "Per Jam" }), _jsx("option", { value: "flat", children: "Flat (Regardless of Time)" })] }), _jsxs("p", { className: "text-xs text-slate-400 mt-1", children: [formData.potongan_terlambat_tipe === 'per_menit' && '✏️ Contoh: Terlambat 10 menit = 10 × jumlah', formData.potongan_terlambat_tipe === 'per_15menit' && '✏️ Contoh: Terlambat 10 menit = 1 × jumlah (≥15 menit)', formData.potongan_terlambat_tipe === 'per_jam' && '✏️ Contoh: Terlambat 30 menit = 1 × jumlah', formData.potongan_terlambat_tipe === 'flat' && '✏️ Contoh: Berapa pun terlambat = 1 × jumlah'] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Jumlah (Rp)" }), _jsx("input", { type: "number", value: formData.potongan_terlambat_jumlah, onChange: (e) => setFormData({
                                            ...formData,
                                            potongan_terlambat_jumlah: parseInt(e.target.value) || 0,
                                        }), min: "0", step: "5000", className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["= ", formatCurrency(formData.potongan_terlambat_jumlah)] })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-100", children: [_jsx("h3", { className: "text-lg font-black text-slate-900 mb-4", children: "\uD83D\uDEAB Potongan Absent" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Tipe Potongan" }), _jsxs("select", { value: formData.potongan_absent_tipe, onChange: (e) => setFormData({
                                            ...formData,
                                            potongan_absent_tipe: e.target.value,
                                        }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100", children: [_jsx("option", { value: "per_hari", children: "Per Hari" }), _jsx("option", { value: "flat", children: "Flat" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Jumlah (Rp)" }), _jsx("input", { type: "number", value: formData.potongan_absent_jumlah, onChange: (e) => setFormData({
                                            ...formData,
                                            potongan_absent_jumlah: parseInt(e.target.value) || 0,
                                        }), min: "0", step: "10000", className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["= ", formatCurrency(formData.potongan_absent_jumlah)] })] })] })] }), _jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-100", children: [_jsx("h3", { className: "text-lg font-black text-slate-900 mb-4", children: "\u2B06\uFE0F Early Checkout" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: formData.early_checkout_allowed, onChange: (e) => setFormData({
                                            ...formData,
                                            early_checkout_allowed: e.target.checked,
                                        }), className: "w-5 h-5" }), _jsx("span", { className: "font-bold text-slate-700", children: "Izinkan Early Checkout?" })] }), formData.early_checkout_allowed && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Bonus Early Checkout (Rp)" }), _jsx("input", { type: "number", value: formData.bonus_early_checkout || 0, onChange: (e) => setFormData({
                                            ...formData,
                                            bonus_early_checkout: parseInt(e.target.value) || 0,
                                        }), min: "0", step: "10000", className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["= ", formatCurrency(formData.bonus_early_checkout || 0)] })] }))] })] }), _jsxs("div", { className: "flex gap-3 justify-end", children: [_jsx("button", { onClick: handleReset, className: "px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm uppercase transition-all", children: "\u21A9\uFE0F Reset" }), _jsx("button", { onClick: handleSave, className: "px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg", children: "\u2705 Simpan Perubahan" })] }), _jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-2xl", children: _jsx("p", { className: "text-xs text-blue-600 font-bold", children: "\uD83D\uDCA1 Semua pengaturan ini akan digunakan dalam kalkulasi gaji otomatis" }) })] }));
};
