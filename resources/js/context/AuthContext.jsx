
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const clearAuth = useCallback(() => {
        localStorage.removeItem('taskflow_token');
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem('taskflow_token');

        if (!token) {
            setUser(null);
            return null;
        }

        try {
            const response = await api.get('/website/auth/me');

            const currentUser = response.data.data.user;

            setUser(currentUser);

            return currentUser;
        } catch (error) {
            clearAuth();

            throw error;
        }
    }, [clearAuth]);

    const login = useCallback(async (credentials) => {
        const response = await api.post(
            '/website/auth/login',
            credentials
        );

        const { user: loggedInUser, token } = response.data.data;

        localStorage.setItem('taskflow_token', token);
        setUser(loggedInUser);

        return loggedInUser;
    }, []);

    const register = useCallback(async (formData) => {
        const response = await api.post(
            '/website/auth/register',
            formData
        );

        const { user: registeredUser, token } = response.data.data;

        localStorage.setItem('taskflow_token', token);
        setUser(registeredUser);

        return registeredUser;
    }, []);


async function logout() {
    const token = localStorage.getItem('taskflow_token');

    try {
        if (token) {
            await api.post('/website/auth/logout');
        }
    } finally {
        // Always clear local authentication, even if the API fails.
        localStorage.removeItem('taskflow_token');
        setUser(null);
    }
}


    useEffect(() => {
        let active = true;

        async function initializeAuth() {
            try {
                await refreshUser();
            } catch {
                // Authentication will remain cleared if the request fails.
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        initializeAuth();

        return () => {
            active = false;
        };
    }, [refreshUser]);

    useEffect(() => {
        const handleUnauthorized = () => {
            clearAuth();
        };

        window.addEventListener(
            'taskflow:unauthorized',
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                'taskflow:unauthorized',
                handleUnauthorized
            );
        };
    }, [clearAuth]);

    const value = {
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used inside AuthProvider.'
        );
    }

    return context;
}


