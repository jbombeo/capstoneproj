import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";

// 👇 Dynamic import to avoid TypeScript errors
const QrScanner = require("react-qr-scanner").default;

export default function ScanQRCode() {
  const [scanned, setScanned] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleScan = async (result: any) => {
    if (result && isScanning) {
      const qrToken = result.text || result;

      setScanned(qrToken);
      setIsScanning(false);
      setLoading(true);

      try {
        const res = await axios.post(`/documentrequests/release/${qrToken}`);
        toast.success(res.data.message || "Document successfully released!");
      } catch (err: any) {
        console.error("QR Scan Error:", err);
        toast.error(
          err.response?.data?.message || "Failed to release document."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scanner Error:", err);
    toast.error("Camera access failed. Please allow permissions.");
  };

  const handleRescan = () => {
    setScanned(null);
    setIsScanning(true);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Scan QR Code", href: "/scan-qr" }]}>
      <Toaster position="top-right" />
      <div className="flex flex-col items-center mt-10 space-y-6">
        <h2 className="text-2xl font-bold text-green-700">
          Scan QR Code to Release Document
        </h2>

        {/* Camera Scanner */}
        <div className="border-4 border-green-600 rounded-xl overflow-hidden w-[320px] h-[240px]">
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Status Display */}
        {loading ? (
          <p className="text-gray-600 mt-2">Processing...</p>
        ) : scanned ? (
          <div className="text-center">
            <p className="text-gray-700">
              <strong>QR Token:</strong> {scanned}
            </p>
            <Button className="mt-3 bg-green-700" onClick={handleRescan}>
              Scan Another
            </Button>
          </div>
        ) : (
          <p className="text-gray-500 mt-2">Align the QR code inside the box</p>
        )}
      </div>
    </AppLayout>
  );
}
