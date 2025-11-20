import { Head, Link, usePage, useForm } from "@inertiajs/react";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import { useState, useEffect } from "react";
import SKLayout from "./layout";
import { Plus, Edit, Trash2, X, CheckCircle2 } from "lucide-react";

type Status = "ongoing" | "planned" | "completed" | "cancelled";

interface ProjectItem {
    id: number;
    title: string;
    status: Status;
    budget: number;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    image_url?: string | null;
}

interface ProjectsPageProps extends InertiaPageProps {
    flash?: { success?: string };
    projects?: ProjectItem[] | { data: ProjectItem[] } | null;
}

export default function Projects() {
    const { projects, flash } = usePage<ProjectsPageProps>().props;

    const projectList: ProjectItem[] = Array.isArray(projects)
        ? projects
        : Array.isArray((projects as any)?.data)
        ? (projects as any).data
        : [];

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        }
    }, [flash?.success]);

    /* ---------------- CREATE FORM ---------------- */
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        status: "planned",
        budget: "",
        start_date: "",
        end_date: "",
        image: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/sk/projects", {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                setShowCreateModal(false);
            },
        });
    };

    /* ---------------- EDIT FORM ---------------- */
    const {
        data: editData,
        setData: setEditData,
        post: editPost,
        processing: updating,
        reset: resetEdit,
    } = useForm({
        _method: "put",
        title: "",
        description: "",
        status: "planned",
        budget: "",
        start_date: "",
        end_date: "",
        image: null as File | null,
    });

    const [editPreview, setEditPreview] = useState<string | null>(null);

    const openEditModal = (project: ProjectItem) => {
        setEditingProject(project);
        setEditPreview(null);
        setEditData({
            _method: "put",
            title: project.title,
            description: project.description || "",
            status: project.status,
            budget: project.budget?.toString() || "",
            start_date: project.start_date || "",
            end_date: project.end_date || "",
            image: null,
        });
        setShowEditModal(true);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        editPost(`/sk/projects/${editingProject.id}`, {
            forceFormData: true,
            onSuccess: () => {
                resetEdit();
                setEditPreview(null);
                setShowEditModal(false);
            },
        });
    };

    /* ---------------- BADGE COLORS ---------------- */
    const statusBadge = (status: Status) => {
        return status === "ongoing"
            ? "bg-green-100 text-green-700"
            : status === "completed"
            ? "bg-blue-100 text-blue-700"
            : status === "cancelled"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700";
    };

    return (
        <SKLayout>
            <Head title="Programs & Projects" />

            {/* Toast */}
            {showToast && flash?.success && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{flash.success}</span>
                </div>
            )}

            {/* Card */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
                <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Programs & Projects</h2>
                        <p className="text-sm text-gray-600">Manage youth projects</p>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
                    >
                        <Plus className="w-5 h-5" />
                        Create Project
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Project</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Budget</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {projectList.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="py-6 text-center text-gray-500 text-sm"
                                    >
                                        No projects yet.
                                    </td>
                                </tr>
                            ) : (
                                projectList.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shadow">
                                                {p.image_url ? (
                                                    <img
                                                        src={p.image_url}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center text-xs text-gray-400 h-full">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-gray-800">{p.title}</h3>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ₱{Number(p.budget).toLocaleString()}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge(p.status)}`}>
                                                {p.status.toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 flex gap-3">
                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                            >
                                                <Edit className="w-4 h-4" /> Edit
                                            </button>

                                            <Link
                                                as="button"
                                                method="delete"
                                                href={`/sk/projects/${p.id}`}
                                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                onClick={(e) => {
                                                    if (!confirm("Delete this project?")) e.preventDefault();
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <Modal title="Create Project" onClose={() => setShowCreateModal(false)}>
                    <ProjectForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        preview={preview}
                        setPreview={setPreview}
                    />

                    <div className="flex justify-end gap-3 border-t pt-4 mt-6">
                        <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={processing} className="btn-primary" onClick={submit}>
                            {processing ? "Saving..." : "Create"}
                        </button>
                    </div>
                </Modal>
            )}

            {showEditModal && editingProject && (
                <Modal title="Edit Project" onClose={() => setShowEditModal(false)}>
                    <ProjectForm
                        data={editData}
                        setData={setEditData}
                        preview={editPreview}
                        setPreview={setEditPreview}
                        errors={{}}
                        existingImage={editingProject.image_url}
                    />

                    <div className="flex justify-end gap-3 border-t pt-4 mt-6">
                        <button onClick={() => setShowEditModal(false)} className="btn-secondary">
                            Cancel
                        </button>
                        <button disabled={updating} className="btn-primary" onClick={submitEdit}>
                            {updating ? "Saving..." : "Update"}
                        </button>
                    </div>
                </Modal>
            )}
        </SKLayout>
    );
}

/***********************************************************
 * PROJECT FORM COMPONENT
 ***********************************************************/
function ProjectForm({ data, setData, errors, preview, setPreview, existingImage }: any) {
    return (
        <>
            {/* Title */}
            <div>
                <label className="label">Title</label>
                <input
                    type="text"
                    className="input"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                />
                {errors.title && <p className="text-red-600 text-xs">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="label">Description</label>
                <textarea
                    className="input"
                    rows={3}
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                />
            </div>

            {/* Status + Budget */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label">Status</label>
                    <select
                        className="input"
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                    >
                        <option value="planned">Planned</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label className="label">Budget (₱)</label>
                    <input
                        type="number"
                        className="input"
                        value={data.budget}
                        onChange={(e) => setData("budget", e.target.value)}
                    />
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label">Start Date</label>
                    <input
                        type="date"
                        className="input"
                        value={data.start_date}
                        onChange={(e) => setData("start_date", e.target.value)}
                    />
                </div>
                <div>
                    <label className="label">End Date</label>
                    <input
                        type="date"
                        className="input"
                        value={data.end_date}
                        onChange={(e) => setData("end_date", e.target.value)}
                    />
                </div>
            </div>

            {/* Image */}
            <div>
                <label className="label">Project Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setData("image", file);
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setPreview(reader.result as string);
                            reader.readAsDataURL(file);
                        } else {
                            setPreview(null);
                        }
                    }}
                />

                {/* Preview */}
                {preview && (
                    <img src={preview} className="mt-3 rounded-lg shadow max-h-48 object-cover" />
                )}

                {/* Existing Image */}
                {!preview && existingImage && (
                    <img src={existingImage} className="mt-3 rounded-lg shadow max-h-48 object-cover" />
                )}
            </div>
        </>
    );
}

/***********************************************************
 * MODAL COMPONENT
 ***********************************************************/
function Modal({ title, onClose, children }: any) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto">
            <div className="bg-white max-w-lg w-full p-6 rounded-xl shadow-2xl m-4">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
