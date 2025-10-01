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
  { title: 'Home', href: dashboard(), icon: LayoutGrid },
  { title: 'ScholarShip', href: '/officials', icon: BookUser },
  { title: 'Youth Profile', href: '/residents', icon: BookOpen },
  { title: 'Program and Project', href: '/zones', icon: BookOpen },
  { title: 'Scholarship', href: '/brgycertificates', icon: ShieldCheck },
  { title: 'Financial management', href: '/certindigency', icon: BookUser },
  { title: 'Officials/SK Council', href: '/blotters', icon: BookUser },
  { title: 'Announcement and Events', href: '/document-requests', icon: Folder },
  { title: 'Reports', href: '/households', icon: BookUser },

];

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="bg-blue-600" // ✅ only background color changed
    >
      {/* Full Logo Section */}
      <SidebarHeader className="bg-blue-600 flex flex-col items-center py-6">
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
