"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/*
Sample usage template:

1) Wrap your app (e.g. in `src/app/layout.tsx`):

     import { ToastProvider } from '@/components/TosterAlerts';

     export default function RootLayout({ children }: { children: React.ReactNode }) {
         return (
             <html lang="en">
                 <body>
                     <ToastProvider>{children}</ToastProvider>
                 </body>
             </html>
         );
     }

2) Call from a client component:

     'use client';
     import React from 'react';
     import { useToast } from '@/components/TosterAlerts';

     export default function MyButton() {
         const toast = useToast();
         return (
             <button onClick={() => toast.success('Saved', 'Your changes were saved')}>Save</button>
         );
     }

You can also call `toast.error`, `toast.warning`, `toast.info`.
*/

// Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type Toast = {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number; // ms
};

type ToastContextType = {
    success: (title: string, description?: string, duration?: number) => void;
    error: (title: string, description?: string, duration?: number) => void;
    warning: (title: string, description?: string, duration?: number) => void;
    info: (title: string, description?: string, duration?: number) => void;
    removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Helper to generate simple ids
const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const push = (toast: Omit<Toast, 'id'>) => {
        const id = genId();
        setToasts((s) => [...s, { id, ...toast }]);
    };

    const success = (title: string, description?: string, duration = 5000) => push({ type: 'success', title, description, duration });
    const error = (title: string, description?: string, duration = 5000) => push({ type: 'error', title, description, duration });
    const warning = (title: string, description?: string, duration = 5000) => push({ type: 'warning', title, description, duration });
    const info = (title: string, description?: string, duration = 5000) => push({ type: 'info', title, description, duration });

    const removeToast = (id: string) => {
        setToasts((s) => s.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ success, error, warning, info, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
            <AnimatePresence initial={false}>
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onClose={() => onRemove(t.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

const iconFor = (type: ToastType) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="w-5 h-5" />;
        case 'error':
            return <XCircle className="w-5 h-5" />;
        case 'warning':
            return <AlertTriangle className="w-5 h-5" />;
        default:
            return <Info className="w-5 h-5" />;
    }
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast.duration) return;
        const id = setTimeout(onClose, toast.duration);
        return () => clearTimeout(id);
    }, [toast.duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="w-80 max-w-xs rounded-lg shadow-lg overflow-hidden bg-card border border-border"
        >
            <div className="p-3 flex items-start gap-3">
                <div className="text-blue-500">{iconFor(toast.type)}</div>
                <div className="flex-1">
                    <div className="font-semibold text-sm text-card-foreground">{toast.title}</div>
                    {toast.description && <div className="text-xs text-muted-foreground mt-1">{toast.description}</div>}
                </div>
                <button onClick={onClose} className="ml-2 p-1 rounded-full text-muted-foreground hover:bg-accent">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};