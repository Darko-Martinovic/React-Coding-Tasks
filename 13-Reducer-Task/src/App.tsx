// =============================================================================
// TASK 13 — useReducer Correctness
// =============================================================================
//
// DIFFICULTY: L4 (advanced)            TARGET TIME: < 10 minutes
// TYPE: behavioral (runs in the browser and misbehaves — no type error)
//
// A reducer-driven counter with an action log. Reducers MUST be pure and return
// a brand-new, fully-updated state object. This one breaks that rule three ways.
//
// GOAL: Fix the reducer so every button updates the screen. THREE distinct bugs.
//
// THINGS TO SCRUTINISE:
//   1. `inc` mutates `state.count` and returns the SAME state object. Does React
//      see a change?
//   2. `incBy` returns a new object but forgets to actually set the new count.
//   3. `log` pushes into the existing `entries` array and returns the same
//      state reference — both a mutation and an unchanged identity.
//   ("reset" is correct — use it as a reference for what good looks like.)
//
// EXPECTED CORRECT BEHAVIOR: inc (+1), incBy (+5), and log all update the UI
//   immediately; reset clears everything.
//
// ACTUAL (buggy) BEHAVIOR: inc, incBy and log appear to do nothing on screen.
// =============================================================================

import { useReducer } from 'react';

type State = { count: number; entries: string[] };
type Action =
  | { type: 'inc' }
  | { type: 'incBy'; by: number }
  | { type: 'log'; text: string }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc':
      // BUG #1: mutates count and returns the same object reference.
      state.count++;
      return state;
    case 'incBy':
      // BUG #2: new object, but the count is never updated.
      return { ...state };
    case 'log':
      // BUG #3: mutates the existing array and returns the same state reference.
      state.entries.push(action.text);
      return state;
    case 'reset':
      return { count: 0, entries: [] };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, { count: 0, entries: [] });

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Count: {state.count}</h1>
      <button onClick={() => dispatch({ type: 'inc' })}>+1</button>{' '}
      <button onClick={() => dispatch({ type: 'incBy', by: 5 })}>+5</button>{' '}
      <button onClick={() => dispatch({ type: 'log', text: `count was ${state.count}` })}>log</button>{' '}
      <button onClick={() => dispatch({ type: 'reset' })}>reset</button>
      <ul>
        {state.entries.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </main>
  );
}
