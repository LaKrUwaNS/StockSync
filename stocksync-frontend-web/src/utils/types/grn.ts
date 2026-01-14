export type GrnStatus = 'RECEIVED' | 'PENDING' | 'INCOMPLETE' | 'COMPLETED';
export type LocationLevel = 'WAREHOUSE' | string;
export type CategoryStatus = 'FINISHED_GOODS' | string;

export interface SupplierResponse {
    supplierId: number;
    supplierName: string;
    contactInfo: string;
    phone: string;
    email: string;
    leanTime: number;
}

export interface WarehouseResponse {
    warehouseId: number;
    warehouseName: string;
    location: string;
    capacity: number;
    status: string;
}

export interface PurchaseOrderCreatedByRoleResponse {
    id: unknown;
    user: string;
    role: {
        roleId: number;
        roleName: string;
    };
    assignedDate: string;
}

export interface PurchaseOrderCreatedByResponse {
    userId: number;
    username: string;
    email: string;
    password: string;
    status: string;
    roles: PurchaseOrderCreatedByRoleResponse[];
}

export interface PurchaseOrderResponse {
    poId: number;
    orderDate: string;
    expectedDeliveryDate: string;
    status: string;
    totalAmount: number;
    supplier: SupplierResponse | null;
    createdBy: PurchaseOrderCreatedByResponse | null;
    warehouse: WarehouseResponse | null;
    itemName: string;
}

export interface GrnResponse {
    id: number;
    receivedDate: string;
    status: GrnStatus;
    inspectionLevel: LocationLevel;
    purchaseOrder: PurchaseOrderResponse | null;
    grnNote: string;
}

export interface CreateGrnRequest {
    poId: number;
    grnNote: string;
    locationLevel: LocationLevel;
    status: GrnStatus;
    categoryStatus: CategoryStatus;
}

export interface GrnKpiResponse {
    totalGrns: number;
    pendingGrns: number;
    incompleteGrns: number;
}
