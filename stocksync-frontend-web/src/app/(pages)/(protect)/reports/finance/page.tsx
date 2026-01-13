"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, TrendingUp, TrendingDown, PieChart, Calendar, Download } from "lucide-react";

const FinanceReportsPage: React.FC = () => {
    const [range, setRange] = useState("Last 30 days");
    const stats = [
        { title: "Total Revenue", value: "$245,320", change: "+8.4% MoM", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
        { title: "Total Expenses", value: "$182,760", change: "+3.1% MoM", icon: TrendingDown, color: "from-red-500 to-rose-600" },
        { title: "Gross Profit", value: "$62,560", change: "+16.2% MoM", icon: Banknote, color: "from-indigo-500 to-blue-600" },
        { title: "Profit Margin", value: "25.5%", change: "+2.0% MoM", icon: PieChart, color: "from-purple-500 to-pink-600" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Banknote className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Finance Reports</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Financial overview of revenue, expenses and profit</p>
                </motion.div>

                <div className="bg-card rounded-xl p-4 border border-border mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-5 h-5" />
                            <span>Date Range:</span>
                        </div>
                        <select
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="bg-muted border border-border rounded-lg px-4 py-2 text-foreground"
                        >
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last quarter</option>
                            <option>This year</option>
                        </select>
                        <button className="ml-auto bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((s, i) => (
                        <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl p-4 border border-border shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`bg-linear-to-r ${s.color} p-2 rounded-lg`}>
                                    <s.icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-sm font-medium text-muted-foreground">{s.title}</h3>
                            </div>
                            <p className="text-2xl font-bold text-foreground">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.change}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Revenue vs Expenses</h2>
                        <div className="h-64 bg-muted rounded-lg border border-border flex items-end gap-2 p-4">
                            {[40, 55, 62, 48, 70, 66, 80, 78].map((h, idx) => (
                                <div key={idx} className="flex-1 flex items-end gap-2">
                                    <div className="h-full w-2 bg-transparent" />
                                    <div style={{ height: `${h}%` }} className="w-full bg-green-500/70 dark:bg-green-600/70 rounded-t-md" />
                                    <div style={{ height: `${100 - h}%` }} className="w-full bg-red-500/60 dark:bg-red-600/60 rounded-t-md" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Cash Flow Summary</h2>
                        <div className="space-y-3">
                            {[{ label: "Operating", val: 62 }, { label: "Investing", val: 24 }, { label: "Financing", val: 38 }].map((r) => (
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

export default FinanceReportsPage;
