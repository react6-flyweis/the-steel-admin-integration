import { apiClient } from "@/modules/auth/auth.api";

export type FollowUpStatsData = {
  total: number;
  upcoming: number;
  completed: number;
  overdue: number;
};

export type FollowUpStatsResponse = {
  success: boolean;
  message: string;
  data: FollowUpStatsData;
};

export type UpcomingFollowUpApiItem = {
  _id: string;
  followUpDate: string;
  notes?: string;
  priority?: string;
  status?: string;
  customerId?: {
    firstName?: string;
  } | null;
  leadId?: {
    buildingType?: string;
    location?: string;
  } | null;
};

export type UpcomingFollowUpsResponse = {
  success: boolean;
  message: string;
  data: {
    followups: UpcomingFollowUpApiItem[];
  };
};

export async function getFollowUpStatsProvider() {
  const response = await apiClient.get<FollowUpStatsResponse>(
    "/api/admin/followups/stats",
  );

  return response.data;
}

export async function getUpcomingFollowUpsProvider() {
  const response = await apiClient.get<UpcomingFollowUpsResponse>(
    "/api/admin/followups/upcoming",
  );

  return response.data;
}
