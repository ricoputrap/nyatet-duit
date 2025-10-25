# Dashboard Layout Module

This module contains the layout components for the Nyatet Duit application.

## Structure

```
_layout/
├── components/
│   ├── app-sidebar.tsx    # Main sidebar navigation component
│   ├── app-header.tsx     # Header with sidebar toggle and app title
│   └── ...                # Future layout components (user menu, notifications, etc.)
├── index.ts               # Barrel export for clean imports
└── README.md             # This file
```

## Components

### AppSidebar
The main navigation sidebar containing:
- App logo and title (💸 Nyatet Duit)
- Navigation menu items:
  - Transactions (with sub-items: Expenses, Income, Savings, Transfer)
  - Budgets (with sub-items: Categories, Budgets)
  - Wallets
  - Savings
  - Dashboard

### AppHeader
The top header bar containing:
- Sidebar toggle button
- App title
- (Future: User menu, notifications, theme toggle)

## Usage

The layout components are used in the dashboard layout:

```tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar, AppHeader } from "./_layout";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

## Future Enhancements
- User authentication menu
- Notification system
- Theme toggle (light/dark mode)
- Quick actions menu
- Search functionality
