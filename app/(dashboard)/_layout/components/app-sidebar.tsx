"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  RepeatIcon,
  WalletIcon,
  PiggyBankIcon,
  LayoutDashboardIcon,
  Banknote,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: {
    title: string;
    url: string;
  }[];
};

const navItems: NavItem[] = [
  {
    title: "Transactions",
    url: "/transactions",
    icon: RepeatIcon,
    items: [
      { title: "Expenses", url: "/transactions/expenses" },
      { title: "Income", url: "/transactions/income" },
      { title: "Savings", url: "/transactions/savings" },
      { title: "Transfer", url: "/transactions/transfer" },
    ],
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: Banknote,
    items: [
      { title: "Categories", url: "/budgets/categories" },
      { title: "Budgets", url: "/budgets/list" },
    ],
  },
  {
    title: "Wallets",
    url: "/wallets",
    icon: WalletIcon,
  },
  {
    title: "Savings",
    url: "/savings",
    icon: PiggyBankIcon,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});

  const toggleOpen = (url: string) => {
    setOpenMap((s) => ({ ...s, [url]: !s[url] }));
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl">💸</div>
          <h1 className="text-lg font-semibold">Nyatet Duit</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const activeByPath = pathname.startsWith(item.url);
                const isOpen = !!openMap[item.url] || activeByPath;

                return (
                  <SidebarMenuItem key={item.title}>
                    {item.items ? (
                      <>
                        {/* For items with children, toggle expand/collapse instead of navigating */}
                        <SidebarMenuButton
                          isActive={activeByPath}
                          tooltip={item.title}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleOpen(item.url);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                        </SidebarMenuButton>

                        {isOpen && (
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.url}
                        tooltip={item.title}
                      >
                        <a href={item.url}>
                          <Icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
