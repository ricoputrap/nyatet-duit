# Dashboard Layout Module

This module contains the layout components for the Nyatet Duit application.

## Structure

```
_layout/
├── components/
│   ├── app-sidebar.tsx    # Server-rendered sidebar shell
│   ├── app-header.tsx     # Server-rendered header
│   ├── nav-menu.tsx       # Client component for interactive navigation
│   └── ...                # Future layout components
├── index.ts               # Barrel export for clean imports
└── README.md             # This file
```

## Components

### AppSidebar (Server Component)
The server-rendered sidebar shell containing:
- App logo and title (💸 Nyatet Duit)
- Static sidebar structure
- Delegates interactive navigation to `NavMenu` client component

### NavMenu (Client Component)
Interactive navigation menu with:
- Click-to-expand/collapse for menu items with sub-items
- Active state highlighting based on current pathname
- State management for expanded menus
- Navigation items:
  - Transactions (with sub-items: Expenses, Income, Savings, Transfer)
  - Budgets (with sub-items: Categories, Budgets)
  - Wallets
  - Savings
  - Dashboard

### AppHeader (Server Component)
The server-rendered header bar containing:
- Sidebar toggle button (client-interactive via shadcn component)
- App title
- (Future: User menu, notifications, theme toggle)

## Partial Prerendering (PPR)

This layout is optimized for Next.js Partial Prerendering:

### Server-Rendered (Static)
- ✅ Sidebar shell structure
- ✅ Header layout
- ✅ Navigation item structure
- ✅ App branding

### Client-Rendered (Dynamic)
- 🔄 Menu expand/collapse state (`NavMenu`)
- 🔄 Active route highlighting
- 🔄 Sidebar toggle interaction (`SidebarTrigger`)

### Benefits
1. **Faster Initial Load**: Static shell renders instantly
2. **SEO Friendly**: Navigation structure is in HTML
3. **Better Performance**: Only interactive parts hydrate on client
4. **Streaming**: Client components can stream in progressively

## Configuration

PPR (Partial Prerendering) is enabled in `next.config.ts`:
```ts
export default {
  cacheComponents: true, // Enables Partial Prerendering
};
```

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

