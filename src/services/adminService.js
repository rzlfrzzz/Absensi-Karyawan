import { supabase } from '../lib/supabaseClient';
export const adminService = {
    async getAllKaryawan() {
        try {
            const { data, error } = await supabase
                .from('karyawan')
                .select('*')
                .order('nama', { ascending: true });
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
            console.error('Failed to fetch karyawan:', error);
            return [];
        }
    },
    async getAllLogs() {
        try {
            const { data, error } = await supabase
                .from('logs_absensi')
                .select('*')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
            console.error('Failed to fetch logs:', error);
            return [];
        }
    },
    async addKaryawan(nama, pin, jabatan, shift) {
        try {
            const { error } = await supabase.from('karyawan').insert([
                { nama, pin, jabatan, shift },
            ]);
            if (error)
                throw error;
            return true;
        }
        catch (error) {
            console.error('Failed to add karyawan:', error);
            return false;
        }
    },
    async deleteKaryawan(id) {
        try {
            const { error } = await supabase.from('karyawan').delete().eq('id', id);
            if (error)
                throw error;
            return true;
        }
        catch (error) {
            console.error('Failed to delete karyawan:', error);
            return false;
        }
    },
    async deleteLog(id) {
        try {
            const { error } = await supabase.from('logs_absensi').delete().eq('id', id);
            if (error)
                throw error;
            return true;
        }
        catch (error) {
            console.error('Failed to delete log:', error);
            return false;
        }
    },
};
