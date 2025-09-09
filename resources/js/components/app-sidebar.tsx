import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
  BookOpen,
  Folder,
  LayoutGrid,
  BookUser,
  ShieldCheck,
} from 'lucide-react';
import AppLogo from './app-logo'; // ✅ custom logo

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
  { title: 'Barangay Official', href: '/officials', icon: BookUser },
  { title: 'Residents Record', href: '/residents', icon: BookOpen },
  { title: 'Zone', href: '/zones', icon: BookOpen },
  { title: 'Barangay Certificates', href: '/brgycertificates', icon: ShieldCheck },
  { title: 'Certificate of Indigency', href: '/certindigency', icon: BookUser },
  { title: 'Blotter Records', href: '/blotters', icon: BookUser },
  { title: 'Request Document', href: '/requestdoc', icon: Folder },
  { title: 'Household Record', href: '/household', icon: BookUser },
  { title: 'Barangay Revenues', href: '/brgyrevenue', icon: BookUser },
];

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="bg-green-600" // ✅ only background color changed
    >
      {/* Full Logo Section */}
      <SidebarHeader className="bg-green-600 flex flex-col items-center py-6">
        <Link href={dashboard()} prefetch>
          <AppLogo /> {/* full-sized logo */}
        </Link>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      {/* User Section */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
