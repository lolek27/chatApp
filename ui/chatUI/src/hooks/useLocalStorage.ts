import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  defaultValue?: T | undefined | (() => T | undefined),
  storage?: Storage
) {
  const storageObject = storage || localStorage;
  const [value, setValue] = useState<T | undefined>(() => {
    const value = storageObject.getItem(key);
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
      storageObject.removeItem(key);
    } else {
      storageObject.setItem(key, JSON.stringify(value));
    }
  }, [key, value, storageObject]);

  return [value, setValue] as [T | undefined, typeof setValue];
}
