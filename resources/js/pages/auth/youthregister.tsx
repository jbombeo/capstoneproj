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

export default function YouthRegister() {
  const initialState = {
    email: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    birth_date: "",
    birth_place: "",
    age: "",
    contact_number: "",
    gender: "", // ✅ ADDED
    skills: [] as string[],
    image: null as File | null,
  };

  const [formData, setFormData] = useState(initialState);
  const [skillsInput, setSkillsInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  /** Auto-compute age */
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

  /** Handle form changes */
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "image" && value) {
      setImagePreview(URL.createObjectURL(value));
    }
  };

  /** Add skill */
  const addSkill = () => {
    const skill = skillsInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
    setSkillsInput("");
  };

  /** Remove skill */
  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  /** VALIDATION UPDATED HERE */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const requiredFields = ["email", "first_name", "last_name", "birth_date", "gender"]; // ✅ ADDED gender
    requiredFields.forEach((f) => {
      if (!formData[f as keyof typeof formData]) {
        newErrors[f] = "This field is required";
      }
    });

    if (!formData.image) {
      newErrors.image = "2x2 photo is required.";
    }

    if (Number(computedAge) > 21) {
      newErrors.age = "Age must not be more than 21 years old.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Submit form */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setProcessing(true);
    setErrors({});

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "skills") {
        (value as string[]).forEach((skill) => data.append("skills[]", skill));
      } else if (key === "age") {
        data.append("age", computedAge ? computedAge.toString() : "0");
      } else if (value !== null) {
        data.append(key, value as any);
      }
    });

    router.post("/youth/register", data, {
      forceFormData: true,
      onSuccess: () => {
        toast.success("Registration submitted! Please wait for SK approval.");
        router.visit("/login");
      },
      onError: (err: Record<string, string>) => {
        setErrors(err);
        toast.error("Failed to register. Please check your input.");
      },
      onFinish: () => setProcessing(false),
    });
  };

  /** Cancel registration */
  const confirmCancel = () => {
    setCancelDialogOpen(false);
    router.visit("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Youth Registration" />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Header */}
      <header
        className="fixed top-0 left-0 w-full z-50 bg-cover bg-center shadow-lg"
        style={{ backgroundImage: "url('/images/iponan2.jpg')" }}
      >
        <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>

        <div className="relative max-w-5xl mx-auto flex items-center justify-between px-6 py-3 md:py-6">
          <img
            src="/images/logo.png"
            alt="Barangay Logo"
            className="h-12 w-12 md:h-20 md:w-20 rounded-full border-2 border-white shadow"
          />
          <div className="flex flex-col items-center justify-center text-center text-white space-y-1">
            <img
              src="/images/sk.png"
              alt="SK Logo"
              className="h-12 w-12 md:h-16 md:w-16 mb-1 rounded-full border-2 border-white shadow-md"
            />
            <h1 className="text-lg md:text-2xl font-bold uppercase">
              Sangguniang Kabataan Youth Registration
            </h1>
            <p className="text-xs md:text-sm opacity-90 italic">
              Official SK Membership Portal
            </p>
          </div>
          <img
            src="/images/cdologo.png"
            alt="Gov Seal"
            className="h-17 w-12 md:h-20 md:w-20 rounded-full border-white shadow"
          />
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-200 p-8 pt-40 md:pt-56 space-y-8">
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-8"
        >
          <h2 className="text-xl font-semibold text-blue-900 border-b pb-2">
            Youth Information
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <TextField
              label="First Name *"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={errors.first_name}
            />
            <TextField
              label="Middle Name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              error={errors.middle_name}
            />
            <TextField
              label="Last Name *"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={errors.last_name}
            />
            <TextField
              label="Birth Date *"
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              error={errors.birth_date}
            />

            <TextField
              label="Birth Place"
              name="birth_place"
              value={formData.birth_place}
              onChange={handleChange}
              error={errors.birth_place}
            />

            <TextField
              label="Contact Number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              error={errors.contact_number}
            />

            {/* ✅ GENDER DROPDOWN FIELD */}
            <div className="grid gap-2">
              <Label className="font-medium">Gender *</Label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="border rounded-lg p-2 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <InputError message={errors.gender} />}
            </div>

            {computedAge && (
              <div className="grid gap-2">
                <Label className="font-medium">Age</Label>
                <div className="p-2 border rounded bg-gray-100 text-gray-700">
                  {computedAge}
                </div>
                {errors.age && <InputError message={errors.age} />}
              </div>
            )}
          </div>

          {/* SKILLS */}
          <div className="grid gap-4">
            <Label className="font-medium">Skills (optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={skillsInput}
                placeholder="Type a skill and press Add"
                onChange={(e) => setSkillsInput(e.target.value)}
              />
              <Button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-blue-600 hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="grid gap-2">
            <Label htmlFor="image" className="font-medium">
              Upload 2x2 Photo *
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChange("image", e.target.files?.[0] || null)
              }
              className="border rounded-lg p-2 bg-white"
            />
            <InputError message={errors.image} />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-28 h-28 mt-3 object-cover rounded-full border shadow"
              />
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button
              type="submit"
              disabled={processing}
              className="flex items-center justify-center w-full sm:w-auto py-3 px-8 text-white text-lg font-semibold rounded-lg shadow-md bg-blue-900 hover:bg-blue-800 transition-all"
            >
              {processing && (
                <LoaderCircle className="h-5 w-5 mr-2 animate-spin" />
              )}
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

      {/* CANCEL DIALOG */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Cancel Registration
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to cancel? All entered data will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <Button
              type="button"
              onClick={() => setCancelDialogOpen(false)}
              className="w-full sm:w-auto px-8 py-2.5 text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
            >
              No, Stay Here
            </Button>
            <Button
              type="button"
              onClick={confirmCancel}
              className="w-full sm:w-auto px-8 py-2.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Helper */
function TextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: (f: string, v: any) => void;
  error?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name} className="font-medium">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="rounded-lg border-gray-300"
      />
      {error && <InputError message={error} />}
    </div>
  );
}
