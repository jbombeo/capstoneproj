// resources/js/pages/DocumentRequests.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const DocumentRequests: React.FC = () => {
  const [residents, setResidents] = useState<any[]>([]);
  const [form, setForm] = useState({
    resident_id: "",
    document_type: "Barangay Certificate",
    purpose: "",
    payment_method: "",
  });

  const [printData, setPrintData] = useState<any | null>(null);

  // fetch residents from backend
  useEffect(() => {
    axios.get("/api/residents").then((res) => {
      setResidents(res.data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    axios.post("/api/document-requests", form).then((res) => {
      // store print data for printing
      setPrintData({
        ...form,
        resident_name: residents.find(r => r.id === parseInt(form.resident_id))?.full_name || "",
      });

      // directly trigger print after short delay
      setTimeout(() => {
        window.print();
      }, 300);
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Request Document</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Resident Name</label>
          <select
            name="resident_id"
            value={form.resident_id}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Select Resident</option>
            {residents.map((resident) => (
              <option key={resident.id} value={resident.id}>
                {resident.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Document Type</label>
          <select
            name="document_type"
            value={form.document_type}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="Barangay Certificate">Barangay Certificate</option>
            <option value="Certificate of Indigenous">Certificate of Indigenous</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Purpose</label>
          <input
            type="text"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="Enter purpose"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <input
            type="text"
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="Cash / GCash / etc."
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit & Print
        </button>
      </form>

      {/* hidden printable area */}
      {printData && (
        <div className="hidden print:block mt-10">
          <div className="border p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Document Request</h2>
            <p><strong>Resident:</strong> {printData.resident_name}</p>
            <p><strong>Document Type:</strong> {printData.document_type}</p>
            <p><strong>Purpose:</strong> {printData.purpose}</p>
            <p><strong>Payment Method:</strong> {printData.payment_method}</p>
            <p className="mt-6">Signature: ______________________</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRequests;
