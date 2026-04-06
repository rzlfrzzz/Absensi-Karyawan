import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CameraPreview } from './CameraPreview';
import { PinInput } from './PinInput';
import { AttendanceButtons } from './AttendanceButtons';
import { attendanceService } from '../services/attendanceService';
import { attendanceHelper } from '../utils/attendanceHelper';
import { showNotification, getCurrentTime } from '../utils/helpers';
import { translations } from '../constants/translations';
import { LanguageCode, Settings } from '../types';

export const AttendanceForm = () => {
  const [pin, setPin] = useState('');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<LanguageCode>('ID');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await attendanceService.getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleAttendance = async (type: 'MASUK' | 'PULANG') => {
    if (pin.length < 4) {
      showNotification('error', translations[lang].pinError, translations[lang].pinErrorMsg);
      return;
    }

    setLoading(true);

    try {
      // 1. Verify employee
      const karyawan = await attendanceService.getKaryawanByPin(pin);
      if (!karyawan) {
        showNotification('error', translations[lang].notFound, translations[lang].notFoundMsg);
        setLoading(false);
        return;
      }

      // 2. Capture photo
      let fotoUrl = '';
      if (videoRef.current && canvasRef.current) {
        const blob = await attendanceService.capturePhoto(videoRef.current, canvasRef.current);
        if (blob) {
          fotoUrl = await attendanceService.uploadPhoto(blob, pin);
        }
      }

      // 3. Determine status
      const currentTime = getCurrentTime();
      const status = attendanceHelper.determineStatus(
        type,
        currentTime,
        karyawan.shift,
        settings
      );
      const message = attendanceHelper.getStatusMessage(status, type);

      // 4. Save log
      const success = await attendanceService.saveAttendanceLog({
        karyawan_id: karyawan.id,
        nama: karyawan.nama,
        tipe: type,
        jam: currentTime,
        status,
        foto_url: fotoUrl,
        jabatan: karyawan.jabatan,
      });

      if (success) {
        showNotification('success', translations[lang].success, message);
        setPin('');
      } else {
        showNotification('error', 'Error', 'Failed to save attendance log');
      }
    } catch (error) {
      console.error('Attendance error:', error);
      showNotification('error', 'Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50 p-6">
      <div className="absolute top-4 right-4 flex bg-slate-200 p-1 rounded-lg gap-1">
        <button
          onClick={() => setLang('ID')}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            lang === 'ID' ? 'bg-white shadow-sm' : 'text-slate-500'
          }`}
        >
          ID
        </button>
        <button
          onClick={() => setLang('CN')}
          className={`px-3 py-1 rounded text-xs font-bold transition-all ${
            lang === 'CN' ? 'bg-white shadow-sm' : 'text-slate-500'
          }`}
        >
          CN
        </button>
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white rounded-[3.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center relative overflow-hidden">
        <h1 className="text-3xl font-black mb-1 text-slate-900 italic uppercase">
          Digital<span className="text-indigo-600">Absensi</span>
        </h1>
        <p className="text-[9px] text-slate-400 font-bold tracking-[0.3em] mb-6 uppercase tracking-widest">
          {translations[lang].tagline}
        </p>

        <CameraPreview videoRef={videoRef} canvasRef={canvasRef} />

        <PinInput value={pin} onChange={setPin} />

        <AttendanceButtons
          onCheckIn={() => handleAttendance('MASUK')}
          onCheckOut={() => handleAttendance('PULANG')}
          loading={loading}
          lang={lang}
        />

        <div className="mt-8">
          <Link
            to="/backoffice"
            className="text-[9px] text-slate-400 hover:text-indigo-600 uppercase tracking-[0.4em] font-black transition-all"
          >
            {translations[lang].front} →
          </Link>
        </div>
      </div>
    </div>
  );
};
