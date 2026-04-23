import { apiClient } from "@/modules/auth/auth.api";

export type MeetingUserRef =
  | string
  | {
      _id: string;
      name?: string;
      firstName?: string;
      email?: string;
    };

export type AdminMeeting = {
  _id: string;
  customerId:
    | string
    | {
        _id: string;
        customerId?: string;
        firstName?: string;
        email?: string;
      };
  leadId: string;
  title: string;
  createdBy: MeetingUserRef;
  assignedTo: MeetingUserRef;
  meetingTime: string;
  duration: number;
  mode: "online" | "in-person";
  meetingLink?: string;
  notes?: string;
  status: "scheduled" | "cancelled" | "completed" | string;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type GetAdminMeetingsData = {
  meeting?: AdminMeeting;
  meetings?: AdminMeeting[];
};

export type GetAdminMeetingsResponse = {
  success: boolean;
  message: string;
  data: GetAdminMeetingsData;
};

export async function getAdminMeetingsProvider() {
  const response = await apiClient.get<GetAdminMeetingsResponse>(
    "/api/admin/meetings",
  );

  return response.data;
}
