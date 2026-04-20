import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, FileText, Printer, X } from "lucide-react";

export default function CustomerOrderPage() {
  const progressSteps = [
    {
      label: "Initial Contact",
      status: "completed",
    },
    {
      label: "Requirements Gathered",
      status: "completed",
    },
    {
      label: "Proposal Sent",
      status: "completed",
    },
    {
      label: "Negotiation",
      status: "current",
    },
    {
      label: "Deal Closed",
      status: "upcoming",
    },
    {
      label: "Payment Done",
      status: "upcoming",
    },
    {
      label: "Delivered",
      status: "upcoming",
    },
  ] as const;

  const invoiceRows = [
    {
      invoiceNumber: "INV001",
      dueDate: "24 Dec 2024",
      amount: "$500",
      poNumber: "PO-09876",
      paid: "$500",
      amountDue: "$500",
      status: "Paid",
    },
    {
      invoiceNumber: "INV002",
      dueDate: "10 Dec 2024",
      amount: "$1500",
      poNumber: "PO-09876",
      paid: "$1500",
      amountDue: "$1500",
      status: "Paid",
    },
    {
      invoiceNumber: "INV003",
      dueDate: "27 Nov 2024",
      amount: "$600",
      poNumber: "PO-09876",
      paid: "$600",
      amountDue: "$600",
      status: "Unpaid",
    },
    {
      invoiceNumber: "INV004",
      dueDate: "18 Nov 2024",
      amount: "$1000",
      poNumber: "PO-09876",
      paid: "$1000",
      amountDue: "$1000",
      status: "Paid",
    },
  ];

  const scheduledPayments = [
    { date: "Apr 02, 2024", amount: "$500", status: "Scheduled" },
    { date: "Apr 02, 2024", amount: "$500", status: "Scheduled" },
    { date: "Apr 02, 2024", amount: "$500", status: "Scheduled" },
  ];

  const quotationRows = [
    {
      quotationNumber: "QU0001",
      date: "24 Dec 2024",
      amount: "$500",
      status: "Approved",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between gap-3 border-b bg-gray-50/60">
          <div>
            <CardTitle>Project Details - John Doe</CardTitle>
            <p className="mt-1 text-xs text-gray-500">Q-2025-1047</p>
          </div>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                Contact Information
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-500">Full Name</p>
                <p className="text-gray-900">John Doe</p>
                <p className="pt-1 text-gray-500">Email</p>
                <p className="text-gray-900">john.doe@gmail.com</p>
                <p className="pt-1 text-gray-500">Phone</p>
                <p className="text-gray-900">(555) 123-4567</p>
                <p className="pt-1 text-gray-500">Location</p>
                <p className="text-gray-900">Texas</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                Project Details
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-500">Building Type</p>
                <p className="text-gray-900">Workshop</p>
                <p className="pt-1 text-gray-500">Quote Value</p>
                <p className="text-gray-900">$12,500</p>
                <p className="pt-1 text-gray-500">Status</p>
                <Badge className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 hover:bg-amber-100">
                  Quotation Sent
                </Badge>
                <p className="pt-1 text-gray-500">Created On</p>
                <p className="text-gray-900">2024-10-10</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">Assignment</p>
              <div className="mt-3 flex items-center gap-3 rounded-md bg-white p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <span className="text-xs font-semibold">SL</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    Assigned to: Sarah Lee
                  </p>
                  <p className="text-xs text-gray-500">
                    1 person working on this lead
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                Signed Contract/Agreement
              </p>
              <div className="mt-3 flex items-center gap-3 rounded-md bg-white p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    Signed contact/agreement
                  </p>
                  <p className="text-xs text-gray-500">
                    Signed on: 12 April 2025
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-gray-900">
              Progress Steps
            </p>
            <div className="rounded-lg border bg-gray-50 px-4 py-3">
              <div className="space-y-3">
                {progressSteps.map((step, index) => {
                  const isCompleted = step.status === "completed";
                  const isCurrent = step.status === "current";

                  return (
                    <div
                      key={step.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold ${
                            isCompleted
                              ? "bg-emerald-500 text-white"
                              : isCurrent
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </span>
                        <div>
                          <p
                            className={`text-sm ${
                              isCompleted || isCurrent
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent ? (
                            <p className="text-xs text-blue-600">
                              Current Step
                            </p>
                          ) : null}
                        </div>
                      </div>
                      {isCompleted ? (
                        <span className="text-xs font-medium text-emerald-600">
                          ✓✓
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 border-t pt-3 text-xs text-gray-500">
                Progress: Step 4 of 7
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-900">
              Recent Activity
            </p>
            <div className="rounded-lg border bg-gray-50 p-3 text-xs text-gray-600">
              <p>• Last activity: 2024-10-18</p>
              <p className="pt-1">• Lead created: 2024-10-10</p>
              <p className="pt-1 text-red-500">• 2 unread messages</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Invoice History</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 rounded border bg-white p-0 text-red-600 hover:bg-red-50"
              aria-label="Export PDF"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 rounded border bg-white p-0 text-green-600 hover:bg-green-50"
              aria-label="Export Excel"
            >
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 rounded border bg-white p-0 text-gray-600 hover:bg-gray-50"
              aria-label="Print"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Invoice Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    PO Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Paid
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Amount Due
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceRows.map((invoice) => (
                  <tr
                    key={invoice.invoiceNumber}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-orange-500">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {invoice.dueDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {invoice.amount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {invoice.poNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {invoice.paid}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {invoice.amountDue}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-white ${
                          invoice.status === "Paid"
                            ? "bg-emerald-500"
                            : "bg-red-600"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {invoice.status === "Unpaid" ? (
                        <Button
                          type="button"
                          className="h-6 rounded-md bg-indigo-600 px-2.5 text-xs font-medium text-white hover:bg-indigo-700"
                        >
                          Mark as paid
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payments Scheduled</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {scheduledPayments.map((payment, index) => (
                  <tr
                    key={`${payment.date}-${index}`}
                    className="border-b last:border-0"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-emerald-600">
                      {payment.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Quotation</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 rounded border bg-white p-0 text-red-600 hover:bg-red-50"
              aria-label="Export PDF"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 rounded border bg-white p-0 text-green-600 hover:bg-green-50"
              aria-label="Export Excel"
            >
              <FileSpreadsheet className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 rounded border bg-white p-0 text-gray-600 hover:bg-gray-50"
              aria-label="Print"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Quotation Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotationRows.map((quotation) => (
                  <tr
                    key={quotation.quotationNumber}
                    className="border-b last:border-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-orange-500">
                      {quotation.quotationNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {quotation.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {quotation.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                        {quotation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
