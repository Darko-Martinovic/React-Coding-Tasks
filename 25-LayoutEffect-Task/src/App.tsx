// =============================================================================
// TASK 25 — useLayoutEffect vs useEffect
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (CRASHES on first render — check the console)
//
// <Clamp> shows a "Show more" button only when its text overflows a fixed
// height. To decide, it measures the paragraph's scrollHeight. The measurement
// is done in the wrong place (during render), and `ref.current` is null then, so
// it crashes immediately.
//
// GOAL: Measure at the right time. TWO things to get right.
//
// THINGS TO SCRUTINISE:
//   1. The measurement `ref.current.scrollHeight` runs DURING render — but refs
//      are attached AFTER the DOM commits, so `ref.current` is still null on the
//      first render. Where must DOM reads happen instead?
//   2. Measuring + setting state in a plain useEffect runs AFTER the browser
//      paints, so the user sees a flash of the un-clamped layout. Which effect
//      hook runs synchronously BEFORE paint to avoid that flicker?
//
// EXPECTED CORRECT BEHAVIOR: the text is clamped, and "Show more" appears
//   (because the text overflows) with no crash and no visible flicker.
// =============================================================================

import { useRef, useState } from 'react';

const LONG_TEXT =
  'React measures the DOM only after it commits. Reading layout during render is too early, ' +
  'and reading it after paint is too late if you need to adjust before the user sees it. ' +
  'This paragraph is intentionally long so that it overflows its clamped container height.';

function Clamp({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // BUG #1 + #2: measuring during render — ref.current is null here, so this
  //              throws. (And even moved to a plain useEffect, it would flicker.)
  const isOver = ref.current!.scrollHeight > 80;
  if (isOver !== overflowing) setOverflowing(isOver);

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
