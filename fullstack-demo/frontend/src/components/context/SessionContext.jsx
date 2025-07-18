'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { logout, validateToken } from "@/api/auth"
import { useNotification } from "./NotificationContext";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [role, setRole] = useState()
    const { setMessage } = useNotification()

    useEffect(() => {
        const fetchUser = async () => {
            const result = await validateToken()
            if (result.error) {
                if (result.error.message) setMessage({ text: result.error.message, type: 'error' })
                setUser(null);
                setRole('guest')
                logout()
            } else {
                setUser(result);
                setRole(result?.role || 'guest')
            }
            setIsReady(true)
        };

        fetchUser();
    }, []);

    const clearUser = async () => {
        const result = await logout()
        if (!result || result.error) return setMessage({ text: result?.error || 'Failed to log out!', type: 'error' })
        if (result?.message) setMessage({ text: 'Successfully logged out!', type: 'success' })
        setUser(null)
        setRole('guest')
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
                setRole(user?.role || 'guest')
            }
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);