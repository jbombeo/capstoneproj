import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function QrReleaseSuccess() {
  const { props } = usePage<{ document: any }>();
  const { document } = props;

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Head title="Document Released" />
      <Card className="max-w-md text-center p-6 shadow-lg">
        <CardContent>
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-800">Document Released!</h1>
          <p className="mt-2 text-gray-700">
            The document for{" "}
            <strong>
              {document.resident?.first_name} {document.resident?.last_name}
            </strong>{" "}
            has been marked as <span className="font-semibold">released</span>.
          </p>

          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/barangay-clearances")}
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
