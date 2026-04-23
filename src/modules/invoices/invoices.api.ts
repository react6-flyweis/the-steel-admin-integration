import { apiClient } from "@/modules/auth/auth.api";

export type CreateInvoiceLineItemPayload = {
  images: string[];
  items: string[];
  rate: number;
  markup: number;
  quantity: number;
  tax: number;
  total: number;
};

export type CreateInvoicePayload = {
  leadId: string;
  quotationId: string;
  date: string;
  daysToPay: number;
  lineItems: CreateInvoiceLineItemPayload[];
  subtotal: number;
  markupTotal: number;
  discount: number;
  depositAmount: number;
  totalAmount: number;
};

export type CreateInvoiceResponse = {
  success: boolean;
  message: string;
  data: unknown;
};

export async function createInvoiceProvider(payload: CreateInvoicePayload) {
  const response = await apiClient.post<CreateInvoiceResponse>(
    "/api/invoices",
    payload,
  );

  return response.data;
}
