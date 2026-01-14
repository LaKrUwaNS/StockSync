'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, CheckCircle, Package, Calendar, FileText, Warehouse } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DropdownSelect } from '@/components/ui/dropdown-select';
import Loader from '@/components/ui/loader';
import { getGrnKpi, getGrns } from '@/service/grn';
import type { GrnKpiResponse, GrnListItemResponse, GrnStatus } from '@/utils/types/grn';

type GrnStatusFilter = 'All' | GrnStatus | 'UNDER_INSPECTION' | string;

type GrnCard = {
    id: number;
    poId: number;
    receivedDate: string | null;
    grnNote: string;
    status: GrnStatus | string;
    receivedBy: string | null;
    notes: string | null;
    inspectionLevel: string | null;
};

const GRNPage: React.FC = () => {

    const router = useRouter();

    const [grns, setGrns] = useState<GrnCard[]>([]);
    const [kpi, setKpi] = useState<GrnKpiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                setIsLoading(true);
                setError(null);
                const [data, kpiData] = await Promise.all([getGrns(), getGrnKpi()]);

                if (!isMounted) return;

                const mapped: GrnCard[] = data.map((g) => ({
                    id: g.id,
                    poId: g.Poid,
                    receivedDate: g.receivedDate === 'null' ? null : g.receivedDate,
                    grnNote: g.grnNote,
                    status: g.status,
                    receivedBy: g.receivedBy,
                    notes: g.notes,
                    inspectionLevel: g.inspectionLevel,
                }));

                setGrns(mapped);
                setKpi(kpiData);
            } catch (e: unknown) {
                if (!isMounted) return;
                setError(e instanceof Error ? e.message : 'Failed to load GRNs');
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
    const [statusFilter, setStatusFilter] = useState<GrnStatusFilter>('All');

    const filteredGRNs = useMemo(() => {
        return grns.filter(grn => {
            const matchesSearch =
                String(grn.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(grn.poId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (grn.grnNote ?? '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || String(grn.status) === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [grns, searchTerm, statusFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case 'RECEIVED':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            case 'INCOMPLETE':
                return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
            case 'PENDING':
            case 'UNDER_INSPECTION':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
        }
    };

    const stats = useMemo(() => {
        const incomplete = (kpi?.incompleteGrns ?? kpi?.IncompleteGrns ?? 0);
        return {
            totalGRNs: kpi?.totalGrns ?? 0,
            pending: kpi?.pendingGrns ?? 0,
            incomplete,
        };
    }, [kpi]);

    const formatDate = (value: string | null) => {
        if (!value) return '—';
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString();
    };

    if (isLoading) {
        return <Loader label="Loading GRNs…" />;
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
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Goods Received Notes (GRN)</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Track and manage goods received from suppliers</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                        <p className="text-muted-foreground text-sm mb-1">Pending</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.pending}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Incomplete</p>
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.incomplete}</p>
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
                                    { value: 'PENDING', label: 'Pending' },
                                    { value: 'UNDER_INSPECTION', label: 'Under Inspection' },
                                    { value: 'INCOMPLETE', label: 'Incomplete' },
                                    { value: 'RECEIVED', label: 'Received' },
                                    { value: 'COMPLETED', label: 'Completed' }
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
                                key={grn.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground mb-1">
                                            GRN-{String(grn.id).padStart(4, '0')}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            PO: {grn.poId}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(grn.status)}`}>
                                        <CheckCircle className="w-4 h-4" />
                                        {String(grn.status)}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">GRN Note</p>
                                            <p className="text-xs text-muted-foreground">{grn.grnNote || '—'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Warehouse className="w-5 h-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">{grn.inspectionLevel || '—'}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(grn.receivedDate)}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <span className="text-sm text-muted-foreground">Received By:</span>
                                        <span className="text-sm font-medium text-foreground">{grn.receivedBy || '—'}</span>
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
                                    onClick={() => {
                                        // No GRN details route exists yet; keeping the button functional for future.
                                        router.push(`/purchases/grn/${grn.id}`);
                                    }}
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
