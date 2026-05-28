// =============================================================================
// SOLUTION 25 — useLayoutEffect vs useEffect
// =============================================================================
//
// Every change is annotated `// FIX #n`. The DOM measurement moves into
// useLayoutEffect: it runs AFTER the ref is attached (so no null deref) and
// BEFORE the browser paints (so the "Show more" decision is applied without a
// visible flicker).
// =============================================================================

import { useLayoutEffect, useRef, useState } from 'react';

const LONG_TEXT =
  'React measures the DOM only after it commits. Reading layout during render is too early, ' +
  'and reading it after paint is too late if you need to adjust before the user sees it. ' +
  'This paragraph is intentionally long so that it overflows its clamped container height.';

function Clamp({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // FIX #1 + #2: measure in useLayoutEffect. The ref is attached by now (no null
  //              deref), and it runs synchronously before paint, so the user
  //              never sees the un-clamped flash.
  useLayoutEffect(() => {
    if (ref.current) {
      setOverflowing(ref.current.scrollHeight > 80);
    }
  }, [text]);

  return (
    <div>
      <p
        ref={ref}
        style={{
          maxHeight: expanded ? 'none' : 80,
          overflow: 'hidden',
          border: '1px solid #ccc',
          padding: 8,
        }}
      >
        {text}
      </p>
      {overflowing && <button onClick={() => setExpanded((e) => !e)}>{expanded ? 'Show less' : 'Show more'}</button>}
    </div>
  );
}

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24, maxWidth: 480 }}>
      <h1>Clamped text</h1>
      <Clamp text={LONG_TEXT} />
    </main>
  );
}
