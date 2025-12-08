import { Head, usePage, router } from '@inertiajs/react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';

// ================================
// TYPES
// ================================
interface Revenue {
  id: number;
  date: string;
  recipient: string;
  details: string;
  amount: number | string | null;
  payment_method: string;
}

interface PageProps extends InertiaPageProps {
  revenues: Revenue[];
  minDate?: string;
  maxDate?: string;
  sort?: string;
  direction?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Revenues Report", href: dashboard().url },
];

// ================================
// COMPONENT
// ================================
export default function ReportRevenues() {
  const {
    revenues,
    minDate: initialMin,
    maxDate: initialMax,
    sort,
    direction,
  } = usePage<PageProps>().props;

  const [minDate, setMinDate] = useState(initialMin || "");
  const [maxDate, setMaxDate] = useState(initialMax || "");
  const [sortField, setSortField] = useState(sort || "date");
  const [sortDirection, setSortDirection] = useState(direction || "asc");

  const printRef = useRef<HTMLDivElement>(null);

  const baseUrl = "/report/revenues"; // <── NO ZIGGY NEEDED

  // ================================
  // SORT HANDLER
  // ================================
  const handleSort = (field: string) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortDirection(newDirection);

    router.get(
      baseUrl,
      {
        min_date: minDate,
        max_date: maxDate,
        sort: field,
        direction: newDirection,
      },
      {
        preserveScroll: true,
        preserveState: false,
      }
    );
  };

  // ================================
  // FILTER HANDLER
  // ================================
  const handleFilter = () => {
    router.get(
      baseUrl,
      {
        min_date: minDate,
        max_date: maxDate,
        sort: sortField,
        direction: sortDirection,
      },
      {
        preserveScroll: true,
        preserveState: false,
      }
    );
  };

  // ================================
  // RESET HANDLER
  // ================================
  const handleReset = () => {
    setMinDate("");
    setMaxDate("");

    router.get(baseUrl, {}, { preserveState: false });
  };

  // ================================
  // PRINT FUNCTION
  // ================================
  const handlePrint = () => {
    if (!printRef.current) return;

    const logoUrl = "/images/logo.png";
    const dateRangeText =
      minDate || maxDate
        ? `Date Range: ${minDate || "Any"} to ${maxDate || "Any"}`
        : "All Records";

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head>
          <title>Revenue Report</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  color: #000;
              }
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .header img {
                  width: 90px;
                  height: 90px;
                  margin-bottom: 10px;
              }
              h1 {
                  margin: 0;
                  font-size: 22px;
              }
              h2 {
                  margin-top: 5px;
                  font-size: 16px;
                  color: #444;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
              }
              th, td {
                  border: 1px solid #000;
                  padding: 8px;
                  font-size: 14px;
              }
              th {
                  background: #f0f0f0;
                  font-weight: bold;
              }
              .footer-section {
                  margin-top: 50px;
                  display: flex;
                  justify-content: space-between;
                  padding: 0 40px;
              }
              .signature-block {
                  text-align: center;
              }
              .certified {
                  margin-top: 40px;
                  text-align: left;
                  font-size: 14px;
                  font-weight: bold;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <img src="${logoUrl}" />
              <h1>Barangay Official Revenues Report</h1>
              <h2>${dateRangeText}</h2>
          </div>

          ${printRef.current.innerHTML}

          <p class="certified">CERTIFIED CORRECT:</p>

          <div class="footer-section">
              <div class="signature-block">
                  <p>______________________</p>
                  <p>Barangay Captain</p>
              </div>
              <div class="signature-block">
                  <p>______________________</p>
                  <p>Secretary</p>
              </div>
          </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const totalAmount = revenues.reduce(
    (sum, rev) => sum + Number(rev.amount || 0),
    0
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Revenues Report" />

      {/* HEADER */}
      <div className="mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl">
        <h1 className="text-3xl font-bold">Barangay Revenues Report</h1>
      </div>

      {/* FILTER FIELDS */}
      <div className="flex flex-col md:flex-row items-end gap-4 mb-6 border p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-4 flex-1">
          <div>
            <Label>Minimum Date</Label>
            <Input type="date" value={minDate} onChange={(e) => setMinDate(e.target.value)} />
          </div>

          <div>
            <Label>Maximum Date</Label>
            <Input type="date" value={maxDate} onChange={(e) => setMaxDate(e.target.value)} />
          </div>

          <Button variant="outline" onClick={handleFilter}>Filter</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>

        <Button
          onClick={handlePrint}
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        >
          Print Document
        </Button>
      </div>

      {/* TABLE */}
      <div
        ref={printRef}
        className="overflow-x-auto rounded-lg border p-4 bg-white shadow-md"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("date")}
              >
                Date {sortField === "date" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
              </TableHead>

              <TableHead>Recipient</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {revenues.length ? (
              <>
                {revenues.map((rev) => (
                  <TableRow key={rev.id}>
                    <TableCell>{rev.date}</TableCell>
                    <TableCell>{rev.recipient}</TableCell>
                    <TableCell>{rev.details}</TableCell>
                    <TableCell>₱ {Number(rev.amount).toFixed(2)}</TableCell>
                    <TableCell>{rev.payment_method}</TableCell>
                  </TableRow>
                ))}

                <TableRow className="bg-gray-200 font-semibold">
                  <TableCell colSpan={3}></TableCell>
                  <TableCell>₱ {Number(totalAmount).toFixed(2)}</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
