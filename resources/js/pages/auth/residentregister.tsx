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

interface HeadResident {
  id: number;
  zone_id: number;
  full_name: string;
}

interface RegisterResidentProps {
  zones: Zone[];
  heads: HeadResident[];
}

export default function RegisterResident({ zones, heads }: RegisterResidentProps) {
  const initialState = {
    email: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    birth_date: "",
    birth_place: "",
    age: "",
    zone_id: "",
    relationto_head_of_family: "",
    civil_status: "",
    occupation: "",
    religion: "",
    nationality: "Filipino",
    gender: "",
    skills: "",
    remarks: "",
    family_head_id: "",
    image: null as File | null,
  };

  const [formData, setFormData] = useState(initialState);
  const [filteredHeads, setFilteredHeads] = useState<HeadResident[]>([]);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Auto calculate age
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

  /**
   * Behavior (Option A):
   * - If relation === "Head": show zone selector; do not show Select Head dropdown.
   * - If relation !== "Head": hide zone selector; show Select Head dropdown.
   *   - Select Head dropdown will list heads from the database. Because zone is hidden,
   *     choose to show ALL heads (you can display zone in option label), and when the user
   *     selects a head we auto-assign formData.zone_id = head.zone_id so the backend gets correct zone.
   */

  // Keep filteredHeads in sync:
  useEffect(() => {
    // If registering as Head, we don't need the heads list (we hide the Select Head dropdown).
    if (formData.relationto_head_of_family === "Head") {
      setFilteredHeads([]);
      // Clear family_head_id when switching to Head
      setFormData((prev) => ({ ...prev, family_head_id: "" }));
      return;
    }

    // When not Head, show all heads from DB (you can modify to filter by zone if you change UX)
    setFilteredHeads(heads);
  }, [formData.relationto_head_of_family, heads]);

  // When user selects a head (family_head_id) auto-assign the zone_id from that head
  useEffect(() => {
    if (!formData.family_head_id) return;
    const head = heads.find((h) => String(h.id) === String(formData.family_head_id));
    if (head) {
      // Auto-set zone_id to head's zone
      setFormData((prev) => ({ ...prev, zone_id: String(head.zone_id) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.family_head_id]);

  const handleChange = (field: string, value: any) => {
    // If user changes relationto_head_of_family to Head, clear family_head_id and maybe zone if necessary.
    if (field === "relationto_head_of_family") {
      // set relation and clear family head selection when switching to Head
      setFormData((prev) => ({
        ...prev,
        relationto_head_of_family: value,
        family_head_id: value === "Head" ? "" : prev.family_head_id,
        // if switching to Head, keep zone empty so user can select; if switching away, zone will be auto-set when head chosen
        zone_id: value === "Head" ? prev.zone_id : prev.zone_id,
      }));
      return;
    }

    // Normal change
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "image" && value) {
      setImagePreview(URL.createObjectURL(value));
    }
  };

  const requiredFields = ["email", "last_name", "first_name", "birth_date", "gender"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = "This field is required";
      }
    });

    // If the registrant is Head, zone is required
    if (formData.relationto_head_of_family === "Head" && !formData.zone_id) {
      newErrors["zone_id"] = "Zone is required for head of family.";
    }

    // If not Head, family_head_id must be selected
    if (formData.relationto_head_of_family !== "Head" && !formData.family_head_id) {
      newErrors["family_head_id"] = "Please select your head of family.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    setErrors({});

    // Build form data for file upload
    const body = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k === "image") {
        if (v) body.append(k, v as File);
      } else {
        body.append(k, v === null || v === undefined ? "" : String(v));
      }
    });

    router.post("/resident/register", body, {
      // because we pass FormData already, no need for forceFormData (but Inertia accepts it)
      forceFormData: true,
      onSuccess: () => {
        setFormData(initialState);
        setImagePreview(null);
        toast.success("Registration submitted! Please wait for admin approval.");
        router.visit("/login");
      },
      onError: (err: Record<string, string>) => {
        setErrors(err || {});
        toast.error("Failed to register. Please check the form.");
      },
      onFinish: () => setProcessing(false),
    });
  };

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

            {/* Show Zone ONLY when registering as Head */}
            {formData.relationto_head_of_family === "Head" && (
              <SelectField
                label="Zone *"
                name="zone_id"
                value={formData.zone_id}
                onChange={handleChange}
                error={errors.zone_id}
                options={zones.map((z) => z.zone)}
                optionValues={zones.map((z) => z.id.toString())}
              />
            )}

            <SelectField
              label="Gender *"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={errors.gender}
              options={["Male", "Female", "Other"]}
            />

            <SelectField
              label="Civil Status"
              name="civil_status"
              value={formData.civil_status}
              onChange={handleChange}
              options={["Single", "Married", "Widow", "Other"]}
            />
          </div>

          <SectionTitle title="Household Information" />
          <div className="grid gap-6 sm:grid-cols-2">
            <SelectField
              label="Relation to Head of Family *"
              name="relationto_head_of_family"
              value={formData.relationto_head_of_family}
              onChange={handleChange}
              error={errors.relationto_head_of_family}
              options={[
                "Head",
                "Wife",
                "Husband",
                "Son",
                "Daughter",
                "Brother",
                "Sister",
                "Relative",
                "Boarder",
                "Other",
              ]}
              optionValues={[
                "Head",
                "Wife",
                "Husband",
                "Son",
                "Daughter",
                "Brother",
                "Sister",
                "Relative",
                "Boarder",
                "Other",
              ]}
            />

            <TextField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />

            {/* Show Select Head dropdown only if NOT Head */}
            {formData.relationto_head_of_family && formData.relationto_head_of_family !== "Head" && (
              <SelectField
                label="Select Head of Family *"
                name="family_head_id"
                value={formData.family_head_id}
                onChange={handleChange}
                error={errors.family_head_id}
                // show full_name + zone for clarity in options
                options={filteredHeads.map((h) => {
                  const zoneLabel = zones.find((z) => z.id === h.zone_id)?.zone ?? `Zone ${h.zone_id}`;
                  return `${h.full_name} — ${zoneLabel}`;
                })}
                optionValues={filteredHeads.map((h) => h.id.toString())}
              />
            )}
          </div>

          <SectionTitle title="Additional Information" />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField label="Skills" name="skills" value={formData.skills} onChange={handleChange} />
            <TextField label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image" className="font-medium">Upload Valid Photo</Label>
            <Input id="image" type="file" accept="image/*" onChange={(e) => handleChange("image", e.target.files?.[0] || null)} className="border rounded-lg p-2 bg-white" />
            <InputError message={errors.image} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-28 h-28 mt-3 object-cover rounded-full border shadow" />}
          </div>

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

function TextField({ label, name, type = "text", value, onChange, error }: any) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name} className="font-medium">{label}</Label>
      <Input id={name} name={name} type={type} value={value} onChange={(e) => onChange(name, e.target.value)} className="rounded-lg border-gray-300" />
      {error && <InputError message={error} />}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, options, optionValues }: any) {
  return (
    <div className="grid gap-2">
      <Label className="font-medium">{label}</Label>
      <select
        id={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="border rounded-lg p-2 bg-white"
      >
        <option value="">{`Select ${label}`}</option>
        {options.map((opt: string, i: number) => (
          <option key={i} value={optionValues ? optionValues[i] : opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <InputError message={error} />}
    </div>
  );
}
