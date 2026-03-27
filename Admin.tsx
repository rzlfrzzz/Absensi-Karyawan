import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Admin() {
  const [karyawan, setKaryawan] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: dKaryawan } = await supabase.from('karyawan').select('*');
    const { data: dLogs } = await supabase.from('logs_absensi').select('*').order('created_at', { ascending: false });
    const { data: dSett } = await supabase.from('settings').select('*').single();
    
    setKaryawan(dKaryawan || []);
    setLogs(dLogs || []);
    setSettings(dSett || {});
  };

  const addKaryawan = async (nama: string, pin: string) => {
    await supabase.from('karyawan').insert([{ nama, pin }]);
    fetchData();
  };

  const updateJam = async (field: string, val: string) => {
    await supabase.from('settings').update({ [field]: val }).eq('id', settings.id);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/5 p-8 rounded-[2rem] border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-indigo-400">Settings Waktu Kerja</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">JAM MASUK</label>
                <input type="time" defaultValue={settings.jam_masuk} onBlur={(e) => updateJam('jam_masuk', e.target.value)} className="bg-slate-900 border border-white/10 p-3 rounded-xl w-full" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">JAM PULANG</label>
                <input type="time" defaultValue={settings.jam_pulang} onBlur={(e) => updateJam('jam_pulang', e.target.value)} className="bg-slate-900 border border-white/10 p-3 rounded-xl w-full" />
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-500/20">
            <h2 className="text-xl font-bold text-white mb-2">Total Terlambat</h2>
            <p className="text-5xl font-black text-white">{logs.filter(l => l.status === 'Terlambat').length}</p>
            <p className="text-indigo-200 text-sm mt-2">Karyawan hari ini</p>
          </div>
        </div>

        {/* Analitik Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Data Absen Terburuk */}
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-500 rounded-full"></span> 
              Perlu Perhatian (Absen Terburuk)
            </h2>
            <div className="space-y-4">
              {karyawan.map(k => {
                const totalLate = logs.filter(l => l.karyawan_id === k.id && l.status === 'Terlambat').length;
                if (totalLate < 1) return null;
                return (
                  <div key={k.id} className="flex justify-between items-center p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                    <span className="font-bold">{k.nama}</span>
                    <span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full">{totalLate}x Terlambat</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Registrasi PIN */}
          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
            <h2 className="text-xl font-bold mb-6 text-cyan-400">Registrasi Karyawan</h2>
            <form className="space-y-4" onSubmit={(e:any) => {
              e.preventDefault();
              addKaryawan(e.target.nama.value, e.target.pin.value);
              e.target.reset();
            }}>
              <input name="nama" placeholder="Nama Karyawan" className="w-full bg-slate-900 p-4 rounded-2xl border border-white/10" required />
              <input name="pin" placeholder="PIN (4 Digit)" maxLength={4} className="w-full bg-slate-900 p-4 rounded-2xl border border-white/10" required />
              <button className="w-full bg-cyan-600 py-4 rounded-2xl font-bold hover:bg-cyan-500 transition-all">DAFTARKAN PIN</button>
            </form>
          </div>

        </div>

        {/* Tabel Rekap Log */}
        <div className="bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-500 text-xs tracking-widest uppercase">
              <tr>
                <th className="p-6">Karyawan</th>
                <th className="p-6">Tipe</th>
                <th className="p-6">Jam</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-white/5 transition-all">
                  <td className="p-6 font-bold">{log.nama}</td>
                  <td className="p-6"><span className="bg-slate-800 px-3 py-1 rounded-lg text-[10px]">{log.tipe}</span></td>
                  <td className="p-6 text-slate-400">{log.jam}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      log.status === 'On Time' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
