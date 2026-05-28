// =============================================================================
// SOLUTION 28 — Discriminated Union Props
// =============================================================================
//
// Every change is annotated `// FIX #n`. `tsc --noEmit` now passes. The union is
// narrowed by its discriminant so each variant's props are accessed safely, and
// the Badge call site passes a real number.
// =============================================================================

type ButtonProps =
  | { kind: 'link'; href: string }
  | { kind: 'action'; onClick: () => void };

function FancyButton(props: ButtonProps) {
  // FIX #1: narrow on the discriminant `kind`. Inside each branch TypeScript
  //         knows exactly which props exist.
  if (props.kind === 'link') {
    return <a href={props.href}>link</a>;
  }
  return <button onClick={props.onClick}>action</button>;
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
      {/* FIX #2: pass a number, not a string. */}
      <p><Badge count={5} label="Items" /></p>
    </main>
  );
}
