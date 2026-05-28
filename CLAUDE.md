# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An interview question bank: **30 self-contained React debugging/fixing tasks** aimed at L4/advanced
developers. Each task is designed to be solved in **under 10 minutes** and deliberately contains
**multiple distinct bugs** (not a single fix). This is teaching material, not an application — there is
no shared library and each app's `src/App.tsx` stands alone. It mirrors the sibling C# bank in
`../CSharpCodingTasks`.

## Structure

Each of the 30 topics ships as **two runnable Vite apps** (60 apps total), living in folders at the repo
root named `NN-Topic-Task` and `NN-Topic-Solution` (`NN` = `01`..`30`, zero-padded):

- `NN-Topic-Task` — a `// TASK NN` header comment block in `src/App.tsx` (difficulty, target time, goal,
  "things to scrutinise" hints, EXPECTED correct behavior) above starting code that **runs and
  misbehaves**, or (for the three type-check topics) **fails `tsc --noEmit` by design**.
- `NN-Topic-Solution` — the worked fix, with **every change annotated `// FIX #n`** referencing the
  specific bug it addresses.

`README.md` indexes all 30 (number / topic / type / focus). `scripts/manifest.mjs` is the **single
source of truth** for the topic list — keep both in sync when adding tasks.

## The npm workspace (one install, not 60×)

The repo root is an npm **workspace** (`"workspaces": ["*-Task", "*-Solution"]`). All shared
dependencies (react, react-dom, vite, @vitejs/plugin-react, typescript, @types/*) are declared **once**
in the **root** `package.json`. npm hoists them into a single root `node_modules`; the per-app folders
declare **no** dependencies and resolve everything by walking up the tree. So:

- `npm install` is run **once at the repo root**. Never run install inside an app folder.
- There is exactly **one** `node_modules` (at the root, ~70 MB), not one per app.
- Shared config is also centralized: every app's `vite.config.ts` re-exports the root
  `vite.config.shared.ts`, and every app's `tsconfig.json` extends the root `tsconfig.base.json`.

## Build & run

Per-app workflow (the normal one). `cwd` is the app folder, so Vite's `root` is that folder:

```pwsh
cd 01-StaleClosure-Task && npm run dev     # observe the bug in the browser
# or, from the repo root, by workspace name:
npm run dev -w 01-StaleClosure-Solution    # see the corrected behavior
```

Each app's `package.json` has `dev` (vite), `build` (vite build), `preview`, and `typecheck`
(`tsc --noEmit`).

Root convenience scripts: `npm run typecheck:all` and `npm run build:all` iterate every app
(`scripts/*.mjs`).

## Behavioral vs type-check tasks

- **27 behavioral** tasks (01–27): the bug is observable at runtime — a visible render bug, a console
  warning/error, an infinite re-render, a stale value, or a listener/timer leak. Vite dev does **not**
  type-check, which is fine; these are meant to be *run*.
- **3 type-check** tasks (28, 29, 30): the bug is a TypeScript error. Because Vite never type-checks,
  `npm run dev` loads them anyway — the exercise is to make **`tsc --noEmit` pass**. Their `-Task` apps
  fail `tsc` by design; `-Solution` apps pass. `npm run typecheck:all` expects exactly those three
  `-Task` apps to fail and everything else to pass.

## Conventions when adding or editing tasks

- Add the topic to `scripts/manifest.mjs`, then run `node scripts/scaffold.mjs` to generate the
  boilerplate. It is idempotent and **never overwrites an existing `src/App.tsx`** — write the real
  content there yourself.
- `src/App.tsx` must `export default` the `App` component (consumed by the generated `main.tsx`, which
  wraps it in `<StrictMode>`). StrictMode is intentional: it surfaces effect-cleanup bugs (and is the
  whole point of task 20). Design observable symptoms that hold under StrictMode's dev double-invoke.
- Behavioral tasks should keep `tsc` clean (use `!` to silence a strict-null check where the *runtime*
  null-deref IS the intended bug, e.g. tasks 17/25) so that only 28/29/30 fail type-checking.
- Keep the bug surface on **React/JS pitfalls**, not build config. ESLint is deliberately omitted —
  `eslint-plugin-react-hooks` would flag several bugs (missing deps, conditional hooks) and spoil them.
- Solutions annotate every change with `// FIX #n`; tasks lead with the `// TASK NN` header block.
