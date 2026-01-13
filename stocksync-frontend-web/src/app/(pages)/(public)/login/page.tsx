"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import api, { setAccessToken } from "@/lib/axios";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // ✅ MAIN LOGIN LOGIC (unchanged)
    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await api.post("/api/auth/login", {
                username,
                password,
            });

            setAccessToken(res.data.accessToken);
            router.replace("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center transition-colors duration-500 bg-background">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-20 left-10 w-72 h-72 bg-linear-to-r from-pink-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
                />
                <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute bottom-20 right-10 w-72 h-72 bg-linear-to-r from-purple-600 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10"
                />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md mx-4 p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-card/90 border border-border"
            >
                <div className="space-y-6">
                    {/* Title */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in to continue
                        </p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                            Username
                        </label>
                        <div className="relative bg-muted rounded-lg">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className="w-full pl-11 pr-4 py-3 rounded-lg outline-none bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                            Password
                        </label>
                        <div className="relative bg-muted rounded-lg">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full pl-11 pr-12 py-3 rounded-lg outline-none bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-medium text-white bg-linear-to-r from-pink-500 to-purple-600 hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
