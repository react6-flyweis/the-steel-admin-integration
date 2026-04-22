import { useSearchParams } from "react-router";
import { EmployeeStatsGrid } from "@/components/employees/employee-stats-grid";
import {
  EmployeeTable,
  type Employee,
} from "@/components/employees/employee-table";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import {
  useAdminEmployeesQuery,
  useEmployeeStatsQuery,
} from "@/modules/employees/employees.hooks";

const formatJoinedDate = (date?: string) => {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US");
};

const mapApiRoleToUiRole = (role?: string): Employee["role"] => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "Admin";
    case "sales":
      return "Employee";
    case "account":
      return "Manager";
    default:
      return "Employee";
  }
};

export default function EmployeesPage() {
  const { data: employeesResponse } = useAdminEmployeesQuery();
  const { data: employeeStatsResponse } = useEmployeeStatsQuery();

  const [searchParams] = useSearchParams();
  const teamFilter = searchParams.get("team") ?? undefined;

  const employees: Employee[] = (employeesResponse?.data.employees ?? []).map(
    (employee) => ({
      id: employee._id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone ?? "N/A",
      joinedDate: formatJoinedDate(employee.createdAt),
      role: mapApiRoleToUiRole(employee.role),
      team: "N/A",
      status: employee.isActive ? "active" : "inactive",
      leads: employee.assignedLeadCount ?? 0,
    }),
  );

  const filteredEmployees = teamFilter
    ? employees.filter(
        (emp) => emp.team?.toLowerCase() === teamFilter.toLowerCase(),
      )
    : employees;

  const employeeStatsData = employeeStatsResponse?.data;

  const totalEmployees = employeeStatsData?.total ?? 0;
  const activeEmployees = employeeStatsData?.active ?? 0;
  const inactiveEmployees = Math.max(totalEmployees - activeEmployees, 0);

  const stats = {
    totalEmployees,
    inactiveEmployees,
    activeEmployees,
    totalTeams: employeeStatsData?.byRole?.length ?? 0,
    topPerformer: {
      name: employeeStatsData?.topPerformer?.name ?? "N/A",
      leadsCount: employeeStatsData?.topPerformer?.leadsCount ?? 0,
    },
  };

  return (
    <div className="space-y-6 p-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-gray-600 mt-1">
            Add, edit, and manage employees, teams, roles, and permissions.
          </p>
        </div>
        <AddEmployeeDialog />
      </div>

      {/* Stats Grid */}
      <EmployeeStatsGrid stats={stats} />

      {/* Employee Table */}
      <EmployeeTable employees={filteredEmployees} />
    </div>
  );
}
