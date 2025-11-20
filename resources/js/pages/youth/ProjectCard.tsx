import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface Project {
    id: number;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    participants_count: number;
    status: "planned" | "ongoing" | "completed" | "cancelled";
    attendance_status: "not_registered" | "registered" | "attended" | "absent";
}

interface Props {
    project: Project;
    onRegister: (id: number) => void;
}

export default function ProjectCard({ project, onRegister }: Props) {
    const statusColors: Record<Project["status"], string> = {
        ongoing: "bg-green-100 text-green-700",
        planned: "bg-yellow-100 text-yellow-700",
        completed: "bg-blue-100 text-blue-700",
        cancelled: "bg-red-100 text-red-700",
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">

            {/* Status */}
            <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[project.status]}`}>
                    {project.status.toUpperCase()}
                </span>

                {project.attendance_status !== "not_registered" && (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        {project.attendance_status.toUpperCase()}
                    </span>
                )}
            </div>

            <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>

            <p className="text-gray-600">{project.description}</p>

            <div className="space-y-2 text-sm text-gray-700">

                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Start: {project.start_date ?? "N/A"}
                </div>

                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    End: {project.end_date ?? "N/A"}
                </div>

                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {project.location ?? "No location"}
                </div>

                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Participants: {project.participants_count}
                </div>

            </div>

            {/* Buttons */}
            {project.attendance_status === "not_registered" && (
                <button
                    onClick={() => onRegister(project.id)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                    Register for this Project
                </button>
            )}

            {project.attendance_status === "registered" && (
                <div className="w-full py-3 bg-blue-50 text-blue-700 text-center font-semibold rounded-lg">
                    Already Registered
                </div>
            )}

            {project.attendance_status === "attended" && (
                <div className="w-full py-3 bg-green-50 text-green-700 text-center font-semibold rounded-lg">
                    Attended
                </div>
            )}
        </div>
    );
}
