'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building, Mail, Phone, Clock } from 'lucide-react';

import Loader from '@/components/ui/loader';
import { getSuppliers } from '@/service/suppliers';
import { toSupplierViewModel, type SupplierViewModel } from '@/utils/types/supplier';

const SuppliersPage: React.FC = () => {

    const [suppliers, setSuppliers] = useState<SupplierViewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getSuppliers();
                if (!isMounted) return;
                setSuppliers(data.map(toSupplierViewModel));
            } catch (e: unknown) {
                if (!isMounted) return;
                setError(e instanceof Error ? e.message : 'Failed to load suppliers');
            } finally {
                if (!isMounted) return;
                setIsLoading(false);
            }
        }

        void load();
        return () => {
            isMounted = false;
        };
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredSuppliers = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return suppliers;
        return suppliers.filter(supplier =>
            supplier.supplierName.toLowerCase().includes(q) ||
            supplier.email.toLowerCase().includes(q) ||
            supplier.phone.toLowerCase().includes(q)
        );
    }, [suppliers, searchTerm]);

    const stats = useMemo(() => {
        const totalSuppliers = suppliers.length;
        const totalSpent = suppliers.reduce((sum, s) => sum + s.totalSpent, 0);
        const avgLeadTime = totalSuppliers
            ? suppliers.reduce((sum, s) => sum + s.leadTime, 0) / totalSuppliers
            : 0;
        return { totalSuppliers, totalSpent, avgLeadTime };
    }, [suppliers]);

    if (isLoading) {
        return <Loader label="Loading suppliers…" />;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Building className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Suppliers</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Manage supplier information and relationships</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Suppliers</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalSuppliers}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Suppliers</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalSuppliers}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Spent</p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">${stats.totalSpent.toFixed(2)}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Avg Lead Time</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.avgLeadTime.toFixed(0)} days</p>
                    </motion.div>
                </div>

                {error ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
                    >
                        {error}
                    </motion.div>
                ) : null}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card rounded-xl p-4 mb-6 shadow-lg border border-border"
                >
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex-1 min-w-[250px] relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search suppliers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredSuppliers.map((supplier, index) => (
                            <motion.div
                                key={supplier.supplierId}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                                            <Building className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground">{supplier.supplierName}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <span>{supplier.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        <span>{supplier.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>Lead time: {supplier.leadTime} days</span>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-4 mb-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Orders</p>
                                            <p className="text-lg font-bold text-foreground">{supplier.totalOrders}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Spent</p>
                                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">${supplier.totalSpent.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredSuppliers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border"
                    >
                        <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No suppliers found</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SuppliersPage;
