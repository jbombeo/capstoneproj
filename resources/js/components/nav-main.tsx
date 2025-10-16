import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const { url } = usePage();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  // Automatically open the dropdown if the current route matches a submenu
  useEffect(() => {
    const activeDropdown = items.find((item) =>
      item.children?.some((child) => url.startsWith(child.href ?? ""))
    );
    if (activeDropdown) setOpenDropdown(activeDropdown.title);
  }, [url, items]);

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            typeof item.href === "string" ? url.startsWith(item.href) : false;

          // Dropdown menu
          if (item.children && item.children.length > 0) {
            const isDropdownOpen = openDropdown === item.title;
            return (
              <SidebarMenuItem key={item.title}>
                <button
                  onClick={() => toggleDropdown(item.title)}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition ${
                    isDropdownOpen ? "bg-dark-400" : "hover:bg-green-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="pl-8 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const childActive = url.startsWith(child.href ?? "");
                      return (
                        <Link
                          key={child.title}
                          href={child.href ?? "#"}
                          className={`block px-3 py-1.5 text-sm rounded-md transition ${
                            childActive
                              ? "bg-dark-300 text-black font-bold"
                              : "hover:bg-green-400"
                          }`}
                        >
                          {child.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </SidebarMenuItem>
            );
          }

          // Regular link
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={{ children: item.title }}
              >
                <Link href={item.href ?? "#"} prefetch>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
