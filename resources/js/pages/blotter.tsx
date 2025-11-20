import { useState } from "react";
import { usePage, Head, router } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
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

interface Blotter {
  id: number;
  complainant: string;
  complainant_address?: string;
  complainant_age?: number;
  complainant_contact?: string;
  complainee: string;
  complainee_address?: string;
  complainee_age?: number;
  complainee_contact?: string;
  complaint: string;
  status: "unsettled" | "settled" | "scheduled";
  action?: string;
  incidence?: string;
  incident_datetime?: string;
  handled_by?: string;
}

interface BlotterPageProps extends InertiaPageProps {
  blotters: Blotter[];
}

interface BlotterFormData {
  complainant: string;
  complainant_address: string;
  complainant_age: string;
  complainant_contact: string;
  complainee: string;
  complainee_address: string;
  complainee_age: string;
  complainee_contact: string;
  complaint: string;
  status: "unsettled" | "settled" | "scheduled";
  action: string;
  incidence: string;
  handled_by: string;
  incident_datetime: string;
}

interface BlotterFormProps {
  formData: BlotterFormData;
  setFormData: React.Dispatch<React.SetStateAction<BlotterFormData>>;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

const BlotterForm: React.FC<BlotterFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  return (
    <div className="space-y-4">
      {[
        ["complainant", "Complainant"],
        ["complainant_address", "Complainant Address"],
        ["complainee", "Complainee"],
        ["complainee_address", "Complainee Address"],
        ["complaint", "Complaint"],
        ["action", "Action"],
        ["incidence", "Incidence"],
        ["handled_by", "Handled By"],
      ].map(([key, label]) => (
        <div key={key}>
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            value={(formData as any)[key]}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, [key]: e.target.value }))
            }
          />
        </div>
      ))}

      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="complainant_age">Complainant Age</Label>
          <Input
            id="complainant_age"
            type="number"
            value={formData.complainant_age}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                complainant_age: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="complainant_contact">Complainant Contact</Label>
          <Input
            id="complainant_contact"
            value={formData.complainant_contact}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                complainant_contact: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="complainee_age">Complainee Age</Label>
          <Input
            id="complainee_age"
            type="number"
            value={formData.complainee_age}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                complainee_age: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="complainee_contact">Complainee Contact</Label>
          <Input
            id="complainee_contact"
            value={formData.complainee_contact}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                complainee_contact: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              status: e.target.value as any,
            }))
          }
          className="border rounded px-2 py-1 w-full"
        >
          <option value="unsettled">Unsettled</option>
          <option value="settled">Settled</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div>
        <Label htmlFor="incident_datetime">Incident Date & Time</Label>
        <Input
          id="incident_datetime"
          type="datetime-local"
          value={formData.incident_datetime}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              incident_datetime: e.target.value,
            }))
          }
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>
  );
};

export default function BlotterPage() {
  const { blotters } = usePage<BlotterPageProps>().props;
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingBlotter, setEditingBlotter] = useState<Blotter | null>(null);
  const [viewingBlotter, setViewingBlotter] = useState<Blotter | null>(null);

  const [formData, setFormData] = useState<BlotterFormData>({
    complainant: "",
    complainant_address: "",
    complainant_age: "",
    complainant_contact: "",
    complainee: "",
    complainee_address: "",
    complainee_age: "",
    complainee_contact: "",
    complaint: "",
    status: "unsettled",
    action: "",
    incidence: "",
    handled_by: "",
    incident_datetime: new Date().toISOString().slice(0, 16),
  });

  const resetForm = () => {
    setFormData({
      complainant: "",
      complainant_address: "",
      complainant_age: "",
      complainant_contact: "",
      complainee: "",
      complainee_address: "",
      complainee_age: "",
      complainee_contact: "",
      complaint: "",
      status: "unsettled",
      action: "",
      incidence: "",
      handled_by: "",
      incident_datetime: new Date().toISOString().slice(0, 16),
    });
  };

  const handleAddBlotter = () => {
    router.post("/blotters", formData as any, {
      onSuccess: () => {
        resetForm();
        setOpenAdd(false);
        toast.success("Blotter added successfully!");
      },
    });
  };

  const handleEditBlotter = (blotter: Blotter) => {
    setEditingBlotter(blotter);
    setFormData({
      complainant: blotter.complainant,
      complainant_address: blotter.complainant_address ?? "",
      complainant_age: blotter.complainant_age?.toString() ?? "",
      complainant_contact: blotter.complainant_contact ?? "",
      complainee: blotter.complainee,
      complainee_address: blotter.complainee_address ?? "",
      complainee_age: blotter.complainee_age?.toString() ?? "",
      complainee_contact: blotter.complainee_contact ?? "",
      complaint: blotter.complaint,
      status: blotter.status,
      action: blotter.action ?? "",
      incidence: blotter.incidence ?? "",
      handled_by: blotter.handled_by ?? "",
      incident_datetime:
        blotter.incident_datetime ?? new Date().toISOString().slice(0, 16),
    });
    setOpenEdit(true);
  };

  const handleViewBlotter = (blotter: Blotter) => {
    setViewingBlotter(blotter);
    setOpenView(true);
  };

  const handleUpdateBlotter = () => {
    if (!editingBlotter) return;
    router.put(`/blotters/${editingBlotter.id}`, formData as any, {
      onSuccess: () => {
        setOpenEdit(false);
        setEditingBlotter(null);
        resetForm();
        toast.success("Blotter updated successfully!");
      },
    });
  };

  const handleDeleteBlotter = (id: number) => {
    if (confirm("Are you sure you want to delete this blotter?")) {
      router.delete(`/blotters/${id}`, {
        onSuccess: () => toast.error("Blotter deleted successfully!"),
      });
    }
  };

  const statusColors: Record<string, string> = {
    unsettled: "bg-red-200 text-red-800",
    settled: "bg-green-200 text-green-800",
    scheduled: "bg-blue-200 text-blue-800",
  };

  const filteredBlotters = blotters.filter((b) => {
    const matchesSearch =
      b.complainant.toLowerCase().includes(search.toLowerCase()) ||
      b.complainee.toLowerCase().includes(search.toLowerCase());

    const blotterDate = b.incident_datetime
      ? new Date(b.incident_datetime)
      : null;
    const matchesMonth = filterMonth
      ? blotterDate?.getMonth() === Number(filterMonth) - 1
      : true;
    const matchesYear = filterYear
      ? blotterDate?.getFullYear() === Number(filterYear)
      : true;

    return matchesSearch && matchesMonth && matchesYear;
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) =>
    (currentYear - i).toString()
  );

  const totalUnsettled = filteredBlotters.filter(
    (b) => b.status === "unsettled"
  ).length;
  const totalSettled = filteredBlotters.filter(
    (b) => b.status === "settled"
  ).length;
  const totalScheduled = filteredBlotters.filter(
    (b) => b.status === "scheduled"
  ).length;

  return (
    <AppLayout breadcrumbs={[{ title: "Blotters", href: "#" }]}>
      <Head title="Blotters" />
      <Toaster />

      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">Blotters List</h1>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Search by complainant or complainee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px]"
        />

        <select
          className="border rounded px-2 py-1"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-1"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">All Years</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 ml-auto whitespace-nowrap">
              + Add Blotter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Blotter</DialogTitle>
            </DialogHeader>
            <BlotterForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddBlotter}
              onCancel={() => setOpenAdd(false)}
              submitLabel="Add"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* 📊 Stats */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 bg-red-100 text-red-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold">{totalUnsettled}</div>
          <div>Unsettled</div>
        </div>
        <div className="flex-1 bg-green-100 text-green-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold">{totalSettled}</div>
          <div>Settled</div>
        </div>
        <div className="flex-1 bg-blue-100 text-blue-800 rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold">{totalScheduled}</div>
          <div>Scheduled</div>
        </div>
      </div>

      {/* 📋 Table */}
      <Card className="shadow-md rounded-2xl overflow-x-auto">
        <CardContent className="p-4">
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Complainant</th>
                  <th className="px-4 py-2">Complainee</th>
                  <th className="px-4 py-2">Complaint</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Handled By</th>
                  <th className="px-4 py-2">Incident Date</th>
                  <th className="px-4 py-2">Action</th>
                  <th className="px-4 py-2">Options</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlotters.length > 0 ? (
                  filteredBlotters.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2">{b.complainant}</td>
                      <td className="px-4 py-2">{b.complainee}</td>
                      <td className="px-4 py-2">{b.complaint}</td>
                      <td className="px-4 py-2 text-center">
                        <select
                          value={b.status}
                          onChange={(e) => {
                            const newStatus = e.target
                              .value as "unsettled" | "settled" | "scheduled";
                            router.put(
                              `/blotters/${b.id}`,
                              { ...b, status: newStatus } as any,
                              {
                                preserveScroll: true,
                                onSuccess: () =>
                                  toast.success("Status updated!"),
                                onError: () =>
                                  toast.error("Failed to update status"),
                              }
                            );
                          }}
                          className={`px-2 py-1 rounded-lg font-semibold text-center border ${statusColors[b.status]}`}
                        >
                          <option value="unsettled">Unsettled</option>
                          <option value="settled">Settled</option>
                          <option value="scheduled">Scheduled</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">{b.handled_by}</td>
                      <td className="px-4 py-2">
                        {b.incident_datetime?.slice(0, 16).replace("T", " ")}
                      </td>
                      <td className="px-4 py-2">{b.action}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleViewBlotter(b)}
                        >
                          View
                        </Button>
                        <Button size="sm" onClick={() => handleEditBlotter(b)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBlotter(b.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 👁️ View Dialog */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Blotter Details</DialogTitle>
          </DialogHeader>
          {viewingBlotter && (
            <div className="space-y-3">
              {Object.entries(viewingBlotter).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-semibold capitalize">
                    {key.replaceAll("_", " ")}:
                  </span>
                  <span className="text-gray-700">{value?.toString() || "—"}</span>
                </div>
              ))}
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setOpenView(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ✏️ Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blotter</DialogTitle>
          </DialogHeader>
          <BlotterForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateBlotter}
            onCancel={() => setOpenEdit(false)}
            submitLabel="Update"
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
