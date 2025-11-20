import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import SKLayout from "./layout";
import {
  Plus, Search, Filter, Edit, Trash2, X, CheckCircle, Users, Image as ImageIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

/* Interfaces */
interface Youth { id: number; first_name?: string; last_name?: string; email?: string; }
interface Application { id: number; status: string; remarks?: string; youth?: Youth; }
interface ScholarshipItem {
  id: number; title: string;
  description?: string | null; budget?: number | null;
  open_date?: string | null; close_date?: string | null;
  image_path?: string | null; applications_count?: number;
  applications?: Application[];
}
interface PaginationLink { url: string | null; label: string; active: boolean; }
interface ScholarshipsPageProps extends InertiaPageProps {
  scholarships: { data: ScholarshipItem[]; links: PaginationLink[]; total: number };
  filters?: { search?: string };
}

/* Main Component */
export default function Scholarships() {
  const { scholarships, filters = {} } = usePage<ScholarshipsPageProps>().props;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  const [selectedScholarship, setSelectedScholarship] = useState<ScholarshipItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { data, setData, post, put, processing, reset } = useForm({
    title: "", description: "", budget: "", open_date: "", close_date: "", image: null as File | null,
  });

  const items = scholarships?.data ?? [];

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  /* Add Scholarship */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/sk/scholarships", {
      onSuccess: () => {
        reset(); setImagePreview(null); setShowAddModal(false);
        router.reload({ only: ["scholarships"] });
        setToast("Scholarship added successfully!");
      },
    });
  };

  /* Update Scholarship */
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScholarship) return;

    put(`/sk/scholarships/${selectedScholarship.id}`, {
      onSuccess: () => {
        reset(); setImagePreview(null); setShowEditModal(false);
        router.reload({ only: ["scholarships"] });
        setToast("Scholarship updated successfully!");
      },
    });
  };

  /* Image Upload */
  const handleImageChange = (file: File | null) => {
    setData("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else setImagePreview(null);
  };

  return (
    <SKLayout>
      <Head title="Scholarship Programs" />

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50">
          <div className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl shadow-lg">
            <CheckCircle className="w-5 h-5" />
            <div className="text-sm font-medium">{toast}</div>
          </div>
        </div>
      )}

      {/* Page */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Scholarship Programs</h2>
              <p className="text-sm text-gray-600 mt-1">Manage SK scholarship grants and educational assistance</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search scholarships..."
                  defaultValue={filters.search}
                  onKeyDown={(e) => e.key === "Enter" &&
                    router.get("/sk/scholarships", { search: e.currentTarget.value })}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
                <Filter className="w-4 h-4" /> Filter
              </button>

              <button
                onClick={() => { reset(); setImagePreview(null); setShowAddModal(true); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Scholarship
              </button>
            </div>
          </div>

          {/* TABLE (desktop) */}
          <div className="p-6">
            <div className="hidden md:block">
              <div className="overflow-x-auto w-full max-w-full">
                <table className="w-full table-auto border-collapse hidden md:table">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Scholarship", "Budget", "Applicants", "Open Date", "Close Date", "Actions"].map((h) => (
                        <th key={h} className="text-xs font-semibold text-gray-700 uppercase px-14 py-3 text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-100">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No scholarships available.</td>
                      </tr>
                    ) : (
                      items.map((s) => (
                        <tr key={s.id} className="hover:bg-purple-50 transition">

                          {/* Scholarship */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shadow-sm">
                                {s.image_path ? (
                                  <img src={`/storage/${s.image_path}`} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{s.title}</div>
                                <div className="text-xs text-gray-500">{s.description || "—"}</div>
                              </div>
                            </div>
                          </td>

                          {/* Budget */}
                          <td className="px-6 py-4 text-right font-semibold">₱{Number(s.budget ?? 0).toLocaleString()}</td>

                          {/* Applicants */}
                          <td className="px-6 py-4 text-center cursor-pointer" onClick={() => {
                            setSelectedScholarship(s); setShowApplicantsModal(true);
                          }}>
                            <span className="inline-flex items-center gap-2 text-purple-700 font-semibold">
                              <Users className="w-4 h-4 text-purple-600" />
                              {s.applications_count ?? 0}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center">{formatDate(s.open_date)}</td>
                          <td className="px-6 py-4 text-center">{formatDate(s.close_date)}</td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => {
                                  setSelectedScholarship(s);
                                  setData({
                                    title: s.title || "", description: s.description || "",
                                    budget: s.budget?.toString() || "", open_date: s.open_date?.split("T")[0] || "",
                                    close_date: s.close_date?.split("T")[0] || "", image: null,
                                  });
                                  setImagePreview(s.image_path ? `/storage/${s.image_path}` : null);
                                  setShowEditModal(true);
                                }}
                                className="text-gray-700 hover:text-gray-900 flex items-center gap-1"
                              >
                                <Edit className="w-4 h-4" /> Edit
                              </button>

                              <Link
                                as="button" method="delete" href={`/sk/scholarships/${s.id}`}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                onClick={(e) => !confirm("Delete this scholarship?") && e.preventDefault()}
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </Link>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">Total: {scholarships?.total ?? 0}</p>
            <div className="flex items-center gap-2">
              {scholarships?.links?.map((l, idx) => (
                <Link
                  key={idx} href={l.url ?? "#"} preserveScroll preserveState
                  className={`px-3 py-1 rounded-md text-sm ${
                    l.active ? "bg-purple-600 text-white" : "bg-white border border-gray-200"
                  }`}
                >
                  <span dangerouslySetInnerHTML={{ __html: l.label }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADD Modal */}
      {showAddModal && (
        <ScholarshipModal
          title="Add New Scholarship" onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmit} data={data} setData={setData}
          processing={processing} imagePreview={imagePreview}
          handleImageChange={handleImageChange} submitText="Save"
        />
      )}

      {/* EDIT Modal */}
      {showEditModal && selectedScholarship && (
        <ScholarshipModal
          title="Edit Scholarship" onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdate} data={data} setData={setData}
          processing={processing} imagePreview={imagePreview}
          handleImageChange={handleImageChange} submitText="Update"
        />
      )}

      {/* APPLICANTS Modal */}
      {showApplicantsModal && selectedScholarship && (
        <ApplicantsModal
          selected={selectedScholarship}
          onClose={() => setShowApplicantsModal(false)}
        />
      )}
    </SKLayout>
  );
}

/* Modern Add/Edit Modal */
function ScholarshipModal({ title, onClose, onSubmit, data, setData, processing, imagePreview, handleImageChange, submitText }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-gray-200 p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <input type="text" value={data.title} onChange={(e) => setData("title", e.target.value)}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm focus:ring-purple-300" required />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea value={data.description} onChange={(e) => setData("description", e.target.value)}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm" rows={3} />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Budget</label>
            <input type="number" min="0" value={data.budget} onChange={(e) => setData("budget", e.target.value)}
              className="w-full mt-1 border-gray-300 rounded-lg shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Open Date</label>
              <input type="date" value={data.open_date} onChange={(e) => setData("open_date", e.target.value)}
                className="w-full mt-1 border-gray-300 rounded-lg shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Close Date</label>
              <input type="date" value={data.close_date} onChange={(e) => setData("close_date", e.target.value)}
                className="w-full mt-1 border-gray-300 rounded-lg shadow-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Image</label>
            <input type="file" accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)} className="mt-1" />
            {imagePreview && (
              <img src={imagePreview} className="w-full h-48 object-cover rounded-xl border shadow-sm mt-3" />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>

            <button type="submit" disabled={processing}
              className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md">
              {processing ? "Saving..." : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* Modern Applicants Modal with Fixed Names */
function ApplicantsModal({ selected, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative border border-gray-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600" /> Applicants
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Showing all applicants for <span className="font-semibold">{selected.title}</span>
        </p>

        {selected.applications?.length ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {selected.applications.map((app: Application) => {
              const fullName = `${app.youth?.first_name ?? ""} ${app.youth?.last_name ?? ""}`.trim() || "Unknown Applicant";

              const statusColor =
                app.status === "approved"
                  ? "bg-green-100 text-green-700 border-green-300"
                  : app.status === "rejected"
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-yellow-100 text-yellow-700 border-yellow-300";

              return (
                <div key={app.id}
                  className="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{fullName}</p>
                      {app.youth?.email && <p className="text-sm text-gray-600">{app.youth.email}</p>}
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">No applicants yet.</div>
        )}
      </div>
    </div>
  );
}
