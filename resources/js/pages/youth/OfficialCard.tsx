interface Official {
    id: number;
    position: string;
    complete_name: string;
    contact: string | null;
    address: string | null;
    term_start: string | null;
    term_end: string | null;
    status: string;
    image?: string | null;
}

interface Props {
    official: Official;
}

export default function OfficialCard({ official }: Props) {
    return (
        <div
            className="bg-white rounded-2xl shadow-md border border-gray-200 
                       p-6 flex flex-col items-center gap-4 
                       hover:shadow-xl hover:-translate-y-1 transition"
        >

            {/* IMAGE */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow">
                <img
                    src={official.image ? `/storage/${official.image}` : "/default-avatar.png"}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* NAME */}
            <h3 className="text-xl font-bold text-gray-900 text-center">
                {official.complete_name}
            </h3>

            {/* POSITION */}
            <span className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                {official.position}
            </span>

            {/* STATUS */}
            <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                    official.status === "active"
                        ? "bg-green-500 text-white"
                        : official.status === "inactive"
                        ? "bg-red-500 text-white"
                        : "bg-gray-500 text-white"
                }`}
            >
                {official.status}
            </span>

            {/* DETAILS */}
            <div className="text-gray-600 w-full text-center text-sm space-y-1 mt-2">
                <p><b>Contact:</b> {official.contact || "N/A"}</p>
                <p><b>Address:</b> {official.address || "N/A"}</p>
                <p><b>Term:</b> {official.term_start} – {official.term_end}</p>
            </div>

        </div>
    );
}
