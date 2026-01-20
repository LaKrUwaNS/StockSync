'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building, Mail, Phone, Clock, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

import Loader from '@/components/ui/loader';
import { createSupplier, deleteSupplier, getSuppliers, getSuppliersKpi, updateSupplier } from '@/service/suppliers';
import {
    toSupplierViewModel,
    type CreateSupplierRequest,
    type SupplierKpiResponse,
    type SupplierViewModel,
} from '@/utils/types/supplier';

const SuppliersPage: React.FC = () => {

    const [suppliers, setSuppliers] = useState<SupplierViewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
        const [kpi, setKpi] = useState<SupplierKpiResponse>({
		onTimeDeliveryRate: 0,
		totalStock: 0,
		totalSuppliers: 0,
		totalSpent: 0,
	});

    const [isSaving, setIsSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<SupplierViewModel | null>(null);
    const [formData, setFormData] = useState({
        supplierName: '',
        contactInfo: '',
        phone: '',
        email: '',
        leadTime: 0,
    });

    const resetForm = () => {
        setShowModal(false);
        setEditingSupplier(null);
        setFormData({ supplierName: '', contactInfo: '', phone: '', email: '', leadTime: 0 });
    };

    const openAddModal = () => {
        setEditingSupplier(null);
        setFormData({ supplierName: '', contactInfo: '', phone: '', email: '', leadTime: 0 });
        setShowModal(true);
    };

    const openEditModal = (supplier: SupplierViewModel) => {
        setEditingSupplier(supplier);
        setFormData({
            supplierName: supplier.supplierName,
            contactInfo: supplier.contactInfo ?? '',
            phone: supplier.phone,
            email: supplier.email,
            leadTime: supplier.leadTime ?? 0,
        });
        setShowModal(true);
    };

    const refresh = async () => {
        const suppliersData = await getSuppliers();
        setSuppliers(suppliersData.map(toSupplierViewModel));
        try {
            const kpiData = await getSuppliersKpi();
            setKpi(kpiData);
        } catch {
            // Keep previous KPI values if KPI load fails.
        }
    };

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setIsLoading(true);
                setError(null);
                const suppliersData = await getSuppliers();
                if (!isMounted) return;
                setSuppliers(suppliersData.map(toSupplierViewModel));
				// KPI should not block the list.
				try {
					const kpiData = await getSuppliersKpi();
					if (!isMounted) return;
					setKpi(kpiData);
				} catch (e: unknown) {
					if (!isMounted) return;
					const message = e instanceof Error ? e.message : 'Failed to load KPI';
					setError(message);
				}
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

    const handleSubmit = async () => {
        const supplierName = formData.supplierName.trim();
        const contactInfo = formData.contactInfo.trim();
        const email = formData.email.trim();
        const phone = formData.phone.trim();

        if (!supplierName) {
            toast.error('Supplier name is required');
            return;
        }
        if (!contactInfo) {
            toast.error('Contact info is required');
            return;
        }
        if (!email) {
            toast.error('Email is required');
            return;
        }
        if (!phone) {
            toast.error('Phone is required');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            if (editingSupplier) {
                await updateSupplier({
                    supplierId: editingSupplier.supplierId,
                    supplierName,
                    contactInfo,
                    phone,
                    email,
                    leanTime: Number(formData.leadTime ?? 0),
                });
                toast.success('Supplier updated');
            } else {
                const payload: CreateSupplierRequest = {
                    supplierName,
                    contactInfo,
                    phone,
                    email,
                };
                await createSupplier(payload);
                toast.success('Supplier created');
            }

            await refresh();
            resetForm();
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Save failed';
            setError(message);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (supplierId: number) => {
        const ok = window.confirm('Delete this supplier?');
        if (!ok) return;
        try {
            setIsSaving(true);
            setError(null);
            await deleteSupplier(supplierId);
            toast.success('Supplier deleted');
            await refresh();
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Delete failed';
            setError(message);
            toast.error(message);
        } finally {
            setIsSaving(false);
        }
    };

    const formatMoney = (value: unknown) => {
        const num = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(num) ? num.toFixed(2) : '0.00';
    };

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
						<p className="text-3xl font-bold text-foreground">{kpi.totalSuppliers}</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-card rounded-xl p-4 border border-border shadow-sm"
					>
						<p className="text-muted-foreground text-sm mb-1">Total Stock</p>
						<p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{kpi.totalStock}</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-card rounded-xl p-4 border border-border shadow-sm"
					>
						<p className="text-muted-foreground text-sm mb-1">Total Spent</p>
						<p className="text-3xl font-bold text-purple-600 dark:text-purple-400">${formatMoney(kpi.totalSpent)}</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-card rounded-xl p-4 border border-border shadow-sm"
					>
						<p className="text-muted-foreground text-sm mb-1">On-time Delivery Rate</p>
						<p className="text-3xl font-bold text-foreground">{kpi.onTimeDeliveryRate}%</p>
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
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={openAddModal}
                            className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2"
                            disabled={isSaving}
                        >
                            <Plus className="w-4 h-4" />
                            Add Supplier
                        </motion.button>
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
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(supplier)}
                                        className="p-2 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                        disabled={isSaving}
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(supplier.supplierId)}
                                        className="p-2 rounded-lg bg-muted hover:bg-red-500/15 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                        disabled={isSaving}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
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

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={resetForm}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                className="bg-card rounded-xl p-6 w-full max-w-2xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                                    </h2>
                                    <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-sm text-muted-foreground mb-2 block">Supplier Name *</label>
                                        <input
                                            type="text"
                                            value={formData.supplierName}
                                            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="e.g., ABC Suppliers"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm text-muted-foreground mb-2 block">Contact Info *</label>
                                        <input
                                            type="text"
                                            value={formData.contactInfo}
                                            onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="Contact person / address / notes"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Email *</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="name@company.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Phone *</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>

                                    {editingSupplier ? (
                                        <div className="md:col-span-2">
                                            <label className="text-sm text-muted-foreground mb-2 block">Lead Time (days)</label>
                                            <input
                                                type="number"
                                                value={formData.leadTime}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, leadTime: parseInt(e.target.value) || 0 })
                                                }
                                                className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                                placeholder="0"
                                            />
                                        </div>
                                    ) : null}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={resetForm}
                                        className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-3 rounded-lg transition-colors"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmit}
                                        className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-60"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving…' : editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SuppliersPage;
