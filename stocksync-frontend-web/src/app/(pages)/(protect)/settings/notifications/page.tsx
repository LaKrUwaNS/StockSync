"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare, Save } from "lucide-react";

const NotificationsSettingsPage: React.FC = () => {
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(false);
    const [pushEnabled, setPushEnabled] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Bell className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Notification Settings</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Configure how your team receives alerts</p>
                </motion.div>

                <div className="space-y-6">
                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Channels</h2>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-foreground font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">Transactional and summary emails</p>
                                    </div>
                                </div>
                                <input type="checkbox" checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)} />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-foreground font-medium">SMS</p>
                                        <p className="text-sm text-muted-foreground">Critical alerts to mobile</p>
                                    </div>
                                </div>
                                <input type="checkbox" checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} />
                            </label>

                            <label className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
                                <div>
                                    <p className="text-foreground font-medium">Push Notifications</p>
                                    <p className="text-sm text-muted-foreground">In-app and desktop notifications</p>
                                </div>
                                <input type="checkbox" checked={pushEnabled} onChange={(e) => setPushEnabled(e.target.checked)} />
                            </label>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Preview</h2>
                        <div className="p-4 bg-muted rounded-lg border border-border">
                            <p className="text-foreground font-medium mb-2">Sample Email Notification</p>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>Subject: Low Stock Alert - Warehouse A</p>
                                <p>
                                    Body: The item &quot;SSD 1TB&quot; has dropped below the reorder threshold.
                                </p>
                                <p>Action: Review and create purchase order.</p>
                            </div>
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

export default NotificationsSettingsPage;
