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

interface Zone {
  id: number;
  zone: string;
}

interface PagePropsExtended extends InertiaPageProps {
  zones: Zone[];
}

export default function ZonePage() {
  const { zones } = usePage<PagePropsExtended>().props;

  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  const [formData, setFormData] = useState({
    zone: "",
  });

  const resetForm = () => setFormData({ zone: "" });

  const filteredZones = zones.filter((z) =>
    z.zone.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    setFormData({ zone: zone.zone });
    setOpenEdit(true);
  };

  const handleUpdateZone = () => {
    if (!editingZone) return;

    router.put(`/zones/${editingZone.id}`, formData, {
      onSuccess: () => {
        resetForm();
        setEditingZone(null);
        setOpenEdit(false);
        toast.success("Zone updated successfully!");
      },
      onError: () => toast.error("Failed to update zone."),
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Zones", href: "#" }]}>
      <Head title="Zones" />
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl">
        <h1 className="text-4xl font-extrabold">Barangay Zones</h1>
        <p className="opacity-90 text-sm">
          Manage and organize residential zones within the barangay.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* SEARCH & ADD BUTTON */}
        <div className="flex justify-between items-center mb-6 bg-white px-5 py-4 rounded-xl shadow border">
          <Input
            placeholder="Search zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
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
                  <Label>Zone Name</Label>
                  <Input
                    value={formData.zone}
                    onChange={(e) =>
                      setFormData({ ...formData, zone: e.target.value })
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

        {/* TABLE */}
        <Card className="shadow-xl rounded-2xl border overflow-x-auto">
          <CardContent className="p-0">
            <table className="w-full text-sm text-left table-fixed min-w-[600px]">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 w-20">ID</th>
                  <th className="px-6 py-3 w-96">Zone</th>
                  <th className="px-6 py-3 w-40 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredZones.length > 0 ? (
                  filteredZones.map((zone) => (
                    <tr
                      key={zone.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-semibold">{zone.id}</td>

                      <td className="px-6 py-4">{zone.zone}</td>

                      <td className="px-6 py-4 text-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditZone(zone)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-8 text-gray-500"
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

      {/* EDIT MODAL */}
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
              <Label>Zone Name</Label>
              <Input
                value={formData.zone}
                onChange={(e) =>
                  setFormData({ ...formData, zone: e.target.value })
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
    </AppLayout>
  );
}
