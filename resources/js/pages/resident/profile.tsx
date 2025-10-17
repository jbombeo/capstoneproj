import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
  Home,
  User,
  ShieldCheck,
  FileText,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react";

interface Resident {
  id: number;
  user_id: number;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  birth_date?: string;
  birth_place?: string;
  zone_id: number;
  total_household?: number;
  relationto_head_of_family?: string;
  civil_status?: string;
  occupation?: string;
  household_no?: number;
  religion?: string;
  nationality?: string;
  gender: string;
  skills?: string;
  remarks?: string;
  image?: string;
}

export default function ResidentProfile({ resident }: { resident: Resident }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [preview, setPreview] = useState(
    resident.image ? `/storage/${resident.image}` : null
  );

  const handleLogout = () => console.log("/Logout"); // replace with actual logout

  const { url } = usePage<{ url: string }>();

  const menu = [
    { name: "Home", icon: Home, href: "/resident/home" },
    { name: "Profile", icon: User, href: "/resident/profile" },
    { name: "Barangay Official", icon: ShieldCheck, href: "/resident/officials" },
    { name: "Request Document", icon: FileText, href: "/resident/document-requests" },
    { name: "Settings", icon: Settings, href: "/resident/settings" },
  ];

  const isActive = (href: string) => url.startsWith(href);

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const diff = Date.now() - birth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <>
      <Head title="Resident Profile" />
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-0 z-40 flex w-80 flex-col bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* Logo Section */}
          <div className="relative flex flex-col items-center justify-center p-8 border-b border-blue-700">
            <button
              className="absolute top-6 right-6 text-white lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-bold text-white text-center">
              Barangay Portal
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-1">
            {menu.map(({ name, icon: Icon, href }) => (
              <a
                key={name}
                href={href}
                className={`flex items-center rounded-lg p-4 transition group ${
                  isActive(href)
                    ? "bg-blue-700/50 text-white"
                    : "text-white hover:bg-blue-700/50"
                }`}
              >
                <Icon className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{name}</span>
              </a>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-blue-700 p-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center rounded-lg bg-blue-700/50 p-4 text-white transition hover:bg-red-600 group"
            >
              <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 lg:p-12 text-white shadow-lg">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div className="flex items-center gap-4">
                <User className="w-12 h-12" />
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold">My Profile</h2>
                  <p className="mt-2 text-blue-100">
                    View and manage your personal information
                  </p>
                </div>
              </div>
              <button
                className="lg:hidden rounded-lg bg-blue-700/50 p-2 text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="mx-auto max-w-7xl p-6 lg:p-10">
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              {/* Top Section */}
              <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 p-8">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                  <img
                    src={preview || "/default-avatar.png"}
                    alt="Profile"
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {resident.first_name} {resident.middle_name || ""}{" "}
                      {resident.last_name}
                    </h3>
                    <p className="mt-1 text-gray-600">{resident.email}</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-sm text-white">
                        Zone {resident.zone_id}
                      </span>
                      <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                        {resident.gender}
                      </span>
                      <span className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                        Age {calculateAge(resident.birth_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8 space-y-10">
                {/* Personal Info */}
                <section>
                  <h4 className="mb-6 text-xl font-bold text-gray-900">
                    Personal Information
                  </h4>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Info
                      label="Birth Date"
                      value={resident.birth_date}
                      type="date"
                    />
                    <Info label="Birth Place" value={resident.birth_place} />
                    <Info label="Civil Status" value={resident.civil_status} />
                    <Info label="Occupation" value={resident.occupation} />
                    <Info label="Religion" value={resident.religion} />
                    <Info label="Nationality" value={resident.nationality} />
                  </div>
                </section>

                <hr />

                {/* Household Info */}
                <section>
                  <h4 className="mb-6 text-xl font-bold text-gray-900">
                    Household Information
                  </h4>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Info label="Total Household" value={resident.total_household} />
                    <Info label="Household Number" value={resident.household_no} />
                    <Info
                      label="Relation to Head"
                      value={resident.relationto_head_of_family}
                    />
                  </div>
                </section>

                <hr />

                {/* Additional Info */}
                <section>
                  <h4 className="mb-6 text-xl font-bold text-gray-900">
                    Additional Information
                  </h4>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Info label="Skills" value={resident.skills} />
                    <Info label="Remarks" value={resident.remarks} />
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

/* Reusable Info component */
function Info({
  label,
  value,
  type,
}: {
  label: string;
  value?: string | number | null;
  type?: "date";
}) {
  let displayValue = value;

  if (type === "date" && value) {
    const date = new Date(value as string);
    displayValue = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900">{displayValue || "N/A"}</p>
    </div>
  );
}
