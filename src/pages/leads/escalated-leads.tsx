import { useMemo, useState } from "react";
import { Eye, Pencil, UserPlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AssignSalesDialog from "@/components/leads/assign-sales-dialog";
import { useEscalatedLeadsQuery } from "@/modules/leads/leads.hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EscalationStatus = "pending" | "assigned" | "resolved";

type EscalationCustomer = {
  _id: string;
  customerId?: string;
  firstName?: string;
};

type EscalationEmployee = {
  _id?: string;
  name?: string;
};

type EscalationLead = {
  _id: string;
  customerId?: EscalationCustomer | string | null;
  buildingType?: string;
  location?: string;
  assignedSales?: string | EscalationEmployee | null;
  lifecycleStatus?: string;
};

type EscalationItem = {
  _id: string;
  leadId?: EscalationLead | null;
  customerId?: EscalationCustomer | null;
  raisedBy?: EscalationEmployee | null;
  note?: string;
  status?: EscalationStatus;
  resolvedAssignedTo?: EscalationEmployee | null;
  resolvedAt?: string | null;
  createdAt: string;
};

interface EscalatedLead {
  id: string;
  name: string;
  quoteId: string;
  type: string;
  assignedTo?: string;
  escalatedDate: string;
  escalationStatus: EscalationStatus;
  note: string;
}

const statusClasses: Record<EscalationStatus, string> = {
  pending: "bg-violet-100 text-violet-700",
  assigned: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

const statusLabels: Record<EscalationStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  resolved: "Resolved",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

const formatLeadType = (lead?: EscalationLead | null) => {
  if (!lead) return "Not available";

  const parts = [lead.buildingType, lead.location]
    .map((part) => part?.trim())
    .filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return "Not available";
};

const getCustomerCode = (customer?: EscalationCustomer | string | null) => {
  if (!customer) {
    return null;
  }

  if (typeof customer === "string") {
    return customer;
  }

  return customer.customerId ?? null;
};

const getCustomerName = (customer?: EscalationCustomer | string | null) => {
  if (!customer || typeof customer === "string") {
    return null;
  }

  return customer.firstName?.trim() || null;
};

const getAssignedName = (escalation: EscalationItem) => {
  const resolvedAssignedTo = escalation.resolvedAssignedTo?.name?.trim();
  if (resolvedAssignedTo) {
    return resolvedAssignedTo;
  }

  const leadAssignedSales = escalation.leadId?.assignedSales;
  if (typeof leadAssignedSales === "object" && leadAssignedSales?.name) {
    return leadAssignedSales.name;
  }

  return null;
};

const getLeadName = (escalation: EscalationItem) =>
  getCustomerName(escalation.customerId) ||
  getCustomerName(escalation.leadId?.customerId) ||
  escalation.raisedBy?.name?.trim() ||
  "Unknown customer";

const getEscalationRows = (escalations: EscalationItem[]): EscalatedLead[] =>
  escalations.map((escalation) => ({
    id: escalation._id,
    name: getLeadName(escalation),
    quoteId:
      getCustomerCode(escalation.customerId) ||
      getCustomerCode(escalation.leadId?.customerId) ||
      escalation.leadId?._id ||
      escalation._id,
    type: formatLeadType(escalation.leadId),
    assignedTo: getAssignedName(escalation) ?? undefined,
    escalatedDate: formatDate(escalation.resolvedAt || escalation.createdAt),
    escalationStatus: escalation.status || "pending",
    note: escalation.note?.trim() || "No note provided.",
  }));

export default function EscalatedLeadsPage() {
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const {
    data: escalationsResponse,
    isLoading,
    isError,
    refetch,
  } = useEscalatedLeadsQuery();

  const escalatedLeads = useMemo(
    () => getEscalationRows(escalationsResponse?.data.escalations ?? []),
    [escalationsResponse],
  );

  const allSelected = useMemo(
    () =>
      escalatedLeads.length > 0 &&
      selectedLeadIds.length === escalatedLeads.length,
    [selectedLeadIds, escalatedLeads.length],
  );

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeadIds(escalatedLeads.map((lead) => lead.id));
      return;
    }
    setSelectedLeadIds([]);
  };

  const handleToggleLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeadIds((prev) => [...prev, leadId]);
      return;
    }
    setSelectedLeadIds((prev) => prev.filter((id) => id !== leadId));
  };

  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl text-gray-900">
          Escalated Leads - {isLoading ? "..." : escalatedLeads.length}
        </h1>
        <p className="text-gray-500 mt-1">Assign and view leads</p>
      </div>

      <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        {isError ? (
          <div className="px-6 py-10 text-center space-y-3">
            <p className="text-sm text-slate-600">
              Unable to load escalated leads.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/70 border-slate-200">
                <TableHead className="w-10 px-4">
                  <input
                    aria-label="Select all escalated leads"
                    className="h-3.5 w-3.5 rounded border-slate-300"
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => handleToggleAll(event.target.checked)}
                    disabled={escalatedLeads.length === 0}
                  />
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide text-slate-500 px-3">
                  Lead Info
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide text-slate-500 px-3">
                  Assigned To
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide text-slate-500 px-3">
                  Date Escalated
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide text-slate-500 px-3">
                  Escalation Status
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide text-slate-500 px-3">
                  Note
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wide text-slate-500 px-3 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow
                    key={`escalation-skeleton-${index}`}
                    className="border-slate-100"
                  >
                    <TableCell className="px-4">
                      <div className="h-3.5 w-3.5 rounded border border-slate-200 bg-slate-100 animate-pulse" />
                    </TableCell>
                    <TableCell className="px-3 py-4" colSpan={6}>
                      <div className="h-4 rounded bg-slate-100 animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              ) : escalatedLeads.length === 0 ? (
                <TableRow className="border-slate-100">
                  <TableCell colSpan={7} className="px-6 py-10 text-center">
                    <p className="text-sm text-slate-600">
                      No escalated leads found.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                escalatedLeads.map((lead) => {
                  const selected = selectedLeadIds.includes(lead.id);
                  const status = lead.escalationStatus;

                  return (
                    <TableRow
                      key={lead.id}
                      data-state={selected ? "selected" : undefined}
                      className="border-slate-100"
                    >
                      <TableCell className="px-4">
                        <input
                          aria-label={`Select ${lead.name}`}
                          className="h-3.5 w-3.5 rounded border-slate-300"
                          type="checkbox"
                          checked={selected}
                          onChange={(event) =>
                            handleToggleLead(lead.id, event.target.checked)
                          }
                        />
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <div>
                          <p className="text-sm text-slate-900">{lead.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {lead.quoteId}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {lead.type}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        {lead.assignedTo ? (
                          <div>
                            <p className="text-sm text-slate-900">
                              {lead.assignedTo}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              1 person assigned
                            </p>
                          </div>
                        ) : (
                          <AssignSalesDialog
                            trigger={
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 text-sm text-violet-700 hover:text-violet-800"
                              >
                                <UserPlus2 className="h-3.5 w-3.5 text-green-500" />
                                Assign
                              </button>
                            }
                          />
                        )}
                      </TableCell>

                      <TableCell className="px-3 py-3 text-sm text-slate-700">
                        {lead.escalatedDate}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <Badge
                          className={`rounded-full px-2.5 py-0.5 ${statusClasses[status]}`}
                        >
                          {statusLabels[status]}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-3 py-3 max-w-72 whitespace-normal text-xs text-slate-600 leading-5">
                        {lead.note}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <div className="flex items-center justify-end gap-3 text-slate-500">
                          <button
                            type="button"
                            className="hover:text-indigo-600"
                            aria-label="View lead"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <AssignSalesDialog
                            trigger={
                              <button
                                type="button"
                                className="hover:text-green-600"
                                aria-label="Assign lead"
                              >
                                <UserPlus2 className="h-4 w-4" />
                              </button>
                            }
                          />
                          <button
                            type="button"
                            className="hover:text-emerald-600"
                            aria-label="Edit lead"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
