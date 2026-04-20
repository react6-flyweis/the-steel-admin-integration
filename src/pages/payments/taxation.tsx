import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Check,
  DollarSign,
  Plus,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import TitleSubtitle from "@/components/TitleSubtitle";
import Pagination from "@/components/Pagination";
import AddNewTaxModal from "@/components/payments/add-new-tax-dialog";

type TaxRow = {
  state: string;
  filingFrequency: string;
  dueDate: string;
  website: string;
  status: "Paid" | "Pending";
};

const initialTaxData: TaxRow[] = [
  {
    state: "Alabama",
    filingFrequency: "Monthly",
    dueDate: "20th",
    website: "https://myalabamataxes.alabama.gov",
    status: "Paid",
  },
  {
    state: "Alaska",
    filingFrequency: "Local only",
    dueDate: "Varies",
    website: "https://arsstc.org",
    status: "Pending",
  },
  {
    state: "Arizona",
    filingFrequency: "Monthly",
    dueDate: "20th",
    website: "https://aztaxes.gov",
    status: "Paid",
  },
  {
    state: "Arkansas",
    filingFrequency: "Monthly",
    dueDate: "20th",
    website: "https://atap.arkansas.gov",
    status: "Paid",
  },
  {
    state: "California",
    filingFrequency: "Monthly",
    dueDate: "Last day",
    website: "https://onlineservices.cdtfa.ca.gov",
    status: "Pending",
  },
  {
    state: "Colorado",
    filingFrequency: "Monthly",
    dueDate: "20th",
    website: "https://mybiz.colorado.gov",
    status: "Paid",
  },
];

const TaxationPage = () => {
  const [isAddNewTaxModalOpen, setIsAddNewTaxModalOpen] = useState(false);
  const [taxRows, setTaxRows] = useState<TaxRow[]>(initialTaxData);
  const [dateRange, setDateRange] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpenAddNewTaxModal = () => {
    setIsAddNewTaxModalOpen(true);
  };

  const handleCloseAddNewTaxModal = () => {
    setIsAddNewTaxModalOpen(false);
  };

  const handleMarkAsPaid = (state: string) => {
    setTaxRows((prev) =>
      prev.map((row) =>
        row.state === state ? { ...row, status: "Paid" } : row,
      ),
    );
  };

  const filteredRows = useMemo(
    () =>
      taxRows.filter((row) => {
        const sf = statusFilter?.toLowerCase();
        if (sf && sf !== "all") {
          if (row.status.toLowerCase() !== sf) return false;
        }
        return true;
      }),
    [statusFilter, taxRows],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, rowsPerPage, safeCurrentPage]);

  return (
    <div className="xl:px-5 px-2 md:pt-5 pb-10 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2 pr-0 sm:pr-10 mb-6">
        <TitleSubtitle
          title="Taxation"
          subtitle="Track and record company spending including Vendor Payments, Maintenance Costs, Logistics, and Labour."
        />
      </div>
      <div className="bg-white rounded-md md:p-6 p-4">
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="md:text-xl text-lg font-regular">Taxation</h2>
          <div className="flex gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              onClick={() => handleOpenAddNewTaxModal()}
            >
              <Plus className="w-4 h-4" />
              Add New Tax
            </Button>
          </div>
        </div>

        <div className="bg-white py-6 border-t border-b my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-600">
                Date Range
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="pl-3 pr-10 border-gray-200 h-9.5"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                />
                <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full bg-white border-gray-200">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-250">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    STATE
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    FILING FREQUENCY
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    DUE DATE
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    WEBSITE TO FILE
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedRows.map((row) => (
                  <tr
                    key={row.state}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {row.state}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {row.filingFrequency}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {row.dueDate}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 underline cursor-pointer">
                      <a
                        href={row.website}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-blue-700"
                      >
                        {row.website}
                      </a>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium",
                          row.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700",
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {row.status === "Pending" ? (
                        <Button
                          size="sm"
                          className="h-6 rounded-full border-yellow-200 bg-yellow-100 px-4 text-yellow-700 hover:bg-yellow-200 hover:text-yellow-800"
                          onClick={() => handleMarkAsPaid(row.state)}
                        >
                          Mark as Paid
                        </Button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={filteredRows.length}
            currentPage={safeCurrentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={(page) => {
              setCurrentPage(Math.min(Math.max(page, 1), totalPages));
            }}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-3">
          <Card className="bg-blue-50/50 border-none shadow-sm rounded-md">
            <CardContent className="p-2 flex items-center gap-4 w-fit">
              <div className="xl:w-10 xl:h-10 w-6 h-6 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white shrink-0">
                <DollarSign className="xl:w-5 xl:h-5 w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="md:text-sm text-xs font-medium text-blue-600 mb-1">
                  Total Tax Payable
                </p>
                <p className="xl:text-xl md:text-lg text-xs font-bold text-blue-600">
                  $25,800
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50/50 border-none  rounded-md">
            <CardContent className="p-2 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <Check className="xl:w-6 xl:h-6 w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="md:text-sm text-xs font-medium text-green-600 mb-1">
                  Tax Collected
                </p>
                <p className="xl:text-xl md:text-lg text-xs font-bold text-green-800">
                  $19,800
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50/50 border-none shadow-sm rounded-lg">
            <CardContent className="p-2 flex items-center gap-4">
              <div className="xl:w-10 xl:h-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                <Clock className="xl:w-6 xl:h-6 md:w-6 md:h-6 w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="md:text-sm text-xs font-medium text-orange-500 mb-1">
                  Pending Filings
                </p>
                <p className="xl:text-xl md:text-lg font-bold text-orange-600">
                  1
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddNewTaxModal
        isOpen={isAddNewTaxModalOpen}
        onClose={handleCloseAddNewTaxModal}
      />
    </div>
  );
};

export default TaxationPage;
