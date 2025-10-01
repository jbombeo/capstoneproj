import React, { useState, useMemo, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Zone {
  id: number;
  zone: string;
}

interface RegisterResidentProps {
  zones: Zone[];
}

export default function RegisterResident({ zones }: RegisterResidentProps) {
  const initialState = {
    email: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    birth_date: "",
    birth_place: "",
    age: "",
    zone_id: "",
    total_household: "1",
    relationto_head_of_family: "",
    civil_status: "",
    occupation: "",
    household_no: "",
    religion: "",
    nationality: "Filipino",
    gender: "",
    skills: "",
    remarks: "",
    image: null as File | null,
  };

  const [formData, setFormData] = useState(initialState);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  /* Auto-compute age */
  const computedAge = useMemo(() => {
    if (!formData.birth_date) return "";
    const birth = new Date(formData.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }, [formData.birth_date]);

  useEffect(() => {
    if (computedAge && formData.age !== computedAge.toString()) {
      setFormData((prev) => ({ ...prev, age: computedAge.toString() }));
    }
  }, [computedAge]);

  /* Handle changes */
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "image" && value) {
      setImagePreview(URL.createObjectURL(value));
    }
  };

  /* Validation */
  const requiredFields = ["email", "last_name", "first_name", "birth_date", "zone_id", "gender"];
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) newErrors[field] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Submit handler */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    setErrors({});

    router.post("/resident/register", formData, {
      forceFormData: true,
      onSuccess: () => {
        setFormData(initialState);
        setImagePreview(null);
        toast.success("Registration submitted! Please wait for admin approval.");
        router.visit("/login");
      },
      onError: (err: Record<string, string>) => {
        setErrors(err);
        toast.error("Failed to register. Please check the form.");
      },
      onFinish: () => setProcessing(false),
    });
  };

  /* Cancel */
  const confirmCancel = () => {
    setCancelDialogOpen(false);
    router.visit("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Resident Registration" />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Header */}
      <header
        className="fixed top-0 left-0 w-full z-50 bg-cover bg-center shadow-lg"
        style={{ backgroundImage: "url('/images/iponan2.jpg')" }}
      >
        <div className="absolute inset-0 bg-green-900 bg-opacity-70"></div>
        <div className="relative max-w-5xl mx-auto flex items-center justify-between px-6 py-3 md:py-6">
          <img
            src="/images/logo.png"
            alt="Barangay Logo"
            className="h-12 w-12 md:h-20 md:w-20 rounded-full border-2 border-white shadow"
          />
          <div className="text-center text-white px-2">
            <h1 className="text-lg md:text-2xl font-bold uppercase">Barangay Resident Registration</h1>
            <p className="text-xs md:text-sm opacity-90 italic">Official Government Service Portal</p>
          </div>
          <img
            src="/images/cdologo.png"
            alt="Gov Seal"
            className="h-17 w-12 md:h-20 md:w-20 rounded-full border-white shadow"
          />
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 p-8 pt-40 md:pt-56 space-y-8">
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
          <SectionTitle title="Personal Information" />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Email Address *" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
            <TextField label="First Name *" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
            <TextField label="Middle Name" name="middle_name" value={formData.middle_name} onChange={handleChange} error={errors.middle_name} />
            <TextField label="Last Name *" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
            <TextField label="Birth Date *" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} error={errors.birth_date} />
            <TextField label="Birth Place" name="birth_place" value={formData.birth_place} onChange={handleChange} error={errors.birth_place} />
            <TextField label="Religion" name="religion" value={formData.religion} onChange={handleChange} error={errors.religion} />
            <TextField label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} error={errors.nationality} />
            {computedAge && (
              <div className="grid gap-2">
                <Label className="font-medium">Age</Label>
                <div className="p-2 border rounded bg-gray-100 text-gray-700">{computedAge}</div>
              </div>
            )}
            <SelectField label="Zone *" name="zone_id" value={formData.zone_id} onChange={handleChange} error={errors.zone_id} options={zones.map((z) => z.zone)} optionValues={zones.map((z) => z.id.toString())} />
            <SelectField label="Gender *" name="gender" value={formData.gender} onChange={handleChange} error={errors.gender} options={["Male", "Female", "Other"]} />
            <SelectField label="Civil Status *" name="civil_status" value={formData.civil_status} onChange={handleChange} error={errors.civil_status} options={["Single", "Married", "Widow", "Other"]} />
          </div>

          <SectionTitle title="Household Information" />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Total Household" name="total_household" type="number" value={formData.total_household} onChange={handleChange} error={errors.total_household} />
            <TextField label="Relation to Head of Family" name="relationto_head_of_family" value={formData.relationto_head_of_family} onChange={handleChange} error={errors.relationto_head_of_family} />
            <TextField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} error={errors.occupation} />
            <TextField label="Household No" name="household_no" value={formData.household_no} onChange={handleChange} error={errors.household_no} />
          </div>

          <SectionTitle title="Additional Information" />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Skills" name="skills" value={formData.skills} onChange={handleChange} error={errors.skills} />
            <TextField label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} error={errors.remarks} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image" className="font-medium">Upload Valid Photo</Label>
            <Input id="image" type="file" accept="image/*" onChange={(e) => handleChange("image", e.target.files?.[0] || null)} className="border rounded-lg p-2 bg-white" />
            <InputError message={errors.image} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-28 h-28 mt-3 object-cover rounded-full border shadow" />}
          </div>

          {/* Modern Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button
              type="submit"
              disabled={processing}
              className="flex items-center justify-center w-full sm:w-auto py-3 px-8 text-white text-lg font-semibold rounded-lg shadow-md bg-blue-900 hover:bg-blue-800 transition-all"
            >
              {processing && <LoaderCircle className="h-5 w-5 mr-2 animate-spin" />}
              {processing ? "Submitting…" : "Register"}
            </Button>
            <Button
              type="button"
              onClick={() => setCancelDialogOpen(true)}
              className="w-full sm:w-auto py-3 px-8 text-lg font-semibold rounded-lg shadow-md bg-red-600 hover:bg-red-700 text-white transition-all"
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>

      {/* Cancel Modal */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">Cancel Registration</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to cancel? All entered data will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <Button
              type="button"
              onClick={() => setCancelDialogOpen(false)}
              className="w-full sm:w-auto px-8 py-2.5 text-sm font-semibold rounded-lg shadow-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-all"
            >
              No, Stay Here
            </Button>
            <Button
              type="button"
              onClick={confirmCancel}
              className="w-full sm:w-auto px-8 py-2.5 text-sm font-semibold rounded-lg shadow-md bg-red-600 hover:bg-red-700 text-white transition-all"
            >
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* Helper Components */
function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold text-blue-900 border-b pb-2">{title}</h2>;
}

function TextField({ label, name, type = "text", value, onChange, error }: { label: string; name: string; type?: string; value: any; onChange: (f: string, v: any) => void; error?: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name} className="font-medium">{label}</Label>
      <Input id={name} name={name} type={type} value={value} onChange={(e) => onChange(name, e.target.value)} className="rounded-lg border-gray-300" />
      {error && <InputError message={error} />}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, options, optionValues }: { label: string; name: string; value: any; onChange: (f: string, v: any) => void; error?: string; options: string[]; optionValues?: string[] }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name} className="font-medium">{label}</Label>
      <select id={name} value={value} onChange={(e) => onChange(name, e.target.value)} className="border rounded-lg p-2 bg-white">
        <option value="">Select {label}</option>
        {options.map((opt, i) => <option key={opt} value={optionValues ? optionValues[i] : opt}>{opt}</option>)}
      </select>
      {error && <InputError message={error} />}
    </div>
  );
}
