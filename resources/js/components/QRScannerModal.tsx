import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Html5QrcodeScanner } from "html5-qrcode";
import toast from "react-hot-toast";

interface QRScannerModalProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (token: string) => void;
}

export default function QRScannerModal({ open, onClose, onScanSuccess }: QRScannerModalProps) {
  useEffect(() => {
    if (!open) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (decodedText: string) => {
        try {
          const url = new URL(decodedText);
          const token = url.pathname.split("/").pop();
          if (token) {
            toast.success("QR Code detected!");
            onScanSuccess(token);
            onClose();
          }
        } catch {
          toast.error("Invalid QR code");
        }
      },
      (errorMessage: string) => {
        if (errorMessage !== "No MultiFormat Readers were able to detect the code.") {
          console.error("QR Scan error:", errorMessage);
        }
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [open, onClose, onScanSuccess]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Scan the QR code on the document to release it. If no camera feed appears, check camera permissions, ensure HTTPS/localhost, or try a different browser.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center">
          <div id="reader" className="w-full h-96 border rounded-lg overflow-hidden" />

          <Button onClick={onClose} className="mt-4 bg-green-600 text-white">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}