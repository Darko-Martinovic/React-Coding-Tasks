# React Coding Tasks (L4 / advanced)

30 self-contained React debugging/fixing tasks for advanced (L4) developers. Each
task is designed to be solved in **under 10 minutes** and deliberately contains
**multiple distinct bugs** (not a single fix).

Each topic ships as **two runnable Vite apps** (60 apps total):

- `NN-Topic-Task` — leads with a header comment block in `src/App.tsx` (difficulty,
  target time, the goal, a "things to scrutinise" hint list, and the EXPECTED
  correct behavior), followed by starting code that **misbehaves**.
- `NN-Topic-Solution` — the worked fix, with **every change annotated `// FIX #n`**
  referencing the specific bug.

Stack: **Vite + React 19 + TypeScript**, wired as an **npm workspace** so there is
**one install** at the repo root (no `node_modules` duplicated 60×).

## Running

From the repo root, install **once**:

```pwsh
npm install
```

Then run any single app — either from inside its folder, or by workspace name:

```pwsh
cd 01-StaleClosure-Task
npm run dev            # opens the app in your browser (Vite dev server)

# …or, from the repo root:
npm run dev -w 01-StaleClosure-Task
```

Open the dev tools console — several tasks surface their bug as a warning, error,
or crash, not just a visual glitch.

### Type-check tasks (compile-by-design)

Tasks **28, 29, 30** are **type-check** exercises. Vite's dev server does **not**
type-check, so `npm run dev` will load them anyway — the bugs are TypeScript
errors. See them (and prove your fix) with:

```pwsh
npm run typecheck -w 28-PropTypes-Task     # tsc --noEmit  → reports the errors
```

Their `-Task` apps fail `tsc --noEmit` by design; their `-Solution` apps pass.

### Checking everything at once (optional)

```pwsh
npm run typecheck:all   # every app; expects only 28/29/30 -Task to fail
npm run build:all       # every app builds (Vite never type-checks)
```

## Task index

| # | Topic | Type | Focus |
|---|-------|------|-------|
| 01 | Stale Closure in setInterval | behavioral | Stale closure over state in `setInterval`; missing dep + missing cleanup so the timer reads frozen state and leaks. |
| 02 | Effect Cleanup Leak | behavioral | Missing cleanup for a window listener + interval; handlers/timers accumulate across re-runs (visible under StrictMode). |
| 03 | useEffect Dependencies | behavioral | Empty/stale dependency arrays: effects never re-run when the selected id / profile changes, showing stale data. |
| 04 | Direct State Mutation | behavioral | Mutating array/object state in place (push/sort/assign) so React skips the re-render. |
| 05 | Index-as-Key List Bugs | behavioral | Array index as key: per-row component state attaches to the wrong item on remove/reorder; plus a missing key. |
| 06 | Derived State in useState | behavioral | Storing derived values in state + an effect to sync them; they go stale relative to the source of truth. |
| 07 | Infinite Render Loop | behavioral | An object literal in a dep array and a self-feeding effect drive an unbounded re-render loop. |
| 08 | Async Effect Race Condition | behavioral | Out-of-order async responses overwrite newer ones; no ignore flag / AbortController on cleanup. |
| 09 | Stale State & Batching | behavioral | Multiple `setState(value+1)` / delayed callbacks use a stale snapshot; need the functional updater. |
| 10 | useMemo / useCallback Misuse | behavioral | Empty deps freeze a memo and a callback closure; they never recompute / always log stale values. |
| 11 | Context Re-render Storm | behavioral | Provider value object rebuilt every render makes consumers re-render even when their slice is unchanged. |
| 12 | Controlled vs Uncontrolled | behavioral | `value` without `onChange`; `undefined`→defined value flip; `defaultChecked` instead of `checked`. |
| 13 | useReducer Correctness | behavioral | Reducer mutates state / returns the same reference / forgets to update a field — no re-render. |
| 14 | Conditional Hooks | behavioral | Hooks called after an early return and inside a condition; hook order changes and React throws. |
| 15 | React.memo & Inline Props | behavioral | memo defeated by inline object/array/function props recreated every render; child never skips. |
| 16 | Ref vs State | behavioral | A render-affecting value kept in a ref never updates the UI; a DOM handle kept in state focuses unreliably. |
| 17 | forwardRef & Imperative Handle | behavioral | Ref never forwarded / never attached / clear() pokes the DOM of a controlled input; `focus()` throws. |
| 18 | Error Boundaries | behavioral | try/catch in render can't catch child errors; boundary missing `getDerivedStateFromError` + reset. |
| 19 | Suspense & lazy | behavioral | `lazy()` with no `Suspense` boundary and a non-`default` module export; the lazy chunk never renders. |
| 20 | StrictMode Double-Invoke | behavioral | Non-idempotent effects double-run under StrictMode (double connect / double log); fix with cleanup, not a guard. |
| 21 | Debounced Input Stale Value | behavioral | Debounce timer stored in a per-render variable never cancels, and the callback commits a stale value. |
| 22 | Reset State via key | behavioral | Internal state seeded from props never resets when the prop changes; remount with a `key`. |
| 23 | Falsy Conditional Render | behavioral | `count && <X/>` and `items.length && …` render literal `0`s into the DOM. |
| 24 | Form Submit & preventDefault | behavioral | Missing `preventDefault` reloads the page; a button with no `type` submits the form. |
| 25 | useLayoutEffect vs useEffect | behavioral | Measuring the DOM during render (null ref crash); must read layout after commit, before paint. |
| 26 | Subscription Cleanup | behavioral | Subscription never unsubscribed (subscribers climb) and the handler closes over stale state. |
| 27 | Event Propagation & Outside Click | behavioral | Document listener with no `contains` check / no cleanup closes the menu on its own opening click. |
| 28 | Discriminated Union Props | **type-check** | A discriminated-union prop read without narrowing + a mistyped prop value; fix to satisfy `tsc`. |
| 29 | Generic Components & Hooks | **type-check** | `useState([])`→`never[]`, a non-generic list component, and `useRef` without an initial value. |
| 30 | Context Type Safety | **type-check** | `createContext(null)` leaves consumers `null` and the provider untyped; add a typed context + guard hook. |

## Conventions when adding or editing tasks

- The 30 topics live in `scripts/manifest.mjs` (the single source of truth). Add an
  entry there, then run `node scripts/scaffold.mjs` to generate the boilerplate
  (`package.json` / `index.html` / `vite.config.ts` / `tsconfig.json` /
  `src/main.tsx`) — it never overwrites an existing `src/App.tsx`.
- Each app is **standalone**: no shared component library, each `src/App.tsx` stands
  on its own (mirroring the C# bank it is modeled on).
- Behavioral tasks must **misbehave deterministically** — verify by running. Avoid
  flaky timing (e.g. task 08 makes shorter queries resolve slower to force a
  deterministic out-of-order race).
- Solutions annotate every change with `// FIX #n`; tasks lead with the
  `// TASK NN` header block.
- Keep the bug surface on **React/JS pitfalls**, not build config. (ESLint is
  deliberately not installed — `eslint-plugin-react-hooks` would flag several of
  these bugs and spoil the exercise.)
