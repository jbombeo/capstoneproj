import { useState } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

interface Resident {
  name: string;
}

interface Feedback {
  id: number;
  type: "feedback" | "suggestion" | "complaint";
  message: string;
  status: "pending" | "reviewed" | "resolved";
  created_at: string;
  resident?: Resident;
}

interface PageProps extends InertiaPageProps {
  feedbacks: Feedback[];
}

export default function AdminFeedbackPage() {
  const { feedbacks } = usePage<PageProps>().props;

  const [search, setSearch] = useState("");
  const [openView, setOpenView] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const [formData, setFormData] = useState({
    type: "",
    message: "",
  });

  const resetForm = () => setFormData({ type: "", message: "" });

  const handleSubmitFeedback = () => {
    router.post("/admin/feedback", formData, {
      onSuccess: () => {
        toast.success("Feedback added!");
        resetForm();
        setOpenAdd(false);
      },
      onError: () => toast.error("Failed to add feedback"),
    });
  };

  const handleStatusChange = (id: number, status: string) => {
    router.patch(`/feedback/${id}`, { status }, {
      onSuccess: () => toast.success("Status updated!"),
      onError: () => toast.error("Failed to update status"),
    });
  };

  /** BADGE COLORS */
  const typeColors: Record<string, string> = {
    feedback: "bg-blue-100 text-blue-700",
    suggestion: "bg-green-100 text-green-700",
    complaint: "bg-red-100 text-red-700",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };

  const filtered = feedbacks.filter(
    (f) =>
      f.message.toLowerCase().includes(search.toLowerCase()) ||
      f.resident?.name.toLowerCase().includes(search.toLowerCase())
  );

  /** COUNTERS */
  const pending = filtered.filter((f) => f.status === "pending").length;
  const reviewed = filtered.filter((f) => f.status === "reviewed").length;
  const resolved = filtered.filter((f) => f.status === "resolved").length;

  return (
    <AppLayout breadcrumbs={[{ title: "Feedback", href: "#" }]}>
      <Head title="Feedback Management" />
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl">
        <h1 className="text-4xl font-extrabold">Feedback Management</h1>
        <p className="opacity-90 text-sm">Review and manage resident concerns.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* SEARCH & ADD */}
        <div className="flex justify-between items-center bg-white px-5 py-4 rounded-xl shadow border">
          <Input
            placeholder="Search feedback..."
            className="max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                + Add Feedback
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Feedback</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <Label>Type</Label>
                  <select
                    className="border rounded w-full p-2"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="feedback">Feedback</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>

                <div>
                  <Label>Message</Label>
                  <textarea
                    rows={3}
                    className="border rounded w-full p-2"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpenAdd(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitFeedback}>Submit</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* STATUS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow text-center">
            <div className="text-3xl font-bold">{pending}</div>
            Pending
          </div>

          <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow text-center">
            <div className="text-3xl font-bold">{reviewed}</div>
            Reviewed
          </div>

          <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow text-center">
            <div className="text-3xl font-bold">{resolved}</div>
            Resolved
          </div>
        </div>

        {/* TABLE */}
        <Card className="shadow-xl rounded-2xl border overflow-x-auto">
          <CardContent className="p-0">
            <table className="w-full text-sm text-left table-fixed min-w-[900px]">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 w-40">Resident</th>
                  <th className="px-6 py-3 w-32">Type</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3 w-32 text-center">Status</th>
                  <th className="px-6 py-3 w-40">Date</th>
                  <th className="px-6 py-3 w-24 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">
                        {f.resident?.name}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${typeColors[f.type]}`}
                        >
                          {f.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 truncate max-w-xs">
                        {f.message}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <select
                          className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${statusColors[f.status]}`}
                          value={f.status}
                          onChange={(e) =>
                            handleStatusChange(f.id, e.target.value)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        {new Date(f.created_at).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedFeedback(f);
                            setOpenView(true);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No feedback found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* VIEW MODAL */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>

          {selectedFeedback && (
            <div className="space-y-3 text-sm">
              <div><strong>From:</strong> {selectedFeedback.resident?.name}</div>

              <div>
                <strong>Type:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${typeColors[selectedFeedback.type]}`}
                >
                  {selectedFeedback.type}
                </span>
              </div>

              <div>
                <strong>Message:</strong>
                <p className="bg-gray-100 p-3 rounded border mt-1">
                  {selectedFeedback.message}
                </p>
              </div>

              <div>
                <strong>Status:</strong> {selectedFeedback.status}
              </div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(selectedFeedback.created_at).toLocaleString()}
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setOpenView(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
