import { userManagementService } from './userManagementService';
// ============================================
// CONSTANTS
// ============================================
const SESSION_STORAGE_KEY = 'auth_session_v2';
const LOGIN_LOG_KEY = 'login_logs';
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
// ============================================
// AUTH SERVICE (Database Version)
// ============================================
export const authService = {
    /**
     * Login user dengan email & password
     */
    async login(email, password) {
        try {
            console.log('🔐 Login attempt:', email);
            // Validate input
            if (!email || !password) {
                throw new Error('Email dan password harus diisi');
            }
            // Authenticate user
            const user = await userManagementService.loginUser(email, password);
            if (!user) {
                throw new Error('Email atau password salah');
            }
            // Check if user is active
            if (!user.active) {
                throw new Error('User account tidak aktif');
            }
            // Create session
            const token = this.generateToken();
            const now = Date.now();
            const session = {
                user,
                token,
                login_time: now,
                expire_time: now + SESSION_TIMEOUT,
            };
            // Save to localStorage
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
            // Log login attempt
            this.logLoginAttempt(user.id || '', user.email, 'LOGIN');
            console.log('✅ Login successful:', email);
            return user;
        }
        catch (error) {
            console.error('❌ Login failed:', error);
            this.logLoginAttempt(email, email, 'LOGIN_FAILED');
            throw error;
        }
    },
    /**
     * Logout user
     */
    async logout() {
        try {
            const session = this.getSession();
            if (session) {
                this.logLoginAttempt(session.user.id || '', session.user.email, 'LOGOUT');
            }
            // Clear session from localStorage
            localStorage.removeItem(SESSION_STORAGE_KEY);
            console.log('✅ Logout successful');
        }
        catch (error) {
            console.error('❌ Logout failed:', error);
            throw error;
        }
    },
    /**
     * Get current session
     */
    getSession() {
        try {
            const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
            if (!sessionData) {
                return null;
            }
            const session = JSON.parse(sessionData);
            // Check if session expired
            if (Date.now() > session.expire_time) {
                console.warn('⏰ Session expired');
                localStorage.removeItem(SESSION_STORAGE_KEY);
                return null;
            }
            return session;
        }
        catch (error) {
            console.error('Error getting session:', error);
            return null;
        }
    },
    /**
     * Get current user
     */
    getCurrentUser() {
        const session = this.getSession();
        return session?.user || null;
    },
    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.getSession() !== null;
    },
    /**
     * Check if user has specific role
     */
    hasRole(requiredRole) {
        const user = this.getCurrentUser();
        if (!user)
            return false;
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(user.role);
        }
        return user.role === requiredRole;
    },
    /**
     * Check if user can perform action
     */
    canPerformAction(action) {
        const user = this.getCurrentUser();
        if (!user)
            return false;
        switch (action) {
            case 'manage_users':
                return userManagementService.canManageUsers(user.role);
            case 'manage_settings':
                return userManagementService.canManageSettings(user.role);
            case 'create_payroll':
                return userManagementService.canCreatePayroll(user.role);
            case 'approve_payroll':
                return userManagementService.canApprovePayroll(user.role);
            default:
                return false;
        }
    },
    /**
     * Refresh session (extend expiration)
     */
    refreshSession() {
        const session = this.getSession();
        if (session) {
            const now = Date.now();
            session.expire_time = now + SESSION_TIMEOUT;
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
            console.log('🔄 Session refreshed');
        }
    },
    /**
     * Get remaining session time (in minutes)
     */
    getSessionRemainingTime() {
        const session = this.getSession();
        if (!session)
            return 0;
        const remaining = session.expire_time - Date.now();
        return Math.floor(remaining / 1000 / 60); // Convert to minutes
    },
    /**
     * Change password
     */
    async changePassword(currentPassword, newPassword) {
        try {
            const user = this.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }
            const success = await userManagementService.changePassword(user.id, currentPassword, newPassword);
            if (success) {
                console.log('✅ Password changed successfully');
            }
            return success;
        }
        catch (error) {
            console.error('❌ Failed to change password:', error);
            throw error;
        }
    },
    // ============ HELPER METHODS ============
    /**
     * Generate random token
     */
    generateToken() {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    },
    /**
     * Log login attempt
     */
    logLoginAttempt(user_id, email, action) {
        try {
            const logs = JSON.parse(localStorage.getItem(LOGIN_LOG_KEY) || '[]');
            const log = {
                user_id,
                email,
                timestamp: Date.now(),
                action: action,
            };
            logs.push(log);
            // Keep only last 100 logs
            if (logs.length > 100) {
                logs.shift();
            }
            localStorage.setItem(LOGIN_LOG_KEY, JSON.stringify(logs));
        }
        catch (error) {
            console.error('Error logging login attempt:', error);
        }
    },
    /**
     * Get login logs
     */
    getLoginLogs() {
        try {
            return JSON.parse(localStorage.getItem(LOGIN_LOG_KEY) || '[]');
        }
        catch (error) {
            console.error('Error getting login logs:', error);
            return [];
        }
    },
    /**
     * Clear old login logs (older than 30 days)
     */
    clearOldLogs() {
        try {
            const logs = this.getLoginLogs();
            const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
            const recentLogs = logs.filter((log) => log.timestamp > thirtyDaysAgo);
            localStorage.setItem(LOGIN_LOG_KEY, JSON.stringify(recentLogs));
            console.log('✅ Old login logs cleared');
        }
        catch (error) {
            console.error('Error clearing old logs:', error);
        }
    },
};
