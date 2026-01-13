// services/auth.ts
import api, { setAccessToken } from "@/lib/axios";

export async function login(username: string, password: string) {
    const res = await api.post("/api/auth/login", {
        username,
        password
    });

    setAccessToken(res.data.accessToken);
}

export async function logout() {
    await api.post("/api/auth/logout");
    setAccessToken(null);
    localStorage.setItem("AUTH_FAILED", "true");
}
