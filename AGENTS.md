# Project Instructions & Rules

> **IMPORTANT**: Before changing or creating any file in this repository, always review and strictly adhere to these rules.

## Core Rules

1. **Server-Side Rendering (SSR) & Next.js Architecture**:
   - Prefer SSR / Server Components for data fetching, SEO, and initial HTML generation where applicable.
   - Use Client Components (`"use client"`) only when interactivity, browser APIs, or React state are required.

2. **API Communication**:
   - All backend API requests must go through the centralized Axios interceptor instance in [`lib/axios.js`](file:///d:/project/frontend/drprimenew/lib/axios.js).
   - In client components, all data fetching, caching, and mutations must use TanStack Query (`@tanstack/react-query`).

3. **Form Handling & Validation**:
   - Forms must use `react-hook-form` and schema validation via `zod` and `@hookform/resolvers/zod`.

4. **Admin Portal Architecture**:
   - **State Management**: Use Zustand stores (`lib/store/useAdminStore.js`) for admin-side state (auth, tables, sidebar, modal states).
   - **Data Tables**: Use a common, reusable `DataTable` component across all admin views.
   - **API Dropdowns**: Use the `AsyncSelect` component for dynamic API-driven selections.

5. **Styling & UI**:
   - Use Tailwind CSS and shadcn/ui components (`components/ui/`) with design tokens in `app/globals.css`.
   - **UI Components Rule**: Always use UI components from `components/ui/` (`Input`, `Select`, `Label`, etc.) instead of raw native HTML inputs/selects. If a required component is missing, install/create it following shadcn/ui guidelines.
