import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import {
  Home,
  User,
  ShieldCheck,
  BookOpen,
  Settings,
  FileText,
  X,
  LogOut,
  Menu,
} from "lucide-react";

// Interfaces
interface Payment {
  method: string;
  amount: number;
  reference_number?: string | null;
}

interface DocumentType {
  id: number;
  name: string;
  amount: number;
}

interface DocumentRequest {
  id: number;
  document_type: DocumentType;
  purpose?: string;
  status: "pending" | "on process" | "ready for pick-up" | "released";
  payment?: Payment;
}

// Sidebar menu
const MENU_ITEMS = [
  { name: "Home", icon: Home, href: "/resident/home" },
  { name: "Profile", icon: User, href: "/resident/profile" },
  { name: "Barangay Official", icon: ShieldCheck, href: "/resident/officials" },
  { name: "Request Document", icon: FileText, href: "/resident/document-requests" },
  { name: "Settings", icon: Settings, href: "/resident/settings" },
];

// Helpers
const getStatusClasses = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-gray-400 text-white",
    "on process": "bg-yellow-400 text-gray-900",
    "ready for pick-up": "bg-blue-400 text-white",
    released: "bg-green-400 text-white",
  };
  return classes[status] || "bg-gray-400 text-white";
};

const formatPaymentMethod = (method?: string) => {
  if (!method) return "-";
  switch (method.toLowerCase()) {
    case "cash":
      return "Cash";
    case "gcash":
      return "GCash";
    case "free":
      return "Free";
    default:
      return method;
  }
};

// Sidebar Component
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <aside
        className={`fixed inset-0 z-40 lg:static lg:w-80 
          bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl 
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 lg:p-8 border-b border-blue-700 flex flex-col items-center relative">
          <button onClick={onClose} className="lg:hidden absolute top-4 right-4 text-white">
            <X className="w-6 h-6" />
          </button>
          <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
            <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">Barangay Portal</h1>
        </div>

        <nav className="flex-1 p-4 sm:p-6 space-y-1">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center p-4 rounded-lg hover:bg-green-700/50 text-white transition group"
            >
              <item.icon className="w-5 h-5 mr-4 text-white group-hover:scale-110 transition-transform" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 sm:p-6 border-t border-blue-700">
          <button
            onClick={() => console.log("/logout")}
            className="w-full flex items-center justify-center p-4 rounded-lg bg-blue-700/50 hover:bg-red-600 text-white"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
    </>
  );
}

// Request Card
function RequestCard({ req }: { req: DocumentRequest }) {
  const paymentMethod = req.payment?.method ?? "";
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 hover:shadow-xl transition">
      <h3 className="text-xl font-bold text-gray-900 text-center">
        {req.document_type?.name || "-"}
      </h3>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(req.status)}`}>
        {req.status}
      </span>
      <div className="mt-2 text-gray-600 text-center text-sm">
        <p>Purpose: {req.purpose || "-"}</p>
        {req.payment && (
          <>
            <p>Payment Method: {formatPaymentMethod(paymentMethod)}</p>
            <p>Amount Paid: ₱{Number(req.payment.amount ?? 0).toFixed(2)}</p>
            {paymentMethod.toLowerCase() === "gcash" && req.payment.reference_number && (
              <>
                <p>Reference Number: {req.payment.reference_number}</p>
                <img src="/images/gcash-qr.png" alt="GCash QR" className="w-24 h-24 mx-auto mt-2" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Modal Form
function ModalForm({
  form,
  setForm,
  onClose,
  onSubmit,
  documentTypes,
}: {
  form: {
    document_type_id: number | "";
    purpose: string;
    payment: Payment | { method: string; amount: number | ""; reference_number?: string };
  };
  setForm: (form: any) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  documentTypes: DocumentType[];
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Request Document</h2>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Document Type</label>
            <select
              className="w-full border rounded p-2"
              value={form.document_type_id}
              onChange={(e) => {
                const docId = e.target.value === "" ? "" : Number(e.target.value);
                const doc = documentTypes.find((d) => d.id === docId);
                setForm({
                  ...form,
                  document_type_id: docId,
                  payment: {
                    ...form.payment,
                    amount: doc ? Number(doc.amount) : 0,
                  },
                });
              }}
              required
            >
              <option value="">-- Select Document --</option>
              {documentTypes.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} (₱{Number(doc.amount).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Purpose</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Payment Method</label>
            <select
              className="w-full border rounded p-2"
              value={form.payment.method}
              onChange={(e) =>
                setForm({ ...form, payment: { ...form.payment, method: e.target.value } })
              }
            >
              <option value="cash">Cash</option>
              <option value="gcash">GCash</option>
              <option value="free">Free</option>
            </select>
          </div>

          {form.payment.method === "gcash" && (
            <div>
              <label className="block text-sm font-medium">Reference Number</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={form.payment.reference_number || ""}
                onChange={(e) =>
                  setForm({ ...form, payment: { ...form.payment, reference_number: e.target.value } })
                }
                required
              />
              <img src="/images/gcash-qr.png" alt="GCash QR" className="w-24 h-24 mx-auto mt-2" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              className="w-full border rounded p-2 bg-gray-100"
              value={
                form.payment.amount !== "" ? Number(form.payment.amount).toFixed(2) : ""
              }
              readOnly
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" className="px-4 py-2 rounded border" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Component
export default function ResidentDocumentRequests({
  requests: initialRequests,
  documentTypes,
}: {
  requests: DocumentRequest[];
  documentTypes: DocumentType[];
}) {
  const [requests, setRequests] = useState<DocumentRequest[]>(initialRequests || []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<{
    document_type_id: number | "";
    purpose: string;
    payment: { method: string; amount: number | ""; reference_number?: string };
  }>({
    document_type_id: "",
    purpose: "",
    payment: { method: "cash", amount: 0, reference_number: "" },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";

      const payload = {
        document_type_id: form.document_type_id === "" ? null : Number(form.document_type_id),
        purpose: form.purpose,
        payment_method: form.payment.method,
        amount: form.payment.method === "free" ? 0 : Number(form.payment.amount),
        reference_number: form.payment.method === "gcash" ? form.payment.reference_number : null,
      };

      const response = await axios.post("/resident/document-requests", payload, {
        headers: { "X-CSRF-TOKEN": token },
      });

      const docType = documentTypes.find((d) => d.id === Number(form.document_type_id));
      const newRequest: DocumentRequest = {
        id: response.data.data.id,
        document_type: docType || { id: 0, name: "Unknown", amount: 0 },
        purpose: form.purpose,
        status: response.data.data.status ?? "pending",
        payment: response.data.data.payments?.[0] ?? {
          method: payload.payment_method,
          amount: payload.amount,
          reference_number: payload.reference_number,
        },
      };

      setRequests((prev) => [...prev, newRequest]);
      setForm({
        document_type_id: "",
        purpose: "",
        payment: { method: "cash", amount: 0, reference_number: "" },
      });
      setShowModal(false);
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      <Head title="Request Document" />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-h-screen p-4 sm:p-6 lg:p-10">
        <div className="lg:hidden flex items-center justify-between mb-4 p-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold">Document Requests</h2>
          <div className="w-6 h-6" />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold hidden lg:block">Document Requests</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            + Request Document
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {requests.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-16">
              No document requests yet.
            </p>
          ) : (
            requests.map((req) => (
              <RequestCard key={req.id} req={req} />
            ))
          )}
        </div>
      </main>

      {showModal && (
        <ModalForm
          form={form}
          setForm={setForm}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          documentTypes={documentTypes}
        />
      )}
    </div>
  );
}
