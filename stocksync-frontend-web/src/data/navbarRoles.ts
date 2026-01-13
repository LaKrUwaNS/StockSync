import { NavItem } from "./navbarTypes";
import { navbarData } from "./NavBarData";

// Role-based navbar filtering
export const hrNavbar: NavItem[] = navbarData.filter(item =>
    ["Dashboard", "User Management", "Reports"].includes(item.title)
);

export const adminNavbar: NavItem[] = navbarData;

export const stockEmpNavbar: NavItem[] = navbarData.filter(item =>
    ["Dashboard", "Inventory", "Warehouses"].includes(item.title)
);

export const stockManagerNavbar: NavItem[] = navbarData.filter(item =>
    ["Dashboard", "Inventory", "Warehouses", "Reports"].includes(item.title)
);

export const financeNavbar: NavItem[] = navbarData.filter(item =>
    ["Dashboard", "Reports", "Sales", "Purchases"].includes(item.title)
);
