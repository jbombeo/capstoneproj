import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Home, User, ShieldCheck, FileText, Settings, Menu, X, LogOut, MessageSquare, ClipboardList } from "lucide-react";

interface Official {
  id: number;
  position: string;
  complete_name: string;
  contact: string;
  address: string;
  term_start: string;
  term_end: string;
  status: string;
  image?: string;
}

export default function OfficialProfile({ officials }: { officials: Official[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { post } = useForm(); // ✅ added post function

  const menu = [
    { name: "Home", icon: Home, href: "/resident/home" },
    { name: "Profile", icon: User, href: "/resident/profile" },
    { name: "Barangay Official", icon: ShieldCheck, href: "/resident/officials" },
    { name: "Request Document", icon: FileText, href: "/resident/document-requests" },
    { name: "Blotter", icon: ClipboardList, href: "/resident/blotters" },
    { name: "Suggest", icon: MessageSquare, href: "/resident/feedback" },
    { name: "Settings", icon: Settings, href: "/resident/settings" },
  ];

  const handleLogout = () => post("/logout");

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white";
      case "inactive":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white";
      case "leave":
        return "bg-gradient-to-r from-yellow-300 to-yellow-500 text-gray-900";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getPositionClasses = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes("captain")) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (pos.includes("councilor")) return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    if (pos.includes("secretary") || pos.includes("treasurer"))
      return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
    return "bg-gray-200 text-gray-900";
  };

  return (
    <>
      <Head title="Barangay Officials" />
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-0 z-40 lg:static lg:w-80 bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl flex flex-col transition-transform duration-300 overflow-y-auto ${
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
                className="flex items-center p-4 rounded-lg hover:bg-green-700/50 text-white transition group"
              >
                <item.icon className="w-5 h-5 mr-4 text-white group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
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
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 lg:p-12 text-white shadow-lg">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-6 justify-between">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-12 h-12" />
                <div>
                  <h2 className="text-2xl lg:text-4xl font-bold">Barangay Officials</h2>
                  <p className="mt-2 text-blue-100 text-sm lg:text-base">All officials in your barangay</p>
                </div>
              </div>
              {/* Mobile Menu Button */}
              <button
                className="absolute top-6 right-6 lg:hidden text-white bg-blue-700/50 p-1 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Officials Grid */}
          <div className="max-w-7xl mx-auto p-6 lg:p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {officials.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-16">No officials available.</p>
            ) : (
              officials.map((official) => (
                <div
                  key={official.id}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 hover:shadow-xl transition"
                >
                  <img
                    src={official.image ? `/storage/${official.image}` : "/default-avatar.png"}
                    alt={official.complete_name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500"
                  />

                  <h3 className="text-xl font-bold text-gray-900 text-center">{official.complete_name}</h3>

                  <span
                    className={`px-4 py-1 rounded-full font-medium text-sm ${getPositionClasses(
                      official.position
                    )} transition-transform transform hover:scale-105 hover:shadow-lg`}
                  >
                    {official.position}
                  </span>

                  {official.status && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(
                        official.status
                      )}`}
                    >
                      {official.status}
                    </span>
                  )}

                  <div className="mt-2 text-gray-600 text-center text-sm">
                    <p>Contact: {official.contact}</p>
                    <p>Address: {official.address}</p>
                    <p>
                      Term: {official.term_start} - {official.term_end}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}
