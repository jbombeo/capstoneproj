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
  Home,           // modern dashboard icon
  Users,          // for officials and households
  UserCheck,      // residents
  MapPin,         // zone
  FileCheck,      // barangay clearance
  FileText,       // certificate of indigency
  ClipboardList,  // blotter records
  Folder,         // request document
  Users2,         // household record alternative
  CreditCard,     // barangay revenues
  CalendarDays,   // activity/event
  Activity        // log
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
  { title: 'Dashboard', href: dashboard(), icon: Home },
  { title: 'Barangay Official', href: '/officials', icon: Users },
  { title: 'Residents Record', href: '/residentregistereds', icon: UserCheck },
  { title: 'Zone', href: '/zones', icon: MapPin },
  { title: "Barangay Clearance", href: "/barangay-clearances", icon: FileCheck },
  { title: "Certificate of Indigency", href: "/certificate-indigenous", icon: FileText },
  { title: 'Blotter Records', href: '/blotters', icon: ClipboardList },
  { title: 'Request Document', href: '/documentrequests', icon: Folder },
  { title: 'Household Record', href: '/households', icon: Users2 },
  { title: 'Barangay Revenues', href: '/brgyrevenue', icon: CreditCard },
  { title: 'Activity/Event', href: '/activities', icon: CalendarDays },
  { title: 'Log', href: '/brgyrevenue', icon: Activity },
];

export function AppSidebar() {
  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="bg-green-600"
    >
      <SidebarHeader className="bg-green-600 flex flex-col items-center py-6">
        <Link href={dashboard()} prefetch>
          <AppLogo />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
