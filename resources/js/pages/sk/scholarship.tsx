import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';
import { Pencil, Trash, Check, X, Plus } from 'lucide-react';

interface Scholarship {
  id: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  grant_amount?: number;
}

// Row Component
const ScholarshipRow = ({
  sch,
  editingId,
  editForm,
  startEdit,
  handleEditChange,
  cancelEdit,
  handleUpdate,
  handleDelete,
}: any) => {
  const isEditing = editingId === sch.id && editForm !== null;

  // Render normal row if not editing or editForm is null
  if (!isEditing) {
    return (
      <tr className="border-b hover:bg-gray-50">
        <td className="px-4 py-2">{sch.title ?? '-'}</td>
        <td className="px-4 py-2">{sch.start_date ?? '-'}</td>
        <td className="px-4 py-2">{sch.end_date ?? '-'}</td>
        <td className="px-4 py-2">{sch.grant_amount ?? '-'}</td>
        <td className="px-4 py-2 text-center flex justify-center gap-2">
          <button onClick={() => startEdit(sch)} className="text-blue-600">
            <Pencil size={16} />
          </button>
          <button onClick={() => handleDelete(sch.id)} className="text-red-600">
            <Trash size={16} />
          </button>
        </td>
      </tr>
    );
  }

  // Render editing row
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-2">
        <input
          name="title"
          value={editForm.title ?? ''}
          onChange={handleEditChange}
          className="border px-2 py-1 rounded w-full"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="date"
          name="start_date"
          value={editForm.start_date ?? ''}
          onChange={handleEditChange}
          className="border px-2 py-1 rounded w-full"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="date"
          name="end_date"
          value={editForm.end_date ?? ''}
          onChange={handleEditChange}
          className="border px-2 py-1 rounded w-full"
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          name="grant_amount"
          value={editForm.grant_amount ?? ''}
          onChange={handleEditChange}
          className="border px-2 py-1 rounded w-full"
        />
      </td>
      <td className="px-4 py-2 text-center flex justify-center gap-2">
        <button onClick={() => handleUpdate(sch.id)} className="text-green-600">
          <Check size={16} />
        </button>
        <button onClick={cancelEdit} className="text-gray-600">
          <X size={16} />
        </button>
      </td>
    </tr>
  );
};

// Main Page Component
export default function ScholarshipsPage() {
  const { scholarships = [], errors = {} } = usePage().props as any;

  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    grant_amount: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewForm({ ...newForm, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    Inertia.post('/scholarships', newForm, {
      onSuccess: () =>
        setNewForm({ title: '', description: '', start_date: '', end_date: '', grant_amount: '' }),
    });
  };

  // Safe startEdit: set editForm first, editingId next
  const startEdit = (sch: Scholarship) => {
    setEditForm({
      title: sch.title ?? '',
      description: sch.description ?? '',
      start_date: sch.start_date ?? '',
      end_date: sch.end_date ?? '',
      grant_amount: sch.grant_amount ?? '',
    });
    setEditingId(sch.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleUpdate = (id: number) => {
    if (!editForm) return;
    Inertia.put(`/scholarships/${id}`, editForm);
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this scholarship?')) {
      Inertia.delete(`/scholarships/${id}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Scholarships</h1>

      {/* Add Form */}
      <form onSubmit={handleCreate} className="mb-6 bg-white p-6 rounded shadow space-y-4">
        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Plus size={18} /> Add New Scholarship
        </h2>

        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={newForm.title ?? ''}
            onChange={handleNewChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && <p className="text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={newForm.description ?? ''}
            onChange={handleNewChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.description && <p className="text-red-600">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={newForm.start_date ?? ''}
              onChange={handleNewChange}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.start_date && <p className="text-red-600">{errors.start_date}</p>}
          </div>
          <div>
            <label className="block font-medium">End Date</label>
            <input
              type="date"
              name="end_date"
              value={newForm.end_date ?? ''}
              onChange={handleNewChange}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.end_date && <p className="text-red-600">{errors.end_date}</p>}
          </div>
          <div>
            <label className="block font-medium">Grant Amount</label>
            <input
              type="number"
              name="grant_amount"
              value={newForm.grant_amount ?? ''}
              onChange={handleNewChange}
              className="w-full border px-3 py-2 rounded"
            />
            {errors.grant_amount && <p className="text-red-600">{errors.grant_amount}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Scholarship
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
              <th className="px-4 py-2 text-left">Grant Amount</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.length > 0 ? (
              scholarships.map((sch: Scholarship) => (
                <ScholarshipRow
                  key={sch.id}
                  sch={sch}
                  editingId={editingId}
                  editForm={editForm}
                  startEdit={startEdit}
                  handleEditChange={handleEditChange}
                  cancelEdit={cancelEdit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No scholarships found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
