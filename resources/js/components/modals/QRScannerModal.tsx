import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrReader } from "react-qr-reader";
import toast from "react-hot-toast";

interface QRScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (token: string) => void;
}

export default function QRScannerModal({ open, onClose, onScanSuccess }: QRScannerModalProps) {
  if (!open) return null;

  const handleResult = (result: string | null) => {
    if (result) {
      try {
        const url = new URL(result);
        const token = url.pathname.split("/").pop();
        if (token) {
          toast.success("QR Code detected!");
          onScanSuccess(token);
          onClose();
        }
      } catch {
        toast.error("Invalid QR code.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>Scan the QR code on the document to release it.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center">
          <div className="w-full h-96 border rounded-lg overflow-hidden">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result, error) => {
                if (result) handleResult(result.getText ? result.getText() : result.toString());
              }}
              videoContainerStyle={{ width: "100%", height: "100%" }}
              videoStyle={{ width: "100%", height: "100%" }}
            />
          </div>
          <Button onClick={onClose} className="mt-4 bg-green-600 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
