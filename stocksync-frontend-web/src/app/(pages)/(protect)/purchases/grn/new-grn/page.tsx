'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Package,
    QrCode,
    Plus,
    Trash2,
    Save,
    Camera,
    X,
    Warehouse,
    User,
    FileText,
    Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type BarcodeDetectorDetectedBarcode = { rawValue: string };
type BarcodeDetectorInstance = {
    detect: (source: CanvasImageSource) => Promise<BarcodeDetectorDetectedBarcode[]>;
};
type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetectorInstance;

const getBarcodeDetector = (): BarcodeDetectorConstructor | null => {
    const ctor = (globalThis as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
    return ctor ?? null;
};

const toNumberOrZero = (value: string) => {
    const trimmed = value.trim();
    if (trimmed === '') return 0;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : 0;
};

interface GRNItem {
    id: string;
    itemCode: string;
    itemName: string;
    orderedQty: number;
    receivedQty: number;
    unitPrice: number;
    remarks: string;
}

const CreateGRNPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        poNumber: '',
        supplierName: '',
        warehouseName: '',
        receiveDate: new Date().toISOString().split('T')[0],
        receivedBy: '',
        notes: ''
    });

    const [items, setItems] = useState<GRNItem[]>([]);
    const [showScanner, setShowScanner] = useState(false);
    const [scanType, setScanType] = useState<'po' | 'item' | null>(null);
    const [showAddItemForm, setShowAddItemForm] = useState(false);
    const [newItem, setNewItem] = useState<Partial<GRNItem>>({
        itemCode: '',
        itemName: '',
        orderedQty: 0,
        receivedQty: 0,
        unitPrice: 0,
        remarks: ''
    });

    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const barcodeDetector = useMemo(() => {
        const BarcodeDetectorCtor = getBarcodeDetector();
        if (!BarcodeDetectorCtor) return null;
        return new BarcodeDetectorCtor({
            formats: [
                'qr_code',
                'code_128',
                'code_39',
                'ean_13',
                'ean_8',
                'upc_a',
                'upc_e'
            ]
        });
    }, []);

    const startScanner = async (type: 'po' | 'item') => {
        setScanType(type);
        setShowScanner(true);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                await videoRef.current.play().catch(() => undefined);
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please check permissions.');
        }
    };

    const stopScanner = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setShowScanner(false);
        setScanType(null);
    };

    const handleScan = (data: string) => {
        if (scanType === 'po') {
            setFormData(prev => ({ ...prev, poNumber: data }));
            // Simulate fetching PO details
            setTimeout(() => {
                setFormData(prev => ({
                    ...prev,
                    supplierName: 'Tech Supplies Ltd',
                }));
            }, 500);
        } else if (scanType === 'item') {
            setNewItem({
                itemCode: data,
                itemName: 'Scanned Item',
                orderedQty: 1,
                receivedQty: 1,
                unitPrice: 0,
                remarks: ''
            });
            setShowAddItemForm(true);
        }
        stopScanner();
    };

    useEffect(() => {
        if (!showScanner) return;
        return () => {
            stopScanner();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showScanner]);

    useEffect(() => {
        if (!showScanner) return;
        if (!barcodeDetector) return;
        if (!videoRef.current) return;
        if (!stream) return;
        if (!scanType) return;

        let cancelled = false;
        let rafId: number | null = null;

        const tick = async () => {
            if (cancelled) return;
            const video = videoRef.current;
            if (!video) return;

            try {
                const barcodes = await barcodeDetector.detect(video);
                if (cancelled) return;

                if (barcodes.length > 0 && barcodes[0]?.rawValue) {
                    handleScan(barcodes[0].rawValue);
                    return;
                }
            } catch {
                // ignore and continue
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);

        return () => {
            cancelled = true;
            if (rafId !== null) cancelAnimationFrame(rafId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showScanner, barcodeDetector, stream, scanType]);

    const addItem = () => {
        if (newItem.itemCode && newItem.itemName) {
            const item: GRNItem = {
                id: Date.now().toString(),
                itemCode: newItem.itemCode || '',
                itemName: newItem.itemName || '',
                orderedQty: newItem.orderedQty || 0,
                receivedQty: newItem.receivedQty || 0,
                unitPrice: newItem.unitPrice || 0,
                remarks: newItem.remarks || ''
            };
            setItems([...items, item]);
            setNewItem({
                itemCode: '',
                itemName: '',
                orderedQty: 0,
                receivedQty: 0,
                unitPrice: 0,
                remarks: ''
            });
            setShowAddItemForm(false);
        }
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = <K extends keyof GRNItem>(id: string, field: K, value: GRNItem[K]) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.receivedQty * item.unitPrice), 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('GRN Data:', { formData, items, total: calculateTotal() });
        alert('GRN Created Successfully!');
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button onClick={()=> router.push('/purchases/grn')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="w-5 h-5" />
                        Back to GRNs
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Package className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">Create New GRN</h1>
                            <p className="text-muted-foreground">Record goods received from suppliers</p>
                        </div>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-6 shadow-lg border border-border mb-6"
                    >
                        <h2 className="text-xl font-bold text-foreground mb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Purchase Order Number *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={formData.poNumber}
                                        onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                                        className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        placeholder="PO-2025-XXX"
                                    />
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => startScanner('po')}
                                        className="bg-linear-to-r from-pink-500 to-purple-600 text-white p-2 rounded-lg"
                                    >
                                        <QrCode className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Supplier Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.supplierName}
                                    onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                    placeholder="Enter supplier name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2 items-center gap-2">
                                    <Warehouse className="w-4 h-4" />
                                    Warehouse *
                                </label>
                                <select
                                    required
                                    value={formData.warehouseName}
                                    onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                >
                                    <option value="">Select Warehouse</option>
                                    <option value="Warehouse A">Warehouse A</option>
                                    <option value="Warehouse B">Warehouse B</option>
                                    <option value="Warehouse C">Warehouse C</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2 items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Receive Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.receiveDate}
                                    onChange={(e) => setFormData({ ...formData, receiveDate: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2 items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Received By *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.receivedBy}
                                    onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2 items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Notes
                                </label>
                                <input
                                    type="text"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                    placeholder="Additional notes"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Items Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-6 shadow-lg border border-border mb-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-foreground">Items</h2>
                            <div className="flex gap-2">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => startScanner('item')}
                                    className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <QrCode className="w-4 h-4" />
                                    Scan Item
                                </motion.button>
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAddItemForm(true)}
                                    className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Item
                                </motion.button>
                            </div>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>No items added yet</p>
                                <p className="text-sm">Scan or add items to create the GRN</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-muted rounded-lg p-4 border border-border"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                                            <div className="md:col-span-2">
                                                <p className="text-xs text-muted-foreground mb-1">Item Code</p>
                                                <p className="font-medium text-foreground">{item.itemCode}</p>
                                                <p className="text-sm text-muted-foreground">{item.itemName}</p>
                                            </div>

                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">Ordered</label>
                                                <input
                                                    type="number"
                                                    value={item.orderedQty}
                                                    onChange={(e) => updateItem(item.id, 'orderedQty', toNumberOrZero(e.target.value))}
                                                    className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">Received</label>
                                                <input
                                                    type="number"
                                                    value={item.receivedQty}
                                                    onChange={(e) => updateItem(item.id, 'receivedQty', toNumberOrZero(e.target.value))}
                                                    className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs text-muted-foreground mb-1 block">Unit Price</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.unitPrice}
                                                    onChange={(e) => updateItem(item.id, 'unitPrice', toNumberOrZero(e.target.value))}
                                                    className="w-full bg-background border border-border rounded px-2 py-1 text-sm text-foreground"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                                                    <p className="font-bold text-purple-600 dark:text-purple-400">
                                                        ${(item.receivedQty * item.unitPrice).toFixed(2)}
                                                    </p>
                                                </div>
                                                <motion.button
                                                    type="button"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Total */}
                        {items.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                                <span className="text-lg font-medium text-foreground">Total Value:</span>
                                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    ${calculateTotal().toFixed(2)}
                                </span>
                            </div>
                        )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex gap-4"
                    >
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 bg-secondary text-foreground px-6 py-3 rounded-lg font-medium border border-border"
                            onClick={() => router.push('/purchases/grn')}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={items.length === 0}
                            className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            Create GRN
                        </motion.button>
                    </motion.div>
                </form>
            </div>

            {/* QR Scanner Modal */}
            <AnimatePresence>
                {showScanner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-card rounded-xl p-6 max-w-md w-full"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-foreground">
                                    Scan {scanType === 'po' ? 'Purchase Order' : 'Item'} QR Code
                                </h3>
                                <button onClick={stopScanner} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 border-4 border-pink-500 m-12 pointer-events-none"></div>
                            </div>

                            {!barcodeDetector && (
                                <button
                                    onClick={() => handleScan(scanType === 'po' ? 'PO-2025-SCANNED' : 'ITEM-SCANNED-' + Date.now())}
                                    className="w-full bg-linear-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <Camera className="w-5 h-5" />
                                    Simulate Scan (Demo)
                                </button>
                            )}
                            <p className="text-xs text-muted-foreground text-center mt-2">
                                {barcodeDetector
                                    ? 'Position the QR code within the frame'
                                    : 'BarcodeDetector not supported in this browser. Use the demo scan button.'}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Item Modal */}
            <AnimatePresence>
                {showAddItemForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-card rounded-xl p-6 max-w-lg w-full"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-foreground">Add Item</h3>
                                <button onClick={() => setShowAddItemForm(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Item Code *</label>
                                    <input
                                        type="text"
                                        value={newItem.itemCode ?? ''}
                                        onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground"
                                        placeholder="Enter item code"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Item Name *</label>
                                    <input
                                        type="text"
                                        value={newItem.itemName ?? ''}
                                        onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground"
                                        placeholder="Enter item name"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Ordered Qty</label>
                                        <input
                                            type="number"
                                            value={newItem.orderedQty ?? 0}
                                            onChange={(e) => setNewItem({ ...newItem, orderedQty: toNumberOrZero(e.target.value) })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Received Qty</label>
                                        <input
                                            type="number"
                                            value={newItem.receivedQty ?? 0}
                                            onChange={(e) => setNewItem({ ...newItem, receivedQty: toNumberOrZero(e.target.value) })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Unit Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newItem.unitPrice ?? 0}
                                        onChange={(e) => setNewItem({ ...newItem, unitPrice: toNumberOrZero(e.target.value) })}
                                        className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Remarks</label>
                                    <input
                                        type="text"
                                        value={newItem.remarks ?? ''}
                                        onChange={(e) => setNewItem({ ...newItem, remarks: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground"
                                        placeholder="Optional remarks"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddItemForm(false)}
                                    className="flex-1 bg-secondary text-foreground px-4 py-2 rounded-lg border border-border"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addItem}
                                    className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Add Item
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreateGRNPage;