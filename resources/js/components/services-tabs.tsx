import { useState } from 'react'
import { router } from '@inertiajs/react'
import { cn } from '@/lib/utils'
import { FileText, Plus, Edit3 } from 'lucide-react'

interface DocumentType {
  id: number
  name: string
  amount: string
}

interface Props {
  documentTypes: DocumentType[]
}

type TabView = 'list' | 'add' | 'edit'

export default function ServicesTabs({ documentTypes }: Props) {
  const [types, setTypes] = useState<DocumentType[]>(documentTypes)
  const [activeTab, setActiveTab] = useState<TabView>('list')
  const [form, setForm] = useState({ name: '', amount: '', id: 0 })

  // Handle Add or Update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === 'add') {
      router.post('/services', form, {
        onSuccess: (page) => {
          const props = page.props as unknown as { documentTypes: DocumentType[] }
          setTypes(props.documentTypes)
          setForm({ name: '', amount: '', id: 0 })
          setActiveTab('list')
        },
      })
    } else if (activeTab === 'edit' && form.id) {
      router.put(`/services/${form.id}`, form, {
        onSuccess: (page) => {
          const props = page.props as unknown as { documentTypes: DocumentType[] }
          setTypes(props.documentTypes)
          setForm({ name: '', amount: '', id: 0 })
          setActiveTab('list')
        },
      })
    }
  }

  // Open Edit tab with selected type
  const handleEdit = (type: DocumentType) => {
    setForm({ name: type.name, amount: type.amount, id: type.id })
    setActiveTab('edit')
  }

  // Delete a type
  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this document type?')) return

    router.delete(`/services/${id}`, {
      onSuccess: (page) => {
        const props = page.props as unknown as { documentTypes: DocumentType[] }
        setTypes(props.documentTypes)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
        <button
          onClick={() => setActiveTab('list')}
          className={cn(
            'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
            activeTab === 'list'
              ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
              : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60'
          )}
        >
          <FileText className="-ml-1 h-4 w-4" />
          <span className="ml-1.5 text-sm">Document Types</span>
        </button>

        <button
          onClick={() => setActiveTab('add')}
          className={cn(
            'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
            activeTab === 'add'
              ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
              : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60'
          )}
        >
          <Plus className="-ml-1 h-4 w-4" />
          <span className="ml-1.5 text-sm">Add New</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' && (
        <div className="rounded-lg border p-4 dark:border-neutral-700">
          <h3 className="text-lg font-medium mb-4">Available Document Types</h3>

          {types.length === 0 ? (
            <p className="text-sm text-neutral-500">No document types yet.</p>
          ) : (
            <ul className="space-y-2">
              {types.map((type) => (
                <li
                  key={type.id}
                  className="flex justify-between items-center border-b pb-2 dark:border-neutral-700"
                >
                  <span>
                    {type.name} — <span className="font-semibold">₱{type.amount}</span>
                  </span>
                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => handleEdit(type)}
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {(activeTab === 'add' || activeTab === 'edit') && (
        <div className="rounded-lg border p-4 dark:border-neutral-700">
          <h3 className="text-lg font-medium mb-4">
            {activeTab === 'add' ? 'Add New Document Type' : 'Edit Document Type'}
          </h3>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Document name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded px-2 py-1 flex-1 dark:bg-neutral-800 dark:border-neutral-600"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="border rounded px-2 py-1 w-32 dark:bg-neutral-800 dark:border-neutral-600"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              {activeTab === 'add' ? 'Save' : 'Update'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
