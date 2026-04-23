import { useQuery } from "@tanstack/react-query";
import {
  getFollowUpAiScriptsProvider,
  getFollowUpStatsProvider,
  getUpcomingFollowUpsProvider,
} from "./followups.api";

export function useFollowUpStatsQuery() {
  return useQuery({
    queryKey: ["followups", "admin", "stats"],
    queryFn: getFollowUpStatsProvider,
    staleTime: 60 * 1000,
  });
}

export function useUpcomingFollowUpsQuery() {
  return useQuery({
    queryKey: ["followups", "admin", "upcoming"],
    queryFn: getUpcomingFollowUpsProvider,
    staleTime: 60 * 1000,
  });
}

export function useFollowUpAiScriptsQuery() {
  return useQuery({
    queryKey: ["followups", "admin", "ai-script"],
    queryFn: getFollowUpAiScriptsProvider,
    staleTime: 60 * 1000,
  });
}
