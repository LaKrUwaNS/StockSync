"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, QrCode, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import toast from "react-hot-toast";

import { createGrn, getPurchaseOrderById } from "@/service/grn";
import type { GrnStatus, PurchaseOrderResponse } from "@/utils/types/grn";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ================= TYPES ================= */

type StockSyncQrPayload = {
    system?: string;
    poId?: number;
};

type SendStatus = "idle" | "sending" | "sent" | "error";

type ScannedOrder = {
    poId: number;
    purchaseOrder: PurchaseOrderResponse | null;
    isLoading: boolean;
    loadError: string | null;
    sendStatus: SendStatus;
    sendError: string | null;
};

/* ================= HELPERS ================= */

function parseStockSyncQr(raw: string): number | "wrong-system" | null {
    try {
        const parsed = JSON.parse(raw) as StockSyncQrPayload;
        if (parsed.system !== "StockSync") return "wrong-system";
        if (typeof parsed.poId !== "number") return null;
        return parsed.poId;
    } catch {
        return null;
    }
}

/* ================= COMPONENT ================= */

const CreateGRNPage: React.FC = () => {
    const router = useRouter();

    const [orders, setOrders] = useState<ScannedOrder[]>([]);

    const [grnNote, setGrnNote] = useState("");
    const [status, setStatus] = useState<GrnStatus>("RECEIVED");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showScanner, setShowScanner] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scanLockRef = useRef(false);

    /* ================= DERIVED ================= */

    const poDisplay = useMemo(
        () => orders.map(o => o.poId).join(", "),
        [orders]
    );

    /* ================= STATE HELPERS ================= */

    const upsertOrder = (poId: number, patch: Partial<ScannedOrder>) => {
        setOrders(prev => {
            const exists = prev.find(o => o.poId === poId);
            if (!exists) {
                return [
                    {
                        poId,
                        purchaseOrder: null,
                        isLoading: false,
                        loadError: null,
                        sendStatus: "idle",
                        sendError: null,
                        ...patch,
                    },
                    ...prev,
                ];
            }
            return prev.map(o => (o.poId === poId ? { ...o, ...patch } : o));
        });
    };

    /* ================= FETCH PO ================= */

    const loadPurchaseOrder = useCallback(
        async (poId: number) => {
            if (orders.some(o => o.poId === poId)) {
                toast("PO already added");
                return;
            }

            upsertOrder(poId, { isLoading: true, loadError: null });

            try {
                const po = await getPurchaseOrderById(poId);
                upsertOrder(poId, { purchaseOrder: po, isLoading: false, loadError: null });
                toast.success(`PO ${poId} loaded`);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "Failed to load PO";
                upsertOrder(poId, {
                    isLoading: false,
                    loadError: message,
                });
                toast.error(message);
            }
        },
        [orders]
    );

    /* ================= QR SCANNER ================= */

    const stopScanner = useCallback(async () => {
        if (!scannerRef.current) return;
        try {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
        } catch {
            // ignore
        }
        scannerRef.current = null;
        setShowScanner(false);
    }, []);

    useEffect(() => {
        if (!showScanner) return;

        let cancelled = false;

        const start = async () => {
            try {
                scanLockRef.current = false;
                const scanner = new Html5Qrcode("qr-reader");
                scannerRef.current = scanner;

                await scanner.start(
                    { facingMode: "environment" },
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    decodedText => {
                        if (cancelled) return;
                        if (scanLockRef.current) return;

                        const parsed = parseStockSyncQr(decodedText);
                        if (!parsed || parsed === "wrong-system") {
                            toast.error("Invalid StockSync QR");
                            return;
                        }

                        scanLockRef.current = true;
                        void loadPurchaseOrder(parsed);
                        void stopScanner();
                    },
                    () => undefined
                );
            } catch {
                toast.error("Camera error");
                void stopScanner();
            }
        };

        void start();
        return () => {
            cancelled = true;
            void stopScanner();
        };
    }, [showScanner, loadPurchaseOrder, stopScanner]);

    /* ================= SUBMIT ================= */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orders.length) {
            toast.error("No purchase orders added");
            return;
        }
        if (!grnNote.trim()) {
            toast.error("GRN note required");
            return;
        }

        setIsSubmitting(true);
        let ok = 0,
            failed = 0;

        for (const order of orders) {
            if (order.sendStatus === "sent") continue;

            upsertOrder(order.poId, { sendStatus: "sending" });

            try {
                await createGrn({
                    poId: order.poId,
                    grnNote: grnNote.trim(),
                    status,
                });

                ok++;
                upsertOrder(order.poId, { sendStatus: "sent" });
            } catch (e: unknown) {
                failed++;
                upsertOrder(order.poId, {
                    sendStatus: "error",
                    sendError: e instanceof Error ? e.message : "Failed",
                });
            }
        }

        setIsSubmitting(false);

        if (failed === 0) {
            toast.success(`GRNs created: ${ok}`);
            router.push("/purchases/grn");
        } else {
            toast.error(`Created ${ok}, failed ${failed}`);
        }
    };

    /* ================= UI ================= */

    return (
        <div className="min-h-screen bg-background p-6 max-w-6xl mx-auto">
            <Button variant="ghost" onClick={() => router.push("/purchases/grn")}>
                <ArrowLeft /> Back
            </Button>

            <h1 className="text-2xl font-semibold mt-4">Create GRNs</h1>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>GRN Details</CardTitle>
                        <CardDescription>Applied to all scanned POs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Label>Purchase Orders</Label>
                        <div className="flex gap-2">
                            <Input readOnly value={poDisplay} placeholder="Scan QR codes" />
                            <Button type="button" onClick={() => setShowScanner(true)}>
                                <QrCode /> Scan
                            </Button>
                        </div>

                        <Label>GRN Note</Label>
                        <Input value={grnNote} onChange={e => setGrnNote(e.target.value)} />

                        <Label>Status</Label>
                        <DropdownSelect
                            value={status}
                            onValueChangeAction={v => setStatus(v as GrnStatus)}
                            options={[
                                { value: "RECEIVED", label: "RECEIVED" },
                                { value: "UNDER_INSPECTION", label: "UNDER_INSPECTION" },
                                { value: "COMPLETED", label: "COMPLETED" },
                                { value: "INCOMPLETE", label: "INCOMPLETE" },
                            ]}
                        />
                    </CardContent>
                </Card>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
                    Create GRNs ({orders.length})
                </Button>
            </form>

            {/* QR MODAL */}
            <AnimatePresence>
                {showScanner && (
                    <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                        <div className="bg-card p-4 rounded-xl w-full max-w-md">
                            <div className="flex justify-between mb-2">
                                <h3>Scan StockSync QR</h3>
                                <Button size="icon" variant="ghost" onClick={stopScanner}>
                                    <X />
                                </Button>
                            </div>
                            <div id="qr-reader" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreateGRNPage;
