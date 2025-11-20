import { Head, Link, usePage } from "@inertiajs/react";
import SKLayout from "./layout";
import {
  Users,
  Calendar,
  Megaphone,
  GraduationCap,
  Plus,
  User as UserIcon,
} from "lucide-react";
import { useState } from "react";

/* --------------------------------------
   TYPE DEFINITIONS
----------------------------------------- */
type Status = "ongoing" | "planned" | "completed";

interface Announcement {
  id: number;
  title: string;
  excerpt?: string;
  image_path?: string | null;
  author?: string;
}

interface Project {
  id: number;
  title: string;
  status: Status;
  start_date: string;
  end_date: string;
  description?: string;
  budget?: number;
  progress?: number;
  participants_count: number;
  coordinator?: string;
  image_path?: string | null;
}

interface DashboardProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  stats: {
    totalYouth: number;
    activeProjects: number;
    pendingApplications: number;
    scholarshipGrants: number;
  };
  announcements: Announcement[];
  projects: Project[];
}

/* --------------------------------------
   PAGE COMPONENT
----------------------------------------- */
export default function Dashboard() {
  // SAFE fallback values
  const {
    user = { id: 0, name: "Unknown", email: "" },
    stats = {
      totalYouth: 0,
      activeProjects: 0,
      pendingApplications: 0,
      scholarshipGrants: 0,
    },
    announcements = [],
    projects = [],
  } = usePage<Partial<DashboardProps>>().props;

  // MODAL STATE
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const openModal = (a: Announcement) => {
    setSelectedAnnouncement(a);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const statusBadge = (status: Status) =>
    status === "ongoing"
      ? "bg-green-100 text-green-700"
      : status === "completed"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <SKLayout>
      <Head title="SK Dashboard" />

      <div className="space-y-10 animate-fadeIn">
        {/* HEADER */}
        <section className="rounded-2xl shadow-xl bg-gradient-to-r from-green-600 via-green-700 to-blue-700 text-white px-8 py-12">
          <div className="inline-block bg-white/20 px-4 py-1 rounded-full mb-4">
            SK Management Dashboard
          </div>

          <h1 className="text-3xl font-extrabold mb-2">
            Welcome, {user.name} 👋
          </h1>

          <p className="text-blue-100 text-lg">
            Empowering youth through transparency and leadership.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/sk/announcements/create"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-green-700 font-semibold hover:bg-green-50 shadow-md transition"
            >
              <Plus className="w-5 h-5" /> Create Announcement
            </Link>

            <Link
              href="/sk/projects"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white/10 transition"
            >
              View Projects
            </Link>
          </div>
        </section>

        {/* STATISTICS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Youth Members" value={stats.totalYouth} icon={Users} gradient="from-blue-600 to-blue-500" />
          <StatCard label="Active Projects" value={stats.activeProjects} icon={Calendar} gradient="from-green-600 to-green-500" />
          <StatCard label="Pending Applications" value={stats.pendingApplications} icon={Megaphone} gradient="from-orange-600 to-orange-500" />
          <StatCard label="Scholarship Grants" value={stats.scholarshipGrants} icon={GraduationCap} gradient="from-purple-600 to-purple-500" />
        </section>

        {/* ANNOUNCEMENTS */}
        <section className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-green-600" />
              Latest Announcements
            </h2>

            <Link href="/sk/announcements" className="text-green-700 font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="p-6 space-y-4">
            {!announcements.length ? (
              <p className="text-gray-500">No announcements yet.</p>
            ) : (
              announcements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} onOpen={openModal} />
              ))
            )}
          </div>
        </section>

        {/* PROJECT MONITORING */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-5 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" />
              Project Monitoring (Registered Youth)
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!projects.length ? (
              <div className="col-span-full text-center py-6 text-gray-500">
                No projects with registered youth.
              </div>
            ) : (
              projects.map((p) => <ProjectCard key={p.id} project={p} />)
            )}
          </div>
        </section>
      </div>

      {/* ============================
            ANNOUNCEMENT MODAL
      ============================ */}
      {modalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
              onClick={closeModal}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedAnnouncement.title}</h2>

            <p className="text-sm text-gray-500 mb-4">
              By {selectedAnnouncement.author ?? "SK Official"}
            </p>

            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {selectedAnnouncement.excerpt?.replace("...", "")}
            </p>

            {selectedAnnouncement.image_path && (
              <img
                src={selectedAnnouncement.image_path}
                className="mt-4 rounded-xl shadow"
                alt="Announcement"
              />
            )}
          </div>
        </div>
      )}
    </SKLayout>
  );
}

/* --------------------------------------
   COMPONENT: STAT CARD
----------------------------------------- */
interface StatCardProps {
  label: string;
  value: number;
  icon: any;
  gradient: string;
}

function StatCard({ label, value, icon: Icon, gradient }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center text-white mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

/* --------------------------------------
   COMPONENT: PROJECT CARD
----------------------------------------- */
function ProjectCard({ project }: { project: Project }) {
  const statusBadge =
    project.status === "ongoing"
      ? "bg-green-100 text-green-700"
      : project.status === "completed"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  // Compute progress from dates if missing
  const start = new Date(project.start_date);
  const end = new Date(project.end_date);
  const today = new Date();

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = today.getTime() - start.getTime();

  const computedProgress =
    totalDuration > 0
      ? Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
      : 0;

  const progress = project.progress ?? Math.round(computedProgress);

  const daysRemaining = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="border rounded-xl shadow-sm p-6 hover:shadow-lg transition bg-white">
      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${statusBadge}`}>
        {project.status}
      </span>

      <h3 className="font-bold text-lg mt-3">{project.title}</h3>

      {project.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
      )}

      <div className="text-sm text-gray-600 mt-2 space-y-1">
        <p>Start: {project.start_date}</p>
        <p>End: {project.end_date}</p>
        <p className="font-semibold">
          Days Remaining: {daysRemaining > 0 ? daysRemaining : "Completed"}
        </p>
      </div>

      {project.budget && (
        <div className="flex justify-between text-sm mt-3">
          <span className="text-gray-600">Budget</span>
          <span className="font-bold">₱{Number(project.budget).toLocaleString()}</span>
        </div>
      )}

      {project.coordinator && (
        <div className="text-xs text-gray-500 mt-1">Coordinator: {project.coordinator}</div>
      )}

      <div className="flex justify-between text-sm pt-3 border-t mt-3">
        <span className="text-gray-600">Participants</span>
        <span className="font-bold">{project.participants_count}</span>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600 font-semibold">Progress</span>
          <span className="font-bold">{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-green-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Link href={`/sk/projects/${project.id}`} className="block text-green-700 font-semibold text-sm mt-4">
        View Details →
      </Link>
    </div>
  );
}

/* --------------------------------------
   COMPONENT: ANNOUNCEMENT CARD (Modal Trigger)
----------------------------------------- */
function AnnouncementCard({
  announcement,
  onOpen,
}: {
  announcement: Announcement;
  onOpen: (a: Announcement) => void;
}) {
  return (
    <div
      className="border rounded-xl p-4 flex justify-between items-start gap-4 hover:bg-gray-50 cursor-pointer transition"
      onClick={() => onOpen(announcement)}
    >
      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{announcement.title}</h3>

        <p className="text-gray-600 text-sm mt-1">{announcement.excerpt}</p>

        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <UserIcon className="w-4 h-4" />
          {announcement.author ?? "SK Official"}
        </div>
      </div>

      <span className="text-green-700 font-semibold text-sm self-center">
        Read →
      </span>
    </div>
  );
}
