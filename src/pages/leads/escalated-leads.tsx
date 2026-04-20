import { useMemo, useState } from "react";
import { Eye, Pencil, UserPlus2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AssignSalesDialog from "@/components/leads/assign-sales-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EscalationStatus = "Pending" | "Assigned" | "Resolved";

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

const escalatedLeads: EscalatedLead[] = [
  {
    id: "lead-1",
    name: "John Doe",
    quoteId: "Q-2025-1047",
    type: "Workshop, Texas",
    escalatedDate: "17 April 2026",
    escalationStatus: "Pending",
    note: "The note written by the sales person at the time of escalation",
  },
  {
    id: "lead-2",
    name: "John Doe",
    quoteId: "Q-2025-1047",
    type: "Workshop, Texas",
    escalatedDate: "17 April 2026",
    escalationStatus: "Pending",
    note: "The note written by the sales person at the time of escalation",
  },
  {
    id: "lead-3",
    name: "John Doe",
    quoteId: "Q-2025-1047",
    type: "Workshop, Texas",
    assignedTo: "Sarah Lee",
    escalatedDate: "17 April 2026",
    escalationStatus: "Assigned",
    note: "The note written by the sales person at the time of escalation",
  },
  {
    id: "lead-4",
    name: "John Doe",
    quoteId: "Q-2025-1047",
    type: "Workshop, Texas",
    assignedTo: "Sarah Lee",
    escalatedDate: "17 April 2026",
    escalationStatus: "Resolved",
    note: "The note written by the sales person at the time of escalation",
  },
];

const statusClasses: Record<EscalationStatus, string> = {
  Pending: "bg-violet-100 text-violet-700",
  Assigned: "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
};

export default function EscalatedLeadsPage() {
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  const allSelected = useMemo(
    () =>
      escalatedLeads.length > 0 &&
      selectedLeadIds.length === escalatedLeads.length,
    [selectedLeadIds],
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
          Escalated Leads - {escalatedLeads.length}
        </h1>
        <p className="text-gray-500 mt-1">Assign and view leads</p>
      </div>

      <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden">
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
            {escalatedLeads.map((lead) => {
              const selected = selectedLeadIds.includes(lead.id);
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
                      className={`rounded-full px-2.5 py-0.5 ${statusClasses[lead.escalationStatus]}`}
                    >
                      {lead.escalationStatus}
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
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
