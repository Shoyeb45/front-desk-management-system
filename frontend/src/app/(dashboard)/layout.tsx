// app/staff/layout.tsx
import { Header } from '@/components/header';

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>   
            <Header />     
            {children}
        </div>
    );
}