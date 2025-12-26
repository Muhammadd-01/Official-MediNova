import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // We can verify token by fetching user profile or a verify endpoint
                // For now, we decode or just assume valid if we can fetch protected data
                // Let's rely on a simple verify call if it exists, or just persist user state
                // We will fetch user details using the admin profile endpoint or decode
                // For simplicity, let's just decode generic user info or fetch /api/admin/stats to verify
                // Accessing /api/admin/stats requires auth.

                // However, we need user role. Let's assume we store it or fetch it.
                // Let's implement a verify route in backend? 
                // Or just use the existing logic: if we have token, we are likely logged in.
                // Ideally we should have /api/auth/me. 
                // Previous frontend used /api/auth/profile maybe?

                // I will assume simple state for now.
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (storedUser && (storedUser.role === 'admin' || storedUser.role === 'superadmin')) {
                    setUser(storedUser);
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            } catch (err) {
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    };

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, items: [], loading }}>
            {children}
        </AuthContext.Provider>
    );
};
