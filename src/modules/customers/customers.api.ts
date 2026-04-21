import { apiClient } from "@/modules/auth/auth.api";

type AdminCustomerPhone = {
  number?: string;
  countryCode?: string;
};

export type AdminCustomer = {
  _id: string;
  customerId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: AdminCustomerPhone;
  isActive?: boolean;
  source?: string;
  inquiryFor?: string;
  createdAt?: string;
  isReturning?: boolean;
};

export type GetAdminCustomersData = {
  customers: AdminCustomer[];
  total: number;
  page: number;
  limit: number;
};

export type GetAdminCustomersResponse = {
  success: boolean;
  message: string;
  data: GetAdminCustomersData;
};

export type AdminCustomerProject = {
  _id: string;
  customerId: string;
  buildingType?: string;
  location?: string;
  source?: string;
  quoteValue?: number;
  lifecycleStatus?: string;
  isQuoteReady?: boolean;
  isHandedToSales?: boolean;
  isRaisedToPO?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type GetAdminCustomerDetailData = {
  customer: AdminCustomer;
  totalPaid: number;
  totalPending: number;
  totalInvoices: number;
  projects: AdminCustomerProject[];
  invoices: unknown[];
};

export type GetAdminCustomerDetailResponse = {
  success: boolean;
  message: string;
  data: GetAdminCustomerDetailData;
};

export async function getAdminCustomersProvider(page = 1, limit = 20) {
  const response = await apiClient.get<GetAdminCustomersResponse>(
    "/api/admin/customers",
    {
      params: { page, limit },
    },
  );

  return response.data;
}

export async function getAdminCustomerDetailProvider(customerId: string) {
  const response = await apiClient.get<GetAdminCustomerDetailResponse>(
    `/api/admin/customers/${customerId}`,
  );

  return response.data;
}
