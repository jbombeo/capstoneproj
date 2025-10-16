import { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import React from "react";

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
  zone?: Zone | null;
  status?: "pending" | "approved" | "rejected";
  image?: string;
}

interface ResidentPageProps extends InertiaPageProps {
  residents: Resident[];
  zones: Zone[];
}

export default function ResidentPage() {
  const { residents, zones } = usePage<ResidentPageProps>().props;
  const [search, setSearch] = useState("");
  const [openView, setOpenView] = useState(false);
  const [viewResident, setViewResident] = useState<Resident | null>(null);

  const getFullName = (r: Resident) =>
    `${r.first_name} ${r.middle_name ?? ""} ${r.last_name}`.trim();

  const filteredResidents = residents.filter((r) =>
    getFullName(r).toLowerCase().includes(search.toLowerCase())
  );

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  // ✅ Approve resident and log generated password
// ✅ Approve resident and log generated password (only if created)
const handleApproveResident = async (id: number) => {
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

    // Log generated password only if returned
    if (response.data.generatedPassword) {
      console.log("✅ Generated password:", response.data.generatedPassword);
      alert("Resident approved! Check console for the password.");
    } else {
      console.log("Resident approved. No new password generated (user already exists).");
      alert("Resident approved.");
    }

    // Optionally refresh the page or update state
    window.location.reload();
  } catch (error) {
    console.error("Failed to approve resident", error);
    alert("Failed to approve resident.");
  }
};


  const handleViewResident = (r: Resident) => {
    setViewResident(r);
    setOpenView(true);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Residents", href: "#" }]}>
      <Head title="Residents" />

      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">Residents List</h1>
      </div>

      <div className="p-6 space-y-6">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm mb-4 p-2 border rounded"
        />

        <Card className="shadow-md rounded-2xl overflow-x-auto">
          <CardContent className="p-4">
            <table className="w-full text-sm text-left border-collapse min-w-[900px]">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Zone</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Civil Status</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.length > 0 ? (
                  filteredResidents.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{getFullName(r)}</td>
                      <td className="px-4 py-2">{r.email}</td>
                      <td className="px-4 py-2">{r.age}</td>
                      <td className="px-4 py-2">{r.zone?.zone || "N/A"}</td>
                      <td className="px-4 py-2">{r.gender || "Unknown"}</td>
                      <td className="px-4 py-2">{r.civil_status || "Unknown"}</td>
                      <td className="px-4 py-2">{r.status || "N/A"}</td>
                      <td className="px-4 py-2 space-x-2">
                        {r.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveResident(r.id)}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewResident(r)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No residents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* View Modal */}
      {openView && viewResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            {viewResident.image && (
              <img
                src={`/storage/${viewResident.image}`}
                alt="Resident"
                className="w-24 h-24 rounded-full mb-4"
              />
            )}
            <h2 className="text-xl font-bold mb-4">Resident Details</h2>
            <div className="grid gap-2">
              <div>
                <strong>Name:</strong> {getFullName(viewResident)}
              </div>
              <div>
                <strong>Email:</strong> {viewResident.email}
              </div>
              <div>
                <strong>Age:</strong> {viewResident.age}
              </div>
              <div>
                <strong>Gender:</strong> {viewResident.gender}
              </div>
              <div>
                <strong>Civil Status:</strong> {viewResident.civil_status}
              </div>
              <div>
                <strong>Zone:</strong> {viewResident.zone?.zone || "N/A"}
              </div>
              <div>
                <strong>Status:</strong> {viewResident.status}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setOpenView(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
