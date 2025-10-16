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
  middle_name?: string;
  last_name: string;
  birthdate?: string;
  civil_status?: string;
  address?: string;
}

interface DocumentRequest {
  id: number;
  resident: Resident;
  document_type?: string;
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
  requests: DocumentRequest[];
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
export default function Residency() {
  const { props } = usePage<PageProps>();
  const [requests, setRequests] = useState<DocumentRequest[]>(props.requests || []);
  const [officials] = useState<Official[]>(props.officials || []);
  const [printDoc, setPrintDoc] = useState<DocumentRequest | null>(null);
  const [search, setSearch] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const today = new Date();
  const formattedDate = `${getDayWithSuffix(today.getDate())} of ${today.toLocaleDateString("en-US",{ month: "long" })}, ${today.getFullYear()}`;

  // Officials
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
      setRequests(prev =>
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
          setRequests(prev =>
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
  // Filter Requests
  // ==========================
  const filteredRequests = requests.filter(req =>
    `${req.resident.first_name} ${req.resident.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const getQrUrl = (token?: string) => token ? `${window.location.origin}/documentrequests/release/${token}` : "";

  // ==========================
  // Render
  // ==========================
  return (
    <AppLayout breadcrumbs={[{ title: "Certificate of Residency", href: "/Residency" }]}>
      <Head title="Certificate of Residency" />
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow p-6">
        <h1 className="text-2xl font-bold">Certificate of Residency Requests</h1>
        <Button
          onClick={() => setShowScanner(true)}
          className="bg-white text-blue-900 hover:bg-blue-100"
        >
          Scan QR Code
        </Button>
      </div>

      {/* SEARCH + TABLE */}
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
              {filteredRequests.length ? (
                filteredRequests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell>{req.resident.first_name} {req.resident.middle_name || ""} {req.resident.last_name}</TableCell>
                    <TableCell>{req.purpose}</TableCell>
                    <TableCell className="capitalize">{req.status}</TableCell>
                    <TableCell>
                      {req.status === "on process" && (
                        <Button size="sm" onClick={() => handlePrint(req)} disabled={isPrinting}>
                          {isPrinting && printDoc?.id === req.id ? "Printing..." : "Print"}
                        </Button>
                      )}
                      {(req.status === "ready for pick-up" || req.status === "released") && (
                        <Button size="sm" variant="outline" onClick={() => handlePrint(req, true)} disabled={isPrinting}>
                          {isPrinting && printDoc?.id === req.id ? "Reprinting..." : "Reprint"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No requests found.
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

      {/* PRINT LAYOUT */}
      {printDoc && (
        <div
          id="print-area"
          className="hidden print:block relative bg-white text-black font-serif"
          style={{ width: "185mm", height: "270mm", padding: "12mm", border: "10px solid #1E3A8A" }}
        >
          {/* HEADER */}
          <div className="text-center">
            <div className="flex justify-between items-center">
              <img src="/images/logo.png" alt="Logo Left" className="w-20 h-20" />
              <div>
                <p className="text-sm">Republic of the Philippines</p>
                <p className="text-sm">Region X-Northern Mindanao</p>
                <p className="text-sm">City of Cagayan de Oro</p>
                <p className="font-bold uppercase text-blue-800">Barangay Iponan</p>
              </div>
              <img src="/images/cdologo.png" alt="Logo Right" className="w-20 h-20" />
            </div>

            <h2 className="mt-4 font-bold text-lg uppercase text-blue-700">
              Office of the Barangay Council
            </h2>
            <hr className="border-blue-700 my-2" />
            <h1 className="text-3xl font-bold underline uppercase text-blue-900">
              Certificate of Residency
            </h1>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-3 gap-6 mt-10">
            {/* LEFT - OFFICIALS */}
            <div className="col-span-1 pr-4 text-sm">
              <div className="p-4 rounded-lg shadow-md border border-blue-700 bg-blue-50">
                <h2 className="font-bold text-blue-800 text-center mb-4 text-base">
                  Barangay Officials
                </h2>
                {punongBarangay && (
                  <>
                    <p className="font-bold text-[15px]">{punongBarangay.complete_name}</p>
                    <p className="mb-3">Punong Barangay</p>
                  </>
                )}
                {kagawads.length > 0 && (
                  <>
                    <p className="underline">Barangay Kagawad</p>
                    <ul className="ml-2 mb-3 list-disc list-inside">
                      {kagawads.map(k => (
                        <li key={k.id} className="text-[15px] font-medium">{k.complete_name}</li>
                      ))}
                    </ul>
                  </>
                )}
                {skChairman && <p className="mt-2"><span className="font-bold text-[15px]">{skChairman.complete_name}</span><br/>SK Chairman</p>}
                {secretary && <p className="mt-3"><span className="font-bold text-[15px]">{secretary.complete_name}</span><br/>Secretary</p>}
                {treasurer && <p className="mt-3"><span className="font-bold text-[15px]">{treasurer.complete_name}</span><br/>Treasurer</p>}
              </div>
            </div>

            {/* RIGHT - CERTIFICATE */}
            <div className="col-span-2 pl-6 text-justify text-[15px] relative">
              <div className="absolute inset-y-0 right-0 flex items-center opacity-10 pr-10">
                <img src="/images/logo.png" alt="Watermark" className="w-90 h-90" />
              </div>

              <div className="relative z-10">
                <p>
                  This is to certify that <strong>{printDoc.resident.first_name} {printDoc.resident.middle_name || ""} {printDoc.resident.last_name}</strong>, residing at <strong>{printDoc.resident.address || "Barangay Iponan"}</strong>, Cagayan de Oro City, is a bonafide resident of this barangay.
                </p>

                <p className="mt-4">
                  This certification is issued upon the request of the above-named person for <strong>{printDoc.purpose}</strong>.
                </p>

                <p className="mt-4">
                  Given this <strong className="underline">{formattedDate}</strong> at Barangay Iponan, Cagayan de Oro City.
                </p>

                {punongBarangay && (
                  <div className="mt-16 text-right pr-16">
                    <p className="font-bold uppercase text-blue-900">{punongBarangay.complete_name}</p>
                    <p>Punong Barangay</p>
                  </div>
                )}

                <div className="flex justify-center mt-8">
                  <QRCodeCanvas value={getQrUrl(printDoc.qr_token)} size={120} />
                </div>
                <p className="mt-2 text-center text-sm text-gray-600">Scan QR code to verify document validity</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
