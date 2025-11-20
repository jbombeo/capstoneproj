import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import {
  Menu,
  X,
  LogOut,
  Home,
  User,
  ShieldCheck,
  FileText,
  ClipboardList,
  Settings,
  Eye,
  PlusCircle,
  MessageSquare,
  Phone,           // ✅ Added for hotline card
} from "lucide-react";

interface Hotline {
  id: number;
  name: string;
  number: string;
}

interface Blotter {
  id: number;
  complainant: string;
  complainant_address?: string;
  complainant_age?: number;
  complainant_contact?: string;
  complainee: string;
  complainee_address?: string;
  complainee_age?: number;
  complainee_contact?: string;
  complaint: string;
  status: string;
  handled_by?: string;
  action?: string;
  incident_datetime?: string;
  created_at: string;
}

type BlotterFormData = {
  complainant: string;
  complainant_address: string;
  complainant_age: string;
  complainant_contact: string;
  complainee: string;
  complainee_address: string;
  complainee_age: string;
  complainee_contact: string;
  complaint: string;
  incident_datetime: string;
};

export default function ResidentBlotter() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlotter, setSelectedBlotter] = useState<Blotter | null>(null);

  const { props }: any = usePage();
  const { blotters, user, hotlines } = props;

  const { data, setData, post, processing, reset, errors } =
    useForm<BlotterFormData>({
      complainant: user?.name || "",
      complainant_address: "",
      complainant_age: "",
      complainant_contact: "",
      complainee: "",
      complainee_address: "",
      complainee_age: "",
      complainee_contact: "",
      complaint: "",
      incident_datetime: "",
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/resident/blotters", {
      onSuccess: () => {
        reset();
        setShowModal(false);
      },
    });
  };

  const menu = [
    { name: "Home", icon: Home, href: "/resident/home" },
    { name: "Profile", icon: User, href: "/resident/profile" },
    { name: "Officials", icon: ShieldCheck, href: "/resident/officials" },
    { name: "Documents", icon: FileText, href: "/resident/document-requests" },
    { name: "Blotter", icon: ClipboardList, href: "/resident/blotters" },
    { name: "Suggest", icon: MessageSquare, href: "/resident/feedback" },
    { name: "Settings", icon: Settings, href: "/resident/settings" },
  ];

  const { url } = usePage<{ url: string }>();
  const isActive = (href: string) => url.startsWith(href);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData(e.target.name as keyof BlotterFormData, e.target.value);
  };
  const handleLogout = () => post("/logout");
  const statusStyles: Record<string, string> = {
    unsettled: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    settled: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    scheduled: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
  };

  return (
    <>
      <Head title="Resident Blotter" />

      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col bg-gradient-to-b from-blue-900 to-blue-800 shadow-xl transform transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="relative flex flex-col items-center justify-center p-6 border-b border-blue-700">
            <button
              className="absolute top-6 right-6 text-white lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <img src="/images/logo.png" alt="Logo" className="w-20 h-20 mb-3" />
            <h1 className="text-xl font-bold text-white text-center">
              Barangay Portal
            </h1>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menu.map(({ name, icon: Icon, href }) => (
              <a
                key={name}
                href={href}
                className={`flex items-center rounded-lg p-3 transition ${
                  isActive(href)
                    ? "bg-blue-700/60 text-white"
                    : "text-white hover:bg-blue-700/50"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {name}
              </a>
            ))}
          </nav>

          <div className="border-t border-blue-700 p-4">
            <button
              className="flex items-center justify-center w-full bg-blue-700/50 text-white py-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => console.log("logout")}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col">
          <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg p-4 sm:p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Blotter Records</h2>
              <p className="text-blue-100 text-sm sm:text-base">
                File and view your complaints
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="bg-white/20 hover:bg-white/30 text-white py-2 px-3 sm:px-4 rounded-lg flex items-center text-sm sm:text-base"
                onClick={() => setShowModal(true)}
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Add Blotter
              </button>
              <button
                className="lg:hidden bg-blue-700/50 p-2 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* ---------------------------------------------------------------------- */}
          {/* 🔥 EMERGENCY HOTLINES — GLASS MODERN CARDS                            */}
          {/* ---------------------------------------------------------------------- */}
          <section className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Emergency Hotlines
            </h3>

            {!hotlines || hotlines.length === 0 ? (
              <p className="text-gray-500">No hotlines available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotlines.map((h: Hotline) => (
                  <div
                    key={h.id}
                    className="rounded-2xl p-5 bg-white/60 backdrop-blur-md shadow-lg border border-gray-200 hover:shadow-xl transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {h.name}
                      </h4>

                      <div className="bg-blue-100 text-blue-700 p-2 rounded-full shadow">
                        <Phone className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4">{h.number}</p>

                    <a
                      href={`tel:${h.number}`}
                      className="w-full block text-center py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
                    >
                      Call Now
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* ---------------------------------------------------------------------- */}

          {/* Table Section */}
          <section className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-10 max-w-6xl mx-auto w-full">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                My Filed Blotters
              </h3>

              {!blotters || blotters.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  You have no blotter records yet.
                </p>
              ) : (
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50 text-gray-700 hidden sm:table-header-group">
                    <tr>
                      <th className="p-3 text-left">Complainant</th>
                      <th className="p-3 text-left">Complainee</th>
                      <th className="p-3 text-left">Complaint</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Incident</th>
                      <th className="p-3 text-left">Filed On</th>
                      <th className="p-3 text-left">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {blotters.map((b: Blotter) => (
                      <tr
                        key={b.id}
                        className="border-t hover:bg-gray-50 sm:table-row block sm:table-row mb-4 sm:mb-0 bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none p-3 sm:p-0"
                      >
                        <td className="p-3 sm:table-cell block">
                          {b.complainant}
                        </td>
                        <td className="p-3 sm:table-cell block">
                          {b.complainee}
                        </td>
                        <td className="p-3 sm:table-cell block">{b.complaint}</td>
                        <td className="p-3 sm:table-cell block">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                              statusStyles[b.status?.toLowerCase()] ||
                              "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 sm:table-cell block">
                          {b.incident_datetime
                            ? new Date(b.incident_datetime).toLocaleString()
                            : "—"}
                        </td>
                        <td className="p-3 sm:table-cell block">
                          {new Date(b.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 sm:table-cell block">
                          <button
                            onClick={() => setSelectedBlotter(b)}
                            className="text-blue-600 hover:underline flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* 🔽 Modals remain unchanged — your existing code continues from here */}
    </>
  );
}
