export type SupplierResponse = {
	supplierId: number;
	supplierName: string;
	contactInfo?: string;
	phone: string;
	email: string;
	// Backend currently returns both spellings/casing.
	leanTime?: number;
	LeadTime?: number;
	TotalOders?: number;
	TotalSpent?: number;
};

export type SupplierKpiResponse = {
	onTimeDeliveryRate: number;
	totalStock: number;
	totalSuppliers: number;
	totalSpent: number;
};

export type CreateSupplierRequest = {
	supplierName: string;
	contactInfo: string;
	phone: string;
	email: string;
};

export type UpdateSupplierRequest = {
	supplierId: number;
	supplierName: string;
	contactInfo: string;
	phone: string;
	email: string;
	leanTime: number;
};

export type SupplierViewModel = {
	supplierId: number;
	supplierName: string;
	contactInfo: string;
	phone: string;
	email: string;
	leadTime: number;
	totalOrders: number;
	totalSpent: number;
};

export function toSupplierViewModel(s: SupplierResponse): SupplierViewModel {
	return {
		supplierId: s.supplierId,
		supplierName: s.supplierName,
		contactInfo: s.contactInfo ?? '',
		phone: s.phone,
		email: s.email,
		leadTime: Number(s.LeadTime ?? s.leanTime ?? 0),
		totalOrders: Number(s.TotalOders ?? 0),
		totalSpent: Number(s.TotalSpent ?? 0),
	};
}
