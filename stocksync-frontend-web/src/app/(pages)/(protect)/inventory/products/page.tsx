'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Filter, Package, X, AlertTriangle } from 'lucide-react';

interface Category {
    categoryId: number;
    name: string;
}

interface Supplier {
    supplierId: number;
    name: string;
}

interface Product {
    productId: number;
    sku: string;
    name: string;
    description: string;
    category: Category;
    supplier: Supplier;
    price: number;
    unit: string;
    reorderLevel: number;
    currentStock: number; // This would come from inventory data
    warehouse: string; // This would come from inventory data
    imageUrl?: string;
}

const StockInventoryPage: React.FC = () => {
    // Sample categories
    const categories: Category[] = [
        { categoryId: 1, name: 'Electronics' },
        { categoryId: 2, name: 'Accessories' },
        { categoryId: 3, name: 'Furniture' },
        { categoryId: 4, name: 'Office Supplies' },
    ];

    // Sample suppliers
    const suppliers: Supplier[] = [
        { supplierId: 1, name: 'Tech Corp' },
        { supplierId: 2, name: 'Global Supplies' },
        { supplierId: 3, name: 'Office Depot Inc' },
    ];

    const [products, setProducts] = useState<Product[]>([
        {
            productId: 1,
            sku: 'LAP-001',
            name: 'Laptop Pro 15"',
            description: 'High-performance laptop with 16GB RAM',
            category: categories[0],
            supplier: suppliers[0],
            price: 1299.99,
            unit: 'pcs',
            reorderLevel: 20,
            currentStock: 45,
            warehouse: 'Warehouse A',
            imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
        },
        {
            productId: 2,
            sku: 'MOU-002',
            name: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse with USB receiver',
            category: categories[1],
            supplier: suppliers[1],
            price: 29.99,
            unit: 'pcs',
            reorderLevel: 50,
            currentStock: 120,
            warehouse: 'Warehouse B'
        },
        {
            productId: 3,
            sku: 'CAB-003',
            name: 'USB-C Cable',
            description: '2m USB-C to USB-C cable, fast charging',
            category: categories[1],
            supplier: suppliers[1],
            price: 15.99,
            unit: 'pcs',
            reorderLevel: 100,
            currentStock: 300,
            warehouse: 'Warehouse A'
        },
        {
            productId: 4,
            sku: 'MON-004',
            name: 'Monitor 27"',
            description: '4K UHD monitor with HDR support',
            category: categories[0],
            supplier: suppliers[0],
            price: 399.99,
            unit: 'pcs',
            reorderLevel: 15,
            currentStock: 18,
            warehouse: 'Warehouse C'
        },
        {
            productId: 5,
            sku: 'KEY-005',
            name: 'Keyboard Mechanical',
            description: 'RGB mechanical keyboard with cherry switches',
            category: categories[1],
            supplier: suppliers[0],
            price: 89.99,
            unit: 'pcs',
            reorderLevel: 30,
            currentStock: 75,
            warehouse: 'Warehouse B'
        },
        {
            productId: 6,
            sku: 'WEB-006',
            name: 'Webcam HD',
            description: '1080p webcam with built-in microphone',
            category: categories[0],
            supplier: suppliers[1],
            price: 79.99,
            unit: 'pcs',
            reorderLevel: 25,
            currentStock: 60,
            warehouse: 'Warehouse A'
        },
        {
            productId: 7,
            sku: 'LAM-007',
            name: 'Desk Lamp LED',
            description: 'Adjustable LED desk lamp with touch control',
            category: categories[2],
            supplier: suppliers[2],
            price: 45.99,
            unit: 'pcs',
            reorderLevel: 40,
            currentStock: 95,
            warehouse: 'Warehouse C'
        },
        {
            productId: 8,
            sku: 'CHA-008',
            name: 'Office Chair',
            description: 'Ergonomic office chair with lumbar support',
            category: categories[2],
            supplier: suppliers[2],
            price: 249.99,
            unit: 'pcs',
            reorderLevel: 10,
            currentStock: 8,
            warehouse: 'Warehouse B'
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSupplier, setSelectedSupplier] = useState('All');
    const [selectedWarehouse, setSelectedWarehouse] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        description: '',
        categoryId: 0,
        supplierId: 0,
        price: 0,
        unit: 'pcs',
        reorderLevel: 0,
        currentStock: 0,
        warehouse: '',
        imageUrl: ''
    });

    const warehouses = ['All', ...Array.from(new Set(products.map(p => p.warehouse)))];

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category.name === selectedCategory;
        const matchesSupplier = selectedSupplier === 'All' || product.supplier.name === selectedSupplier;
        const matchesWarehouse = selectedWarehouse === 'All' || product.warehouse === selectedWarehouse;
        return matchesSearch && matchesCategory && matchesSupplier && matchesWarehouse;
    });

    const handleAddProduct = () => {
        if (formData.sku && formData.name && formData.categoryId && formData.supplierId && formData.warehouse) {
            const category = categories.find(c => c.categoryId === formData.categoryId);
            const supplier = suppliers.find(s => s.supplierId === formData.supplierId);

            if (category && supplier) {
                const newProduct: Product = {
                    productId: Math.max(...products.map(p => p.productId), 0) + 1,
                    sku: formData.sku,
                    name: formData.name,
                    description: formData.description,
                    category,
                    supplier,
                    price: formData.price,
                    unit: formData.unit,
                    reorderLevel: formData.reorderLevel,
                    currentStock: formData.currentStock,
                    warehouse: formData.warehouse
                };
                setProducts([...products, newProduct]);
                setShowAddModal(false);
                resetForm();
            }
        }
    };

    const handleEditProduct = () => {
        if (editingProduct && formData.sku && formData.name && formData.categoryId && formData.supplierId && formData.warehouse) {
            const category = categories.find(c => c.categoryId === formData.categoryId);
            const supplier = suppliers.find(s => s.supplierId === formData.supplierId);

            if (category && supplier) {
                setProducts(products.map(p =>
                    p.productId === editingProduct.productId ? {
                        ...p,
                        sku: formData.sku,
                        name: formData.name,
                        description: formData.description,
                        category,
                        supplier,
                        price: formData.price,
                        unit: formData.unit,
                        reorderLevel: formData.reorderLevel,
                        currentStock: formData.currentStock,
                        warehouse: formData.warehouse
                    } : p
                ));
                setEditingProduct(null);
                resetForm();
                setShowAddModal(false);
            }
        }
    };

    const handleDeleteProduct = (id: number) => {
        setProducts(products.filter(p => p.productId !== id));
        setSelectedProducts(selectedProducts.filter(pid => pid !== id));
    };

    const handleBulkDelete = () => {
        setProducts(products.filter(p => !selectedProducts.includes(p.productId)));
        setSelectedProducts([]);
    };

    const resetForm = () => {
        setFormData({
            sku: '',
            name: '',
            description: '',
            categoryId: 0,
            supplierId: 0,
            price: 0,
            unit: 'pcs',
            reorderLevel: 0,
            currentStock: 0,
            warehouse: '',
            imageUrl: ''
        });
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            sku: product.sku,
            name: product.name,
            description: product.description,
            categoryId: product.category.categoryId,
            supplierId: product.supplier.supplierId,
            price: product.price,
            unit: product.unit,
            reorderLevel: product.reorderLevel,
            currentStock: product.currentStock,
            warehouse: product.warehouse,
            imageUrl: product.imageUrl || ''
        });
        setShowAddModal(true);
    };

    const toggleProductSelection = (id: number) => {
        setSelectedProducts(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const isLowStock = (product: Product) => product.currentStock <= product.reorderLevel;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
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
                    <p className="text-muted-foreground ml-16">Manage your product inventory and warehouse stock</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Products</p>
                        <p className="text-3xl font-bold text-foreground">{products.length}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Low Stock Items</p>
                        <p className="text-3xl font-bold text-red-500 dark:text-red-400">
                            {products.filter(p => isLowStock(p)).length}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Value</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                            ${products.reduce((sum, p) => sum + (p.price * p.currentStock), 0).toFixed(2)}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Categories</p>
                        <p className="text-3xl font-bold text-foreground">{categories.length}</p>
                    </motion.div>
                </div>

                {/* Search and Actions Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card rounded-xl p-4 mb-6 shadow-lg border border-border"
                >
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex-1 min-w-[250px] relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, SKU, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowFilters(!showFilters)}
                                className="bg-secondary hover:bg-secondary/80 text-foreground px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Filter className="w-5 h-5" />
                                Filters
                            </motion.button>

                            {selectedProducts.length > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleBulkDelete}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete ({selectedProducts.length})
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                        setEditingProduct(null);
                                        resetForm();
                                        setShowAddModal(true);
                                    }}
                                    className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </motion.button>
                        </div>
                    </div>

                    {/* Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Category</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        >
                                            <option value="All">All Categories</option>
                                            {categories.map(cat => (
                                                <option key={cat.categoryId} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Supplier</label>
                                        <select
                                            value={selectedSupplier}
                                            onChange={(e) => setSelectedSupplier(e.target.value)}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        >
                                            <option value="All">All Suppliers</option>
                                            {suppliers.map(sup => (
                                                <option key={sup.supplierId} value={sup.name}>{sup.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Warehouse</label>
                                        <select
                                            value={selectedWarehouse}
                                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        >
                                            {warehouses.map(wh => (
                                                <option key={wh} value={wh}>{wh}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Products Table */}
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
                                    <th className="px-6 py-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts(filteredProducts.map(p => p.productId));
                                                } else {
                                                    setSelectedProducts([]);
                                                }
                                            }}
                                            className="w-4 h-4 accent-pink-500"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Supplier</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Stock</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Warehouse</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredProducts.map((product, index) => (
                                        <motion.tr
                                            key={product.productId}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`border-t border-border hover:bg-muted/50 transition-colors ${isLowStock(product) ? 'bg-red-50 dark:bg-red-900/10' : ''
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product.productId)}
                                                    onChange={() => toggleProductSelection(product.productId)}
                                                    className="w-4 h-4 accent-pink-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm text-muted-foreground">{product.sku}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                                                        {product.imageUrl ? (
                                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                                <Package className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{product.name}</p>
                                                        <p className="text-sm text-muted-foreground truncate max-w-xs">{product.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-secondary text-foreground px-3 py-1 rounded-full text-sm">
                                                    {product.category.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{product.supplier.name}</td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-green-600 dark:text-green-400">${product.price.toFixed(2)}</span>
                                                <span className="text-muted-foreground text-sm">/{product.unit}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-semibold ${isLowStock(product) ? 'text-red-600 dark:text-red-400' :
                                                            product.currentStock < product.reorderLevel * 2 ? 'text-yellow-600 dark:text-yellow-400' :
                                                                'text-green-600 dark:text-green-400'
                                                        }`}>
                                                        {product.currentStock}
                                                    </span>
                                                    {isLowStock(product) && (
                                                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Reorder: {product.reorderLevel}</p>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{product.warehouse}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => openEditModal(product)}
                                                        className="p-2 bg-secondary hover:bg-linear-to-r hover:from-pink-500 hover:to-purple-600 rounded-lg transition-all text-muted-foreground hover:text-white"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleDeleteProduct(product.productId)}
                                                        className="p-2 bg-secondary hover:bg-red-600 rounded-lg transition-all text-muted-foreground hover:text-white"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>No products found</p>
                        </div>
                    )}
                </motion.div>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showAddModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            onClick={() => {
                                setShowAddModal(false);
                                setEditingProduct(null);
                                resetForm();
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                className="bg-card rounded-xl p-6 w-full max-w-2xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingProduct(null);
                                            resetForm();
                                        }}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-sm text-muted-foreground mb-2 block">Product Image URL</label>
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        {formData.imageUrl && (
                                            <div className="mt-2">
                                                <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-border" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">SKU *</label>
                                        <input
                                            type="text"
                                            value={formData.sku}
                                            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                            placeholder="e.g., LAP-001"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Product Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm text-muted-foreground mb-2 block">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500 resize-none"
                                            placeholder="Enter product description"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Category *</label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                        >
                                            <option value={0}>Select category</option>
                                            {categories.map(cat => (
                                                <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Supplier *</label>
                                        <select
                                            value={formData.supplierId}
                                            onChange={(e) => setFormData({ ...formData, supplierId: parseInt(e.target.value) })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                        >
                                            <option value={0}>Select supplier</option>
                                            {suppliers.map(sup => (
                                                <option key={sup.supplierId} value={sup.supplierId}>{sup.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Price *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Unit *</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                        >
                                            <option value="pcs">Pieces (pcs)</option>
                                            <option value="kg">Kilogram (kg)</option>
                                            <option value="g">Gram (g)</option>
                                            <option value="l">Liter (l)</option>
                                            <option value="ml">Milliliter (ml)</option>
                                            <option value="box">Box</option>
                                            <option value="pack">Pack</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Current Stock *</label>
                                        <input
                                            type="number"
                                            value={formData.currentStock}
                                            onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Reorder Level *</label>
                                        <input
                                            type="number"
                                            value={formData.reorderLevel}
                                            onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="text-sm text-muted-foreground mb-2 block">Warehouse *</label>
                                        <input
                                            type="text"
                                            value={formData.warehouse}
                                            onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                            placeholder="e.g., Warehouse A"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingProduct(null);
                                            resetForm();
                                        }}
                                        className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-3 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={editingProduct ? handleEditProduct : handleAddProduct}
                                        className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                                    >
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StockInventoryPage;