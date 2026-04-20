import { useParams } from "react-router";
import type { ComponentType } from "react";
import { ArrowLeft, Bell, CreditCard, Gift, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

type SummaryCard = {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  cardClassName: string;
  change?: string;
};

type PaymentRow = {
  paymentId: string;
  projectName: string;
  dueDate: string;
  amount: string;
  overdueFrom: string;
};

type HistoryRow = {
  transactionId: string;
  projectName: string;
  paymentDate: string;
  amount: string;
  tax: string;
  paymentMode: string;
  status: string;
};

const summaryCards: SummaryCard[] = [
  {
    title: "Total Project Value",
    value: "$48,988,078",
    icon: CreditCard,
    cardClassName: "bg-[#F59D42]",
  },
  {
    title: "Pending Amount",
    value: "$16,478,145",
    icon: Wallet,
    cardClassName: "bg-[#0F355A]",
  },
  {
    title: "Amount Paid",
    value: "$24,145,789",
    icon: Gift,
    cardClassName: "bg-[#1A9A92]",
  },
  {
    title: "Upcoming Invoice Due",
    value: "$18,458,747",
    icon: Bell,
    cardClassName: "bg-[#2E6FF2]",
    change: "+4.3%",
  },
];

const upcomingPayments: PaymentRow[] = [
  {
    paymentId: "TXN784923",
    projectName: "ABC Logistic Warehouse",
    dueDate: "23-Mar-2025",
    amount: "$40,000",
    overdueFrom: "15 Aug 2025",
  },
];

const overduePayments: PaymentRow[] = [
  {
    paymentId: "TXN784923",
    projectName: "ABC Logistic Warehouse",
    dueDate: "10-Jan-2025",
    amount: "$10,000",
    overdueFrom: "15 Aug 2025",
  },
];

const paymentHistory: HistoryRow[] = [
  {
    transactionId: "TXN784923",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    paymentMode: "Paypal",
    status: "Paid",
  },
  {
    transactionId: "TXN784923",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    paymentMode: "Paypal",
    status: "Paid",
  },
  {
    transactionId: "TXN784923",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    paymentMode: "Paypal",
    status: "Paid",
  },
  {
    transactionId: "TXN784923",
    projectName: "ABC Logistic Warehouse",
    paymentDate: "10-Jan-2025",
    amount: "$10,000",
    tax: "$200",
    paymentMode: "Paypal",
    status: "Paid",
  },
];

export default function LeadPaymentsPage() {
  const { leadId } = useParams();
  const leadLabel = leadId ?? "Lead-001";

  return (
    <div className="min-h-full  p-3 md:p-4 lg:p-5 space-y-5">
      <div>
        <div className="flex gap-2 items-center">
          <div className="size-6 bg-gray-800 rounded-full flex items-center justify-center">
            <ArrowLeft className="size-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-600 leading-tight">
            Payments ({leadLabel})
          </h1>
        </div>
        <p className="text-sm text-[#5d6676] mt-1">
          Review Lead project billing, track payments, and download invoice
          documents.
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`${item.cardClassName} rounded-lg px-4 py-3 text-white flex items-center justify-between shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-white/20 flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-white/85">{item.title}</p>
                  <p className="text-[21px] font-semibold leading-6 mt-1">
                    {item.value}
                  </p>
                </div>
              </div>
              {item.change && (
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-green-500 text-white">
                  {item.change}
                </span>
              )}
            </div>
          );
        })}
      </section>

      <section className="bg-white rounded-md overflow-hidden border border-[#d9dde8]">
        <div className="px-5 py-4 border-b border-[#edf0f5]">
          <h2 className="text-[22px] font-semibold text-[#1f2a37]">
            Upcoming Payments
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-215">
            <thead className="bg-[#f7f8fb] text-[#6b7381]">
              <tr className="text-left text-xs font-medium">
                <th className="px-5 py-3">Payment ID</th>
                <th className="px-5 py-3">Project Name</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Over due From</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {upcomingPayments.map((row) => (
                <tr key={row.paymentId} className="border-t border-[#edf0f5]">
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.paymentId}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.projectName}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.dueDate}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.amount}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#757f91]">
                    {row.overdueFrom}
                  </td>
                  <td className="px-5 py-4">
                    <Button className="h-7 rounded-full bg-green-600 hover:bg-green-700 text-xs px-4">
                      Notify User
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-md overflow-hidden border border-[#d9dde8]">
        <div className="px-5 py-4 border-b border-[#edf0f5]">
          <h2 className="text-[22px] font-semibold text-[#E83D3D]">
            Payment Overdue
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-215">
            <thead className="bg-[#f7f8fb] text-[#6b7381]">
              <tr className="text-left text-xs font-medium">
                <th className="px-5 py-3">Payment ID</th>
                <th className="px-5 py-3">Project Name</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Over due From</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {overduePayments.map((row) => (
                <tr key={row.paymentId} className="border-t border-[#edf0f5]">
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.paymentId}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.projectName}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.dueDate}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.amount}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#757f91]">
                    {row.overdueFrom}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <Button className="h-7 rounded-full bg-red-500 hover:bg-red-600 text-xs px-4">
                        Send Reminder
                      </Button>
                      <Button className="h-7 rounded-full bg-blue-600 hover:bg-blue-700 text-xs px-4">
                        Mark as paid
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white rounded-md overflow-hidden border border-[#d9dde8]">
        <div className="px-5 py-4 border-b border-[#edf0f5]">
          <h2 className="text-[22px] font-semibold text-[#1f2a37]">
            Payment History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-240">
            <thead className="bg-[#f7f8fb] text-[#6b7381]">
              <tr className="text-left text-xs font-medium">
                <th className="px-5 py-3">Transaction ID</th>
                <th className="px-5 py-3">Project Name</th>
                <th className="px-5 py-3">Payment Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Tax</th>
                <th className="px-5 py-3">Payment Mode</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((row, index) => (
                <tr
                  key={`${row.transactionId}-${index}`}
                  className="border-t border-[#edf0f5]"
                >
                  <td className="px-5 py-4 text-sm text-[#818a9b]">
                    {row.transactionId}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#818a9b]">
                    {row.projectName}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.paymentDate}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.amount}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#303847]">
                    {row.tax}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#818a9b]">
                    {row.paymentMode}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex min-w-20 justify-center rounded-full bg-green-100 text-green-700 text-xs font-medium px-3 py-1">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
