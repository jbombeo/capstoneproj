// resources/js/Pages/SK/announcements.tsx
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import SKLayout from "./layout";
import { Megaphone, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { useMemo, useState } from "react";

type PaginationLink = { url: string | null; label: string; active: boolean };

interface Announcement {
  id: number;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image_path?: string | null; // <- backend field
  created_at?: string | null;
}

interface PageProps extends InertiaPageProps {
  announcements: {
    data: Announcement[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
  };
}

export default function AnnouncementPage() {
  const { announcements } = usePage<PageProps>().props;

  // --------- Create Modal State ---------
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    data,
    setData,
    post,
    processing,
    reset,
    errors,
    clearErrors,
  } = useForm<{
    title: string;
    content: string;
    image: File | null;
  }>({
    title: "",
    content: "",
    image: null,
  });

  const openModal = () => {
    clearErrors();
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setPreview(null);
    reset("title", "content", "image");
    clearErrors();
  };

  const onFileChange = (file: File | null) => {
    setData("image", file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/sk/announcements", {
      forceFormData: true, // ensure multipart
      onSuccess: () => {
        closeModal();
        // Refresh only the announcements list
        router.reload({ only: ["announcements"] });
      },
    });
  };

  // --------- Delete ---------
  const deleteAnnouncement = (id: number) => {
    if (!confirm("Delete this announcement?")) return;
    router.delete(`/sk/announcements/${id}`, {
      onSuccess: () => router.reload({ only: ["announcements"] }),
    });
  };

  // --------- Render Helpers ---------
  const items = announcements?.data ?? [];
  const links = announcements?.links ?? [];

  const empty = useMemo(() => items.length === 0, [items]);

  return (
    <SKLayout>
      <Head title="Announcements" />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Megaphone className="w-8 h-8 text-blue-600" />
          Announcements
        </h1>

        {/* Open inline modal instead of visiting /create */}
        <button
          onClick={openModal}
          className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empty ? (
          <p className="col-span-3 text-center text-gray-500">
            No announcements yet.
          </p>
        ) : (
          items.map((a) => (
            <div
              key={a.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              {a.image_path ? (
                <img
                  src={`/storage/${a.image_path}`}
                  className="w-full h-40 object-cover"
                  alt={a.title}
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}

              <div className="p-5">
                <h2 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                  {a.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {a.excerpt ??
                    (a.content ? a.content.substring(0, 120) + "…" : "")}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {a.created_at
                      ? new Date(a.created_at).toLocaleDateString()
                      : ""}
                  </span>

                  <div className="flex gap-2">
                    <Link
                      href={`/sk/announcements/${a.id}/edit`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>

                    <button
                      onClick={() => deleteAnnouncement(a.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!!links.length && (
        <div className="flex justify-center mt-10">
          <div className="flex gap-1 flex-wrap">
            {links.map((link, i) =>
              link.url ? (
                <Link
                  key={i}
                  href={link.url}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    link.active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                />
              ) : (
                <span
                  key={i}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className="px-3 py-2 rounded-lg border text-sm bg-gray-100 text-gray-400 border-gray-300"
                />
              )
            )}
          </div>
        </div>
      )}

      {/* ---------- Create Modal ---------- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />

          {/* dialog */}
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold">Create Announcement</h3>
              <button
                onClick={closeModal}
                className="p-2 rounded hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Announcement title"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={data.content}
                  onChange={(e) => setData("content", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 h-32 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write the announcement details..."
                />
                {errors.content && (
                  <p className="text-sm text-red-600 mt-1">{errors.content}</p>
                )}
              </div>

              {/* Image Upload + Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image (optional)
                </label>

                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    <span>Select image</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
                    />
                  </label>

                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-16 w-24 rounded-md object-cover border"
                    />
                  )}
                </div>

                {errors.image && (
                  <p className="text-sm text-red-600 mt-1">{errors.image}</p>
                )}
                {/* Backend validates: image | mimes:jpg,jpeg,png | max:5120 */}
                <p className="text-xs text-gray-500 mt-2">
                  JPG/PNG, up to 5MB. (Will be resized server-side)
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                  disabled={processing}
                >
                  {processing ? "Saving..." : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SKLayout>
  );
}
