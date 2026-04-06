import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ShiftSettingsForm } from './ShiftSettingsForm';
import { GajiSettingsTable } from './GajiSettingsTable';
import { BonusRulesEditor } from './BonusRulesEditor';
import { HolidayCalendar } from './HolidayCalendar';
import { CompanySettingsForm } from './CompanySettingsForm';
import { SettingsAccessDenied } from './SettingsAccessDenied';
export const SettingsDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { lang, toggleLanguage, t } = useLanguage();
    const [activeTab, setActiveTab] = useState('shift');
    // Check if user is super_admin
    if (!user || user.role !== 'super_admin') {
        return _jsx(SettingsAccessDenied, {});
    }
    const tabs = [
        { id: 'shift', label: t('shiftSettings'), icon: '🕐' },
        { id: 'gaji', label: t('gajiSettings'), icon: '💰' },
        { id: 'bonus', label: t('bonusRules'), icon: '📊' },
        { id: 'holiday', label: t('holidaySettings'), icon: '🗓️' },
        { id: 'company', label: t('companySettings'), icon: '🏢' },
    ];
    return (_jsx("div", { className: "min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-black text-slate-900 italic uppercase mb-2", children: t('settingsTitle') }), _jsx("p", { className: "text-slate-400 text-sm font-bold tracking-widest", children: t('settingsSubtitle') })] }), _jsxs("div", { className: "flex gap-2 items-end", children: [_jsx(LanguageSwitcher, {}), _jsx("button", { onClick: () => navigate('/backoffice'), className: "px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all", children: "\u2190 Kembali" })] })] }), _jsx("div", { className: "bg-white rounded-2xl p-2 mb-8 shadow-sm border border-slate-100 overflow-x-auto", children: _jsx("div", { className: "flex gap-2 min-w-max", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `px-6 py-3 rounded-xl font-bold text-sm uppercase whitespace-nowrap transition-all ${activeTab === tab.id
                                ? 'bg-indigo-100 text-indigo-600 shadow-md'
                                : 'text-slate-600 hover:bg-slate-50'}`, children: [_jsx("span", { className: "mr-2", children: tab.icon }), tab.label] }, tab.id))) }) }), _jsxs("div", { className: "space-y-8", children: [activeTab === 'shift' && _jsx(ShiftSettingsForm, {}), activeTab === 'gaji' && _jsx(GajiSettingsTable, {}), activeTab === 'bonus' && _jsx(BonusRulesEditor, {}), activeTab === 'holiday' && _jsx(HolidayCalendar, {}), activeTab === 'company' && _jsx(CompanySettingsForm, {})] }), _jsx("div", { className: "mt-12 p-4 bg-blue-50 border border-blue-200 rounded-2xl", children: _jsxs("p", { className: "text-xs text-blue-600 font-bold", children: ["\uD83D\uDCA1 ", t('tips')] }) })] }) }));
};
