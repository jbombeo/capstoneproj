import { Head, usePage } from "@inertiajs/react";
import SKLayout from "./layout";
import { Users, Calendar, GraduationCap, ClipboardList, BarChart3 } from "lucide-react";

export default function Reports() {
    const { stats } = usePage().props as any || {
        stats: {
            youth: 0,
            projects: 0,
            scholarships: 0,
            requests: 0,
        }
    };

    const items = [
        { label: "Total Youth Members", value: stats.youth, icon: Users, color: "bg-blue-600" },
        { label: "Programs & Projects", value: stats.projects, icon: Calendar, color: "bg-green-600" },
        { label: "Scholarship Programs", value: stats.scholarships, icon: GraduationCap, color: "bg-purple-600" },
        { label: "Service Requests", value: stats.requests, icon: ClipboardList, color: "bg-orange-600" },
    ];

    return (
        <SKLayout>
            <Head title="Reports & Analytics" />

            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        Reports & Analytics
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Overview of SK activities and statistics</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((s, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition">
                            <div className="p-6 flex items-center gap-4">
                                <div className={`${s.color} p-3 rounded-xl`}>
                                    <s.icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm font-semibold">{s.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Placeholder card */}
                <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Graphs, charts, and exportable reports will appear here once the database has activity logs.
                    </p>
                </div>
            </div>
        </SKLayout>
    );
}
