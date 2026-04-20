import InvoiceManagementTable from "../components/InvoiceManagementTable";
import ClientPaymentBreakdown from "../components/ClientPaymentBreakdown";
import type { TabType } from "./Dashboard";
import { useState } from "react";
import FilterTabs from "../components/common_components/FilterTabs";
import StatCard from "@/components/ui/stat-card";
import { Database } from "lucide-react";
import TitleSubtitle from "@/components/TitleSubtitle";

type DistributionCard = {
  label: string;
  value: string;
  bgClass: string;
};

type PaymentOverviewContent = {
  distributionCards: DistributionCard[];
};

const paymentOverviewByFilter: Record<TabType, PaymentOverviewContent> = {
  today: {
    distributionCards: [
      { label: "Paid", value: "60%", bgClass: "bg-[#2356A9]" },
      { label: "Pending", value: "25%", bgClass: "bg-[#2A5DB2]" },
      { label: "Overdue", value: "15%", bgClass: "bg-[#214B95]" },
    ],
  },
  week: {
    distributionCards: [
      { label: "Paid", value: "52%", bgClass: "bg-[#2356A9]" },
      { label: "Pending", value: "31%", bgClass: "bg-[#2A5DB2]" },
      { label: "Overdue", value: "17%", bgClass: "bg-[#214B95]" },
    ],
  },
  month: {
    distributionCards: [
      { label: "Paid", value: "64%", bgClass: "bg-[#2356A9]" },
      { label: "Pending", value: "22%", bgClass: "bg-[#2A5DB2]" },
      { label: "Overdue", value: "14%", bgClass: "bg-[#214B95]" },
    ],
  },
};

function DistributionStatCard({ label, value, bgClass }: DistributionCard) {
  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-5 py-5 text-white shadow-[0_10px_24px_rgba(18,54,126,0.18)] ${bgClass}`}
    >
      <div>
        <p className="text-sm md:text-base font-medium text-white/90">
          {label}
        </p>
        <p className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
          {value}
        </p>
      </div>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/90 text-[#2555A8]">
        <Database className="h-5 w-5" />
      </div>
    </div>
  );
}

const PaymentOverview = () => {
  const [activeTab, setActiveTab] = useState<TabType>("today");

  const paymentOverview = paymentOverviewByFilter[activeTab];
  const summaryCards = [
    {
      title: "Total Invoice",
      value: "$1,56,000",
      titleClassName: "text-slate-500",
      valueClassName: "text-slate-900",
      icon: <Database className="h-5 w-5 text-[#2B5DBB]" />,
      iconWrapperClassName: "bg-[#EEF4FF] border border-[#D8E6FF] p-2.5",
      className:
        "border border-white/80 bg-white shadow-[0_10px_28px_rgba(30,64,175,0.06)]",
    },
    {
      title: "Total Received",
      value: "$8,45,000",
      titleClassName: "text-slate-500",
      valueClassName: "text-[#16A34A]",
      icon: <Database className="h-5 w-5 text-[#16A34A]" />,
      iconWrapperClassName: "bg-[#EAF8EF] border border-[#D7F0DE] p-2.5",
      className:
        "border border-white/80 bg-white shadow-[0_10px_28px_rgba(30,64,175,0.06)]",
    },
    {
      title: "Outstanding Amount",
      value: "$3,85,000",
      titleClassName: "text-slate-500",
      valueClassName: "text-[#EF4444]",
      icon: <Database className="h-5 w-5 text-[#EF4444]" />,
      iconWrapperClassName: "bg-[#FFF0F0] border border-[#FFD8D8] p-2.5",
      className:
        "border border-white/80 bg-white shadow-[0_10px_28px_rgba(30,64,175,0.06)]",
    },
    {
      title: "Overdue Payments",
      value: "$12,500",
      titleClassName: "text-slate-500",
      valueClassName: "text-slate-900",
      icon: <Database className="h-5 w-5 text-[#A855F7]" />,
      iconWrapperClassName: "bg-[#F3E8FF] border border-[#E9D5FF] p-2.5",
      className:
        "border border-white/80 bg-white shadow-[0_10px_28px_rgba(30,64,175,0.06)]",
    },
  ];

  return (
    <div className="xl:px-0 px-2 pb-10 space-y-6">
      <FilterTabs activeTab={activeTab} onChange={setActiveTab} />
      <TitleSubtitle
        title="Payment Overview"
        subtitle="Financial performance tracking and management"
      />

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4 xl:gap-4">
        {summaryCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">
          Payment Status Distribution
        </h2>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          {paymentOverview.distributionCards.map((card) => (
            <DistributionStatCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      <InvoiceManagementTable activeTab={activeTab} />
      <ClientPaymentBreakdown activeTab={activeTab} />
    </div>
  );
};

export default PaymentOverview;
