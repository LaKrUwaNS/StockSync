"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ListTree, Filter } from "lucide-react";

interface LogEntry {
    id: number;
    actor: string;
    action: string;
    target: string;
    date: string;
}

const LogsPage: React.FC = () => {
    const [entries] = useState<LogEntry[]>([
        { id: 1, actor: "Alex Johnson", action: "Updated product", target: "Laptop Pro 15\"", date: "2025-12-25 09:42" },
        { id: 2, actor: "Priya Singh", action: "Approved purchase order", target: "PO-2025-4411", date: "2025-12-24 14:15" },
        { id: 3, actor: "David Chen", action: "Adjusted stock", target: "Warehouse B", date: "2025-12-23 10:03" },
    ]);
    const [filter, setFilter] = useState("All");

    const filtered = entries.filter((e) => (filter === "All" ? true : e.action.toLowerCase().includes(filter.toLowerCase())));

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <ListTree className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Audit Logs</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Track system and user actions</p>
                </motion.div>

                <div className="bg-card rounded-xl p-4 border border-border mb-6 flex items-center gap-3">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-muted border border-border rounded-lg px-4 py-2 text-foreground">
                        <option>All</option>
                        <option>Updated</option>
                        <option>Approved</option>
                        <option>Adjusted</option>
                    </select>
                </div>

                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Actor</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Action</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Target</th>
                                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((e) => (
                                <tr key={e.id} className="border-t border-border">
                                    <td className="px-4 py-3 text-sm text-foreground">{e.actor}</td>
                                    <td className="px-4 py-3 text-sm text-foreground">{e.action}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{e.target}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{e.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LogsPage;
