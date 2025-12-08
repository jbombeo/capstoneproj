import React, { useState, useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
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
  ClipboardList,
  Bell,
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

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  link: string;
}

interface SharedProps extends InertiaPageProps {
  activities?: Activity[];
  notifications: NotificationItem[];
  notifications_count: number;
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
  const [showNotifications, setShowNotifications] = useState(false);

  const { post } = useForm();
  const { notifications, notifications_count } = usePage<SharedProps>().props;

  const [likes, setLikes] = useState<Record<number, number>>({});
  const [doubleClickHeart, setDoubleClickHeart] = useState<Record<number, boolean>>({});

  // Local red-dot state (front-end only)
  const [hasUnread, setHasUnread] = useState(notifications_count > 0);

  useEffect(() => {
    setHasUnread(notifications_count > 0);
  }, [notifications_count]);

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
    const lower = title.toLowerCase();
    if (lower.includes("patrol") || lower.includes("training")) return Calendar;
    if (lower.includes("meeting") || lower.includes("community")) return Megaphone;
    if (lower.includes("sports") || lower.includes("fest")) return Trophy;
    if (lower.includes("health") || lower.includes("seminar")) return HeartIcon;
    return Calendar;
  };

  const today = new Date().toISOString().split("T")[0];
  const upcomingActivities = activities.filter((a) => a.dateofactivity >= today);
  const pastActivities = activities.filter((a) => a.dateofactivity < today);
  const displayActivities = tab === "upcoming" ? upcomingActivities : pastActivities;

  const handleLike = (activityId: number) => {
    setLikes((prev) => ({ ...prev, [activityId]: (prev[activityId] ?? 0) + 1 }));
    setDoubleClickHeart((prev) => ({ ...prev, [activityId]: true }));
    setTimeout(() => {
      setDoubleClickHeart((prev) => ({ ...prev, [activityId]: false }));
    }, 800);
    post(`/activities/${activityId}/like`);
  };

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".notification-area")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleNotificationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowNotifications((prev) => !prev);
    setHasUnread(false);
  };

  return (
    <>
      <Head title="Resident Home" />
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl flex flex-col transition-transform duration-300 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } lg:static lg:translate-x-0`}
        >
          <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-blue-700 flex flex-col items-center justify-center relative">
            <button
              className="lg:hidden absolute top-4 right-4 text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="Barangay Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white text-center">
              Barangay Portal
            </h1>
          </div>

          <nav className="flex-1 px-4 sm:px-6 py-4 space-y-1 overflow-y-auto">
            {menu.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-3 sm:px-4 sm:py-3 rounded-lg hover:bg-green-700/50 text-white transition group text-sm sm:text-base"
              >
                <item.icon className="w-5 h-5 mr-3 sm:mr-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 sm:px-6 py-4 sm:py-6 border-t border-blue-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-blue-700/50 hover:bg-red-600 text-white text-sm sm:text-base transition"
            >
              <LogOut className="w-5 h-5 mr-2 sm:mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-10 text-white shadow-lg">
            <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 md:flex-row md:items-start md:justify-between">
              {/* Left section: logo + title */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 sm:border-4 border-white/30 flex items-center justify-center bg-white/10">
                  <ScalesIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold leading-tight">
                    Welcome to the
                  </h2>
                  <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold leading-tight">
                    Barangay Portal
                  </h2>
                  <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg text-blue-100">
                    Check the latest activities and events in your barangay
                  </p>
                </div>
              </div>

              {/* Right section: bell + menu toggle */}
              <div className="flex items-center justify-end gap-3 sm:gap-4">
                {/* Notification Bell */}
                <div className="notification-area relative">
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 sm:p-2.5 rounded-lg bg-blue-700/50 hover:bg-blue-700 transition"
                  >
                    <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    {hasUnread && notifications_count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                        {notifications_count > 9 ? "9+" : notifications_count}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white shadow-xl rounded-xl p-3 sm:p-4 text-gray-800 z-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm sm:text-base">Notifications</h4>
                        <button
                          className="text-[11px] text-blue-600 hover:underline"
                          onClick={() => setShowNotifications(false)}
                        >
                          Close
                        </button>
                      </div>

                      {notifications.length === 0 ? (
                        <p className="text-xs sm:text-sm text-gray-500">
                          No notifications available.
                        </p>
                      ) : (
                        <ul className="space-y-2 max-h-64 overflow-y-auto text-xs sm:text-sm">
                          {notifications.map((n) => (
                            <li
                              key={n.id}
                              className="p-2 sm:p-3 bg-gray-100 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold">{n.title}</span>
                                <span className="text-[10px] text-gray-500">
                                  {n.type}
                                </span>
                              </div>
                              <div className="text-gray-700">{n.message}</div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] sm:text-[11px] text-gray-500">
                                  {n.time}
                                </span>
                                <Link
                                  href={n.link}
                                  className="text-[10px] sm:text-[11px] text-blue-600 hover:underline"
                                >
                                  View
                                </Link>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden p-2 rounded-lg bg-blue-700/50 hover:bg-blue-700 text-white"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs + Activities */}
          <div className="max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 flex-1">
            {/* Tabs */}
            <div className="mb-6 sm:mb-8 flex justify-center sm:justify-start">
              <div className="inline-flex bg-gray-200 rounded-xl p-1 shadow-sm w-full max-w-xs sm:max-w-sm md:max-w-md">
                <button
                  className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                    tab === "upcoming"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-transparent text-gray-700 hover:text-gray-900"
                  }`}
                  onClick={() => setTab("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
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

            {/* Activities */}
            <section className="space-y-4 sm:space-y-6">
              {displayActivities.length === 0 ? (
                <div className="text-center py-12 sm:py-16 px-4">
                  <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base sm:text-lg">
                    No {tab} activities or events available.
                  </p>
                </div>
              ) : (
                displayActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.activity);
                  const showHeart = doubleClickHeart[activity.id] ?? false;

                  return (
                    <div
                      key={activity.id}
                      className="bg-white rounded-2xl shadow-md sm:shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    >
                      {/* Card Header */}
                      <div className="flex items-center px-3 py-3 sm:px-4 sm:py-4 border-b border-gray-100">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="ml-3 sm:ml-4 flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">
                            {activity.activity}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {activity.dateofactivity}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="px-3 sm:px-4 py-2 sm:py-3 text-gray-700 text-sm whitespace-pre-line">
                        {activity.description}
                      </div>

                      {/* Photos */}
                      {activity.photos?.length ? (
                        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 sm:pt-3 flex flex-wrap gap-2">
                          {activity.photos?.map((photo) => (
                            <div
                              key={photo.id}
                              className="relative w-full xs:w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 h-40 sm:h-48 overflow-hidden rounded-lg"
                            >
                              <img
                                src={photo.url}
                                alt="Activity"
                                className="w-full h-full object-cover cursor-pointer"
                                onDoubleClick={() => handleLike(activity.id)}
                              />
                              {showHeart && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <HeartIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-lg animate-ping" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {/* Footer */}
                      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-t border-gray-100 text-xs sm:text-sm text-gray-500">
                        <span />
                        <span>Barangay Portal</span>
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