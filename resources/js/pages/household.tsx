import { useState, useEffect } from "react";
import { usePage, Head } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Zone {
  id: number;
  zone: string;
}

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  relation: string;
  gender: string;
  age: number;
  image?: string | null;
}

interface HeadResident {
  id: number;
  first_name: string;
  last_name: string;
  zone?: Zone;
  image?: string | null;
}

interface Household {
  id: number;
  household_no: number;
  household_member: number;
  zone?: Zone;
  headOfFamily: HeadResident;
  members: Member[];
}

interface HouseholdPageProps extends InertiaPageProps {
  households: Household[];
  errors: Record<string, string>;
  flash?: { success?: string; error?: string };
}

export default function HouseholdPage() {
  const { households, errors, flash } = usePage<HouseholdPageProps>().props;

  const [search, setSearch] = useState("");

  const [openMembers, setOpenMembers] = useState(false);
  const [selected, setSelected] = useState<Household | null>(null);

  useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      Object.values(errors).forEach((msg) => toast.error(msg));
    }
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [errors, flash]);

  const filteredHouseholds = households.filter((h) =>
    `${h.headOfFamily?.first_name} ${h.headOfFamily?.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openModal = (house: Household) => {
    setSelected(house);
    setOpenMembers(true);
  };

  const imagePath = (img?: string | null) => {
    return img ? `/storage/${img}` : "/images/default-avatar.png";
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Households", href: "#" }]}>
      <Head title="Households" />
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl">
        <h1 className="text-4xl font-extrabold">Household Registry</h1>
        <p className="opacity-90 text-sm">
          Official Barangay Household Information Records
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* SEARCH */}
        <div className="flex justify-between items-center mb-6 bg-white px-5 py-4 rounded-xl shadow border">
          <Input
            placeholder="Search by head of family..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* TABLE */}
        <Card className="shadow-xl rounded-2xl border">
          <CardContent className="p-0">
            <table className="w-full text-sm text-left table-fixed">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 w-32">Household No</th>
                  <th className="px-6 py-3 w-64">Head of Family</th>
                  <th className="px-6 py-3 w-32 text-center">Members</th>
                  <th className="px-6 py-3 w-24 text-center">Zone</th>
                </tr>
              </thead>

              <tbody>
                {filteredHouseholds.length > 0 ? (
                  filteredHouseholds.map((house) => (
                    <tr
                      key={house.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      {/* Household No */}
                      <td className="px-6 py-4 font-semibold text-green-800">
                        <span className="bg-green-100 px-3 py-1 rounded-lg">
                          {house.household_no}
                        </span>
                      </td>

                      {/* Head of Family */}
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={imagePath(house.headOfFamily.image)}
                            className="h-10 w-10 rounded-full object-cover border"
                          />
                          <div>
                            {house.headOfFamily.last_name},{" "}
                            {house.headOfFamily.first_name}
                          </div>
                        </div>
                      </td>

                      {/* Members */}
                      <td
                        onClick={() => openModal(house)}
                        className="px-6 py-4 text-blue-700 font-bold cursor-pointer"
                      >
                        <div className="flex justify-center items-center gap-2 hover:underline">
                          <Users className="h-5 w-5 text-blue-700" />
                          {house.household_member}
                        </div>
                      </td>

                      {/* Zone */}
                      <td className="px-6 py-4 text-center">
                        <span className="bg-gray-200 px-3 py-1 rounded-lg text-gray-700 font-medium">
                          {house.zone?.zone ??
                            house.headOfFamily?.zone?.zone ??
                            ""}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No households found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* MEMBER MODAL */}
      <Dialog open={openMembers} onOpenChange={setOpenMembers}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Family Composition
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 mt-4">
              {/* HEAD OF FAMILY */}
              <div className="flex flex-col items-center">
                <img
                  src={imagePath(selected.headOfFamily.image)}
                  className="w-24 h-24 rounded-full border object-cover shadow"
                />
                <p className="text-lg font-bold mt-2">
                  {selected.headOfFamily.last_name},{" "}
                  {selected.headOfFamily.first_name}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Head of Family
                </p>
              </div>

              <div className="w-full border-t my-4"></div>

              {/* MEMBERS LIST */}
              <div className="grid grid-cols-2 gap-4">
                {selected.members
                  .filter((m) => m.relation !== "Head")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="p-4 border rounded-xl bg-gray-50 shadow-sm flex flex-col items-center"
                    >
                      <img
                        src={imagePath(m.image)}
                        className="w-20 h-20 rounded-full object-cover border shadow"
                      />

                      <p className="mt-3 text-center font-bold text-gray-900">
                        {m.last_name}, {m.first_name}
                      </p>

                      <p className="text-xs text-gray-500">{m.relation}</p>
                      <p className="text-xs text-gray-500">{m.gender}</p>
                      <p className="text-xs text-gray-500">{m.age} yrs old</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
