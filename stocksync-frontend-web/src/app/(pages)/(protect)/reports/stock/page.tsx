"use client";
import React from "react";
import { motion } from "framer-motion";
import { Boxes, AlertTriangle, Warehouse, Calendar, Download } from "lucide-react";

const StockReportsPage: React.FC = () => {
    const stats = [
        { title: "Total SKUs", value: "1,248", icon: Boxes, color: "from-indigo-500 to-blue-600" },
        { title: "Low Stock", value: "53", icon: AlertTriangle, color: "from-orange-500 to-amber-600" },
        { title: "Warehouses", value: "7", icon: Warehouse, color: "from-green-500 to-emerald-600" },
        { title: "Stock Value", value: "$512,300", icon: Boxes, color: "from-purple-500 to-pink-600" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Boxes className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Stock Reports</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Inventory health overview across warehouses</p>
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
                        <h2 className="text-lg font-bold text-foreground mb-4">Low Stock Items</h2>
                        <div className="space-y-4">
                            {[{ name: "SSD 1TB", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300" }, { name: "HDMI Cables", img: "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=300" }, { name: "USB-C Chargers", img: "https://images.unsplash.com/photo-1582574630053-c6ae850f0b8e?w=300" }].map((p) => (
                                <div key={p.name} className="flex items-center gap-3">
                                    <img src={p.img} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                                    <div className="flex-1">
                                        <p className="text-foreground font-medium">{p.name}</p>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden mt-2">
                                            <div className="h-full w-1/3 bg-red-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Warehouse Utilization</h2>
                        <div className="space-y-3">
                            {[{ name: "Warehouse A", val: 72 }, { name: "Warehouse B", val: 58 }, { name: "Warehouse C", val: 84 }].map((w) => (
                                <div key={w.name}>
                                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                        <span>{w.name}</span>
                                        <span>{w.val}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div style={{ width: `${w.val}%` }} className="h-full bg-linear-to-r from-pink-500 to-purple-600" />
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

export default StockReportsPage;
