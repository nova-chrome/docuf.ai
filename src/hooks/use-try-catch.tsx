import { useCallback, useEffect, useState } from "react";
import { tryCatch } from "~/util/try-catch";

interface UseTryCatchState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface UseTryCatchReturn<T> extends UseTryCatchState<T> {
  execute: () => Promise<void>;
}

interface UseTryCatchOptions {
  immediate?: boolean;
}

export function useTryCatch<T>(
  asyncFunction: () => Promise<T>,
  dependencies: React.DependencyList = [],
  options: UseTryCatchOptions = { immediate: true }
): UseTryCatchReturn<T> {
  const [state, setState] = useState<UseTryCatchState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const result = await tryCatch(asyncFunction());

    if (result.error) {
      setState({
        data: null,
        error: result.error.message || "An error occurred",
        isLoading: false,
      });
    } else {
      setState({
        data: result.data,
        error: null,
        isLoading: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
  };
}
