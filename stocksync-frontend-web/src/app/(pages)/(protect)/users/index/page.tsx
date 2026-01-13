"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Plus, Edit2, Trash2, BadgeCheck } from "lucide-react";

interface User {
    userId: number;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    avatarUrl?: string;
}

const UsersIndexPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        { userId: 1, name: "Alex Johnson", email: "alex@stocksync.app", role: "Admin", status: "active", avatarUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=240" },
        { userId: 2, name: "Priya Singh", email: "priya@stocksync.app", role: "Manager", status: "active", avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=240" },
        { userId: 3, name: "David Chen", email: "david@stocksync.app", role: "Operator", status: "inactive", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240" },
    ]);
    const [searchTerm, setSearchTerm] = useState("");
    const filtered = users.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Users</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Manage users, roles and access</p>
                </motion.div>

                <div className="bg-card rounded-xl p-4 border border-border mb-6 flex items-center gap-3">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground" />
                    <button className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Invite User
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filtered.map((u, index) => (
                            <motion.div key={u.userId} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ delay: index * 0.05 }} className="bg-card rounded-xl p-6 border border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <img src={u.avatarUrl} alt={u.name} className="w-14 h-14 rounded-xl object-cover border border-border" />
                                    <div className="flex-1">
                                        <p className="text-foreground font-bold">{u.name}</p>
                                        <p className="text-sm text-muted-foreground">{u.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === "active" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200" : "bg-secondary text-secondary-foreground"}`}>{u.status}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <BadgeCheck className="w-4 h-4" />
                                    <span>{u.role}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                                        <Trash2 className="w-4 h-4" /> Remove
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default UsersIndexPage;
