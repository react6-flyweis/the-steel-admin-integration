import { useQuery } from "@tanstack/react-query";
import {
  getAdminEmployeesProvider,
  getAdminEmployeeProfileProvider,
  getEmployeeStatsProvider,
  getEmployeePerformanceProvider,
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

export function useEmployeePerformanceQuery() {
  return useQuery({
    queryKey: ["employees", "admin", "performance"],
    queryFn: getEmployeePerformanceProvider,
    staleTime: 60 * 1000,
  });
}

export function useAdminEmployeeProfileQuery(employeeId: string) {
  return useQuery({
    queryKey: ["employees", "admin", "detail", employeeId],
    queryFn: () => getAdminEmployeeProfileProvider(employeeId),
    staleTime: 60 * 1000,
    enabled: Boolean(employeeId),
  });
}
