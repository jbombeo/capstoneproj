import { useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import SKLayout from "./layout";

/* ============================================================
   PAGE: SCHOLARSHIP APPLICATION LIST (MODERN PORTAL DESIGN)
============================================================ */
export default function ScholarshipApplications() {
  const page: any = usePage().props;
  const applications: any[] = page.applications || [];

  const [selected, setSelected] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (app: any) => {
    setSelected(app);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setIsOpen(false);
  };

  return (
    <SKLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Scholarship Applications
      </h1>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-gray-600">No scholarship applications found.</p>
        ) : (
          applications.map((a: any) => (
            <div
              key={a.id}
              className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="text-xl font-semibold text-gray-900">
                  {a.scholarship?.title}
                </p>

                <p className="text-gray-700">
                  {a.youth?.first_name} {a.youth?.last_name}{" "}
                  <span className="text-gray-500 text-sm">
                    ({a.youth?.email})
                  </span>
                </p>

                <span
                  className={`inline-block px-3 py-1 text-xs font-bold rounded-full mt-2 ${
                    a.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                      : a.status === "granted"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : a.status === "for interview"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : a.status === "for requirement"
                      ? "bg-orange-100 text-orange-700 border border-orange-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {a.status.toUpperCase()}
                </span>
              </div>

              <button
                onClick={() => openModal(a)}
                className="text-blue-700 font-semibold text-sm hover:underline"
              >
                Manage →
              </button>
            </div>
          ))
        )}
      </div>

      {isOpen && selected && (
        <ManageModal application={selected} onClose={closeModal} />
      )}
    </SKLayout>
  );
}

/* ============================================================
   MODAL: MANAGE SCHOLARSHIP APPLICATION (UPDATED)
============================================================ */
function ManageModal({ application, onClose }: any) {
  const scholarship = application.scholarship ?? {};
  const youth = application.youth ?? {};

  const requirements: any[] = Array.isArray(scholarship.requirements)
    ? scholarship.requirements
    : [];

  const form: any = useForm({
    status: application.status,
    remarks: application.remarks ?? "",
    interview_date: "",
    interview_time: "",
  });

  const submit = () => {
    // If setting interview — append schedule to remarks
    if (form.data.status === "for interview") {
      const schedule = `Interview Schedule:
Date: ${form.data.interview_date || "Not set"}
Time: ${form.data.interview_time || "Not set"}

`;

      form.setData("remarks", schedule + (form.data.remarks || ""));
    }

    form.patch(`/sk/scholarship-applications/${application.id}/status`, {
      preserveScroll: true,
      onSuccess: onClose,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl p-8 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Manage Application</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
            ✕
          </button>
        </div>

        {/* SCHOLARSHIP DETAILS */}
        <div className="p-6 border bg-gray-50 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">{scholarship.title}</h3>

          {scholarship.description && (
            <p className="text-gray-700 mt-2">{scholarship.description}</p>
          )}

          <p className="font-bold mt-6 mb-2 text-gray-800">Requirements</p>

          {requirements.length > 0 ? (
            <ul className="ml-6 list-disc text-sm text-gray-700 space-y-1">
              {requirements.map((req: any, i: number) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">No requirements listed.</p>
          )}
        </div>

        {/* YOUTH DETAILS */}
        <div className="p-6 border bg-white rounded-xl shadow-sm mt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Applicant Information
          </h3>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              {youth.image ? (
                <img
                  src={youth.image}
                  className="w-36 h-36 rounded-xl object-cover shadow-md border"
                />
              ) : (
                <div className="w-36 h-36 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                  No Photo
                </div>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Detail label="First Name" value={youth.first_name} />
              <Detail label="Last Name" value={youth.last_name} />
              <Detail label="Middle Name" value={youth.middle_name} />
              <Detail label="Email" value={youth.email} />
              <Detail label="Contact Number" value={youth.contact_number} />
              <Detail label="Birth Date" value={youth.birth_date} />
              <Detail label="Birth Place" value={youth.birth_place} />
              <Detail label="Age" value={youth.age} />

              <div className="md:col-span-2">
                <p className="text-xs uppercase text-gray-500">Status</p>
                <span
                  className={`inline-block px-4 py-1 mt-1 rounded-full text-xs font-bold ${
                    youth.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : youth.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {youth.status ?? "N/A"}
                </span>
              </div>

              <div className="md:col-span-2 mt-3">
                <p className="text-xs uppercase text-gray-500 mb-1">Skills</p>

                {Array.isArray(youth.skills) && youth.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {youth.skills.map((skill: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No skills listed</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="mt-8">
          <label className="font-bold text-gray-900">Application Status</label>
          <select
            className="w-full border rounded-lg p-2 mt-1 bg-white"
            value={form.data.status}
            onChange={(e: any) => form.setData("status", e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="for interview">For Interview</option>
            <option value="for requirement">For Requirement</option>
            <option value="granted">Granted</option>
          </select>
        </div>

        {/* INTERVIEW DATE & TIME */}
        {form.data.status === "for interview" && (
          <>
            <div className="mt-4">
              <label className="font-bold text-gray-900">Interview Date</label>
              <input
                type="date"
                className="w-full border rounded-lg p-2 mt-1"
                value={form.data.interview_date}
                onChange={(e: any) =>
                  form.setData("interview_date", e.target.value)
                }
              />
            </div>

            <div className="mt-4">
              <label className="font-bold text-gray-900">Interview Time</label>
              <input
                type="time"
                className="w-full border rounded-lg p-2 mt-1"
                value={form.data.interview_time}
                onChange={(e: any) =>
                  form.setData("interview_time", e.target.value)
                }
              />
            </div>
          </>
        )}

        {/* REMARKS */}
        <div className="mt-4">
          <label className="font-bold text-gray-900">Remarks</label>
          <textarea
            className="w-full border rounded-lg p-2 mt-1"
            rows={3}
            value={form.data.remarks}
            onChange={(e: any) => form.setData("remarks", e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={form.processing}
            className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 font-medium"
          >
            {form.processing ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SIMPLE DETAIL COMPONENT
============================================================ */
function Detail({ label, value }: any) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value ?? "N/A"}</p>
    </div>
  );
}
