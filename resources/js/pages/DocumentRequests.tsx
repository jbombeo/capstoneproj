import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Resident {
  id: number;
  first_name: string;
  last_name: string;
}

interface DocumentPayment {
  id: number;
  payment_method: string;
  amount: string;
  or_number: string;
}

interface DocumentRequest {
  id: number;
  resident: Resident;
  document_type: string;
  purpose: string;
  status: string;
  payments?: DocumentPayment[];
}

interface PageProps extends InertiaPageProps {
  requests: DocumentRequest[];
  residents: Resident[];
}

export default function DocumentRequests() {
  const { props } = usePage<PageProps>();
  const [requests, setRequests] = useState<DocumentRequest[]>(props.requests || []);
  const [residents] = useState<Resident[]>(props.residents || []);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    resident_id: "",
    document_type: "Barangay Clearance",
    purpose: "",
    payment_method: "Cash",
    amount: "",
  });

  // Accept request
  const handleAccept = async (req: DocumentRequest) => {
    try {
      const response = await axios.put(`/documentrequests/${req.id}/accept`);
      setRequests(prev =>
        prev.map(r => (r.id === req.id ? { ...r, status: response.data.status } : r))
      );
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  // Submit new request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/documentrequests", form);
      const newRequest: DocumentRequest = response.data;
      setRequests(prev => [...prev, newRequest]);
      setForm({
        resident_id: "",
        document_type: "Barangay Clearance",
        purpose: "",
        payment_method: "Cash",
        amount: "",
      });
      setShowModal(false);
    } catch (error) {
      console.error("Failed to submit request:", error);
    }
  };

  const filteredRequests = requests.filter((req) =>
    `${req.resident.first_name} ${req.resident.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={[{ title: "Document Requests", href: "/documentrequests" }]}>
      <Head title="Document Requests" />

      {/* Green header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">Document Requests</h1>
        <Button onClick={() => setShowModal(true)}>+ Request Document</Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by resident name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell>{req.resident.first_name} {req.resident.last_name}</TableCell>
                    <TableCell>{req.document_type}</TableCell>
                    <TableCell>{req.purpose}</TableCell>
                    <TableCell>{req.payments?.[0]?.payment_method || "N/A"}</TableCell>
                    <TableCell>{req.payments?.[0]?.amount || "0.00"}</TableCell>
                    <TableCell className="capitalize">{req.status}</TableCell>
                    <TableCell>
                      {req.status === "pending" && (
                        <Button size="sm" onClick={() => handleAccept(req)}>Accept</Button>
                      )}
                      {req.status === "on process" && (
                        <span className="text-gray-500 font-semibold">Accepted</span>
                      )}
                      {req.status === "ready for pick-up" && (
                        <span className="text-blue-600 font-semibold">Ready for Pick-up</span>
                      )}
                      {req.status === "released" && (
                        <span className="text-green-600 font-semibold">Released</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No Document Requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Request Document</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <select
                  className="w-full border rounded p-2"
                  value={form.resident_id}
                  onChange={e => setForm({ ...form, resident_id: e.target.value })}
                  required
                >
                  <option value="">Select Resident</option>
                  {residents.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.first_name} {r.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Document Type</label>
                <select
                  className="w-full border rounded p-2"
                  value={form.document_type}
                  onChange={e => setForm({ ...form, document_type: e.target.value })}
                >
                  <option>Barangay Clearance</option>
                  <option>Certificate of Indigenous</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Purpose</label>
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  value={form.purpose}
                  onChange={e => setForm({ ...form, purpose: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Payment Method</label>
                <select
                  className="w-full border rounded p-2"
                  value={form.payment_method}
                  onChange={e => setForm({ ...form, payment_method: e.target.value })}
                >
                  <option>Cash</option>
                  <option>Gcash</option>
                  <option>Free</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
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
