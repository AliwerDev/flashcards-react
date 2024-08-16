import { paths } from "./routes/paths";

// API
export const HOST_API = import.meta.env.VITE_HOST_API;
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
export const TG_BOT_USERNAME = import.meta.env.VITE_TG_BOT_USERNAME;

export const storageKey = {
  SETTINGS: import.meta.env.SETTIGNS_STORAGE_KEY || "settings",
  TOKEN: import.meta.env.TOKEN_STORAGE_KEY || "accessToken",
  CATEGORIES: "categories",
  LAST_PATH: "lastpath",
};

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root;
