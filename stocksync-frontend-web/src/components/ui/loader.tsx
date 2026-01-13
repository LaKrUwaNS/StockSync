"use client";
import React from "react";

type LoaderProps = {
    label?: string;
    className?: string;
    size?: number; // pixel size for spinner diameter
};

export default function Loader({ label = "Loading…", className = "", size = 48 }: LoaderProps) {
    const spinnerStyle: React.CSSProperties = {
        width: size,
        height: size,
    };

    return (
        <div className={`flex h-screen items-center justify-center bg-background ${className}`}>
            <div className="flex flex-col items-center gap-4" role="status" aria-live="polite">
                <div
                    style={spinnerStyle}
                    className="rounded-full border-4 border-muted border-t-primary animate-spin"
                />
                <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
            </div>
        </div>
    );
}
