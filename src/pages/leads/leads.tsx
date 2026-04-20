import { useState } from "react";
import { Link } from "react-router";
import {
  UserPlus,
  Download,
  MessageSquare,
  Eye,
  Edit,
  FileText,
  Users,
  UserCheck,
  UserX,
  Mail,
} from "lucide-react";
import ImportLeadsDialog from "@/components/leads/import-leads-dialog";
import AssignSalesDialog from "@/components/leads/assign-sales-dialog";
import CreateQuotationDialog from "@/components/leads/create-quotation-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/ui/stat-card";
import LeadDetailDialog from "@/components/leads/lead-detail-dialog";
import ChatDialog from "@/components/leads/chat-dialog";
import SuccessDialog from "@/components/success-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FilterTabs, { type Period } from "@/components/FilterTabs";

// Mock data - replace with actual API calls
const now = new Date();
const daysAgo = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d;
};

const initialLeads = [
  {
    id: "ID-2025-1047",
    name: "John Doe",
    workshop: "Workshop",
    category: "Texas",
    assignedTo: null,
    assignedToName: "",
    assignmentStatus: "Assign",
    score: 25,
    progress: 3,
    progressStep: "Step 4/7",
    status: "Proposal sent",
    statusColor: "purple",
    quoteValue: "$12,500",
    chatCount: 2,
    createdAt: daysAgo(0), // today
  },
  {
    id: "ID-2025-1048",
    name: "Jane Smith",
    workshop: "Garage",
    category: "Texas",
    assignedTo: "Sarah Lee",
    assignedToName: "Sarah Lee",
    assignmentStatus: "1 person assigned",
    score: 45,
    progress: 3,
    progressStep: "Step 4/7",
    status: "Quotation Sent",
    statusColor: "orange",
    quoteValue: "$125,000",
    chatCount: 4,
    createdAt: daysAgo(2), // a few days ago
  },
  {
    id: "ID-2025-1049",
    name: "Bob Johnson",
    workshop: "Workshop",
    category: "Texas",
    assignedTo: "Sarah Lee",
    assignedToName: "Sarah Lee",
    assignmentStatus: "1 person assigned",
    score: 72,
    progress: 3,
    progressStep: "Step 4/7",
    status: "Proposal sent",
    statusColor: "purple",
    quoteValue: "$220,000",
    chatCount: 2,
    createdAt: daysAgo(5), // within the week
  },
  {
    id: "ID-2025-1050",
    name: "Alice Green",
    workshop: "Commercial",
    category: "Texas",
    assignedTo: "Sarah Lee",
    assignedToName: "Sarah Lee",
    assignmentStatus: "1 person assigned",
    score: 88,
    progress: 3,
    progressStep: "Step 4/7",
    status: "Closed",
    statusColor: "green",
    quoteValue: "$45,000",
    chatCount: 2,
    createdAt: daysAgo(20), // earlier this month
  },
];

export default function LeadsPage() {
  const [buildingType, setBuildingType] = useState("all");
  const [projectValue, setProjectValue] = useState("all");
  const [assignments, setAssignments] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period, setPeriod] = useState<Period>("Month");
  const [leads] = useState(initialLeads);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [successOpen, setSuccessOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  const handleSelectAll = (checked: boolean, listToSelect: typeof leads) => {
    if (checked) {
      setSelectedLeads(listToSelect.map((lead) => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectLead = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads((s) => [...s, id]);
    } else {
      setSelectedLeads((s) => s.filter((leadId) => leadId !== id));
    }
  };

  const getScoreColorClass = (score: number) => {
    if (score < 30) return "bg-blue-500";
    if (score < 50) return "bg-green-500";
    if (score < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  const getScoreTextColorClass = (score: number) => {
    if (score < 30) return "text-blue-600";
    if (score < 50) return "text-green-600";
    if (score < 80) return "text-amber-600";
    return "text-red-600";
  };

  const getStatusBadgeColor = (color: string) => {
    const colors: Record<string, string> = {
      purple: "bg-purple-100 text-purple-700",
      orange: "bg-orange-100 text-orange-700",
      green: "bg-green-100 text-green-700",
      blue: "bg-blue-100 text-blue-700",
    };
    return colors[color] || "bg-gray-100 text-gray-700";
  };

  // Helper to parse numeric quote value
  const parseQuoteValue = (q?: string) =>
    Number((q || "").replace(/[^\d]/g, "") || 0);

  // Helper to check if a date matches the selected period
  const isInPeriod = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const leadDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    if (period === "Today") {
      return leadDate.getTime() === today.getTime();
    } else if (period === "Week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return leadDate >= weekAgo && leadDate <= today;
    } else if (period === "Month") {
      const monthAgo = new Date(today);
      monthAgo.setDate(today.getDate() - 30);
      return leadDate >= monthAgo && leadDate <= today;
    }
    return true;
  };

  // Compute filtered leads based on search + filters
  const filteredLeads = leads.filter((lead) => {
    // Period filter
    if (!isInPeriod(lead.createdAt)) {
      return false;
    }

    // Search
    // const q = searchQuery.trim().toLowerCase();
    // if (q) {
    //   const hay =
    //     `${lead.name} ${lead.id} ${lead.workshop} ${lead.category} ${lead.assignedToName}`.toLowerCase();
    //   if (!hay.includes(q)) return false;
    // }

    // Building type filter (normalize)
    if (buildingType !== "all") {
      const normalized = buildingType.replace(/-/g, " ").replace(/s$/, "");
      if (
        !lead.workshop.toLowerCase().includes(normalized.toLowerCase().trim())
      ) {
        return false;
      }
    }

    // Project value filter
    if (projectValue !== "all") {
      const value = parseQuoteValue(lead.quoteValue);
      if (projectValue === "small" && !(value < 50000)) return false;
      if (projectValue === "medium" && !(value >= 50000 && value <= 200000))
        return false;
      if (projectValue === "large" && !(value > 200000)) return false;
    }

    // Assignments filter
    if (assignments !== "all") {
      if (assignments === "assigned" && !lead.assignedTo) return false;
      if (assignments === "unassigned" && lead.assignedTo) return false;
    }

    // Status filter
    if (statusFilter !== "all") {
      const s = lead.status.toLowerCase();
      if (statusFilter === "proposal" && !s.includes("proposal")) return false;
      if (statusFilter === "quotation" && !s.includes("quotation"))
        return false;
      if (statusFilter === "closed" && !s.includes("closed")) return false;
    }

    return true;
  });

  return (
    <>
      <FilterTabs
        initialPeriod={period}
        onPeriodChange={(newPeriod) => setPeriod(newPeriod)}
      />
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">Assign and view leads</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Leads"
            value={String(filteredLeads.length)}
            color="bg-blue-600"
            icon={<Users className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            title="Assigned"
            value={String(filteredLeads.filter((l) => l.assignedTo).length)}
            color="bg-green-600"
            icon={<UserCheck className="h-5 w-5 text-green-600" />}
          />
          <StatCard
            title="Unassigned"
            value={String(filteredLeads.filter((l) => !l.assignedTo).length)}
            color="bg-yellow-500"
            icon={<UserX className="h-5 w-5 text-yellow-600" />}
          />
          <StatCard
            title="Unopened Message"
            value={String(
              filteredLeads.reduce(
                (acc, l) => acc + (l.chatCount > 0 ? 1 : 0),
                0,
              ),
            )}
            color="bg-orange-500"
            icon={<Mail className="h-5 w-5 text-orange-600" />}
          />
        </div>

        {/* Action Buttons and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <Link to="/leads/add" className="inline-block">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </Link>

            <ImportLeadsDialog />
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => setSuccessOpen(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Select value={buildingType} onValueChange={setBuildingType}>
              <SelectTrigger className="w-full sm:w-40 bg-white">
                <SelectValue placeholder="Building types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="garages">Garages</SelectItem>
                <SelectItem value="workshops">Workshops</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="sales-storage">Sales Storage</SelectItem>
                <SelectItem value="arch-buildings">Arch Buildings</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectValue} onValueChange={setProjectValue}>
              <SelectTrigger className="w-full sm:w-40 bg-white">
                <SelectValue placeholder="Project value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="small">
                  Small projects (&lt;$50,000)
                </SelectItem>
                <SelectItem value="medium">
                  Medium ($50,000 - $200,000)
                </SelectItem>
                <SelectItem value="large">Large (&gt;$200,000)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assignments} onValueChange={setAssignments}>
              <SelectTrigger className="w-full sm:w-40 bg-white">
                <SelectValue placeholder="All Assignments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignments</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="proposal">Proposal sent</SelectItem>
                <SelectItem value="quotation">Quotation Sent</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto overflow-y-auto ">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          filteredLeads.length > 0 &&
                          selectedLeads.length === filteredLeads.length
                        }
                        onChange={(e) =>
                          handleSelectAll(e.target.checked, filteredLeads)
                        }
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead Info
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quote Value
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chat
                    </th>
                    <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead, index) => (
                    <tr key={lead.id + index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 sm:px-4 sm:py-4">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) =>
                            handleSelectLead(lead.id, e.target.checked)
                          }
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 text-nowrap whitespace-nowrap">
                            {lead.name}
                          </span>
                          <span className="text-sm text-gray-500 text-nowrap">
                            {lead.id}
                          </span>
                          <span className="text-sm text-gray-500 text-nowrap">
                            {lead.workshop} · {lead.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-2">
                          {lead.assignedTo ? (
                            <>
                              <Avatar className="h-6 w-6 bg-green-100">
                                <AvatarFallback className="text-xs text-green-700">
                                  {lead.assignedToName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 text-nowrap whitespace-nowrap">
                                  {lead.assignedToName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {lead.assignmentStatus}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <Avatar className="h-6 w-6 bg-gray-100">
                                <AvatarFallback className="text-xs text-gray-500">
                                  <UserPlus className="h-3 w-3" />
                                </AvatarFallback>
                              </Avatar>
                              <AssignSalesDialog
                                trigger={
                                  <span className="text-sm text-green-600 font-medium cursor-pointer">
                                    {lead.assignmentStatus}
                                  </span>
                                }
                              />
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        <div className="min-w-32">
                          <div className="relative h-4 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getScoreColorClass(
                                lead.score,
                              )}`}
                              style={{
                                width: `${Math.max(0, Math.min(100, lead.score))}%`,
                              }}
                            />
                            <span
                              className={`absolute inset-0 flex items-center justify-end pr-2 text-xs font-semibold ${getScoreTextColorClass(
                                lead.score,
                              )}`}
                            >
                              {lead.score}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        <Badge
                          className={getStatusBadgeColor(lead.statusColor)}
                          variant="secondary"
                        >
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        <span className="font-medium text-gray-900">
                          {lead.quoteValue}
                        </span>
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        <ChatDialog
                          lead={lead}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="relative p-2 h-8 w-8"
                            >
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                              {lead.chatCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                  {lead.chatCount}
                                </span>
                              )}
                            </Button>
                          }
                        />
                      </td>
                      <td className="px-3 py-2 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-2">
                          <LeadDetailDialog
                            lead={lead}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-8 w-8"
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Button>
                            }
                          />
                          <AssignSalesDialog
                            trigger={
                              <Button variant="ghost" size="icon">
                                <UserPlus />
                              </Button>
                            }
                          />
                          <Link to={`/leads/${lead.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 h-8 w-8"
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                          </Link>
                          <CreateQuotationDialog
                            leadData={{ name: lead.name, id: lead.id }}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 h-8 w-8"
                              >
                                <FileText className="h-4 w-4 text-gray-600" />
                              </Button>
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        No leads match your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <SuccessDialog
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          title="Data exported successfully"
        />
      </div>
    </>
  );
}
