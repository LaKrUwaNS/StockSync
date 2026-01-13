"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckSquare, Save } from "lucide-react";

interface Role {
    name: string;
    permissions: { label: string; enabled: boolean }[];
}

const RolesPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([
        { name: "Admin", permissions: [{ label: "Manage Users", enabled: true }, { label: "Manage Inventory", enabled: true }, { label: "View Reports", enabled: true }] },
        { name: "Manager", permissions: [{ label: "Manage Inventory", enabled: true }, { label: "View Reports", enabled: true }, { label: "Manage Users", enabled: false }] },
        { name: "Operator", permissions: [{ label: "View Inventory", enabled: true }, { label: "Create Orders", enabled: true }, { label: "View Reports", enabled: false }] },
    ]);

    const togglePermission = (roleIndex: number, permIndex: number) => {
        setRoles((prev) => prev.map((r, ri) => (ri === roleIndex ? { ...r, permissions: r.permissions.map((p, pi) => (pi === permIndex ? { ...p, enabled: !p.enabled } : p)) } : r)));
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Roles & Permissions</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Configure access control for different roles</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {roles.map((role, ri) => (
                        <motion.div key={role.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
                            <h2 className="text-lg font-bold text-foreground mb-4">{role.name}</h2>
                            <div className="space-y-3">
                                {role.permissions.map((perm, pi) => (
                                    <label key={perm.label} className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CheckSquare className="w-4 h-4" /> {perm.label}
                                        </div>
                                        <input type="checkbox" checked={perm.enabled} onChange={() => togglePermission(ri, pi)} />
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                    <button className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                        <Save className="w-5 h-5" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RolesPage;
