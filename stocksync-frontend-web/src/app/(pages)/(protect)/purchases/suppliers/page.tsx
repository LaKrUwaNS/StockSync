'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Building, Mail, Phone, Clock, X, MapPin } from 'lucide-react';

interface Supplier {
    supplierId: number;
    supplierName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    leadTime: number;
    status: 'active' | 'inactive';
    totalOrders: number;
    totalSpent: number;
    logoUrl?: string;
}

const SuppliersPage: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([
        {
            supplierId: 1,
            supplierName: 'Tech Corp',
            contactPerson: 'David Chen',
            email: 'david@techcorp.com',
            phone: '+1 (555) 111-2222',
            address: '100 Tech Avenue',
            city: 'San Francisco',
            country: 'USA',
            leadTime: 7,
            status: 'active',
            totalOrders: 45,
            totalSpent: 150000.00
        },
        {
            supplierId: 2,
            supplierName: 'Global Supplies',
            contactPerson: 'Maria Garcia',
            email: 'maria@globalsupplies.com',
            phone: '+1 (555) 222-3333',
            address: '200 Supply Street',
            city: 'Chicago',
            country: 'USA',
            leadTime: 10,
            status: 'active',
            totalOrders: 38,
            totalSpent: 98000.00
        },
        {
            supplierId: 3,
            supplierName: 'Office Depot Inc',
            contactPerson: 'James Wilson',
            email: 'james@officedepot.com',
            phone: '+1 (555) 333-4444',
            address: '300 Office Blvd',
            city: 'Boston',
            country: 'USA',
            leadTime: 5,
            status: 'active',
            totalOrders: 52,
            totalSpent: 120000.00
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [formData, setFormData] = useState({
        supplierName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        leadTime: 0,
        status: 'active' as 'active' | 'inactive',
        logoUrl: ''
    });

    const filteredSuppliers = suppliers.filter(supplier => {
        const matchesSearch =
            supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || supplier.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    };

    const stats = {
        totalSuppliers: suppliers.length,
        activeSuppliers: suppliers.filter(s => s.status === 'active').length,
        totalSpent: suppliers.reduce((sum, s) => sum + s.totalSpent, 0),
        avgLeadTime: suppliers.reduce((sum, s) => sum + s.leadTime, 0) / suppliers.length
    };

    const handleSubmit = () => {
        if (editingSupplier) {
            setSuppliers(suppliers.map(s =>
                s.supplierId === editingSupplier.supplierId
                    ? { ...s, ...formData }
                    : s
            ));
        } else {
            const newSupplier: Supplier = {
                supplierId: Math.max(...suppliers.map(s => s.supplierId), 0) + 1,
                ...formData,
                totalOrders: 0,
                totalSpent: 0
            };
            setSuppliers([...suppliers, newSupplier]);
        }
        resetForm();
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            supplierName: supplier.supplierName,
            contactPerson: supplier.contactPerson,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address,
            city: supplier.city,
            country: supplier.country,
            leadTime: supplier.leadTime,
            status: supplier.status,
            logoUrl: supplier.logoUrl || ''
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setSuppliers(suppliers.filter(s => s.supplierId !== id));
    };

    const resetForm = () => {
        setFormData({
            supplierName: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            country: '',
            leadTime: 0,
            status: 'active',
            logoUrl: ''
        });
        setEditingSupplier(null);
        setShowModal(false);
    };

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
                        <p className="text-muted-foreground text-sm mb-1">Active Suppliers</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.activeSuppliers}</p>
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

                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-secondary text-foreground border-0 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="All">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowModal(true)}
                                className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Add Supplier
                            </motion.button>
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
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(supplier.status)}`}>
                                                {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                                            </span>
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
                                        <MapPin className="w-4 h-4" />
                                        <span>{supplier.city}, {supplier.country}</span>
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

                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEdit(supplier)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDelete(supplier.supplierId)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </motion.button>
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

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={resetForm}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                                </h2>
                                <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Supplier Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.supplierName}
                                            onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Contact Person *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.contactPerson}
                                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                    />
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Lead Time (days) *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.leadTime}
                                            onChange={(e) => setFormData({ ...formData, leadTime: parseInt(e.target.value) })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Status *
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                                >
                                    {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={resetForm}
                                    className="px-6 py-3 border border-border text-muted-foreground rounded-lg hover:bg-muted transition-all"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SuppliersPage;
