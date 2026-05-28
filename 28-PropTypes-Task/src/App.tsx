// =============================================================================
// TASK 28 — Discriminated Union Props
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: type-check (COMPILE-BY-DESIGN — making `tsc` pass IS the exercise)
//
// IMPORTANT: Vite's dev server does NOT type-check, so `npm run dev` will load
// and even "work" at runtime. The bugs are TYPE errors — see them with:
//
//     npm run typecheck      (i.e. tsc --noEmit)
//
// GOAL: Fix the types so `tsc --noEmit` reports ZERO errors, WITHOUT loosening
//       the prop types (no `any`, no `!`, no `as`). TWO distinct type bugs.
//
// THINGS TO SCRUTINISE:
//   1. <FancyButton> takes a discriminated union, but reads `props.href` and
//      `props.onClick` WITHOUT narrowing on `props.kind`. Each property only
//      exists on one variant. Narrow first.
//   2. <Badge count> is typed `number`, but the call site passes the string
//      "5". Pass a number.
// =============================================================================

type ButtonProps =
  | { kind: 'link'; href: string }
  | { kind: 'action'; onClick: () => void };

function FancyButton(props: ButtonProps) {
  // BUG #1: `href` exists only on the 'link' variant and `onClick` only on
  //         'action'. Reading both without narrowing on `props.kind` is an error.
  return (
    <a href={props.href} onClick={props.onClick}>
      {props.kind}
    </a>
  );
}

type BadgeProps = { count: number; label: string };
function Badge({ count, label }: BadgeProps) {
  return (
    <span>
      {label}: {count}
    </span>
  );
}

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Toolbar</h1>
      <FancyButton kind="link" href="/home" />{' '}
      <FancyButton kind="action" onClick={() => alert('hi')} />
      {/* BUG #2: count expects a number, not the string "5". */}
      <p><Badge count="5" label="Items" /></p>
    </main>
  );
}
