'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/context/SessionContext';
import getAllowedLinks from '@/lib/getAllowedLinks';

export default function AuthGuard({ children }) {
    const { user, isReady, role } = useSession();
    const router = useRouter();

    useEffect(() => {
        const links = getAllowedLinks(role)
        if (role === 'guest' && isReady) return router.replace('/login');
    }, [role, isReady]);

    if (!isReady || !user) return null;

    return children;
}