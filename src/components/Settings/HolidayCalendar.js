import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { showNotification } from '../../utils/helpers';
// Mock data
const mockHolidays = [
    { id: '1', tanggal: '2026-01-01', nama: 'Tahun Baru', jenis: 'nasional', is_paid_leave: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', tanggal: '2026-02-10', nama: 'Isra dan Mi\'raj', jenis: 'nasional', is_paid_leave: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];
export const HolidayCalendar = () => {
    const { user } = useAuth();
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        tanggal: '',
        nama: '',
        jenis: 'custom',
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
        }
        catch (error) {
            showNotification('error', 'Error', 'Failed to load holidays');
        }
        finally {
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
    const handleEdit = (holiday) => {
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
            }
            else if (editingId) {
                showNotification('success', 'Sukses', 'Holiday berhasil diupdate');
            }
            setEditingId(null);
        }
        catch (error) {
            showNotification('error', 'Error', 'Failed to save holiday');
        }
    };
    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus holiday ini?')) {
            try {
                showNotification('success', 'Sukses', 'Holiday berhasil dihapus');
            }
            catch (error) {
                showNotification('error', 'Error', 'Failed to delete holiday');
            }
        }
    };
    const handleCancel = () => {
        setEditingId(null);
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center p-8", children: _jsx("div", { className: "animate-spin text-4xl", children: "\u23F3" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => setSelectedYear(selectedYear - 1), className: "px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-sm", children: "\u2190 Tahun Lalu" }), _jsx("span", { className: "text-xl font-black text-slate-900", children: selectedYear }), _jsx("button", { onClick: () => setSelectedYear(selectedYear + 1), className: "px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-sm", children: "Tahun Depan \u2192" })] }), editingId === null && (_jsx("button", { onClick: handleAdd, className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg", children: "+ Tambah Holiday" }))] }), editingId !== null && (_jsxs("div", { className: "bg-white rounded-2xl p-6 border-2 border-indigo-100", children: [_jsx("h3", { className: "text-lg font-black text-slate-900 mb-4", children: editingId === 'new' ? 'Tambah Holiday' : 'Edit Holiday' }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Tanggal" }), _jsx("input", { type: "date", value: formData.tanggal, onChange: (e) => setFormData({ ...formData, tanggal: e.target.value }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Nama Holiday" }), _jsx("input", { type: "text", value: formData.nama, onChange: (e) => setFormData({ ...formData, nama: e.target.value }), placeholder: "Natal, Lebaran, dll", className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Jenis" }), _jsxs("select", { value: formData.jenis, onChange: (e) => setFormData({
                                            ...formData,
                                            jenis: e.target.value,
                                        }), className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100", children: [_jsx("option", { value: "nasional", children: "Nasional" }), _jsx("option", { value: "perusahaan", children: "Perusahaan" }), _jsx("option", { value: "custom", children: "Custom" })] })] }), _jsx("div", { children: _jsxs("label", { className: "flex items-center gap-3 cursor-pointer mt-6", children: [_jsx("input", { type: "checkbox", checked: formData.is_paid_leave, onChange: (e) => setFormData({
                                                ...formData,
                                                is_paid_leave: e.target.checked,
                                            }), className: "w-5 h-5" }), _jsx("span", { className: "font-bold text-slate-700", children: "Paid Leave?" })] }) })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleSave, className: "px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm uppercase transition-all", children: "\u2705 Simpan" }), _jsx("button", { onClick: handleCancel, className: "px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm uppercase transition-all", children: "\u274C Batal" })] })] })), _jsx("div", { className: "bg-white rounded-2xl overflow-hidden border border-slate-100", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-slate-50 border-b border-slate-200", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-4 text-xs font-black text-slate-600 uppercase", children: "Tanggal" }), _jsx("th", { className: "text-left p-4 text-xs font-black text-slate-600 uppercase", children: "Nama" }), _jsx("th", { className: "text-left p-4 text-xs font-black text-slate-600 uppercase", children: "Jenis" }), _jsx("th", { className: "text-left p-4 text-xs font-black text-slate-600 uppercase", children: "Paid Leave" }), _jsx("th", { className: "text-left p-4 text-xs font-black text-slate-600 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: holidays.map((holiday) => (_jsxs("tr", { className: "border-b border-slate-100 hover:bg-slate-50", children: [_jsx("td", { className: "p-4 font-bold text-slate-900", children: new Date(holiday.tanggal).toLocaleDateString('id-ID') }), _jsx("td", { className: "p-4 text-slate-600", children: holiday.nama }), _jsx("td", { className: "p-4", children: _jsx("span", { className: "text-xs font-bold px-2 py-1 bg-blue-100 text-blue-600 rounded-lg uppercase", children: holiday.jenis }) }), _jsx("td", { className: "p-4", children: holiday.is_paid_leave ? (_jsx("span", { className: "text-green-600 font-bold", children: "\u2705 Ya" })) : (_jsx("span", { className: "text-red-600 font-bold", children: "\u274C Tidak" })) }), _jsxs("td", { className: "p-4 space-x-2", children: [_jsx("button", { onClick: () => handleEdit(holiday), className: "text-blue-600 hover:text-blue-800 font-bold text-sm", children: "\u270F\uFE0F Edit" }), _jsx("button", { onClick: () => handleDelete(holiday.id), className: "text-red-600 hover:text-red-800 font-bold text-sm", children: "\uD83D\uDDD1\uFE0F Delete" })] })] }, holiday.id))) })] }) }), holidays.length === 0 && editingId === null && (_jsx("div", { className: "text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200", children: _jsxs("p", { className: "text-slate-500 font-bold", children: ["Belum ada holiday untuk tahun ", selectedYear] }) }))] }));
};
