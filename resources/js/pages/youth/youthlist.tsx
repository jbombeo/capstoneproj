import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import {
  Home, Calendar, GraduationCap, Settings,
  Menu, ChevronDown, LogOut,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
  avatar_url?: string | null;
}

interface Props {
  children: ReactNode;
}

export default function YouthLayout({ children }: Props) {
  const { user = { name: "", email: "", role: "", avatar_url: null } } =
    usePage<{ user: User }>().props;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-gradient-to-r from-blue-700 to-blue-800 text-white w-full shadow-md z-50 fixed top-0 left-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-blue-900/30 lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* BRAND */}
          <div className="flex items-center gap-3">
            <img
              src="/images/sk.png"
              className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
            />
            <div className="hidden sm:block">
              <p className="font-bold text-lg leading-tight">SK Youth Portal</p>
              <p className="text-xs opacity-90">Sangguniang Kabataan System</p>
            </div>
          </div>

          {/* USER MENU ONLY (Bell removed) */}
          <div className="flex items-center gap-4">

            {/* USER MENU DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 bg-blue-900/30 px-4 py-2 rounded-full hover:bg-blue-900/40 transition"
              >
                {/* AVATAR */}
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 font-bold text-white shadow">
                    {user?.name
                      ? user.name.split(" ").map((n) => n[0]).join("")
                      : "U"}
                  </div>
                )}

                {/* NAME */}
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-sm font-bold text-white">
                    {user?.name}
                  </span>
                  <span className="text-xs text-white/70">
                    {user?.email}
                  </span>
                </div>

                <ChevronDown className="w-4 h-4 text-white/90" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-700 shadow-xl rounded-xl border overflow-hidden">
                  {/* HEADER */}
                  <div className="px-4 py-4 border-b bg-gray-50 flex items-center gap-3">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                        {user?.name
                          ? user.name.split(" ").map((n) => n[0]).join("")
                          : "U"}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                      <p className="text-[10px] text-blue-700 font-semibold uppercase mt-1">
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    className="flex gap-2 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 font-semibold"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* SPACER */}
      <div className="h-20"></div>

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
            fixed lg:static top-20 left-0
            h-[calc(100vh-80px)]
            w-72 bg-white border-r shadow-xl z-40
            pt-6 overflow-y-auto
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="px-6 pb-6 flex flex-col items-center text-center">
            <img src="/images/sk.png" className="h-20 w-20 rounded-full shadow border" />
            <h2 className="font-bold text-lg mt-3 text-blue-700">SK Youth Portal</h2>
            <p className="text-xs text-gray-500">Empowering Community Youth</p>
          </div>

          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-sm transition
                  ${active(item.href)
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-100"}
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      <footer className="bg-white border-t py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} SK Youth Portal • All Rights Reserved
      </footer>
    </div>
  );
}
