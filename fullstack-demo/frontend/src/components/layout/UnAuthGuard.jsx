'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/context/SessionContext';

export default function UnAuthGuard({ children }) {
    const { user, isReady } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (user && isReady) router.replace('/profile')
    }, [user, isReady]);

    if (!isReady || user) return null;

    return children;
}