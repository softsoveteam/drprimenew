# Development & Implementation Log

This log documents all setups, library installations, architectural configurations, and system changes made to the project.

---

## [2026-09-15] - Initial Project Foundation & Tooling Setup

### 1. Environment & API Configuration
- **Updated `.env`**:
  - `NEXT_PUBLIC_API_URL=http://192.168.1.61:8002/api`
  - `NEXT_PUBLIC_MEDIA_URL=http://192.168.1.61:8002/media`
  - Removed duplicate and redundant environment variables.

### 2. HTTP Client & API Interceptor Setup
- **Installed `axios`**:
  - Created [`lib/axios.js`](file:///d:/project/frontend/drprimenew/lib/axios.js) configured with centralized base URL (`NEXT_PUBLIC_API_BASE_URL`).
  - Implemented **Request Interceptor**: Auto-attaches bearer tokens (`token`, `auth_token`, `admin_token`) from `localStorage` if present.
  - Implemented **Response Interceptor**: Unwraps `response.data`, auto-handles `401 Unauthorized` token clears, and extracts structured error messages.

### 3. TanStack Query (React Query) Setup
- **Installed `@tanstack/react-query`**:
  - Created [`components/QueryProvider.js`](file:///d:/project/frontend/drprimenew/components/QueryProvider.js) configured with optimal stale times, gc times, and retry strategies.
  - Integrated `QueryProvider` into the root [`app/layout.js`](file:///d:/project/frontend/drprimenew/app/layout.js) to wrap the entire application.

### 4. Tailwind CSS & shadcn/ui Setup
- **Installed Styling Engine & Utilities**:
  - `tailwindcss@^3.4.17`, `postcss`, `autoprefixer`, `tailwindcss-animate`
  - `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `@radix-ui/react-slot`
- **Configured Files**:
  - [`tailwind.config.js`](file:///d:/project/frontend/drprimenew/tailwind.config.js) with container queries, animation keyframes, and full HSL variable color palette.
  - [`postcss.config.mjs`](file:///d:/project/frontend/drprimenew/postcss.config.mjs).
  - [`components.json`](file:///d:/project/frontend/drprimenew/components.json) for shadcn CLI and component registry paths.
  - [`lib/utils.js`](file:///d:/project/frontend/drprimenew/lib/utils.js) with `cn` helper.
  - [`app/globals.css`](file:///d:/project/frontend/drprimenew/app/globals.css) with CSS variables for light and dark themes.
  - Imported `globals.css` in [`app/layout.js`](file:///d:/project/frontend/drprimenew/app/layout.js).
  - Added initial UI component [`components/ui/button.jsx`](file:///d:/project/frontend/drprimenew/components/ui/button.jsx).

### 5. State Management Setup (Zustand)
- **Installed `zustand`**:
  - Created [`lib/store/useAdminStore.js`](file:///d:/project/frontend/drprimenew/lib/store/useAdminStore.js) for admin-side state management.
  - Supported features:
    - Admin authentication (`admin`, `token`, `isAuthenticated`, `setAuth`, `logout`) with localStorage persistence.
    - Sidebar navigation toggle state (`isSidebarOpen`, `toggleSidebar`).
    - Common DataTable state management (`page`, `pageSize`, `searchQuery`, `selectedRows`, `filters`, `sorting`).
  - Created [`lib/store/index.js`](file:///d:/project/frontend/drprimenew/lib/store/index.js) export module.

### 6. Form Handling & Validation Tooling
- **Installed `react-hook-form`, `zod`, and `@hookform/resolvers`**:
  - Prepared form validation architecture combining React Hook Form with Zod schemas.

### 7. Governance & Architectural Rules Setup
- **Created Rules**:
  - [`.agents/rules/project_rules.md`](file:///d:/project/frontend/drprimenew/.agents/rules/project_rules.md)
  - [`AGENTS.md`](file:///d:/project/frontend/drprimenew/AGENTS.md)
- **Mandatory Development Rules Established**:
  1. Use SSR / Server Components where applicable for SEO and initial data load.
  2. API calls must strictly use the Axios interceptor and TanStack Query.
  3. Form validation must strictly use React Hook Form and Zod.
  4. Admin portal must use a common `DataTable` component and `AsyncSelect` for API dropdowns.
  5. Admin portal state management must strictly use Zustand.

---

## [2026-09-15] - Admin Route (/auth-cp/*), Authentication & Control Panel Layout

### 1. Admin Routing Setup
- **Entry Route**: [`app/auth-cp/page.jsx`](file:///d:/project/frontend/drprimenew/app/auth-cp/page.jsx)
  - Inspects user session / tokens.
  - Automatically redirects authenticated admins to `/auth-cp/dashboard`.
  - Automatically redirects unauthenticated users to `/auth-cp/login`.

### 2. Admin Authentication (Login & Logout)
- **Login Page**: [`app/auth-cp/login/page.jsx`](file:///d:/project/frontend/drprimenew/app/auth-cp/login/page.jsx)
  - Updated to light background (`bg-slate-50`) with dark typography (`text-slate-900`, `text-slate-700`).
  - Crisp white card styling (`bg-white/90`) with soft drop shadows and clean input borders.
  - Form validation with `react-hook-form` and `zod`.
  - TanStack Query `useMutation` calling `POST /admin/login` via [`lib/axios.js`](file:///d:/project/frontend/drprimenew/lib/axios.js).
  - Updates Zustand `useAdminStore` with returned `user` and `token` on success and redirects to target URL.
  - Interactive password visibility toggling and error alerts.
- **Logout Action**: Integrated in [`components/admin/AdminHeader.jsx`](file:///d:/project/frontend/drprimenew/components/admin/AdminHeader.jsx) using TanStack `useMutation` calling `POST /admin/logout` and clearing session state.

### 3. Public Store Navbar Isolation
- Created [`components/PublicLayoutWrapper.jsx`](file:///d:/project/frontend/drprimenew/components/PublicLayoutWrapper.jsx) to ensure the public store's Header, Footer, StickyBuyButton, and Preloader are completely hidden on all `/auth-cp/*` admin routes.

### 4. Protected Layout & Navigation
- **Auth Guard**: [`components/admin/AdminGuard.jsx`](file:///d:/project/frontend/drprimenew/components/admin/AdminGuard.jsx) ensures all subroutes under `/auth-cp/*` (except login) require valid authentication.
- **Admin Sidebar**: [`components/admin/AdminSidebar.jsx`](file:///d:/project/frontend/drprimenew/components/admin/AdminSidebar.jsx) with navigation links for Dashboard, Articles, Categories, Inquiries, Media, and Settings.
- **Admin Header**: [`components/admin/AdminHeader.jsx`](file:///d:/project/frontend/drprimenew/components/admin/AdminHeader.jsx) with sidebar toggle, page title, admin user profile badge, and logout dropdown.
- **Admin Layout**: [`app/auth-cp/layout.jsx`](file:///d:/project/frontend/drprimenew/app/auth-cp/layout.jsx) orchestrating guard, sidebar, header, and content views.

### 5. Admin Dashboard
- **Dashboard Page**: [`app/auth-cp/dashboard/page.jsx`](file:///d:/project/frontend/drprimenew/app/auth-cp/dashboard/page.jsx)
  - Admin welcome banner with dynamic session status.
  - Key metric overview cards (Published Articles, Taxonomy Categories, Customer Inquiries, Media Assets).
  - Quick action shortcuts and system status monitor.

### 6. UI Components Added (`.jsx`)
- [`components/ui/input.jsx`](file:///d:/project/frontend/drprimenew/components/ui/input.jsx)
- [`components/ui/label.jsx`](file:///d:/project/frontend/drprimenew/components/ui/label.jsx)
- [`components/ui/card.jsx`](file:///d:/project/frontend/drprimenew/components/ui/card.jsx)
- [`components/ui/badge.jsx`](file:///d:/project/frontend/drprimenew/components/ui/badge.jsx)
- [`components/ui/button.jsx`](file:///d:/project/frontend/drprimenew/components/ui/button.jsx)

### 8. Common Admin DataTable & AsyncSelect Components
- **Table Primitives**: [`components/ui/table.jsx`](file:///d:/project/frontend/drprimenew/components/ui/table.jsx)
  - Created base primitives: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`.
- **Common DataTable Component**: [`components/admin/DataTable.jsx`](file:///d:/project/frontend/drprimenew/components/admin/DataTable.jsx)
  - Ported from `task_management_frontend` with full pagination, page size changer, direct "Go to page", debounced search input, refetch cooldown timer with animated spinner, and automatic serial number offset calculation.
- **Dynamic AsyncSelect Component**: [`components/ui/async-select.jsx`](file:///d:/project/frontend/drprimenew/components/ui/async-select.jsx)
  - Ported from `task_management_frontend` supporting infinite scrolling, debounced query search, single & multi-select chip tags, select-all/clear-all shortcuts, `creatable` custom option additions, and portal dropdown positioning.
- **Admin Layout & Navigation Overhaul**:
  - [`components/admin/AdminSidebar.jsx`](file:///d:/project/frontend/drprimenew/components/admin/AdminSidebar.jsx): Grouped navigation sections, active state indicators, and responsive collapse.
  - [`components/admin/AdminHeader.jsx`](file:///d:/project/frontend/drprimenew/components/admin/AdminHeader.jsx): Dynamic breadcrumb trails, live user profile badge, and logout actions.
  - [`app/auth-cp/dashboard/page.jsx`](file:///d:/project/frontend/drprimenew/app/auth-cp/dashboard/page.jsx): Integrated interactive demonstrations of both `DataTable` and `AsyncSelect`.

