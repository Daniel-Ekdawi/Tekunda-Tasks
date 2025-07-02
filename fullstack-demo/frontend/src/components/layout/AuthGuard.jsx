'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/components/context/SessionContext';
import getAllowedLinks from '@/lib/getAllowedLinks';

export default function AuthGuard({ children }) {
    const { user, isReady, role } = useSession();
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const pathname = usePathname()

    useEffect(() => {
        const links = getAllowedLinks(role).filter(link => link.title !== 'Logout')
        const linksUrls = links.map(link => link?.url)
        if (role === 'guest' && isReady) return router.replace('/login');
        const path = pathname.split('/')[1]
        if (!linksUrls.includes(path)) return router.replace('/')
        setIsLoading(true)
    }, [role, isReady]);

    if (!isReady || !user || !isLoading) return null;

    return children;
}