import { useState, useEffect } from "react";

type SetState<T> = (value: T | ((prevState: T) => T)) => void;
type UsePersistedStateResult<T> = [T, SetState<T>];

export default function usePersistedState<T>(
  key: string,
  defaultValue: T
): UsePersistedStateResult<T> {
  const storedValue = localStorage.getItem(key);

  const validDefaultValue =
    storedValue !== "undefined" && storedValue !== null
      ? JSON.parse(storedValue as string)
      : defaultValue;

  const [state, setState] = useState<T>(validDefaultValue);

  // useEffect(() => {
  //   const storedValue = localStorage.getItem(key);

  //   if (storedValue !== "undefined" && storedValue !== null) {
  //     setState(JSON.parse(storedValue));
  //   }
  // }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
