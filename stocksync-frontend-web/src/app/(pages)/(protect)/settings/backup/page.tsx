"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { HardDrive, Upload, DownloadCloud, Clock } from "lucide-react";

const BackupSettingsPage: React.FC = () => {
    const [backups] = useState([
        { id: 1, name: "Auto Backup", date: "2025-12-20", size: "32MB" },
        { id: 2, name: "Manual Backup", date: "2025-12-01", size: "30MB" },
    ]);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <HardDrive className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Backup & Restore</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Manage database backups and restores</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Create Backup</h2>
                        <div className="flex items-center gap-3">
                            <button className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                                <DownloadCloud className="w-5 h-5" /> Create Backup
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                                <Upload className="w-5 h-5" /> Restore from file
                            </button>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Recent Backups</h2>
                        <div className="space-y-3">
                            {backups.map((b) => (
                                <div key={b.id} className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-foreground font-medium">{b.name}</p>
                                            <p className="text-sm text-muted-foreground">{b.date} • {b.size}</p>
                                        </div>
                                    </div>
                                    <button className="text-sm bg-secondary text-foreground px-3 py-2 rounded-lg">Download</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackupSettingsPage;
