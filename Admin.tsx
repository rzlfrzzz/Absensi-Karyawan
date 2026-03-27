import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [karyawan, setKaryawan] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: dKaryawan } = await supabase.from('karyawan').select('*');
    const { data: dLogs } = await supabase.from('logs_absensi').select('*').order('created_at', { ascending: false });
    setKaryawan(dKaryawan || []);
    setLogs(dLogs || []);
    setLoading(false);
  };

  const addKaryawan = async (e: any) => {
    e.preventDefault();
    const { nama, pin, shift } = e.target.elements;
    await supabase.from('karyawan').insert([{ nama: nama.value, pin: pin.value, shift: shift.value }]);
    e.target.reset();
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 md:p-12 font-sans selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 italic uppercase">Back<span className="text-indigo-600">Office</span></h1>
            <p className="text-slate-400 text-xs font-bold tracking-[0.2em] mt-1 italic">PREMIUM MANAGEMENT SYSTEM</p>
          </div>
          <Link to="/" className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">← Front</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Registrasi */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
            <h2 className="text-xl font-black mb-6 uppercase italic">Daftarkan PIN</h2>
            <form onSubmit={addKaryawan} className="space-y-4">
              <input name="nama" placeholder="Nama Lengkap" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm outline-none" required />
              <input name="pin" placeholder="PIN (4 Digit)" maxLength={4} className="w-full bg-white border border-slate-100 p-4 rounded-2xl text-sm font-mono tracking-widest outline-none" required />
              <select name="shift" className="w-full bg-white border border-slate-100 p-4 rounded-2xl text-sm">
                <option value="Siang">Shift Siang</option>
                <option value="Malam">Shift Malam</option>
              </select>
              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg shadow-indigo-100 mt-4">Simpan</button>
            </form>
          </div>

          {/* Analitik Absen Terburuk */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 lg:col-span-2 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <h2 className="text-xl font-black mb-6 uppercase italic">Peringatan Disiplin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2">
              {karyawan.map(k => {
                const late = logs.filter(l => l.karyawan_id === k.id && l.status === 'Terlambat').length;
                if (late === 0) return null;
                return (
                  <div key={k.id} className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex justify-between items-center">
                    <p className="font-black text-slate-900 text-xs uppercase italic">{k.nama}</p>
                    <span className="text-rose-500 text-[10px] font-black">{late}x TERLAMBAT</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabel Log dengan Foto */}
        <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
             <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-500 italic">Live Feed Absensi</h3>
             <button onClick={fetchData} className="text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-800 tracking-[0.2em]">Refresh</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[9px] tracking-[0.3em] font-black">
                <tr>
                  <th className="p-8">Foto</th>
                  <th className="p-8">Karyawan</th>
                  <th className="p-8">Waktu</th>
                  <th className="p-8 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 italic">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-all group">
                    <td className="p-6">
                      <div className="w-12 h-12 rounded-2xl bg-slate-200 border border-white shadow-sm overflow-hidden">
                        {log.foto_url ? (
                          <img src={log.foto_url} className="w-full h-full object-cover" alt="Log" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400">No Img</div>
                        )}
                      </div>
                    </td>
                    <td className="p-8 text-slate-900 font-black uppercase text-xs">{log.nama}</td>
                    <td className="p-8">
                      <div className="flex flex-col">
                        <span className="text-indigo-600 font-black text-lg font-mono tracking-tighter">{log.jam}</span>
                        <span className="text-[8px] text-slate-400 uppercase font-bold">{log.tipe}</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] inline-block ${
                        log.status === 'On Time' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>{log.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
