"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Users, Percent, BarChart3, Calendar, Download } from "lucide-react";

const SalesReportsPage: React.FC = () => {
    const stats = [
        { title: "Total Sales", value: "$182,450", icon: ShoppingCart, color: "from-pink-500 to-purple-600" },
        { title: "Orders", value: "1,245", icon: BarChart3, color: "from-indigo-500 to-blue-600" },
        { title: "Customers", value: "823", icon: Users, color: "from-green-500 to-emerald-600" },
        { title: "Conversion", value: "3.2%", icon: Percent, color: "from-orange-500 to-amber-600" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <ShoppingCart className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Sales Reports</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Sales performance across orders and customers</p>
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
                        <h2 className="text-lg font-bold text-foreground mb-4">Daily Sales</h2>
                        <div className="h-64 bg-muted rounded-lg border border-border flex items-end gap-2 p-4">
                            {[20, 38, 55, 44, 60, 52, 80].map((h, idx) => (
                                <div key={idx} style={{ height: `${h}%` }} className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 rounded-t-md" />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Top Products</h2>
                        <div className="space-y-4">
                            {[{ name: "Laptop Pro 15\"", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300" }, { name: "Noise Cancelling Headphones", img: "https://images.unsplash.com/photo-1518441902116-f0b2f0b56324?w=300" }, { name: "Wireless Mouse", img: "https://images.unsplash.com/photo-1587825160662-5acb0f4b0f83?w=300" }].map((p) => (
                                <div key={p.name} className="flex items-center gap-3">
                                    <img src={p.img} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                                    <div>
                                        <p className="text-foreground font-medium">{p.name}</p>
                                        <p className="text-sm text-muted-foreground">High performance sales</p>
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

export default SalesReportsPage;
