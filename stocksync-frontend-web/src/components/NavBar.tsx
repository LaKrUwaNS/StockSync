"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BarChart3,
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    Package,
    PanelLeftClose,
    PanelLeftOpen,
    Settings,
    ShoppingCart,
    TrendingUp,
    Users,
    Warehouse
} from "lucide-react";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";

import { NavItem } from "../data/navbarTypes";
import {
    hrNavbar,
    adminNavbar,
    stockEmpNavbar,
    stockManagerNavbar,
    financeNavbar
} from "../data/navbarRoles";

/* ---------------- ICON MAP ---------------- */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    dashboard: LayoutDashboard,
    inventory: Package,
    warehouse: Warehouse,
    shopping_cart: ShoppingCart,
    sell: TrendingUp,
    analytics: BarChart3,
    people: Users,
    settings: Settings
};

/* ---------------- ROLE MAP ---------------- */
const roleNavMap: Record<string, NavItem[]> = {
    HR: hrNavbar,
    Admin: adminNavbar,
    StockEmp: stockEmpNavbar,
    StockManager: stockManagerNavbar,
    Finance: financeNavbar
};

export default function NavBar() {
    const pathname = usePathname();
    const router = useRouter();

    const [collapsed, setCollapsed] = useState(() => {
        try {
            const stored = window.localStorage.getItem("stocksync-sidebar-collapsed");
            if (stored === "true" || stored === "false") {
                return stored === "true";
            }
        } catch {
            // ignore
        }
        return false;
    });
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    /* 🔑 Load navbar once */
    const navbarItems = useMemo(() => {
        const role = "Admin";
        return roleNavMap[role] || [];
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem(
                "stocksync-sidebar-collapsed",
                collapsed ? "true" : "false"
            );
        } catch {
            // ignore
        }
    }, [collapsed]);

    /* ---------------- HELPERS ---------------- */

    const isActiveRoute = (route?: string) => route === pathname;

    const isChildActive = (item: NavItem) =>
        item.children?.some(child => child.route === pathname);

    const isGroupExpanded = (item: NavItem) => {
        if (!item.children?.length) return false;
        return (openGroups[item.title] ?? false) || (isChildActive(item) ?? false);
    };

    const toggleGroup = (item: NavItem) => {
        if (!item.children?.length) return;
        setOpenGroups(prev => ({
            ...prev,
            [item.title]: !(prev[item.title] ?? false)
        }));
    };

    const handleParentClick = (item: NavItem) => {
        if (!item.children || item.children.length === 0) return;
        router.push(item.children[0].route);
    };

    /* ---------------- UI ---------------- */

    return (
        <nav
            className={`h-screen bg-sidebar border-r border-sidebar-border flex flex-col ${
                collapsed ? "w-16" : "w-64"
            }`}
        >

            {/* HEADER */}
            <div className="sticky top-0 z-10 p-4 border-b border-sidebar-border bg-sidebar">
                <div className={`flex items-center justify-between ${collapsed ? "flex-col gap-2" : ""}`}>
                    {!collapsed ? (
                        <h1 className="text-2xl text-center font-bold text-sidebar-foreground">StockSync</h1>
                    ) : (
                        <span className="sr-only">StockSync</span>
                    )}

                    <div className={`flex items-center ${collapsed ? "flex-col gap-2" : "gap-2"}`}>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCollapsed(v => !v)}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {collapsed ? (
                                <PanelLeftOpen className="h-[1.2rem] w-[1.2rem]" />
                            ) : (
                                <PanelLeftClose className="h-[1.2rem] w-[1.2rem]" />
                            )}
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </div>

            {/* SCROLLABLE MENU */}
            <div className="flex-1 overflow-y-auto py-4">
                {navbarItems.map((item, index) => {
                    const Icon = iconMap[item.icon];
                    const hasChildren = !!item.children?.length;
                    const expanded = isGroupExpanded(item);

                    return (
                        <div key={index} className="mb-1">

                            {/* ---------- MAIN ITEM ---------- */}
                            {item.route ? (
                                <Link href={item.route}>
                                    <NavButton
                                        active={isActiveRoute(item.route)}
                                        icon={<Icon />}
                                        title={item.title}
                                        collapsed={collapsed}
                                    />
                                </Link>
                            ) : (
                                <div onClick={() => handleParentClick(item)}>
                                    <NavButton
                                        active={expanded}
                                        icon={<Icon />}
                                        title={item.title}
                                        collapsed={collapsed}
                                        rightIcon={
                                            !collapsed ? (
                                                <button
                                                    type="button"
                                                    className="p-1 rounded-md hover:bg-sidebar-accent"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleGroup(item);
                                                    }}
                                                    aria-label={expanded ? `Collapse ${item.title}` : `Expand ${item.title}`}
                                                >
                                                    {expanded ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </button>
                                            ) : undefined
                                        }
                                    />
                                </div>
                            )}

                            {/* ---------- CHILDREN ---------- */}
                            {!collapsed && hasChildren && expanded && (
                                <div className="ml-4 mt-1 space-y-1">
                                    {item.children!.map((child, idx) => (
                                        <Link key={idx} href={child.route}>
                                            <div
                                                className={`mx-2 rounded-lg px-4 py-2.5 pl-12 text-sm transition-all ${
                                                    isActiveRoute(child.route)
                                                        ? "bg-linear-to-r from-indigo-500/25 to-purple-600/25 text-sidebar-foreground border border-primary/30"
                                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                }`}
                                            >
                                                {child.title}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}

/* ---------------- REUSABLE BUTTON ---------------- */

function NavButton({
    active,
    icon,
    title,
    collapsed,
    rightIcon
}: {
    active: boolean;
    icon: React.ReactNode;
    title: string;
    collapsed: boolean;
    rightIcon?: React.ReactNode;
}) {
    return (
        <div
            title={collapsed ? title : undefined}
            className={`mx-2 rounded-lg cursor-pointer transition-all ${
                active
                    ? "bg-linear-to-r from-indigo-500/25 to-purple-600/25 text-sidebar-foreground border border-primary/30"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
        >
            <div className={`flex items-center justify-between py-3 ${collapsed ? "px-2" : "px-4"}`}>
                <div className={`flex items-center ${collapsed ? "justify-center w-full" : "gap-3"}`}>
                    <div className="w-5 h-5">{icon}</div>
                    {!collapsed && <span className="font-medium">{title}</span>}
                </div>
                {!collapsed && rightIcon}
            </div>
        </div>
    );
}
