# Project Development & Architecture Rules

Before changing or creating any file in this project, you MUST refer to and strictly adhere to the following rules:

---

## 1. Server-Side Rendering (SSR) & Next.js Architecture
- Utilize Next.js SSR / Server Components for data fetching, SEO, and initial HTML generation wherever applicable.
- Client components (`"use client"`) must only be used when browser APIs, state hooks (`useState`, `useEffect`), form handling, or interactivity are needed.
- Keep layout and static content server-rendered for maximum performance and SEO.

---

## 2. API Communication
- **Axios Interceptor**: All HTTP requests must use the centralized Axios client configured in [`@/lib/axios`](file:///d:/project/frontend/drprimenew/lib/axios.js).
- **TanStack Query**: All API data fetching, caching, mutations, and query invalidation in client components must be performed using TanStack Query (`useQuery`, `useMutation`, `useQueryClient`).
- Do not make raw `fetch` calls directly inside components when interacting with backend API endpoints.

---

## 3. Form Handling & Validation
- **React Hook Form**: All forms must be built and controlled using `react-hook-form` (`useForm`, `Controller`).
- **Zod Schema Validation**: All form validations must declare explicit Zod schemas using `zod` and connect via `@hookform/resolvers/zod`.
- Error messages must be clean, accessible, and tied directly to form fields.

---

## 4. Admin Portal Architecture & Components
- **Common DataTable Component**: In the admin section, all tabular data must utilize a unified, reusable `DataTable` component supporting pagination, sorting, search, and row selection.
- **AsyncSelect Component**: For any dropdowns that consume API data (e.g. searching, selecting dynamic resources), use the centralized `AsyncSelect` component.
- **State Management (Zustand)**: Admin-side state management (authentication, sidebar navigation, table pagination/filter states, active modals) must be managed using Zustand stores located in [`@/lib/store`](file:///d:/project/frontend/drprimenew/lib/store).

---

## 5. Styling & UI Consistency
- Use Tailwind CSS and shadcn/ui components (`@/components/ui/`) for UI development.
- Maintain consistent design tokens and utility patterns across user-facing and admin pages.
