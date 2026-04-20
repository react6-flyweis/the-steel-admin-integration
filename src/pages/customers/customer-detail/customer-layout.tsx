import { Link, Outlet, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Clock3,
  DollarSign,
  FileText,
  MailIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import StatCard from "@/components/ui/stat-card";

export default function CustomerDetailLayout() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id ?? "unknown";

  const customer = {
    id,
    customerName: "John Doe",
    email: "luca.moretti@eurobuild.it",
    phone: "+39 02 8945 2231",
    inquiryFor: "Garage",
    status: "Active",
    joined: "January 15, 2023",
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            // size="lg"
            onClick={() => navigate(-1)}
            className="px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-lg ">Customer Info</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button asChild className="w-full sm:w-auto bg-black px-4">
            <Link to={`/customers/${id}/edit`}>Edit</Link>
          </Button>
          <Link to={`/customers/${id}/projects/new`}>
            <Button className="w-full sm:w-auto bg-[#1F86D5] hover:bg-[#1769A7]">
              Create new Project
            </Button>
          </Link>
          <Link to="/customers/meetings/schedule">
            <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <MailIcon className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="p-4">
        {/* <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader> */}
        <CardContent className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start md:items-end px-0">
          <div className="flex gap-2 items-start">
            {/* Avatar */}
            <Avatar className="h-12 w-12 md:h-16 md:w-16">
              <AvatarImage
                src="https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff&size=128"
                alt={customer.customerName}
              />
              <AvatarFallback>
                {customer.customerName?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>

            {/* Customer Details */}
            <div className="space-y-2 md:space-y-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {customer.customerName}
                </h2>
                <p className="text-sm text-gray-500">{customer.id}</p>
                <p className="text-sm text-gray-500">
                  Joined {customer.joined}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:mr-6 text-sm mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">✉</span>
              <span className="text-gray-700">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📞</span>
              <span className="text-gray-700">{customer.phone}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3 md:mt-0 md:mr-6">
            <p className="text-xs text-gray-500 uppercase">Inquiry For</p>
            <p className="text-sm font-medium text-gray-900">
              {customer.inquiryFor}
            </p>
          </div>

          <div className="flex items-center px-0 md:px-8 mt-3 md:mt-0">
            <Badge className="bg-green-50 text-green-700 border-green-200">
              {customer.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Paid"
          value="$1,850"
          color="bg-[#1D51A4]"
          icon={<DollarSign className="h-5 w-5 text-[#1D51A4]" />}
        />
        <StatCard
          title="Pending Payment"
          value="$2,125"
          color="bg-[#FD8D5B]"
          icon={<Clock3 className="h-5 w-5 text-[#FD8D5B]" />}
        />
        <StatCard
          title="Total Invoices"
          value="4"
          color="bg-[#EAB308]"
          icon={<FileText className="h-5 w-5 text-[#EAB308]" />}
        />
        <StatCard
          title="Revenue Generated"
          value="$4,125"
          color="bg-[#A855F7]"
          icon={<DollarSign className="h-5 w-5 text-[#A855F7]" />}
        />
      </div>

      <Outlet />
    </div>
  );
}
