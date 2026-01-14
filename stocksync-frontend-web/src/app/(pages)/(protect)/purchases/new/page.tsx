'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AxiosError } from "axios";
import type ErrorResponse from "@/utils/types/ErrorResponse";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BackButton from "@/components/BakcButton";

type Option = {
    id: string;
    name: string;
};

const isErrorResponse = (data: unknown): data is ErrorResponse =>
    data !== null && typeof data === "object" && "message" in data;

const INITIAL_FORM_STATE = {
    itemName: "",
    orderDate: "",
    expectedDeliveryDate: "",
    status: "PENDING",
    totalAmount: "",
    supplierId: "",
    warehouseId: ""
};

export default function NewPurchaseOrderPage() {
    const router = useRouter();

    const [form, setForm] = useState(INITIAL_FORM_STATE);
    const [suppliers, setSuppliers] = useState<Option[]>([]);
    const [warehouses, setWarehouses] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [supplierRes, warehouseRes] = await Promise.all([
                    api.get("/api/new-purchase-orders/suppliers"),
                    api.get("/api/new-purchase-orders/warehouses")
                ]);
                setSuppliers(supplierRes.data);
                setWarehouses(warehouseRes.data);
            } catch {
                setError("Failed to load suppliers or warehouses");
            }
        };
        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            setLoading(true);
            await api.post("/api/new-purchase-orders", {
                orderDate: form.orderDate,
                expectedDeliveryDate: form.expectedDeliveryDate,
                status: form.status,
                totalAmount: Number(form.totalAmount),
                supplierId: Number(form.supplierId),
                warehouseId: Number(form.warehouseId),
                itemName: form.itemName
            });
        } catch (err) {
            const axiosError = err as AxiosError;
            const errorData = axiosError.response?.data;

            if (isErrorResponse(errorData)) {
                setError(errorData.message);
            } else {
                setError(`API Error ${axiosError.response?.status || "Unknown"}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm(INITIAL_FORM_STATE);
        setError(null);
    };

    const selectedSupplier = suppliers.find(s => s.id === form.supplierId);
    const selectedWarehouse = warehouses.find(w => w.id === form.warehouseId);

    return (
        <div className="min-h-screen bg-muted/40 px-4 py-10">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Back */}
                <BackButton />

                {/* Card */}
                <div className="rounded-2xl border bg-card shadow-sm p-8">
                    <div className="mb-8 border-b pb-4">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            New Purchase Order
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Create and submit a new purchase order
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-lg border border-red-300/40 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <Label>Item Name</Label>
                            <Input
                                name="itemName"
                                placeholder="Laptop"
                                value={form.itemName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Order Date</Label>
                                <Input
                                    type="date"
                                    name="orderDate"
                                    value={form.orderDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Expected Delivery Date</Label>
                                <Input
                                    type="date"
                                    name="expectedDeliveryDate"
                                    value={form.expectedDeliveryDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {form.status}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        {["PENDING", "APPROVED", "RECEIVED", "CANCELLED"].map(status => (
                                            <DropdownMenuItem
                                                key={status}
                                                onClick={() =>
                                                    setForm(prev => ({ ...prev, status }))
                                                }
                                            >
                                                {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-2">
                                <Label>Total Amount</Label>
                                <Input
                                    type="number"
                                    name="totalAmount"
                                    placeholder="1000"
                                    value={form.totalAmount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Supplier</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {selectedSupplier?.name || "Select Supplier"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        {suppliers.map(s => (
                                            <DropdownMenuItem
                                                key={s.id}
                                                onClick={() =>
                                                    setForm(prev => ({ ...prev, supplierId: s.id }))
                                                }
                                            >
                                                {s.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-2">
                                <Label>Warehouse</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between">
                                            {selectedWarehouse?.name || "Select Warehouse"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-full">
                                        {warehouses.map(w => (
                                            <DropdownMenuItem
                                                key={w.id}
                                                onClick={() =>
                                                    setForm(prev => ({ ...prev, warehouseId: w.id }))
                                                }
                                            >
                                                {w.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
                            <Button variant="secondary" type="button" onClick={handleReset}>
                                Reset Form
                            </Button>

                            <div className="flex gap-3">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : "Create Purchase Order"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
