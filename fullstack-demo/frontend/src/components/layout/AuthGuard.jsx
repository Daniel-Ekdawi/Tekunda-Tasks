'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/context/SessionContext';

export default function AuthGuard({ children }) {
    const { user, isReady } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!user && isReady) router.replace('/login');
    }, [user, isReady]);

    if (!isReady || !user) return null; 

    return children;
}