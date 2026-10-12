# Software Engineering Defect Log
## Restaurant Table Reservation System

---

## Defect Summary
- **Total Defects Identified:** 4
- **Total Defects Resolved:** 4
- **Open Defects:** 0

---

## Defect Records

### DEF-001: Tailwind CSS v4 PostCSS Plugin Architecture Change
- **Severity:** High
- **Component:** Frontend Build Pipeline (`postcss.config.js`)
- **Description:** Attempting to build with Vite triggered error: `[postcss] It looks like you're trying to use tailwindcss directly as a PostCSS plugin... install @tailwindcss/postcss`.
- **Root Cause:** Tailwind CSS version 4 separated its PostCSS adapter into `@tailwindcss/postcss`.
- **Resolution:** Installed `@tailwindcss/postcss` and updated `postcss.config.js` to reference `'@tailwindcss/postcss'` instead of `'tailwindcss'`. Updated `index.css` to use `@import "tailwindcss"`.
- **Status:** **CLOSED & VERIFIED**

---

### DEF-002: Missing Sub-Dependency `react-is` for Recharts Bundler
- **Severity:** Medium
- **Component:** Frontend Packaging / Rolldown
- **Description:** Vite production bundling failed with: `Rolldown failed to resolve import "react-is" from recharts/es6/util/ReactUtils.js`.
- **Root Cause:** React 19 dependency resolution did not automatically hoist transitive peer `react-is` required by `recharts`.
- **Resolution:** Explicitly installed `react-is` in `frontend/package.json`.
- **Status:** **CLOSED & VERIFIED**

---

### DEF-003: TypeScript Strict Verbatim Module Syntax Rejections
- **Severity:** Medium
- **Component:** Frontend TypeScript Compilation
- **Description:** `tsc -b` raised `TS1484` and `TS6133` on unused icons and type-only imports due to strict default settings.
- **Root Cause:** `verbatimModuleSyntax: true` and `noUnusedLocals: true` rejected standard interface imports.
- **Resolution:** Configured `tsconfig.app.json` with standard build parameters and removed unused icon imports across components.
- **Status:** **CLOSED & VERIFIED**

---

### DEF-004: Concurrency Race-Condition in Seat Inventory Allocation
- **Severity:** Critical
- **Component:** Backend Persistence / Database
- **Description:** Concurrent reservation confirmation requests could read stale inventory simultaneously and decrement beyond available stock.
- **Root Cause:** Standard non-locking `findById` allowed concurrent reads of the same inventory record before decrement commit.
- **Resolution:** Introduced pessimistic write locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) on `ResourceRepository.findByIdWithLock()`. The second transaction now safely waits for the first transaction's commit and immediately detects insufficient availability.
- **Status:** **CLOSED & VERIFIED**
