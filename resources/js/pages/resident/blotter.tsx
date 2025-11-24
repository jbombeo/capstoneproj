// ResidentBlotter.tsx – Responsive Table + Mobile Cards (FULL VERSION)
import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
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
  PlusCircle,
  MessageSquare,
  Phone,
} from "lucide-react";

/* ------------------------------------------------------------------
   TYPES
-------------------------------------------------------------------*/

export interface Hotline {
  id: number;
  name: string;
  number: string;
}

export interface Blotter {
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

  incident_datetime?: string;
  created_at: string;
}

export interface BlotterFormData {
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
}

interface PageProps extends InertiaPageProps {
  user: { name: string } | null;
  hotlines: Hotline[];
  blotters: Blotter[];
}

/* ------------------------------------------------------------------
   MAIN COMPONENT
-------------------------------------------------------------------*/

export default function ResidentBlotter() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { user, blotters, hotlines } = usePage<PageProps>().props;

  /* Form Handling */
  const form = useForm<BlotterFormData>({
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
    form.post("/resident/blotters", {
      onSuccess: () => {
        form.reset();
        setShowModal(false);
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    form.setData(e.target.name as keyof BlotterFormData, e.target.value);
  };

  /* Menu */
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

  const statusStyles: Record<string, string> = {
    unsettled: "bg-red-500 text-white",
    settled: "bg-green-500 text-white",
    scheduled: "bg-blue-500 text-white",
  };

  return (
    <>
      <Head title="Resident Blotter" />

      <div className="min-h-screen flex bg-gray-100">

        {/* Overlay for Mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-blue-900 text-white shadow-xl transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static`}
        >
          <div className="relative p-6 text-center border-b border-blue-700">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-4 top-4 lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            <img src="/images/logo.png" className="w-20 mx-auto mb-3" />
            <h1 className="text-xl font-bold">Barangay Portal</h1>
          </div>

          <nav className="p-4 space-y-1 overflow-y-auto">
            {menu.map(({ name, icon: Icon, href }) => (
              <a
                key={name}
                href={href}
                className={`flex items-center p-3 rounded-lg transition ${
                  isActive(href) ? "bg-blue-700/60 text-white" : "hover:bg-blue-700/40"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {name}
              </a>
            ))}
          </nav>

          <div className="border-t border-blue-700 p-4">
            <button
              onClick={() => form.post("/logout")}
              className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg flex items-center justify-center"
            >
              <LogOut className="w-5 h-5 mr-2" /> Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col">

          {/* Header */}
          <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Blotter Records</h2>
              <p className="text-blue-100">File and view your complaints</p>
            </div>

            <button
              className="lg:hidden p-2 bg-blue-700/40 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </header>

          {/* HOTLINES */}
          <section className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
            <h3 className="text-xl font-semibold mb-4">Emergency Hotlines</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotlines.map((h) => (
                <div
                  key={h.id}
                  className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-gray-900">{h.name}</h4>
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                      <Phone className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{h.number}</p>
                  <a
                    href={`tel:${h.number}`}
                    className="block text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Call Now
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* ------------------------------------------------------------------
              RESPONSIVE TABLE + MOBILE CARDS
          ------------------------------------------------------------------ */}
          <section className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full">
            <div className="bg-white rounded-xl shadow-lg p-6">

              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  My Filed Blotters
                </h3>

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  onClick={() => setShowModal(true)}
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Blotter
                </button>
              </div>

              {/* No Data */}
              {blotters.length === 0 ? (
                <p className="text-gray-500 text-center py-6">
                  You have no blotter records yet.
                </p>
              ) : (
                <>
                  {/* ─────────────────────────────────────
                      MOBILE CARD VERSION
                  ───────────────────────────────────── */}
                  <div className="space-y-4 lg:hidden">
                    {blotters.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-xl border p-4 shadow-sm bg-gray-50 space-y-2"
                      >
                        {/* Header Row */}
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-gray-800">
                            {b.complainee}
                          </p>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              statusStyles[b.status.toLowerCase()]
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>

                        <p className="text-gray-700">
                          <strong>Complaint:</strong> {b.complaint}
                        </p>

                        <p className="text-gray-700">
                          <strong>Complainant:</strong> {b.complainant}
                        </p>

                        <p className="text-gray-700">
                          <strong>Incident:</strong>{" "}
                          {b.incident_datetime
                            ? new Date(b.incident_datetime).toLocaleString()
                            : "—"}
                        </p>

                        <p className="text-gray-700">
                          <strong>Filed:</strong>{" "}
                          {new Date(b.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* ─────────────────────────────────────
                      DESKTOP TABLE VERSION
                  ───────────────────────────────────── */}
                  <div className="overflow-x-auto hidden lg:block">
                    <table className="w-full text-sm border rounded-lg">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="p-3">Complainant</th>
                          <th className="p-3">Complainee</th>
                          <th className="p-3">Complaint</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Incident</th>
                          <th className="p-3">Filed</th>
                        </tr>
                      </thead>

                      <tbody>
                        {blotters.map((b) => (
                          <tr
                            key={b.id}
                            className="border-t hover:bg-gray-50 transition"
                          >
                            <td className="p-3">{b.complainant}</td>
                            <td className="p-3">{b.complainee}</td>
                            <td className="p-3">{b.complaint}</td>
                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  statusStyles[b.status.toLowerCase()]
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="p-3">
                              {b.incident_datetime
                                ? new Date(b.incident_datetime).toLocaleString()
                                : "—"}
                            </td>
                            <td className="p-3">
                              {new Date(b.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* ------------------------------------------------------------------
          ADD BLOTTER MODAL
      ------------------------------------------------------------------ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">File a Blotter</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-gray-600 hover:text-black" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Complainant */}
              <div>
                <h3 className="font-semibold mb-2">Complainant Info</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="complainant"
                    readOnly
                    value={form.data.complainant}
                    className="border rounded px-3 py-2 bg-gray-100"
                  />

                  <input
                    name="complainant_address"
                    placeholder="Address"
                    value={form.data.complainant_address}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  />

                  <input
                    type="number"
                    name="complainant_age"
                    placeholder="Age"
                    value={form.data.complainant_age}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  />

                  <input
                    name="complainant_contact"
                    placeholder="Contact"
                    value={form.data.complainant_contact}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Complainee */}
              <div>
                <h3 className="font-semibold mb-2">Complainee Info</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    name="complainee"
                    placeholder="Complainee Name"
                    value={form.data.complainee}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  />

                  <input
                    name="complainee_address"
                    placeholder="Address"
                    value={form.data.complainee_address}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  />

                  <input
                    type="number"
                    name="complainee_age"
                    placeholder="Age"
                    value={form.data.complainee_age}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  />

                  <input
                    name="complainee_contact"
                    placeholder="Contact"
                    value={form.data.complainee_contact}
                    onChange={handleChange}
                    className="border rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Incident */}
              <div>
                <h3 className="font-semibold mb-2">Incident Details</h3>

                <input
                  type="datetime-local"
                  name="incident_datetime"
                  value={form.data.incident_datetime}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                />

                <textarea
                  name="complaint"
                  placeholder="Describe the incident..."
                  value={form.data.complaint}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full h-24 mt-3"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Blotter
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}
