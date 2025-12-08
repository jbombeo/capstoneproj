import { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ScholarshipPage() {
  const { grantedScholars } = usePage<{
    grantedScholars: any[];
  }>().props;

  const [search, setSearch] = useState("");
  const [openView, setOpenView] = useState(false);
  const [viewScholar, setViewScholar] = useState<any | null>(null);

  const getYouthName = (y: any) =>
    `${y.first_name} ${y.middle_name ?? ""} ${y.last_name}`.trim();

  const imagePath = (img?: string | null) =>
    img ? `/storage/${img}` : "/images/default-avatar.png";

  const filtered = grantedScholars.filter((s) =>
    getYouthName(s.youth).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={[{ title: "Scholars", href: "#" }]}>
      <Head title="Granted Scholars" />

      {/* HEADER */}
      <div className="mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl">
        <h1 className="text-4xl font-extrabold">Granted Youth Scholars</h1>
        <p className="opacity-90 text-sm">
          List of all youth who received scholarship grants
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* SEARCH BAR */}
        <div className="bg-white px-5 py-4 rounded-xl shadow border flex justify-between items-center">
          <Input
            placeholder="Search youth name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* TABLE */}
        <Card className="shadow-xl rounded-2xl border overflow-x-auto">
          <CardContent className="p-0">
            <table className="w-full table-fixed text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 w-48">Youth</th>
                  <th className="px-6 py-3 w-48">Email</th> {/* NEW COLUMN */}
                  <th className="px-6 py-3">Scholarship</th>
                  <th className="px-6 py-3 w-32">Date Granted</th>
                  <th className="px-6 py-3 w-24">Status</th>
                  <th className="px-6 py-3 w-32 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      {/* Image + Name */}
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        <img
                          src={imagePath(s.youth.image)}
                          className="h-10 w-10 rounded-full object-cover border"
                        />
                        {getYouthName(s.youth)}
                      </td>

                      {/* NEW: Email */}
                      <td className="px-6 py-4">{s.youth.email}</td>

                      <td className="px-6 py-4">{s.scholarship.title}</td>

                      <td className="px-6 py-4">
                        {new Date(s.updated_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-white text-xs font-semibold bg-green-600">
                          granted
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setViewScholar(s);
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
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No scholars found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* VIEW MODAL */}
      {openView && viewScholar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex flex-col items-center">
              <img
                src={imagePath(viewScholar.youth.image)}
                className="w-24 h-24 rounded-full object-cover border shadow mb-3"
              />

              <h2 className="text-xl font-bold">
                {getYouthName(viewScholar.youth)}
              </h2>
              <p className="text-sm text-gray-500 mb-4">Scholar Details</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Email:</strong> {viewScholar.youth.email}
              </div>
              <div>
                <strong>Scholarship:</strong> {viewScholar.scholarship.title}
              </div>
              <div>
                <strong>Date Granted:</strong>{" "}
                {new Date(viewScholar.updated_at).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setOpenView(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
