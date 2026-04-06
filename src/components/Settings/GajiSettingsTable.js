import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { showNotification } from '../../utils/helpers';
// Mock data
const mockGajiSettings = [
    { id: '1', jabatan: 'Manager', gaji_pokok: 5000000, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: '2', jabatan: 'Staff', gaji_pokok: 3000000, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];
export const GajiSettingsTable = () => {
    const { user } = useAuth();
    const [gajiList, setGajiList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        jabatan: '',
        gaji_pokok: 0,
    });
    useEffect(() => {
        loadGaji();
    }, []);
    const loadGaji = () => {
        setLoading(true);
        try {
            // TODO: Replace dengan API call
            setGajiList(mockGajiSettings);
        }
        catch (error) {
            showNotification('error', 'Error', 'Failed to load gaji settings');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAdd = () => {
        setEditingId('new');
        setFormData({
            jabatan: '',
            gaji_pokok: 0,
        });
    };
    const handleEdit = (gaji) => {
        setEditingId(gaji.id);
        setFormData({
            jabatan: gaji.jabatan,
            gaji_pokok: gaji.gaji_pokok,
        });
    };
    const handleSave = () => {
        if (!formData.jabatan || formData.gaji_pokok <= 0) {
            showNotification('error', 'Error', 'Jabatan dan gaji harus diisi dengan benar');
            return;
        }
        try {
            if (editingId === 'new') {
                showNotification('success', 'Sukses', 'Gaji berhasil ditambahkan');
            }
            else if (editingId) {
                showNotification('success', 'Sukses', 'Gaji berhasil diupdate');
            }
            setEditingId(null);
        }
        catch (error) {
            showNotification('error', 'Error', error instanceof Error ? error.message : 'Failed to save');
        }
    };
    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus jabatan ini?')) {
            try {
                showNotification('success', 'Sukses', 'Gaji berhasil dihapus');
            }
            catch (error) {
                showNotification('error', 'Error', 'Failed to delete gaji');
            }
        }
    };
    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            jabatan: '',
            gaji_pokok: 0,
        });
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center p-8", children: _jsx("div", { className: "animate-spin text-4xl", children: "\u23F3" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-end", children: editingId === null && (_jsx("button", { onClick: handleAdd, className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg", children: "+ Tambah Jabatan" })) }), editingId !== null && (_jsxs("div", { className: "bg-white rounded-2xl p-6 border-2 border-indigo-100", children: [_jsx("h3", { className: "text-lg font-black text-slate-900 mb-4", children: editingId === 'new' ? 'Tambah Jabatan Baru' : 'Edit Gaji' }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Jabatan" }), _jsx("input", { type: "text", value: formData.jabatan, onChange: (e) => setFormData({ ...formData, jabatan: e.target.value }), placeholder: "Penjahit, Admin, HRD, dll", className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-black text-slate-600 uppercase mb-2", children: "Gaji Pokok (Rp)" }), _jsx("input", { type: "number", value: formData.gaji_pokok, onChange: (e) => setFormData({
                                            ...formData,
                                            gaji_pokok: parseInt(e.target.value) || 0,
                                        }), placeholder: "2000000", min: "0", className: "w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100" }), _jsxs("p", { className: "text-xs text-slate-500 mt-1", children: ["= ", formatCurrency(formData.gaji_pokok)] })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleSave, className: "px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm uppercase transition-all", children: "\u2705 Simpan" }), _jsx("button", { onClick: handleCancel, className: "px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm uppercase transition-all", children: "\u274C Batal" })] })] })), _jsx("div", { className: "bg-white rounded-2xl overflow-hidden border border-slate-100", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-slate-50 border-b border-slate-200", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left p-4 text-xs font-black text-slate-600 uppercase", children: "Jabatan" }), _jsx("th", { className: "text-left p-4 text-xs font-black text-slate-600 uppercase", children: "Gaji Pokok" }), _jsx("th", { className: "text-left p-4 text-xs font-black text-slate-600 uppercase", children: "Last Updated" }), _jsx("th", { className: "text-left p-4 text-xs font-black text-slate-600 uppercase", children: "Actions" })] }) }), _jsx("tbody", { children: gajiList.map((gaji) => (_jsxs("tr", { className: "border-b border-slate-100 hover:bg-slate-50", children: [_jsx("td", { className: "p-4 font-bold text-slate-900", children: gaji.jabatan }), _jsx("td", { className: "p-4 text-slate-600 font-bold", children: formatCurrency(gaji.gaji_pokok) }), _jsx("td", { className: "p-4 text-xs text-slate-400", children: new Date(gaji.updated_at).toLocaleDateString('id-ID') }), _jsxs("td", { className: "p-4 space-x-2", children: [_jsx("button", { onClick: () => handleEdit(gaji), className: "text-blue-600 hover:text-blue-800 font-bold text-sm", children: "\u270F\uFE0F Edit" }), _jsx("button", { onClick: () => handleDelete(gaji.id), className: "text-red-600 hover:text-red-800 font-bold text-sm", children: "\uD83D\uDDD1\uFE0F Delete" })] })] }, gaji.id))) })] }) }), gajiList.length === 0 && editingId === null && (_jsx("div", { className: "text-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200", children: _jsx("p", { className: "text-slate-500 font-bold", children: "Belum ada jabatan. Klik \"Tambah Jabatan\" untuk membuat." }) })), _jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-2xl", children: _jsx("p", { className: "text-xs text-blue-600 font-bold", children: "\uD83D\uDCA1 Note: Karyawan dapat memiliki gaji override per-individu. Gaji yang ditampilkan di sini adalah default per jabatan." }) })] }));
};
