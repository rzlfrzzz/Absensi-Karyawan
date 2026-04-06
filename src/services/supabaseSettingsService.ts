import { supabase } from '../lib/supabaseClient';

export interface ShiftSetting {
  id?: string;
  nama: string;
  jam_masuk: string;
  jam_pulang: string;
  tolerance: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GajiSetting {
  id?: string;
  jabatan: string;
  gaji_pokok: number;
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BonusRule {
  id?: string;
  tipe: string;
  jumlah: number;
  frequency: 'per_hari' | 'per_bulan';
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DeductionRule {
  id?: string;
  tipe: string;
  jumlah: number;
  tipe_perhitungan: 'per_menit' | 'per_15min' | 'per_jam' | 'flat';
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Holiday {
  id?: string;
  tanggal: string;
  nama: string;
  tipe: 'national' | 'company' | 'custom';
  paid_leave: boolean;
  created_at?: string;
  updated_at?: string;
}

// Shift Settings
export async function getShiftSettings(): Promise<ShiftSetting[]> {
  try {
    const { data, error } = await supabase
      .from('shift_settings')
      .select('*')
      .order('nama', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch shift settings:', error);
    return [];
  }
}

export async function addShiftSetting(setting: ShiftSetting): Promise<boolean> {
  try {
    const { error } = await supabase.from('shift_settings').insert([setting]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to add shift setting:', error);
    return false;
  }
}

export async function updateShiftSetting(
  id: string,
  setting: Partial<ShiftSetting>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('shift_settings')
      .update({ ...setting, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update shift setting:', error);
    return false;
  }
}

export async function deleteShiftSetting(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('shift_settings').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete shift setting:', error);
    return false;
  }
}

// Gaji Settings
export async function getGajiSettings(): Promise<GajiSetting[]> {
  try {
    const { data, error } = await supabase
      .from('gaji_settings')
      .select('*')
      .order('jabatan', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch gaji settings:', error);
    return [];
  }
}

export async function addGajiSetting(setting: GajiSetting): Promise<boolean> {
  try {
    const { error } = await supabase.from('gaji_settings').insert([setting]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to add gaji setting:', error);
    return false;
  }
}

export async function updateGajiSetting(
  id: string,
  setting: Partial<GajiSetting>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('gaji_settings')
      .update({ ...setting, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update gaji setting:', error);
    return false;
  }
}

export async function deleteGajiSetting(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('gaji_settings').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete gaji setting:', error);
    return false;
  }
}

// Bonus Rules
export async function getBonusRules(): Promise<BonusRule[]> {
  try {
    const { data, error } = await supabase
      .from('bonus_rules')
      .select('*')
      .order('tipe', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch bonus rules:', error);
    return [];
  }
}

export async function addBonusRule(rule: BonusRule): Promise<boolean> {
  try {
    const { error } = await supabase.from('bonus_rules').insert([rule]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to add bonus rule:', error);
    return false;
  }
}

export async function updateBonusRule(
  id: string,
  rule: Partial<BonusRule>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bonus_rules')
      .update({ ...rule, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update bonus rule:', error);
    return false;
  }
}

export async function deleteBonusRule(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('bonus_rules').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete bonus rule:', error);
    return false;
  }
}

// Deduction Rules
export async function getDeductionRules(): Promise<DeductionRule[]> {
  try {
    const { data, error } = await supabase
      .from('deduction_rules')
      .select('*')
      .order('tipe', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch deduction rules:', error);
    return [];
  }
}

export async function addDeductionRule(rule: DeductionRule): Promise<boolean> {
  try {
    const { error } = await supabase.from('deduction_rules').insert([rule]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to add deduction rule:', error);
    return false;
  }
}

export async function updateDeductionRule(
  id: string,
  rule: Partial<DeductionRule>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('deduction_rules')
      .update({ ...rule, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update deduction rule:', error);
    return false;
  }
}

export async function deleteDeductionRule(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('deduction_rules').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete deduction rule:', error);
    return false;
  }
}

// Holiday Calendar
export async function getHolidayCalendar(year?: number): Promise<Holiday[]> {
  try {
    let query = supabase.from('holiday_calendar').select('*');

    if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      query = query.gte('tanggal', startDate).lte('tanggal', endDate);
    }

    const { data, error } = await query.order('tanggal', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch holiday calendar:', error);
    return [];
  }
}

export async function addHoliday(holiday: Holiday): Promise<boolean> {
  try {
    const { error } = await supabase.from('holiday_calendar').insert([holiday]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to add holiday:', error);
    return false;
  }
}

export async function updateHoliday(
  id: string,
  holiday: Partial<Holiday>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('holiday_calendar')
      .update({ ...holiday, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update holiday:', error);
    return false;
  }
}

export async function deleteHoliday(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('holiday_calendar').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete holiday:', error);
    return false;
  }
}
