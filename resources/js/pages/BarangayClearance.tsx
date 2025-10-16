import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import QRScannerModal from "@/components/modals/QRScannerModal";

// ==========================
// Types
// ==========================
interface Resident {
  id: number;
  first_name: string;
  last_name: string;
}

interface DocumentRequest {
  id: number;
  resident: Resident;
  purpose: string;
  status: string;
  qr_token?: string;
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

// ==========================
// Helper: Day suffix
// ==========================
const getDayWithSuffix = (day: number) => {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};

// ==========================
// Main Component
// ==========================
export default function BarangayClearance() {
  const { props } = usePage<PageProps>();
  const [clearances, setClearances] = useState<DocumentRequest[]>(props.clearances || []);
  const [officials] = useState<Official[]>(props.officials || []);
  const [search, setSearch] = useState("");
  const [printDoc, setPrintDoc] = useState<DocumentRequest | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const today = new Date();
  const formattedDate = `${getDayWithSuffix(today.getDate())} of ${today.toLocaleDateString("en-US", { month: "long" })}, ${today.getFullYear()}`;

  const punongBarangay = officials.find(o => o.position === "Punong Barangay");
  const kagawads = officials.filter(o => o.position === "Barangay Kagawad");
  const skChairman = officials.find(o => o.position === "SK Chairman");
  const secretary = officials.find(o => ["Secretary", "Barangay Secretary"].includes(o.position));
  const treasurer = officials.find(o => ["Treasurer", "Barangay Treasurer"].includes(o.position));

  // ==========================
  // Handle QR Scan Success
  // ==========================
  const handleQrScanSuccess = async (token: string) => {
    try {
      await axios.post(`/documentrequests/release/${token}`);
      setClearances(prev =>
        prev.map(doc => (doc.qr_token === token ? { ...doc, status: "released" } : doc))
      );
      toast.success("Document status updated to Released!");
    } catch {
      toast.error("Failed to release document. Invalid QR code?");
    }
  };

  // ==========================
  // Handle Print / Reprint
  // ==========================
  const handlePrint = async (doc: DocumentRequest, reprint = false) => {
    setPrintDoc(doc);

    setTimeout(async () => {
      if (isPrinting) return;
      setIsPrinting(true);

      try {
        if (!reprint && doc.status === "on process") {
          const res = await axios.put(`/documentrequests/${doc.id}/ready`);
          setClearances(prev =>
            prev.map(r => (r.id === doc.id ? { ...r, status: "ready for pick-up" } : r))
          );
          toast.success(res.data.message || "Document marked Ready for Pick-up!");
        } else if (reprint) {
          toast.success("Reprinting document...");
        }
      } catch {
        toast.error("Failed to update document status.");
      } finally {
        setIsPrinting(false);
      }

      window.print();
      setPrintDoc(null);
    }, 200);
  };

  // ==========================
  // Filter Clearances
  // ==========================
  const filteredClearances = clearances.filter(req =>
    `${req.resident.first_name} ${req.resident.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const getQrUrl = (token?: string) =>
    token ? `${window.location.origin}/documentrequests/release/${token}` : "";

  // ==========================
  // Render
  // ==========================
  return (
    <AppLayout breadcrumbs={[{ title: "Barangay Clearance", href: "/barangay-clearance" }]}>
      <Head title="Barangay Clearance" />
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow p-6">
        <h1 className="text-2xl font-bold">Barangay Clearance Requests</h1>
        <Button
          onClick={() => setShowScanner(true)}
          className="bg-white text-green-700 hover:bg-green-100"
        >
          Scan QR Code
        </Button>
      </div>

      {/* Search & Table */}
      <div className="p-6 space-y-6">
        <Input
          placeholder="Search by resident name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm mb-4"
        />

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
              {filteredClearances.length ? (
                filteredClearances.map(req => (
                  <TableRow key={req.id}>
                    <TableCell>{req.resident.first_name} {req.resident.last_name}</TableCell>
                    <TableCell>{req.purpose}</TableCell>
                    <TableCell className="capitalize">{req.status}</TableCell>
                    <TableCell>
                      {req.status === "on process" && (
                        <Button
                          size="sm"
                          onClick={() => handlePrint(req)}
                          disabled={isPrinting}
                        >
                          {isPrinting && printDoc?.id === req.id ? "Printing..." : "Print"}
                        </Button>
                      )}

                      {(req.status === "ready for pick-up" || req.status === "released") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrint(req, true)}
                          disabled={isPrinting}
                        >
                          {isPrinting && printDoc?.id === req.id ? "Reprinting..." : "Reprint"}
                        </Button>
                      )}

                      {req.status === "pending" && (
                        <span className="text-gray-500 font-semibold">Pending</span>
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

      {/* QR Scanner Modal */}
      <QRScannerModal
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleQrScanSuccess}
      />

      {/* Print Layout */}
      {printDoc && (
        <div
          id="print-area"
          className="hidden print:block relative bg-white text-black leading-relaxed"
          style={{
            width: "185mm",
            height: "270mm",
            padding: "10mm",
            border: "10px solid #1B5E20",
            fontFamily: "'Times New Roman', serif"
          }}
        >
          {/* Header & Logos */}
          <div className="text-center">
            <div className="flex justify-between items-center">
              <img src="/images/logo.png" alt="Left Logo" className="w-20 h-20" />
              <div>
                <p>Republic of the Philippines</p>
                <p>Province of Misamis Oriental</p>
                <p>City of Cagayan de Oro</p>
                <p className="font-bold uppercase text-green-800">Barangay Iponan</p>
              </div>
              <img src="/images/cdologo.png" alt="Right Logo" className="w-20 h-20" />
            </div>
            <h2 className="mt-4 font-bold text-lg uppercase text-green-700">
              Office of the Punong Barangay
            </h2>
            <hr className="border-green-700 my-2" />
            <h1 className="text-3xl font-bold underline uppercase text-green-900">
              Barangay Clearance
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10">
            {/* Officials Sidebar */}
            <div className="col-span-1 text-sm p-4 border border-green-700 rounded-lg bg-green-100 shadow">
              <h2 className="font-bold text-green-800 text-center mb-4 text-base">
                Barangay Officials
              </h2>
              {punongBarangay && (
                <p className="font-bold">
                  {punongBarangay.complete_name}<br />Punong Barangay
                </p>
              )}
              {kagawads.length > 0 && <p className="underline">Barangay Kagawad</p>}
              <ul className="ml-2 mb-3 list-disc list-inside">
                {kagawads.map(k => <li key={k.id}>{k.complete_name}</li>)}
              </ul>
              {skChairman && (
                <p className="mt-2 font-bold">{skChairman.complete_name}<br />SK Chairman</p>
              )}
              {secretary && (
                <p className="mt-3 font-bold">{secretary.complete_name}<br />Secretary</p>
              )}
              {treasurer && (
                <p className="mt-3 font-bold">{treasurer.complete_name}<br />Treasurer</p>
              )}
            </div>

            {/* Certificate */}
            <div className="col-span-2 text-justify text-[15px] relative pl-6">
              <div className="absolute inset-y-0 right-0 opacity-10 flex items-center pr-10">
                <img src="/images/logo.png" alt="Watermark" className="w-80 h-80" />
              </div>

              <div className="relative z-10">
                <p>
                  This is to certify that <span className="font-bold underline">{printDoc.resident.first_name} {printDoc.resident.last_name}</span> residing at Barangay Iponan, Cagayan de Oro City, is a bona fide resident of this barangay.
                </p>
                <p className="mt-4">
                  This certification is issued upon request for the purpose of <span className="font-bold underline">{printDoc.purpose}</span>.
                </p>
                <p className="mt-4">
                  Given this <span className="underline">{formattedDate}</span> at Barangay Iponan, Cagayan de Oro City, Misamis Oriental.
                </p>
                {punongBarangay && (
                  <div className="mt-16 text-right pr-16">
                    <p className="font-bold uppercase text-green-900">{punongBarangay.complete_name}</p>
                    <p>Punong Barangay</p>
                  </div>
                )}
                <div className="flex justify-center mt-8">
                  <QRCodeCanvas value={getQrUrl(printDoc.qr_token)} size={120} />
                </div>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Scan QR code to verify release status
                </p>
              </div>
            </div>
          </div>

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
