export type Theme = "dark" | "light";
export type Lang = "en" | "uz" | "ru";

export type SettingsStateType = {
  theme: Theme;
  lang: Lang;
};

export type UpdateState = {
  theme?: Theme;
  lang?: Lang;
};

export type SettingsContextType = {
  theme: Theme;
  lang: Lang;
  changeMode: (theme: Theme) => void;
  updateData: (data: UpdateState) => void;
};
