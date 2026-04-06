import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KaryawanForm } from './KaryawanForm';
import { KaryawanTable } from './KaryawanTable';
import { AttendanceTable } from './AttendanceTable';
import { LogoutButton } from './Auth/LogoutButton';
import { DropdownMenu } from './DropdownMenu';
import { adminService } from '../services/adminService';
import { translations, getDaftarJabatan } from '../constants/translations';
import { showNotification, confirmDelete } from '../utils/helpers';
import { Karyawan, AttendanceLog } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

export const Admin = () => {
  const { user } = useAuth();
  const { lang, setLang } = useLanguage();
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daftarJabatan = getDaftarJabatan(lang);

  useEffect(() => {
    fetchData();

    // Auto-refresh data setiap 5 detik
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dataKaryawan, dataLogs] = await Promise.all([
        adminService.getAllKaryawan(),
        adminService.getAllLogs(),
      ]);
      console.log('📊 Fetched data:', { karyawan: dataKaryawan.length, logs: dataLogs.length });
      console.log('📋 Logs detail:', dataLogs);
      setKaryawan(dataKaryawan);
      setLogs(dataLogs);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showNotification('error', 'Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddKaryawan = async (data: {
    nama: string;
    pin: string;
    shift: string;
    jabatan: string;
  }) => {
    setIsSubmitting(true);
    try {
      const success = await adminService.addKaryawan(
        data.nama,
        data.pin,
        data.jabatan,
        data.shift
      );
      if (success) {
        showNotification('success', translations[lang].successAdd, '');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add karyawan:', error);
      showNotification('error', 'Error', 'Failed to add karyawan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteKaryawan = async (id: string) => {
    const confirmed = await confirmDelete(translations[lang].confirmText);
    if (confirmed) {
      try {
        const success = await adminService.deleteKaryawan(id);
        if (success) {
          showNotification('success', translations[lang].deleted, '');
          fetchData();
        } else {
          showNotification('error', 'Error', 'Failed to delete karyawan');
        }
      } catch (error) {
        console.error('Failed to delete karyawan:', error);
        showNotification('error', 'Error', 'An error occurred while deleting');
      }
    }
  };

  const handleDeleteLog = async (id: string) => {
    const confirmed = await confirmDelete(translations[lang].confirmText);
    if (confirmed) {
      try {
        const success = await adminService.deleteLog(id);
        if (success) {
          showNotification('success', translations[lang].deleted, '');
          fetchData();
        } else {
          showNotification('error', 'Error', 'Failed to delete log');
        }
      } catch (error) {
        console.error('Failed to delete log:', error);
        showNotification('error', 'Error', 'An error occurred while deleting');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 md:p-12 font-sans selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 italic uppercase">
              Back<span className="text-indigo-600">Office</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-400 text-xs font-bold tracking-[0.2em] italic uppercase">
                Buymoreworkers System
              </p>
              <div className="flex bg-slate-200 p-1 rounded-lg scale-90">
                <button
                  onClick={() => setLang('ID')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    lang === 'ID' ? 'bg-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => setLang('CN')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    lang === 'CN' ? 'bg-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  CN
                </button>
              </div>
            </div>
            {/* User Info */}
            {user && (
              <div className="mt-3 text-xs">
                <p className="text-slate-600 font-bold">
                  👤 {translations[lang].loggedInAs}: <span className="text-indigo-600">{user.nama_lengkap}</span>
                </p>
                <p className="text-slate-400 text-[10px] mt-1">
                  {translations[lang].role}: <span className="uppercase font-bold">{user.role}</span>
                </p>
              </div>
            )}
          </div>

          {/* Right Side - Navigation Buttons */}
          <div className="flex gap-3 items-center">
            {/* Back Button */}
            <Link
              to="/"
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
              title="Kembali ke halaman absensi"
            >
              ← Kembali
            </Link>

            {/* Admin Menu Dropdown */}
            {user?.role === 'super_admin' && (
              <DropdownMenu
                trigger="⚙️ Menu"
                items={[
                  {
                    label: '💰 Payroll',
                    onClick: () => (window.location.href = '/backoffice/payroll'),
                  },
                  {
                    label: '👥 User Management',
                    onClick: () => (window.location.href = '/backoffice/users'),
                  },
                  {
                    label: '📊 Analytics',
                    onClick: () => (window.location.href = '/backoffice/analytics'),
                  },
                  {
                    label: '⚙️ Settings',
                    onClick: () => (window.location.href = '/backoffice/settings'),
                  },
                ]}
                align="right"
              />
            )}

            {user?.role === 'hr_admin' && (
              <DropdownMenu
                trigger="⚙️ Menu"
                items={[
                  {
                    label: '💰 Payroll',
                    onClick: () => (window.location.href = '/backoffice/payroll'),
                  },
                  {
                    label: '📊 Analytics',
                    onClick: () => (window.location.href = '/backoffice/analytics'),
                  },
                ]}
                align="right"
              />
            )}

            {/* Logout Button */}
            <LogoutButton />

            {/* Refresh Button - Diperbesar */}
            <button
              onClick={fetchData}
              className="px-5 py-2.5 bg-cyan-100 text-cyan-700 rounded-xl text-[11px] font-black uppercase hover:bg-cyan-200 transition-all shadow-sm"
              title="Refresh data"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* TOP SECTION: Form + Karyawan Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <KaryawanForm
            lang={lang}
            onSubmit={handleAddKaryawan}
            isSubmitting={isSubmitting}
          />
          <KaryawanTable
            data={karyawan}
            lang={lang}
            searchTerm=""
            onDelete={handleDeleteKaryawan}
          />
        </div>

        {/* BOTTOM SECTION: Attendance Logs */}
        <div>
          <AttendanceTable
            logs={logs}
            karyawan={karyawan}
            lang={lang}
            onDelete={handleDeleteLog}
            filters={{
              dateStart: '',
              dateEnd: '',
              searchTerm: '',
              type: 'ALL',
              jabatan: 'ALL',
            }}
          />
        </div>
      </div>
    </div>
  );
};
