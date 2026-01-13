"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export const useAuthGuard = () => {
    const { ready } = useAuth();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        if (!ready) return;

        api.get("/api/users/me")
            .then(() => setIsAuthenticated(true))
            .catch(() => {
                setIsAuthenticated(false);
                router.replace("/login");
            });
    }, [ready, router]);

    return !ready || isAuthenticated === null;
};
