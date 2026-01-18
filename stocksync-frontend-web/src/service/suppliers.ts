import api from '@/lib/axios';
import type { SupplierResponse } from '@/utils/types/supplier';

export async function getSuppliers(): Promise<SupplierResponse[]> {
	const res = await api.get<SupplierResponse[]>('/api/suppliers');
	return res.data;
}
