'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Eye, X, ShoppingCart, Calendar, DollarSign, Package } from 'lucide-react';
import Link from 'next/link';

interface SalesOrder {
    salesOrderId: number;
    orderNumber: string;
    orderDate: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    customerName: string;
    warehouseName: string;
    totalAmount: number;
    itemCount: number;
    createdBy: string;
}

const SalesOrdersPage: React.FC = () => {
    const [salesOrders] = useState<SalesOrder[]>([
        {
            salesOrderId: 1,
            orderNumber: 'SO-2025-001',
            orderDate: '2025-12-20',
            status: 'completed',
            customerName: 'Tech Solutions Ltd',
            warehouseName: 'Warehouse A',
            totalAmount: 15750.00,
            itemCount: 12,
            createdBy: 'John Doe'
        },
        {
            salesOrderId: 2,
            orderNumber: 'SO-2025-002',
            orderDate: '2025-12-22',
            status: 'processing',
            customerName: 'Global Retailers',
            warehouseName: 'Warehouse B',
            totalAmount: 8920.50,
            itemCount: 8,
            createdBy: 'Jane Smith'
        },
        {
            salesOrderId: 3,
            orderNumber: 'SO-2025-003',
            orderDate: '2025-12-25',
            status: 'pending',
            customerName: 'Office Supplies Co',
            warehouseName: 'Warehouse A',
            totalAmount: 5430.00,
            itemCount: 15,
            createdBy: 'John Doe'
        },
        {
            salesOrderId: 4,
            orderNumber: 'SO-2025-004',
            orderDate: '2025-12-27',
            status: 'processing',
            customerName: 'Metro Store Chain',
            warehouseName: 'Warehouse C',
            totalAmount: 22340.00,
            itemCount: 25,
            createdBy: 'Mike Johnson'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [showFilters, setShowFilters] = useState(false);

    const filteredOrders = salesOrders.filter(order => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
            case 'processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
            case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
            case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
            default: return 'bg-secondary text-secondary-foreground';
        }
    };

    const stats = {
        totalOrders: salesOrders.length,
        totalRevenue: salesOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        pendingOrders: salesOrders.filter(o => o.status === 'pending').length,
        completedOrders: salesOrders.filter(o => o.status === 'completed').length
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <ShoppingCart className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Sales Orders</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Manage customer orders and sales</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">${stats.totalRevenue.toFixed(2)}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingOrders}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completedOrders}</p>
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
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search orders or customers..."
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
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <Link href="/sales/orders/new">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    New Order
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card rounded-xl shadow-lg border border-border overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order #</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Warehouse</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Items</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredOrders.map((order, index) => (
                                        <motion.tr
                                            key={order.salesOrderId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-t border-border hover:bg-muted/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm font-semibold text-foreground">{order.orderNumber}</span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-foreground">{order.customerName}</p>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{order.warehouseName}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{order.itemCount}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-green-600 dark:text-green-400">${order.totalAmount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/sales/${order.salesOrderId}`}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="p-2 bg-secondary hover:bg-pink-500 hover:text-white rounded-lg transition-all"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </motion.button>
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>No sales orders found</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default SalesOrdersPage;
