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
  DialogFooter,
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
      {/* Complainant */}
      <div>
        <Label htmlFor="complainant">Complainant</Label>
        <Input
          id="complainant"
          value={formData.complainant}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, complainant: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor="complainant_address">Complainant Address</Label>
        <Input
          id="complainant_address"
          value={formData.complainant_address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, complainant_address: e.target.value }))
          }
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="complainant_age">Complainant Age</Label>
          <Input
            id="complainant_age"
            type="number"
            value={formData.complainant_age}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, complainant_age: e.target.value }))
            }
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="complainant_contact">Complainant Contact</Label>
          <Input
            id="complainant_contact"
            value={formData.complainant_contact}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, complainant_contact: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Complainee */}
      <div>
        <Label htmlFor="complainee">Complainee</Label>
        <Input
          id="complainee"
          value={formData.complainee}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, complainee: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor="complainee_address">Complainee Address</Label>
        <Input
          id="complainee_address"
          value={formData.complainee_address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, complainee_address: e.target.value }))
          }
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="complainee_age">Complainee Age</Label>
          <Input
            id="complainee_age"
            type="number"
            value={formData.complainee_age}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, complainee_age: e.target.value }))
            }
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="complainee_contact">Complainee Contact</Label>
          <Input
            id="complainee_contact"
            value={formData.complainee_contact}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, complainee_contact: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Complaint & Status */}
      <div>
        <Label htmlFor="complaint">Complaint</Label>
        <Input
          id="complaint"
          value={formData.complaint}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, complaint: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, status: e.target.value as any }))
          }
          className="border rounded px-2 py-1 w-full"
        >
          <option value="unsettled">Unsettled</option>
          <option value="settled">Settled</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Action, Incidence, Handled By */}
      <div>
        <Label htmlFor="action">Action</Label>
        <Input
          id="action"
          value={formData.action}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, action: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor="incidence">Incidence</Label>
        <Input
          id="incidence"
          value={formData.incidence}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, incidence: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor="handled_by">Handled By</Label>
        <Input
          id="handled_by"
          value={formData.handled_by}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, handled_by: e.target.value }))
          }
        />
      </div>
      <div>
        <Label htmlFor="incident_datetime">Incident Date & Time</Label>
        <Input
          id="incident_datetime"
          type="datetime-local"
          value={formData.incident_datetime}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, incident_datetime: e.target.value }))
          }
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => {
            onCancel();
            // Reset form when modal closes
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
          }}
        >
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
  const [editingBlotter, setEditingBlotter] = useState<Blotter | null>(null);

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

  const filteredBlotters = blotters.filter((b) => {
    const matchesSearch =
      b.complainant.toLowerCase().includes(search.toLowerCase()) ||
      b.complainee.toLowerCase().includes(search.toLowerCase());

    const blotterDate = b.incident_datetime ? new Date(b.incident_datetime) : null;
    const matchesMonth = filterMonth ? blotterDate?.getMonth() === Number(filterMonth) - 1 : true;
    const matchesYear = filterYear ? blotterDate?.getFullYear() === Number(filterYear) : true;

    return matchesSearch && matchesMonth && matchesYear;
  });

  const handleAddBlotter = () => {
    router.post("/blotters", { ...formData }, {
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
      incident_datetime: blotter.incident_datetime ?? new Date().toISOString().slice(0, 16),
    });
    setOpenEdit(true);
  };

  const handleUpdateBlotter = () => {
    if (!editingBlotter) return;

    router.put(`/blotters/${editingBlotter.id}`, { ...formData }, {
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
        onSuccess: () => {
          toast.error("Blotter deleted successfully!");
        },
      });
    }
  };

  const statusColors: Record<string, string> = {
    unsettled: "bg-red-200 text-red-800",
    settled: "bg-green-200 text-green-800",
    scheduled: "bg-blue-200 text-blue-800",
  };

  const totalUnsettled = filteredBlotters.filter((b) => b.status === "unsettled").length;
  const totalSettled = filteredBlotters.filter((b) => b.status === "settled").length;
  const totalScheduled = filteredBlotters.filter((b) => b.status === "scheduled").length;

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

  return (
    <AppLayout breadcrumbs={[{ title: "Blotters", href: "#" }]}>
      <Head title="Blotters" />

      <Toaster
        containerStyle={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">Blotters List</h1>
      </div>

      {/* Search, Filters & Add Button */}
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
            <option key={y} value={y}>{y}</option>
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

      {/* Totals */}
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

      {/* Table */}
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
                    <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-2">{b.complainant}</td>
                      <td className="px-4 py-2">{b.complainee}</td>
                      <td className="px-4 py-2">{b.complaint}</td>
                      <td className={`px-4 py-2 rounded-lg font-semibold text-center ${statusColors[b.status]}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </td>
                      <td className="px-4 py-2">{b.handled_by}</td>
                      <td className="px-4 py-2">{b.incident_datetime?.slice(0, 16).replace("T", " ")}</td>
                      <td className="px-4 py-2">{b.action}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button size="sm" onClick={() => handleEditBlotter(b)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteBlotter(b.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
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
