// app/(pages)/(protect)/layout.tsx

import AuthGuard from "@/components/AuthGuard";
import NavBar from "@/components/NavBar";


export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="app-shell flex h-screen overflow-hidden">
                <NavBar />
                <main className="flex-1 overflow-y-auto p-2 bg-background">
                    <div className="h-full">
                        {children}
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
