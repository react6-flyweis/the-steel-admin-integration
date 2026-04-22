import { useQuery } from "@tanstack/react-query";
import {
  getAdminEmployeesProvider,
  getEmployeeStatsProvider,
} from "./employees.api";

export function useAdminEmployeesQuery() {
  return useQuery({
    queryKey: ["employees", "admin", "list"],
    queryFn: getAdminEmployeesProvider,
    staleTime: 60 * 1000,
  });
}

export function useEmployeeStatsQuery() {
  return useQuery({
    queryKey: ["employees", "admin", "stats"],
    queryFn: getEmployeeStatsProvider,
    staleTime: 60 * 1000,
  });
}
