'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, AlertTriangle} from 'lucide-react';

interface StockItem {
    inventoryId: number;
    productId: number;
    productName: string;
    sku: string;
    warehouseId: number;
    warehouseName: string;
    quantityOnHand: number;
    reorderLevel: number;
    unitPrice: number;
    category: string;
    lastUpdated: string;
}

const StockInventoryPage: React.FC = () => {
    const [stock] = useState<StockItem[]>([
        {
            inventoryId: 1,
            productId: 1,
            productName: 'Laptop Pro 15"',
            sku: 'LAP-001',
            warehouseId: 1,
            warehouseName: 'Warehouse A',
            quantityOnHand: 45,
            reorderLevel: 20,
            unitPrice: 1299.99,
            category: 'Electronics',
            lastUpdated: '2025-12-27'
        },
        {
            inventoryId: 2,
            productId: 2,
            productName: 'Wireless Mouse',
            sku: 'MOU-002',
            warehouseId: 1,
            warehouseName: 'Warehouse A',
            quantityOnHand: 15,
            reorderLevel: 50,
            unitPrice: 29.99,
            category: 'Accessories',
            lastUpdated: '2025-12-26'
        },
        {
            inventoryId: 3,
            productId: 3,
            productName: 'Monitor 27"',
            sku: 'MON-004',
            warehouseId: 2,
            warehouseName: 'Warehouse B',
            quantityOnHand: 32,
            reorderLevel: 15,
            unitPrice: 399.99,
            category: 'Electronics',
            lastUpdated: '2025-12-27'
        },
        {
            inventoryId: 4,
            productId: 4,
            productName: 'Office Chair',
            sku: 'CHA-008',
            warehouseId: 3,
            warehouseName: 'Warehouse C',
            quantityOnHand: 8,
            reorderLevel: 10,
            unitPrice: 249.99,
            category: 'Furniture',
            lastUpdated: '2025-12-25'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredStock = stock.filter(item => {
        const matchesSearch =
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesWarehouse = warehouseFilter === 'All' || item.warehouseName === warehouseFilter;
        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Low Stock' && item.quantityOnHand <= item.reorderLevel) ||
            (statusFilter === 'In Stock' && item.quantityOnHand > item.reorderLevel);
        return matchesSearch && matchesWarehouse && matchesStatus;
    });

    const warehouses = ['All', ...Array.from(new Set(stock.map(item => item.warehouseName)))];

    const stats = {
        totalValue: stock.reduce((sum, item) => sum + (item.quantityOnHand * item.unitPrice), 0),
        totalItems: stock.reduce((sum, item) => sum + item.quantityOnHand, 0),
        lowStock: stock.filter(item => item.quantityOnHand <= item.reorderLevel).length,
        warehouses: warehouses.length - 1
    };

    const getStockStatus = (item: StockItem) => {
        if (item.quantityOnHand <= item.reorderLevel) return 'low';
        if (item.quantityOnHand <= item.reorderLevel * 2) return 'medium';
        return 'high';
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Stock Inventory</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Monitor stock levels across all warehouses</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Value</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">${stats.totalValue.toFixed(2)}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Items</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalItems}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Low Stock Items</p>
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.lowStock}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Warehouses</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.warehouses}</p>
                    </motion.div>
                </div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card rounded-xl p-4 mb-6 shadow-lg border border-border"
                >
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[250px] relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        <select
                            value={warehouseFilter}
                            onChange={(e) => setWarehouseFilter(e.target.value)}
                            className="bg-secondary text-foreground border-0 rounded-lg px-4 py-3 focus:outline-none"
                        >
                            {warehouses.map(wh => (
                                <option key={wh} value={wh}>{wh}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-secondary text-foreground border-0 rounded-lg px-4 py-3 focus:outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="In Stock">In Stock</option>
                        </select>
                    </div>
                </motion.div>

                {/* Stock Table */}
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
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Warehouse</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Quantity</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Reorder Level</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Unit Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Value</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredStock.map((item, index) => {
                                        const status = getStockStatus(item);
                                        return (
                                            <motion.tr
                                                key={item.inventoryId}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={`border-t border-border hover:bg-muted transition-colors ${
                                                    status === 'low' ? 'bg-red-50 dark:bg-red-900 dark:bg-opacity-10' : ''
                                                }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-sm text-muted-foreground">{item.sku}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-foreground">{item.productName}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-secondary text-foreground px-3 py-1 rounded-full text-sm">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{item.warehouseName}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-semibold ${
                                                            status === 'low' ? 'text-red-600 dark:text-red-400' :
                                                            status === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                                                            'text-green-600 dark:text-green-400'
                                                        }`}>
                                                            {item.quantityOnHand}
                                                        </span>
                                                        {status === 'low' && <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">{item.reorderLevel}</td>
                                                <td className="px-6 py-4 text-muted-foreground">${item.unitPrice.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                                        ${(item.quantityOnHand * item.unitPrice).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        status === 'low' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                                                        status === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                    }`}>
                                                        {status === 'low' ? 'Low Stock' : status === 'medium' ? 'Medium' : 'In Stock'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {filteredStock.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>No stock items found</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default StockInventoryPage;
