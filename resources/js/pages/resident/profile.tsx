import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import {
  Home,
  User,
  ShieldCheck,
  BookOpen,
  Menu,
  X,
  LogOut,
  Settings,
  FileText,
  Edit,
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
  age: number;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, setData, post, errors } = useForm({
    email: resident.email || "",
    first_name: resident.first_name || "",
    middle_name: resident.middle_name || "",
    last_name: resident.last_name || "",
    birth_date: resident.birth_date || "",
    birth_place: resident.birth_place || "",
    age: resident.age || 0,
    zone_id: resident.zone_id || 0,
    total_household: resident.total_household || 1,
    relationto_head_of_family: resident.relationto_head_of_family || "",
    civil_status: resident.civil_status || "",
    occupation: resident.occupation || "",
    household_no: resident.household_no || 0,
    religion: resident.religion || "",
    nationality: resident.nationality || "Filipino",
    gender: resident.gender || "",
    skills: resident.skills || "",
    remarks: resident.remarks || "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState(resident.image ? `/storage/${resident.image}` : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData("image", e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/resident/profile/update`, {
      forceFormData: true,
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleLogout = () => post("/logout");

  const menu = [
    { name: "Home", icon: Home, href: "/resident/home" },
    { name: "Profile", icon: User, href: "/resident/profile" },
    { name: "Barangay Official", icon: ShieldCheck, href: "/resident/officials" },
    { name: "Request Document", icon: FileText, href: "/resident/document-requests" },
    { name: "Blotter", icon: BookOpen, href: "/resident/blotter" },
    { name: "Settings", icon: Settings, href: "/resident/settings" },
  ];

  return (
    <>
      <Head title="Resident Profile" />
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-0 z-40 lg:static lg:w-80 bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo Section */}
          <div className="p-8 border-b border-blue-700 flex flex-col items-center justify-center relative">
            <button
              className="lg:hidden absolute top-6 right-6 text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 flex items-center justify-center">
              <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>

            <h1 className="text-2xl font-bold text-white text-center">Barangay Portal</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-1">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-4 rounded-lg hover:bg-blue-700/50 text-white transition group ${
                  item.name === "Profile" ? "bg-blue-700/50" : ""
                }`}
              >
                <item.icon className="w-5 h-5 mr-4 text-white group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <Link
              href="/resident/settings"
              className="flex items-center p-4 rounded-lg hover:bg-blue-700/50 text-white transition group"
            >
              <Settings className="w-5 h-5 mr-4 text-white group-hover:scale-110 transition-transform" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="p-6 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-4 rounded-lg bg-blue-700/50 hover:bg-red-600 text-white transition group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="absolute top-6 right-6 lg:hidden text-white bg-blue-700/50 p-1 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 lg:p-12 text-white shadow-lg">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <User className="w-12 h-12" />
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold">My Profile</h2>
                    <p className="mt-2 text-blue-100">View and manage your personal information</p>
                  </div>
                </div>
                <button
                  className="lg:hidden text-white bg-blue-700/50 p-2 rounded-lg"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-7 h-7" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="max-w-7xl mx-auto p-6 lg:p-10">
            {/* Profile Display Card */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 relative">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  <Edit className="w-4 h-4" />
                  <span className="font-medium">Edit Profile</span>
                </button>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <img
                    src={preview || "/default-avatar.png"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {resident.first_name} {resident.middle_name || ""} {resident.last_name}
                    </h3>
                    <p className="text-gray-600 mt-1">{resident.email}</p>
                    <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                        Zone {resident.zone_id}
                      </span>
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                        {resident.gender}
                      </span>
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                        Age {resident.age}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8">
                {/* Personal Info */}
                <h4 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Birth Date</p>
                    <p className="text-gray-900">{resident.birth_date || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Birth Place</p>
                    <p className="text-gray-900">{resident.birth_place || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Civil Status</p>
                    <p className="text-gray-900">{resident.civil_status || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Occupation</p>
                    <p className="text-gray-900">{resident.occupation || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Religion</p>
                    <p className="text-gray-900">{resident.religion || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Nationality</p>
                    <p className="text-gray-900">{resident.nationality}</p>
                  </div>
                </div>

                <hr className="my-8" />

                {/* Household Info */}
                <h4 className="text-xl font-bold text-gray-900 mb-6">Household Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Total Household</p>
                    <p className="text-gray-900">{resident.total_household || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Household Number</p>
                    <p className="text-gray-900">{resident.household_no || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Relation to Head</p>
                    <p className="text-gray-900">{resident.relationto_head_of_family || "N/A"}</p>
                  </div>
                </div>

                <hr className="my-8" />

                {/* Additional Info */}
                <h4 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Skills</p>
                    <p className="text-gray-900">{resident.skills || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Remarks</p>
                    <p className="text-gray-900">{resident.remarks || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal (remains same) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          {/* Modal content here, same as before */}
        </div>
      )}
    </>
  );
}
