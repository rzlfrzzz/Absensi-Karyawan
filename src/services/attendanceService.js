import { supabase } from '../lib/supabaseClient';
export const attendanceService = {
    async getSettings() {
        try {
            // Get default settings dari shift_settings
            // TODO: Create company_settings table di database
            return {
                id: 'default',
                jam_masuk_siang: '08:00',
                jam_pulang_siang: '17:00',
                jam_masuk_malam: '17:00',
                jam_pulang_malam: '02:00',
            };
        }
        catch (error) {
            console.error('Failed to fetch settings:', error);
            return {
                id: 'default',
                jam_masuk_siang: '08:00',
                jam_pulang_siang: '17:00',
                jam_masuk_malam: '17:00',
                jam_pulang_malam: '02:00',
            };
        }
    },
    async getKaryawanByPin(pin) {
        try {
            const { data, error } = await supabase
                .from('karyawan')
                .select('*')
                .eq('pin', pin)
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Failed to fetch karyawan by pin:', error);
            return null;
        }
    },
    async uploadPhoto(blob, pin) {
        try {
            const fileName = `${Date.now()}_${pin}.jpg`;
            console.log('📸 Uploading photo:', fileName);
            const { error: uploadError } = await supabase.storage
                .from('absensi_photos')
                .upload(fileName, blob);
            if (uploadError) {
                console.error('❌ Upload error:', uploadError);
                throw uploadError;
            }
            const { data: publicUrl } = supabase.storage
                .from('absensi_photos')
                .getPublicUrl(fileName);
            console.log('✅ Photo uploaded:', publicUrl.publicUrl);
            return publicUrl.publicUrl;
        }
        catch (error) {
            console.error('⚠️ Failed to upload photo (will continue without):', error);
            // Return empty string - attendance log will still be saved without photo
            return '';
        }
    },
    async saveAttendanceLog(log) {
        try {
            console.log('📝 Saving attendance log:', log);
            const { error } = await supabase.from('logs_absensi').insert([log]);
            if (error) {
                console.error('❌ Supabase Error:', {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                    hint: error.hint,
                });
                throw error;
            }
            console.log('✅ Attendance log saved successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to save attendance log:', error);
            return false;
        }
    },
    async capturePhoto(videoRef, canvasRef) {
        try {
            if (!videoRef || !canvasRef)
                return null;
            const context = canvasRef.getContext('2d');
            if (!context)
                return null;
            canvasRef.width = videoRef.videoWidth;
            canvasRef.height = videoRef.videoHeight;
            context.drawImage(videoRef, 0, 0);
            return await new Promise((resolve) => {
                canvasRef.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
            });
        }
        catch (error) {
            console.error('Failed to capture photo:', error);
            return null;
        }
    },
};
