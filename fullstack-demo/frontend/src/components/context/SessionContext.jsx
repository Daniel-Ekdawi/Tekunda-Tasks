'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "@/constants/URLS";
import { logout } from "@/api/auth"
import { useNotification } from "./NotificationContext";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [role, setRole] = useState()
    const { setMessage } = useNotification()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${BASE_URL}/auth/validateToken`, {
                    credentials: 'include',
                });

                if (!response.ok) return;

                const userData = await response.json();
                setUser(userData);
            } catch {
                setUser(null);
                logout()
            } finally {
                setIsReady(true)
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        setRole(user?.role || 'guest')
    }, [user])

    const clearUser = async () => {
        setUser(null)
        const result = await logout()
        if (!result || result.error) return setMessage({ text: result?.error || 'Failed to log out!', type: 'error' })
        if (result?.message) return setMessage({ text: 'Successfully logged out!', type: 'success' })
    }

    if (!isReady) return null // to prevent loading wrong session at first

    return (
        <SessionContext.Provider value={{
            user,
            isReady,
            role,
            clearUser,
            setUser: user => {
                setUser(user)
            }
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);