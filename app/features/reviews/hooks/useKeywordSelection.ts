import { useState, useCallback } from 'react';

export const useKeywordSelection = (initial: string[] = []) => {
  const [keywords, setKeywords] = useState<string[]>(initial);

  const toggle = useCallback(
    (value: string) =>
      setKeywords((prev) =>
        prev.includes(value) ? prev.filter((k) => k !== value) : [...prev, value],
      ),
    [],
  );

  return { keywords, toggle, reset: () => setKeywords(initial) };
};
