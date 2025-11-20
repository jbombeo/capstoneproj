import { Head, Link, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import SKLayout from "./layout";
import { Search, Filter, X } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface YouthItem {
  id: number;
  name: string;
  email: string;
  age: number;
  phone: string;
  skills: string[];
  status: "approved" | "pending" | "rejected";
  birth_date?: string;
  birth_place?: string;
  image?: string | null;
}

interface YouthPageProps extends InertiaPageProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  youth?: YouthItem[];
  flash?: { success?: string; error?: string };
}

export default function Youth() {
  const { user, youth = [] } = usePage<YouthPageProps>().props;
  const [selectedYouth, setSelectedYouth] = useState<YouthItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

const handleApprove = (id: number) => {
  if (confirm("Approve this youth registration?")) {
    Inertia.post(`/sk/youth/${id}/approve`, {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        alert("Youth approved successfully!");

        setIsModalOpen(false);
        setSelectedYouth(null);

        // Refresh only youth list without reload
        Inertia.reload({
          only: ["youth"],
          preserveState: true,
        });
      },
      onError: () => alert("Failed to approve youth."),
    });
  }
};

const handleReject = (id: number) => {
  if (confirm("Reject this youth registration?")) {
    Inertia.post(`/sk/youth/${id}/reject`, {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        alert("Youth rejected successfully!");

        setIsModalOpen(false);
        setSelectedYouth(null);

        // Refresh table only
        Inertia.reload({
          only: ["youth"],
          preserveState: true,
        });
      },
      onError: () => alert("Failed to reject youth."),
    });
  }
};


  const handleView = (member: YouthItem) => {
    setSelectedYouth(member);
    setIsModalOpen(true);
  };

  return (
    <SKLayout>
      <Head title="Youth Registry" />

      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Youth Member Registry</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage registered youth — approve or reject pending registrations.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members..."
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button className="px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-semibold">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">
                    Skills
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {youth.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-6 text-center text-gray-500 text-sm"
                    >
                      No youth members found.
                    </td>
                  </tr>
                ) : (
                  youth.map((member) => (
                    <tr key={member.id} className="hover:bg-blue-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {member.age}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-800">
                        {member.phone}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {member.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${
                            member.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : member.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleView(member)}
                          className="text-blue-600 hover:text-blue-800 font-semibold mr-4"
                        >
                          View
                        </button>

                        {member.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(member.id)}
                              className="text-green-600 hover:text-green-800 font-semibold mr-3"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(member.id)}
                              className="text-red-600 hover:text-red-800 font-semibold"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">
              Showing {youth.length} youth members
            </span>
          </div>
        </div>
      </div>

      {/* Youth View Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl p-6">
          {selectedYouth && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800">
                  {selectedYouth.name}
                </DialogTitle>
                <DialogDescription>
                  <span className="text-sm text-gray-500">{selectedYouth.email}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 flex flex-col md:flex-row gap-6">
                <div>
                  {selectedYouth.image ? (
                    <img
                      src={selectedYouth.image}
                      alt="Youth"
                      className="w-32 h-32 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-100 border text-gray-500 text-sm">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <p>
                    <strong>Birth Date:</strong> {selectedYouth.birth_date || "—"}
                  </p>
                  <p>
                    <strong>Birth Place:</strong> {selectedYouth.birth_place || "—"}
                  </p>
                  <p>
                    <strong>Age:</strong> {selectedYouth.age}
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedYouth.phone || "—"}
                  </p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {selectedYouth.skills?.length
                      ? selectedYouth.skills.join(", ")
                      : "None"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-bold ${
                        selectedYouth.status === "approved"
                          ? "text-green-700"
                          : selectedYouth.status === "pending"
                          ? "text-yellow-700"
                          : "text-red-700"
                      }`}
                    >
                      {selectedYouth.status.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>

              {selectedYouth.status === "pending" && (
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => handleApprove(selectedYouth.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedYouth.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </SKLayout>
  );
}
