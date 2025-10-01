import { useState } from "react";
import { router, usePage, Head } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import toast from "react-hot-toast";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from 'react';

interface Zone {
  id: number;
  zone: string;
}

interface Resident {
  id: number;
  user_id?: number | null;
  email: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  age: number;
  gender: string;
  civil_status: string;
  zone?: Zone | null;
  total_household?: number;
  relationto_head_of_family?: string;
  occupation?: string;
  religion?: string;
  nationality?: string;
  skills?: string;
  remarks?: string;
  image?: string;
  status?: "pending" | "approved" | "rejected";
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
  const { flash } = usePage().props as any;

  const getFullName = (r: Resident) =>
    `${r.first_name} ${r.middle_name ?? ""} ${r.last_name}`.trim();

  const getGender = (g: string) => g || "Unknown";
  const getCivilStatus = (s: string) => s || "Unknown";

  const filteredResidents = residents.filter((r) =>
    getFullName(r).toLowerCase().includes(search.toLowerCase())
  );

  // Delete resident
  const handleDeleteResident = (id: number) => {
    if (!confirm("Are you sure you want to delete this resident?")) return;
    router.delete(`/residentregistereds/${id}`, {
      onSuccess: () => toast.success("Resident deleted."),
      onError: () => toast.error("Failed to delete resident."),
    });
  };

  // View resident
  const handleViewResident = (r: Resident) => {
    setViewResident(r);
    setOpenView(true);
  };

  // Approve resident
  const handleApproveResident = (id: number) => {
    if (!confirm("Approve this resident?")) return;
    router.post(`/residentregistereds/${id}/approve`, {}, {
      onSuccess: () => toast.success("Resident approved and credentials sent!"),
      onError: () => toast.error("Failed to approve resident."),
    });
  };

  // Reject resident
  const handleRejectResident = (id: number) => {
    if (!confirm("Reject this resident?")) return;
    router.post(`/residentregistereds/${id}/reject`, {}, {
      onSuccess: () => toast.success("Resident rejected."),
      onError: () => toast.error("Failed to reject resident."),
    });
  };

  React.useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);       // show toast
      console.log(flash.success);         // also log to console
    }
  }, [flash]);

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
                      <td className="px-4 py-2">{getGender(r.gender)}</td>
                      <td className="px-4 py-2">{getCivilStatus(r.civil_status)}</td>
                      <td className="px-4 py-2">{r.status || "N/A"}</td>
                      <td className="px-4 py-2 space-x-2">
                        {r.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleApproveResident(r.id)}>Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectResident(r.id)}>Reject</Button>
                          </>
                        )}
                        <Button size="sm" variant="secondary" onClick={() => handleViewResident(r)}>View</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteResident(r.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">No residents found</td>
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
              <img src={`/storage/${viewResident.image}`} alt="Resident" className="w-24 h-24 rounded-full mb-4" />
            )}
            <h2 className="text-xl font-bold mb-4">Resident Details</h2>
            <div className="grid gap-2">
              <div><strong>Name:</strong> {getFullName(viewResident)}</div>
              <div><strong>Email:</strong> {viewResident.email}</div>
              <div><strong>Age:</strong> {viewResident.age}</div>
              <div><strong>Gender:</strong> {getGender(viewResident.gender)}</div>
              <div><strong>Civil Status:</strong> {getCivilStatus(viewResident.civil_status)}</div>
              <div><strong>Zone:</strong> {viewResident.zone?.zone || "N/A"}</div>
              <div><strong>Total Household:</strong> {viewResident.total_household}</div>
              <div><strong>Relation to Head:</strong> {viewResident.relationto_head_of_family || "N/A"}</div>
              <div><strong>Occupation:</strong> {viewResident.occupation || "N/A"}</div>
              <div><strong>Remarks:</strong> {viewResident.remarks || "N/A"}</div>
              <div><strong>Status:</strong> {viewResident.status}</div>
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
