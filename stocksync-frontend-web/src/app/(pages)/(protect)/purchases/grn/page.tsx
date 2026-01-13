'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, CheckCircle, Package, Calendar, FileText, Warehouse } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DropdownSelect } from '@/components/ui/dropdown-select';

interface GRN {
    grnId: number;
    grnNumber: string;
    poNumber: string;
    supplierName: string;
    receiveDate: string;
    warehouseName: string;
    itemsReceived: number;
    totalValue: number;
    status: 'pending' | 'partial' | 'completed';
    receivedBy: string;
    notes: string;
}

const GRNPage: React.FC = () => {

    const router = useRouter();

    const [grns] = useState<GRN[]>([
        {
            grnId: 1,
            grnNumber: 'GRN-2025-001',
            poNumber: 'PO-2025-001',
            supplierName: 'Tech Corp',
            receiveDate: '2025-12-25',
            warehouseName: 'Warehouse A',
            itemsReceived: 100,
            totalValue: 25000.00,
            status: 'completed',
            receivedBy: 'John Doe',
            notes: 'All items received in good condition'
        },
        {
            grnId: 2,
            grnNumber: 'GRN-2025-002',
            poNumber: 'PO-2025-002',
            supplierName: 'Global Supplies',
            receiveDate: '2025-12-26',
            warehouseName: 'Warehouse B',
            itemsReceived: 60,
            totalValue: 12000.00,
            status: 'partial',
            receivedBy: 'Jane Smith',
            notes: 'Partial shipment - awaiting remaining items'
        },
        {
            grnId: 3,
            grnNumber: 'GRN-2025-003',
            poNumber: 'PO-2025-003',
            supplierName: 'Office Depot Inc',
            receiveDate: '2025-12-28',
            warehouseName: 'Warehouse A',
            itemsReceived: 50,
            totalValue: 8500.00,
            status: 'completed',
            receivedBy: 'Mike Johnson',
            notes: 'Quality check passed'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    const filteredGRNs = grns.filter(grn => {
        const matchesSearch =
            grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grn.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grn.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || grn.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            case 'partial': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
            case 'pending': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };

    const stats = {
        totalGRNs: grns.length,
        completed: grns.filter(g => g.status === 'completed').length,
        partial: grns.filter(g => g.status === 'partial').length,
        totalValue: grns.reduce((sum, g) => sum + g.totalValue, 0)
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
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Goods Received Notes (GRN)</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Track and manage goods received from suppliers</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total GRNs</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalGRNs}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Partial</p>
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.partial}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Value</p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">${stats.totalValue.toFixed(2)}</p>
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
                                placeholder="Search GRNs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        <div className="flex gap-3">
                            <DropdownSelect
                                value={statusFilter}
                                onValueChangeAction={setStatusFilter}
                                menuLabel="Status"
                                buttonVariant="secondary"
                                className="w-[180px] justify-between px-4 py-3"
                                options={[
                                    { value: 'All', label: 'All Status' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'partial', label: 'Partial' },
                                    { value: 'completed', label: 'Completed' }
                                ]}
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { router.push('/purchases/grn/new-grn') }}
                                className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Create GRN
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {filteredGRNs.map((grn, index) => (
                            <motion.div
                                key={grn.grnId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground mb-1">
                                            {grn.grnNumber}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            PO: {grn.poNumber}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(grn.status)}`}>
                                        <CheckCircle className="w-4 h-4" />
                                        {grn.status.charAt(0).toUpperCase() + grn.status.slice(1)}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{grn.supplierName}</p>
                                            <p className="text-xs text-muted-foreground">{grn.itemsReceived} items received</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Warehouse className="w-5 h-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">{grn.warehouseName}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(grn.receiveDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <span className="text-sm text-muted-foreground">Total Value:</span>
                                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">${grn.totalValue.toFixed(2)}</span>
                                    </div>
                                </div>

                                {grn.notes && (
                                    <div className="bg-muted rounded-lg p-3 mb-4">
                                        <div className="flex items-start gap-2">
                                            <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                                            <p className="text-xs text-muted-foreground">{grn.notes}</p>
                                        </div>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                                >
                                    View Details
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredGRNs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border"
                    >
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No GRNs found</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default GRNPage;
