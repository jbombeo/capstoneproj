import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import type { ComponentType } from "react";

export interface NavItem {
  title: string;
  href?: string;
  icon?: ComponentType<any>;
  isDropdown?: boolean;  // ✅ optional flag to mark dropdowns
  children?: NavItem[];  // ✅ allows nested dropdown submenus
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// declare module '@inertiajs/react' {
//   interface PageProps {
//     user: { id: number; name: string; email: string; role: string };
//     stats?: any;
//     youth?: any;
//     pending?: any;
//     projects?: any;
//     announcements?: any;
//   }
// }