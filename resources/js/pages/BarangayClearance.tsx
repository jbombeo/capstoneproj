import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";

interface Resident {
  id: number;
  first_name: string;
  last_name: string;
}

interface DocumentRequest {
  id: number;
  resident: Resident;
  document_type: string;
  purpose: string;
  status: string;
}

interface Official {
  id: number;
  position: string;
  complete_name: string;
}

interface PageProps extends InertiaPageProps {
  clearances: DocumentRequest[];
  officials: Official[];
}

// Helper for date suffix
function getDayWithSuffix(day: number) {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

export default function BarangayClearance() {
  const { props } = usePage<PageProps>();
  const [clearances] = useState<DocumentRequest[]>(props.clearances || []);
  const [officials] = useState<Official[]>(props.officials || []);
  const [printDoc, setPrintDoc] = useState<DocumentRequest | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (printDoc) {
      const timer = setTimeout(() => window.print(), 200);
      return () => clearTimeout(timer);
    }
  }, [printDoc]);

  const handlePrint = (doc: DocumentRequest) => {
    setPrintDoc(doc);
  };

  const filteredClearances = clearances.filter((req) =>
    `${req.resident.first_name} ${req.resident.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Officials
  const punongBarangay = officials.find((o) => o.position === "Punong Barangay");
  const kagawads = officials.filter((o) => o.position === "Barangay Kagawad");
  const skChairman = officials.find((o) => o.position === "SK Chairman");
  const secretary = officials.find((o) =>
    ["Secretary", "Barangay Secretary", "Secr"].includes(o.position)
  );
  const treasurer = officials.find((o) =>
    ["Treasurer", "Barangay Treasurer"].includes(o.position)
  );

  const today = new Date();
  const formattedDate = `${getDayWithSuffix(today.getDate())} of ${today.toLocaleDateString(
    "en-US",
    { month: "long" }
  )}, ${today.getFullYear()}`;

  return (
    <AppLayout breadcrumbs={[{ title: "Barangay Clearances", href: "/BarangayClearances" }]}>
      <Head title="Barangay Clearances" />
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">Barangay Clearance Requests</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by resident name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClearances.length > 0 ? (
                filteredClearances.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      {req.resident.first_name} {req.resident.last_name}
                    </TableCell>
                    <TableCell>{req.purpose}</TableCell>
                    <TableCell className="capitalize">{req.status}</TableCell>
                    <TableCell>
                      {req.status === "on process" && (
                        <Button size="sm" onClick={() => handlePrint(req)}>
                          Print
                        </Button>
                      )}
                      {req.status === "pending" && <span className="text-gray-500 font-semibold">Pending</span>}
                      {req.status === "ready for pick-up" && (
                        <span className="text-blue-600 font-semibold">Ready for Pick-up</span>
                      )}
                      {req.status === "released" && (
                        <span className="text-green-600 font-semibold">Released</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No Barangay Clearance requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Print Area */}
      {printDoc && (
        <div
          id="print-area"
          className="hidden print:block relative bg-white text-black leading-relaxed font-serif"
          style={{
            width: "185mm",
            height: "270mm",
            padding: "10mm",
            border: "10px solid #1B5E20", // Green border frame
            fontFamily: "'Times New Roman', Georgia, serif", // official font
          }}
        >
          {/* HEADER */}
          <div className="text-center">
            <div className="flex justify-between items-center">
              <img src="/images/logo.png" alt="Logo Left" className="w-20 h-20" />
              <div>
                <p className="text-sm">Republic of the Philippines</p>
                <p className="text-sm">Province of Misamis Oriental</p>
                <p className="text-sm">City of Cagayan de Oro</p>
                <p className="font-bold uppercase text-green-800">Barangay Iponan</p>
              </div>
              <img src="/images/cdologo.png" alt="Logo Right" className="w-20 h-20" />
            </div>

            <h2 className="mt-4 font-bold text-lg uppercase text-green-700">
              Office of the Punong Barangay
            </h2>
            <hr className="border-green-700 my-2" />
            <h1 className="text-3xl font-bold underline uppercase text-green-900">
              Barangay Clearance
            </h1>
          </div>

          {/* MAIN CONTENT */}
          <div className="grid grid-cols-3 gap-6 mt-10">
            {/* LEFT: Officials */}
            <div className="col-span-1 pr-4 text-sm">
              <div
                className="p-4 rounded-lg shadow-md border border-green-700"
                style={{ backgroundColor: "#98FF98" }} // Mint green background
              >
                <h2 className="font-bold text-green-800 text-center mb-4 text-base">
                  Barangay Officials
                </h2>

                {punongBarangay && (
                  <>
                    <p className="font-bold text-[15px]">
                      {punongBarangay.complete_name}
                    </p>
                    <p className="mb-3">Punong Barangay</p>
                  </>
                )}

                {kagawads.length > 0 && (
                  <>
                    <p className="underline">Barangay Kagawad</p>
                    <ul className="ml-2 mb-3 list-disc list-inside">
                      {kagawads.map((k) => (
                        <li key={k.id} className="text-[15px] font-medium">
                          {k.complete_name}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {skChairman && (
                  <p className="mt-2">
                    <span className="font-bold text-[15px]">
                      {skChairman.complete_name}
                    </span>
                    <br />
                    SK Chairman
                  </p>
                )}

                {secretary && (
                  <p className="mt-3">
                    <span className="font-bold text-[15px]">
                      {secretary.complete_name}
                    </span>
                    <br />
                    Secretary
                  </p>
                )}

                {treasurer && (
                  <p className="mt-3">
                    <span className="font-bold text-[15px]">
                      {treasurer.complete_name}
                    </span>
                    <br />
                    Treasurer
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT: Certificate Body */}
            <div className="col-span-2 pl-6 text-justify text-[15px] relative">
              {/* Watermark */}
              <div className="absolute inset-y-0 right-0 flex items-center opacity-10 pr-10">
                <img src="/images/logo.png" alt="Watermark" className="w-90 h-90" />
              </div>

              <div className="relative z-10">
                <p className="mt-2">
                  This is to certify that{" "}
                  <span className="font-bold underline">
                    {printDoc.resident.first_name} {printDoc.resident.last_name}
                  </span>{" "}
                  residing at Barangay Iponan, Cagayan de Oro City, is a bona fide
                  resident of this barangay.
                </p>

                <p className="mt-4">
                  This certification is issued upon the request of the above-named
                  person for the purpose of{" "}
                  <span className="font-bold underline">{printDoc.purpose}</span>.
                </p>

                <p className="mt-4">
                  Given this <span className="underline">{formattedDate}</span> at
                  Barangay Iponan, Cagayan de Oro City, Misamis Oriental.
                </p>

                {/* Signature */}
                {punongBarangay && (
                  <div className="mt-16 text-right pr-16">
                    <p className="font-bold uppercase text-green-900">
                      {punongBarangay.complete_name}
                    </p>
                    <p>Punong Barangay</p>
                  </div>
                )}

                {/* QR Code */}
                <img
                  src={`/documentrequests/${printDoc.id}/qrcode`}
                  alt="QR Code"
                  className="w-28 h-28"
                />
                <p className="mt-2 text-center text-sm text-gray-600">
                  Scan QR code to verify release status
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER SEAL */}
          <div className="absolute bottom-10 left-0 right-0 text-center">
            <p className="text-green-800 font-bold uppercase tracking-wider text-lg">
              Certified True Copy
            </p>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
