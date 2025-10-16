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
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Manage Scholarships', href: '/scholarships', icon: BookUser },
    { title: 'Youth Profiles', href: '/youth', icon: BookOpen },
    { title: 'Programs & Projects', href: '/projects', icon: BookOpen },
    { title: 'Announcements & Events', href: '/announcements', icon: Folder },
    { title: 'Reports', href: '/reports', icon: ShieldCheck },
    { title: 'Financial Management', href: '/financial', icon: BookUser },
    { title: 'SK Council / Officials', href: '/officials', icon: BookUser },

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
