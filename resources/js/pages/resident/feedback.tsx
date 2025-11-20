import React, { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Home,
    User,
    ShieldCheck,
    FileText,
    Settings,
    Menu,
    X,
    LogOut,
    MessageSquare,
    Plus,
} from "lucide-react";

/* TYPES */
interface Resident {
    name?: string | null;
}

interface FeedbackItem {
    id: number;
    message: string;
    type: string;
    status?: string;           // 👈 ADDED
    created_at: string;
    resident?: Resident | null;
}

interface Props {
    feedbacks?: FeedbackItem[];
}

export default function ResidentFeedback({ feedbacks = [] }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [localList, setLocalList] = useState<FeedbackItem[]>(feedbacks);

    const { data, setData, post, processing, reset } = useForm({
        type: "",
        message: "",
    });

    const [toast, setToast] = useState<{ show: boolean; msg?: string }>({
        show: false,
        msg: "",
    });

    useEffect(() => {
        setLocalList(feedbacks);
    }, [feedbacks]);

    /** CATEGORY COLORS */
    const getCategoryColor = (type: string) => {
        switch (type) {
            case "feedback":
                return "bg-blue-600 text-white";
            case "suggestion":
                return "bg-green-600 text-white";
            case "complaint":
                return "bg-red-600 text-white";
            default:
                return "bg-gray-600 text-white";
        }
    };

    /** STATUS COLORS */
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500 text-white";
            case "reviewed":
                return "bg-blue-500 text-white";
            case "resolved":
                return "bg-green-600 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

    /** SUBMIT FEEDBACK */
    const submit = (e: any) => {
        e.preventDefault();

        if (!data.type || !data.message) {
            setToast({ show: true, msg: "Please complete all fields." });
            setTimeout(() => setToast({ show: false }), 3000);
            return;
        }

        post("/resident/feedback/store", {
            onSuccess: () => {
                reset();
                setModalOpen(false);

                setToast({ show: true, msg: "Feedback submitted!" });
                setTimeout(() => setToast({ show: false }), 3000);

                setLocalList([
                    {
                        id: Date.now(),
                        type: data.type,
                        message: data.message,
                        created_at: new Date().toISOString(),
                        status: "pending",
                        resident: { name: "You" },
                    },
                    ...localList,
                ]);
            },
        });
    };

    /** SIDEBAR MENU */
    const menu = [
        { name: "Home", icon: Home, href: "/resident/home" },
        { name: "Profile", icon: User, href: "/resident/profile" },
        { name: "Barangay Officials", icon: ShieldCheck, href: "/resident/officials" },
        { name: "Request Document", icon: FileText, href: "/resident/document-requests" },
        { name: "Blotter", icon: FileText, href: "/resident/blotters" },
        { name: "Suggest", icon: MessageSquare, href: "/resident/feedback" },
        { name: "Settings", icon: Settings, href: "/resident/settings" },
    ];

    const { post: logoutPost } = useForm();
    const logout = () => logoutPost("/logout");

    return (
        <>
            <Head title="Suggestions & Feedback" />

            <div className="min-h-screen flex bg-gray-100 overflow-hidden">

                {/* SIDEBAR */}
                <aside
                    className={`
                        fixed inset-0 z-40 lg:static lg:w-72 xl:w-80 
                        bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl flex flex-col 
                        transform transition-transform duration-300 ease-in-out
                        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    `}
                >
                    <div className="p-6 border-b border-blue-700 flex flex-col items-center relative">

                        {/* CLOSE (mobile) */}
                        <button
                            className="lg:hidden absolute top-4 right-4 text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* LOGO */}
                        <img
                            src="/images/logo.png"
                            className="w-20 h-20 rounded-full mb-3 object-contain"
                        />

                        <h1 className="text-xl font-bold text-white text-center">
                            Barangay Portal
                        </h1>
                    </div>

                    {/* MENU */}
                    <nav className="flex-1 overflow-y-auto p-5 space-y-1">
                        {menu.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center p-4 rounded-lg hover:bg-green-700/50
                                    text-white text-sm transition group"
                            >
                                <item.icon className="w-5 h-5 mr-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* LOGOUT */}
                    <div className="p-5 border-t border-blue-700">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center p-3 rounded-lg 
                                bg-blue-700/50 hover:bg-red-600 text-white transition"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* MOBILE OVERLAY */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* MAIN CONTENT */}
                <main className="flex-1 min-h-screen overflow-x-hidden">

                    {/* HEADER */}
                    <header className="
                        bg-gradient-to-r from-blue-600 to-blue-500 
                        p-6 sm:p-8 text-white shadow-lg
                        flex flex-col sm:flex-row sm:items-center justify-between gap-4
                    ">

                        <div className="flex items-center gap-4">
                            <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12" />
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold">
                                    Suggestions & Feedback
                                </h2>
                                <p className="text-blue-200 text-sm mt-1">
                                    Help improve your barangay.
                                </p>
                            </div>
                        </div>

                        {/* ADD BUTTON */}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 bg-white text-blue-700 
                                    font-bold px-4 py-2 rounded-lg shadow hover:bg-gray-100"
                        >
                            <Plus className="w-5 h-5" /> Add Feedback
                        </button>

                        {/* MOBILE MENU */}
                        <button
                            className="absolute top-5 right-5 lg:hidden text-white bg-blue-700/50 p-2 rounded-lg"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </header>

                    {/* FEEDBACK LIST */}
                    <section className="
                        max-w-7xl mx-auto 
                        p-4 sm:p-6 lg:p-10
                        grid gap-6
                        grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                    ">
                        {localList.length === 0 ? (
                            <p className="col-span-full text-center text-gray-500 py-10">
                                No feedback submitted yet.
                            </p>
                        ) : (
                            localList.map((fb) => (
                                <div
                                    key={fb.id}
                                    className="
                                        relative bg-white rounded-2xl shadow-xl 
                                        border border-gray-200 p-6 flex flex-col gap-3 
                                        hover:shadow-2xl hover:-translate-y-1 
                                        transition-all duration-300
                                    "
                                >
                                    {/* CATEGORY */}
                                    <span
                                        className={`absolute top-4 right-4 px-3 py-1 text-xs 
                                        font-bold uppercase rounded-full shadow-md 
                                        ${getCategoryColor(fb.type)}`}
                                    >
                                        {fb.type}
                                    </span>

                                    {/* STATUS */}
                                    <span
                                        className={`text-xs w-fit px-2 py-1 rounded-md font-semibold 
                                        ${getStatusColor(fb.status ?? "pending")}`}
                                    >
                                        {fb.status ?? "pending"}
                                    </span>

                                    {/* MESSAGE */}
                                    <p className="text-gray-700 text-sm sm:text-base mt-2">
                                        {fb.message}
                                    </p>

                                    <div className="border-t pt-3 text-xs sm:text-sm text-gray-500">
                                        Submitted by: <b>{fb.resident?.name ?? "You"}</b>
                                        <p className="text-gray-400 mt-1">
                                            {new Date(fb.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </section>
                </main>
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Add Feedback</h2>

                        <form onSubmit={submit} className="space-y-5">

                            {/* TYPE */}
                            <div className="space-y-1">
                                <label className="font-semibold">
                                    Category
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData("type", e.target.value)}
                                    className="w-full border rounded-lg p-3 bg-gray-50"
                                >
                                    <option value="">Select category</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="suggestion">Suggestion</option>
                                    <option value="complaint">Complaint</option>
                                </select>
                            </div>

                            {/* MESSAGE */}
                            <div className="space-y-1">
                                <label className="font-semibold">
                                    Message
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.message}
                                    onChange={(e) => setData("message", e.target.value)}
                                    className="w-full border rounded-lg p-3 bg-gray-50"
                                    placeholder="Write your message..."
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 rounded-lg"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                    disabled={processing}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast.show && (
                <div className="fixed right-4 bottom-4 z-50">
                    <div className="bg-white shadow-lg rounded-lg px-4 py-3 border">
                        {toast.msg}
                    </div>
                </div>
            )}
        </>
    );
}
