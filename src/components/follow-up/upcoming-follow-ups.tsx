import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  List,
  PlusIcon,
  Phone,
  Mail,
  Clock,
  Building,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpcomingFollowUpsQuery } from "@/modules/followups/followups.hooks";

type ViewMode = "schedule" | "calendar" | "list";

interface FollowUp {
  id: string;
  date: string;
  customer: string;
  type: string;
  time?: string;
  company?: string;
  status?: "overdue" | "upcoming" | "normal";
}

function inferTypeFromNotes(notes?: string) {
  const value = notes?.toLowerCase() ?? "";

  if (value.includes("email")) {
    return "Email";
  }

  if (value.includes("call")) {
    return "Call";
  }

  if (value.includes("meeting")) {
    return "Meeting";
  }

  return "Follow-up";
}

export default function UpcomingFollowUps() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const {
    data: upcomingResponse,
    isLoading,
    isError,
  } = useUpcomingFollowUpsQuery();

  const followUps: FollowUp[] = (upcomingResponse?.data.followups ?? []).map(
    (item) => {
      const followUpDate = new Date(item.followUpDate);
      const now = new Date();
      const isOverdue =
        item.status !== "completed" && followUpDate.getTime() < now.getTime();

      const status: FollowUp["status"] = isOverdue
        ? "overdue"
        : item.status === "completed"
          ? "normal"
          : "upcoming";

      const customer = item.customerId?.firstName?.trim() || "Unknown Customer";
      const company =
        item.leadId?.location || item.leadId?.buildingType || "N/A";

      return {
        id: item._id,
        date: String(followUpDate.getDate()),
        customer,
        type: inferTypeFromNotes(item.notes),
        time: followUpDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        company,
        status,
      };
    },
  );

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getFollowUpForDay = (day: number) => {
    return followUps.filter((f) => Number(f.date) === day);
  };

  const filteredFollowUps = selectedDay
    ? followUps.filter((f) => Number(f.date) === selectedDay)
    : followUps;

  return (
    <Card className="p-6">
      <div className="flex flex-col   justify-between mb-4 gap-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex gap-2">
            <span className="text-xl">📅</span>
            <h2 className="text-lg font-semibold">Upcoming Follow-Ups</h2>
          </div>
          <Button size="sm" className="mr-2">
            <PlusIcon />
            Schedule
          </Button>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-md p-1">
          <Button
            size="sm"
            variant={viewMode === "calendar" ? "default" : "ghost"}
            onClick={() => {
              setViewMode("calendar");
              setSelectedDay(null);
            }}
            className={cn(
              "flex-1 px-3 h-8 text-xs",
              viewMode === "calendar"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-transparent text-gray-600 hover:bg-gray-200",
            )}
          >
            <Calendar className="w-3 h-3 mr-1" />
            Calendar
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "ghost"}
            onClick={() => {
              setViewMode("list");
              setSelectedDay(null);
            }}
            className={cn(
              "flex-1 px-3 h-8 text-xs",
              viewMode === "list"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-transparent text-gray-600 hover:bg-gray-200",
            )}
          >
            <List className="w-3 h-3 mr-1" />
            List
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-500 ">
        Quick view of scheduled activities
      </p>

      {isLoading && (
        <div className="py-8 text-center text-sm text-gray-500">
          Loading upcoming follow-ups...
        </div>
      )}

      {isError && (
        <div className="py-8 text-center text-sm text-red-500">
          Failed to load upcoming follow-ups.
        </div>
      )}

      {!isLoading && !isError && viewMode === "calendar" && (
        <div className="space-y-4">
          {/* Day names */}
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const followUps = getFollowUpForDay(day);
              const hasFollowUp = followUps.length > 0;
              const isOverdue = followUps.some((f) => f.status === "overdue");
              const isToday = day === new Date().getDate();

              return (
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    setViewMode("list");
                  }}
                  className={cn(
                    "aspect-square border rounded-md flex flex-col items-center justify-center p-1 text-sm relative cursor-pointer",
                    isToday && "bg-blue-600 text-white font-bold",
                    selectedDay === day && "ring-2 ring-blue-400",
                    hasFollowUp && !isToday && "border-red-400",
                    !hasFollowUp && !isToday && "text-gray-700",
                  )}
                >
                  <span className="text-xs">{day}</span>
                  {hasFollowUp && !isToday && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold",
                        isOverdue ? "text-red-500" : "text-orange-500",
                      )}
                    >
                      {day}+
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isLoading && !isError && viewMode === "list" && (
        <div className="space-y-2">
          {selectedDay && (
            <p className="text-sm text-gray-600">
              Showing follow-ups for {selectedDay}
            </p>
          )}

          {filteredFollowUps.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No follow-ups for this date
            </div>
          ) : (
            filteredFollowUps.map((followUp) => {
              const isOverdue = followUp.status === "overdue";
              const isUpcoming = followUp.status === "upcoming";

              const bgClass = isOverdue
                ? "bg-rose-100 border-rose-200"
                : isUpcoming
                  ? "bg-amber-100 border-amber-200"
                  : "bg-rose-50 border-rose-100";

              const Icon = (() => {
                switch (followUp.type) {
                  case "Call":
                    return <Phone className="w-5 h-5 text-gray-700" />;
                  case "Email":
                    return <Mail className="w-5 h-5 text-gray-700" />;
                  case "Meeting":
                  default:
                    return <Calendar className="w-5 h-5 text-gray-700" />;
                }
              })();

              return (
                <div
                  key={followUp.id}
                  className={cn(
                    "w-full p-4 rounded-md flex items-center justify-between",
                    "border",
                    "hover:shadow-sm",
                    bgClass,
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-white/70">{Icon}</div>
                    <div>
                      <p className="font-semibold text-sm">
                        {followUp.customer}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {followUp.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" /> {followUp.company}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-gray-500">
                    <Check className="w-5 h-5" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {viewMode === "schedule" && (
        <div className="text-center py-8 text-gray-500">
          Schedule view coming soon
        </div>
      )}
    </Card>
  );
}
