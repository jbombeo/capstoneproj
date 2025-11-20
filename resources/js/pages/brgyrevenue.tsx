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
import {route} from 'ziggy-js';

// ----------------------
// Type Definitions
// ----------------------
interface Revenue {
  id: number;
  date: string;
  recipient: string;
  details: string;
  amount: number;
  user: string;
}

interface PageProps extends InertiaPageProps {
  revenues: Revenue[];
  minDate?: string;
  maxDate?: string;
}

// ----------------------
// Breadcrumb
// ----------------------
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Barangay Revenues',
    href: dashboard().url,
  },
];

// ----------------------
// Component
// ----------------------
export default function BrgyRevenues() {
  const { revenues, minDate: initialMin, maxDate: initialMax } =
    usePage<PageProps>().props;

  const [minDate, setMinDate] = useState(initialMin || '');
  const [maxDate, setMaxDate] = useState(initialMax || '');
  const printRef = useRef<HTMLDivElement>(null);

  // ----------------------
  // Handlers
  // ----------------------
  const handleFilter = () => {
    router.get(
      route('report.revenues'),
      { min_date: minDate, max_date: maxDate },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleReset = () => {
    setMinDate('');
    setMaxDate('');
    router.get(route('report.revenues'));
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    const logoUrl = '/images/logo.png';
    const dateRangeText =
      minDate || maxDate
        ? `Date Range: ${minDate || 'Any'} to ${maxDate || 'Any'}`
        : 'All Records';

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Barangay Revenues</title>
          <style>
            @media print {
              body { font-family: Arial, sans-serif; margin: 0; padding: 30px; }
              .header { text-align: center; margin-bottom: 20px; }
              .header img { width: 80px; height: 80px; margin-bottom: 10px; }
              h1 { font-size: 24px; margin-bottom: 5px; }
              h2 { font-size: 18px; margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #000; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; }
              th { background-color: #f3f3f3; }
              .footer { margin-top: 50px; display: flex; justify-content: space-between; }
              .signature { text-align: center; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUrl}" alt="Barangay Logo" />
            <h1>Barangay Official Revenues Report</h1>
            <h2>${dateRangeText}</h2>
          </div>
          ${printContents}
          <div class="footer">
            <div class="signature">
              <p>_____________________</p>
              <p>Barangay Captain</p>
            </div>
            <div class="signature">
              <p>_____________________</p>
              <p>Secretary</p>
            </div>
          </div>
        </body>
      </html>
    `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // ----------------------
  // Computed Values
  // ----------------------
  const totalAmount = revenues.reduce((sum, rev) => sum + rev.amount, 0);

  // ----------------------
  // Render
  // ----------------------
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Barangay Revenues" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6 border-0 border-blue-700">
        <h1 className="text-3xl font-bold">Barangay Revenues</h1>
      </div>

      {/* Date Filters */}
      <div className="flex flex-col md:flex-row items-end gap-4 mb-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="flex flex-col md:flex-row items-end gap-4 flex-1">
          <div className="flex flex-col">
            <Label htmlFor="minDate" className="mb-1 text-gray-700 font-medium">
              Minimum Date
            </Label>
            <Input
              type="date"
              id="minDate"
              value={minDate}
              onChange={(e) => setMinDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="maxDate" className="mb-1 text-gray-700 font-medium">
              Maximum Date
            </Label>
            <Input
              type="date"
              id="maxDate"
              value={maxDate}
              onChange={(e) => setMaxDate(e.target.value)}
            />
          </div>

          <Button variant="outline" onClick={handleFilter}>
            Filter
          </Button>

          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>

        <div className="mt-2 md:mt-0">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          >
            Print Document
          </Button>
        </div>
      </div>

      {/* Table */}
      <div
        ref={printRef}
        className="overflow-x-auto rounded-lg border border-gray-300 shadow-md p-4 bg-white"
      >
        <Table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <TableHeader className="bg-gray-50 sticky top-0 z-10 border-b border-gray-300">
            <TableRow>
              <TableHead className="text-gray-700 border-r border-gray-300">Date</TableHead>
              <TableHead className="text-gray-700 border-r border-gray-300">Recipient</TableHead>
              <TableHead className="text-gray-700 border-r border-gray-300">Details</TableHead>
              <TableHead className="text-gray-700 border-r border-gray-300">Amount</TableHead>
              <TableHead className="text-gray-700">User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {revenues.length > 0 ? (
              <>
                {revenues.map((rev, index) => (
                  <TableRow
                    key={rev.id}
                    className={`transition-shadow hover:shadow-md border-b border-gray-200 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <TableCell className="py-2 border-r border-gray-200">{rev.date}</TableCell>
                    <TableCell className="py-2 border-r border-gray-200">{rev.recipient}</TableCell>
                    <TableCell className="py-2 border-r border-gray-200">{rev.details}</TableCell>
                    <TableCell className="py-2 font-medium border-r border-gray-200">
                      ₱ {rev.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-2">{rev.user}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-200 font-semibold border-t border-gray-300">
                  <TableCell colSpan={3}></TableCell>
                  <TableCell>₱ {totalAmount.toFixed(2)}</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-4 text-gray-500 border-t border-gray-300"
                >
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
