import { useState, useEffect } from "react";
import { usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

interface Zone {
  id: number;
  zone: string;
}

interface Resident {
  id: number;
  email: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  age: number;
  gender: string;
  civil_status: string;
  zone?: Zone;
  status?: "pending" | "approved" | "rejected";
  image?: string | null;
}

interface ResidentPageProps extends InertiaPageProps {
  residents: Resident[];
  zones: Zone[];
}

export default function ResidentPage() {
  const { residents } = usePage<ResidentPageProps>().props;

  const [search, setSearch] = useState("");
  const [openView, setOpenView] = useState(false);
  const [viewResident, setViewResident] = useState<Resident | null>(null);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const getFullName = (r: Resident) =>
    `${r.first_name} ${r.middle_name ?? ""} ${r.last_name}`.trim();

  const filteredResidents = residents.filter((r) =>
    getFullName(r).toLowerCase().includes(search.toLowerCase())
  );

  // Approve Resident
  const handleApprove = async (id: number) => {
    if (!confirm("Approve this resident?")) return;

    try {
      const response = await axios.post(
        `/residentregistereds/${id}/approve`,
        {},
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken || "",
            Accept: "application/json",
          },
        }
      );

      if (response.data.generatedPassword) {
        alert("Resident approved! Check console for generated password.");
        console.log("Generated password:", response.data.generatedPassword);
      } else {
        alert("Resident approved.");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to approve resident.");
    }
  };

  const openModal = (r: Resident) => {
    setViewResident(r);
    setOpenView(true);
  };

  const imagePath = (img?: string | null) =>
    img ? `/storage/${img}` : "/images/default-avatar.png";

  return (
    <AppLayout breadcrumbs={[{ title: "Residents", href: "#" }]}>
      <Head title="Residents" />
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl">
        <h1 className="text-4xl font-extrabold">Residents Registry</h1>
        <p className="opacity-90 text-sm">
          Official Barangay Resident Information Records
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* SEARCH BAR */}
        <div className="bg-white px-5 py-4 rounded-xl shadow border flex justify-between items-center">
          <Input
            placeholder="Search resident by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* TABLE */}
        <Card className="shadow-xl rounded-2xl border overflow-x-auto">
          <CardContent className="p-0">
            <table className="w-full table-fixed text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 w-48">Full Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 w-16">Age</th>
                  <th className="px-6 py-3 w-20">Zone</th>
                  <th className="px-6 py-3 w-24">Gender</th>
                  <th className="px-6 py-3 w-28">Civil Status</th>
                  <th className="px-6 py-3 w-24">Status</th>
                  <th className="px-6 py-3 w-32 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredResidents.length > 0 ? (
                  filteredResidents.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        <img
                          src={imagePath(r.image)}
                          className="h-10 w-10 rounded-full object-cover border"
                        />
                        {getFullName(r)}
                      </td>

                      <td className="px-6 py-4">{r.email}</td>
                      <td className="px-6 py-4">{r.age}</td>
                      <td className="px-6 py-4">{r.zone?.zone ?? "N/A"}</td>
                      <td className="px-6 py-4">{r.gender}</td>
                      <td className="px-6 py-4">{r.civil_status}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-white text-xs font-semibold ${
                            r.status === "approved"
                              ? "bg-green-600"
                              : r.status === "rejected"
                              ? "bg-red-600"
                              : "bg-yellow-500"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center space-x-2">
                        {r.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-700"
                            onClick={() => handleApprove(r.id)}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openModal(r)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No residents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* VIEW MODAL */}
      {openView && viewResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex flex-col items-center">
              <img
                src={imagePath(viewResident.image)}
                className="w-24 h-24 rounded-full object-cover border shadow mb-3"
              />

              <h2 className="text-xl font-bold">{getFullName(viewResident)}</h2>
              <p className="text-sm text-gray-500 mb-4">
                Resident Information
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Email:</strong> {viewResident.email}</div>
              <div><strong>Age:</strong> {viewResident.age}</div>
              <div><strong>Gender:</strong> {viewResident.gender}</div>
              <div><strong>Civil Status:</strong> {viewResident.civil_status}</div>
              <div><strong>Zone:</strong> {viewResident.zone?.zone ?? "N/A"}</div>
              <div><strong>Status:</strong> {viewResident.status}</div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setOpenView(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
