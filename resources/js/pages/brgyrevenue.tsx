import { Head } from '@inertiajs/react';
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Barangay Revenues',
    href: dashboard().url,
  },
];

export default function BrgyRevenues() {
  const [revenues] = useState([
    {
      id: 1,
      date: '2025-09-01',
      recipient: 'Juan Dela Cruz',
      details: 'Certificate of Indigency',
      amount: 50,
      user: 'Admin',
    },
    {
      id: 2,
      date: '2025-08-28',
      recipient: 'Maria Santos',
      details: 'Barangay Clearance',
      amount: 100,
      user: 'Staff 1',
    },
  ]);

  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const filteredRevenues = revenues.filter((rev) => {
    const revDate = new Date(rev.date);
    const min = minDate ? new Date(minDate) : null;
    const max = maxDate ? new Date(maxDate) : null;

    if (min && revDate < min) return false;
    if (max && revDate > max) return false;
    return true;
  });

  const totalAmount = filteredRevenues.reduce((sum, rev) => sum + rev.amount, 0);

  const handlePrint = () => {
    if (!printRef.current) return;

    const logoUrl = '/images/logo.png'; // Replace with your logo path
    const dateRangeText = minDate || maxDate
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
              .total-row { font-weight: bold; }
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Barangay Revenues" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6 border-0 border-blue-700">
        <h1 className="text-3xl font-bold">Barangay Revenues</h1>
      </div>

      {/* Date Filters with Print Button */}
      <div className="flex flex-col md:flex-row items-end gap-4 mb-6 border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="flex flex-col md:flex-row items-end gap-4 flex-1">
          <div className="flex flex-col">
            <Label htmlFor="minDate" className="mb-1 text-gray-700 font-medium">Minimum Date</Label>
            <Input
              type="date"
              id="minDate"
              value={minDate}
              onChange={(e) => setMinDate(e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="maxDate" className="mb-1 text-gray-700 font-medium">Maximum Date</Label>
            <Input
              type="date"
              id="maxDate"
              value={maxDate}
              onChange={(e) => setMaxDate(e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <Button
            variant="outline"
            className="h-10 mt-2 md:mt-0"
            onClick={() => { setMinDate(''); setMaxDate(''); }}
          >
            Reset
          </Button>
        </div>

        {/* Print Button on Right */}
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

      {/* Table (Printable Section) */}
      <div ref={printRef} className="overflow-x-auto rounded-lg border border-gray-300 shadow-md p-4 bg-white">
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
            {filteredRevenues.length > 0 ? (
              <>
                {filteredRevenues.map((rev, index) => (
                  <TableRow
                    key={rev.id}
                    className={`transition-shadow hover:shadow-md border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <TableCell className="py-2 border-r border-gray-200">{rev.date}</TableCell>
                    <TableCell className="py-2 border-r border-gray-200">{rev.recipient}</TableCell>
                    <TableCell className="py-2 border-r border-gray-200">{rev.details}</TableCell>
                    <TableCell className="py-2 font-medium border-r border-gray-200">₱ {rev.amount}</TableCell>
                    <TableCell className="py-2">{rev.user}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-200 font-semibold border-t border-gray-300">
                  <TableCell colSpan={3} className="border-r border-gray-300"></TableCell>
                  <TableCell className="border-r border-gray-300">₱ {totalAmount}</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500 border-t border-gray-300">
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
