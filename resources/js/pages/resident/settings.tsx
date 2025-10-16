import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
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
} from "lucide-react";
import Heading from "@/components/heading";
import { type PropsWithChildren } from "react";

export default function SettingsLayout({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { url } = usePage(); // get current URL from Inertia

  const menuItems = [
    { label: "Home", icon: Home, href: "/resident/home" },
    { label: "Profile", icon: User, href: "/resident/profile" },
    { label: "Barangay Official", icon: ShieldCheck, href: "/resident/officials" },
    { label: "Request Document", icon: FileText, href: "/resident/document-requests" },
    { label: "Blotter", icon: BookOpen, href: "/resident/blotter" },
    { label: "Settings", icon: Settings, href: "/resident/settings" },
  ];

  const handleLogout = () => {
    // Replace with Inertia.post("/logout") later
    console.log("Logging out...");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:w-72
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo Section */}
        <div className="relative flex flex-col items-center justify-center border-b border-blue-700 p-6">
          <button
            className="absolute right-6 top-6 text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-sm text-blue-200">Manage your account</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-6">
          {menuItems.map(({ label, icon: Icon, href }) => {
            const isActive = url.startsWith(href);
            return (
              <Link
                key={label}
                href={href}
                className={`group flex items-center rounded-lg p-3 transition
                  ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-white hover:bg-blue-700/50"
                  }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : "text-blue-200"
                  }`}
                />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-blue-700 p-6">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center justify-center rounded-lg bg-blue-700/50 p-3 text-white transition hover:bg-red-600"
          >
            <LogOut className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
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
        <header className="relative bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white shadow-lg lg:p-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Heading
              title="Settings"
              description="Manage your profile and account settings"
            />
            {/* Mobile Menu Button */}
            <button
              className="rounded-lg bg-blue-700/50 p-2 text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Content */}
        <section className="mx-auto max-w-5xl p-6 lg:p-10">{children}</section>
      </main>
    </div>
  );
}
