import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Residents Record',
    href: dashboard().url,
  },
];

export default function Resident() {
  const [search, setSearch] = useState('');
  const [residents, setResidents] = useState([
    { id: 1, fullname: 'Juan Dela Cruz', age: 30, civil_status: 'Single', gender: 'Male' },
    { id: 2, fullname: 'Maria Santos', age: 45, civil_status: 'Married', gender: 'Female' },
    { id: 3, fullname: 'Pedro Reyes', age: 28, civil_status: 'Single', gender: 'Male' },
  ]);

  const [formData, setFormData] = useState({
    fullname: '',
    age: '',
    birthday: '',
    civilStatus: '',
    gender: '',
  });

  const filteredResidents = residents.filter((r) =>
    r.fullname.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddResident = () => {
    const newResident = {
      id: residents.length + 1,
      fullname: formData.fullname,
      age: Number(formData.age),
      birthday: formData.birthday,
      civil_status: formData.civilStatus,
      gender: formData.gender,
    };
    setResidents([...residents, newResident]);
    setFormData({ fullname: '', age: '', birthday: '', civilStatus: '', gender: '' });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Residents Record" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white  shadow-lg p-6 border-0 border-blue-700">
        <h1 className="text-3xl font-bold">Residents Record</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search and Add */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                + Add Resident
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Resident</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Birthday</Label>
                  <Input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Civil Status</Label>
                  <Input
                    value={formData.civilStatus}
                    onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Input
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                  onClick={handleAddResident}
                >
                  Add Resident
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Residents Table */}
        <Card className="shadow-md rounded-2xl overflow-x-auto">
          <CardContent className="p-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Full Name</th>
                  <th className="px-4 py-2">Age</th>
                  <th className="px-4 py-2">Civil Status</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredResidents.length > 0 ? (
                  filteredResidents.map((resident) => (
                    <tr key={resident.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-2">{resident.fullname}</td>
                      <td className="px-4 py-2">{resident.age}</td>
                      <td className="px-4 py-2">{resident.civil_status}</td>
                      <td className="px-4 py-2">{resident.gender}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No residents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
