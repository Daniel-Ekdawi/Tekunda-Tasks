'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/context/SessionContext';
import { getNavbarLinks } from '@/lib/getNavbarLinks';

export default function AuthGuard({ children }) {
    const { user, isReady, role } = useSession();
    const router = useRouter();

    useEffect(() => {
        const links = getNavbarLinks(role).filter(link => link.title !== 'Logout')
        if (role === 'guest' && isReady) router.replace('/login');
    }, [role, isReady]);

    if (!isReady || !user) return null;

    return children;
}