// =============================================================================
// TASK 18 — Error Boundaries
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (the whole app CRASHES when the child throws)
//
// <Wonky> throws once the counter reaches 3. There are two attempts to contain
// that error — a try/catch and an ErrorBoundary — and BOTH are written wrong, so
// the entire app blanks out instead of showing a fallback.
//
// GOAL: Contain the error and offer a recovery. TWO distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. <SafeWonky> wraps `<Wonky/>` in try/catch and returns the element. But
//      React calls Wonky LATER, during its own render — is the throw happening
//      inside this try block? (try/catch cannot catch child render errors.)
//   2. The ErrorBoundary only has `componentDidCatch` (which logs). It never
//      updates state, and has no `getDerivedStateFromError`, so it keeps
//      rendering the broken children. What makes a boundary show a fallback?
//
// EXPECTED CORRECT BEHAVIOR: at count 3 a fallback ("Something went wrong")
//   replaces the broken subtree, with a "Reset" that recovers.
// =============================================================================

import { Component, type ReactNode, useState } from 'react';

function Wonky({ count }: { count: number }) {
  if (count >= 3) {
    throw new Error(`Wonky exploded at count=${count}`);
  }
  return <p>Counting safely: {count}</p>;
}

function SafeWonky({ count }: { count: number }) {
  // BUG #1: try/catch around JSX does NOT catch errors thrown while React
  //         renders the child — Wonky runs later, outside this try.
  try {
    return <Wonky count={count} />;
  } catch {
    return <p>handled locally</p>;
  }
}

class ErrorBoundary extends Component<{ children: ReactNode }> {
  // BUG #2: no state and no getDerivedStateFromError → the boundary never
  //         switches to a fallback; componentDidCatch just logs and re-renders
  //         the same broken children.
  componentDidCatch(error: Error) {
    console.log('ErrorBoundary caught:', error.message);
  }

  render() {
    return this.props.children;
  }
}

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Error boundaries</h1>
      <button onClick={() => setCount((c) => c + 1)}>increment ({count})</button>
      <ErrorBoundary>
        <SafeWonky count={count} />
      </ErrorBoundary>
    </main>
  );
}
