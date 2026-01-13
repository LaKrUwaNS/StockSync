import { LayoutDashboard, Package, Warehouse, ShoppingCart, TrendingUp, BarChart3, Users, Settings } from "lucide-react";

export type NavItemChild = {
    title: string;
    route: string;
};

export type NavItem = {
    title: string;
    icon: "dashboard" | "inventory" | "warehouse" | "shopping_cart" | "sell" | "analytics" | "people" | "settings";
    route?: string;
    children?: NavItemChild[];
};
