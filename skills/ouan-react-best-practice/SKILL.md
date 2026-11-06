---
name: ouan-react-best-practice
description: Team React standard that merges our feature-based folder structure, DO/DON'T rules (codes S1-S11, R1-R14, security X1-X8), a tested ESLint + CI setup, and Vercel's 70 React/Next.js performance rules. Use whenever writing, reviewing, refactoring or scaffolding React, Next.js or Vite code — new components, pages, hooks, features, folder layout, imports, data fetching, bundle size, re-renders, ESLint setup, pre-commit hooks, npm audit, XSS or secrets in env, or code review against team rules — even if the user does not mention "best practices". Lint is the primary authority: write lint-clean code first, and after every code change run lint + npm audit and fix until both pass. Also use for Thai requests such as "เขียน component", "รีวิวโค้ด React", "จัดโครงสร้างโปรเจกต์", "สร้าง feature ใหม่", "ตั้ง lint", "ตั้ง pre-commit", "เช็คช่องโหว่".
license: MIT (Vercel rules) + team docs
metadata:
  version: "1.1.0"
  sources: "Fireship '10 React Antipatterns', Web Dev Simplified 'React Folder Structure', vercel-labs/agent-skills react-best-practices"
---

# Ouan React Best Practice

This skill combines two layers:

1. **Team standard** — where code lives and how it is written. Folder structure, import direction, and the DO/DON'T rules with codes `S1`–`S11` (structure), `R1`–`R14` (React) and `X1`–`X8` (security). Ready-to-copy `assets/eslint.config.js` and `assets/ci.yml` enforce most of them automatically. Source: `references/code-structure.md`, `references/do.md`, `references/dont.md` (written in Thai).
2. **Vercel performance rules** — 70 rules in 8 categories, prioritized by impact (`async-`, `bundle-`, `server-`, `client-`, `rerender-`, `rendering-`, `js-`, `advanced-`). One file per rule in `rules/`, full compiled guide in `references/vercel-AGENTS.md`.

The team standard decides **structure**; Vercel rules decide **performance**. Where both speak to the same thing, follow the resolutions in "Conflicts and overlaps" below.

**Lint outranks both.** The project's ESLint config is the final word on how code is written. If a team rule, a Vercel rule or a habit would produce code the linter flags, write it the way the linter accepts. See "Lint first" below.

## Non-negotiable: lint + vulnerability check after every change

These rules apply to every task that edits code, whatever its size, including one-line fixes:

1. **Make sure a pre-commit hook exists.** If the project has no hook that runs lint and `npm audit`, set one up before or alongside the first change (see "Pre-commit hook" below). If a hook exists but skips either check, add the missing one.
2. **After every code edit, run both gates yourself.** Don't wait for the commit:

   ```bash
   npm run lint -- --max-warnings=0
   npm audit --audit-level=high --omit=dev
   ```

   Use the project's own script names if they differ, for example `npm run audit`. With several edits in one task, run the gates after the batch and again before you report the work as done.
3. **If either gate fails, fix it and run it again until it passes.** Never finish a task with a failing gate.
   - Lint: fix the code itself. Don't add `eslint-disable`, don't turn the rule off, don't raise `--max-warnings`, don't add files to `ignores`. A disable is acceptable only when the rule is provably wrong for that line: it needs a comment saying why, and you must tell the user.
   - Audit: run `npm audit fix` first. If that doesn't clear it, update the direct dependency that pulls the vulnerable package in, or pin a fixed version through `overrides` in `package.json`. Ask the user before `npm audit fix --force` or a major-version bump, because both can break the app. If no fixed version exists anywhere, stop and report the advisory ID to the user. Don't lower `--audit-level`.
   - Never commit with `--no-verify` to get past the hook.
4. **Report honestly.** State which gates ran and that they passed, or paste the remaining output. Don't claim a gate passed unless it actually ran.

## Lint first

Write the code the linter wants from the first line, so the gates rarely fail:

1. **Read the project's ESLint config before writing** (`eslint.config.*`, plus the plugins and presets it extends, such as `next/core-web-vitals`, `typescript-eslint` or `react-hooks` recommended). It tells you which rules are on.
2. **Match lint-clean code already in the repo.** Copy the patterns of nearby files that pass lint.
3. **When a best-practice rule and a lint rule disagree, follow lint.** For example, if the React Compiler rules (`react-hooks/preserve-manual-memoization`) object to a manual `useMemo` that R3 or `rerender-memo` would suggest, drop the memo or restructure the code.
4. **Run lint on the file as soon as you finish it** (`npx eslint <file>`). Don't let errors pile up across many files before checking.

The usual traps, and how to write code that passes:

| Rule | Write it this way |
| --- | --- |
| `react-hooks/exhaustive-deps` | List every value the effect reads. If a dependency should not retrigger the effect, move the logic into an event handler, or use a ref or `useEffectEvent`. Never just leave the dependency out. |
| `react-hooks/set-state-in-effect` | Don't sync state in an effect. Derive the value during render, or set it in the event that caused the change (`rerender-derived-state-no-effect`). |
| `react-hooks/refs` | Don't read or write `ref.current` during render, only in effects and handlers. |
| `react-hooks/purity` | No `Date.now()`, `Math.random()` or other impure calls during render. Use lazy `useState(() => …)`, or do them in an effect or handler. |
| `react-hooks/immutability` / R4 | Never mutate props, state or hook return values. Copy them, or use `toSorted()` / `toSpliced()` / `with()`. |
| `react-hooks/static-components` / R2 | Never declare a component inside another component. |
| `@typescript-eslint/no-unused-vars` | Delete what you don't use. Don't leave it in prefixed with `_` unless the config allows that. |
| `@typescript-eslint/no-explicit-any` | Use `unknown` and narrow it, or write the real type. |
| `react/no-array-index-key` / R14 | Use a stable id as the key. |
| `@next/next/no-img-element`, `no-html-link-for-pages` | Use `next/image` and `next/link`. |

## How to apply

### When writing or scaffolding code

1. Place every file according to the folder tree below. If unsure where something goes, read `references/code-structure.md`.
2. Check the import direction before adding any import.
3. Write the code following "Lint first" and the DO list. For anything performance-sensitive (data fetching, lists, heavy components, effects), open the matching Vercel rule file in `rules/` and follow its "Correct" example, adjusting it if the project's lint rejects it.
4. Before finishing, scan the output against the DON'T codes and the CRITICAL/HIGH Vercel categories.
5. **Run lint + audit and fix until both pass** (see "Non-negotiable" above).
6. When setting up or touching project tooling, use `assets/eslint.config.js`, `assets/pre-commit` and `assets/ci.yml` as-is (see "Quality gates" below).

### When reviewing code

Report findings grouped by severity and cite the rule code so the author can look it up:

```markdown
## Review: <file or PR>

### Critical
- `src/pages/Home.jsx:12` — fetch + state ใน page (**S4**). ย้ายไป `features/todos/hooks/useTodos.js` แล้ว export ผ่าน index
- `src/features/todos/services/getTodos.js:3-8` — await ต่อกัน 2 ครั้งที่ไม่ขึ้นต่อกัน (**async-parallel**). ใช้ `Promise.all`

### Should fix
- ...

### Nice to have
- ...
```

If a shell is available, run the quality gates before writing the review and include their output: `npm run lint`, `npm run typecheck --if-present`, `npm audit --audit-level=high --omit=dev`. Do not report a gate as passing unless it actually ran.

Severity mapping: security X1–X8, Vercel CRITICAL/HIGH and structure violations S1–S5 → Critical. Vercel MEDIUM and R1–R14 → Should fix. Vercel LOW-MEDIUM/LOW and S6–S11 → Nice to have unless it causes a bug. Match the user's language in the explanation (Thai or English); keep code identifiers and rule codes as-is.

## Folder structure (feature-based)

```text
src/
├── assets/        # global CSS, รูป, font
├── components/    # shared UI ไม่รู้จัก business logic (ui/, form/)
├── context/       # global context
├── data/          # constants, config JSON
├── features/<name>/
│   ├── components/  hooks/  services/  context/  utils/  assets/  __tests__/
│   └── index.js   # public API — export เฉพาะที่ภายนอกใช้
├── hooks/         # generic hooks
├── layouts/       # Navbar, Sidebar, PageContainer
├── lib/           # facade ครอบ library ภายนอก
├── pages/         # 1 ไฟล์ต่อ route, ประกอบ feature + layout เท่านั้น
├── services/      # service ระดับแอป (analytics, logging)
└── utils/         # pure functions
```

A component with more than one file (style, test, sub-component) gets its own folder: `Modal/Modal.jsx` + `Modal/index.js` re-export. Single-file components stay as `Button.jsx`. For Next.js App Router or React Router v7, `app/` or `routes/` replaces `pages/`; everything else stays the same.

### Import direction

```text
pages → layouts → features/<x>/index → components · hooks · context · services → lib · utils · data → external libs (via lib/ only)
```

Imports flow downward only. A feature may use another feature only through its `index.js`. Shared folders (`components/`, `hooks/`, `utils/`) never import from `features/` or `pages/`.

## Team rule codes (summary)

Full reasons and examples: `references/dont.md` (DON'T) and `references/do.md` (DO).

| Code | ห้าม (Don't) | ทำแทน (Do) |
| --- | --- | --- |
| S1 | import ไฟล์ภายใน feature ตรงๆ | import ผ่าน `@/features/<name>` |
| S2 | shared folder import จาก `features/`/`pages/` | ย้ายโค้ดเข้า feature |
| S3 | `features/` import จาก `pages/` | ส่งผ่าน props/context |
| S4 | business logic/fetch/state ใน `pages/` | ย้ายเข้า feature |
| S5 | import library ภายนอกตรงจาก component/feature | ครอบด้วย `lib/` |
| S6 | side effect ใน `utils/` | `services/` หรือ custom hook |
| S7 | ย้ายขึ้น shared "เผื่อได้ใช้" | ย้ายเมื่อมีที่ที่ 2 ใช้จริง |
| S8 | export ทุกอย่างใน feature `index.js` | export เฉพาะที่ใช้ (ดู conflict ด้านล่าง) |
| S9 | relative path ลึกเกิน 2 ระดับ | alias `@/` |
| S10 | ไฟล์ของ component กระจายคนละที่ | โฟลเดอร์ต่อ component |
| S11 | ไฟล์หลักชื่อ `index.jsx` | `Modal/Modal.jsx` + `index.js` |
| R1 | component ยาวหลายร้อยบรรทัด | แตก component ย่อย |
| R2 | ประกาศ component ซ้อน component | ระดับบนสุดของไฟล์ + props |
| R3 | คำนวณหนักไม่ memoize | `useMemo` |
| R4 | mutate state/props | copy ใหม่ / `toSorted()` |
| R5 | `<div>` ห่อไร้หน้าที่ | Fragment |
| R6 | static import ทุก page | lazy load |
| R7 | prop drilling เกิน 2 ชั้น | Context / state library |
| R8 | spread props ลง DOM ตรงๆ | destructure ก่อน |
| R9 | handler ซ้ำต่างแค่ field | curried handler |
| R10 | pure function ใน component | ย้ายออกนอก component |
| R11 | copy stateful logic | custom hook |
| R12 | `useEffect` ไม่ cleanup | return cleanup |
| R13 | memo ทุกจุดโดยไม่วัด | profile ก่อน / React Compiler |
| R14 | index เป็น `key` ใน list ที่เปลี่ยนลำดับ | id ที่ไม่ซ้ำ |
| X1 | merge เมื่อ `npm audit` เจอ high/critical | `npm audit fix` / อัปเดต package |
| X2 | secret ใน `VITE_*`/`NEXT_PUBLIC_*`/`REACT_APP_*` | เก็บฝั่ง server |
| X3 | `dangerouslySetInnerHTML` ไม่ sanitize | DOMPurify |
| X4 | URL จาก user ลง `href`/`src` ไม่ตรวจ protocol | `safeUrl()` |
| X5 | `target="_blank"` ไม่มี `rel` | `rel="noreferrer"` |
| X6 | ไม่ commit lockfile / `npm install` ใน CI | lockfile + `npm ci` |
| X7 | `eval` / `new Function` | function ปกติ |
| X8 | token ระยะยาวใน `localStorage` | httpOnly cookie / memory |

## Quality gates (lint + security)

`assets/eslint.config.js` was tested against a sample feature-based project: it reports every seeded S1/S2/S3/S5/R2/R14/X3/X4/X5 violation and passes clean code with zero errors. Install exactly:

```bash
npm i -D eslint@9 @eslint/js@9 globals eslint-plugin-react eslint-plugin-react-hooks \
         eslint-plugin-boundaries eslint-import-resolver-typescript
```

Keep `eslint@9`: `eslint-plugin-react` does not yet support ESLint 10, so an unpinned install fails with ERESOLVE. The config uses the `boundaries/dependencies` rule (eslint-plugin-boundaries v7 syntax); do not switch back to the deprecated `element-types` / `entry-point` rules. It resolves the `@/` alias from `jsconfig.json` or `tsconfig.json`, and its element patterns assume `src/` — adjust them if the project root differs.

| Gate | Command | Enforces |
| --- | --- | --- |
| Lint | `npm run lint -- --max-warnings=0` | S1–S3, S5, R2, R14, X3–X5, X7, hooks rules |
| Types | `npm run typecheck --if-present` | type errors |
| Dependencies | `npm audit --audit-level=high --omit=dev` | X1 |
| Client env | grep step in `assets/ci.yml` | X2 |
| Install | `npm ci` | X6 |

Copy `assets/ci.yml` to `.github/workflows/ci.yml` to run all gates on every PR. X8 and the dynamic part of X4 cannot be linted — check them in review.

### Pre-commit hook

Every project gets a pre-commit hook that runs lint and the vulnerability check, so nothing that fails either one is committed. If the project already has Husky, extend its hook instead of replacing it. Install:

```bash
npm i -D husky lint-staged
npx husky init                       # creates .husky/ and adds "prepare": "husky"
cp <skill>/assets/pre-commit .husky/pre-commit
```

Add to `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "audit": "npm audit --audit-level=high --omit=dev"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,mjs,cjs}": "eslint --max-warnings=0 --no-warn-ignored"
  }
}
```

The hook lints only the staged files, for speed, and audits the whole dependency tree. The full `npm run lint` still runs after each change (see "Non-negotiable" above) and in CI. Once the hook is installed, test it: stage a file with a deliberate lint error and confirm the commit is blocked.

## Vercel rules quick reference

Read the individual file in `rules/<rule-name>.md` for explanation and Incorrect/Correct examples. For everything at once: `references/vercel-AGENTS.md` (large — prefer single rule files).

| Priority | Category | Impact | Prefix |
| --- | --- | --- | --- |
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

**1. async (CRITICAL)** — `async-cheap-condition-before-await` check cheap sync conditions first · `async-defer-await` await only in branches that use it · `async-parallel` Promise.all for independent work · `async-dependencies` better-all for partial dependencies · `async-api-routes` start early, await late · `async-suspense-boundaries` stream with Suspense

**2. bundle (CRITICAL)** — `bundle-barrel-imports` avoid heavy library barrels · `bundle-analyzable-paths` statically analyzable import paths · `bundle-dynamic-imports` dynamic import heavy components · `bundle-defer-third-party` load analytics after hydration · `bundle-conditional` load modules when feature activates · `bundle-preload` preload on hover/focus

**3. server (HIGH)** — `server-auth-actions` authenticate server actions · `server-cache-react` React.cache per request · `server-cache-lru` LRU across requests · `server-dedup-props` avoid duplicate RSC serialization · `server-hoist-static-io` hoist static I/O · `server-no-shared-module-state` no module-level request state · `server-serialization` minimize data to client components · `server-parallel-fetching` restructure to parallelize · `server-parallel-nested-fetching` chain nested fetches in Promise.all · `server-after-nonblocking` after() for non-blocking work

**4. client (MEDIUM-HIGH)** — `client-swr-dedup` SWR dedup · `client-event-listeners` dedupe global listeners · `client-passive-event-listeners` passive scroll listeners · `client-localstorage-schema` version localStorage data

**5. rerender (MEDIUM)** — `rerender-defer-reads` · `rerender-memo` · `rerender-memo-with-default-value` · `rerender-dependencies` · `rerender-derived-state` · `rerender-derived-state-no-effect` · `rerender-functional-setstate` · `rerender-lazy-state-init` · `rerender-simple-expression-in-memo` · `rerender-split-combined-hooks` · `rerender-move-effect-to-event` · `rerender-transitions` · `rerender-use-deferred-value` · `rerender-use-ref-transient-values` · `rerender-no-inline-components`

**6. rendering (MEDIUM)** — `rendering-animate-svg-wrapper` · `rendering-content-visibility` · `rendering-hoist-jsx` · `rendering-svg-precision` · `rendering-hydration-no-flicker` · `rendering-hydration-suppress-warning` · `rendering-activity` · `rendering-conditional-render` · `rendering-usetransition-loading` · `rendering-resource-hints` · `rendering-script-defer-async`

**7. js (LOW-MEDIUM)** — `js-batch-dom-css` · `js-index-maps` · `js-cache-property-access` · `js-cache-function-results` · `js-cache-storage` · `js-combine-iterations` · `js-length-check-first` · `js-early-exit` · `js-hoist-regexp` · `js-min-max-loop` · `js-set-map-lookups` · `js-tosorted-immutable` · `js-flatmap-filter` · `js-request-idle-callback`

**8. advanced (LOW)** — `advanced-effect-event-deps` · `advanced-event-handler-refs` · `advanced-init-once` · `advanced-use-latest`

## Conflicts and overlaps

### Feature `index.js` vs `bundle-barrel-imports`

The team requires a public `index.js` per feature (S1, S8). Vercel's barrel rule targets **third-party libraries** with thousands of re-exports (lucide-react, @mui/material, lodash). Both hold if the feature index stays small and explicit:

- Use named re-exports only: `export { default as TodoList } from './components/TodoList';`. Never `export * from ...`.
- Export only what other features or pages use (S8). A feature index with 3–10 exports does not carry the barrel cost the Vercel rule describes.
- Inside a feature, import siblings by relative path, never through the feature's own `index.js` (avoids circular imports).
- For third-party libraries, follow `bundle-barrel-imports` as written: `optimizePackageImports` in Next.js, direct paths elsewhere. Put that in the `lib/` facade when the library is wrapped there.

### Lazy loading: R6 vs `bundle-dynamic-imports`

Same intent. Use `next/dynamic` in Next.js, `React.lazy` + `Suspense` in Vite/React Router.

### Memoization: R3, R13 vs `rerender-*`

Consistent. Memoize expensive work (R3, `rerender-memo`), not simple expressions (`rerender-simple-expression-in-memo`, R13). With React Compiler enabled, skip manual `useMemo`/`useCallback` unless profiling shows a need.

### Immutability: R4 vs `js-tosorted-immutable`

Prefer `items.toSorted(fn)` over `[...items].sort(fn)` when the target supports ES2023. Both satisfy R4.

### Other direct overlaps

| Team | Vercel |
| --- | --- |
| R2 | `rerender-no-inline-components` |
| R10 | `rendering-hoist-jsx`, `js-hoist-regexp` |
| DO: functional update | `rerender-functional-setstate` |
| DO: TanStack Query / SWR | `client-swr-dedup` |
| R12 | `client-event-listeners`, `rerender-move-effect-to-event` |
| S5 (`lib/` facade) | `bundle-defer-third-party`, `bundle-conditional` |

## Reference files

| File | Read when |
| --- | --- |
| `references/code-structure.md` | Placing files, naming, import table, `lib/` facade and path alias examples |
| `references/do.md` | Writing new code — checklist with examples |
| `references/dont.md` | Reviewing — full S/R/X tables with reasons and examples |
| `assets/eslint.config.js` | Setting up or fixing lint — copy to project root |
| `assets/ci.yml` | Setting up CI — copy to `.github/workflows/ci.yml` |
| `assets/pre-commit` | Setting up the hook — copy to `.husky/pre-commit` |
| `rules/<name>.md` | Any Vercel rule — Incorrect/Correct code and impact |
| `rules/_sections.md` | Category descriptions and impact levels |
| `references/vercel-AGENTS.md` | Full Vercel guide in one file (~108 KB) |
