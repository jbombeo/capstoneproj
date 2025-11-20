import { ReactNode, useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import {
  Home,
  Users,
  Shield,
  Calendar,
  Megaphone,
  FileText,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
} from "lucide-react";

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface LayoutProps {
  children: ReactNode;
}

export default function SKLayout({ children }: LayoutProps) {
  const { user = { name: "", email: "", role: "" } } =
    usePage<{ user: AuthUser }>().props;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const form = useForm({});
  const logout = () => form.post("/logout");

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/sk/dashboard" },
  { id: "youth", label: "Youth Registry", icon: Users, href: "/sk/youth" },
  { id: "officials", label: "SK Officials", icon: Shield, href: "/sk/officials" },
  { id: "projects", label: "Programs & Projects", icon: Calendar, href: "/sk/projects" },
  { id: "announcements", label: "Public Announcements", icon: Megaphone, href: "/sk/announcements" },

  // SCHOLARSHIPS
  { id: "scholarships", label: "Scholarship Programs", icon: GraduationCap, href: "/sk/scholarships" },

  // SCHOLARSHIP APPLICATIONS (NEW)
  { id: "scholarship-applications", label: "Scholarship Applications", icon: FileText, href: "/sk/scholarship-applications" },

  // SERVICE REQUESTS
  // { id: "requests", label: "Service Requests", icon: FileText, href: "/sk/requests" },
];


  const active = (url: string) => usePage().url.startsWith(url);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ====== HEADER / TOP BAR ====== */}
      <nav className="bg-gradient-to-r from-green-600 to-blue-700 shadow-md border-b border-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-30">
            {/* --- Left Section (Logos + Title) --- */}
            <div className="flex items-center gap-4">
              {/* Sidebar Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 lg:hidden"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Logos */}
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo.png"
                  alt="Barangay Logo"
                  className="h-12 w-12 md:h-25 md:w-25 rounded-full border-2 border-white shadow-lg"
                />
                <img
                  src="/images/sk.png"
                  alt="SK Logo"
                  className="h-12 w-12 md:h-25 md:w-25 rounded-full border-2 border-white shadow-lg"
                />
              </div>

              {/* Title */}
              <div className="ml-3">
                <h1 className="text-lg md:text-2xl font-extrabold leading-tight tracking-tight">
                  Barangay SK Management Portal
                </h1>
                <p className="text-xs md:text-sm text-white/90 font-medium">
                  Sangguniang Kabataan Information System
                </p>
              </div>
            </div>

            {/* --- Right Section (User + Notifications) --- */}
            <div className="flex items-center gap-5">
              <button className="relative p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg transition"
                >
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "U"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-white/80 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-5 h-5 text-white/80" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                      <p className="text-xs text-blue-600 mt-1 font-semibold uppercase">
                        {user?.role}
                      </p>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-bold"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ====== MAIN CONTENT AREA ====== */}
      <div className="flex max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static lg:translate-x-0 inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out border-r border-gray-200`}
        >
          <div className="h-full overflow-y-auto p-6 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all font-bold ${
                  active(item.href)
                    ? "bg-gradient-to-r from-green-600 to-blue-700 text-white shadow-md scale-[1.02]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Section */}
        <main className="flex-1 p-6 lg:p-8 bg-gray-50">{children}</main>
      </div>

      {/* ====== FOOTER ====== */}
      <footer className="bg-white border-t text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} Barangay SK Management Portal. All Rights Reserved.
      </footer>
    </div>
  );
}
