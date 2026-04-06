import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { showNotification } from '../../utils/helpers';
// Mock data
const mockCompanySettings = {
    id: '1',
    nama_perusahaan: 'BuyMoreWorkers',
    alamat: 'Jl. Contoh No. 123',
    phone: '021-1234567',
    email: 'info@buymoreworkers.com',
    currency: 'IDR',
    fiscal_year_start: '01-01',
    updated_at: new Date().toISOString(),
};
export const CompanySettingsForm = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);
    useEffect(() => {
        loadSettings();
    }, []);
    const loadSettings = () => {
        setLoading(true);
        try {
            // TODO: Replace dengan API call
            setSettings(mockCompanySettings);
            setFormData(mockCompanySettings);
        }
        catch (error) {
            showNotification('error', 'Error', 'Failed to load company settings');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = () => {
        if (!formData)
            return;
        if (!formData.nama_perusahaan ||
            !formData.alamat ||
            !formData.phone ||
            !formData.email) {
            showNotification('error', 'Error', 'Semua field harus diisi');
            return;
        }
        try {
            showNotification('success', 'Sukses', 'Company settings berhasil disimpan');
            setIsEditing(false);
        }
        catch (error) {
            showNotification('error', 'Error', 'Failed to save company settings');
        }
    };
    const handleCancel = () => {
        setFormData(settings);
        setIsEditing(false);
    };
    if (loading || !settings || !formData) {
        return (_jsx("div", { className: "flex items-center justify-center p-8", children: _jsx("div", { className: "animate-spin text-4xl", children: "\u23F3" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [!isEditing && (_jsx("button", { onClick: () => setIsEditing(true), className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg", children: "\u270F\uFE0F Edit Settings" })), !isEditing && (_jsxs("div", { className: "bg-white rounded-2xl p-8 border border-slate-100 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-slate-400 uppercase mb-1", children: "Nama Perusahaan" }), _jsx("p", { className: "text-2xl font-black text-slate-900", children: settings.nama_perusahaan })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-slate-400 uppercase mb-1", children: "Alamat" }), _jsx("p", { className: "text-lg text-slate-700", children: settings.alamat })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-slate-400 uppercase mb-1", children: "Phone" }), _jsx("p", { className: "text-lg text-slate-700", children: settings.phone })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-slate-400 uppercase mb-1", children: "Email" }), _jsx("p", { className: "text-lg text-slate-700", children: settings.email })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-slate-400 uppercase mb-1", children: "Currency" }), _jsx("p", { className: "text-lg text-slate-700 font-bold", children: settings.currency })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-slate-400 uppercase mb-1", children: "Fiscal Year Start" }), _jsx("p", { className: "text-lg text-slate-700 font-bold", children: new Date(2024, settings.fiscal_year_start - 1).toLocaleDateString('id-ID', {
                                            month: 'long',
                                        }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-slate-400 uppercase mb-1", children: "Max Terlambat Per Bulan" }), _jsxs("p", { className: "text-lg text-slate-700 font-bold", children: [settings.max_terlambat_per_bulan || '-', " hari"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-black text-slate-400 uppercase mb-1", children: "Max Absent Per Bulan" }), _jsxs("p", { className: "text-lg text-slate-700 font-bold", children: [settings.max_absent_per_bulan || '-', " hari"] })] })] }), _jsx("div", { className: "pt-4 border-t border-slate-200", children: _jsxs("p", { className: "text-xs text-slate-400", children: ["Last updated: ", new Date(settings.updated_at).toLocaleDateString('id-ID')] }) })] })), isEditing && (_jsxs("div", { className: "bg-white rounded-2xl p-8 border-2 border-indigo-100 space-y-6", children: [_jsx("h3", { className: "text-lg font-black text-slate-900", children: "Edit Company Settings" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Nama Perusahaan" }), _jsx("input", { type: "text", value: formData.nama_perusahaan, onChange: (e) => setFormData({
                                            ...formData,
                                            nama_perusahaan: e.target.value,
                                        }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Alamat" }), _jsx("textarea", { value: formData.alamat, onChange: (e) => setFormData({
                                            ...formData,
                                            alamat: e.target.value,
                                        }), rows: 3, className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Phone" }), _jsx("input", { type: "tel", value: formData.phone, onChange: (e) => setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Email" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Currency" }), _jsxs("select", { value: formData.currency, onChange: (e) => setFormData({
                                                    ...formData,
                                                    currency: e.target.value,
                                                }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100", children: [_jsx("option", { value: "IDR", children: "IDR (Indonesia)" }), _jsx("option", { value: "USD", children: "USD (Dollar)" }), _jsx("option", { value: "SGD", children: "SGD (Singapore)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Fiscal Year Start Month" }), _jsx("select", { value: formData.fiscal_year_start, onChange: (e) => setFormData({
                                                    ...formData,
                                                    fiscal_year_start: parseInt(e.target.value),
                                                }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100", children: [
                                                    'Januari',
                                                    'Februari',
                                                    'Maret',
                                                    'April',
                                                    'Mei',
                                                    'Juni',
                                                    'Juli',
                                                    'Agustus',
                                                    'September',
                                                    'Oktober',
                                                    'November',
                                                    'Desember',
                                                ].map((month, index) => (_jsx("option", { value: index + 1, children: month }, index))) })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Max Terlambat Per Bulan" }), _jsx("input", { type: "number", value: formData.max_terlambat_per_bulan || 0, onChange: (e) => setFormData({
                                                    ...formData,
                                                    max_terlambat_per_bulan: parseInt(e.target.value) || 0,
                                                }), min: "0", className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Max Absent Per Bulan" }), _jsx("input", { type: "number", value: formData.max_absent_per_bulan || 0, onChange: (e) => setFormData({
                                                    ...formData,
                                                    max_absent_per_bulan: parseInt(e.target.value) || 0,
                                                }), min: "0", className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" })] })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleSave, className: "px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg", children: "\u2705 Simpan" }), _jsx("button", { onClick: handleCancel, className: "px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm uppercase transition-all", children: "\u274C Batal" })] })] }))] }));
};
