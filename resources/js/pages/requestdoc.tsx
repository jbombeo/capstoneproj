import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Request Document",
    href: dashboard().url,
  },
];

export default function RequestDoc() {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([
    {
      id: 1,
      fullname: "Juan Dela Cruz",
      pickupDate: "2025-09-05",
      paymentMethod: "Gcash",
      referenceNo: "REF123456",
      purpose: "Barangay Clearance",
      dateRequested: "2025-09-01",
      status: "Pending",
      trackingNo: "TRK-001",
    },
    {
      id: 2,
      fullname: "Maria Santos",
      pickupDate: "2025-09-06",
      paymentMethod: "Cash",
      referenceNo: "REF654321",
      purpose: "Residency Certificate",
      dateRequested: "2025-09-02",
      status: "Processing",
      trackingNo: "TRK-002",
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const filteredRequests = requests.filter(
    (req) =>
      req.fullname.toLowerCase().includes(search.toLowerCase()) ||
      req.purpose.toLowerCase().includes(search.toLowerCase()) ||
      req.referenceNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = (id: number, newStatus: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
    setSelectedRequest(null);
  };

  const handleAddRequest = (newRequest: any) => {
    setRequests((prev) => [...prev, { id: prev.length + 1, ...newRequest }]);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Request Document" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6 border-0 border-blue-700">
        <h1 className="text-3xl font-bold">Request Document</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search & Add Request */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6 border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
          <Input
            type="text"
            placeholder="Search by name, purpose, or reference no."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Add Request Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Request Document</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newRequest = {
                    fullname: formData.get("fullname") as string,
                    pickupDate: formData.get("pickupDate") as string,
                    paymentMethod: formData.get("paymentMethod") as string,
                    referenceNo: formData.get("referenceNo") as string,
                    purpose: formData.get("purpose") as string,
                    dateRequested: new Date().toISOString().split("T")[0],
                    status: "Pending",
                    trackingNo: `TRK-${Math.floor(Math.random() * 1000)}`,
                  };
                  handleAddRequest(newRequest);
                  (e.target as HTMLFormElement).reset();
                }}
              >
                <Input name="fullname" placeholder="Full Name" required />
                <Input
                  name="pickupDate"
                  type="date"
                  placeholder="Pick-up Date"
                  required
                />
                <Input
                  name="paymentMethod"
                  placeholder="Payment Method (Cash/Gcash)"
                  required
                />
                <Input
                  name="referenceNo"
                  placeholder="Reference Number"
                  required
                />
                <Input name="purpose" placeholder="Purpose" required />
                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Submit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-md bg-white">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50 sticky top-0 z-10 border-b border-gray-300">
              <TableRow>
                <TableHead className="border-r border-gray-300">No.</TableHead>
                <TableHead className="border-r border-gray-300">Full Name</TableHead>
                <TableHead className="border-r border-gray-300">Pick-up Date</TableHead>
                <TableHead className="border-r border-gray-300">Payment Method</TableHead>
                <TableHead className="border-r border-gray-300">Reference Number</TableHead>
                <TableHead className="border-r border-gray-300">Purpose</TableHead>
                <TableHead className="border-r border-gray-300">Date Requested</TableHead>
                <TableHead className="border-r border-gray-300">Status</TableHead>
                <TableHead className="border-r border-gray-300">Tracking No.</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req, index) => (
                <TableRow
                  key={req.id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:shadow-sm transition-shadow border-b border-gray-200`}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{req.fullname}</TableCell>
                  <TableCell>{req.pickupDate}</TableCell>
                  <TableCell>{req.paymentMethod}</TableCell>
                  <TableCell>{req.referenceNo}</TableCell>
                  <TableCell>{req.purpose}</TableCell>
                  <TableCell>{req.dateRequested}</TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>{req.trackingNo}</TableCell>
                  <TableCell>
                    {/* Action Modal */}
                    <Dialog
                      open={selectedRequest?.id === req.id}
                      onOpenChange={(open) => !open && setSelectedRequest(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                          onClick={() => setSelectedRequest(req)}
                        >
                          Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>
                            Update Status - {req.fullname}
                          </DialogTitle>
                        </DialogHeader>
                        <Select
                          defaultValue={req.status}
                          onValueChange={(value) => handleStatusChange(req.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Ready to Pickup">Ready to Pickup</SelectItem>
                            <SelectItem value="Released">Released</SelectItem>
                          </SelectContent>
                        </Select>
                        <DialogFooter className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            className="border-gray-400 text-gray-700 hover:bg-gray-400 hover:text-white"
                            onClick={() => setSelectedRequest(null)}
                          >
                            Close
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
