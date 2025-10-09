'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeToken } from '@/lib/utils';
import { toast } from 'sonner';

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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    toast.error('Please log in to continue');
                    setTimeout(() => {
                        router.push(`/?redirect=${pathname}`);
                    }, 1000);
                    return;
                }

                const user = decodeToken(token);

                if (!user) {
                    toast.error('Invalid session. Please log in again.');
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        router.push('/');
                    }, 1000);
                    return;
                }

                // Check if token is expired
                const currentTime = Date.now() / 1000;
                if (user.exp && user.exp < currentTime) {
                    localStorage.removeItem('token');
                    toast.error('Session expired. Please log in again.');
                    setTimeout(() => {
                        router.push('/');
                    }, 1000);
                    return;
                }

                if (user.role !== allowedRole) {
                    // Redirect to correct dashboard
                    const correctPath = user.role === 'ADMIN' ? '/admin' : '/staff';
                    toast.error('You do not have permission to access this page.');
                    setTimeout(() => {
                        router.push(correctPath);
                    }, 1000);
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Auth check error:', error);
                localStorage.removeItem('token');
                toast.error('An error occurred. Please try logging in again.');
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname, allowedRole]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}