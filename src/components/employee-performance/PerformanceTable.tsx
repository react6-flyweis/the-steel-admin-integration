import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type Employee = {
  id: string;
  name: string;
  value: number;
  color: string;
  department: string;
  role: string;
  deals: number;
  commission: string;
  perf: number;
};

interface Props {
  data: Employee[];
}

export default function PerformanceTable({ data }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const departments = useMemo(
    () => ["all", ...Array.from(new Set(data.map((d) => d.department)))],
    [data],
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((d) => {
      if (deptFilter !== "all" && d.department !== deptFilter) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.role.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q)
      );
    });
  }, [data, searchQuery, deptFilter]);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <CardTitle>Employee Performance</CardTitle>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search employees..."
            className="w-full sm:w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dep) => (
                <SelectItem key={dep} value={dep}>
                  {dep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Table (visible on all screen sizes) */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b-2">
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Deals Closed</TableHead>
                <TableHead>Total Earnings</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>PERFORMANCE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700 overflow-hidden"
                        aria-hidden
                      >
                        {d.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium">{d.name}</div>
                        <div className="text-xs text-gray-400">{d.role}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white`}
                      style={{
                        background:
                          d.department === "Sales"
                            ? "#EDF8FF"
                            : d.department === "Business Development"
                              ? "#F3F0FF"
                              : "#F0F9F4",
                        color:
                          d.department === "Sales"
                            ? "#0369A1"
                            : d.department === "Business Development"
                              ? "#3730A3"
                              : "#065F46",
                      }}
                    >
                      {d.department}
                    </span>
                  </TableCell>

                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 00-1 1v1H5a2 2 0 00-2 2v8a1 1 0 001 1h10a1 1 0 001-1V6a2 2 0 00-2-2h-3V3a1 1 0 00-1-1H9z" />
                      </svg>
                      {d.deals}
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold">{d.value}</TableCell>

                  <TableCell>{d.commission}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-36 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-3 rounded-full"
                          style={{
                            width: `${d.perf}%`,
                            background: `linear-gradient(90deg, #06b6d4, #16a34a)`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 w-10">
                        {d.perf}%
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Card layout (hidden) */}
        <div className="space-y-3 hidden p-4">
          {filtered.map((d) => (
            <Card key={d.name} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700 overflow-hidden"
                    aria-hidden
                  >
                    {d.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-gray-400">{d.role}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold">{d.value}</div>
              </div>

              <div className="mt-2 text-xs text-gray-500 grid grid-cols-3 gap-2">
                <div>
                  <div className="text-gray-600">Dept</div>
                  <div className="font-medium text-gray-700">
                    {d.department}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Deals</div>
                  <div className="font-medium text-gray-700">{d.deals}</div>
                </div>
                <div>
                  <div className="text-gray-600">Commission</div>
                  <div className="font-medium text-gray-700">
                    {d.commission}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center">
                <div className="w-full mr-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${d.perf}%`,
                      background: "linear-gradient(90deg, #06b6d4, #16a34a)",
                    }}
                    className="h-3 rounded-full"
                  />
                </div>
                <div className="text-xs text-gray-500 w-10">{d.perf}%</div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
