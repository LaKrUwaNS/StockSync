"use client";
import React from "react";
import { motion } from "framer-motion";
import { Gauge, Rocket, Timer, Download, Calendar } from "lucide-react";

const PerformanceReportsPage: React.FC = () => {
    const stats = [
        { title: "Order Cycle Time", value: "2.4 days", icon: Timer, color: "from-indigo-500 to-blue-600" },
        { title: "Fulfillment Rate", value: "97.8%", icon: Rocket, color: "from-green-500 to-emerald-600" },
        { title: "System Health", value: "99.9%", icon: Gauge, color: "from-purple-500 to-pink-600" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Gauge className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Performance Reports</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Operational KPIs and system health</p>
                </motion.div>

                <div className="bg-card rounded-xl p-4 border border-border mb-6 flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <select className="bg-muted border border-border rounded-lg px-4 py-2 text-foreground">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last quarter</option>
                        <option>This year</option>
                    </select>
                    <button className="ml-auto bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {stats.map((s, i) => (
                        <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl p-4 border border-border shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`bg-linear-to-r ${s.color} p-2 rounded-lg`}>
                                    <s.icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-muted-foreground">{s.title}</h3>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{s.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Order Processing Speed</h2>
                        <div className="h-64 bg-muted rounded-lg border border-border flex items-end gap-2 p-4">
                            {[65, 70, 72, 66, 74, 77, 80].map((h, idx) => (
                                <div key={idx} style={{ height: `${h}%` }} className="flex-1 bg-green-500/70 rounded-t-md" />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">System Uptime</h2>
                        <div className="space-y-3">
                            {[{ label: "API", val: 99.98 }, { label: "Worker", val: 99.95 }, { label: "Database", val: 99.90 }].map((r) => (
                                <div key={r.label}>
                                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                        <span>{r.label}</span>
                                        <span>{r.val}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div style={{ width: `${r.val}%` }} className="h-full bg-linear-to-r from-pink-500 to-purple-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceReportsPage;
