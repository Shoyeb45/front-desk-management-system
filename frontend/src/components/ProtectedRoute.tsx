// components/ProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeToken } from '@/lib/utils';

export function ProtectedRoute({
    children,
    allowedRole
}: {
    children: React.ReactNode;
    allowedRole: 'ADMIN' | 'STAFF';
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push(`/?redirect=${pathname}`);
            return;
        }

        const user = decodeToken(token);

        if (!user) {
            localStorage.removeItem('token');
            router.push('/');
            return;
        }

        if (user.role !== allowedRole) {
            // Redirect to correct dashboard
            const correctPath = user.role === 'ADMIN' ? '/admin' : '/staff';
            router.push(correctPath);
            return;
        }

        setIsAuthorized(true);
    }, [router, pathname, allowedRole]);

    if (!isAuthorized) {
        return <div>
            Loading...
        </div>
    }

    return <>{children}</>;
}