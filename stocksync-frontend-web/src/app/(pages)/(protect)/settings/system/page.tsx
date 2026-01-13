"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cog, Palette, Image as ImageIcon, Save } from "lucide-react";

const SystemSettingsPage: React.FC = () => {
    const [brandName, setBrandName] = useState("StockSync");
    const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1556741533-f6acd6473480?w=300");
    const [theme, setTheme] = useState("system");

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Cog className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">System Settings</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Branding and theme configuration</p>
                </motion.div>

                <div className="space-y-6">
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Branding</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-muted-foreground mb-2 block">Brand Name</label>
                                <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground" />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground mb-2 block">Logo URL</label>
                                <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground" />
                                {logoUrl && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-lg object-cover border border-border" onError={(e) => ((e.currentTarget.style.display = "none"))} />
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> Preview
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Theme</h2>
                        <div className="flex items-center gap-4">
                            <Palette className="w-5 h-5 text-muted-foreground" />
                            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="bg-muted border border-border rounded-lg px-4 py-2 text-foreground">
                                <option value="system">System</option>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                            <Save className="w-5 h-5" /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettingsPage;
