'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Warehouse, MapPin, Package, X, Eye } from 'lucide-react';
import Link from 'next/link';

interface WarehouseData {
    warehouseId: number;
    warehouseName: string;
    location: string;
    city: string;
    capacity: number;
    currentStock: number;
    status: 'active' | 'inactive' | 'maintenance';
    manager: string;
    phone: string;
}

const WarehousesPage: React.FC = () => {
    const [warehouses, setWarehouses] = useState<WarehouseData[]>([
        {
            warehouseId: 1,
            warehouseName: 'Warehouse A',
            location: '123 Industrial Park',
            city: 'San Francisco',
            capacity: 10000,
            currentStock: 7500,
            status: 'active',
            manager: 'John Smith',
            phone: '+1 234 567 8901'
        },
        {
            warehouseId: 2,
            warehouseName: 'Warehouse B',
            location: '456 Commerce Street',
            city: 'New York',
            capacity: 15000,
            currentStock: 12000,
            status: 'active',
            manager: 'Jane Doe',
            phone: '+1 234 567 8902'
        },
        {
            warehouseId: 3,
            warehouseName: 'Warehouse C',
            location: '789 Logistics Ave',
            city: 'Chicago',
            capacity: 8000,
            currentStock: 3200,
            status: 'active',
            manager: 'Mike Johnson',
            phone: '+1 234 567 8903'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<WarehouseData | null>(null);
    const [formData, setFormData] = useState({
        warehouseName: '',
        location: '',
        city: '',
        capacity: 0,
        status: 'active' as 'active' | 'inactive' | 'maintenance',
        manager: '',
        phone: ''
    });

    const filteredWarehouses = warehouses.filter(wh =>
        wh.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wh.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wh.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = () => {
        if (editingWarehouse) {
            setWarehouses(warehouses.map(w =>
                w.warehouseId === editingWarehouse.warehouseId
                    ? { ...w, ...formData }
                    : w
            ));
        } else {
            const newWarehouse: WarehouseData = {
                warehouseId: Math.max(...warehouses.map(w => w.warehouseId), 0) + 1,
                ...formData,
                currentStock: 0
            };
            setWarehouses([...warehouses, newWarehouse]);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            warehouseName: '',
            location: '',
            city: '',
            capacity: 0,
            status: 'active',
            manager: '',
            phone: ''
        });
        setEditingWarehouse(null);
        setShowAddModal(false);
    };

    const openEditModal = (warehouse: WarehouseData) => {
        setEditingWarehouse(warehouse);
        setFormData({
            warehouseName: warehouse.warehouseName,
            location: warehouse.location,
            city: warehouse.city,
            capacity: warehouse.capacity,
            status: warehouse.status,
            manager: warehouse.manager,
            phone: warehouse.phone
        });
        setShowAddModal(true);
    };

    const handleDelete = (id: number) => {
        setWarehouses(warehouses.filter(w => w.warehouseId !== id));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            case 'inactive': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
            case 'maintenance': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getUtilization = (warehouse: WarehouseData) => {
        return (warehouse.currentStock / warehouse.capacity) * 100;
    };

    const stats = {
        totalWarehouses: warehouses.length,
        totalCapacity: warehouses.reduce((sum, w) => sum + w.capacity, 0),
        totalStock: warehouses.reduce((sum, w) => sum + w.currentStock, 0),
        avgUtilization: warehouses.reduce((sum, w) => sum + getUtilization(w), 0) / warehouses.length
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Warehouse className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Warehouses</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Manage warehouse locations and inventory</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Warehouses</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalWarehouses}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Capacity</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalCapacity.toLocaleString()}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Current Stock</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalStock.toLocaleString()}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Avg Utilization</p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.avgUtilization.toFixed(1)}%</p>
                    </motion.div>
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card rounded-xl p-4 mb-6 shadow-lg border border-border"
                >
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search warehouses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setEditingWarehouse(null);
                                resetForm();
                                setShowAddModal(true);
                            }}
                            className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Add Warehouse
                        </motion.button>
                    </div>
                </motion.div>

                {/* Warehouses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredWarehouses.map((warehouse, index) => {
                            const utilization = getUtilization(warehouse);
                            return (
                                <motion.div
                                    key={warehouse.warehouseId}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground mb-1">
                                                {warehouse.warehouseName}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(warehouse.status)}`}>
                                                {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/warehouses/${warehouse.warehouseId}`}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 bg-muted hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                            </Link>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => openEditModal(warehouse)}
                                                className="p-2 bg-muted hover:bg-pink-500 hover:text-white rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDelete(warehouse.warehouseId)}
                                                className="p-2 bg-muted hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm">{warehouse.location}, {warehouse.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Package className="w-4 h-4" />
                                            <span className="text-sm">Manager: {warehouse.manager}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Utilization</span>
                                            <span className="font-semibold text-foreground">{utilization.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${
                                                    utilization >= 80 ? 'bg-red-500' :
                                                    utilization >= 60 ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                                }`}
                                                style={{ width: `${Math.min(utilization, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Capacity</p>
                                            <p className="text-lg font-bold text-foreground">{warehouse.capacity.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Current Stock</p>
                                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{warehouse.currentStock.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showAddModal && (
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
                                        {editingWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}
                                    </h2>
                                    <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-sm text-muted-foreground mb-2 block">Warehouse Name *</label>
                                        <input
                                            type="text"
                                            value={formData.warehouseName}
                                            onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="e.g., Warehouse A"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Location *</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="Street address"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">City *</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="City name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Capacity *</label>
                                        <input
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="10000"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Status *</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Manager *</label>
                                        <input
                                            type="text"
                                            value={formData.manager}
                                            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                            placeholder="Manager name"
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
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={resetForm}
                                        className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-3 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmit}
                                        className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium"
                                    >
                                        {editingWarehouse ? 'Update Warehouse' : 'Add Warehouse'}
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

export default WarehousesPage;
