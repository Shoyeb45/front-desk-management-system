// app/staff/layout.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRole="STAFF">
            {children}
        </ProtectedRoute>
    );
}