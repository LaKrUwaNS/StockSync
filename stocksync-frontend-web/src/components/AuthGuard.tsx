// components/AuthGuard.tsx
"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function AuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const loading = useAuthGuard();

    if (loading) return <div>Authenticating…</div>;

    return <>{children}</>;
}
