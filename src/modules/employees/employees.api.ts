import { apiClient } from "@/modules/auth/auth.api";

export type AdminEmployeeApiItem = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  assignedLeadCount?: number;
};

export type AdminEmployeesData = {
  employees: AdminEmployeeApiItem[];
  total: number;
};

export type AdminEmployeesResponse = {
  success: boolean;
  message: string;
  data: AdminEmployeesData;
};

export async function getAdminEmployeesProvider() {
  const response = await apiClient.get<AdminEmployeesResponse>(
    "/api/admin/employees",
  );

  return response.data;
}
