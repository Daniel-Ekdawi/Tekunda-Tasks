'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "@/constants/URL";
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

                const result = await response.json()
                
                if (response.status == 401) throw new Error()
                if (response.status == 403 || response.status == 404) throw new Error(result.detail)

                if (!response.ok) throw new Error();

                const userData = result
                if (!userData.role) throw new Error()
                setUser(userData);
                setRole(userData?.role || 'guest')
            } catch (error) {
                if (error.message) setMessage({ text: error.message, type: 'error' }) 
                setUser(null);
                setRole('guest')
                logout()
            } finally {
                setIsReady(true)
            }
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