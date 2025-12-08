import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import {
  Home,
  Calendar,
  GraduationCap,
  Settings,
  Menu,
  ChevronDown,
  LogOut,
  Bell,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
  avatar_url?: string | null;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message?: string;
  time?: string;
  link?: string;
}

interface Props {
  children: ReactNode;
}

export default function YouthLayout({ children }: Props) {
  const {
    user = { name: "", email: "", role: "", avatar_url: null },
    notifications = [],
  } = usePage<{
    user: User;
    notifications: NotificationItem[];
  }>().props;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // IDs of unread notifications (controls red dot)
  const [unreadIds, setUnreadIds] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const form = useForm({});
  const logout = () => form.post("/logout");

  const active = (href: string) => usePage().url.startsWith(href);

  const menuItems = [
    { label: "Home", icon: Home, href: "/youth/home" },
    { label: "SK Official", icon: Calendar, href: "/youth/official" },
    { label: "Projects", icon: Calendar, href: "/youth/projects" },
    { label: "Scholarships", icon: GraduationCap, href: "/youth/scholarships" },
    { label: "Settings", icon: Settings, href: "/youth/settings" },
  ];

  const STORAGE_KEY = "read_notifications";

  // Load read IDs from localStorage and compute unread on each notifications change
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY) ?? "[]"
          : "[]";

      const readIds: string[] = JSON.parse(raw);

      const unread = notifications
        .filter((n) => !readIds.includes(n.id))
        .map((n) => n.id);

      setUnreadIds(unread);
    } catch {
      setUnreadIds(notifications.map((n) => n.id));
    }
  }, [notifications]);

  const unreadCount = unreadIds.length;

  // Mark a single notification as read (when clicked)
  const handleNotificationClick = (id: string) => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY) ?? "[]"
          : "[]";

      const existing: string[] = JSON.parse(raw);
      const merged = Array.from(new Set([...existing, id]));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

      setUnreadIds((prev) => prev.filter((x) => x !== id));
    } catch {
      setUnreadIds((prev) => prev.filter((x) => x !== id));
    }

    // Just close dropdown, do not touch others
    setNotifOpen(false);
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY) ?? "[]"
          : "[]";

      const existing: string[] = JSON.parse(raw);
      const allIds = notifications.map((n) => n.id);
      const merged = Array.from(new Set([...existing, ...allIds]));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      setUnreadIds([]); // red dot = 0
    } catch {
      setUnreadIds([]);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-gradient-to-r from-blue-700 to-blue-800 text-white w-full shadow-md z-50 fixed top-0 left-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2">
          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-blue-900/30 lg:hidden flex-shrink-0"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* BRAND */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 justify-center lg:justify-start">
            <img
              src="/images/sk.png"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white shadow-sm flex-shrink-0"
            />
            <div className="hidden xs:block min-w-0">
              <p className="font-bold text-sm sm:text-lg leading-tight truncate">
                SK Youth Portal
              </p>
              <p className="text-[10px] sm:text-xs opacity-90 truncate">
                Sangguniang Kabataan System
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: NOTIFICATION + USER MENU */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* NOTIFICATION BELL */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className="p-2 rounded-full bg-blue-900/30 hover:bg-blue-900/40 transition relative"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />

                {/* 🔴 Red dot depends ONLY on unreadCount */}
                {unreadCount > 0 && (
                  <span
                    className="
                      absolute -top-1 -right-1
                      min-w-[18px] h-[18px]
                      px-1 rounded-full bg-red-500
                      text-[10px] text-white font-bold
                      flex items-center justify-center
                    "
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 max-w-[90vw] bg-white text-gray-700 shadow-xl rounded-xl border overflow-hidden z-50">
                  <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800">
                      Notifications
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {notifications.length}{" "}
                        {notifications.length === 1 ? "item" : "items"}
                      </span>
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllAsRead}
                          className="text-[11px] text-blue-600 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-4 text-sm text-gray-600">
                        No notifications.
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {notifications.map((n) => {
                          const isUnread = unreadIds.includes(n.id);

                          // If there is a link, we use <Link>; else plain <div>
                          if (n.link) {
                            return (
                              <li key={n.id}>
                                <Link
                                  href={n.link}
                                  onClick={() => handleNotificationClick(n.id)}
                                  className={`flex flex-col px-4 py-3 hover:bg-gray-50 transition ${
                                    isUnread ? "bg-blue-50/60" : ""
                                  }`}
                                >
                                  <span className="text-xs uppercase font-semibold text-blue-600">
                                    {n.type}
                                  </span>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {n.title}
                                  </span>
                                  {n.message && (
                                    <span className="text-xs text-gray-600 mt-1 line-clamp-2">
                                      {n.message}
                                    </span>
                                  )}
                                  {n.time && (
                                    <span className="text-[10px] text-gray-400 mt-1">
                                      {n.time}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            );
                          }

                          return (
                            <li key={n.id}>
                              <div
                                className={`flex flex-col px-4 py-3 hover:bg-gray-50 transition ${
                                  isUnread ? "bg-blue-50/60" : ""
                                }`}
                                onClick={() => handleNotificationClick(n.id)}
                              >
                                <span className="text-xs uppercase font-semibold text-blue-600">
                                  {n.type}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {n.title}
                                </span>
                                {n.message && (
                                  <span className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {n.message}
                                  </span>
                                )}
                                {n.time && (
                                  <span className="text-[10px] text-gray-400 mt-1">
                                    {n.time}
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* USER MENU DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 sm:gap-3 bg-blue-900/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-blue-900/40 transition"
              >
                {/* AVATAR */}
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 font-bold text-white shadow text-xs sm:text-sm">
                    {user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "U"}
                  </div>
                )}

                {/* NAME (hidden on very small screens) */}
                <div className="hidden sm:flex flex-col text-left leading-tight max-w-[140px]">
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {user?.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/70 truncate">
                    {user?.email}
                  </span>
                </div>

                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-white/90 hidden xs:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 max-w-[90vw] bg-white text-gray-700 shadow-xl rounded-xl border overflow-hidden">
                  {/* HEADER */}
                  <div className="px-4 py-4 border-b bg-gray-50 flex items-center gap-3">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "U"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user?.email}
                      </p>
                      <p className="text-[10px] text-blue-700 font-semibold uppercase mt-1 truncate">
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="flex gap-2 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 font-semibold text-sm"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* SPACER */}
      <div className="h-16 sm:h-20"></div>

      {/* LAYOUT BODY */}
      <div className="flex">
        {/* BACKDROP */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 lg:hidden z-40"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed lg:static top-16 sm:top-20 left-0
            h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)]
            w-64 sm:w-72 bg-white border-r shadow-xl z-40
            pt-4 sm:pt-6 overflow-y-auto
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col items-center text-center">
            <img
              src="/images/sk.png"
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow border"
            />
            <h2 className="font-bold text-base sm:text-lg mt-2 sm:mt-3 text-blue-700">
              SK Youth Portal
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500">
              Empowering Community Youth
            </p>
          </div>

          <div className="px-3 sm:px-4 space-y-1 sm:space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition
                  ${
                    active(item.href)
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-blue-100"
                  }
                `}
              >
                <item.icon className="w-4 h-4 sm:w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-3 sm:p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <footer className="bg-white border-t py-3 sm:py-4 text-center text-[11px] sm:text-sm text-gray-600">
        © {new Date().getFullYear()} SK Youth Portal • All Rights Reserved
      </footer>
    </div>
  );
}
