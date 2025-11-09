import { createContext, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be added within a AuthProvider');
    }
    return context
}

export const AuthProvider = ({ children }) => {
    
}