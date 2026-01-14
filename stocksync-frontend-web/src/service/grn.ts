import api from '@/lib/axios';
import type {
	CreateGrnRequest,
	GrnKpiResponse,
	GrnListItemResponse,
	PurchaseOrderResponse,
} from '@/utils/types/grn';

export async function getGrns(): Promise<GrnListItemResponse[]> {
	const res = await api.get<GrnListItemResponse[]>('/api/grns');
	return res.data;
}

export async function getGrnKpi(): Promise<GrnKpiResponse> {
	const res = await api.get<GrnKpiResponse>('/api/grns/kpi');
	return res.data;
}

// Doc says the response is a string message.
export async function createGrn(payload: CreateGrnRequest): Promise<string> {
	const res = await api.post<string>('/api/grns', payload);
	return res.data;
}

export async function getPurchaseOrderById(id: number): Promise<PurchaseOrderResponse> {
	const res = await api.get<PurchaseOrderResponse>(`/api/grns/purchase-orders/${id}`);
	return res.data;
}

