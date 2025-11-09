import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { authAPI } from '../api/authAPI'

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context
}

export const AuthProvider = ({ children }) => {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     const isMountedRef = useRef(true);

     useEffect(() => {
        isMountedRef.current = true;
        checkAuth();
        
        return () => {
            isMountedRef.current = false;
        };
     }, []);

     const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if(token) {
                const userData = await authAPI.getMe();
                if(isMountedRef.current) {
                    setUser(userData);
                    setError(null);
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            if(isMountedRef.current) {
                setUser(null);
                setError(error.message);
            }
        } finally {
            if(isMountedRef.current) {
                setLoading(false);
            }
        }
     }, []);

     const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.login(email, password);
            localStorage.setItem('token', response.token);
            setUser(response.user);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
     };

     const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.register(userData);
            localStorage.setItem('token', response.token);
            setUser(response.user);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
     };

     const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setError(null);
     }, []);

     const value = {
        user,
        login,
        register,
        logout,
        loading,
        error,
        isAuthenticated: !!user
     };

     return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
     )
}