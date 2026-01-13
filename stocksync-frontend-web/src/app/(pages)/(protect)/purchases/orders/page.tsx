'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import { DropdownSelect } from '@/components/ui/dropdown-select';

/* =====================
   Types
===================== */

interface PurchaseOrder {
    poId: string;
    orderDate: string;
    expectedDeliveryDate: string;
    status: 'PENDING' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
    totalAmount: number;
    supplierName?: string[] | string | null;
    warehouseLocation?: string[] | string | null;
    createdByUsername: string;
    itemName?: string | null;
}

interface PurchaseOrderApiRow {
    poId?: unknown;
    itemName?: unknown;
    ItemName?: unknown;
    orderDate?: unknown;
    expectedDeliveryDate?: unknown;
    status?: unknown;
    totalAmount?: unknown;
    supplierName?: unknown;
    warehouseLocation?: unknown;
    createdByUsername?: unknown;
}

interface CardValuesResponse {
    totalOrders: number;
    totalValue: number;
    pendingOrders: number;
    receivedOrders: number;
}

interface CardValues {
    totalOrders: number;
    totalValue: number;
    pending: number;
    received: number;
}

/* =====================
   Normalizers / helpers (module-scope to keep hooks deps clean)
===================== */

const normalizeText = (value: unknown) => (value == null ? '' : String(value)).toLowerCase();

const normalizeOptionalText = (value: unknown): string | null => {
    if (value == null) return null;
    if (typeof value === 'string') {
        const s = value.trim();
        return s ? s : null;
    }
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    return null;
};

const normalizeStringArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value
            .map(normalizeOptionalText)
            .filter((v): v is string => Boolean(v));
    }

    const asString = normalizeOptionalText(value);
    return asString ? [asString] : [];
};

const getRecord = (value: unknown): Record<string, unknown> | null => {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : null;
};

const pickFirst = (record: Record<string, unknown>, keys: string[]): unknown => {
    for (const key of keys) {
        if (key in record) return record[key];
    }
    return undefined;
};

const extractItemName = (row: PurchaseOrderApiRow): string | null => {
    const rowRecord = getRecord(row);
    const raw = rowRecord
        ? pickFirst(rowRecord, [
            'itemName',
            'ItemName',
            'item_name',
            'Item_Name',
            'productName',
            'ProductName'
        ])
        : row?.itemName ?? row?.ItemName;

    const direct = normalizeOptionalText(raw);
    if (direct) return direct;

    if (Array.isArray(raw)) {
        const first = raw.map(normalizeOptionalText).find(Boolean);
        return first ?? null;
    }

    const rawObj = getRecord(raw);
    if (rawObj) {
        const nested = pickFirst(rawObj, ['name', 'itemName', 'ItemName', 'productName', 'ProductName']);
        return normalizeOptionalText(nested);
    }

    return null;
};

const formatUsername = (value: unknown): string => {
    const text = normalizeOptionalText(value) ?? '';
    return text
        .trim()
        .replace(/^\[+/, '')
        .replace(/\]+$/, '')
        .trim();
};

/* =====================
   Component
===================== */

const PurchaseOrdersPage = () => {
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [cards, setCards] = useState<CardValues>({
        totalOrders: 0,
        totalValue: 0,
        pending: 0,
        received: 0
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* =====================
       Load Data
    ===================== */

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const [ordersRes, cardsRes] = await Promise.all([
                    api.get<PurchaseOrderApiRow[]>('/api/purchase-orders'),
                    api.get<CardValuesResponse>('/api/purchase-orders/card-values')
                ]);

                const normalizedOrders: PurchaseOrder[] = (Array.isArray(ordersRes.data) ? ordersRes.data : []).map((row: PurchaseOrderApiRow) => {
                    const supplierName = normalizeStringArray(row?.supplierName);
                    const warehouseLocation = normalizeStringArray(row?.warehouseLocation);
                    const status = String(row?.status ?? 'PENDING') as PurchaseOrder['status'];

                    return {
                        poId: String(row?.poId ?? ''),
                        itemName: extractItemName(row),
                        orderDate: String(row?.orderDate ?? ''),
                        expectedDeliveryDate: String(row?.expectedDeliveryDate ?? ''),
                        status,
                        totalAmount: Number(row?.totalAmount ?? 0),
                        supplierName,
                        warehouseLocation,
                        createdByUsername: formatUsername(row?.createdByUsername)
                    };
                });

                setOrders(normalizedOrders);

                setCards({
                    totalOrders: cardsRes.data.totalOrders,
                    totalValue: cardsRes.data.totalValue,
                    pending: cardsRes.data.pendingOrders,
                    received: cardsRes.data.receivedOrders
                });

            } catch (err) {
                const error = err as AxiosError;
                setError(
                    error?.response
                        ? `API ERROR ${error.response.status}`
                        : 'Backend not reachable'
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    /* =====================
       Filters
    ===================== */

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const search = normalizeText(searchTerm);
            const itemName = normalizeText(o.itemName);
            const supplierNames = normalizeText(normalizeStringArray(o.supplierName).join(','));

            const matchesSearch =
                itemName.includes(search) ||
                supplierNames.includes(search);

            const matchesStatus =
                statusFilter === 'All' || o.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    /* =====================
       Sticker Logic
    ===================== */

    const pendingOrderIds = filteredOrders
        .filter(o => o.status === 'PENDING')
        .map(o => o.poId);

    /* =====================
       Helpers
    ===================== */

    const statusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED': return 'bg-blue-100 text-blue-800';
            case 'RECEIVED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    /* =====================
       UI States
    ===================== */

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading purchase orders...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
    }

    /* =====================
       Render
    ===================== */

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">

                <h1 className="text-4xl font-bold mb-1">Purchase Orders</h1>
                <p className="text-muted-foreground mb-6">
                    Manage supplier purchase orders
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Stat title="Total Orders" value={cards.totalOrders} />
                    <Stat title="Total Value" value={`$${cards.totalValue.toFixed(2)}`} />
                    <Stat title="Pending" value={cards.pending} />
                    <Stat title="Received" value={cards.received} />
                </div>

                {/* Filters */}
                <div className="bg-card p-4 rounded-xl mb-6 flex flex-wrap gap-4 justify-between">
                    <input
                        type="text"
                        placeholder="Search by item or supplier..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="border rounded-lg px-4 py-2 w-full md:w-1/2"
                    />

                    <div className="flex gap-3">
                        <DropdownSelect
                            value={statusFilter}
                            onValueChangeAction={setStatusFilter}
                            menuLabel="Status"
                            className="w-[180px]"
                            options={[
                                { value: 'All', label: 'All Status' },
                                { value: 'PENDING', label: 'Pending' },
                                { value: 'APPROVED', label: 'Approved' },
                                { value: 'RECEIVED', label: 'Received' },
                                { value: 'CANCELLED', label: 'Cancelled' }
                            ]}
                        />

                        <Link
                            href={
                                pendingOrderIds.length > 0
                                    ? `/purchases/orders/print-stickers?ids=${pendingOrderIds.join(',')}`
                                    : '#'
                            }
                            className={`px-5 py-2 rounded-lg font-medium
                                ${pendingOrderIds.length === 0
                                    ? 'bg-gray-400 text-white pointer-events-none'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                        >
                            Print Stickers
                        </Link>

                        <Link
                            href="/purchases/new"
                            className="bg-purple-600 text-white px-5 py-2 rounded-lg"
                        >
                            New Purchase Order
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card rounded-xl overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="px-6 py-3 text-left">PO ID</th>
                                <th className="px-6 py-3 text-left">Item</th>
                                <th className="px-6 py-3 text-left">Supplier</th>
                                <th className="px-6 py-3 text-left">Warehouse</th>
                                <th className="px-6 py-3 text-left">Created By</th>
                                <th className="px-6 py-3 text-left">Order Date</th>
                                <th className="px-6 py-3 text-left">Expected Delivery</th>
                                <th className="px-6 py-3 text-left">Amount</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.poId} className="border-t">
                                    <td className="px-6 py-3 font-mono">PO-{order.poId}</td>
                                    <td className="px-6 py-3 font-medium">{order.itemName ?? '-'}</td>
                                    <td className="px-6 py-3">{normalizeStringArray(order.supplierName).join(', ') || '-'}</td>
                                    <td className="px-6 py-3">{normalizeStringArray(order.warehouseLocation).join(', ') || '-'}</td>
                                    <td className="px-6 py-3">{order.createdByUsername || '-'}</td>
                                    <td className="px-6 py-3">
                                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-3">
                                        {order.expectedDeliveryDate
                                            ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-3 font-semibold">
                                        ${order.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-3 py-1 rounded-full text-xs ${statusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <Link
                                            href={`/purchases/${order.poId}`}
                                            className="text-purple-600 underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No purchase orders found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Stat = ({ title, value }: { title: string; value: string | number }) => (
    <div className="bg-card border rounded-xl p-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

export default PurchaseOrdersPage;
