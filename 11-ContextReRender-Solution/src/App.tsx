// =============================================================================
// SOLUTION 11 — Context Re-render Storm
// =============================================================================
//
// Every change is annotated `// FIX #n`. The context value now keeps a STABLE
// identity unless `theme` actually changes, so unrelated `ticks` updates no
// longer re-publish it. (For larger apps, also SPLIT independent concerns into
// separate contexts so consumers subscribe only to what they use.)
// =============================================================================

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type ThemeCtx = { theme: 'light' | 'dark'; toggle: () => void };
const ThemeContext = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} });

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [ticks, setTicks] = useState(0);

  // FIX #1: a stable toggle (functional updater, so it never needs `theme`).
  const toggle = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);

  // FIX #2: memoize the value so its identity only changes when `theme` does.
  //         A `ticks` update re-renders the provider but yields the SAME value
  //         object, so consumers are not disturbed.
  const value = useMemo<ThemeCtx>(() => ({ theme, toggle }), [theme, toggle]);

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
