import { apiClient } from "@/modules/auth/auth.api";

export type LeadStatsData = {
  totalLeads: number;
  confirmedLeads: number;
  pipelineValue: number;
  monthlyRevenue: number;
  unreadMessages: number;
};

export type LeadStatsResponse = {
  success: boolean;
  message: string;
  data: LeadStatsData;
};

export async function getLeadStatsProvider() {
  const response = await apiClient.get<LeadStatsResponse>(
    "/api/admin/dashboard/lead-stats",
  );

  return response.data;
}
