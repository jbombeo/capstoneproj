import React from "react";
import { Head, Link } from "@inertiajs/react";

interface Resident {
  first_name: string;
  last_name: string;
  address: string;
}

interface DocProps {
  id: number;
  document_type: string;
  purpose: string;
  status: string;
  resident: Resident;
}

interface Props {
  certificates?: DocProps[];
  doc?: DocProps;
  qrImage?: string;
  print?: boolean;
}

export default function CertificateOfIndigenous({ certificates = [], doc, qrImage, print }: Props) {
  if (print && doc) {
    return (
      <div className="w-full bg-white p-10 print:p-0">
        <Head title="Certificate of Indigenous" />
        <div className="text-center border-b pb-4">
          <img src="/images/barangay-logo.png" alt="Logo" className="mx-auto w-20 h-20" />
          <h1 className="text-xl font-bold uppercase">Republic of the Philippines</h1>
          <h2 className="text-lg font-semibold">Certificate of Indigenous People</h2>
          <p className="text-sm">Municipality of ______ Province of ______</p>
        </div>

        <div className="mt-8 text-justify leading-relaxed">
          <p>
            This is to certify that <b>{doc.resident.first_name} {doc.resident.last_name}</b> of
            <b> {doc.resident.address}</b> is a recognized indigenous person under our barangay jurisdiction
            for the purpose of <b>{doc.purpose}</b>.
          </p>
          <p className="mt-4">
            Issued this {new Date().toLocaleDateString()} at Barangay ________.
          </p>
        </div>

        <div className="mt-12 flex justify-between items-end">
          <div className="text-center">
            <p className="font-semibold">____________________</p>
            <p className="text-sm">Barangay Captain</p>
          </div>
          {qrImage && (
            <div className="text-center">
              <img src={qrImage} alt="QR Code" className="w-24 h-24 mx-auto" />
              <p className="text-xs">Scan to verify</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // default table view
  return (
    <div className="p-6">
      <Head title="Certificate of Indigenous Requests" />
      <h1 className="text-xl font-bold mb-4">Certificate of Indigenous Requests</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Resident</th>
            <th className="border p-2">Purpose</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.resident.first_name} {c.resident.last_name}</td>
              <td className="border p-2">{c.purpose}</td>
              <td className="border p-2">{c.status}</td>
              <td className="border p-2">
                {c.status === "ready for pick-up" ? (
                  <Link href={`/documentrequests/${c.id}/print`} className="text-blue-600 underline">Print</Link>
                ) : (
                  <Link href={`/documentrequests/${c.id}`} className="text-blue-600 underline">View</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
