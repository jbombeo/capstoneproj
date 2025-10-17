import { useState, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import {
  Home,
  User,
  ShieldCheck,
  FileText,
  Menu,
  X,
  LogOut,
  Settings,
  Lock,
} from "lucide-react";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transition } from "@headlessui/react";

export default function ResidentSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { post, data, setData, put, processing, errors, recentlySuccessful } =
    useForm({
      current_password: "",
      password: "",
      password_confirmation: "",
    });

  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const handleLogout = () => post("/logout");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put("/settings/password", {
      preserveScroll: true,
      onError: (errs) => {
        if (errs.password) passwordInput.current?.focus();
        if (errs.current_password) currentPasswordInput.current?.focus();
      },
    });
  };

  const menu = [
    { name: "Home", icon: Home, href: "/resident/home" },
    { name: "Profile", icon: User, href: "/resident/profile" },
    { name: "Barangay Official", icon: ShieldCheck, href: "/resident/officials" },
    { name: "Request Document", icon: FileText, href: "/resident/document-requests" },
    { name: "Settings", icon: Settings, href: "/resident/settings" },
  ];

  return (
    <>
      <Head title="Change Password" />
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed inset-0 z-40 lg:static lg:w-80 bg-gradient-to-b from-blue-900 to-blue-800 shadow-2xl flex flex-col transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Logo & Header */}
          <div className="p-8 border-b border-blue-700 flex flex-col items-center relative">
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
                className="w-20 h-20 object-contain rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-white text-center">
              Barangay Portal
            </h1>
          </div>

          {/* Navigation */}
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

          {/* Logout */}
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

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 lg:p-12 text-white shadow-lg flex justify-between items-center">
            <h2 className="text-3xl font-bold">Change Password</h2>
            <button
              className="lg:hidden text-white bg-blue-700/50 p-2 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>

          {/* Form Section */}
          <div className="max-w-3xl mx-auto p-6 lg:p-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <form onSubmit={submit} className="space-y-6">
                {/* Current Password */}
                <div className="grid gap-2">
                  <Label htmlFor="current_password">Current password</Label>
                  <Input
                    id="current_password"
                    ref={currentPasswordInput}
                    name="current_password"
                    type="password"
                    value={data.current_password}
                    onChange={(e) => setData("current_password", e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter current password"
                  />
                  <InputError message={errors.current_password} />
                </div>

                {/* New Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    ref={passwordInput}
                    name="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    autoComplete="new-password"
                    placeholder="Enter new password"
                  />
                  <InputError message={errors.password} />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
                  <Label htmlFor="password_confirmation">
                    Confirm new password
                  </Label>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                      setData("password_confirmation", e.target.value)
                    }
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                  />
                  <InputError message={errors.password_confirmation} />
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4">
                  <Button disabled={processing}>Save password</Button>
                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-green-600">
                      Password updated successfully
                    </p>
                  </Transition>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
