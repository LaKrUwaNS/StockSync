export type SupplierResponse = {
	supplierId: number;
	supplierName: string;
	phone: string;
	email: string;
	// Backend currently returns both spellings/casing.
	leanTime?: number;
	LeadTime?: number;
	TotalOders?: number;
	TotalSpent?: number;
};

export type SupplierViewModel = {
	supplierId: number;
	supplierName: string;
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
		phone: s.phone,
		email: s.email,
		leadTime: Number(s.LeadTime ?? s.leanTime ?? 0),
		totalOrders: Number(s.TotalOders ?? 0),
		totalSpent: Number(s.TotalSpent ?? 0),
	};
}
