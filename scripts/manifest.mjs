// Single source of truth for the 30 topics.
// num: zero-padded id | slug: PascalCase folder segment | title: human title
// type: 'behavioral' (runs & misbehaves) | 'type-check' (fails `tsc --noEmit` by design)
// focus: short description used in the root README index.
export const TASKS = [
  { num: '01', slug: 'StaleClosure',      title: 'Stale Closure in setInterval',     type: 'behavioral', focus: 'Stale closure over state in setInterval; missing dep + missing cleanup so the timer reads frozen state and leaks.' },
  { num: '02', slug: 'EffectCleanup',     title: 'Effect Cleanup Leak',              type: 'behavioral', focus: 'Missing cleanup for window listener + interval; handlers/timers accumulate across re-runs (visible under StrictMode).' },
  { num: '03', slug: 'EffectDeps',        title: 'useEffect Dependencies',           type: 'behavioral', focus: 'Empty/stale dependency array: effect never re-fetches when the selected id changes, shows stale data.' },
  { num: '04', slug: 'StateMutation',     title: 'Direct State Mutation',            type: 'behavioral', focus: 'Mutating array/object state in place (push/sort/assign) so React skips the re-render.' },
  { num: '05', slug: 'ListKeys',          title: 'Index-as-Key List Bugs',           type: 'behavioral', focus: 'Array index as key: per-row component state attaches to the wrong item on insert/delete/reorder.' },
  { num: '06', slug: 'DerivedState',      title: 'Derived State in useState',        type: 'behavioral', focus: 'Storing derived values in state + an effect to sync them; they go stale relative to the source of truth.' },
  { num: '07', slug: 'InfiniteRender',    title: 'Infinite Render Loop',             type: 'behavioral', focus: 'setState during render and an object/array literal in a dep array driving an unbounded re-render loop.' },
  { num: '08', slug: 'RaceCondition',     title: 'Async Effect Race Condition',      type: 'behavioral', focus: 'Out-of-order async responses overwrite newer ones; no ignore flag / AbortController on cleanup.' },
  { num: '09', slug: 'FunctionalUpdate',  title: 'Stale State & Batching',           type: 'behavioral', focus: 'Multiple setState(value+1) in one handler / async callback use a stale snapshot; need the updater form.' },
  { num: '10', slug: 'MemoCallback',      title: 'useMemo / useCallback Misuse',     type: 'behavioral', focus: 'Wrong/empty deps on useMemo & useCallback freeze a stale closure and recompute when they should not.' },
  { num: '11', slug: 'ContextReRender',   title: 'Context Re-render Storm',          type: 'behavioral', focus: 'Provider value object rebuilt every render makes all consumers re-render even when their slice is unchanged.' },
  { num: '12', slug: 'ControlledInput',   title: 'Controlled vs Uncontrolled',       type: 'behavioral', focus: 'value without onChange (frozen input) and undefined->defined value flipping uncontrolled to controlled.' },
  { num: '13', slug: 'Reducer',           title: 'useReducer Correctness',           type: 'behavioral', focus: 'Reducer mutates state and lacks a default case; one action returns nothing, wiping state.' },
  { num: '14', slug: 'RulesOfHooks',      title: 'Conditional Hooks',                type: 'behavioral', focus: 'Hooks called after an early return / inside a condition; hook order changes and React throws.' },
  { num: '15', slug: 'MemoInlineProps',   title: 'React.memo & Inline Props',        type: 'behavioral', focus: 'memo defeated by inline object/array/function props recreated every render; child never skips.' },
  { num: '16', slug: 'RefVsState',        title: 'Ref vs State',                     type: 'behavioral', focus: 'A render-affecting value kept in a ref never updates the UI; a DOM concern kept in state thrashes.' },
  { num: '17', slug: 'ForwardRef',        title: 'forwardRef & Imperative Handle',   type: 'behavioral', focus: 'Parent ref to a child input is null; missing ref forwarding / useImperativeHandle, focus() throws.' },
  { num: '18', slug: 'ErrorBoundary',     title: 'Error Boundaries',                 type: 'behavioral', focus: 'try/catch in render cannot catch child errors; boundary missing getDerivedStateFromError / reset.' },
  { num: '19', slug: 'SuspenseLazy',      title: 'Suspense & lazy',                  type: 'behavioral', focus: 'lazy() with no Suspense boundary and a non-default export; the lazy chunk never renders.' },
  { num: '20', slug: 'StrictModeEffects', title: 'StrictMode Double-Invoke',         type: 'behavioral', focus: 'Non-idempotent effect double-runs under StrictMode (double subscribe / double-count); fix with cleanup.' },
  { num: '21', slug: 'DebouncedInput',    title: 'Debounced Input Stale Value',      type: 'behavioral', focus: 'Debounce timer recreated every render so it never fires, and the callback captures a stale value.' },
  { num: '22', slug: 'KeyResetState',     title: 'Reset State via key',              type: 'behavioral', focus: 'Editing one row then switching selection keeps the old draft; component identity needs a key to reset.' },
  { num: '23', slug: 'ConditionalRender', title: 'Falsy Conditional Render',         type: 'behavioral', focus: '`count && <X/>` renders a literal 0; `&&` with numbers/strings leaks falsy values into the DOM.' },
  { num: '24', slug: 'FormSubmit',        title: 'Form Submit & preventDefault',     type: 'behavioral', focus: 'Missing preventDefault reloads the page; default button type submits; uncontrolled reset bug.' },
  { num: '25', slug: 'LayoutEffect',      title: 'useLayoutEffect vs useEffect',     type: 'behavioral', focus: 'Measuring/positioning in useEffect paints a visible flicker; should run synchronously before paint.' },
  { num: '26', slug: 'SubscriptionCleanup', title: 'Subscription Cleanup',           type: 'behavioral', focus: 'matchMedia / interval subscription never unsubscribed and re-subscribes with a stale handler each change.' },
  { num: '27', slug: 'EventPropagation',  title: 'Event Propagation & Outside Click', type: 'behavioral', focus: 'document listener added without cleanup + propagation not stopped, so the menu closes immediately.' },
  { num: '28', slug: 'PropTypes',         title: 'Discriminated Union Props',        type: 'type-check', focus: 'TS: a discriminated-union prop type is narrowed wrong and an event handler is mistyped; fix to satisfy tsc.' },
  { num: '29', slug: 'GenericComponent',  title: 'Generic Components & Hooks',       type: 'type-check', focus: 'TS: a generic list component and useState/useRef generics infer the wrong type; fix the signatures.' },
  { num: '30', slug: 'ContextTypeSafety', title: 'Context Type Safety',             type: 'type-check', focus: 'TS: createContext(null) leaves consumers possibly-null and untyped; add a typed default / guard hook.' },
];

export const folderName = (t, kind) => `${t.num}-${t.slug}-${kind}`; // kind: 'Task' | 'Solution'
