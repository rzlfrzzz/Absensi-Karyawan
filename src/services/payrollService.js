import { supabase } from '../lib/supabaseClient';
// ============================================
// PAYROLL SERVICE
// ============================================
export const payrollService = {
    // ============ CALCULATIONS ============
    /**
     * Calculate attendance statistics untuk periode tertentu
     */
    async calculateAttendanceStats(karyawan_id, periode_start, periode_end) {
        try {
            const { data: logs, error } = await supabase
                .from('logs_absensi')
                .select('*')
                .eq('karyawan_id', karyawan_id)
                .gte('created_at', `${periode_start}T00:00:00`)
                .lte('created_at', `${periode_end}T23:59:59`);
            if (error)
                throw error;
            const stats = {
                present_days: 0,
                late_days: 0,
                late_minutes: 0,
                absent_days: 0,
                early_checkout_days: 0,
                working_days: this.getWorkingDays(periode_start, periode_end),
            };
            const checkinLogs = logs?.filter((log) => log.tipe === 'MASUK') || [];
            const checkoutLogs = logs?.filter((log) => log.tipe === 'PULANG') || [];
            // Count present days
            stats.present_days = checkinLogs.length;
            // Count late days & calculate late minutes
            checkinLogs.forEach((log) => {
                if (log.status?.toLowerCase().includes('late')) {
                    stats.late_days++;
                    const minutes = this.extractMinutesFromStatus(log.status);
                    stats.late_minutes += minutes;
                }
            });
            // Count early checkout days
            checkoutLogs.forEach((log) => {
                if (log.status?.toLowerCase().includes('pulang cepat') || log.status?.toLowerCase().includes('early')) {
                    stats.early_checkout_days++;
                }
            });
            // Calculate absent days
            stats.absent_days = Math.max(0, stats.working_days - stats.present_days);
            return stats;
        }
        catch (error) {
            console.error('Failed to calculate attendance stats:', error);
            return {
                present_days: 0,
                late_days: 0,
                late_minutes: 0,
                absent_days: 0,
                early_checkout_days: 0,
                working_days: 0,
            };
        }
    },
    /**
     * Get tax settings (PPh21)
     */
    async getTaxSettings() {
        try {
            const { data, error } = await supabase
                .from('tax_settings')
                .select('*')
                .eq('active', true)
                .single();
            if (error)
                throw error;
            return {
                nontaxable: data.pph21_nontaxable || 5000000,
                brackets: data.tax_brackets || [],
            };
        }
        catch (error) {
            console.error('Failed to fetch tax settings:', error);
            // Return default
            return {
                nontaxable: 5000000,
                brackets: [
                    { min: 0, max: 50000000, rate: 0.05 },
                    { min: 50000001, max: 250000000, rate: 0.15 },
                    { min: 250000001, max: 500000000, rate: 0.25 },
                    { min: 500000001, max: null, rate: 0.3 },
                ],
            };
        }
    },
    /**
     * Calculate PPh21 tax
     */
    calculatePPh21(grossSalary, taxSettings) {
        const taxableIncome = Math.max(0, grossSalary - taxSettings.nontaxable);
        if (taxableIncome <= 0)
            return 0;
        let tax = 0;
        for (const bracket of taxSettings.brackets) {
            const maxIncome = bracket.max || taxableIncome;
            const incomeInBracket = Math.min(taxableIncome, maxIncome) - bracket.min;
            if (incomeInBracket > 0) {
                tax += incomeInBracket * bracket.rate;
            }
            if (taxableIncome <= maxIncome)
                break;
        }
        return Math.round(tax);
    },
    /**
     * Get bonus/deduction rules
     */
    async getBonusDeductionRules() {
        try {
            const [bonusRules, deductionRules] = await Promise.all([
                supabase.from('bonus_rules').select('*').eq('active', true),
                supabase.from('deduction_rules').select('*').eq('active', true),
            ]);
            const bonusOnTime = bonusRules.data?.find((r) => r.tipe === 'on_time')?.jumlah || 50000;
            const bonusEarlyCheckout = bonusRules.data?.find((r) => r.tipe === 'early_checkout')?.jumlah || 25000;
            const deductionLate = deductionRules.data?.find((r) => r.tipe === 'late')?.jumlah || 10000;
            const deductionAbsent = deductionRules.data?.find((r) => r.tipe === 'absent')?.jumlah || 100000;
            return {
                bonusOnTime,
                bonusEarlyCheckout,
                deductionLate,
                deductionAbsent,
            };
        }
        catch (error) {
            console.error('Failed to fetch bonus/deduction rules:', error);
            return {
                bonusOnTime: 50000,
                bonusEarlyCheckout: 25000,
                deductionLate: 10000,
                deductionAbsent: 100000,
            };
        }
    },
    /**
     * Calculate payroll untuk employee & period
     */
    async calculatePayroll(employee, periode_start, periode_end, customDeductions = []) {
        try {
            // 1. Get attendance stats
            const attendanceStats = await this.calculateAttendanceStats(employee.id, periode_start, periode_end);
            // 2. Get gaji pokok
            const { data: gajiSetting } = await supabase
                .from('gaji_settings')
                .select('gaji_pokok')
                .eq('jabatan', employee.jabatan)
                .single();
            const gaji_pokok = gajiSetting?.gaji_pokok || 3500000;
            // 3. Get bonus & deduction rules
            const rules = await this.getBonusDeductionRules();
            // 4. Calculate bonus
            const bonus_on_time = rules.bonusOnTime * attendanceStats.present_days;
            const bonus_early_checkout = rules.bonusEarlyCheckout * attendanceStats.early_checkout_days;
            const bonus_other = 0;
            const total_bonus = bonus_on_time + bonus_early_checkout + bonus_other;
            const gross_salary = gaji_pokok + total_bonus;
            // 5. Calculate deductions
            const deduction_late = rules.deductionLate * attendanceStats.late_days;
            const deduction_absent = rules.deductionAbsent * attendanceStats.absent_days;
            const deduction_custom = customDeductions.reduce((sum, d) => sum + d.amount, 0);
            // 6. Calculate tax
            const taxSettings = await this.getTaxSettings();
            const tax_pph21 = this.calculatePPh21(gross_salary, taxSettings);
            // 7. Calculate net salary
            const total_deductions = deduction_late + deduction_absent + deduction_custom + tax_pph21;
            const net_salary = gross_salary - total_deductions;
            // 8. Build details array
            const details = [];
            if (deduction_late > 0) {
                details.push({
                    type: 'late',
                    description: `Potongan terlambat (${attendanceStats.late_days} hari)`,
                    amount: deduction_late,
                });
            }
            if (deduction_absent > 0) {
                details.push({
                    type: 'absent',
                    description: `Potongan absent (${attendanceStats.absent_days} hari)`,
                    amount: deduction_absent,
                });
            }
            customDeductions.forEach((d) => {
                details.push({
                    type: 'custom',
                    description: d.description,
                    amount: d.amount,
                });
            });
            if (tax_pph21 > 0) {
                details.push({
                    type: 'pph21',
                    description: 'PPh21 Tax',
                    amount: tax_pph21,
                });
            }
            return {
                gaji_pokok,
                bonus_on_time,
                bonus_early_checkout,
                bonus_other,
                total_bonus,
                gross_salary,
                deduction_late,
                deduction_absent,
                deduction_custom,
                tax_pph21,
                total_deductions,
                net_salary,
                details,
            };
        }
        catch (error) {
            console.error('Failed to calculate payroll:', error);
            throw error;
        }
    },
    // ============ CRUD OPERATIONS ============
    /**
     * Create payroll record
     */
    async createPayroll(payroll, deductions) {
        try {
            // Insert payroll record
            const { data: payrollData, error: payrollError } = await supabase
                .from('payroll_records')
                .insert([payroll])
                .select()
                .single();
            if (payrollError)
                throw payrollError;
            const payroll_id = payrollData.id;
            // Insert deductions
            if (deductions.length > 0) {
                const deductionsToInsert = deductions.map((d) => ({
                    ...d,
                    payroll_id,
                }));
                const { error: deductionError } = await supabase
                    .from('payroll_deductions')
                    .insert(deductionsToInsert);
                if (deductionError)
                    throw deductionError;
            }
            console.log('✅ Payroll created:', payroll_id);
            return { payroll_id, success: true };
        }
        catch (error) {
            console.error('❌ Failed to create payroll:', error);
            throw error;
        }
    },
    /**
     * Get payroll by ID
     */
    async getPayrollById(payroll_id) {
        try {
            const { data, error } = await supabase
                .from('payroll_records')
                .select('*')
                .eq('id', payroll_id)
                .single();
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Failed to get payroll:', error);
            return null;
        }
    },
    /**
     * Get all payrolls dengan filters
     */
    async getAllPayrolls(filters) {
        try {
            let query = supabase.from('payroll_records').select('*');
            if (filters?.karyawan_id) {
                query = query.eq('karyawan_id', filters.karyawan_id);
            }
            if (filters?.periode_start) {
                query = query.gte('periode_start', filters.periode_start);
            }
            if (filters?.periode_end) {
                query = query.lte('periode_end', filters.periode_end);
            }
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            const { data, error } = await query.order('periode_start', { ascending: false });
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
            console.error('Failed to fetch payrolls:', error);
            return [];
        }
    },
    /**
     * Update payroll status
     */
    async updatePayrollStatus(payroll_id, status, updatedFields = {}) {
        try {
            const { error } = await supabase
                .from('payroll_records')
                .update({
                status,
                ...updatedFields,
                updated_at: new Date().toISOString(),
            })
                .eq('id', payroll_id);
            if (error)
                throw error;
            console.log('✅ Payroll status updated:', status);
            return true;
        }
        catch (error) {
            console.error('❌ Failed to update payroll status:', error);
            return false;
        }
    },
    /**
     * Submit payroll untuk approval
     */
    async submitPayrollForApproval(payroll_id, submitted_by) {
        try {
            const { error } = await supabase
                .from('payroll_records')
                .update({
                status: 'pending_approval',
                submitted_by,
                submitted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
                .eq('id', payroll_id);
            if (error)
                throw error;
            // Create approval record
            await supabase.from('payroll_approvals').insert([
                {
                    payroll_id,
                    requested_by: submitted_by,
                    action: 'submitted',
                },
            ]);
            console.log('✅ Payroll submitted for approval');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to submit payroll:', error);
            return false;
        }
    },
    /**
     * Approve payroll
     */
    async approvePayroll(payroll_id, approved_by, notes) {
        try {
            const { error } = await supabase
                .from('payroll_records')
                .update({
                status: 'approved',
                approved_by,
                approved_at: new Date().toISOString(),
                notes: notes || '',
                updated_at: new Date().toISOString(),
            })
                .eq('id', payroll_id);
            if (error)
                throw error;
            // Create approval record
            await supabase.from('payroll_approvals').insert([
                {
                    payroll_id,
                    approved_by,
                    action: 'approved',
                    notes,
                },
            ]);
            console.log('✅ Payroll approved');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to approve payroll:', error);
            return false;
        }
    },
    /**
     * Reject payroll
     */
    async rejectPayroll(payroll_id, rejected_by, reason) {
        try {
            const { error } = await supabase
                .from('payroll_records')
                .update({
                status: 'rejected',
                notes: reason,
                updated_at: new Date().toISOString(),
            })
                .eq('id', payroll_id);
            if (error)
                throw error;
            // Create approval record
            await supabase.from('payroll_approvals').insert([
                {
                    payroll_id,
                    approved_by: rejected_by,
                    action: 'rejected',
                    notes: reason,
                },
            ]);
            console.log('✅ Payroll rejected');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to reject payroll:', error);
            return false;
        }
    },
    /**
     * Mark payroll as PAID
     */
    async markPayrollAsPaid(payroll_id, paid_by, payment_method_id, payment_reference) {
        try {
            const { error } = await supabase
                .from('payroll_records')
                .update({
                status: 'paid',
                paid_by,
                paid_at: new Date().toISOString(),
                payment_method_id,
                payment_reference: payment_reference || '',
                updated_at: new Date().toISOString(),
            })
                .eq('id', payroll_id);
            if (error)
                throw error;
            console.log('✅ Payroll marked as paid');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to mark payroll as paid:', error);
            return false;
        }
    },
    /**
     * Delete payroll (only if draft)
     */
    async deletePayroll(payroll_id) {
        try {
            const { error } = await supabase
                .from('payroll_records')
                .delete()
                .eq('id', payroll_id)
                .eq('status', 'draft');
            if (error)
                throw error;
            console.log('✅ Payroll deleted');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to delete payroll:', error);
            return false;
        }
    },
    // ============ HELPER METHODS ============
    /**
     * Extract minutes dari status string
     */
    extractMinutesFromStatus(status) {
        const match = status.match(/(\d+)\s*min/i);
        return match ? parseInt(match[1]) : 0;
    },
    /**
     * Get working days (exclude weekends)
     */
    getWorkingDays(startDate, endDate) {
        let count = 0;
        const currentDate = new Date(startDate);
        const end = new Date(endDate);
        while (currentDate <= end) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
    },
};
