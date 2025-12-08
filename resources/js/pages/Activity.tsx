import React, { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import { Trash, Edit } from "lucide-react";
import InputError from "@/components/input-error";

// Types
interface ActivityPhoto {
  id: number;
  filename: string;
  url: string; // full URL from backend
}

interface Activity {
  id: number;
  dateofactivity: string;
  activity: string;
  description: string;
  activity_photos: ActivityPhoto[];
}

interface Props {
  activities: Activity[];
}

interface ActivityFormData {
  dateofactivity: string;
  activity: string;
  description: string;
  photos: File[];
}

export default function ActivityPage({ activities }: Props) {
  const { errors }: any = usePage().props;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [formData, setFormData] = useState<ActivityFormData>({
    dateofactivity: "",
    activity: "",
    description: "",
    photos: [],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Reset form data
  const resetForm = () => {
    setFormData({ dateofactivity: "", activity: "", description: "", photos: [] });
    setPreviewUrls([]);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, photos: files }));
    setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
  };

  // Add new activity
  const handleAddActivity = () => {
    const fd = new FormData();
    fd.append("dateofactivity", formData.dateofactivity);
    fd.append("activity", formData.activity);
    fd.append("description", formData.description);
    formData.photos.forEach((f, i) => fd.append(`photos[${i}]`, f));

    router.post("/activities", fd, {
      forceFormData: true,
      onSuccess: () => {
        resetForm();
        setOpenAdd(false);
        toast.success("Activity added successfully!");
      },
      onError: () => toast.error("Failed to add activity"),
    });
  };

  // Open edit dialog
  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      dateofactivity: activity.dateofactivity,
      activity: activity.activity,
      description: activity.description,
      photos: [],
    });
    setPreviewUrls([]);
    setOpenEdit(true);
  };

  // Update activity
  const handleUpdateActivity = () => {
    if (!editingActivity) return;

    const fd = new FormData();
    fd.append("dateofactivity", formData.dateofactivity);
    fd.append("activity", formData.activity);
    fd.append("description", formData.description);
    fd.append("_method", "PUT");
    formData.photos.forEach((f, i) => fd.append(`photos[${i}]`, f));

    router.post(`/activities/${editingActivity.id}`, fd, {
      forceFormData: true,
      onSuccess: () => {
        resetForm();
        setEditingActivity(null);
        setOpenEdit(false);
        toast.success("Activity updated successfully!");
      },
      onError: () => toast.error("Failed to update activity"),
    });
  };

  // Delete activity
  const handleDeleteActivity = (id: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    router.delete(`/activities/${id}`, {
      onSuccess: () => toast.success("Activity deleted successfully!"),
    });
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Activities", href: "#" }]}>
      <Head title="Activities" />
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center items-center mb-10 bg-gradient-to-r from-blue-600 to-blue-300 text-white p-8  shadow-xl">
        <h1 className="text-3xl font-bold">Activities</h1>

        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">+ Add Activity</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Activity</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new activity.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <FormFields
                formData={formData}
                setFormData={setFormData}
                previewUrls={previewUrls}
                handleFileChange={handleFileChange}
                errors={errors}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenAdd(false)}>Cancel</Button>
                <Button onClick={handleAddActivity}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Activity List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.length > 0 ? (
          activities.map((act) => (
            <Card key={act.id} className="shadow rounded-xl">
              <CardContent className="p-4 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold">{act.activity}</h2>
                  <p className="text-sm text-gray-600">{act.dateofactivity}</p>
                  {/* ✅ Display description with preserved line breaks */}
                  <p className="whitespace-pre-line text-gray-700">{act.description}</p>
                </div>

                {/* Photos */}
                <div className="flex gap-2 flex-wrap">
                  {act.activity_photos.length > 0 ? (
                    act.activity_photos.map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.url}
                        alt="Activity"
                        className="w-24 h-24 object-cover rounded"
                        crossOrigin="use-credentials"
                      />
                    ))
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditActivity(act)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteActivity(act.id)}>
                    <Trash className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No activities found</p>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>Update the details of your activity below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FormFields
              formData={formData}
              setFormData={setFormData}
              previewUrls={previewUrls}
              handleFileChange={handleFileChange}
              errors={errors}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
              <Button onClick={handleUpdateActivity}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

// Reusable form fields
function FormFields({
  formData,
  setFormData,
  previewUrls,
  handleFileChange,
  errors,
}: {
  formData: ActivityFormData;
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>;
  previewUrls: string[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: any;
}) {
  return (
    <>
      <div>
        <Label>Date of Activity</Label>
        <Input
          type="date"
          value={formData.dateofactivity}
          onChange={(e) => setFormData((p) => ({ ...p, dateofactivity: e.target.value }))}
        />
        <InputError message={errors.dateofactivity} />
      </div>

      <div>
        <Label>Activity</Label>
        <Input
          value={formData.activity}
          onChange={(e) => setFormData((p) => ({ ...p, activity: e.target.value }))}
        />
        <InputError message={errors.activity} />
      </div>

      <div>
        <Label>Description</Label>
        <textarea
          className="w-full border rounded p-2 focus:ring"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
        />
        <InputError message={errors.description} />
      </div>

      <div>
        <Label>Upload Photos</Label>
        <Input type="file" multiple onChange={handleFileChange} />
        <InputError message={errors.photos} />

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {previewUrls.map((url, idx) => (
              <img key={idx} src={url} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
