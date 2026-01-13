// lib/axios.ts
import axios from "axios";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

const api = axios.create({
    baseURL: "http://localhost:8080", // ✅ BACKEND URL (FIXED)
    withCredentials: true,            // ✅ required for refresh cookie
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;

        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const refresh = await axios.post(
                    "http://localhost:8080/api/auth/refresh",
                    {},
                    { withCredentials: true }
                );

                setAccessToken(refresh.data.accessToken);
                original.headers.Authorization =
                    `Bearer ${refresh.data.accessToken}`;

                return api(original);
            } catch {
                setAccessToken(null);
                window.location.href = "/login";
            }
        }

        return Promise.reject(err);
    }
);

export default api;
