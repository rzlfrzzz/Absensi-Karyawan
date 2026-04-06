import React, { useState } from 'react';
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

type SettingsTab = 'shift' | 'gaji' | 'bonus' | 'holiday' | 'company';

export const SettingsDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('shift');

  // Check if user is super_admin
  if (!user || user.role !== 'super_admin') {
    return <SettingsAccessDenied />;
  }

  const tabs: Array<{ id: SettingsTab; label: string; icon: string }> = [
    { id: 'shift', label: t('shiftSettings'), icon: '🕐' },
    { id: 'gaji', label: t('gajiSettings'), icon: '💰' },
    { id: 'bonus', label: t('bonusRules'), icon: '📊' },
    { id: 'holiday', label: t('holidaySettings'), icon: '🗓️' },
    { id: 'company', label: t('companySettings'), icon: '🏢' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button & Language Switcher */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 italic uppercase mb-2">
              {t('settingsTitle')}
            </h1>
            <p className="text-slate-400 text-sm font-bold tracking-widest">
              {t('settingsSubtitle')}
            </p>
          </div>
          <div className="flex gap-2 items-end">
            <LanguageSwitcher />
            <button
              onClick={() => navigate('/backoffice')}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
            >
              ← Kembali
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl p-2 mb-8 shadow-sm border border-slate-100 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-bold text-sm uppercase whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-600 shadow-md'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'shift' && <ShiftSettingsForm />}
          {activeTab === 'gaji' && <GajiSettingsTable />}
          {activeTab === 'bonus' && <BonusRulesEditor />}
          {activeTab === 'holiday' && <HolidayCalendar />}
          {activeTab === 'company' && <CompanySettingsForm />}
        </div>

        {/* Footer Info */}
        <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <p className="text-xs text-blue-600 font-bold">
            💡 {t('tips')}
          </p>
        </div>
      </div>
    </div>
  );
};
