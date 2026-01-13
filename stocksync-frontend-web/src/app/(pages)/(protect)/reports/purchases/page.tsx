"use client";
import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, Building, Package, Calendar, Download } from "lucide-react";

const PurchaseReportsPage: React.FC = () => {
    const stats = [
        { title: "Total Orders", value: "432", icon: ClipboardList, color: "from-indigo-500 to-blue-600" },
        { title: "Suppliers", value: "37", icon: Building, color: "from-green-500 to-emerald-600" },
        { title: "Received GRNs", value: "398", icon: Package, color: "from-purple-500 to-pink-600" },
        { title: "Open Orders", value: "34", icon: ClipboardList, color: "from-orange-500 to-amber-600" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <ClipboardList className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Purchase Reports</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Procurement metrics from suppliers and orders</p>
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
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Supplier Performance</h2>
                        <div className="space-y-4">
                            {[{ name: "Tech Corp", logo: "https://images.unsplash.com/photo-1556741533-f6acd6473480?w=300" }, { name: "Global Supplies", logo: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300" }, { name: "Parts Unlimited", logo: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=300" }].map((s) => (
                                <div key={s.name} className="flex items-center gap-3">
                                    <img src={s.logo} alt={s.name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                                    <div className="flex-1">
                                        <p className="text-foreground font-medium">{s.name}</p>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden mt-2">
                                            <div className="h-full w-2/3 bg-green-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Open Orders Timeline</h2>
                        <div className="h-64 bg-muted rounded-lg border border-border flex items-end gap-3 p-4">
                            {[12, 24, 18, 30, 28, 22, 34].map((h, idx) => (
                                <div key={idx} style={{ height: `${h * 2}%` }} className="w-8 bg-indigo-500/70 rounded-t-md" />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseReportsPage;
