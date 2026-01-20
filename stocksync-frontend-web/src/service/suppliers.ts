import api from '@/lib/axios';
import type {
	CreateSupplierRequest,
	SupplierKpiResponse,
	SupplierResponse,
	UpdateSupplierRequest,
} from '@/utils/types/supplier';

export async function getSuppliers(): Promise<SupplierResponse[]> {
	const res = await api.get<SupplierResponse[]>('/api/suppliers');
	return res.data;
}

export async function getSuppliersKpi(): Promise<SupplierKpiResponse> {
	const res = await api.get<unknown>('/api/suppliers/kpi');
	const raw: unknown = res.data;

	const asRecord = (v: unknown): Record<string, unknown> | null => {
		if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
		return null;
	};

	const pickContainer = (v: unknown): Record<string, unknown> | null => {
		if (Array.isArray(v)) return asRecord(v[0]);
		const rec = asRecord(v);
		if (!rec) return null;
		return asRecord(rec.data) ?? asRecord(rec.kpi) ?? rec;
	};

	const toNumber = (v: unknown): number => {
		const n = typeof v === 'number' ? v : Number(v);
		return Number.isFinite(n) ? n : 0;
	};

	const obj = pickContainer(raw);

	return {
		onTimeDeliveryRate: toNumber(
			obj?.onTimeDeliveryRate ??
			obj?.OnTimeDeliveryRate ??
			obj?.on_time_delivery_rate
		),
		totalStock: toNumber(
			obj?.totalStock ??
			obj?.TotalStock ??
			obj?.total_stock
		),
		totalSuppliers: toNumber(
			obj?.totalSuppliers ??
			obj?.TotalSuppliers ??
			obj?.total_suppliers
		),
		totalSpent: toNumber(
			obj?.totalSpent ??
			obj?.TotalSpent ??
			obj?.total_spent
		),
	};
}

export async function createSupplier(payload: CreateSupplierRequest): Promise<void> {
	await api.post('/api/suppliers/create', payload);
}

export async function updateSupplier(payload: UpdateSupplierRequest): Promise<void> {
	await api.put('/api/suppliers', payload);
}

export async function deleteSupplier(supplierId: number): Promise<void> {
	await api.delete(`/api/suppliers/${supplierId}`);
}
