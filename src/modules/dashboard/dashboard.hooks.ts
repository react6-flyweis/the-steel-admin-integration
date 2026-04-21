import { useQuery } from "@tanstack/react-query";
import { getLeadStatsProvider } from "./dashboard.api";

export function useLeadStatsQuery() {
  return useQuery({
    queryKey: ["dashboard", "lead-stats"],
    queryFn: () => getLeadStatsProvider(),
    staleTime: 60 * 1000,
  });
}
