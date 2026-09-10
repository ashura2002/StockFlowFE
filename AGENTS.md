# Project Rules

## Commands
- `npm run build` → `tsc -b && vite build` (typecheck + prod build).
- `npm run lint` → `eslint .`
- No test runner. **Zero-error policy**: `npm run build` and `npm run lint` must both pass clean before a task is done. `tsconfig.app.json` sets `noUnusedLocals`/`noUnusedParameters`, so unused imports/vars fail the build itself.

## Project Structure & Stack
- Vite + React 19 + TypeScript strict + Tailwind v4 + Axios + React Router 7. No Redux/Zustand; use React context/state.
- `src/` is a **flat feature-based** layout (`pages/`, `components/`, `hooks/`, `services/`, `types/`, `utils/`, `context/`, `app/`), NOT one folder per feature. Shared UI lives in `components/ui/` and `components/shared/`.
- The API contract is the source of truth: **`Docs/openapi.json`**. Every new section is analyzed against it and a plan is proposed/approved before building (existing workflow).
- **Service architecture:** each feature has a real service (`services/*.service.ts` hitting the shared axios instance from `services/api.ts`, which injects the Bearer token) and a mock (`services/*.mock.ts`, in-memory with a simulated `~200ms` delay). A hook (`hooks/useX.ts`) pulls data and pages call the hook. **Hooks currently call the mock services**, not the real ones.
- Enums: `tsconfig` `erasableSyntaxOnly` forbids TS `enum`. Use `as const` objects + derived type (see `types/auth.ts` `Role`, `types/orders.ts` `OrderStatus`). Do not introduce `any`; define precise types.

## TypeScript / Lint gotchas (react-hooks rules)
- Calling `setState` directly inside `useEffect` triggers `react-hooks/set-state-in-effect`. The only pattern that passes lint for initial data fetch is:
  ```tsx
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])
  ```
- Reset form/modal state via a **`key`-based remount** (`<XForm key={id} ... />`) rather than refetching in effects.
- Detail drawers use a `modal open` gate + an inner body component keyed by id: `function DrawerBody({ id })`. This avoids effects that mutate state while also satisfying the hooks rules.
- `useRef` read during render → `react-hooks/refs`; reassigning a module-level variable during render → `react-hooks/globals`. Avoid both.

## API contract quirks (match exactly)
- All IDs are UUID **strings**.
- `Role`: `1 = Admin`, `2 = Customer`. `OrderStatus`: `1 = Pending, 2 = Confirmed, 3 = Completed, 4 = Cancelled`.
- Pagination uses PascalCase query params `Page` / `PageSize` (see `types/pagination.ts`).
- Field-name inconsistencies in the contract: `UserWithProfileResponse` has the **`fistName` typo** (keep it), `dateOfBirth` is NOT updatable (create-only), `PhoneNumber` differs across list/detail, and product/category `description` field names differ between list and detail/create/update. Mirror the exact names from `openapi.json`.
- Login (`POST /Auth/login`) returns only `{ message, accessToken }`; the profile is then fetched from `GET /Profiles/my-profile`.

## Routing / auth
- APP routes live in `src/app/routes.tsx` with role-based guards active: `<ProtectedRoute>` wraps all app routes and `<RequireRole role={Role.Admin}>`/`<RequireRole role={Role.Customer}>` split the admin (`/admin/*`) and customer (`/shop/*`) trees. `LoginPage` and `HomeRedirect` route users by `user.role` (see `src/utils/navigation.ts`). Route wrappers and comments must stay syntactically valid during a build.

## Responsive Design
- **Mobile-first, always.** Write base styles for small screens (~360px) first; only layer `sm:`/`md:`/`lg:`/`xl:` variants on top.
- Grids must start with a mobile base column count (e.g. `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`); never a bare `grid-cols-2`+ for content that can overflow.
- Layouts must stack on mobile and widen on larger screens — `flex flex-col gap-* lg:flex-row`.
- Use relative/fluid units and Flexbox/Grid; avoid fixed `px` widths on elements (static sizes only via `*:w-…`/`md:w-…`).
- Truncate/ellipsis long strings (names, ids, emails) inside flexible containers (`min-w-0`, `truncate`).
- Test the mental model at ~360px: full-width CTAs, wrapping chips/tabs, no horizontal scroll.
