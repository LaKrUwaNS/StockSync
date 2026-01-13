"use client";

import React from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    ClipboardList,
    Clock,
    MapPin,
    Package,
    PackageCheck,
    Truck,
} from 'lucide-react';

type RechartsPayload = Array<{ name?: string; value?: number; payload?: Record<string, unknown> }>

function ChartTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: RechartsPayload;
    label?: string | number;
}) {
    if (!active || !payload || payload.length === 0) return null;

    const first = payload[0];
    const name = first?.name ?? 'Value';
    const value = typeof first?.value === 'number' ? first.value : undefined;

    return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="text-sm font-medium text-foreground">
                {name}: {value ?? '-'}
            </div>
        </div>
    );
}

const InventoryDashboard = () => {
    // Dashboard Statistics
    const stats = [
        {
            title: 'Total Products',
            value: '1,284',
            change: '+12.5%',
            trend: 'up',
            icon: Package,
            subtext: 'Active SKUs'
        },
        {
            title: 'Low Stock Alerts',
            value: '23',
            change: '+3 today',
            trend: 'warning',
            icon: AlertTriangle,
            subtext: 'Below reorder level'
        },
        {
            title: 'Pending Requests',
            value: '47',
            change: '12 awaiting approval',
            trend: 'neutral',
            icon: ClipboardList,
            subtext: 'Customer requests'
        },
        {
            title: 'Active Pick Tasks',
            value: '89',
            change: '34 in progress',
            trend: 'up',
            icon: PackageCheck,
            subtext: 'Assigned to employees'
        }
    ];

    // Recent Stock Movements
    const stockMovements = [
        { id: 1, type: 'PURCHASE_IN', product: 'Wireless Mouse Pro', quantity: 150, location: 'A-01-03', user: 'John Smith', time: '5 mins ago', icon: ArrowUpRight },
        { id: 2, type: 'SALE_OUT', product: 'USB-C Cable 2m', quantity: 45, location: 'B-02-15', user: 'Sarah Johnson', time: '18 mins ago', icon: ArrowDownRight },
        { id: 3, type: 'ADJUSTMENT', product: 'Laptop Stand', quantity: -3, location: 'C-05-08', user: 'Mike Wilson', time: '1 hour ago', icon: AlertTriangle },
        { id: 4, type: 'TRANSFER', product: 'Webcam HD 1080p', quantity: 25, location: 'A-03-12 → B-01-05', user: 'Emma Davis', time: '2 hours ago', icon: ArrowUpRight },
    ];

    // Pending Customer Requests
    const customerRequests = [
        { id: 'REQ-1284', customer: 'Tech Solutions Inc', product: 'Wireless Keyboard', quantity: 50, status: 'PENDING_APPROVAL', priority: 'high', requestedBy: 'Alice Chen', time: '30 mins ago' },
        { id: 'REQ-1283', customer: 'Office Supplies Co', product: 'Monitor 24"', quantity: 15, status: 'APPROVED', priority: 'medium', requestedBy: 'Bob Martin', time: '2 hours ago' },
        { id: 'REQ-1282', customer: 'Startup Hub', product: 'Docking Station', quantity: 8, status: 'PENDING_APPROVAL', priority: 'low', requestedBy: 'Carol White', time: '4 hours ago' },
    ];

    // Active Pick Tasks
    const pickTasks = [
        { id: 'PICK-5621', product: 'Wireless Mouse Pro', quantity: 30, location: 'A-01-03', assignedTo: 'David Lee', status: 'IN_PROGRESS', progress: 65 },
        { id: 'PICK-5620', product: 'USB Hub 4-Port', quantity: 20, location: 'B-03-07', assignedTo: 'Emma Wilson', status: 'CREATED', progress: 0 },
        { id: 'PICK-5619', product: 'HDMI Cable 3m', quantity: 45, location: 'C-02-11', assignedTo: 'Frank Brown', status: 'IN_PROGRESS', progress: 40 },
        { id: 'PICK-5618', product: 'Power Bank 20000mAh', quantity: 12, location: 'A-05-09', assignedTo: 'Grace Taylor', status: 'COMPLETED', progress: 100 },
    ];

    // Purchase Orders Summary
    const purchaseOrders = [
        { id: 'PO-2401', supplier: 'Tech Wholesale Ltd', items: 5, total: '$12,450', status: 'APPROVED', dueDate: 'Dec 20, 2025' },
        { id: 'PO-2402', supplier: 'Global Electronics', items: 8, total: '$8,920', status: 'RECEIVED', dueDate: 'Dec 18, 2025' },
        { id: 'PO-2403', supplier: 'Prime Suppliers', items: 3, total: '$5,340', status: 'DRAFT', dueDate: 'Dec 25, 2025' },
    ];

    // Lightweight chart data (static for now)
    const inventoryTrend = [120, 118, 122, 121, 125, 128, 126, 130, 129, 132, 136, 134, 138, 141];
    const topCategories = [
        { label: 'Peripherals', value: 42 },
        { label: 'Cables', value: 31 },
        { label: 'Monitors', value: 24 },
        { label: 'Adapters', value: 18 },
        { label: 'Stands', value: 12 },
    ];

    const movementMix = [
        { label: 'Purchase In', value: 48 },
        { label: 'Sales Out', value: 32 },
        { label: 'Adjustments', value: 12 },
        { label: 'Transfers', value: 8 },
    ];

    const chartPalette = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

    const trendData = inventoryTrend.map((value, index) => ({ day: `Day ${index + 1}`, value }));
    const categoriesData = topCategories.map(item => ({ name: item.label, value: item.value }));
    const mixData = movementMix.map(item => ({ name: item.label, value: item.value }));

    const movementTypeCounts = Object.entries(
        stockMovements.reduce<Record<string, number>>((acc, movement) => {
            acc[movement.type] = (acc[movement.type] ?? 0) + 1;
            return acc;
        }, {})
    )
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    const recentMovements = stockMovements.slice(0, 5);
    const maxAbsMovementQty = Math.max(1, ...recentMovements.map(m => Math.abs(m.quantity)));

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header (match other pages) */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">
                        Track procurement → stock → fulfillment with live operational signals
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="bg-card rounded-xl p-4 border border-border shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm">{stat.title}</p>
                                <div className="bg-linear-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                                    <stat.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                            <div className="mt-2 flex items-center justify-between gap-3">
                                <p className="text-sm text-muted-foreground truncate">{stat.subtext}</p>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">{stat.change}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-lg lg:col-span-8"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">Inventory Trend</h2>
                                <p className="text-xs text-muted-foreground">Last 14 days (indexed)</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">+4.8%</span>
                        </div>

                        <div className="h-56 rounded-lg bg-muted border border-border p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                                    <defs>
                                        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="var(--border)" strokeOpacity={0.35} vertical={false} />
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                        axisLine={{ stroke: 'var(--border)', strokeOpacity: 0.6 }}
                                        tickLine={false}
                                        hide
                                    />
                                    <YAxis
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={28}
                                    />
                                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border)', strokeOpacity: 0.6 }} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        name="Index"
                                        stroke="var(--chart-1)"
                                        strokeWidth={2}
                                        fill="url(#trendFill)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-lg lg:col-span-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">Movement Mix</h2>
                                <p className="text-xs text-muted-foreground">Last 24 hours</p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-muted border border-border p-2">
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Tooltip content={<ChartTooltip />} />
                                        <Pie
                                            data={mixData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={52}
                                            outerRadius={76}
                                            paddingAngle={2}
                                        >
                                            {mixData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={chartPalette[index % chartPalette.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-2 space-y-2">
                                {mixData.map((item, index) => (
                                    <div key={item.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{ backgroundColor: chartPalette[index % chartPalette.length] }}
                                            />
                                            <span className="text-foreground truncate">{item.name}</span>
                                        </div>
                                        <span className="text-muted-foreground tabular-nums">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-lg lg:col-span-8"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">Top Categories</h2>
                                <p className="text-xs text-muted-foreground">By SKU count</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                            <div className="h-56 rounded-lg bg-muted border border-border p-2 xl:col-span-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoriesData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                                        <CartesianGrid stroke="var(--border)" strokeOpacity={0.35} vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                            axisLine={{ stroke: 'var(--border)', strokeOpacity: 0.6 }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                            axisLine={false}
                                            tickLine={false}
                                            width={28}
                                        />
                                        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)', fillOpacity: 0.6 }} />
                                        <Bar dataKey="value" name="SKUs" radius={[6, 6, 2, 2]}>
                                            {categoriesData.map((_entry, index) => (
                                                <Cell key={`bar-${index}`} fill={chartPalette[index % chartPalette.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="rounded-lg bg-muted border border-border p-3">
                                <div className="space-y-2">
                                    {categoriesData.map((item, index) => (
                                        <div key={item.name} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{ backgroundColor: chartPalette[index % chartPalette.length] }}
                                                />
                                                <span className="text-foreground truncate">{item.name}</span>
                                            </div>
                                            <span className="text-muted-foreground tabular-nums">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-lg lg:col-span-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h2 className="text-sm font-semibold text-foreground">Activity By Type</h2>
                                <p className="text-xs text-muted-foreground">Recent movements (count)</p>
                            </div>
                        </div>

                        <div className="h-56 rounded-lg bg-muted border border-border p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={movementTypeCounts} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                                    <CartesianGrid stroke="var(--border)" strokeOpacity={0.35} vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                                        axisLine={{ stroke: 'var(--border)', strokeOpacity: 0.6 }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                        width={28}
                                    />
                                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)', fillOpacity: 0.6 }} />
                                    <Bar dataKey="count" name="Count" radius={[6, 6, 2, 2]}>
                                        {movementTypeCounts.map((_entry, index) => (
                                            <Cell key={`type-${index}`} fill={chartPalette[index % chartPalette.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Operations */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                    {/* Recent Stock Movements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl shadow-lg border border-border overflow-hidden xl:col-span-7"
                    >
                        <div className="px-6 py-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">Recent Stock Movements</h2>
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="px-6 pb-5">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">Latest {recentMovements.length} movements</p>
                                <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">Live</span>
                            </div>

                            <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
                                {recentMovements.map(movement => {
                                    const isInbound = movement.quantity >= 0;
                                    const absQty = Math.abs(movement.quantity);
                                    const pct = Math.round((absQty / maxAbsMovementQty) * 100);

                                    return (
                                        <div
                                            key={movement.id}
                                            className="rounded-lg bg-muted border border-border p-3 hover:bg-secondary/60 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={
                                                        "p-2 rounded-lg border border-border " +
                                                        (isInbound
                                                            ? "bg-emerald-500/10 text-emerald-400"
                                                            : "bg-rose-500/10 text-rose-400")
                                                    }
                                                >
                                                    <movement.icon className="w-4 h-4" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-sm font-medium text-foreground truncate">{movement.product}</p>
                                                        <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground whitespace-nowrap">
                                                            {movement.type}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 flex items-center justify-between gap-3">
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            <MapPin className="w-3 h-3 inline-block mr-1" />
                                                            {movement.location}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground whitespace-nowrap">{movement.time}</p>
                                                    </div>

                                                    <div className="mt-3 flex items-center gap-3">
                                                        <div className="text-sm font-semibold tabular-nums whitespace-nowrap">
                                                            <span className={isInbound ? "text-emerald-400" : "text-rose-400"}>
                                                                {isInbound ? "+" : "-"}
                                                                {absQty}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                                                                <div
                                                                    className={isInbound ? "h-full bg-emerald-500" : "h-full bg-rose-500"}
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                                                                <span className="truncate">By: {movement.user}</span>
                                                                <span className="tabular-nums">{pct}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Active Pick Tasks */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 }}
                        className="bg-card rounded-xl shadow-lg border border-border overflow-hidden xl:col-span-5"
                    >
                        <div className="px-6 py-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">Active Pick Tasks</h2>
                            <PackageCheck className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="px-6 pb-5 space-y-3">
                            {pickTasks.map(task => (
                                <div key={task.id} className="rounded-lg bg-muted border border-border p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-foreground truncate">{task.id}</div>
                                            <div className="text-xs text-muted-foreground truncate">{task.product}</div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${
                                                task.status === 'COMPLETED'
                                                    ? 'bg-emerald-500/15 text-emerald-400'
                                                    : task.status === 'IN_PROGRESS'
                                                        ? 'bg-primary/15 text-primary'
                                                    : 'bg-secondary text-secondary-foreground'
                                            }`}
                                        >
                                            {task.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1 truncate">
                                            <MapPin className="w-3 h-3" />
                                            {task.location}
                                        </span>
                                        <span className="tabular-nums">Qty: {task.quantity}</span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                            <span className="truncate">Assigned: {task.assignedTo}</span>
                                            <span className="tabular-nums">{task.progress}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-secondary">
                                            <div
                                                className={`h-full rounded-full ${
                                                    task.progress === 100
                                                        ? 'bg-emerald-500'
                                                        : task.progress > 0
                                                            ? 'bg-primary'
                                                        : 'bg-muted-foreground'
                                                }`}
                                                style={{ width: `${task.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Customer Requests */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl shadow-lg border border-border overflow-hidden xl:col-span-6"
                    >
                        <div className="px-6 py-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">Customer Requests</h2>
                            <ClipboardList className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Request</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Qty</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {customerRequests.map(request => (
                                        <tr key={request.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="text-sm font-medium text-foreground whitespace-nowrap">{request.id}</div>
                                                <div className="text-xs text-muted-foreground truncate">{request.product}</div>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-muted-foreground truncate">{request.customer}</td>
                                            <td className="px-6 py-3 text-sm text-foreground tabular-nums">{request.quantity}</td>
                                            <td className="px-6 py-3">
                                                <span
                                                    className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${
                                                        request.status === 'APPROVED'
                                                            ? 'bg-emerald-500/15 text-emerald-400'
                                                            : request.status === 'PENDING_APPROVAL'
                                                                ? 'bg-amber-500/15 text-amber-300'
                                                            : 'bg-secondary text-secondary-foreground'
                                                    }`}
                                                >
                                                    {request.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Purchase Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-card rounded-xl shadow-lg border border-border overflow-hidden xl:col-span-6"
                    >
                        <div className="px-6 py-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-foreground">Purchase Orders</h2>
                            <Truck className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">PO</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Supplier</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">Due</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {purchaseOrders.map(po => (
                                        <tr key={po.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-3 text-sm font-medium text-foreground whitespace-nowrap">{po.id}</td>
                                            <td className="px-6 py-3 text-sm text-muted-foreground truncate">{po.supplier}</td>
                                            <td className="px-6 py-3 text-sm text-foreground whitespace-nowrap">{po.total}</td>
                                            <td className="px-6 py-3">
                                                <span
                                                    className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${
                                                        po.status === 'RECEIVED'
                                                            ? 'bg-emerald-500/15 text-emerald-400'
                                                            : po.status === 'APPROVED'
                                                                ? 'bg-primary/15 text-primary'
                                                            : 'bg-secondary text-secondary-foreground'
                                                    }`}
                                                >
                                                    {po.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-muted-foreground whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {po.dueDate}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default InventoryDashboard;