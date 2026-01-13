'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import api from '@/lib/axios';

/* =====================
   Backend DTO Mapping
===================== */
interface StickerData {
    poId: number;
    supplierName: string;
    warehouse: string;
    receivedDate: string;
}

const toText = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    return typeof value === 'string' ? value : String(value);
};

const toNumber = (value: unknown, fallback = 0): number => {
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : fallback;
};

export default function PrintStickersPage() {
    const searchParams = useSearchParams();
    const idsParam = searchParams.get('ids');

    const [stickers, setStickers] = useState<StickerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* =====================
       Load Sticker Data
    ===================== */
    useEffect(() => {
        if (!idsParam) {
            setLoading(false);
            return;
        }

        const ids = idsParam
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map(Number)
            .filter(Number.isFinite);

        if (ids.length === 0) {
            setLoading(false);
            return;
        }

        const loadStickerData = async () => {
            try {
                setError(null);
                setLoading(true);

                const response = await api.post(
                    '/api/purchase-orders/stickers',
                    ids
                );

                const raw: unknown[] = Array.isArray(response.data)
                    ? (response.data as unknown[])
                    : [];

                const normalized: StickerData[] = raw.map((rawItem) => {
                    const item =
                        rawItem && typeof rawItem === 'object'
                            ? (rawItem as Record<string, unknown>)
                            : ({} as Record<string, unknown>);

                    return {
                        poId: toNumber(item.poId),
                        supplierName: toText(item.supplierName),
                        warehouse: toText(item.warehouse),
                        receivedDate: toText(item.receivedDate)
                    };
                });

                setStickers(normalized);
            } catch {
                setError('Failed to load sticker data');
            } finally {
                setLoading(false);
            }
        };

        loadStickerData();
    }, [idsParam]);

    /* =====================
       Generate PDF
    ===================== */
    const generatePDF = async () => {
        if (stickers.length === 0) return;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a6'
        });

        for (let i = 0; i < stickers.length; i++) {
            if (i > 0) pdf.addPage();

            const s = stickers[i];

            /* ===== Border ===== */
            pdf.setDrawColor(0);
            pdf.setLineWidth(0.7);
            pdf.rect(4, 4, 97, 140);

            /* ===== Header ===== */
            pdf.setFillColor('#000000');
            pdf.rect(4, 4, 97, 18, 'S');

            pdf.setTextColor(255);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(14);
            pdf.text('STOCKSYNC', 10, 15);

            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text('ENTERPRISE INVENTORY SYSTEM', 10, 20);

            pdf.setTextColor(0);

            /* ===== Title ===== */
            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'bold');
            pdf.text('GOODS RECEIVED NOTE (GRN)', 10, 30);
            pdf.line(10, 32, 90, 32);

            /* ===== Details ===== */
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');

            pdf.text('PO ID', 10, 42);
            pdf.setFont('helvetica', 'bold');
            pdf.text(toText(s.poId), 45, 42);

            pdf.setFont('helvetica', 'normal');
            pdf.text('Supplier', 10, 52);
            pdf.text(toText(s.supplierName), 45, 52, { maxWidth: 52 });

            pdf.text('Warehouse', 10, 62);
            pdf.text(toText(s.warehouse), 45, 62, { maxWidth: 52 });

            pdf.text('Received Date', 10, 72);
            pdf.text(toText(s.receivedDate), 45, 72, { maxWidth: 52 });

            /* ===== QR Code ===== */
            pdf.rect(20, 80, 60, 52);

            const qrDataUrl = await QRCode.toDataURL(
                JSON.stringify({
                    system: 'StockSync',
                    poId: s.poId
                }),
                { margin: 1 }
            );

            pdf.addImage(qrDataUrl, 'PNG', 30, 86, 40, 40);

            pdf.setFontSize(8);
            pdf.text('Scan to verify PO', 35, 130);

            /* ===== Footer ===== */
            pdf.line(10, 134, 90, 134);
            pdf.setFontSize(7);
            pdf.text(
                'Generated by StockSync • Inventory & Procurement Platform',
                12,
                140
            );
        }

        pdf.save('stocksync-enterprise-stickers-a6.pdf');
    };

    /* =====================
       UI States
    ===================== */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading sticker data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-card p-6 rounded-xl shadow-lg border border-border text-center max-w-md">
                <h1 className="text-2xl font-bold mb-4">
                    Print Enterprise Stickers
                </h1>

                <p className="text-muted-foreground mb-6">
                    {stickers.length} sticker(s) ready
                </p>

                <button
                    disabled={stickers.length === 0}
                    onClick={generatePDF}
                    className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all"
                >
                    Download A6 Sticker PDF
                </button>
            </div>
        </div>
    );
}
