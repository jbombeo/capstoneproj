import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  Home,
  User,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Settings,
  Calendar,
  Megaphone,
  Trophy,
  Heart as HeartIcon,
  FileText,
  MessageSquare,
  ClipboardList
} from "lucide-react";

interface ActivityPhoto {
  id: number;
  filename: string;
  url: string;
}

interface Activity {
  id: number;
  activity: string;
  description: string;
  dateofactivity: string;
  photos?: ActivityPhoto[];
}

const ScalesIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="3" x2="12" y2="21" />
    <path d="M8 6H4l-2 6 2 3h4l-2-3z" />
    <path d="M20 6h-4l2 6-2 3h4l2-3z" />
    <circle cx="12" cy="3" r="1" />
  </svg>
);

export default function ResidentHome({ activities = [] }: { activities?: Activity[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const { post } = useForm();

  const [likes, setLikes] = useState<Record<number, number>>({});
  const [doubleClickHeart, setDoubleClickHeart] = useState<Record<number, boolean>>({});

  const handleLogout = () => post("/logout");

  const menu = [
    { name: "Home", icon: Home, href: "/resident/home" },
    { name: "Profile", icon: User, href: "/resident/profile" },
    { name: "Barangay Official", icon: ShieldCheck, href: "/resident/officials" },
    { name: "Request Document", icon: FileText, href: "/resident/document-requests" },
    { name: "Blotter", icon: ClipboardList, href: "/resident/blotters" },
    { name: "Suggest", icon: MessageSquare, href: "/resident/feedback" },
    { name: "Settings", icon: Settings, href: "/resident/settings" },
  ];

  const getActivityIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("patrol") || lowerTitle.includes("training")) return Calendar;
    if (lowerTitle.includes("meeting") || lowerTitle.includes("community")) return Megaphone;
    if (lowerTitle.includes("sports") || lowerTitle.includes("fest")) return Trophy;
    if (lowerTitle.includes("health") || lowerTitle.includes("seminar")) return HeartIcon;
    return Calendar;
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingActivities = activities.filter((a) => a.dateofactivity >= today);
  const pastActivities = activities.filter((a) => a.dateofactivity < today);
  const displayActivities = tab === "upcoming" ? upcomingActivities : pastActivities;

  const handleLike = (activityId: number) => {
    // Update like count locally
    setLikes((prev) => ({ ...prev, [activityId]: (prev[activityId] ?? 0) + 1 }));

    // Show heart animation
    setDoubleClickHeart((prev) => ({ ...prev, [activityId]: true }));
    setTimeout(() => {
      setDoubleClickHeart((prev) => ({ ...prev, [activityId]: false }));
    }, 800);

    // Optional: post to backend
    post(`/activities/${activityId}/like`);
  };

  return (
    <>
      <Head title="Resident Home" />
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-0 z-40 lg:static lg:w-80 bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-8 border-b border-blue-700 flex flex-col items-center justify-center relative">
            <button
              className="lg:hidden absolute top-6 right-6 text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-20 h-20 mb-3 flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Barangay Logo"
                className="w-90 h-90 object-contain rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Barangay Portal</h1>
          </div>

          <nav className="flex-1 p-6 space-y-1">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center p-4 rounded-lg hover:bg-green-700/50 text-white transition group"
              >
                <item.icon className="w-5 h-5 mr-4 text-white group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-4 rounded-lg bg-blue-700/50 hover:bg-red-600 text-white transition group"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 lg:p-12 text-white shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-start">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/10">
                  <ScalesIcon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold">Welcome to the</h2>
                  <h2 className="text-3xl lg:text-4xl font-bold">Barangay Portal</h2>
                  <p className="mt-3 text-blue-100 text-lg">
                    Check the latest activities and events in your barangay
                  </p>
                </div>
              </div>
              <button
                className="lg:hidden text-white bg-blue-700/50 p-2 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto p-6 lg:p-10">
            <div className="mb-8">
              <div className="inline-flex bg-gray-200 rounded-xl p-1 shadow-sm">
                <button
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    tab === "upcoming"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => setTab("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    tab === "past"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => setTab("past")}
                >
                  Past
                </button>
              </div>
            </div>

            {/* Activities as Modern Posts */}
            <section className="space-y-6">
              {displayActivities.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No {tab} activities or events available.</p>
                </div>
              ) : (
                displayActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.activity);
                  const likeCount = likes[activity.id] ?? 0;
                  const showHeart = doubleClickHeart[activity.id] ?? false;

                  return (
                    <div
                      key={activity.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center p-4 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{activity.activity}</h3>
                          <p className="text-sm text-gray-500">{activity.dateofactivity}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="px-4 py-3 text-gray-700 text-sm whitespace-pre-line">
                        {activity.description}
                      </div>

                      {/* Photos with double-click like */}
                      {activity.photos && activity.photos.length > 0 && (
                        <div className="relative p-4 flex flex-wrap gap-2">
                          {activity.photos.map((photo) => (
                            <div
                              key={photo.id}
                              className="relative w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-48 overflow-hidden rounded-lg"
                            >
                              <img
                                src={photo.url}
                                alt="Activity"
                                className="w-full h-full object-cover cursor-pointer"
                                onDoubleClick={() => handleLike(activity.id)}
                              />

                              {/* Heart animation */}
                              {showHeart && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <HeartIcon className="w-16 h-16 text-white drop-shadow-lg animate-ping" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-gray-500">
                          {/* <button
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                            onClick={() => handleLike(activity.id)}
                          >
                            <HeartIcon className="w-5 h-5" />
                            <span>{likeCount} Like{likeCount !== 1 ? "s" : ""}</span>
                          </button> */}
                        </div>
                        <div className="text-gray-400 text-sm">Barangay Portal</div>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
