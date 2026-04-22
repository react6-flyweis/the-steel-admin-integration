import { useState } from "react";
import { useParams, Link } from "react-router";
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog";
import StatCard from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Tabs: using original nav-style tabs (no shadcn Tabs)
import {
  Mail,
  Phone,
  Calendar,
  Users,
  Percent,
  CheckSquare,
  Smile,
  DollarSign,
  ArrowLeft,
  Edit,
} from "lucide-react";
import { type AdminEmployeeProfileLead } from "@/modules/employees/employees.api";
import { useAdminEmployeeProfileQuery } from "@/modules/employees/employees.hooks";

type Lead = {
  id: string;
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  location?: string;
  priority?: string;
  stage?: string;
  date?: string;
};

const formatJoinedDate = (date?: string) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (amount?: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const formatLeadPhone = (phone?: { number?: string; countryCode?: string }) => {
  if (!phone?.number && !phone?.countryCode) {
    return "N/A";
  }

  return `${phone.countryCode ?? ""} ${phone.number ?? ""}`.trim();
};

const formatLifecycleStatus = (status?: string) => {
  if (!status) return "Not set";

  return status
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const formatRole = (role?: string) => {
  switch (role?.toLowerCase()) {
    case "account":
      return "Account";
    case "admin":
      return "Admin";
    case "sales":
      return "Sales";
    default:
      return role ? role.charAt(0).toUpperCase() + role.slice(1) : "N/A";
  }
};

const mapLead = (lead: AdminEmployeeProfileLead): Lead => ({
  id: lead._id,
  name: lead.customerId?.firstName ?? lead.name ?? "Unknown Lead",
  code: lead.customerId?.customerId ?? lead.code ?? lead._id,
  email: lead.customerId?.email ?? lead.email,
  phone: formatLeadPhone(lead.customerId?.phone) || lead.phone || "N/A",
  location:
    [lead.buildingType, lead.location || lead.source]
      .filter(Boolean)
      .join(" · ") ||
    lead.location ||
    lead.source ||
    "N/A",
  priority:
    lead.quoteValue !== undefined
      ? formatCurrency(lead.quoteValue)
      : (lead.priority ?? "N/A"),
  stage: formatLifecycleStatus(lead.lifecycleStatus ?? lead.stage),
  date: formatJoinedDate(lead.createdAt),
});

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const employeeId = id ?? "";

  const {
    data: employeeProfileResponse,
    isLoading,
    error,
  } = useAdminEmployeeProfileQuery(employeeId);

  const profile = employeeProfileResponse?.data;
  const employee = profile?.employee;
  const assignedLeads = (profile?.leads ?? []).map(mapLead);
  const employeeStats = profile?.stats;

  const [activeTab, setActiveTab] = useState<string>("personal");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Card className="p-6">Loading employee profile...</Card>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button asChild size="sm">
            <Link to="/employees" className="inline-flex items-center gap-2">
              <ArrowLeft />
              Back
            </Link>
          </Button>
          <h2 className="text-lg sm:text-xl font-semibold">Employee Profile</h2>
        </div>
        <Card className="p-6 text-sm text-gray-600">
          Employee details are unavailable.
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button asChild size="sm">
          <Link to="/employees" className="inline-flex items-center gap-2">
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <h2 className="text-lg sm:text-xl font-semibold">Employee Profile</h2>
      </div>

      {/* Header Card */}
      <Card className="px-6 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback>
              {employee.name
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold truncate">
              {employee.name}
            </h3>
            <div className="text-sm text-gray-600 mt-1">
              {formatRole(employee.role)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Joined {formatJoinedDate(employee.createdAt)}
            </div>
          </div>
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <div className="inline-flex flex-col items-end gap-2">
            <Badge variant="secondary">
              {employee.isActive ? "Active" : "Inactive"}
            </Badge>
            <div className="text-sm text-gray-600">
              <span className="text-2xl sm:text-3xl font-semibold text-gray-900 mr-1">
                {employeeStats?.totalLeads ?? assignedLeads.length}
              </span>
              <span className="text-sm text-gray-600">leads assigned</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div>
        <div className="border-b">
          <nav className="flex -mb-px space-x-6 px-6">
            <button
              className={`py-4 text-sm ${
                activeTab === "personal"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              Personal Info
            </button>
            <button
              className={`py-4 text-sm ${
                activeTab === "assigned"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("assigned")}
            >
              Assigned Leads
            </button>
            <button
              className={`py-4 text-sm ${
                activeTab === "performance"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("performance")}
            >
              Performance
            </button>
          </nav>
        </div>

        <div className="pt-6">
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow relative">
                <h4 className="font-semibold mb-4">Contact Information</h4>
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="text-gray-400 mt-0.5">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Email</div>
                      <div className="mt-1 text-gray-900">{employee.email}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-gray-400 mt-0.5">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Phone</div>
                      <div className="mt-1 text-gray-900">
                        {employee.phone ?? "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-gray-400 mt-0.5">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Join Date</div>
                      <div className="mt-1 text-gray-900">
                        {formatJoinedDate(employee.createdAt)}
                      </div>
                    </div>
                  </div>

                  <button
                    aria-label="Edit contact"
                    className="absolute right-4 p-4 bottom-4"
                    onClick={() => setEditDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="relative bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold mb-4">Roles & Permissions</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div>
                    <div className="text-gray-500 text-xs">Role</div>
                    <div className="mt-1">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                        {formatRole(employee.role)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Permissions</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                        Lead Access
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                        Follow-ups Access
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                        Reports Access
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  aria-label="Edit roles and permissions"
                  className="absolute right-4 p-4 bottom-4"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "assigned" && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900">Assigned Leads</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Leads currently associated with this employee.
                </p>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs text-gray-500 uppercase tracking-wider">
                        Lead
                      </TableHead>
                      <TableHead className="text-xs text-gray-500 uppercase tracking-wider">
                        Customer
                      </TableHead>
                      <TableHead className="text-xs text-gray-500 uppercase tracking-wider">
                        Contact
                      </TableHead>
                      <TableHead className="text-xs text-gray-500 uppercase tracking-wider">
                        Quote Value
                      </TableHead>
                      <TableHead className="text-xs text-gray-500 uppercase tracking-wider">
                        Stage
                      </TableHead>
                      <TableHead className="text-xs text-gray-500 uppercase tracking-wider">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedLeads.map((lead: Lead) => (
                      <TableRow key={lead.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900 truncate">
                              {lead.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {lead.code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {lead.location}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-700 truncate">
                              {lead.email ?? "N/A"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {lead.phone ?? "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium">
                            {lead.priority ?? "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-sm font-medium">
                            {lead.stage ?? "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-gray-700">
                            {lead.date}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {assignedLeads.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-500 border-t border-gray-200">
                  No assigned leads found for this employee.
                </div>
              )}
            </div>
          )}

          {activeTab === "performance" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Leads"
                  value={
                    <span className="font-semibold">
                      {employeeStats?.totalLeads ?? 0}
                    </span>
                  }
                  color="bg-blue-600"
                  icon={<Users className="h-5 w-5 text-blue-600" />}
                />

                <StatCard
                  title="Leads Closed"
                  value={
                    <span className="font-semibold">
                      {employeeStats?.closedLeads ?? 0}
                    </span>
                  }
                  color="bg-yellow-400"
                  icon={<CheckSquare className="h-5 w-5 text-yellow-400" />}
                />

                <StatCard
                  title="Conversion Rate"
                  value={
                    <span className="font-semibold">
                      {employeeStats?.conversionRate ?? 0}%
                    </span>
                  }
                  color="bg-green-500"
                  icon={<Percent className="h-5 w-5 text-green-500" />}
                />

                <StatCard
                  title="Follow-ups Completed"
                  value={
                    <span className="font-semibold">
                      {employeeStats?.followUpsCompleted ?? 0}
                    </span>
                  }
                  color="bg-orange-400"
                  icon={<Smile className="h-5 w-5 text-orange-400" />}
                />

                <StatCard
                  title="Revenue Generated"
                  value={
                    <div>
                      <div className="text-2xl font-semibold">
                        {formatCurrency(employeeStats?.revenueGenerated)}
                      </div>
                      <div className="text-xs opacity-80">Total</div>
                    </div>
                  }
                  color="bg-rose-400"
                  icon={<DollarSign className="h-5 w-5 text-rose-400" />}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <AddEmployeeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        hideTrigger
        initialValues={{
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          role:
            employee.role?.toLowerCase() === "account"
              ? "Manager"
              : employee.role?.toLowerCase() === "sales"
                ? "Employee"
                : employee.role?.toLowerCase() === "admin"
                  ? "Admin"
                  : (employee.role ?? "Employee"),
          team: "Sales",
          status: employee.isActive ? "active" : "inactive",
          password: "",
        }}
      />
    </div>
  );
}
