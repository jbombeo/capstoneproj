import { Head, Link, usePage, useForm, router } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { useState, useEffect } from "react";
import SKLayout from "./layout";
import { Plus, X, Eye, Edit, Trash2, User, CheckCircle, XCircle } from "lucide-react";

interface SKOfficial {
  id: number;
  complete_name: string;
  position: string;
  contact?: string | null;
  address?: string | null;
  term_start?: string | null;
  term_end?: string | null;
  status: string;
  image?: string | null;
  image_url?: string | null;
}

interface PageProps extends InertiaPageProps {
  officials?: SKOfficial[];
}

export default function SKOfficials() {
  const { officials = [] } = usePage<PageProps>().props;

  // ✅ Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<SKOfficial | null>(null);

  // ✅ Toast State
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ✅ Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ✅ Add Form
  const { data, setData, post, processing, errors, reset } = useForm({
    complete_name: "",
    position: "",
    contact: "",
    address: "",
    term_start: "",
    term_end: "",
    status: "active",
    image: null as File | null,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    post("/sk/officials", {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setShowAddModal(false);
        setToast({ type: "success", message: "SK Official added successfully!" });
      },
      onError: () => setToast({ type: "error", message: "Failed to add SK Official." }),
    });
  };

  // ✅ Edit Form
  const {
    data: editData,
    setData: setEditData,
    put,
    processing: updating,
    reset: resetEdit,
  } = useForm({
    complete_name: "",
    position: "",
    contact: "",
    address: "",
    term_start: "",
    term_end: "",
    image: null as File | null,
  });

  const openEditModal = (official: SKOfficial) => {
    setSelectedOfficial(official);
    setEditData({
      complete_name: official.complete_name || "",
      position: official.position || "",
      contact: official.contact || "",
      address: official.address || "",
      term_start: official.term_start || "",
      term_end: official.term_end || "",
      image: null,
    });
    setShowEditModal(true);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficial) return;
    put(`/sk/officials/${selectedOfficial.id}`, {
      forceFormData: true,
      onSuccess: () => {
        resetEdit();
        setShowEditModal(false);
        setToast({ type: "success", message: "SK Official updated successfully!" });
      },
      onError: () => setToast({ type: "error", message: "Failed to update SK Official." }),
    });
  };

  // ✅ Inline status update
  const handleStatusChange = (id: number, newStatus: string) => {
    router.put(
      `/sk/officials/${id}`,
      { status: newStatus },
      {
        preserveScroll: true,
        onSuccess: () =>
          setToast({
            type: "success",
            message: `Status updated to "${newStatus.toUpperCase()}"!`,
          }),
        onError: () =>
          setToast({ type: "error", message: "Failed to update status." }),
      }
    );
  };

  const statusBadge = (status: string) =>
    status === "active"
      ? "bg-green-100 text-green-700"
      : status === "leave"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-200 text-gray-600";

  return (
    <SKLayout>
      <Head title="SK Officials" />

      {/* ✅ Color Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 shadow-2xl rounded-xl p-4 animate-slideIn transition-all duration-500
            ${
              toast.type === "success"
                ? "bg-green-50 border-l-4 border-green-600"
                : "bg-red-50 border-l-4 border-red-600"
            }`}
        >
          <div
            className={`rounded-full p-2 ${
              toast.type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
          </div>

          <div>
            <p
              className={`font-semibold text-base ${
                toast.type === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {toast.message}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">SK Officials</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage youth officials information
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 font-semibold shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Official
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">
                    Photo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-gray-700">
                    Position
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
                {officials.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-6 text-gray-500 text-sm"
                    >
                      No SK officials found.
                    </td>
                  </tr>
                ) : (
                  officials.map((o) => (
                    <tr key={o.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shadow-sm flex items-center justify-center">
                          {o.image_url ? (
                            <img
                              src={o.image_url}
                              alt={o.complete_name}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                ((e.currentTarget as HTMLImageElement).src =
                                  "/images/avatar-placeholder.png")
                              }
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {o.complete_name}
                      </td>
                      <td className="px-6 py-4 text-gray-800">{o.position}</td>

                      {/* Inline dropdown for status */}
                      <td className="px-6 py-4">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value)
                          }
                          className={`border rounded-lg px-3 py-1.5 text-sm font-semibold ${statusBadge(
                            o.status
                          )}`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="leave">Leave</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 flex gap-3 text-sm">
                        <button
                          onClick={() => openEditModal(o)}
                          className="text-gray-700 hover:text-gray-900 font-semibold flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>

                        <Link
                          as="button"
                          method="delete"
                          href={`/sk/officials/${o.id}`}
                          className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                          onClick={(e) => {
                            if (!confirm("Are you sure you want to delete this official?"))
                              e.preventDefault();
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ---------- ADD MODAL ---------- */}
      {showAddModal && (
        <Modal title="Add SK Official" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <OfficialForm data={data} setData={setData} errors={errors} />
            <ModalFooter
              processing={processing}
              onCancel={() => setShowAddModal(false)}
              label="Save"
            />
          </form>
        </Modal>
      )}

      {/* ---------- EDIT MODAL ---------- */}
      {showEditModal && selectedOfficial && (
        <Modal title="Edit SK Official" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEdit} className="space-y-4">
            <OfficialForm data={editData} setData={setEditData} errors={errors} />
            <ModalFooter
              processing={updating}
              onCancel={() => setShowEditModal(false)}
              label="Update"
            />
          </form>
        </Modal>
      )}
    </SKLayout>
  );
}

/* ---------- Components ---------- */
function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 animate-fadeInUp">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function OfficialForm({ data, setData, errors }: any) {
  return (
    <>
      <div>
        <label className="label">Full Name</label>
        <input
          type="text"
          value={data.complete_name}
          onChange={(e) => setData("complete_name", e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="label">Position</label>
        <input
          type="text"
          value={data.position}
          onChange={(e) => setData("position", e.target.value)}
          className="input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Contact</label>
          <input
            type="text"
            value={data.contact}
            onChange={(e) => setData("contact", e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Address</label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => setData("address", e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Term Start</label>
          <input
            type="date"
            value={data.term_start}
            onChange={(e) => setData("term_start", e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label">Term End</label>
          <input
            type="date"
            value={data.term_end}
            onChange={(e) => setData("term_end", e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="label">Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setData("image", e.target.files?.[0] ?? null)}
        />
      </div>
    </>
  );
}

function ModalFooter({ processing, onCancel, label }: any) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
      <button type="button" onClick={onCancel} className="btn-cancel">
        Cancel
      </button>
      <button type="submit" disabled={processing} className="btn-primary">
        {processing ? "Saving..." : label}
      </button>
    </div>
  );
}
