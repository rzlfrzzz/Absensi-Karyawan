// ============================================
// DEFAULT SHIFT SETTINGS
// ============================================
export const DEFAULT_SHIFTS = [
    {
        id: 'shift-001',
        nama_shift: 'Siang',
        jam_masuk: '08:00',
        jam_pulang: '17:00',
        tolerance_menit: 15,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'shift-002',
        nama_shift: 'Malam',
        jam_masuk: '17:15',
        jam_pulang: '02:15',
        tolerance_menit: 15,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];
// ============================================
// DEFAULT GAJI SETTINGS (PER JABATAN)
// ============================================
export const DEFAULT_GAJI_SETTINGS = [
    {
        id: 'gaji-001',
        jabatan: 'Penjahit',
        gaji_pokok: 2000000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'gaji-002',
        jabatan: 'Admin',
        gaji_pokok: 3000000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'gaji-003',
        jabatan: 'HRD',
        gaji_pokok: 3500000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'gaji-004',
        jabatan: 'Supervisor',
        gaji_pokok: 2500000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];
// ============================================
// DEFAULT BONUS & DEDUCTION RULES
// ============================================
export const DEFAULT_BONUS_RULES = {
    id: 'rules-001',
    // Bonus On-time
    bonus_ontime_tipe: 'per_hari',
    bonus_ontime_jumlah: 50000,
    // Potongan Terlambat
    potongan_terlambat_tipe: 'per_15menit',
    potongan_terlambat_jumlah: 10000,
    // Potongan Absent
    potongan_absent_tipe: 'per_hari',
    potongan_absent_jumlah: 100000,
    // Early Checkout
    early_checkout_allowed: false,
    bonus_early_checkout: 0,
    // Meta
    updated_at: new Date().toISOString(),
};
// ============================================
// DEFAULT HOLIDAYS
// ============================================
export const DEFAULT_HOLIDAYS = [
    {
        id: 'holiday-001',
        tanggal: '2024-01-01',
        nama: 'Tahun Baru',
        jenis: 'nasional',
        is_paid_leave: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 'holiday-002',
        tanggal: '2024-12-25',
        nama: 'Natal',
        jenis: 'nasional',
        is_paid_leave: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];
// ============================================
// DEFAULT COMPANY SETTINGS
// ============================================
export const DEFAULT_COMPANY_SETTINGS = {
    id: 'company-001',
    nama_perusahaan: 'Buymore Workers',
    alamat: 'Jl. Merdeka No. 123',
    phone: '+62-123-456-789',
    email: 'admin@buymoreworkers.com',
    currency: 'IDR',
    fiscal_year_start: 1, // Januari
    max_terlambat_per_bulan: 3,
    max_absent_per_bulan: 2,
    updated_at: new Date().toISOString(),
};
