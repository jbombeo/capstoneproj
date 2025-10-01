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
import toast, { Toaster } from "react-hot-toast";


interface Zone {
  id: number;
  zone: string;
}

interface Household {
  id: number;
  household_no: number;
  household_member: number;
  zone?: Zone;
  headOfFamily: {
    id: number;
    first_name: string;
    last_name: string;
    zone?: Zone;
  };
}

interface ResidentHead {
  id: number;
  first_name: string;
  last_name: string;
  zone?: Zone;
}

interface HouseholdPageProps {
  households: Household[];
  heads: ResidentHead[];
  errors: Record<string, string>;
  flash?: { success?: string; error?: string };
  [key: string]: any;
}

export default function HouseholdPage() {
  const { households, heads, errors, flash } =
    usePage<HouseholdPageProps>().props;

  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingHousehold, setEditingHousehold] =
    useState<Household | null>(null);

  const [formData, setFormData] = useState({
    household_no: "",
    household_member: "1",
    head_of_family: "",
  });


  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) => toast.error(msg));
    }
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [errors, flash]);

  const filteredHouseholds = households.filter((h) =>
    `${h.headOfFamily?.first_name} ${h.headOfFamily?.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleAddHousehold = () => {
    router.post("/households", formData, {
      onSuccess: () => {
        setFormData({
          household_no: "",
          household_member: "1",
          head_of_family: "",
        });
        setOpenAdd(false);
      },
    });
  };

  const handleEditHousehold = (house: Household) => {
    setEditingHousehold(house);
    setFormData({
      household_no: String(house.household_no),
      household_member: String(house.household_member),
      head_of_family: String(house.headOfFamily?.id ?? ""),
    });
    setOpenEdit(true);
  };

  const handleUpdateHousehold = () => {
    if (!editingHousehold) return;
    router.put(
      `/households/${editingHousehold.id}`,
      {
        household_no: formData.household_no,
        household_member: formData.household_member,
      },
      {
        onSuccess: () => {
          setOpenEdit(false);
          setEditingHousehold(null);
        },
      }
    );
  };

  const handleDeleteHousehold = (id: number) => {
    if (confirm("Are you sure you want to delete this household?")) {
      router.delete(`/households/${id}`);
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Households", href: "#" }]}>
      <Head title="Households" />
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">Households List</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search + Add */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by head of family..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                + Add Household
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Household</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <Label>Household No</Label>
                  <Input
                    value={formData.household_no}
                    onChange={(e) =>
                      setFormData({ ...formData, household_no: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Household Members</Label>
                  <Input
                    type="number"
                    value={formData.household_member}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        household_member: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Head of Family</Label>
                  <select
                    value={formData.head_of_family}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        head_of_family: e.target.value,
                      })
                    }
                    className="w-full border rounded-md p-2"
                  >
                    <option value="">-- Select Head of Family --</option>
                    {heads.map((head) => (
                      <option key={head.id} value={head.id}>
                        {head.last_name}, {head.first_name}{" "}
                        {head.zone ? `(${head.zone.zone})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleAddHousehold}
                >
                  Add Household
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
                  <th className="px-4 py-2">Household No</th>
                  <th className="px-4 py-2">Members</th>
                  <th className="px-4 py-2">Zone</th>
                  <th className="px-4 py-2">Head of Family</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHouseholds.length > 0 ? (
                  filteredHouseholds.map((house) => (
                    <tr
                      key={house.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2">{house.household_no}</td>
                      <td className="px-4 py-2">{house.household_member}</td>
                      <td className="px-4 py-2">
                        {house.zone?.zone ??
                          house.headOfFamily?.zone?.zone ??
                          ""}
                      </td>
                      <td className="px-4 py-2">
                        {house.headOfFamily?.last_name},{" "}
                        {house.headOfFamily?.first_name}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditHousehold(house)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteHousehold(house.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No households found
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
            <DialogTitle>Edit Household</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label>Household No</Label>
              <Input
                value={formData.household_no}
                onChange={(e) =>
                  setFormData({ ...formData, household_no: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Members</Label>
              <Input
                type="number"
                value={formData.household_member}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    household_member: e.target.value,
                  })
                }
              />
            </div>
            {/* head_of_family not editable */}
          </div>

          <DialogFooter className="mt-4">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleUpdateHousehold}
            >
              Update Household
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
