'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/context/SessionContext';

export default function UnAuthGuard({ children }) {
    const { user, role, isReady } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (['viewer', 'hotel_admin', 'super_admin'].includes(role) && isReady) router.replace('/profile')
    }, [role, isReady]);

    if (!isReady || user) return null;

    return children;
}