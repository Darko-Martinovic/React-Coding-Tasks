// =============================================================================
// TASK 11 — Context Re-render Storm
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// <ThemeLabel> reads ONLY `theme` from context. But every time the unrelated
// "tick" button changes the provider's `ticks` state, <ThemeLabel> re-renders
// too — watch its render counter climb even though the theme never changed.
//
// GOAL: Stop consumers from re-rendering when their slice of context is
//       unchanged. TWO related defects.
//
// THINGS TO SCRUTINISE:
//   1. The provider builds `value = { theme, toggle }` fresh on every render.
//      What is the IDENTITY of that object between renders, and what does a
//      changed context value force every consumer to do?
//   2. `ticks` is unrelated state living in the same provider. Combined with #1,
//      every tick re-publishes a brand-new context value.
//
// EXPECTED CORRECT BEHAVIOR:
//   - Clicking "tick" does NOT re-render <ThemeLabel> (its counter stays put).
//   - Clicking "toggle theme" DOES re-render it (theme actually changed).
//
// ACTUAL (buggy) BEHAVIOR: <ThemeLabel>'s render count rises on every tick.
// =============================================================================

import { createContext, useContext, useRef, useState } from 'react';

type ThemeCtx = { theme: 'light' | 'dark'; toggle: () => void };
const ThemeContext = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} });

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [ticks, setTicks] = useState(0);

  // BUG #1 + #2: a new object every render. Because `ticks` lives here and
  //              changes often, the context value identity changes constantly,
  //              forcing every consumer to re-render.
  const value: ThemeCtx = { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) };

  return (
    <ThemeContext.Provider value={value}>
      <button onClick={() => setTicks((t) => t + 1)}>tick ({ticks})</button>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeLabel() {
  const { theme } = useContext(ThemeContext);
  const renders = useRef(0);
  renders.current++;
  return (
    <p>
      theme = <strong>{theme}</strong> · ThemeLabel rendered <strong>{renders.current}</strong> time(s)
    </p>
  );
}

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Context storm</h1>
      <ThemeProvider>
        <ThemeLabel />
        <ToggleButton />
      </ThemeProvider>
    </main>
  );
}

function ToggleButton() {
  const { toggle } = useContext(ThemeContext);
  return <button onClick={toggle}>toggle theme</button>;
}
