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

// Zone type
interface Zone {
  id: number;
  zone: string;
  username: string;
  password: string;
  created_at: string;
  updated_at: string;
}

// Props from Inertia
interface PageProps extends InertiaPageProps {
  zones: Zone[];
}

export default function ZonePage() {
  const { zones } = usePage<PageProps>().props;
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  const [formData, setFormData] = useState({
    zone: "",
    username: "",
    password: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Reset form function
  const resetForm = () =>
    setFormData({ zone: "", username: "", password: "" });

  // Filtered search
  const filteredZones = zones.filter((z) =>
    z.zone.toLowerCase().includes(search.toLowerCase())
  );

  // Add zone
  const handleAddZone = () => {
    router.post("/zones", formData, {
      onSuccess: () => {
        resetForm();
        setOpenAdd(false);
        toast.success("Zone added successfully!");
      },
      onError: () => toast.error("Failed to add zone."),
    });
  };

  // Open edit dialog
  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({
      zone: zone.zone,
      username: zone.username,
      password: zone.password,
    });
    setOpenEdit(true);
  };

  // Update zone
  const handleUpdateZone = () => {
    if (!editingZone) return;
    router.put(`/zones/${editingZone.id}`, formData, {
      onSuccess: () => {
        resetForm();
        setOpenEdit(false);
        setEditingZone(null);
        toast.success("Zone updated successfully!");
      },
      onError: () => toast.error("Failed to update zone."),
    });
  };

  // Delete zone (open modal)
  const handleDeleteZone = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedId) {
      router.delete(`/zones/${selectedId}`, {
        onSuccess: () => {
          toast.success("Zone deleted successfully!");
          setIsModalOpen(false);
          setSelectedId(null);
        },
        onError: () => toast.error("Failed to delete zone."),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Zones", href: "#" }]}>
      <Head title="Zones" />
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">Zone List</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search & Add */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Dialog
            open={openAdd}
            onOpenChange={(isOpen) => {
              setOpenAdd(isOpen);
              if (!isOpen) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                + Add Zone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Zone</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>ZONE</Label>
                  <Input
                    value={formData.zone}
                    onChange={(e) =>
                      setFormData({ ...formData, zone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>USERNAME</Label>
                  <Input
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>PASSWORD</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleAddZone}
                >
                  Add Zone
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Zones Table */}
        <Card className="shadow-md rounded-2xl overflow-x-auto">
          <CardContent className="p-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Zone</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Password</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.length > 0 ? (
                  filteredZones.map((zone) => (
                    <tr
                      key={zone.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2">{zone.id}</td>
                      <td className="px-4 py-2">{zone.zone}</td>
                      <td className="px-4 py-2">{zone.username}</td>
                      <td className="px-4 py-2">{zone.password}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditZone(zone)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteZone(zone.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-4 text-gray-500"
                    >
                      No zones found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit}
        onOpenChange={(isOpen) => {
          setOpenEdit(isOpen);
          if (!isOpen) {
            resetForm();
            setEditingZone(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Zone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>ZONE</Label>
              <Input
                value={formData.zone}
                onChange={(e) =>
                  setFormData({ ...formData, zone: e.target.value })
                }
              />
            </div>
            <div>
              <Label>USERNAME</Label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
            <div>
              <Label>PASSWORD</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleUpdateZone}
            >
              Update Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal WITHOUT black background */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 border border-gray-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this zone? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
