"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldAlert, Lock, Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage(): React.ReactElement {

    const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 12 }
        }
    };

    const shieldVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: { type: 'spring', stiffness: 200, damping: 15 }
        }
    };

    const pulseVariants = {
        initial: { scale: 1, opacity: 0.5 },
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: EASE_IN_OUT
            }
        }
    };

    const floatingVariants = {
        initial: { y: 0 },
        animate: {
            y: [-15, 15, -15],
            transition: {
                duration: 5,
                repeat: Infinity,
                ease: EASE_IN_OUT
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center transition-colors duration-500 bg-background">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute top-20 left-10 w-96 h-96 bg-linear-to-r from-pink-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"
                />
                <motion.div
                    variants={floatingVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 2.5 }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-linear-to-r from-purple-600 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"
                />
            </div>
            {/* Main Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative w-full max-w-2xl mx-4 px-6 py-12 text-center"
            >
                {/* Shield Icon with Pulse Effect */}
                <motion.div variants={itemVariants} className="relative inline-block mb-8">
                    {/* Pulse Rings */}
                    <motion.div
                        variants={pulseVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-40 h-40 rounded-full bg-linear-to-r from-pink-500 to-purple-600"></div>
                    </motion.div>
                    <motion.div
                        variants={pulseVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-32 h-32 rounded-full bg-linear-to-r from-pink-500 to-purple-600"></div>
                    </motion.div>

                    {/* Shield Icon */}
                    <motion.div
                        variants={shieldVariants}
                        className="relative w-32 h-32 rounded-full flex items-center justify-center bg-card shadow-2xl"
                    >
                        <ShieldAlert className="w-16 h-16 text-pink-500" />
                    </motion.div>
                </motion.div>

                {/* Error Code */}
                <motion.div
                    variants={itemVariants}
                    className="mb-4"
                >
                    <motion.h1
                        className="text-8xl font-bold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
                    >
                        403
                    </motion.h1>
                </motion.div>

                {/* Main Heading */}
                <motion.div variants={itemVariants} className="mb-6">
                    <h2 className="text-4xl font-bold mb-3 text-foreground">Access Denied</h2>
                    <p className="text-lg text-muted-foreground">You don&apos;t have permission to access this resource</p>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    variants={itemVariants}
                    className="max-w-lg mx-auto mb-8 p-6 rounded-xl bg-card shadow-lg border border-border"
                >
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-6 h-6 mt-1 shrink-0 text-purple-600" />
                        <div className="text-left">
                            <h3 className="font-semibold mb-2 text-card-foreground">Why am I seeing this?</h3>
                            <ul className="text-sm space-y-2 text-muted-foreground">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>You don&apos;t have the required permissions</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Your session may have expired</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>This content is restricted to authorized users only</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link href="/" className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-white bg-linear-to-r from-pink-500 to-purple-600 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        Home
                    </Link>

                    <Link href="/" className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 bg-card text-foreground hover:bg-accent shadow-lg border border-border">
                        <Home className="w-5 h-5" />
                        Home Page
                    </Link>
                </motion.div>

                {/* Contact Support */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12 text-sm text-muted-foreground"
                >
                    Need access?{' '}
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        href="#"
                        className="bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-medium"
                    >
                        Contact support
                    </motion.a>
                    {' '}or{' '}
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        href="#"
                        className="bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-medium"
                    >
                        request permissions
                    </motion.a>
                </motion.div>

                {/* Lock Decoration */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.1, y: 0 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-none"
                >
                    <Lock className="w-32 h-32 text-foreground" />
                </motion.div>
            </motion.div>
        </div>
    );
}