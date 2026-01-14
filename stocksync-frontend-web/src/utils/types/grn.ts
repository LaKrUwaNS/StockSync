export type GrnStatus = 'RECEIVED' | 'UNDER_INSPECTION' | 'COMPLETED' | 'INCOMPLETE' | 'PENDING';
export type LocationLevel = 'WAREHOUSE' | string;
export type CategoryStatus = 'FINISHED_GOODS' | 'RAW_MATERIALS' | string;

// Shape returned by GET /api/grns (list endpoint)
export interface GrnListItemResponse {
    id: number;
    Poid: number;
    receivedDate: string | null;
    grnNote: string;
    status: GrnStatus | string;
    receivedBy: string | null;
    notes: string | null;
    inspectionLevel: LocationLevel | null;
}

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
    // Backend sometimes returns `ItemName` instead of `itemName`
    itemName?: string | null;
    ItemName?: string | null;
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
    status: GrnStatus;
    // New API format only requires these 3 fields. Keep the below optional for backward compatibility.
    locationLevel?: LocationLevel;
    categoryStatus?: CategoryStatus;
}

export interface GrnKpiResponse {
    totalGrns: number;
    pendingGrns: number;
    // Backend has been seen returning either `incompleteGrns` or `IncompleteGrns`
    incompleteGrns?: number;
    IncompleteGrns?: number;
}
