'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Truck, Package, MapPin, Calendar, CheckCircle, Clock, X } from 'lucide-react';

interface Delivery {
    deliveryId: number;
    deliveryNumber: string;
    salesOrderNumber: string;
    customerName: string;
    deliveryDate: string;
    deliveryAddress: string;
    status: 'pending' | 'in-transit' | 'delivered' | 'cancelled';
    driverName: string;
    vehicleNumber: string;
    itemCount: number;
    notes: string;
}

const DeliveriesPage: React.FC = () => {
    const [deliveries] = useState<Delivery[]>([
        {
            deliveryId: 1,
            deliveryNumber: 'DEL-2025-001',
            salesOrderNumber: 'SO-2025-001',
            customerName: 'Tech Solutions Ltd',
            deliveryDate: '2025-12-28',
            deliveryAddress: '123 Tech Street, New York, USA',
            status: 'delivered',
            driverName: 'James Wilson',
            vehicleNumber: 'TRK-001',
            itemCount: 12,
            notes: 'Delivered successfully'
        },
        {
            deliveryId: 2,
            deliveryNumber: 'DEL-2025-002',
            salesOrderNumber: 'SO-2025-002',
            customerName: 'Global Retailers',
            deliveryDate: '2025-12-29',
            deliveryAddress: '456 Market Ave, Los Angeles, USA',
            status: 'in-transit',
            driverName: 'Robert Brown',
            vehicleNumber: 'TRK-002',
            itemCount: 8,
            notes: 'En route to destination'
        },
        {
            deliveryId: 3,
            deliveryNumber: 'DEL-2025-003',
            salesOrderNumber: 'SO-2025-003',
            customerName: 'Office Supplies Co',
            deliveryDate: '2025-12-30',
            deliveryAddress: '789 Business Blvd, Chicago, USA',
            status: 'pending',
            driverName: 'Michael Davis',
            vehicleNumber: 'TRK-003',
            itemCount: 15,
            notes: 'Scheduled for pickup'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    const filteredDeliveries = deliveries.filter(delivery => {
        const matchesSearch =
            delivery.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            delivery.salesOrderNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || delivery.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            case 'in-transit': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
            case 'cancelled': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'in-transit': return <Truck className="w-5 h-5" />;
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'cancelled': return <X className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    const stats = {
        totalDeliveries: deliveries.length,
        delivered: deliveries.filter(d => d.status === 'delivered').length,
        inTransit: deliveries.filter(d => d.status === 'in-transit').length,
        pending: deliveries.filter(d => d.status === 'pending').length
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Truck className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Deliveries</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Track and manage product deliveries</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Deliveries</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalDeliveries}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Delivered</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.delivered}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">In Transit</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.inTransit}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                    </motion.div>
                </div>

                {/* Search and Actions */}
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
                                placeholder="Search deliveries..."
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
                                <option value="pending">Pending</option>
                                <option value="in-transit">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Schedule Delivery
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Deliveries Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {filteredDeliveries.map((delivery, index) => (
                            <motion.div
                                key={delivery.deliveryId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground mb-1">
                                            {delivery.deliveryNumber}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Order: {delivery.salesOrderNumber}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                                        {getStatusIcon(delivery.status)}
                                        {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1).replace('-', ' ')}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-start gap-3">
                                        <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{delivery.customerName}</p>
                                            <p className="text-xs text-muted-foreground">{delivery.itemCount} items</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        <p className="text-sm text-muted-foreground">{delivery.deliveryAddress}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(delivery.deliveryDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Truck className="w-5 h-5 text-muted-foreground" />
                                        <div className="text-sm">
                                            <span className="text-foreground font-medium">{delivery.driverName}</span>
                                            <span className="text-muted-foreground"> • {delivery.vehicleNumber}</span>
                                        </div>
                                    </div>
                                </div>

                                {delivery.notes && (
                                    <div className="bg-muted rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground">{delivery.notes}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredDeliveries.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border"
                    >
                        <Truck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No deliveries found</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DeliveriesPage;
