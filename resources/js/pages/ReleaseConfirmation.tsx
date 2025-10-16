import { usePage } from "@inertiajs/react";

export default function ReleaseConfirmation() {
  const { doc, message } = usePage().props as any;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">{message}</h1>
        <p className="text-lg">
          <strong>{doc.document_type.name}</strong> for{" "}
          <strong>{doc.resident.first_name} {doc.resident.last_name}</strong> is now{" "}
          <span className="text-green-700 font-semibold">Released</span>.
        </p>
      </div>
    </div>
  );
}
