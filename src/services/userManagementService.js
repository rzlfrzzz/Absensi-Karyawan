import { supabase } from '../lib/supabaseClient';
import bcrypt from 'bcryptjs';
// ============================================
// USER MANAGEMENT SERVICE
// ============================================
export const userManagementService = {
    // ============ AUTHENTICATION ============
    /**
     * Hash password dengan bcryptjs
     */
    async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        }
        catch (error) {
            console.error('Error hashing password:', error);
            throw error;
        }
    },
    /**
     * Verify password dengan bcryptjs
     */
    async verifyPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        }
        catch (error) {
            console.error('Password verification error:', error);
            return false;
        }
    },
    /**
     * Create new user
     */
    async createUser(input) {
        try {
            // Validate input
            if (!input.email || !input.password || !input.nama_lengkap) {
                throw new Error('Email, password, dan nama lengkap harus diisi');
            }
            // Check if email already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', input.email)
                .single();
            if (existingUser) {
                throw new Error('Email sudah digunakan');
            }
            // Hash password
            const password_hash = await this.hashPassword(input.password);
            // Create user
            const { data, error } = await supabase
                .from('users')
                .insert([
                {
                    email: input.email,
                    password_hash,
                    nama_lengkap: input.nama_lengkap,
                    role: input.role,
                    karyawan_id: input.karyawan_id || null,
                    manager_id: input.manager_id || null,
                    active: true,
                },
            ])
                .select()
                .single();
            if (error)
                throw error;
            console.log('✅ User created:', data.id);
            return { user_id: data.id, success: true };
        }
        catch (error) {
            console.error('❌ Failed to create user:', error);
            throw error;
        }
    },
    /**
     * Get user by email & password (login)
     */
    async loginUser(email, password) {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('active', true)
                .single();
            if (error || !user) {
                console.error('User not found:', email);
                return null;
            }
            // Verify password
            const isValid = await this.verifyPassword(password, user.password_hash);
            if (!isValid) {
                console.error('Invalid password');
                return null;
            }
            // Update last_login
            await supabase
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('id', user.id);
            // Return user without password
            const { password_hash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            console.error('❌ Login failed:', error);
            return null;
        }
    },
    /**
     * Change user password
     */
    async changePassword(user_id, oldPassword, newPassword) {
        try {
            // Get user
            const { data: user, error: getUserError } = await supabase
                .from('users')
                .select('password_hash')
                .eq('id', user_id)
                .single();
            if (getUserError || !user) {
                throw new Error('User not found');
            }
            // Verify old password
            const isValid = await this.verifyPassword(oldPassword, user.password_hash);
            if (!isValid) {
                throw new Error('Password lama tidak sesuai');
            }
            // Hash new password
            const newPasswordHash = await this.hashPassword(newPassword);
            // Update password
            const { error: updateError } = await supabase
                .from('users')
                .update({
                password_hash: newPasswordHash,
                updated_at: new Date().toISOString(),
            })
                .eq('id', user_id);
            if (updateError)
                throw updateError;
            console.log('✅ Password changed');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to change password:', error);
            return false;
        }
    },
    /**
     * Reset password (by admin)
     */
    async resetPassword(user_id, newPassword) {
        try {
            const passwordHash = await this.hashPassword(newPassword);
            const { error } = await supabase
                .from('users')
                .update({
                password_hash: passwordHash,
                updated_at: new Date().toISOString(),
            })
                .eq('id', user_id);
            if (error)
                throw error;
            console.log('✅ Password reset');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to reset password:', error);
            return false;
        }
    },
    // ============ USER MANAGEMENT ============
    /**
     * Get all users
     */
    async getAllUsers() {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('nama_lengkap', { ascending: true });
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
            console.error('Failed to fetch users:', error);
            return [];
        }
    },
    /**
     * Get user by ID with karyawan & manager info
     */
    async getUserById(user_id) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user_id)
                .single();
            if (error)
                throw error;
            let userWithDetails = data;
            // Fetch karyawan info if exists
            if (data.karyawan_id) {
                const { data: karyawan } = await supabase
                    .from('karyawan')
                    .select('id, nama, jabatan, shift')
                    .eq('id', data.karyawan_id)
                    .single();
                if (karyawan) {
                    userWithDetails.karyawan = karyawan;
                }
            }
            // Fetch manager info if exists
            if (data.manager_id) {
                const { data: manager } = await supabase
                    .from('users')
                    .select('id, nama_lengkap')
                    .eq('id', data.manager_id)
                    .single();
                if (manager) {
                    userWithDetails.manager = manager;
                }
            }
            return userWithDetails;
        }
        catch (error) {
            console.error('Failed to fetch user:', error);
            return null;
        }
    },
    /**
     * Get users by role
     */
    async getUsersByRole(role) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('role', role)
                .order('nama_lengkap', { ascending: true });
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
            console.error('Failed to fetch users by role:', error);
            return [];
        }
    },
    /**
     * Get managers (untuk assign manager_id)
     */
    async getManagers() {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('id, nama_lengkap')
                .in('role', ['super_admin', 'hr_admin', 'manager'])
                .order('nama_lengkap', { ascending: true });
            if (error)
                throw error;
            return data || [];
        }
        catch (error) {
            console.error('Failed to fetch managers:', error);
            return [];
        }
    },
    /**
     * Update user
     */
    async updateUser(user_id, updates) {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
                .eq('id', user_id);
            if (error)
                throw error;
            console.log('✅ User updated:', user_id);
            return true;
        }
        catch (error) {
            console.error('❌ Failed to update user:', error);
            return false;
        }
    },
    /**
     * Update user role
     */
    async updateUserRole(user_id, newRole) {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                role: newRole,
                updated_at: new Date().toISOString(),
            })
                .eq('id', user_id);
            if (error)
                throw error;
            console.log('✅ User role updated:', newRole);
            return true;
        }
        catch (error) {
            console.error('❌ Failed to update user role:', error);
            return false;
        }
    },
    /**
     * Deactivate user (soft delete)
     */
    async deactivateUser(user_id) {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                active: false,
                updated_at: new Date().toISOString(),
            })
                .eq('id', user_id);
            if (error)
                throw error;
            console.log('✅ User deactivated');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to deactivate user:', error);
            return false;
        }
    },
    /**
     * Reactivate user
     */
    async reactivateUser(user_id) {
        try {
            const { error } = await supabase
                .from('users')
                .update({
                active: true,
                updated_at: new Date().toISOString(),
            })
                .eq('id', user_id);
            if (error)
                throw error;
            console.log('✅ User reactivated');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to reactivate user:', error);
            return false;
        }
    },
    /**
     * Delete user (hard delete - only for admin)
     */
    async deleteUser(user_id) {
        try {
            const { error } = await supabase.from('users').delete().eq('id', user_id);
            if (error)
                throw error;
            console.log('✅ User deleted');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to delete user:', error);
            return false;
        }
    },
    // ============ AUTHORIZATION HELPERS ============
    /**
     * Check if user has permission untuk action
     */
    canUserAccess(userRole, requiredRole) {
        return requiredRole.includes(userRole);
    },
    /**
     * Get role hierarchy level
     */
    getRoleLevel(role) {
        const levels = {
            super_admin: 4,
            hr_admin: 3,
            manager: 2,
            employee: 1,
        };
        return levels[role];
    },
    /**
     * Check if user dapat approve payroll
     */
    canApprovePayroll(userRole) {
        return ['super_admin', 'manager'].includes(userRole);
    },
    /**
     * Check if user dapat create payroll
     */
    canCreatePayroll(userRole) {
        return ['super_admin', 'hr_admin'].includes(userRole);
    },
    /**
     * Check if user dapat manage users
     */
    canManageUsers(userRole) {
        return ['super_admin'].includes(userRole);
    },
    /**
     * Check if user dapat manage settings
     */
    canManageSettings(userRole) {
        return ['super_admin'].includes(userRole);
    },
    /**
     * Check if user dapat view payroll (anyone dapat lihat own payroll, admin semua)
     */
    canViewPayroll(userRole, isOwnPayroll) {
        if (['super_admin', 'hr_admin'].includes(userRole)) {
            return true; // Can view all
        }
        if (userRole === 'manager') {
            return true; // Can view team payroll
        }
        return isOwnPayroll; // Employee hanya bisa lihat own
    },
};
