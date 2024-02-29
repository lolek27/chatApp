import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue?: T | undefined | (() => T | undefined)
) {
  const [value, setValue] = useState<T | undefined>(() => {
    const value = localStorage.getItem(key);
    if (!value) {
      let initValue;
      if (typeof defaultValue === "function") {
        initValue = (defaultValue as () => T | undefined)();
      } else {
        initValue = defaultValue;
      }
      return initValue;
    }
    return JSON.parse(value);
  });

  useEffect(() => {
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as [T | undefined, typeof setValue];
}
