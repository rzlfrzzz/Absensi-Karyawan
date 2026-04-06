import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { translations, getDaftarJabatan } from '../constants/translations';
export const KaryawanForm = ({ lang, onSubmit, isSubmitting, }) => {
    const [formData, setFormData] = useState({
        nama: '',
        pin: '',
        jabatan: '',
        shift: 'Siang',
    });
    const daftarJabatan = getDaftarJabatan(lang);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ nama: '', pin: '', jabatan: '', shift: 'Siang' });
    };
    return (_jsxs("div", { className: "bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden h-fit", children: [_jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-indigo-600" }), _jsx("h2", { className: "text-xl font-black mb-6 uppercase italic text-slate-900", children: translations[lang].regTitle }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: translations[lang].namePlace, value: formData.nama, onChange: (e) => setFormData({ ...formData, nama: e.target.value }), className: "w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all", required: true }), _jsx("input", { type: "text", placeholder: translations[lang].pinPlace, value: formData.pin, onChange: (e) => setFormData({ ...formData, pin: e.target.value.slice(0, 4) }), maxLength: 4, className: "w-full bg-white border border-slate-100 p-4 rounded-2xl text-sm font-mono tracking-widest outline-none focus:ring-2 focus:ring-indigo-100 transition-all", required: true }), _jsxs("select", { value: formData.jabatan, onChange: (e) => setFormData({ ...formData, jabatan: e.target.value }), className: "w-full bg-white border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 italic font-bold text-slate-600", required: true, children: [_jsx("option", { value: "", children: translations[lang].colJabatan }), daftarJabatan.map((j) => (_jsx("option", { value: j.id, children: j.label }, j.id)))] }), _jsxs("select", { value: formData.shift, onChange: (e) => setFormData({ ...formData, shift: e.target.value }), className: "w-full bg-white border border-slate-100 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100", children: [_jsx("option", { value: "Siang", children: translations[lang].shiftSiang }), _jsx("option", { value: "Malam", children: translations[lang].shiftMalam })] }), _jsx("button", { disabled: isSubmitting, className: "w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg shadow-indigo-100 mt-4 transition-all active:scale-95", children: isSubmitting ? translations[lang].btnProcess : translations[lang].btnSave })] })] }));
};
