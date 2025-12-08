import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

// Icons
import {
  CheckCircle,
  Clock,
  PackageCheck,
  CheckCheck,
  XCircle,
} from "lucide-react";

interface Resident {
  id: number;
  first_name: string;
  last_name: string;
}

interface DocumentType {
  id: number;
  name: string;
  amount: number;
}

interface DocumentPayment {
  id: number;
  payment_method: "cash" | "gcash" | "free";
  amount: number;
  or_number?: string;
  reference_number?: string;
}

interface DocumentRequest {
  id: number;
  resident: Resident;
  document_type: DocumentType;
  purpose: string;
  status:
    | "pending"
    | "on process"
    | "ready for pick-up"
    | "released"
    | "declined";
  payments?: DocumentPayment[];
}

interface PageProps extends InertiaPageProps {
  requests: DocumentRequest[];
  residents: Resident[];
  documentTypes: DocumentType[];
}

interface FormState {
  resident_id: string;
  document_type_id: number;
  purpose: string;
  payment_method: "cash" | "gcash" | "free";
  amount: string;
  reference_number: string;
}

export default function DocumentRequests() {
  const { props } = usePage<PageProps>();
  const [requests, setRequests] = useState<DocumentRequest[]>(
    props.requests || []
  );
  const [residents] = useState<Resident[]>(props.residents || []);
  const [documentTypes] = useState<DocumentType[]>(props.documentTypes || []);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<FormState>({
    resident_id: "",
    document_type_id: 0,
    purpose: "",
    payment_method: "cash",
    amount: "0",
    reference_number: "",
  });

  useEffect(() => {
    const selectedDoc = documentTypes.find(
      (dt) => dt.id === form.document_type_id
    );
    setForm((prev) => ({
      ...prev,
      amount: selectedDoc ? selectedDoc.amount.toString() : "0",
    }));
  }, [form.document_type_id, documentTypes]);

  const formatCurrency = (value?: number | string) => {
    const number = Number(value ?? 0);
    return `₱${number.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleAccept = async (req: DocumentRequest) => {
    try {
      const response = await axios.put<{ status: DocumentRequest["status"] }>(
        `/documentrequests/${req.id}/accept`
      );
      const newStatus = response.data.status;

      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: newStatus } : r))
      );
    } catch (error) {
      console.error("Failed to accept request:", error);
      alert("Failed to accept request.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.resident_id) return alert("Please select a resident.");
    if (!form.document_type_id) return alert("Please select a document type.");
    if (!form.purpose.trim()) return alert("Please enter a purpose.");
    if (form.payment_method === "gcash" && !form.reference_number.trim())
      return alert("Please enter GCash reference number.");

    const payload = {
      resident_id: form.resident_id,
      document_type_id: form.document_type_id,
      purpose: form.purpose,
      payment_method: form.payment_method,
      amount: form.payment_method === "free" ? 0 : Number(form.amount),
      reference_number:
        form.payment_method === "gcash" ? form.reference_number : null,
    };

    try {
      const response = await axios.post<DocumentRequest>(
        "/documentrequests",
        payload
      );
      setRequests((prev) => [...prev, response.data]);

      setForm({
        resident_id: "",
        document_type_id: 0,
        purpose: "",
        payment_method: "cash",
        amount: "0",
        reference_number: "",
      });

      setShowModal(false);
    } catch (error: any) {
      console.error("Failed to submit request:", error);
      alert(error.response?.data?.message || "Failed to submit request.");
    }
  };

  const filteredRequests = requests.filter((req) =>
    `${req.resident.first_name} ${req.resident.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AppLayout
      breadcrumbs={[{ title: "Document Requests", href: "/documentrequests" }]}
    >
      <Head title="Document Requests" />

      {/* Header */}
      <div className="flex justify-between items-center items-center mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl">
        <h1 className="text-3xl font-bold">Document Requests</h1>
        <Button onClick={() => setShowModal(true)}>+ Request Document</Button>
      </div>

      {/* Search */}
      <div className="p-6 space-y-6">
        <Input
          placeholder="Search by resident name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm mb-4"
        />

        {/* Requests Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-gray-50">
                    <TableCell>
                      {req.resident.first_name} {req.resident.last_name}
                    </TableCell>
                    <TableCell>{req.document_type?.name}</TableCell>
                    <TableCell>{req.purpose}</TableCell>
                    <TableCell>
                      {req.payments?.[0]?.payment_method ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(
                        req.payments?.[0]?.amount ??
                          req.document_type?.amount
                      )}
                    </TableCell>
                    <TableCell className="capitalize font-semibold">
                      {req.status}
                    </TableCell>

                    {/* ACTION ICONS */}
                    <TableCell>
                      <div className="flex items-center justify-center space-x-3">
                        {/* ACCEPT */}
                        {req.status === "pending" && (
                          <div
                            title="Accept Request"
                            className="cursor-pointer"
                            onClick={() => handleAccept(req)}
                          >
                            <CheckCircle className="h-6 w-6 text-green-600 hover:text-green-800 transition" />
                          </div>
                        )}

                        {/* ON PROCESS */}
                        {req.status === "on process" && (
                          <div title="Processing">
                            <Clock className="h-6 w-6 text-gray-500" />
                          </div>
                        )}

                        {/* READY */}
                        {req.status === "ready for pick-up" && (
                          <div title="Ready for Pick-up">
                            <PackageCheck className="h-6 w-6 text-blue-600" />
                          </div>
                        )}

                        {/* RELEASED */}
                        {req.status === "released" && (
                          <div title="Released">
                            <CheckCheck className="h-6 w-6 text-green-600" />
                          </div>
                        )}

                        {/* DECLINED */}
                        {req.status === "declined" && (
                          <div title="Declined">
                            <XCircle className="h-6 w-6 text-red-600" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-gray-500"
                  >
                    No Document Requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Request Document</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Resident */}
              <div>
                <label className="block text-sm font-medium">Resident</label>
                <select
                  className="w-full border rounded p-2"
                  value={form.resident_id}
                  onChange={(e) =>
                    setForm({ ...form, resident_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Resident</option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.first_name} {r.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doc Type */}
              <div>
                <label className="block text-sm font-medium">
                  Document Type
                </label>
                <select
                  className="w-full border rounded p-2"
                  value={form.document_type_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      document_type_id: Number(e.target.value),
                    })
                  }
                  required
                >
                  <option value={0}>Select Document Type</option>
                  {documentTypes.map((dt) => (
                    <option key={dt.id} value={dt.id}>
                      {dt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium">Purpose</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={form.purpose}
                  onChange={(e) =>
                    setForm({ ...form, purpose: e.target.value })
                  }
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium">
                  Payment Method
                </label>
                <select
                  className="w-full border rounded p-2"
                  value={form.payment_method}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      payment_method: e.target.value as
                        | "cash"
                        | "gcash"
                        | "free",
                    })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="gcash">Gcash</option>
                  <option value="free">Free</option>
                </select>
              </div>

              {/* Amount */}
              {form.payment_method !== "free" && (
                <div>
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2 bg-gray-100"
                    value={formatCurrency(form.amount)}
                    readOnly
                  />
                </div>
              )}

              {/* GCash Reference */}
              {form.payment_method === "gcash" && (
                <div>
                  <label className="block text-sm font-medium">
                    GCash Reference Number
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={form.reference_number}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        reference_number: e.target.value,
                      })
                    }
                    required
                  />
                  <div className="mt-2">
                    <img
                      src="/images/gcash.jpg"
                      alt="GCash QR"
                      className="w-32 h-32 mx-auto"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
