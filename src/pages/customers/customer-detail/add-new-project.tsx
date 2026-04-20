import { useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import SuccessDialog from "@/components/success-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddNewProjectPage() {
  const navigate = useNavigate();
  const params = useParams();
  const customerId = params.id ?? "unknown";
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    landmark: "",
    fullAddress: "",
    state: "",
    companyName: "",
    jobTitle: "",
    width: 0,
    length: 0,
    height: 0,
    roofStyle: "",
    buildingType: "",
    doors: 0,
    windows: 0,
    insulation: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (
    field: "width" | "length" | "height" | "doors" | "windows" | "insulation",
    delta: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta),
    }));
  };

  const handleCancel = () => {
    navigate(`/customers/${customerId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate(`/customers/${customerId}`);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">
      <div className="space-y-2 flex gap-2">
        <Button onClick={() => navigate(-1)} className="px-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="">
          <h1 className="text-3xl font-semibold text-slate-900">
            Add New Project
          </h1>
          <p className="text-sm text-slate-600">
            Create a new lead record and assign it to your pipeline
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-5 sm:p-6 space-y-7"
      >
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900">
            Personal Information (Auto-fill)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email Address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900">
            Site Location/Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                placeholder="Enter City"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark *</Label>
              <Input
                id="landmark"
                name="landmark"
                placeholder="Near this -----"
                value={formData.landmark}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullAddress">Full Address *</Label>
              <Input
                id="fullAddress"
                name="fullAddress"
                placeholder="Enter Full Address"
                value={formData.fullAddress}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State*</Label>
              <Input
                id="state"
                name="state"
                placeholder="Enter State"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900">
            Company Information (Auto-fill)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job title *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="Enter job title"
                value={formData.jobTitle}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900">
            Project Specification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (ft/m)</Label>
              <div className="relative">
                <Input
                  id="width"
                  type="number"
                  value={formData.width}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      width: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("width", -1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("width", 1)}
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length (ft/m)</Label>
              <div className="relative">
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      length: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("length", -1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("length", 1)}
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (ft/m)</Label>
              <div className="relative">
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      height: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("height", -1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("height", 1)}
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roofStyle">Roof Style</Label>
              <Select
                value={formData.roofStyle}
                onValueChange={(value) =>
                  handleSelectChange("roofStyle", value)
                }
              >
                <SelectTrigger id="roofStyle" className="w-full">
                  <SelectValue placeholder="Select Roof Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gable">Gable Roof</SelectItem>
                  <SelectItem value="flat">Flat Roof</SelectItem>
                  <SelectItem value="shed">Shed Roof</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buildingType">Building Type</Label>
              <Select
                value={formData.buildingType}
                onValueChange={(value) =>
                  handleSelectChange("buildingType", value)
                }
              >
                <SelectTrigger id="buildingType" className="w-full">
                  <SelectValue placeholder="Select Building Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="industrial">Industrial Shed</SelectItem>
                  <SelectItem value="commercial">Commercial Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doors">Doors</Label>
              <div className="relative">
                <Input
                  id="doors"
                  type="number"
                  value={formData.doors}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      doors: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("doors", -1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("doors", 1)}
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="windows">Windows</Label>
              <div className="relative">
                <Input
                  id="windows"
                  type="number"
                  value={formData.windows}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      windows: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("windows", -1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("windows", 1)}
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="insulation">Insulation</Label>
              <div className="relative">
                <Input
                  id="insulation"
                  type="number"
                  value={formData.insulation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      insulation: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("insulation", -1)}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => handleNumberChange("insulation", 1)}
                >
                  <Plus className="h-3.5 w-3.5 text-blue-600" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="min-w-28"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="min-w-28 bg-[#2864DC] hover:bg-[#1D4FB8]"
          >
            Add Project
          </Button>
        </div>
      </form>

      <SuccessDialog
        open={showSuccess}
        onClose={handleSuccessClose}
        title="Project Added Successfully!"
      />
    </div>
  );
}
