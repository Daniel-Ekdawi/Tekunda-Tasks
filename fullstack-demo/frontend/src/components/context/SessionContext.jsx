'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { logout as removeLocalSession, setSession as storeLocalSession } from '@/lib/auth';
import { BASE_URL } from "@/constants/URLs";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${BASE_URL}/auth/validateToken`, {
                    credentials: 'include',
                });

                if (!res.ok) return;

                const userData = await res.json();
                setUser(userData);
                storeLocalSession({ user: userData });
            } catch {
                setUser(null);
                removeLocalSession();
            } finally {
                setIsReady(true)
            }
        };

        fetchUser();
    }, []);

    const clearUser = () => {
        setUser(null);
        removeLocalSession();
    };

    return (
        <SessionContext.Provider value={{
            user,
            isReady,
            clearUser,
            setUser: user => {
                setUser(user)
                storeLocalSession({ user })
            }
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);