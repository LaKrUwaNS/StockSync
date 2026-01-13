'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Building, Calendar, DollarSign, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PurchaseOrderItem {
    itemId: number;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
}

const PurchaseOrderDetailPage: React.FC = () => {
    const params = useParams();
    const orderId = params.orderId as string;

    const [order] = useState({
        poId: parseInt(orderId),
        poNumber: 'PO-2025-001',
        orderDate: '2025-12-20',
        expectedDelivery: '2025-12-30',
        status: 'approved',
        supplierName: 'Tech Corp',
        supplierEmail: 'orders@techcorp.com',
        supplierPhone: '+1 (555) 111-2222',
        warehouseName: 'Warehouse A',
        totalAmount: 25000.00,
        createdBy: 'John Doe',
        notes: 'Urgent order - expedited shipping required',
        items: [
            { itemId: 1, productName: 'Laptop Pro 15"', sku: 'LAP-001', quantity: 20, unitPrice: 1200.00, lineTotal: 24000.00 },
            { itemId: 2, productName: 'Wireless Mouse', sku: 'MOU-002', quantity: 50, unitPrice: 20.00, lineTotal: 1000.00 }
        ]
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'received': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            case 'approved': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Link href="/purchases/orders">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 text-muted-foreground hover:text-pink-500 mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Purchase Orders
                        </motion.button>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground mb-2">
                                PO {order.poNumber}
                            </h1>
                            <p className="text-muted-foreground">Purchase order details</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5 text-pink-500" />
                                Supplier Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Supplier</p>
                                    <p className="text-foreground font-medium">{order.supplierName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="text-foreground">{order.supplierEmail}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="text-foreground">{order.supplierPhone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
                            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-pink-500" />
                                Order Details
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order Date</p>
                                        <p className="text-foreground">{new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Expected Delivery</p>
                                        <p className="text-foreground">{new Date(order.expectedDelivery).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Warehouse</p>
                                        <p className="text-foreground">{order.warehouseName}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                                <h2 className="text-xl font-bold text-foreground mb-2">Notes</h2>
                                <p className="text-muted-foreground">{order.notes}</p>
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-border">
                                <h2 className="text-xl font-bold text-foreground">Order Items</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Product</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Quantity</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Unit Price</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, index) => (
                                            <motion.tr
                                                key={item.itemId}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-t border-border"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-foreground">{item.productName}</p>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground font-mono text-sm">
                                                    {item.sku}
                                                </td>
                                                <td className="px-6 py-4 text-right text-foreground">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 text-right text-foreground">
                                                    ${item.unitPrice.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-semibold text-foreground">
                                                    ${item.lineTotal.toFixed(2)}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-muted">
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-right font-bold text-foreground">
                                                Total Amount:
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-2xl text-purple-600 dark:text-purple-400">
                                                ${order.totalAmount.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="p-6 border-t border-border flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Approve Order
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                                >
                                    <Edit2 className="w-5 h-5" />
                                    Edit
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Cancel
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderDetailPage;
