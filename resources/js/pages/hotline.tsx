import { useState, useEffect } from "react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import toast, { Toaster } from "react-hot-toast";

interface Hotline {
  id: number;
  name: string;
  number: string;
}

interface HotlinePageProps extends InertiaPageProps {
  hotlines: Hotline[];
  errors: Record<string, string>;
  flash?: { success?: string; error?: string };
}

export default function HotlinePage() {
  const { hotlines, errors, flash } = usePage<HotlinePageProps>().props;

  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Hotline | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    number: "",
  });

  // Toast notifications
  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) => toast.error(msg));
    }
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [errors, flash]);

  const filteredHotlines = hotlines.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddHotline = () => {
    router.post("/hotlines", formData, {
      onSuccess: () => {
        setFormData({ name: "", number: "" });
        setOpenAdd(false);
      },
    });
  };

  const handleEditHotline = (hotline: Hotline) => {
    setEditing(hotline);
    setFormData({ name: hotline.name, number: hotline.number });
    setOpenEdit(true);
  };

  const handleUpdateHotline = () => {
    if (!editing) return;

    router.put(`/hotlines/${editing.id}`, formData, {
      onSuccess: () => {
        setOpenEdit(false);
        setEditing(null);
      },
    });
  };

  const handleDeleteHotline = (id: number) => {
    if (confirm("Are you sure you want to delete this hotline?")) {
      router.delete(`/hotlines/${id}`);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Hotlines", href: "#" }]}>
      <Head title="Hotlines" />
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl">
        <h1 className="text-3xl font-bold">Emergency Hotlines</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search + Add */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search hotline name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                + Add Hotline
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Hotline</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Number</Label>
                  <Input
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleAddHotline}
                >
                  Add Hotline
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card className="shadow-md rounded-2xl overflow-x-auto">
          <CardContent className="p-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Number</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredHotlines.length > 0 ? (
                  filteredHotlines.map((h) => (
                    <tr
                      key={h.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2">{h.name}</td>
                      <td className="px-4 py-2">{h.number}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditHotline(h)}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteHotline(h.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-4 text-gray-500"
                    >
                      No hotlines found
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
            <DialogTitle>Edit Hotline</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Number</Label>
              <Input
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleUpdateHotline}
            >
              Update Hotline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
