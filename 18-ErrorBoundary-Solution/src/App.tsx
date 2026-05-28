// =============================================================================
// SOLUTION 18 — Error Boundaries
// =============================================================================
//
// Every change is annotated `// FIX #n`. A real error boundary needs state +
// getDerivedStateFromError to switch to a fallback, and a way to reset. The
// useless try/catch is removed (only a boundary can catch render errors).
//
// Note: React still has no built-in error boundary for function components, so
// a class (or the `react-error-boundary` package) remains the idiomatic choice.
// =============================================================================

import { Component, type ReactNode, useState } from 'react';

function Wonky({ count }: { count: number }) {
  if (count >= 3) {
    throw new Error(`Wonky exploded at count=${count}`);
  }
  return <p>Counting safely: {count}</p>;
}

type BoundaryProps = { children: ReactNode; onReset: () => void };
type BoundaryState = { hasError: boolean };

class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  // FIX #2: derive fallback state from the thrown error so render() can switch.
  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.log('ErrorBoundary caught:', error.message);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ border: '1px solid crimson', padding: 12 }}>
          <p>Something went wrong.</p>
          <button onClick={this.handleReset}>Reset</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Error boundaries</h1>
      <button onClick={() => setCount((c) => c + 1)}>increment ({count})</button>
      {/* FIX #1: render the child directly — the boundary (not try/catch) catches it. */}
      <ErrorBoundary onReset={() => setCount(0)}>
        <Wonky count={count} />
      </ErrorBoundary>
    </main>
  );
}
