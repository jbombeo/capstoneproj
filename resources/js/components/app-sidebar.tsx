import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import { type NavItem } from "@/types";
import { Link } from "@inertiajs/react";
import {
  Home,
  Users,
  UserCheck,
  MapPin,
  FileCheck,
  FileText,
  ClipboardList,
  Folder,
  Users2,
  CreditCard,
  CalendarDays,
  Activity,
  Settings,
  ChevronRight,
  Inbox
} from "lucide-react";
import AppLogo from "./app-logo";

// ✅ Make sure all route helpers are converted to string
const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Dashboard",
items: [{ title: "Dashboard", href: dashboard().url, icon: Home }],

  },
  {
    label: "Management",
    items: [
      { title: "Barangay Officials", href: "/officials", icon: Users },
      { title: "Residents Record", href: "/residentregistereds", icon: UserCheck },
      { title: "Household Record", href: "/households", icon: Users2 },
      { title: "Zone", href: "/zones", icon: MapPin },
      { title: "Feedback", href: "/feedback", icon: Inbox },
    ],
  },
  {
    label: "Documents",
    items: [
      // ✅ Dropdown menu for Certificate of Indigency
      { title: "Request Document", href: "/documentrequests", icon: Folder },
      {
        title: "Certificates",
        icon: FileText,
        isDropdown: true,
        children: [
          { title: "Barangay Clearance", href: "/barangay-clearances" },
          { title: "Certificate of Indigency", href: "/certificate-indigency" },
          { title: "Certificate of Good Moral", href: "/certificate-goodmoral" },
          { title: "Certificate of Residency", href: "/certificate-residency" },

        ],
      },
      { title: "Blotter Records", href: "/blotters", icon: ClipboardList },
    ],
  },
  {
    label: "Sanguniang Kabataan",
    items: [
      { title: "Scholar", href: "/scholarships", icon: Folder },
      // {
      //   title: "Certificates",
      //   icon: FileText,
      //   isDropdown: true,
      //   children: [
      //     { title: "Barangay Clearance", href: "/barangay-clearances" },
      //     { title: "Certificate of Indigency", href: "/certificate-indigency" },
      //     { title: "Certificate of Good Moral", href: "/certificate-goodmoral" },
      //     { title: "Certificate of Residency", href: "/certificate-residency" },
      //   ],
      // },
    ],
  },
  
  {
    label: "Finance & Services",
    items: [
      { title: "Reports", href: "/report/revenues", icon: CreditCard },
      { title: "Settings", href: "/services", icon: Settings },
      { title: "Hotline", href: "/hotlines", icon: ClipboardList },
    ],
  },
  {
    label: "Events",
    items: [
      { title: "Activity/Event", href: "/activities", icon: CalendarDays },
      // { title: "Log", href: "/logs", icon: Activity },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-green-600 text-dark">
      {/* Logo Section */}
      <SidebarHeader className="bg-green-600 flex flex-col items-center py-6">
        <Link href={String(dashboard())} prefetch>
          <AppLogo />
        </Link>
      </SidebarHeader>

      {/* Sidebar Menu Groups */}
      <SidebarContent className="space-y-2">
        {navGroups.map((group) => (
          <div key={group.label}>
            {/* Group Label */}
            <p className="px-4 py-1 text-xs font-semibold uppercase text-green-800 tracking-wide">
              {group.label}
            </p>

            {/* Menu Items */}
            <div className="pl-2 space-y-1">
              <NavMain items={group.items} />
            </div>
          </div>
        ))}
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
