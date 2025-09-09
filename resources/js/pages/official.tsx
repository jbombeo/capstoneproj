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

interface Official {
  id: number;
  position: string;
  complete_name: string;
  contact: string;
  address: string;
  term_start: string;
  term_end: string;
  status: string;
  users_id: number;
}

interface OfficialPageProps extends InertiaPageProps {
  officials: Official[];
}

export default function OfficialPage() {
  const { officials } = usePage<OfficialPageProps>().props;

  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);

  const [formData, setFormData] = useState({
    position: "",
    complete_name: "",
    contact: "",
    address: "",
    term_start: "",
    term_end: "",
    status: "Active",
  });

  // Filtered search
  const filteredOfficials = officials.filter((o) =>
    o.complete_name.toLowerCase().includes(search.toLowerCase())
  );

  // Add official
  const handleAddOfficial = () => {
    router.post("/officials", formData, {
      onSuccess: () => {
        setFormData({
          position: "",
          complete_name: "",
          contact: "",
          address: "",
          term_start: "",
          term_end: "",
          status: "Active",
        });
        setOpenAdd(false);
        alert("Official added successfully!");
      },
    });
  };

  // Open edit dialog
  const handleEditOfficial = (official: Official) => {
    setEditingOfficial(official);
    setFormData({
      position: official.position,
      complete_name: official.complete_name,
      contact: official.contact,
      address: official.address,
      term_start: official.term_start,
      term_end: official.term_end,
      status: official.status,
    });
    setOpenEdit(true);
  };

  // Update official
  const handleUpdateOfficial = () => {
    if (!editingOfficial) return;

    router.put(`/officials/${editingOfficial.id}`, formData, {
      onSuccess: () => {
        setOpenEdit(false);
        setEditingOfficial(null);
        alert("Official updated successfully!");
      },
    });
  };

  // Delete official
  const handleDeleteOfficial = (id: number) => {
    if (confirm("Are you sure you want to delete this official?")) {
      router.delete(`/officials/${id}`, {
        onSuccess: () => {
          alert("Official deleted successfully!");
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Officials", href: "#" }]}>
      <Head title="Officials" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">Officials List</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search & Add */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                + Add Official
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Official</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {["position", "complete_name", "contact", "address"].map(
                  (field) => (
                    <div key={field}>
                      <Label>{field.replace("_", " ").toUpperCase()}</Label>
                      <Input
                        value={(formData as any)[field]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field]: e.target.value,
                          })
                        }
                      />
                    </div>
                  )
                )}
                <div>
                  <Label>Term Start</Label>
                  <Input
                    type="date"
                    value={formData.term_start}
                    onChange={(e) =>
                      setFormData({ ...formData, term_start: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Term End</Label>
                  <Input
                    type="date"
                    value={formData.term_end}
                    onChange={(e) =>
                      setFormData({ ...formData, term_end: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Input
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleAddOfficial}
                >
                  Add Official
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Officials Table */}
        <Card className="shadow-md rounded-2xl overflow-x-auto">
          <CardContent className="p-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Position</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Term Start</th>
                  <th className="px-4 py-2">Term End</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficials.length > 0 ? (
                  filteredOfficials.map((official) => (
                    <tr
                      key={official.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2">{official.position}</td>
                      <td className="px-4 py-2">{official.complete_name}</td>
                      <td className="px-4 py-2">{official.contact}</td>
                      <td className="px-4 py-2">{official.address}</td>
                      <td className="px-4 py-2">{official.term_start}</td>
                      <td className="px-4 py-2">{official.term_end}</td>
                      <td className="px-4 py-2">{official.status}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditOfficial(official)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteOfficial(official.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No officials found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Official</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {["position", "complete_name", "contact", "address"].map(
              (field) => (
                <div key={field}>
                  <Label>{field.replace("_", " ").toUpperCase()}</Label>
                  <Input
                    value={(formData as any)[field]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field]: e.target.value,
                      })
                    }
                  />
                </div>
              )
            )}
            <div>
              <Label>Term Start</Label>
              <Input
                type="date"
                value={formData.term_start}
                onChange={(e) =>
                  setFormData({ ...formData, term_start: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Term End</Label>
              <Input
                type="date"
                value={formData.term_end}
                onChange={(e) =>
                  setFormData({ ...formData, term_end: e.target.value })
                }
              />
            </div>
<div>
  <Label>Status</Label>
  <select
    className="border rounded px-2 py-1 w-full"
    value={formData.status}
    onChange={(e) =>
      setFormData({ ...formData, status: e.target.value })
    }
  >
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
    <option value="Leave">Leave</option>
  </select>
</div>

          </div>

          <DialogFooter className="mt-4">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleUpdateOfficial}
            >
              Update Official
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
