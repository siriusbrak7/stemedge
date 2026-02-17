import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ error?: any }>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const result = await authService.initialize();
                console.log('Auth initialized:', result.user); // Debug log
                setUser(result.user);
            } catch (error) {
                console.error("Auth init error:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const result = await authService.login(email, password);
        if (result.data?.user) {
            console.log('Login successful, user role:', result.data.user.role); // Debug log
            setUser(result.data.user);
            return { error: null };
        }
        return { error: result.error };
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
};