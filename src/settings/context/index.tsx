import { createContext, useCallback, useEffect, useState } from "react";
import { useMemo } from "react";
import { SettingsContextType, SettingsStateType, Theme, UpdateState } from "../types";
import { storageKey } from "src/config-global";

export const SettingsContext = createContext({} as SettingsContextType);

const initialState: SettingsStateType = {
  theme: "dark",
  lang: "en",
};

type Props = {
  children: React.ReactNode;
};

export function SettingsProvider({ children }: Props) {
  const [state, setState] = useState<SettingsStateType>(initialState);

  useEffect(() => {
    const storedState = localStorage.getItem(storageKey.SETTINGS);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      if (parsedState.theme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");

      setState(parsedState);
    }
  }, []);

  const setStorage = useCallback((data: SettingsStateType) => {
    localStorage.setItem(storageKey.SETTINGS, JSON.stringify(data));
  }, []);

  // updateData
  const updateData = useCallback(
    (data: UpdateState) => {
      setState((s) => {
        const newState = { ...s, ...data };
        setStorage(newState);
        return newState;
      });
    },
    [setStorage]
  );

  const changeMode = useCallback(
    (theme: Theme) => {
      setState((s) => {
        if (theme === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
        const newState = { ...s, theme };
        setStorage(newState);
        return newState;
      });
    },
    [setStorage]
  );

  const memoizedValue: SettingsContextType = useMemo(
    () => ({
      theme: state.theme,
      lang: state.lang,
      updateData,
      changeMode,
    }),
    [state.theme, state.lang, updateData, changeMode]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}
