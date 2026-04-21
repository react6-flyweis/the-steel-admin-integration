import { useState, useMemo, useCallback } from "react";
import { Search, Users, UserCheck, UserPlus, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/ui/stat-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import AddCustomerDialog from "@/components/customers/add-customer-dialog";
import FilterTabs, { type Period } from "@/components/FilterTabs";
import { useCustomersQuery } from "@/modules/customers/customers.hooks";
import type { AdminCustomer } from "@/modules/customers/customers.api";
import CustomersTable, {
  type CustomerListItem,
} from "@/components/customers/customers-table";

type Customer = CustomerListItem & {
  createdAt: Date;
  isReturning?: boolean;
};

function mapApiCustomerToCustomer(apiCustomer: AdminCustomer): Customer {
  const fullName =
    `${apiCustomer.firstName ?? ""} ${apiCustomer.lastName ?? ""}`.trim();

  const phoneNumber = apiCustomer.phone?.number;
  const phoneCountryCode = apiCustomer.phone?.countryCode;

  return {
    id: apiCustomer._id,
    customerId: apiCustomer.customerId,
    customerName: fullName,
    phone:
      phoneNumber && phoneCountryCode
        ? `${phoneCountryCode} ${phoneNumber}`
        : (phoneNumber ?? ""),
    email: apiCustomer.email ?? "",
    // Keep columns blank when the API omits a value instead of inventing placeholder data.
    inquiryFor: apiCustomer.inquiryFor ?? "",
    status:
      typeof apiCustomer.isActive === "boolean"
        ? apiCustomer.isActive
          ? "Active"
          : "Inactive"
        : "",
    createdAt: apiCustomer.createdAt
      ? new Date(apiCustomer.createdAt)
      : new Date(0),
    isReturning: apiCustomer.isReturning,
  };
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period, setPeriod] = useState<Period>("Month");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const {
    data: customersResponse,
    isLoading: isCustomersLoading,
    isError: isCustomersError,
    isFetching: isCustomersFetching,
  } = useCustomersQuery(currentPage, rowsPerPage);
  const navigate = useNavigate();

  const customers = useMemo(() => {
    return (customersResponse?.data.customers ?? []).map(
      mapApiCustomerToCustomer,
    );
  }, [customersResponse]);

  const totalItems = customersResponse?.data.total ?? 0;

  // Helper to check if a date matches the selected period
  const isInPeriod = useCallback(
    (date: Date) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const customerDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      if (period === "Today") {
        return customerDate.getTime() === today.getTime();
      } else if (period === "Week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return customerDate >= weekAgo && customerDate <= today;
      } else if (period === "Month") {
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 30);
        return customerDate >= monthAgo && customerDate <= today;
      }
      return true;
    },
    [period],
  );

  // Calculate period-filtered stats
  const periodFilteredCustomers = useMemo(() => {
    return customers.filter((c) => isInPeriod(c.createdAt));
  }, [customers, isInPeriod]);

  const stats = useMemo(() => {
    const total = periodFilteredCustomers.length;
    const active = periodFilteredCustomers.filter(
      (c) => c.status.toLowerCase() === "active",
    ).length;
    const newCustomers = periodFilteredCustomers.filter(
      (c) => c.isReturning === false,
    ).length;
    const returning = periodFilteredCustomers.filter(
      (c) => c.isReturning === true,
    ).length;

    return { total, active, newCustomers, returning };
  }, [periodFilteredCustomers]);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return customers.filter((c) => {
      // Status filter
      if (statusFilter !== "all" && c.status.toLowerCase() !== statusFilter) {
        return false;
      }

      // Search across several fields
      if (!q) return true;

      return (
        (c.customerId && c.customerId.toLowerCase().includes(q)) ||
        c.customerName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.inquiryFor.toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery, statusFilter]);

  const handleRowsPerPageChange = (nextRowsPerPage: number) => {
    setRowsPerPage(nextRowsPerPage);
    setCurrentPage(1);
  };

  return (
    <>
      <FilterTabs
        initialPeriod={period}
        onPeriodChange={(newPeriod) => setPeriod(newPeriod)}
      />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl  text-gray-900">Customer Management</h1>
            <p className="text-gray-500 mt-1">
              Easily view, manage, and track all your customers in one place.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              size="lg"
              className="bg-gray-500 text-white hover:bg-gray-600"
              onClick={() => navigate("/customers/contracts")}
            >
              Recent Signed Contracts
            </Button>
            <AddCustomerDialog
              onAdd={() => {}}
              // onAdd={(c) => {
              //   const newCustomer = c ?? generateRandomCustomer();
              //   setCustomers((prev) => [newCustomer, ...prev]);
              // }}
              trigger={
                <Button size="lg" className="">
                  Add New Customer
                </Button>
              }
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            // (Todays | Week | Yearly) Total Cust.
            title={`${period} Total Customers`}
            value={String(stats.total)}
            color="bg-blue-600"
            icon={<Users className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            // (Todays | Week | Yearly) Active Cust.
            title={`${period} Active Customers`}
            value={String(stats.active)}
            color="bg-green-600"
            icon={<UserCheck className="h-5 w-5 text-green-600" />}
          />
          <StatCard
            // New Cust. (Todays | Week | Yearly)
            title={`New Customers (${period})`}
            value={String(stats.newCustomers)}
            color="bg-yellow-500"
            icon={<UserPlus className="h-5 w-5 text-yellow-600" />}
          />
          <StatCard
            // (Todays | Week | Yearly) Returning Cust.
            title={`${period} Returning Customers`}
            value={String(stats.returning)}
            color="bg-orange-500"
            icon={<RefreshCw className="h-5 w-5 text-orange-600" />}
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search customer, ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <CustomersTable
          customers={filteredCustomers}
          isLoading={isCustomersLoading || isCustomersFetching}
          isError={isCustomersError}
          totalItems={totalItems}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          onViewCustomer={(customerId) => navigate(`/customers/${customerId}`)}
        />
      </div>
    </>
  );
}
