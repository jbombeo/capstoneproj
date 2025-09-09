import { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
  {
    
    title: 'Barangay Certificate',
    href: dashboard().url,
  },
];

export default function BrgyCertificates() {
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const data = [
    { id: 1, fullName: 'Juan Dela Cruz', gender: 'Male', zone: 'Zone 1', birthday: '1990-01-15', dateReleased: '2025-09-01' },
    { id: 2, fullName: 'Maria Santos', gender: 'Female', zone: 'Zone 3', birthday: '1985-06-20', dateReleased: '2025-09-02' },
  ];

  const filteredData = data.filter(item =>
    item.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (person: any) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPerson(null);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    if (!certificateRef.current) return;
    const printContents = certificateRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    // Add a logo at the top when printing
    const logoUrl = '/images/logo.png';
    document.body.innerHTML = `
      <div style="text-align:center; margin-bottom:20px;">
        <img src="${logoUrl}" style="width:80px; height:80px; margin-bottom:10px;" />
        ${printContents}
      </div>
    `;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to restore React state
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Barangay Certificate" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6 border-0 border-blue-700">
        <h1 className="text-3xl font-bold">Barangay Certificate</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-6 border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-md bg-white">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader className="bg-gray-50 sticky top-0 z-10 border-b border-gray-300">
              <TableRow>
                <TableHead className="text-gray-700 border-r border-gray-300">Full Name</TableHead>
                <TableHead className="text-gray-700 border-r border-gray-300">Gender</TableHead>
                <TableHead className="text-gray-700 border-r border-gray-300">Zone</TableHead>
                <TableHead className="text-gray-700 border-r border-gray-300">Birthday</TableHead>
                <TableHead className="text-gray-700 border-r border-gray-300">Date Released</TableHead>
                <TableHead className="text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((person, index) => (
                  <TableRow
                    key={person.id}
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:shadow-sm transition-shadow border-b border-gray-200`}
                  >
                    <TableCell className="py-2 border-r border-gray-200">{person.fullName}</TableCell>
                    <TableCell className="py-2 border-r border-gray-200">{person.gender}</TableCell>
                    <TableCell className="py-2 border-r border-gray-200">{person.zone}</TableCell>
                    <TableCell className="py-2 border-r border-gray-200">{person.birthday}</TableCell>
                    <TableCell className="py-2 border-r border-gray-200">{person.dateReleased}</TableCell>
                    <TableCell className="py-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                        onClick={() => openModal(person)}
                      >
                        View Document
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Certificate Modal */}
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
          <DialogContent className="max-w-lg w-full p-6 border-2 border-gray-300 rounded-lg shadow-lg bg-white">
            <div ref={certificateRef}>
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold uppercase">
                  Barangay Certificate of Indigency
                </DialogTitle>
              </DialogHeader>

              {selectedPerson && (
                <div className="mt-6 space-y-4 text-gray-700">
                  <p className="text-center italic">
                    This is to certify that the following information is true and correct:
                  </p>
                  <div className="space-y-2">
                    <p><strong>Full Name:</strong> {selectedPerson.fullName}</p>
                    <p><strong>Gender:</strong> {selectedPerson.gender}</p>
                    <p><strong>Zone:</strong> {selectedPerson.zone}</p>
                    <p><strong>Birthday:</strong> {selectedPerson.birthday}</p>
                    <p><strong>Date Released:</strong> {selectedPerson.dateReleased}</p>
                  </div>
                  <p className="text-center mt-6">
                    Issued this <strong>{selectedPerson.dateReleased}</strong> at Barangay Hall.
                  </p>
                  <div className="mt-10 flex justify-between items-center">
                    <div className="text-center">
                      <p>_____________________</p>
                      <p className="text-sm font-semibold">Barangay Captain</p>
                    </div>
                    <div className="text-center">
                      <p>_____________________</p>
                      <p className="text-sm font-semibold">Secretary</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6 flex justify-center gap-4">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
              >
                Print Certificate
              </Button>
              <Button onClick={closeModal} className="border-gray-400 text-gray-700 hover:bg-gray-400 hover:text-white transition-colors">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
