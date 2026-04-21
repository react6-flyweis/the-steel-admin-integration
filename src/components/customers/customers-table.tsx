import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Pagination from "@/components/Pagination";

export type CustomerListItem = {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  email: string;
  inquiryFor: string;
  status: string;
};

type CustomersTableProps = {
  customers: CustomerListItem[];
  isLoading: boolean;
  isError: boolean;
  totalItems: number;
  currentPage: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onViewCustomer: (customerId: string) => void;
};

export default function CustomersTable({
  customers,
  isLoading,
  isError,
  totalItems,
  currentPage,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onViewCustomer,
}: CustomersTableProps) {
  return (
    <Card className="p-0">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-sm text-gray-500">Loading customers...</div>
        ) : isError ? (
          <div className="p-6 text-sm text-red-600">
            Failed to load customers. Please try again.
          </div>
        ) : customers.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No customers found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inquiry For
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer, index) => (
                  <tr
                    key={`${customer.id}-${index}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.customerId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.inquiryFor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.status ? (
                        <Badge
                          variant="outline"
                          className={
                            customer.status.toLowerCase() === "active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {customer.status}
                        </Badge>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => onViewCustomer(customer.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !isError ? (
          <Pagination
            totalItems={totalItems}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
