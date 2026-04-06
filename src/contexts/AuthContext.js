import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authServiceV2';
export const AuthContext = createContext(undefined);
export const AuthProvider = ({ children, }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Check auth on mount
    useEffect(() => {
        const checkAuth = () => {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            setIsLoading(false);
        };
        checkAuth();
    }, []);
    // Setup session timeout check (every minute)
    useEffect(() => {
        const interval = setInterval(() => {
            if (user && !authService.isAuthenticated()) {
                console.warn('⏰ Session expired, logging out...');
                setUser(null);
            }
        }, 60000); // Check every 1 minute
        return () => clearInterval(interval);
    }, [user]);
    // Auto-refresh session every 30 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            if (user && authService.isAuthenticated()) {
                authService.refreshSession();
            }
        }, 30 * 60 * 1000); // 30 minutes
        return () => clearInterval(interval);
    }, [user]);
    const login = useCallback(async (email, password) => {
        try {
            setIsLoading(true);
            const loggedInUser = await authService.login(email, password);
            setUser(loggedInUser);
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setUser(null);
        }
        catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }, []);
    const checkAuth = useCallback(() => {
        return authService.isAuthenticated();
    }, []);
    const getSessionInfo = useCallback(() => {
        const user = authService.getCurrentUser();
        if (!user)
            return null;
        const remainingMinutes = authService.getSessionRemainingTime();
        return {
            user,
            remaining_minutes: remainingMinutes,
        };
    }, []);
    const value = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        checkAuth,
        getSessionInfo,
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
