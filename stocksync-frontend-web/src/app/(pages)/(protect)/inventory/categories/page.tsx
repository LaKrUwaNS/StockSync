'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Folder, X, Package } from 'lucide-react';

interface Category {
    categoryId: number;
    categoryName: string;
    description: string;
    productCount: number;
    createdDate: string;
    status: 'active' | 'inactive';
}

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([
        {
            categoryId: 1,
            categoryName: 'Electronics',
            description: 'Electronic devices and gadgets',
            productCount: 45,
            createdDate: '2025-01-15',
            status: 'active'
        },
        {
            categoryId: 2,
            categoryName: 'Accessories',
            description: 'Computer and office accessories',
            productCount: 32,
            createdDate: '2025-01-16',
            status: 'active'
        },
        {
            categoryId: 3,
            categoryName: 'Furniture',
            description: 'Office furniture and equipment',
            productCount: 18,
            createdDate: '2025-01-17',
            status: 'active'
        },
        {
            categoryId: 4,
            categoryName: 'Stationery',
            description: 'Office supplies and stationery items',
            productCount: 56,
            createdDate: '2025-01-18',
            status: 'active'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        categoryName: '',
        description: '',
        status: 'active' as 'active' | 'inactive'
    });

    const filteredCategories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = () => {
        if (editingCategory) {
            setCategories(categories.map(c =>
                c.categoryId === editingCategory.categoryId
                    ? { ...c, ...formData }
                    : c
            ));
        } else {
            const newCategory: Category = {
                categoryId: Math.max(...categories.map(c => c.categoryId), 0) + 1,
                ...formData,
                productCount: 0,
                createdDate: new Date().toISOString().split('T')[0]
            };
            setCategories([...categories, newCategory]);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            categoryName: '',
            description: '',
            status: 'active'
        });
        setEditingCategory(null);
        setShowAddModal(false);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            categoryName: category.categoryName,
            description: category.description,
            status: category.status
        });
        setShowAddModal(true);
    };

    const handleDelete = (id: number) => {
        setCategories(categories.filter(c => c.categoryId !== id));
    };

    const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Folder className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Product Categories</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Organize products into categories</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Categories</p>
                        <p className="text-3xl font-bold text-foreground">{categories.length}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Products</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalProducts}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Active Categories</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {categories.filter(c => c.status === 'active').length}
                        </p>
                    </motion.div>
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card rounded-xl p-4 mb-6 shadow-lg border border-border"
                >
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-500"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setEditingCategory(null);
                                resetForm();
                                setShowAddModal(true);
                            }}
                            className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Add Category
                        </motion.button>
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCategories.map((category, index) => (
                            <motion.div
                                key={category.categoryId}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                                            <Folder className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">
                                                {category.categoryName}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                category.status === 'active'
                                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                            }`}>
                                                {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => openEditModal(category)}
                                            className="p-2 bg-muted hover:bg-pink-500 hover:text-white rounded-lg transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDelete(category.categoryId)}
                                            className="p-2 bg-muted hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                <p className="text-muted-foreground text-sm mb-4">
                                    {category.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Package className="w-4 h-4" />
                                        <span className="text-sm">{category.productCount} Products</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Created {new Date(category.createdDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showAddModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center p-4 z-50"
                            onClick={resetForm}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl border border-border"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                                    </h2>
                                    <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Category Name *</label>
                                        <input
                                            type="text"
                                            value={formData.categoryName}
                                            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                            placeholder="e.g., Electronics"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Description *</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500 resize-none"
                                            placeholder="Category description..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-pink-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={resetForm}
                                        className="flex-1 bg-secondary hover:bg-muted text-foreground px-4 py-3 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmit}
                                        className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium"
                                    >
                                        {editingCategory ? 'Update Category' : 'Add Category'}
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

export default CategoriesPage;
