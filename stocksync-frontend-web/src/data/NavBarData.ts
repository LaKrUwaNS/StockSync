import { NavItem } from "./navbarTypes";

export const navbarData: NavItem[] = [
    { title: "Dashboard", icon: "dashboard", route: "/dashboard" },
    {
        title: "Purchases",
        icon: "shopping_cart",
        children: [
            { title: "Purchase Orders", route: "/purchases/orders" },
            { title: "Goods Received (GRN)", route: "/purchases/grn" },
            { title: "Suppliers", route: "/purchases/suppliers" },
        ]
    },
    {
        title: "Warehouses",
        icon: "warehouse",
        children: [
            { title: "Locations / Bins", route: "/warehouses/locations" },
            { title: "All Warehouses", route: "/warehouses" },
            { title: "Transfer Stock", route: "/warehouses/transfer" }
        ]
    },
    {
        title: "Inventory",
        icon: "inventory",
        children: [
            { title: "Stock Levels", route: "/inventory/stock" },
            { title: "Stock Movement", route: "/inventory/movements" },
            { title: "Stock Adjustments", route: "/inventory/adjustments" },
            { title: "Products", route: "/inventory/products" },
            { title: "Categories", route: "/inventory/categories" }
        ]
    },
    {
        title: "Sales",
        icon: "sell",
        children: [
            { title: "Customers", route: "/sales/customers" },
            { title: "Sales Orders", route: "/sales/orders" },
            { title: "Deliveries", route: "/sales/deliveries" }
        ]
    },
    {
        title: "Reports",
        icon: "analytics",
        children: [
            { title: "Stock Reports", route: "/reports/stock" },
            { title: "Purchase Reports", route: "/reports/purchases" },
            { title: "Sales Reports", route: "/reports/sales" },
            { title: "Product Performance", route: "/reports/performance" },
            { title: "Financial Reports", route: "/reports/finance" }
        ]
    },
    {
        title: "User Management",
        icon: "people",
        children: [
            { title: "Users", route: "/users" },
            { title: "Roles & Permissions", route: "/users/roles" },
            { title: "Activity Logs", route: "/users/logs" }
        ]
    },
    {
        title: "Settings",
        icon: "settings",
        children: [
            { title: "System Settings", route: "/settings/system" },
            { title: "Notifications", route: "/settings/notifications" },
            { title: "Backup & Restore", route: "/settings/backup" }
        ]
    }
];
