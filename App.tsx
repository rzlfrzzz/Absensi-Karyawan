import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Admin from './Admin';

// Mengatasi error TypeScript karena menggunakan CDN
declare var Swal: any;

const AttendanceForm = () => {
  const [pin, setPin] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleAbsen = async (tipe: 'MASUK' | 'PULANG') => {
    if (pin.length < 4) return Swal.fire({ icon: 'error', title: 'PIN SALAH', text: 'Masukkan 4 digit PIN Anda', background: '#0f172a', color: '#fff' });
    
    setLoading(true);
    const { data: karyawan, error } = await supabase
      .from('karyawan')
      .select('*')
      .eq('pin', pin)
      .single();

    if (error || !karyawan) {
      setLoading(false);
      return Swal.fire({ icon: 'error', title: 'TIDAK DITEMUKAN', text: 'PIN Karyawan tidak terdaftar!', background: '#0f172a', color: '#fff' });
    }

    const jamSekarang = new Date().toLocaleTimeString('it-IT', { hour12: false }).slice(0, 5);
    let statusLog = 'On Time';
    let pesanAlert = 'Absensi Anda telah tercatat. Selamat bekerja!';
    let alertIcon = 'success';

    // Logika Terlambat & Pulang Cepat
    if (tipe === 'MASUK' && jamSekarang > (settings?.jam_masuk_siang || '08:00')) {
      statusLog = 'Terlambat';
      pesanAlert = 'Anda terlambat! Tapi jangan menyerah, hari ini adalah kesempatan baru untuk bersinar! 🔥';
      alertIcon = 'warning';
    } else if (tipe === 'PULANG' && jamSekarang < (settings?.jam_pulang_siang || '17:00')) {
      statusLog = 'Pulang Cepat';
      pesanAlert = 'Waduh, belum jam pulang nih! Tetap fokus sebentar lagi, Anda luar biasa!';
      alertIcon = 'info';
    }

    const { error: errInsert } = await supabase.from('logs_absensi').insert([{
      karyawan_id: karyawan.id,
      nama: karyawan.nama,
      tipe,
      jam: jamSekarang,
      status: statusLog,
      foto_url: 'https://via.placeholder.com/150' 
    }]);

    if (!errInsert) {
      Swal.fire({
        title: 'BERHASIL!',
        text: pesanAlert,
        icon: alertIcon,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#6366f1',
        showClass: { popup: 'animate__animated animate__fadeInDown' }
      });
      setPin('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-[#020617] to-black p-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] text-center relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
        
        <h1 className="text-4xl font-black mb-2 tracking-tighter text-white uppercase italic">Digital<span className="text-indigo-500">Attendance</span></h1>
        <p className="text-slate-400 text-[10px] mb-8 font-bold tracking-[0.3em] uppercase">Security Level : High</p>
        
        <div className="w-full h-48 bg-slate-900/50 rounded-[2rem] mb-8 border border-white/5 flex flex-col items-center justify-center text-slate-500 relative overflow-hidden shadow-inner">
           <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-[2rem] animate-pulse"></div>
           <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
           <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">Ready to Capture</p>
        </div>

        <input 
          type="password" 
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••" 
          className="w-full bg-slate-950/50 border border-white/10 text-center text-4xl tracking-[1.5rem] py-6 rounded-3xl mb-8 focus:ring-4 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-800 placeholder:tracking-normal font-mono"
        />

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleAbsen('MASUK')} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 py-5 rounded-[1.5rem] font-black text-xs tracking-widest transition-all active:scale-95 shadow-xl shadow-indigo-500/20 uppercase disabled:opacity-50">Masuk</button>
          <button onClick={() => handleAbsen('PULANG')} disabled={loading} className="bg-slate-800 hover:bg-slate-700 py-5 rounded-[1.5rem] font-black text-xs tracking-widest transition-all active:scale-95 uppercase disabled:opacity-50">Pulang</button>
        </div>

        <div className="mt-10">
          <Link to="/backoffice" className="text-[9px] text-slate-600 hover:text-indigo-400 uppercase tracking-[0.4em] font-black transition-all">Go to Backoffice Area →</Link>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AttendanceForm />} />
        <Route path="/backoffice" element={<Admin />} />
      </Routes>
    </Router>
  );
}
