// useApi.ts client/src/hooks/useApi.ts
// Load something from the server when a component appears, and keep track of loading and errors:
//   const { data, loading, error, reload } = useApi<CategoriesResponse>("/categories");
// When the path changes (e.g. the Shop page's filters), it loads again by itself.

// STEP 30 (part 3): A hook for loading data

import { useEffect, useState } from "react";
import { api } from "../utils/api";

// The last answer, labelled with WHICH request it answers ("/categories#0")
type Result<T> = { key: string; data?: T; error?: string };

// path = null means "don't load anything yet" (e.g. a product page waiting for its id)
export const useApi = <T>(path: string | null) => {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);

  // A new path or a reload creates a new request label.
  const key = path === null ? null : `${path}#${reloadCount}`;

  useEffect(() => {
    if (path === null || key === null) {
      return;
    }

    // Cancel this request if the component disappears or the path changes.
    const controller = new AbortController();

    api<T>(path, { signal: controller.signal })
      .then((data) => {
        setResult({ key, data });
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setResult({ key, error: err.message });
        }
      });

    return () => {
      controller.abort();
    };
  }, [path, key]);

  // Work out whether the current request is still loading.
  const loading = key !== null && result?.key !== key;

  return {
    data: result?.data ?? null,
    error: !loading ? (result?.error ?? null) : null,
    loading,
    reload: () => {
      setReloadCount((count) => count + 1);
    },
  };
};
