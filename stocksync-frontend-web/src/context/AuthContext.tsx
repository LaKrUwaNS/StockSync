// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { setAccessToken } from "@/lib/axios";

type AuthContextType = {
    ready: boolean;
};

const AuthContext = createContext<AuthContextType>({ ready: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        axios
            .post(
                "http://localhost:8080/api/auth/refresh",
                {},
                { withCredentials: true }
            )
            .then((res) => {
                setAccessToken(res.data.accessToken);
            })
            .catch(() => {
                setAccessToken(null);
            })
            .finally(() => {
                setReady(true);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ ready }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
