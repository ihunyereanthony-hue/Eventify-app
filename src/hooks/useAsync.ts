import { useCallback, useEffect, useRef, useState } from 'react';

type State<T> = { data: T | null; loading: boolean; error: Error | null };
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const alive = useRef(true);
  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fnRef.current();
      if (alive.current) setState({ data, loading: false, error: null });
    } catch (e) {
      if (alive.current) {
        setState({ data: null, loading: false, error: e instanceof Error ? e : new Error(String(e)) });
      }
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    run();
    return () => {
      alive.current = false;
    };
 
  }, deps);

  return { ...state, reload: run };
}
