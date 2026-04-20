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
import { Textarea } from "@/components/ui/textarea";

type LeadFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  leadSource: string;
  leadStatus: string;
  estimatedValue: string;
  priority: string;
  notes: string;
  width: number;
  length: number;
  height: number;
  roofStyle: string;
  buildingType: string;
  doors: number;
  windows: number;
  insulation: number;
};

const getInitialFormData = (): LeadFormData => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyName: "",
  jobTitle: "",
  leadSource: "",
  leadStatus: "New",
  estimatedValue: "",
  priority: "Medium",
  notes: "",
  width: 0,
  length: 0,
  height: 0,
  roofStyle: "",
  buildingType: "",
  doors: 0,
  windows: 0,
  insulation: 0,
});

interface CounterInputProps {
  id: keyof Pick<
    LeadFormData,
    "width" | "length" | "height" | "doors" | "windows" | "insulation"
  >;
  label: string;
  value: number;
  onChange: (field: CounterInputProps["id"], value: number) => void;
}

function CounterInput({ id, label, value, onChange }: CounterInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs text-slate-600">
        {label}
      </Label>
      <div className="flex h-10 items-center rounded-md border border-slate-200 bg-white px-2">
        <button
          type="button"
          className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-500 transition hover:bg-slate-100"
          onClick={() => onChange(id, Math.max(0, value - 1))}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          id={id}
          type="number"
          min={0}
          value={value}
          onChange={(e) =>
            onChange(id, Math.max(0, Number(e.target.value) || 0))
          }
          className="h-full flex-1 border-none bg-transparent text-center text-sm text-slate-700 outline-none"
        />
        <button
          type="button"
          className="inline-flex h-6 w-6 items-center justify-center rounded text-blue-600 transition hover:bg-blue-50"
          onClick={() => onChange(id, value + 1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function EditLeadPage() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>(getInitialFormData());

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCounterChange = (
    field: CounterInputProps["id"],
    value: number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lead updated:", leadId, formData);
    setShowSuccess(true);
    setTimeout(() => navigate("/leads"), 500);
  };

  return (
    <div className="w-full min-h-0 p-4 sm:p-6">
      <div className="mb-4 flex gap-1">
        <Button
          type="button"
          className="h-8 bg-blue-600 px-4 text-xs font-medium hover:bg-blue-700"
          onClick={() => navigate("/leads")}
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Back
        </Button>
        <div className="">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Edit Leads
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Create a new lead record and assign it to your pipeline
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-6"
      >
        <div className="space-y-7">
          <section>
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Personal Infoirmation
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs text-slate-600">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter First Name"
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs text-slate-600">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter Last Name"
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-slate-600">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Email Address"
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs text-slate-600">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Phone Number"
                  className="h-10"
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Company Information
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-xs text-slate-600">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className="h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle" className="text-xs text-slate-600">
                  Job title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Enter job title"
                  className="h-10"
                  required
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Lead Details
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="leadSource" className="text-xs text-slate-600">
                  Lead Source <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.leadSource}
                  onValueChange={(value) =>
                    handleSelectChange("leadSource", value)
                  }
                >
                  <SelectTrigger id="leadSource" className="h-10">
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="cold-call">Cold Call</SelectItem>
                    <SelectItem value="email-campaign">
                      Email Campaign
                    </SelectItem>
                    <SelectItem value="trade-show">Trade Show</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="leadStatus" className="text-xs text-slate-600">
                  Lead Status
                </Label>
                <Select
                  value={formData.leadStatus}
                  onValueChange={(value) =>
                    handleSelectChange("leadStatus", value)
                  }
                >
                  <SelectTrigger id="leadStatus" className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="estimatedValue"
                  className="text-xs text-slate-600"
                >
                  Estimated Value
                </Label>
                <Input
                  id="estimatedValue"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleInputChange}
                  placeholder="Enter Estimated Value"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-xs text-slate-600">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleSelectChange("priority", value)
                  }
                >
                  <SelectTrigger id="priority" className="h-10">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-xs text-slate-600">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes about this lead"
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-slate-800">
              Project Specification
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <CounterInput
                  id="width"
                  label="Width (ft/m)"
                  value={formData.width}
                  onChange={handleCounterChange}
                />
                <CounterInput
                  id="length"
                  label="Length (ft/m)"
                  value={formData.length}
                  onChange={handleCounterChange}
                />
                <CounterInput
                  id="height"
                  label="Height (ft/m)"
                  value={formData.height}
                  onChange={handleCounterChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roofStyle" className="text-xs text-slate-600">
                  Roof Style
                </Label>
                <Select
                  value={formData.roofStyle}
                  onValueChange={(value) =>
                    handleSelectChange("roofStyle", value)
                  }
                >
                  <SelectTrigger id="roofStyle" className="h-10">
                    <SelectValue placeholder="Select Roof Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gable">Gable</SelectItem>
                    <SelectItem value="hip">Hip</SelectItem>
                    <SelectItem value="flat">Flat</SelectItem>
                    <SelectItem value="mansard">Mansard</SelectItem>
                    <SelectItem value="gambrel">Gambrel</SelectItem>
                    <SelectItem value="shed">Shed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="buildingType"
                  className="text-xs text-slate-600"
                >
                  Building Type
                </Label>
                <Select
                  value={formData.buildingType}
                  onValueChange={(value) =>
                    handleSelectChange("buildingType", value)
                  }
                >
                  <SelectTrigger id="buildingType" className="h-10">
                    <SelectValue placeholder="Select Building Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <CounterInput
                  id="doors"
                  label="Doors"
                  value={formData.doors}
                  onChange={handleCounterChange}
                />
                <CounterInput
                  id="windows"
                  label="Windows"
                  value={formData.windows}
                  onChange={handleCounterChange}
                />
                <CounterInput
                  id="insulation"
                  label="Insulation"
                  value={formData.insulation}
                  onChange={handleCounterChange}
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 min-w-24"
              onClick={() => navigate("/leads")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 min-w-28 bg-blue-600 hover:bg-blue-700"
            >
              Save Lead
            </Button>
          </div>
        </div>
      </form>

      <SuccessDialog
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Lead Updated Successfully!"
      />
    </div>
  );
}
