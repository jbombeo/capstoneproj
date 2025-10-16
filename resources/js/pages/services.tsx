import { useState } from "react"
import { router, usePage } from "@inertiajs/react"
import { PageProps as InertiaPageProps } from "@inertiajs/core"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

interface DocumentType {
  id: number
  name: string
  amount: string
}

interface ServicesPageProps extends InertiaPageProps {
  documentTypes: DocumentType[]
}

export default function ServicesPage() {
  const { documentTypes: initialTypes } = usePage<ServicesPageProps>().props
  const [types, setTypes] = useState<DocumentType[]>(initialTypes)
  const [search, setSearch] = useState("")
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingType, setEditingType] = useState<DocumentType | null>(null)

  const [formData, setFormData] = useState({ name: "", amount: "" })

  const filteredTypes = types.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  const resetForm = () => setFormData({ name: "", amount: "" })

  const handleAdd = () => {
    router.post("/document-types", formData, {
      onSuccess: (page: any) => {
        const props = page.props as { documentTypes: DocumentType[] }
        setTypes(props.documentTypes)
        resetForm()
        setOpenAdd(false)
        toast.success("Document type added successfully!")
      },
      onError: (errors: any) => {
        const msg = Object.values(errors).flat().join(" ")
        toast.error(`Failed: ${msg}`)
      },
    })
  }

  const handleEditOpen = (type: DocumentType) => {
    setEditingType(type)
    setFormData({ name: type.name, amount: type.amount })
    setOpenEdit(true)
  }

  const handleUpdate = () => {
    if (!editingType) return

    router.put(`/document-types/${editingType.id}`, formData, {
      onSuccess: (page: any) => {
        const props = page.props as { documentTypes: DocumentType[] }
        setTypes(props.documentTypes)
        resetForm()
        setEditingType(null)
        setOpenEdit(false)
        toast.success("Document type updated successfully!")
      },
      onError: (errors: any) => {
        const msg = Object.values(errors).flat().join(" ")
        toast.error(`Failed: ${msg}`)
      },
    })
  }

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this document type?")) return

    router.delete(`/document-types/${id}`, {
      onSuccess: (page: any) => {
        const props = page.props as { documentTypes: DocumentType[] }
        setTypes(props.documentTypes)
        toast.success("Document type deleted successfully!")
      },
      onError: (errors: any) => {
        const msg = Object.values(errors).flat().join(" ")
        toast.error(`Failed: ${msg}`)
      },
    })
  }

  return (
    <AppLayout breadcrumbs={[{ title: "Services", href: "#" }]}>
      <div className="flex justify-between items-center mb-8 bg-green-600 text-white shadow-lg p-6">
        <h1 className="text-3xl font-bold">Document Types</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Search & Add */}
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search document types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                + Add Document Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Document Type</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleAdd}
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card className="shadow-md rounded-2xl overflow-x-auto">
          <CardContent className="p-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTypes.length > 0 ? (
                  filteredTypes.map((type) => (
                    <tr key={type.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-2">{type.name}</td>
                      <td className="px-4 py-2">₱{type.amount}</td>
                      <td className="px-4 py-2 space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditOpen(type)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(type.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No document types found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleUpdate}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
