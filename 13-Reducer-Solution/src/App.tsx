// =============================================================================
// SOLUTION 13 — useReducer Correctness
// =============================================================================
//
// Every change is annotated `// FIX #n`. Every case returns a NEW, fully-updated
// state object and never mutates the previous state.
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
      // FIX #1: return a new object with the incremented count; no mutation.
      return { ...state, count: state.count + 1 };
    case 'incBy':
      // FIX #2: actually apply the increment.
      return { ...state, count: state.count + action.by };
    case 'log':
      // FIX #3: new array (spread) instead of pushing into the old one.
      return { ...state, entries: [...state.entries, action.text] };
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
