import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
  Home,
  User,
  ShieldCheck,
  BookOpen,
  Menu,
  X,
  LogOut,
  Settings,
  Calendar,
  Megaphone,
  Trophy,
  Heart,
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
  activity_photos: ActivityPhoto[];
}

interface Props {
  activities: Activity[];
}

// Map activity title to icon
const getActivityIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("patrol") || lower.includes("training")) return Calendar;
  if (lower.includes("meeting") || lower.includes("community")) return Megaphone;
  if (lower.includes("sports") || lower.includes("fest")) return Trophy;
  if (lower.includes("health") || lower.includes("seminar")) return Heart;
  return Calendar;
};

export default function ActivitiesDashboard({ activities }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const { post } = useForm();

  const handleLogout = () => post("/logout");

  const menu = [
    { name: "Home", icon: Home, href: "/resident/home" },
    { name: "Profile", icon: User, href: "/resident/profile" },
    { name: "Barangay Official", icon: ShieldCheck, href: "/resident/officials" },
    { name: "Request Document", icon: BookOpen, href: "/resident/document-requests" },
  ];

  const today = new Date().toISOString().split("T")[0];
  const upcoming = activities.filter((a) => a.dateofactivity >= today);
  const past = activities.filter((a) => a.dateofactivity < today);
  const displayActivities = tab === "upcoming" ? upcoming : past;

  return (
    <>
      <Head title="Barangay Activities" />
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
                className="w-full h-full object-contain rounded-full"
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
            <Link
              href="/resident/settings"
              className="flex items-center p-4 rounded-lg hover:bg-green-700/50 text-white transition group"
            >
              <Settings className="w-5 h-5 mr-4 text-white group-hover:scale-110 transition-transform" />
              <span className="font-medium">Settings</span>
            </Link>
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 lg:p-12 text-white shadow-lg">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold">Barangay Activities</h2>
              <p className="mt-3 text-blue-100 text-lg">
                Check the latest activities and events in your barangay
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-6 lg:p-10">
            {/* Tabs */}
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

            {/* Poster-style Activity Grid with Flash */}
            {displayActivities.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No {tab} activities available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayActivities.map((act, index) => {
                  const Icon = getActivityIcon(act.activity);
                  return (
                    <div
                      key={act.id}
                      className={`bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer transform transition-all duration-500 
                      opacity-0 animate-fadeIn delay-${index * 100}`}
                      style={{ animationFillMode: "forwards", animationDelay: `${index * 100}ms` }}
                    >
                      {act.activity_photos[0] && (
                        <img
                          src={act.activity_photos[0].url}
                          alt={act.activity}
                          className="w-full h-48 object-cover rounded-t-2xl"
                        />
                      )}
                      <div className="p-6 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">{act.activity}</h3>
                        </div>
                        <p className="text-gray-700">{act.description}</p>
                        <div className="text-sm text-gray-500">
                          {new Date(act.dateofactivity).toLocaleDateString()}
                        </div>
                        {act.activity_photos.length > 1 && (
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {act.activity_photos.slice(1).map((photo) => (
                              <img
                                key={photo.id}
                                src={photo.url}
                                alt={act.activity}
                                className="w-full h-24 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease forwards;
          }
        `}
      </style>
    </>
  );
}
