'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Users, Mail, Phone, MapPin, X, Building } from 'lucide-react';

interface Customer {
    customerId: number;
    customerName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    status: 'active' | 'inactive';
    totalOrders: number;
    totalSpent: number;
    createdDate: string;
    logoUrl?: string;
}

const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([
        {
            customerId: 1,
            customerName: 'Tech Solutions Ltd',
            contactPerson: 'John Smith',
            email: 'john@techsolutions.com',
            phone: '+1 (555) 123-4567',
            address: '123 Tech Street',
            city: 'New York',
            country: 'USA',
            status: 'active',
            totalOrders: 45,
            totalSpent: 125000.00,
            createdDate: '2024-01-15'
        },
        {
            customerId: 2,
            customerName: 'Global Retailers',
            contactPerson: 'Sarah Johnson',
            email: 'sarah@globalretail.com',
            phone: '+1 (555) 234-5678',
            address: '456 Market Ave',
            city: 'Los Angeles',
            country: 'USA',
            status: 'active',
            totalOrders: 32,
            totalSpent: 89500.00,
            createdDate: '2024-02-20'
        },
        {
            customerId: 3,
            customerName: 'Office Supplies Co',
            contactPerson: 'Mike Wilson',
            email: 'mike@officesupplies.com',
            phone: '+1 (555) 345-6789',
            address: '789 Business Blvd',
            city: 'Chicago',
            country: 'USA',
            status: 'active',
            totalOrders: 28,
            totalSpent: 67800.00,
            createdDate: '2024-03-10'
        },
        {
            customerId: 4,
            customerName: 'Metro Store Chain',
            contactPerson: 'Emily Davis',
            email: 'emily@metrostores.com',
            phone: '+1 (555) 456-7890',
            address: '321 Commerce Dr',
            city: 'Houston',
            country: 'USA',
            status: 'inactive',
            totalOrders: 15,
            totalSpent: 42300.00,
            createdDate: '2024-04-05'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState({
        customerName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        status: 'active' as 'active' | 'inactive',
        logoUrl: ''
    });

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch =
            customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    };

    const stats = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.status === 'active').length,
        totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
        avgOrderValue: customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)
    };

    const handleSubmit = () => {
        if (editingCustomer) {
            setCustomers(customers.map(c =>
                c.customerId === editingCustomer.customerId
                    ? { ...c, ...formData }
                    : c
            ));
        } else {
            const newCustomer: Customer = {
                customerId: Math.max(...customers.map(c => c.customerId), 0) + 1,
                ...formData,
                totalOrders: 0,
                totalSpent: 0,
                createdDate: new Date().toISOString().split('T')[0]
            };
            setCustomers([...customers, newCustomer]);
        }
        resetForm();
    };

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormData({
            customerName: customer.customerName,
            contactPerson: customer.contactPerson,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            country: customer.country,
            status: customer.status,
            logoUrl: customer.logoUrl || ''
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setCustomers(customers.filter(c => c.customerId !== id));
    };

    const resetForm = () => {
        setFormData({
            customerName: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            country: '',
            status: 'active',
            logoUrl: ''
        });
        setEditingCustomer(null);
        setShowModal(false);
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
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Customers</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Manage customer information and relationships</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Customers</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalCustomers}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Active Customers</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.activeCustomers}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">${stats.totalRevenue.toFixed(2)}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-xl p-4 border border-border shadow-sm"
                    >
                        <p className="text-muted-foreground text-sm mb-1">Avg Order Value</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${stats.avgOrderValue.toFixed(2)}</p>
                    </motion.div>
                </div>

                {/* Search and Actions */}
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
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-pink-500 transition-colors"
                            />
                        </div>

                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-secondary text-foreground border-0 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="All">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowModal(true)}
                                className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Add Customer
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Customers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCustomers.map((customer, index) => (
                            <motion.div
                                key={customer.customerId}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                                            <Building className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground">{customer.customerName}</h3>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(customer.status)}`}>
                                                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        <span>{customer.contactPerson}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <span>{customer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="w-4 h-4" />
                                        <span>{customer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{customer.city}, {customer.country}</span>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-4 mb-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Orders</p>
                                            <p className="text-lg font-bold text-foreground">{customer.totalOrders}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Spent</p>
                                            <p className="text-lg font-bold text-green-600 dark:text-green-400">${customer.totalSpent.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEdit(customer)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDelete(customer.customerId)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredCustomers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border"
                    >
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No customers found</p>
                    </motion.div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={resetForm}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                                </h2>
                                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Customer Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Contact Person *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.contactPerson}
                                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                                            Status *
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-pink-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
                                >
                                    {editingCustomer ? 'Update Customer' : 'Add Customer'}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={resetForm}
                                    className="px-6 py-3 border border-border text-muted-foreground rounded-lg hover:bg-muted transition-all"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomersPage;
