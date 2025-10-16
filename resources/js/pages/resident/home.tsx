import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
  Home,
  User,
  ShieldCheck,
  BookOpen,
  LogOut,
  Settings,
  Calendar,
  Megaphone,
  Trophy,
  Heart,
  X,
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

const getActivityIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("patrol") || lower.includes("training")) return Calendar;
  if (lower.includes("meeting") || lower.includes("community")) return Megaphone;
  if (lower.includes("sports") || lower.includes("fest")) return Trophy;
  if (lower.includes("health") || lower.includes("seminar")) return Heart;
  return Calendar;
};

export default function NeonActivitiesDashboard({ activities }: Props) {
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
  const upcoming = activities.filter(a => a.dateofactivity >= today);
  const past = activities.filter(a => a.dateofactivity < today);
  const displayActivities = tab === "upcoming" ? upcoming : past;

  return (
    <>
      <Head title="Barangay Activities" />
      <div className="min-h-screen flex bg-gray-900 text-white">
        {/* Sidebar */}
        <aside
          className={`fixed inset-0 z-40 lg:static lg:w-80 bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-8 border-b border-blue-700 flex flex-col items-center justify-center relative">
            <button
              className="lg:hidden absolute top-6 right-6"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain rounded-full mb-3"
            />
            <h1 className="text-2xl font-bold text-center">Barangay Portal</h1>
          </div>

          <nav className="flex-1 p-6 space-y-1">
            {menu.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center p-4 rounded-lg hover:bg-green-700/50 transition group"
              >
                <item.icon className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <Link
              href="/resident/settings"
              className="flex items-center p-4 rounded-lg hover:bg-green-700/50 transition group"
            >
              <Settings className="w-5 h-5 mr-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>

          <div className="p-6 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-4 rounded-lg bg-blue-700/50 hover:bg-red-600 transition group"
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
        <main className="flex-1 min-h-screen p-6 lg:p-10">
          <header className="text-center mb-8">
            <h2 className="text-4xl font-bold text-pink-500 mb-2 neon-text">
              Barangay Activities
            </h2>
            <p className="text-pink-300">Check the latest events in your barangay</p>
          </header>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            {["upcoming", "past"].map(t => (
              <button
                key={t}
                className={`px-6 py-2 rounded-lg font-semibold mx-2 transition ${
                  tab === t
                    ? "bg-pink-500 text-white shadow-md"
                    : "bg-gray-800 text-gray-300 hover:text-white"
                }`}
                onClick={() => setTab(t as "upcoming" | "past")}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Activities Grid */}
          {displayActivities.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
              No {tab} activities available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayActivities.map(act => {
                const Icon = getActivityIcon(act.activity);
                return (
                  <motion.div
                    key={act.id}
                    className="relative bg-gray-800 rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow:
                        "0 0 20px #ff0080, 0 0 40px #ff00ff, 0 0 60px #ff0080",
                      transition: { duration: 0.3 },
                    }}
                  >
                    {act.activity_photos[0] && (
                      <img
                        src={act.activity_photos[0].url}
                        alt={act.activity}
                        className="w-full h-48 object-cover rounded-t-3xl"
                      />
                    )}

                    <div className="p-6 flex flex-col gap-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{act.activity}</h3>
                      </div>
                      <p className="text-gray-300">{act.description}</p>
                      <div className="text-sm text-gray-400">
                        {new Date(act.dateofactivity).toLocaleDateString()}
                      </div>

                      {act.activity_photos.length > 1 && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {act.activity_photos.slice(1).map(photo => (
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
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
