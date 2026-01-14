'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
    const router = useRouter();

    return (
        <div className="max-w-6xl mx-auto mb-6">
            <button
                onClick={() => router.back()}
                className="
                    group
                    inline-flex items-center gap-2
                    rounded-lg
                    border border-border
                    bg-background
                    px-4 py-2
                    text-sm font-medium
                    text-muted-foreground
                    shadow-sm
                    transition-all duration-300 ease-out
                    hover:-translate-x-1
                    hover:border-primary/40
                    hover:bg-primary/5
                    hover:text-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/40
                "
            >
                <span
                    className="
                        transition-transform duration-300 ease-out
                        group-hover:-translate-x-1
                    "
                >
                    ←
                </span>
                Back
            </button>
        </div>
    );
};

export default BackButton;
